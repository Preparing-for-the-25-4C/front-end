import {createRouter,createWebHistory} from 'vue-router'
import homepage from '@/components/homepage.vue'
import questionbank from '@/components/questionbank.vue'
import testingrecord from '@/components/testingrecord.vue'
import rank from '@/components/rank.vue'
import register from '@/components/register.vue'
import login from '@/components/login.vue'
import forgetpwd from '@/components/forgetpwd.vue'
import program from '@/components/program.vue'
import settings from '@/components/settings.vue'
const router=createRouter({
    history:createWebHistory(),
    routes:[
        {
            path:'/',
            component:homepage,
        },
        {
            path:'/questionbank',
            component:questionbank,
        },
        {
            path:'/testingrecord',
            component:testingrecord
        },
        {
            path:'/rank',
            component:rank
        },
        {
            path:'/register',
            component:register
        },
        {
            path:'/login',
            component:login
        },
        {
            path:'/forgetpwd',
            component:forgetpwd
        },
        {
            path:'/program',
            component:program,
            props:(route)=>({query:route.query})
        },
        {
            path:'/settings',
            component:settings
        }
    ]
})
export default router