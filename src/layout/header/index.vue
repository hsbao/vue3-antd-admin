<script setup>
import { useRouter, useRoute } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { Layout, Modal, Dropdown, Menu, Space, Avatar, Breadcrumb } from 'ant-design-vue'

import ProjectSetting from './components/setting/index.vue'

import { useUserStore } from '@/store/modules/user'
import { useKeepAliveStore } from '@/store/modules/keepAlive'
import { useThemeStore } from '@/store/modules/projectConfig'

defineProps({
  collapsed: {
    type: Boolean,
  },
  theme: {
    type: String,
  },
})

const emit = defineEmits(['update:collapsed'])

const userStore = useUserStore()
const themeStore = useThemeStore()
const keepAliveStore = useKeepAliveStore()

const router = useRouter()
const route = useRoute()
const userInfo = computed(() => userStore.userInfo)

const headerStyle = computed(() => {
  const { navTheme, layout } = themeStore
  const isDark = navTheme === 'dark' && layout === 'topmenu'
  return {
    backgroundColor: navTheme === 'realDark' || isDark ? '' : 'rgba(255, 255, 255, 0.85)',
    color: isDark ? 'rgba(255, 255, 255, 0.85)' : '#000000d9',
  }
})

const menus = computed(() => {
  if (route.meta?.namePath) {
    let children = userStore.menus
    const paths = route.meta?.namePath?.map((item) => {
      const a = children.find((n) => n.name === item)
      children = a?.children || []
      return a
    })
    return [
      {
        name: '__index',
        meta: {
          title: '云海吾乡',
        },
        children: userStore.menus,
      },
      ...paths,
    ]
  }
  return route.matched
})

const getSelectKeys = (rotueIndex) => {
  return [menus.value[rotueIndex + 1]?.name]
}

const findLastChild = (route) => {
  if (typeof route?.redirect === 'object') {
    const redirectValues = Object.values(route.redirect)
    if (route?.children?.length) {
      const target = route.children.find((n) =>
        redirectValues.some((m) => [n.name, n.path, n.meta?.fullPath].some((v) => v === m))
      )
      return findLastChild(target)
    }
    return redirectValues.find((n) => typeof n === 'string')
  } else if (typeof route?.redirect === 'string') {
    if (route?.children?.length) {
      const target = route.children.find((n) =>
        [n.name, n.path, n.meta?.fullPath].some((m) => m === route?.redirect)
      )
      return findLastChild(target)
    }
    return route?.redirect
  }
  return route
}
const getRouteByName = (name) => router.getRoutes().find((n) => n.name === name)

// 点击菜单
const clickMenuItem = (menuItem) => {
  const lastChild = findLastChild(menuItem)
  console.log('lastChild', menuItem, lastChild)

  const targetRoute = getRouteByName(lastChild?.name)
  const { isExt, openMode } = targetRoute?.meta || {}
  if (isExt && openMode !== 2) {
    window.open(lastChild?.name)
  } else {
    router.push({ name: lastChild?.name })
  }
}

// 退出登录
const doLogout = () => {
  Modal.confirm({
    title: '您确定要退出登录吗？',
    centered: true,
    onOk: async () => {
      console.log(123123123123)
    },
  })
}
</script>

<template>
  <Layout.Header :style="headerStyle" class="layout-header">
    <!-- 左侧 -->
    <Space :size="20">
      <slot>
        <Space :size="20">
          <span class="menu-fold" @click="() => emit('update:collapsed', !collapsed)">
            <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
          </span>
        </Space>

        <!-- 导航面包屑 -->
        <Breadcrumb>
          <template v-for="(routeItem, rotueIndex) in menus" :key="routeItem?.name">
            <Breadcrumb.Item>
              <span>{{ routeItem?.meta?.title }}</span>
              <template v-if="routeItem?.children?.length" #overlay>
                <Menu :selected-keys="getSelectKeys(rotueIndex)">
                  <template v-for="childItem in routeItem?.children" :key="childItem.name">
                    <Menu.Item
                      v-if="!childItem.meta?.hideInMenu && !childItem.meta?.hideInBreadcrumb"
                      :key="childItem.name"
                      @click="clickMenuItem(childItem)"
                    >
                      {{ childItem.meta?.title }}
                    </Menu.Item>
                  </template>
                </Menu>
              </template>
            </Breadcrumb.Item>
          </template>
        </Breadcrumb>
      </slot>
    </Space>

    <!-- 右侧 -->
    <Space :size="20">
      <Dropdown placement="bottomRight">
        <Avatar :src="userInfo.headImg" :alt="userInfo.name">{{ userInfo.name }}</Avatar>
        <template #overlay>
          <Menu>
            <Menu.Item @click="$router.push({ name: 'account-about' })"> 关于 </Menu.Item>
            <Menu.Item @click="$router.push({ name: 'account-settings' })"> 设置 </Menu.Item>
            <Menu.Divider />
            <Menu.Item>
              <div @click.prevent="doLogout">
                <poweroff-outlined />
                退出登录
              </div>
            </Menu.Item>
          </Menu>
        </template>
      </Dropdown>

      <ProjectSetting />
    </Space>
  </Layout.Header>
</template>

<style lang="less" scoped>
.layout-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  height: @header-height;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;

  * {
    cursor: pointer;
  }
}
</style>
