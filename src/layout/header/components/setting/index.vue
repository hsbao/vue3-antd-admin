<template>
  <SettingOutlined @click="showDrawer" />
  <Drawer v-model:visible="visible" placement="right" :closable="false">
    <Descriptions title="整体风格" :column="5">
      <Descriptions.Item v-for="theme in themeStyle" :key="theme.value">
        <Tooltip :title="theme.label">
          <div
            class="style-checbox-item"
            :class="{ active: themeStore.navTheme === theme.value }"
            @click="setNavTheme(theme.value)"
          >
            <svg-icon :name="theme.value" size="50"></svg-icon>
          </div>
        </Tooltip>
      </Descriptions.Item>
    </Descriptions>
    <Descriptions title="主题色" :column="9">
      <Descriptions.Item v-for="item in themeColors" :key="item.key">
        <div class="style-checbox-item">
          <Tooltip :title="item.title">
            <Tag :color="item.value" @click="setThemeColor({ primaryColor: item.value })">
              <span :style="{ visibility: getThemeColorVisible(item.value) }"> ✔ </span>
            </Tag>
          </Tooltip>
        </div>
      </Descriptions.Item>
    </Descriptions>
  </Drawer>
</template>

<script setup>
import { ref } from 'vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { Drawer, Descriptions, Tag, Tooltip } from 'ant-design-vue'
import { themeColors, themeStyle } from './constant'
import { useThemeStore } from '@/store/modules/projectConfig'

defineOptions({
  name: 'ProjectSetting',
})

const themeStore = useThemeStore()
const visible = ref(false)

const setNavTheme = (theme) => {
  themeStore.setTheme({ navTheme: theme })
}

const setThemeColor = ({ primaryColor }) => {
  themeStore.fillColor({ primaryColor })
}

const getThemeColorVisible = (color) => {
  console.log(themeStore.primaryColor, color, themeStore.primaryColor === color)
  return themeStore.primaryColor === color ? 'visible' : 'hidden'
}

// const getImageUrl = (theme: ThemeName) => {
//   return new URL(`/src/assets/icons/${theme}.svg`, import.meta.url).href;
// };

const showDrawer = () => {
  visible.value = true
}
</script>

<style lang="less" scoped>
.style-checbox-item {
  position: relative;
  cursor: pointer;

  &.active:after {
    content: '✔';
    position: absolute;
    bottom: 10px;
    right: 12px;
    color: @primary-color;
  }
}

input[type='color'] {
  width: 40px;
  height: 40px;
  border: 0;
  padding: 0;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-color-swatch-wrapper {
    background: var(--custom-color);
  }

  &::-webkit-color-swatch {
    display: none;
  }
}
</style>
