
import md5 from 'md5';
import { isObject } from 'lodash';
import store from '@/store';
import config from '@/config';
/**
 *  格式化请求验签参数
 * @param { String/Array } mt 接口名称
 * @param { Object/Array } data 参数对象
 * @return { Object } result 组装好的结果
 */
export const formatRequestParams = (params, csrfToken) => {
  const { mt, data = {}, _gitCommitTime = '', _domPermissionStr = '' } = params;
  const _aid = config.appId;
  const _ts = Number(new Date());
  const _sm = 'md5';
  const isArray = Array.isArray(mt);
  const mtArr = isArray ? mt : [mt];
  const _mt = isArray ? mt.join(',') : mt;
  const checkData = isArray ? data : [data];
  let signature = 'yitshenghuoguan.xyz!';

  // 全局获取验证参数
  for (let i = 0; i < mtArr.length; i++) {
    const item = mtArr[i];
    // 判断是否有依赖，目前只支持一层依赖
    const localItem = item.indexOf(':') > -1 ? item.substring(0, item.indexOf(':')) : item;
    const apiMapObj = window._APIMAP[localItem];
    if (!apiMapObj) {
      console.error([
        '缺少配置文件src/assets/file/' + localItem + '.js',
        '请找接口相关人员获取，然后在你的代码顶部添加',
        "import '@/assets/file/" + localItem + "';"
      ].join('\n'));
      return false;
    }

    // 必选参数
    const requiredParams = apiMapObj.required;
    const curData = checkData[i];

    // 验证必填字段
    for (let key in requiredParams) {
      if (!curData.hasOwnProperty(key)) {
        console.error([
          '接口 ' + _mt + ' 缺少必填字段 ' + key,
        ].join('\n'));
        return false;
      }
    }

    if (apiMapObj.security_type !== 'Anonym') {
      if (csrfToken) {
        signature = csrfToken;
      }
    }
  }

  // 组装参数对象
  let result = { _aid, _mt, _sm, _ts, _gitCommitTime, _domPermissionStr };
  const formatReqData = {};
  if (isArray) {
    checkData.forEach((item, i) => {
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          formatReqData[i + '_' + key] = item[key];
        }
      }
    });
    result = Object.assign({}, result, formatReqData);
  } else {
    result = Object.assign({}, result, data);
  }

  // 添加验证_sig
  const signaArr = [];
  for (let key in result) {
    if (result.hasOwnProperty(key)) {
      if (isObject(result[key]) || Array.isArray(result[key])) {
        result[key] = JSON.stringify(result[key]);
      }
      signaArr.push(key + '=' + result[key]);
    }
  }

  const _sig = signaArr.sort().join('') + signature;
  result._sig = md5(_sig);
  return result;
};

/**
 * 格式化返回响应数据
 * @param { Object } data 正常返回的数据
 * @return { Object } result 格式化后的数据
 */
export const formatResponseData = (data) => {
  const result = [];
  const { content, stat } = data;
  const stateArr = stat.stateList;

  stateArr.forEach((item, i) => {
    result[i] = {
      state: item,
      data: content[i]
    };
  });
  return result;
};

// 格式化权限数据对象To数组
export const formatPermissionObject2Array = (arrObj) => {
  const arrKey = [];
  const arrStr = [];
  if (arrObj && arrObj.length) {
    arrObj.forEach((item, i) => {
      arrKey[i] = item.menuKey;
      arrStr[i] = item.menuDesc;
    });
    return {
      key: arrKey,
      str: arrStr
    };
  }
  return arrObj;
};

/**
 * 通过permissionList判断是否与当前用户权限匹配
 * @param {Array}  permissionList 权限数组列表
 * @param {Object} route 当前路由
 */
export function hasPermission(permissionList, route) {
  if (route.meta && route.meta.permission) {
    return permissionList.some(item => item === route.meta.permission);
  } else {
    return true;
  }
}

// 获取当前url下的权限上报key
export const getUrlPermissionKey = () => {
  let location = store.getters.location;
  let urlPermissionStr = '';
  if (location) {
    location = JSON.parse(location);
    urlPermissionStr = location.meta && location.meta.permission;
  }
  return urlPermissionStr;
};

// 获取当前的开发环境
export const getCurrentEnv = () => {
  const url = window.location.href;
  const matchArr = url.match(/-(\w+)(\.)/);
  const env = matchArr && matchArr.length > 1 ? '-' + matchArr[1] : '';
  return env;
};

// 跳转到sso权限管理系统
export const handleJump2SsoSystem = () => {
  const url = window.location.href;
  const env = getCurrentEnv();
  if (url.indexOf('localhost') > -1) {
    window.location.href = `//sso-${config.devEnv}.yit.com/login.html`;
  } else {
    window.location.href = `//sso${env}.yit.com/login.html`;
  }
};
