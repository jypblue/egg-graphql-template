import { syncRoutesMap, asyncRoutesMap } from '@/router';
import { cloneDeep } from 'lodash';
import {
  hasPermission
} from '@/utils';

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRoutesMap
 * @param permissionList
 */
function filterAsyncRouter(asyncRoutesMap, permissionList) {
  const accessedRouters = asyncRoutesMap.filter(route => {
    if (hasPermission(permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permissionList);
        if (route.children.length === 0) {
          return false;
        }
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

export default {
  state: {
    routers: syncRoutesMap,
    addRouters: [],
    permissionList: []
  },
  mutations: {
    // 设置权限字符串List
    SET_PERMISSION: (state, permissionList) => {
      state.permissionList = permissionList;
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = syncRoutesMap.concat(routers);
    }
  },
  actions: {
    // 设置权限接口
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        let accessedRouters = [];
        const { permissionList } = data;
        if (permissionList) {
          // 深拷贝路由原数组进行处理
          const cloneRoutes = cloneDeep(asyncRoutesMap);
          accessedRouters = filterAsyncRouter(cloneRoutes, permissionList);
        } else {
          accessedRouters = asyncRoutesMap;
        }
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    },
  }
};

