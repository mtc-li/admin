import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Users from '@/components/users/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import Categories from '@/components/products/Categories'


Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题


let router = new Router({
    routes: [{
            path: '/',
            redirect: 'Login'
        },
        {
            path: '/Login',
            name: 'login',
            component: Login
        },
        {
            path: '/Home',
            name: 'home',
            component: Home,
            children: [{
                    path: '/users',
                    name: 'users',
                    component: Users
                },
                {
                    path: '/rights',
                    name: 'rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    name: 'roles',
                    component: Roles
                },
                {
                    path: '/categories',
                    name: 'categories',
                    component: Categories
                }
            ]
        }

    ]
})

//to 要到哪儿去
//from :从哪儿来
//next()放行   nest('/login')去登录页
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token')
    if (to.path === '/login' || token) {
        next()
    } else {
        next('/login')
    }
})

export default router