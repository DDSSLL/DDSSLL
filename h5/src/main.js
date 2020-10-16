import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App.vue'
import router from './router'
import VueI18n from 'vue-i18n'
import VueCordova from 'vue-cordova'
import Config from './config'
import axios from 'axios'
import store from './store'
import qs from 'qs'
import moment from 'moment'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(MintUI)
Vue.use(VueI18n)
Vue.use(VueCordova)

axios.defaults.baseURL = ""
Vue.prototype.$Config = Config
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs
Vue.prototype.$moment = moment
Vue.config.productionTip = false

//i18n
const sysLan = window.navigator.language.split('-')[0];
const i18n = new VueI18n({
    locale: sysLan,
    messages:{
        'zh': require('./assets/locale/zh.js'),
        'en': require('./assets/locale/en.js')
    }
})

// REM Response Type
const W = document.documentElement.clientWidth;
const Ratio = (100/375)*W;
const html = document.querySelector('html');
html.style.fontSize = Ratio + 'px';

new Vue({
    render: h => h(App),
    router,
    i18n,
    store
}).$mount('#app')
