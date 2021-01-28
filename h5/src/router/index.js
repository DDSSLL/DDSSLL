import Vue from 'vue'
import Router from 'vue-router'
import Ad from '@/components/common/Ad'
import Wifi from '@/components/common/Wifi'
//DV1080 VUE
import Login from '@/components/DV1080/common/Login'
import Status from '@/components/DV1080/status/Status'
import Control from '@/components/DV1080/control/Control'
import Live from '@/components/DV1080/live/Live'
import Settings from '@/components/DV1080/settings/Settings'
import Me from '@/components/DV1080/me/Me'
//DV4000 VUE
import DV4000Login from '@/components/DV4000/common/Login'
import DV4000Status from '@/components/DV4000/status/Status'
import DV4000Control from '@/components/DV4000/control/Control'
import DV4000Live from '@/components/DV4000/live/Live'
import DV4000Settings from '@/components/DV4000/settings/Settings'
import DV4000Me from '@/components/DV4000/me/Me'

//解决(in promise) NavigationDuplicated: Avoided redundant navigation问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

//以下是页面跳转配置，meta中为当前页参数设置
//keepAlive定义了页面是否缓存在内存，为true时页面缓存并遵循vue缓存页面的生命周期函数
export default new Router({
    routes: [
        /*{
            path: '/',
            redirect: { name: 'Ad' }
        },*/
        {
            path: '/',
            redirect: { name: 'Login' }
        },
        {
            path: '/ad',
            name: 'Ad',
            component: Ad,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                keepAlive: false
            }
        },
        //------------DV1080路由-----------
        {
            path: '/wifi',
            name: 'Wifi',
            component: Wifi,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/status',
            name: 'Status',
            component: Status,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/control',
            name: 'Control',
            component: Control,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/live',
            name: 'Live',
            component: Live,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/settings',
            name: "Settings",
            component: Settings,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/me',
            name: "Me",
            component: Me,
            meta: {
                keepAlive: false
            }
        },
        //------------DV4000路由-----------
        {
            path: '/dv4000login',
            name: 'DV4000Login',
            component: DV4000Login,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/dv4000status',
            name: 'DV4000Status',
            component: DV4000Status,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/dv4000me',
            name: "DV4000Me",
            component: DV4000Me,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/dv4000control',
            name: 'DV4000Control',
            component: DV4000Control,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/dv4000live',
            name: 'DV4000Live',
            component: DV4000Live,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/dv4000settings',
            name: "DV4000Settings",
            component: DV4000Settings,
            meta: {
                keepAlive: false
            }
        }
    ]
})