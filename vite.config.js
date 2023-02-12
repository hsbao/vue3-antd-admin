import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import Unocss from 'unocss/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'

// eslint-disable-next-line no-undef
const CWD = process.cwd()

const VITE_DROP_CONSOLE = false

// https://vitejs.dev/config/
export default ({ mode }) => {
  // 环境变量
  const env = loadEnv(mode, CWD)

  return defineConfig({
    plugins: [
      vue(),
      Unocss(),
      DefineOptions(),
      vueJsx(),
      legacy({
        targets: ['defaults', 'not IE 11', 'chrome 79', 'maintained node versions'],
        // 根据需要导入相应的polyfill:  https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#polyfill-specifiers
        modernPolyfills: ['es.promise.finally'],
      }),
      AutoImport({
        // 在组件中不用再导入ref，reactive等
        imports: ['vue', 'vue-router'],
        dts: './auto-import.d.ts',
        // ant-design-vue按需自动引入
        resolvers: [AntDesignVueResolver()],
      }),
      {
        ...Components({
          resolvers: [AntDesignVueResolver({ importStyle: true, resolveIcons: true })],
        }),
      },
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(CWD, 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'svg-icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
          math: 'always',
          additionalData: `
            @import "ant-design-vue/lib/style/themes/default.less";
            @import "@/styles/variables.less";
            @import "@/styles/themeMixin.less";
          `,
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        'lodash-es',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      supported: {
        // https://esbuild.github.io/api/#supported
        'top-level-await': true,
      },
    },
    build: {
      target: 'es2015',
      minify: 'esbuild',
      cssTarget: 'chrome79',
      chunkSizeWarningLimit: 1024,
      emptyOutDir: true,
    },
  })
}
