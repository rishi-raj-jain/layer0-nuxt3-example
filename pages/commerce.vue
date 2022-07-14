<template>
  <div v-if="data" class="flex-col items-center justify-start">
    <div class="mb-5 flex w-full flex-row items-start px-5">
      <div class="hidden w-[15%] pt-5 md:block">
        <LeftSideBar />
      </div>
      <div class="flex w-full flex-col items-start pt-5 md:w-[70%]">
        <h2 class="text-[#FFFFFF75]">Showing {{ data.length }} Results</h2>
        <div class="mt-5 flex flex-row flex-wrap items-start">
          <NuxtLink
            :key="item.path"
            v-for="item in data"
            :to="`/product/${item.path.replace(/\//g, '')}`"
            class="relative mt-2 w-full border border-white p-1 sm:w-1/2 md:w-1/3"
          >
            <prefetch :url="`/l0-api/products/${item.path.replace(/\//g, '')}`"><span class="h-0 w-0"></span></prefetch>
            <div class="absolute top-0 left-0 z-10 flex flex-col items-start">
              <h3 class="bg-white py-2 px-4 text-xl font-medium text-black">{{ item.name }}</h3>
              <h4 class="text-md bg-white py-2 px-4 text-black">{{ item.prices.price.value }} {{ item.prices.price.currencyCode }}</h4>
            </div>
            <HeartIcon className="absolute top-0 right-0 h-[30px] w-[30px] bg-white p-2" />
            <img width="1200" height="1200" loading="lazy" :src="relativizeURL(item.images[0].url)" />
          </NuxtLink>
        </div>
      </div>
      <div class="hidden w-[15%] pt-5 md:block">
        <RightSideBar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { relativizeURL } from '@/lib/helper'

let fetchBaseLink = undefined
const hostHeader = useRequestHeaders(['host'])
if (typeof window !== 'undefined') {
  fetchBaseLink = window.location.origin
}
// If on server side (either on Layer0 or on local)
else {
  let hostURL = hostHeader.host || process.env.API_URL
  // Caution: Use process.env.API_URL to get benefits on speeding up responses with Layer0 Caching
  // In case the APIs to be fetched is not cached with Layer0 as per routes.ts, it might run into upstream timeouts
  // You have access to req.headers.host when running npm run dev (or 0 dev)
  // You have access to process.env.API_URL on Layer0 env after deployment, regardless of if req header is present
  // This speeds up responses of the API when cached
  if (hostURL) {
    hostURL = hostURL.replace('http://', '')
    hostURL = hostURL.replace('https://', '')
    if (hostURL.includes('localhost:')) {
      fetchBaseLink = `http://${hostURL}`
    } else {
      fetchBaseLink = `https://${hostURL}`
    }
  }
}
fetchBaseLink = `${fetchBaseLink}/l0-api/products/all`
const { data } = await useFetch(fetchBaseLink)
</script>
