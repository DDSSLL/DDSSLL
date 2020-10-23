import Vue from 'vue'
import Router from 'vue-router'
import Ad from '@/components/common/Ad'
import Login from '@/components/common/Login'
import Status from '@/components/status/Status'
import Control from '@/components/control/Control'
import Live from '@/components/live/Live'
import Settings from '@/components/settings/Settings'
import Me from '@/components/me/Me'

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
        }
    ]
})