import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
//全量引入element-ui
import ElementUI from 'element-ui';
import { Notification } from 'element-ui';
Vue.use(ElementUI);
//加解密
import Rsa from "@/utils/rsa.js"
Vue.prototype.$Rsa = Rsa

//http请求
import API from "@/utils/request.js";
Vue.prototype.$API = API

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App),
});

// 环境的切换
var baseWebsocketUrl = "";
if (process.env.NODE_ENV == 'development') {
  baseWebsocketUrl = 'ws://127.0.0.1:8000/vueboot/websocket/';
} else if (process.env.NODE_ENV == 'production') {
  baseWebsocketUrl = 'ws://127.0.0.1:9000/vueboot/websocket/';
}

//WebSocket 配置
const socketUrl = baseWebsocketUrl + JSON.parse(sessionStorage.getItem("userInfo")).id;
var wbsocket = new WebSocket(socketUrl);

//心跳检测
var heartCheck = {
  failCount: 0,
  timeout: 15000,        //15秒发一次心跳
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    var self = this;
    this.timeoutObj = setInterval(function () {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      // console.log('ping')
      if (wbsocket.readyState == wbsocket.OPEN) {
        wbsocket.send("1");
      } else {
        self.failCount++;
      }
      // console.log("失败次数", self.failCount)
      if (self.failCount > 3) {
        wbsocket = new WebSocket(socketUrl);
        self.failCount = 0;
      }
      // self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
      //   wbsocket.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      // }, self.timeout)
    }, this.timeout)
  }
}


// 监听socket打开
wbsocket.onopen = function () {
  //心跳
  // heartCheck.reset().start();
  console.log("浏览器WebSocket已打开");
};
// 监听socket消息接收
wbsocket.onmessage = function (msg) {
  // console.log("接受到的数据", msg);
  // 转换为json对象
  const data = JSON.parse(msg.data);
  Notification({
    title: "新消息",
    message: data.key,
    type: "success",
    duration: 3000
  });
};
// 监听socket错误
wbsocket.onerror = function (e) {
  console.log('111111', e)
  Notification({
    title: "错误",
    message: "服务器错误，无法接收实时报警信息",
    type: "error",
    duration: 5000,
  });
};
// 监听socket关闭
wbsocket.onclose = function () {
  console.log("WebSocket已关闭");
};


