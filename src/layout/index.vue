<script setup>
import { Layout } from 'ant-design-vue'
import Logo from './logo/index.vue'
import AsideMenu from './menu/menu.vue'
import PageHeader from './header/index.vue'
import TabsView from './tabsView/index.vue'
import { useThemeStore } from '@/store/modules/projectConfig'

const collapsed = ref(false)

const themeStore = useThemeStore()

// 自定义侧边栏菜单收缩和展开时的宽度
const asiderWidth = computed(() => (collapsed.value ? 80 : 220))
const getTheme = computed(() => (themeStore.navTheme === 'light' ? 'light' : 'dark'))
</script>

<template>
  <Layout class="layout">
    <!-- 左侧 -->
    <Layout.Sider
      v-if="themeStore.layout === 'sidemenu'"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
      :theme="getTheme"
      class="layout-sider"
    >
      <Logo :collapsed="collapsed" />
      <AsideMenu :collapsed="collapsed" :theme="getTheme" />
    </Layout.Sider>

    <Layout>
      <PageHeader v-model:collapsed="collapsed" :theme="getTheme">
        <template v-if="themeStore.layout === 'topmenu'" #default>
          <Logo :collapsed="collapsed" />
          <AsideMenu :collapsed="collapsed" :theme="getTheme" />
        </template>
      </PageHeader>
      <Layout.Content class="layout-content">
        <tabs-view />
      </Layout.Content>
    </Layout>
  </Layout>
</template>

<style lang="less" scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .ant-layout {
    overflow: hidden;
    background: #f0f2f5;
  }

  .layout-content {
    flex: none;
  }
}
</style>
