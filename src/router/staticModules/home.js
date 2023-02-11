import RouterView from '@/layout/routerView/index.vue'

const moduleName = 'home'

const routes = [
  {
    path: '/home',
    name: moduleName,
    component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
    meta: {
      title: '主页',
      icon: 'icon-shouye',
    },
  },
]

export default routes
