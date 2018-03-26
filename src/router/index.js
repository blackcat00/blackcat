import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import login from '@/components/login/login'

import home from '@/components/home/home'

import user from '@/components/user/user'
import group from '@/components/group/group'
import drive from '@/components/drive/drive'
import hear from '@/components/hear/hear'
import admin from '@/components/admin/admin'
import boss from '@/components/boss/boss'

export default new Router({
  routes: [
    {
      path: '/',
      component: home,
      redirect: '/user',
    }, {
    	path: '/',
    	component: home,
    	children: [
    		{path: 'user', component: user},
    		{path: 'group', component: group},
    		{path: 'drive', component: drive},
    		{path: 'hear', component: hear},
    		{path: 'admin', component: admin},
    		{path: 'boss', component: boss}
    	]
    }, {
    	path: '/login',
    	component: login
    }
  ]
})
