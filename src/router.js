import Vue from 'vue'
import Router from 'vue-router'
import Login from './pages/login.vue'
import Admin from './pages/main.vue'
import Videos from './pages/videos.vue'
import Categories from './pages/categories.vue'
import Users from './pages/users.vue'

Vue.use(Router)

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            meta: {
                requireAuth: true
            },
            component: Admin,
            children: [
                {
                    path: 'videos',
                    component: Videos
                },
                {
                    path: 'categories',
                    component: Categories
                },
                {
                    path: 'users',
                    component: Users
                }
            ]
        },
        {
            path: '/login',
            meta: {
                requireAuth: false
            },
            component: Login
        }
    ]
})

//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
      if (Vue.prototype.getCookie('uid')) {// 判断是否登录
        next()
      } else {// 没登录则跳转到登录界面
        next({
          path: '/login'
        })
      }
    } else {
      next()
    }
  })