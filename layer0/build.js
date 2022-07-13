const esbuild = require('esbuild')
const { join } = require('path')
const { exit } = require('process')
const { DeploymentBuilder } = require('@layer0/core/deploy')

const appDir = process.cwd()
const builder = new DeploymentBuilder(appDir)

module.exports = async function build(options) {
  try {
    // Clear previous Layer0 Output
    builder.clearPreviousBuildOutput()
    // Build the Nuxt 3 project as is
    let command = 'npm run build'
    await builder.exec(command)
    // Store .output/server on the lambda
    builder.addJSAsset(join(appDir, '.output', 'server'))
    // Store .output/public on S3
    builder.addStaticAsset(join(appDir, '.output', 'public'))
    // Create public file routes to be used in routes.js
    command = 'node getPublicPaths.js'
    await builder.exec(command)
    // Compile the service worker
    esbuild.buildSync({
      entryPoints: [`${appDir}/sw/service-worker.js`],
      outfile: `${builder.staticAssetsDir}/.output/public/service-worker.js`,
      minify: true,
      bundle: true,
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.LAYER0_PREFETCH_HEADER_VALUE': '"1"',
        'process.env.LAYER0_PREFETCH_CACHE_NAME': '"prefetch"',
      },
    })
    await builder.build()
  } catch (e) {
    console.log(e)
    exit()
  }
}
