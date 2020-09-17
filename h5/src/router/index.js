import Vue from 'vue'
import Router from 'vue-router'
import Ad from '@/components/common/Ad'
import Login from '@/components/common/Login'
import Main from '@/components/main/HelloWorld'
import Settings from '@/components/settings/Settings'

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
            redirect: { name: 'Main' }
        },
        {
            path: '/ad',
            name: 'Ad',
            component: Ad
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/main',
            name: 'Main',
            component: Main
        },
        {
            path: '/settings',
            name: "Settings",
            component: Settings
        }
    ]
})