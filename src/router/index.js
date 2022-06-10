import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/login/Login'
import HomePage from '@/components/home/home'
import MonitorPage from '@/components/monitor/MonitorPage'
import DeviceMan from '@/components/device/DeviceMan'
import TaskMan from '@/components/task/TaskMan'
import UserMan from '@/components/user/UserMan'
import LogMan from '@/components/log/LogMan'

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
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/homePage',
        name: '首页',
        component: HomePage,
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/monitorPage',
        name: '实时监测',
        component: MonitorPage,
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/deviceMan',
        name: '接收机管理',
        component: DeviceMan,
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/taskMan',
        name: '运行图管理',
        component: TaskMan,
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/userMan',
        name: '用户管理',
        component: UserMan,
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/logMan',
        name: '日志管理',
        component: LogMan,
        meta: {
          keepAlive: false
        }
      },
      //------------DV1080路由-----------
      /*{
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
        path: '/live1080',
        name: 'Live1080',
        component: Live1080,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/live4000',
        name: 'Live4000',
        component: Live4000,
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
      },*/
    ]
})