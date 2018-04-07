import Vue from 'vue'
import App from './App.vue'
import QS from 'qs';
import { router } from './router.js'
import Axios from 'axios'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'material-design-icons/iconfont/material-icons.css'

Axios.defaults.timeout = 5000;
// Axios.defaults.headers.common['Auth-Token'] = "";
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
Axios.defaults.baseURL = 'http://192.168.0.149:8080/video/service/r';

Vue.prototype.$axios = Axios;
Vue.prototype.qs = QS;

//获取cookie、
Vue.prototype.getCookie = function (name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

//设置cookie,增加到vue实例方便全局调用
Vue.prototype.setCookie = function (c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == undefined) ? "" : ";expires=" + exdate.toGMTString());
};

//删除cookie
Vue.prototype.delCookie = function (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = Vue.prototype.getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};

Axios.interceptors.request.use(function (config) {
  config.headers.common['Auth-Token'] = Vue.prototype.getCookie('token');
  return config
}, function (error) {
  return Promise.reject(error);
})

Axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status == 403) {
    location.href = '/login';
  } else {
    console.log(error);
    Vue.prototype.$message.error("服务端异常");
  }
  return Promise.reject(error);
})

// 时间戳转日期+时间格式
Vue.prototype.getTime = function (timestamp) {
  var date = new Date(timestamp);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D + h + m + s;
}

Vue.use(Element)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
