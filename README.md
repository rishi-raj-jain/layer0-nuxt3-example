# Deploy Nuxt3 on Layer0 with Limelight

Layer0 by Limelight is an Edge Compute Platform with over 130 global points of presence. Limelight operates its own private network with more than 70+ terabits per second of global egress capacity. Data is prefetched and streamed into the browser at a 95% cache hit rate by Layer0 before the user requests it.

![Cache hit rate comparison graphic](https://assets-global.website-files.com/5ec129d839c03647b43dbd41/619459e884ec7ae74d923da8_I6iG8tVXinoz29x52oRnHeDYe8WmpuND7AdmwC9-c64qzxJVkN8fpn5Vlogr7W67K-peNtFsLvmBWDWuzlNJ1VnEXM3Iso4ijaf8tXlxd0Mmmk3LrBTLKXUCj_GJASq3WsIbksyJ.jpeg)

In addition to hosting your static assets, Layer0 also includes edge functions with [EdgeJS](https://www.layer0.co/edgejs), a framework agnostic, performant, and declarative JavaScript-based edge configuration language.

## Demo

https://layer0-docs-layer0-nuxt3-example-2-default.layer0-limelight.link

## Try It Now

[![Deploy with Layer0](https://docs.layer0.co/button.svg)](https://app.layer0.co/deploy?repo=https://github.com/layer0-docs/layer0-nuxt3-example)

## Layer0 Configuration

This framework has a connector developed for Layer0.

> See [Connectors](https://docs.layer0.co/guides/connectors) for more information.

### `layer0.config.js`

The `layer0.config.js` configuration file specifies the configuration of the project such as defining the connector. In this case, it is using the connector `@layer0/nuxt3`

> View the  [Nuxt3 Connector Code](https://github.com/layer0-docs/layer0-connectors/tree/main/layer0-nuxt3-connector?button)

```js
// layer0.config.js

module.exports = {
  connector: '@layer0/nuxt3',
}
```

### `routes.js`

```js
// routes.js

import { Router } from '@layer0/core'

export default new Router()
  .get('/_nuxt/:path*', ({ cache, serveStatic }) => {
    cache({
      browser: {
        maxAgeSeconds: 60 * 60 * 24 * 365 * 10,
      },
      edge: {
        maxAgeSeconds: 60 * 60 * 24 * 365 * 10,
      },
    })
    serveStatic('.output/public/_nuxt/:path*')
  })
  .fallback(({ renderWithApp }) => {
    renderWithApp()
  })

```

## Start editing

```vue
<!-- pages/index.vue -->

<template>
  <div class="container mx-auto">
    <Html>
      <Head>
        <Title>Nuxt3 on Layer0</Title>
        <Meta name="description" :content="description" />
      </Head>
    </Html>
    <div>
      This is the example app of Nuxt3 on Layer0
    </div>
  </div>
</template>


<script setup>
const { description } = "Nuxt3 on Layer0";
</script>
```

### Run locally with Layer0

To run the Nuxt3 app locally with Layer0, run:

```terminal
0 dev
```

> `0 dev` starts both the Layer0 and Nuxt dev server on port 3001 and 3000 respectively.

Vist [http://localhost:3001](http://localhost:3001) to view the application.

### Deploy to Layer0

To deploy to Layer0, run:

```bash
0 deploy
```

After the deployment is complete, the terminal will present you with both the URL for the:

1. Layer0 Developer Console, and
2. Website

### Resources
1. [Routing with EdgeJS](https://docs.layer0.co/guides/routing)
2. [Prefetching with EdgeJS](https://docs.layer0.co/guides/prefetching)
3. [Nuxt3 on Layer0 official documentation](https://docs.layer0.co/guides/nuxt3)
