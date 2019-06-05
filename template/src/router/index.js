import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/view/layout';
Vue.use(VueRouter);

const Login = () => import('@/view/login');
const NoPermission = () => import('@/view/error/401');
const NotFound = () => import('@/view/error/404');
const Home = () => import('@/view/home');
// 风险用户管理
import RiskSuspectChildRoutes from './suspect';

// 静态页面路由
export const syncRoutesMap = [
  {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true,
  },
  {
    path: '/401',
    component: NoPermission,
    name: 'NoPermission',
    hidden: true,
  },
  {
    path: '/404',
    component: NotFound,
    name: 'NotFound',
    hidden: true,
  },
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: Home,
      name: 'Home',
      meta: { title: '首页', icon: 'iconfont icon-home' },
    }],
  },
];

// 动态页面路由
export const asyncRoutesMap = [
  {
    path: '/suspect',
    component: Layout,
    name: 'RiskSuspect',
    meta: {
      title: '风险用户管理',
      icon: 'fa fa-navicon',
      permission: 'front-riskcontrol-75'
    },
    children: RiskSuspectChildRoutes
  },

  // 必须路由最后
  { path: '*', redirect: '/404', hidden: true }
];

const Router = new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: syncRoutesMap
});

export default Router;
