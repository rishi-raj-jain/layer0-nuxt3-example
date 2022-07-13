import { publicPaths } from './publicPaths'
import { BACKENDS, Router } from '@layer0/core'
import { isProductionBuild } from '@layer0/core/environment'

const API_CACHE_HANDLER = ({ cache, proxy }) => {
  cache({
    edge: {
      maxAgeSeconds: 60 * 60,
      // Cache responses even if they contain cache-control: private header
      // https://docs.layer0.co/guides/caching#private
      // https://docs.layer0.co/docs/api/core/interfaces/_router_cacheoptions_.edgecacheoptions.html#forceprivatecaching
      forcePrivateCaching: true,
    },
    browser: false,
  })
  proxy('api', { path: ':path*' })
}

const router = new Router()
  .get(
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
  // .prerender(getPathsToPrerender)
  // Serve the old Layer0 predefined routes by the latest prefix
  .match('/__xdn__/:path*', ({ redirect }) => {
    redirect('/__layer0__/:path*', 301)
  })
  // Cache the Layer0 devtools css js and other assets served by L0 by default
  .match('/__layer0__/:path*', ({ cache }) => {
    cache({ edge: { maxAgeSeconds: 60 * 60 * 24 * 365 } })
  })
  // API (Any backend) caching
  .match('/l0-api/:path*', API_CACHE_HANDLER)

if (isProductionBuild()) {
  publicPaths.forEach((i) => {
    router.get(i, ({ cache, serveStatic }) => {
      cache({
        browser: {
          maxAgeSeconds: 0,
          serviceWorkerSeconds: 60 * 60 * 24 * 365,
        },
        edge: {
          maxAgeSeconds: 60 * 60 * 24 * 365,
          forcePrivateCaching: true,
        },
      })
      serveStatic(`.output/public/${i}`)
    })
  })
  router.get('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.output/public/service-worker.js')
  })
  router.fallback(({ renderWithApp }) => {
    renderWithApp()
  })
} else {
  router.fallback(({ proxy }) => {
    proxy(BACKENDS.js)
  })
}

export default router
