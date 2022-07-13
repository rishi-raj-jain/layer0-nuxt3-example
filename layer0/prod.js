module.exports = async function prod(port) {
  process.env.PORT= port
  await import('../.output/server/index.mjs')
}
