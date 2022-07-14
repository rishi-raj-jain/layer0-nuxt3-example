<template>
  <div className="flex flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D] min-h-screen">
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Layer0RUM from './layer0/rum'
import { install } from '@layer0/prefetch/window/index.js'
import installDevtools from '@layer0/devtools/install.js'

onMounted(() => {
  // Monitor real user as it gets mounted
  Layer0RUM('2e2f71ee-47a2-4789-9208-825beee15863')
  // Enable service worker inside the window
  install()
  // Enable devtools manually, instead of relying on defaults by Layer0
  installDevtools()
})
</script>
