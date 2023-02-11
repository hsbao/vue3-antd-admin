<template>
  <icon-font :type="item?.meta?.icon" />
  <span>{{ item?.meta?.title }}</span>
</template>

<script setup>
import { IconFont } from '@/components/iconfont'

defineOptions({
  name: 'MenuItemContent',
})

defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})
</script>
