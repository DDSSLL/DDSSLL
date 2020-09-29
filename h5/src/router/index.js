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

export default new Router({
    routes: [
        {
            path: '/',
            redirect: { name: 'Login' }
        },
        {
            path: '/ad',
            name: 'Ad',
            component: Ad
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/status',
            name: 'Status',
            component: Status
        },
        {
            path: '/control',
            name: 'Control',
            component: Control
        },
        {
            path: '/live',
            name: 'Live',
            component: Live
        },
        {
            path: '/settings',
            name: "Settings",
            component: Settings
        },
        {
            path: '/me',
            name: "Me",
            component: Me
        }
    ]
})