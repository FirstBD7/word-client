const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: ['all'], // 允许所有域名访问，解决Invalid Host header
    // 移除涉及window的配置，改用下面的简单配置
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws' // 自动适配WebSocket协议和地址
    }
  }
})