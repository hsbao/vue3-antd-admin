<template>
  <div class="menu-container" :class="{ 'is-side-menu': isSideMenu }">
    <Menu
      v-model:selected-keys="state.selectedKeys"
      :open-keys="isSideMenu ? state.openKeys : []"
      :mode="isSideMenu ? 'inline' : 'horizontal'"
      :theme="theme"
      :collapsed="props.collapsed"
      collapsible
      @click="clickMenuItem"
    >
      <MenuItem :menus="menus" />
    </Menu>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu } from 'ant-design-vue'
import MenuItem from './menu-item.vue'
import { useUserStore } from '@/store/modules/user'
import { useThemeStore } from '@/store/modules/projectConfig'
import { LOGIN_NAME } from '@/router/constant'

const props = defineProps({
  collapsed: {
    // 侧边栏菜单是否收起
    type: Boolean,
  },
  theme: {
    type: String,
    default: '',
  },
})
const userStore = useUserStore()
const themeStore = useThemeStore()
// 当前路由
const currentRoute = useRoute()
const router = useRouter()
const state = reactive({
  openKeys: [],
  selectedKeys: [currentRoute.name],
})

const menus = computed(() => userStore.menus)
/** 侧边栏布局 */
const isSideMenu = computed(() => themeStore.layout === 'sidemenu')
const getRouteByName = (name) => router.getRoutes().find((n) => n.name === name)
// 根据activeMenu获取指定的menu
const getTargetMenuByActiveMenuName = (activeMenu) => {
  return router.getRoutes().find((n) => [n.name, n.path].includes(activeMenu))
}

// 获取当前打开的子菜单
const getOpenKeys = () => {
  const meta = currentRoute.meta
  if (meta?.activeMenu) {
    const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu)
    return targetMenu?.meta?.namePath ?? [meta?.activeMenu]
  }

  return meta?.hideInMenu
    ? state?.openKeys || []
    : currentRoute.meta?.namePath ?? currentRoute.matched.slice(1).map((n) => n.name)
}

// 监听菜单收缩状态
watch(
  () => props.collapsed,
  (newVal) => {
    state.openKeys = newVal ? [] : getOpenKeys()
    state.selectedKeys = [currentRoute.name]
  }
)

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    if (currentRoute.name === LOGIN_NAME || props.collapsed) return
    state.openKeys = getOpenKeys()
    const meta = currentRoute.meta
    if (meta?.activeMenu) {
      const targetMenu = getTargetMenuByActiveMenuName(meta.activeMenu)
      state.selectedKeys = [targetMenu?.name ?? meta?.activeMenu]
    } else {
      state.selectedKeys = [currentRoute.meta?.activeMenu ?? currentRoute.name]
    }
  },
  {
    immediate: true,
  }
)

// 点击菜单
const clickMenuItem = ({ key }) => {
  if (key === currentRoute.name) return
  const targetRoute = getRouteByName(key)
  const { isExt, openMode } = targetRoute?.meta || {}
  if (isExt && openMode !== 2) {
    window.open(key)
  } else {
    router.push({ name: key })
  }
}
</script>

<style lang="less" scoped>
.menu-container {
  overflow: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  &.is-side-menu {
    height: calc(100vh - 64px);
  }
}
</style>
