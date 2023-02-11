import { LOGIN_NAME } from '@/router/constant'

/**
 * layout布局之外的路由
 */
export const LoginRoute = {
  path: '/login',
  name: LOGIN_NAME,
  component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
  meta: {
    title: '登录',
  },
}

export default [LoginRoute]
