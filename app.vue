<template>
  <div className="flex flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D] min-h-screen">
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script setup>
// import Layer0RUM from './rum'
import { onMounted } from 'vue'
import { install } from '@layer0/prefetch/window/index.js'
import installDevtools from '@layer0/devtools/install.js'

onMounted(() => {
  // Layer0RUM('8016af1c-fb31-45c1-b1e0-312bffabbe93')
  // Enable service worker inside the window
  install()
  // Enable devtools manually, instead of relying on defaults by Layer0
  installDevtools()
})
</script>
