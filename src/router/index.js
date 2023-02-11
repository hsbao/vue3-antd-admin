import 'nprogress/nprogress.css' // 进度条样式
import { createRouter, createWebHistory } from 'vue-router'

import { createRouterGuards } from './router-guards'

import outsideLayout from './outsideLayout'
import { whiteNameList } from './constant'

export const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
    meta: {
      title: '',
    },
    children: [
      {
        path: 'home',
        meta: {
          title: '首页',
          icon: 'icon-shouye',
        },
        component: () => import(/* webpackChunkName: "home-index" */ '@/views/home/index.vue'),
      },
    ],
  },
  // Layout之外的路由
  ...outsideLayout,
]

export const router = createRouter({
  // process.env.BASE_URL
  history: createWebHistory(''),
  routes,
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !whiteNameList.some((n) => n === name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export async function setupRouter(app) {
  // 创建路由守卫
  createRouterGuards(router, whiteNameList)

  app.use(router)

  // 路由准备就绪后挂载APP实例
  await router.isReady()
}
export default router
