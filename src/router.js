import Vue from 'vue'
import Router from 'vue-router'
import Videos from './pages/videos.vue'
import Categories from './pages/categories.vue'
import Users from './pages/users.vue'

Vue.use(Router)

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/videos',
            component: Videos
        },
        {
            path: '/categories',
            component: Categories
        },
        {
            path: '/users',
            component: Users
        }
    ]
})
