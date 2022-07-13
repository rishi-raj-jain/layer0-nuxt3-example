const { createDevServer } = require('@layer0/core/dev')

module.exports = function () {
  return createDevServer({
    label: 'Nuxt 3',
    command: (port) => `PORT=${port} npm run dev`,
    ready: [/listening on/i],
  })
}
