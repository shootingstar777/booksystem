import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/sort',
    name: '分类',
    component: () => import('../views/book/Sort.vue')
  }, 
  {
    path: '/post',
    name: '论坛',
    component: () => import('../views/post/Post.vue')
  },
   {
     path: '/bookDetail/:id',
     name: '书籍详情',
     component: () => import('../views/book/BookDetail.vue')
   },
   {
     path: '/postDetail/:id',
     name: '帖子详情',
     component: () => import('../views/post/PostDetail.vue')
   },
  {
    path: '/404',
    component: () => import('../views/Error.vue')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == from.path) {
    return;
  } else {
    next()
  }

})
export default router