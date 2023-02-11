import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import { setupStore } from '@/store'

import { setupAssets } from '@/plugins'

// import 'ant-design-vue/dist/antd.css'
import 'ant-design-vue/dist/antd.variable.min.css'

const app = createApp(App)

function setupPlugins() {
  // 引入静态资源
  setupAssets()
}

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app)
  // 挂载路由
  await setupRouter(app)

  app.mount('#app')
}

setupPlugins()

setupApp()
