'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // baseWebsocketUrl = '“ws://127.0.0.1:7777/websocket/”',
  // 分布式 网关接口
  baseWebsocketUrl: '"ws://127.0.0.1:7070/app-websocket/websocket/"'
})
