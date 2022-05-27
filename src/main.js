import Vue from 'vue'
import axios from './components/common/axios.init'
//import axios from 'axios'
import qs from 'qs'
//import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router' //引入路由
import store from './store'
import md5 from 'MD5'
import * as echarts from 'echarts'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/style.css'
import common from './components/common/common.js'

Vue.config.productionTip = false;//true:开发模式，false：生产模式
//全局挂载aixos
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs
Vue.prototype.$md5 = md5
Vue.prototype.$common = common
Vue.use(ElementUI);
//Vue.use(VueAxios,axios)
new Vue({
	axios,
	router,  //引入路由
	store: store,
  render: h => h(App),
}).$mount('#app')
