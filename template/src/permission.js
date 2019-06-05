
// 权限管理文件
import router from '@/router';
import store from '@/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {
  formatPermissionObject2Array,
  hasPermission,
} from '@/utils';
NProgress.configure({ showSpinner: false });
const whiteList = ['/login', '/401', '/404'];
// 判断是否刷新页面,如果刷新页面把权限列表转为空，重新判断权限情况
store.commit('SET_PERMISSION', []);
router.beforeEach((to, from, next) => {
  NProgress.start();
  // 编写权限逻辑
  const user = store.getters.user;
  if (user) {
    /* has token */
    // 过期
    const yitUser = JSON.parse(user);
    const permissionArr = yitUser.permissionList || [];
    console.log(permissionArr);
    if (permissionArr.length === 0) {
      store.commit('SET_USER', '');
      next({ path: '/401', replace: true, query: { noGoBack: true }});// 重定向到无权限页面401
      NProgress.done();
      return;
    } else if (to.path === '/login') {
      next();
      NProgress.done();
      return;
    }
    console.log(store.getters.permissionList);
    console.log(to);
    // 如果刷新router的值没有了，则重新回填
    if (store.getters.permissionList.length === 0) {

      // 设置权限字符串列表
      let permissionData = {
        key: [],
        str: []
      };
      if (permissionArr.length) {
        permissionData = formatPermissionObject2Array(permissionArr);
      }

      const permissionList = permissionData.key || [];
      console.log(permissionList);
      store.commit('SET_PERMISSION', permissionList);
      store.dispatch('GenerateRoutes', { permissionList }).then(() => { // 根据permissionList权限生成可访问的路由表
        const addRoutes = store.getters.addRouters;
        router.addRoutes(addRoutes); // 动态添加可访问路由表
        next({ ...to, replace: true });
      }).catch(() => {
        store.dispatch('FedLogOut').then(() => {
          next({ path: '/login' });
        });
      });
    } else {
      // 动态权限
      if (hasPermission(store.getters.permissionList, to)) {
        // 如果没有匹配到的就调首页
        if (to.matched.length === 0) {
          next({ path: '/401', replace: true, query: { noGoBack: true }});
        } else {
          next();
        }
      } else {
        next({ path: '/401', replace: true, query: { noGoBack: true }});
      }
    }

  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
    } else {
      next({ path: '/login' }); // 否则全部重定向到登录页
      NProgress.done();
    }
  }

  // 设置当前URL路径
  store.commit('SET_URL', to);
});

router.onError((error) => {
  console.warn('error:', error);
});

router.afterEach(() => {
  NProgress.done();
});
