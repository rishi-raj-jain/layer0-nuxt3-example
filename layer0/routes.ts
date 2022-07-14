import { publicPaths } from './publicPaths'
import { BACKENDS, Router } from '@layer0/core'
import getPathsToPrerender from './prerenderRequests'
import { isProductionBuild } from '@layer0/core/environment'
import { API_CACHE_HANDLER, STATIC_CACHE_CONFIG, EDGE_CACHE_HANDLER } from './cache'

const router = new Router()

router.get(
  {
    headers: {
      // Regex to catch multiple hostnames
      // Any deployment will have a L0 permalink
      // Don't allow Google bot to crawl it, read more on:
      // https://docs.layer0.co/guides/cookbook#blocking-search-engine-crawlers
      host: /layer0.link|layer0-perma.link/,
    },
  },
  ({ setResponseHeader }) => {
    setResponseHeader('x-robots-tag', 'noindex')
  }
)

// Pre-render the static home page
// By pre-rendering, once the project is deployed
// the set of links are visited to warm the cache
// for future visits (expected to be the first view for real users)
// More on static prerendering: https://docs.layer0.co/guides/static_prerendering
router.prerender(getPathsToPrerender)

// Serve the old Layer0 predefined routes by the latest prefix
router.match('/__xdn__/:path*', ({ redirect }) => {
  redirect('/__layer0__/:path*', 301)
})

// Cache the Layer0 devtools css js and other assets served by L0 by default
router.match('/__layer0__/:path*', EDGE_CACHE_HANDLER)

// API (Any backend) caching
router.match('/l0-api/:path*', API_CACHE_HANDLER)

router.match('/', EDGE_CACHE_HANDLER)
router.match('/about', EDGE_CACHE_HANDLER)
router.match('/commerce', EDGE_CACHE_HANDLER)
router.match('/product/:path', EDGE_CACHE_HANDLER)

// Check if Layer0 is building your app for production
// It's an inbuilt flag to save you from relying
// on process.env.NODE_ENV === 'production'

if (isProductionBuild()) {
  // Serve the computed public paths with a STATIC cache configuration
  publicPaths.forEach((i) => {
    router.get(i, ({ cache, serveStatic }) => {
      cache(STATIC_CACHE_CONFIG)
      serveStatic(`.output/public/${i}`)
    })
  })

  // Injected service worker (in ./build.js for more reference)
  // To be served with the pre-configured serviceWorker method
  router.get('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.output/public/service-worker.js')
  })

  // Every request if not served above,
  // Shall delegrate to process defined to be in serverless
  // See ./prod.js for what happens in the serverless
  router.fallback(({ renderWithApp }) => {
    renderWithApp()
  })
}
// If the app is not in production
else {
  // Proxy every request to process in ./dev.js
  router.fallback(({ proxy }) => {
    proxy(BACKENDS.js)
  })
}

export default router
