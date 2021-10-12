import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
//全量引入element-ui
import ElementUI from 'element-ui';
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



