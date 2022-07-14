const fs = require('fs')

const getPublicRoutes = (publicFolderPath) => {
  const matchingRoutes = []
  // Check if the folder exists
  if (fs.existsSync(publicFolderPath)) {
  } else {
    publicFolderPath = `../../${publicFolderPath}`
  }
  if (fs.existsSync(publicFolderPath)) {
    console.log('Compiling public routes...', publicFolderPath)
    fs.readdirSync(publicFolderPath).forEach((file) => {
      const dirPath = `${publicFolderPath}/${file}`
      if (fs.lstatSync(dirPath).isDirectory()) {
        matchingRoutes.push(`/${file}/:path*`)
      } else {
        matchingRoutes.push(`/${file}`)
      }
    })
  }
  return matchingRoutes
}

fs.writeFile('./layer0/publicPaths.js', `export const publicPaths= ${JSON.stringify(getPublicRoutes('.output/public'))}`, function (err) {
  if (err) {
    console.error('Crap happens')
  }
})
