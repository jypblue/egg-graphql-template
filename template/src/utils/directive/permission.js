import {
  formatPermissionObject2Array
} from '@/utils';
import store from '@/store';
const has = (value, domPermission) => {
  // let isExist = false;
  // console.log('p has', domPermission);
  if (!domPermission.length) {
    console.error('无权限数组数据');
    return false;
  }
  for (let i = 0; i < domPermission.length; i++) {
    if (domPermission[i] === value) {
      return true;
    }
  }
  return false;
};

export const permissionKey = {
  bind(el, binding) {
    const userStr = store.getters.user;
    if (userStr === undefined || userStr === null) {
      console.warn('No PERMISSION STRING');
      return false;
    }
    const permissionList = JSON.parse(userStr).permissionList;
    let permissionData = {
      str: [],
      key: [],
    };
    if (permissionList.length) {
      permissionData = formatPermissionObject2Array(permissionList);
    }
    const domPermission = permissionData['key'];
    if (!has(binding.value, domPermission)) {
      // el.parentNode.removeChild(el);
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      } else {
        el.style.display = 'none';
      }
    }
  },
};

export const permissionStr = {
  bind(el, binding) {
    const userStr = store.getters.user;
    if (userStr === undefined || userStr === null) {
      console.warn('No PERMISSION STRING');
      return false;
    }
    const permissionList = JSON.parse(userStr).permissionList;
    let permissionData = {
      str: [],
      key: [],
    };
    if (permissionList.length) {
      permissionData = formatPermissionObject2Array(permissionList);
    }
    const domPermission = permissionData['str'];
    if (!has(binding.value, domPermission)) {
      // el.parentNode.removeChild(el);
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      } else {
        el.style.display = 'none';
      }
    }
  },
};