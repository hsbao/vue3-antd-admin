import { defineStore } from 'pinia'
import { menus } from '../mockMenu'
import { store } from '@/store'
import { ACCESS_TOKEN_KEY } from '@/constants/cacheEnum'
import { storage } from '@/utils/storage'
import { generatorDynamicRouter } from '@/router/generator-router'
import { resetRouter } from '@/router'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    token: storage.getItem(ACCESS_TOKEN_KEY, null),
    name: 'amdin',
    avatar: '',
    perms: [], // like [ 'sys:user:add', 'sys:user:update' ]
    menus: [],
    userInfo: {},
  }),
  getters: {
    getToken() {
      return this.token
    },
    getAvatar() {
      return this.avatar
    },
    getName() {
      return this.name
    },
    getPerms() {
      return this.perms
    },
  },
  actions: {
    /** 清空token及用户信息 */
    resetToken() {
      this.avatar = this.token = this.name = ''
      this.perms = []
      this.menus = []
      this.userInfo = {}
      storage.clear()
    },
    /** 登录成功保存token */
    setToken(token) {
      this.token = token ?? ''
      const ex = 7 * 24 * 60 * 60 * 1000
      storage.setItem(ACCESS_TOKEN_KEY, this.token, ex)
    },
    /** 登录 */
    async login(params) {
      // try {
      //   const { data } = await login(params)
      //   this.setToken(data.token)
      //   return this.afterLogin()
      // } catch (error) {
      //   return Promise.reject(error)
      // }
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {
      console.log(1)
      try {
        // const [userInfo, { perms, menus }] = await Promise.all([getInfo(), permmenu()])
        const userInfo = {
          name: '路飞',
          nickName: '',
          email: 'qa894178522@qq.com',
          phone: '15622472425',
          remark: null,
          headImg: 'https://buqiyuan.gitee.io/img/logo.jpg',
          loginIp: '183.254.60.232',
        }
        const perms = [
          'sys:user:add',
          'sys:user:delete',
          'sys:menu:add',
          'sys:menu:delete',
          'sys:menu:list',
          'sys:menu:info',
          'sys:menu:update',
          'sys:dept:move',
          'sys:role:delete',
          'sys:role:add',
          'sys:role:update',
          'sys:role:list',
          'sys:role:page',
          'sys:role:info',
          'sys:dept:list',
          'sys:dept:info',
          'sys:user:page',
          'sys:user:info',
          'sys:user:update',
          'sys:dept:transfer',
          'sys:dept:add',
          'sys:dept:delete',
          'sys:dept:update',
          'sys:online:list',
          'sys:online:kick',
          'sys:log:login:page',
          'sys:task:page',
          'sys:task:info',
          'sys:task:add',
          'sys:task:update',
          'sys:task:once',
          'sys:task:start',
          'sys:task:stop',
          'sys:task:delete',
          'sys:log:task:page',
          'sys:user:password',
          'netdisk:manage:list',
          'netdisk:manage:mkdir',
          'netdisk:manage:token',
          'netdisk:manage:rename',
          'netdisk:manage:check',
          'netdisk:manage:download',
          'netdisk:manage:delete',
          'netdisk:manage:info',
          'netdisk:manage:mark',
          'netdisk:manage:copy',
          'netdisk:manage:cut',
        ]
        this.perms = perms
        this.name = userInfo.name
        this.avatar = userInfo.headImg
        this.userInfo = userInfo
        // 生成路由
        const generatorResult = await generatorDynamicRouter(menus)
        console.log(5678, generatorResult)
        this.menus = generatorResult.menus.filter((item) => !item.meta?.hideInMenu)
        return { menus, perms, userInfo }
      } catch (error) {
        return Promise.reject(error)
        // return this.logout();
      }
    },
    /** 登出 */
    async logout() {
      // await logout()
      this.resetToken()
      resetRouter()
    },
  },
})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store)
}
