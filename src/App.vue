<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

watchEffect(() => {
  if (route.meta?.title) {
    // 翻译网页标题
    document.title = route.meta.title
  }
})
</script>

<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="less" scoped></style>
