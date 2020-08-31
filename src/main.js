import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/aaa.css'

import axios from 'axios'

//吧axios放到vue的原型上，将来所有的VUE实例都能用
Vue.prototype.axios = axios
    //给axios设置请求拦截器
axios.interceptors.request.use(
    function(config) {
        config.baseURL = 'http://localhost:8888/api/private/v1/'
        config.headers.Authorization = localStorage.getItem('token')
        return config
    },
    function(error) {
        return Promise.reject(error)
    }
)

//给axios配置默认值
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})