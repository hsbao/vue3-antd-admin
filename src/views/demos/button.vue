<template>
  <div>
    <Alert message="扩展antd按钮样式" type="info" show-icon style="margin-bottom: 12px" />
    <Card>
      <Divider orientation="left">扩展按钮类型</Divider>
      <Space>
        <a-button type="primary">primary</a-button>
        <a-button type="primary" danger>danger</a-button>
        <a-button type="warning">warning</a-button>
        <a-button type="success">success</a-button>
      </Space>
    </Card>
  </div>
</template>

<script setup lang="ts"></script>
