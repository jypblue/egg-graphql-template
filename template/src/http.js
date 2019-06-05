import axios from 'axios';
import qs from 'qs';
import { Loading, Message } from 'element-ui';
import store from '@/store';
import config from '@/config';
import {
  formatRequestParams,
  formatResponseData,
  getUrlPermissionKey,
  handleJump2SsoSystem
} from '@/utils';
import * as ajax from '@/utils/ajax';


// 全局
let requestTimes = 0;
let requestQueue = [];
let loadingIndex = null;

// 工具方法
const util = {
  loading() {
    const index = Loading.service({
      lock: true,
      text: 'loading...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    return index;
  },
  removeQueue(flag) {
    const index = requestQueue.indexOf(flag);
    if (index > -1) {
      requestQueue.splice(index, 1);
    }
  },
  loginTimeOut() {
    Message({
      type: 'warning',
      message: '登录过期, 请重新登录'
    });
    // 手动登出
    store.dispatch('FedLogOut').then(() => {
      window.localStorage.removeItem(config.appKey);
      handleJump2SsoSystem();
    });
  },
  getUserInfo() {
    const user = store.getters.user;
    if (user) {
      return JSON.parse(user);
    } else {
      return {};
    }
  },
  setNewUserToken(newUserToken) {
    let user = this.getUserInfo();
    if (newUserToken) {
      user.token = newUserToken;
      store.commit('SET_USER', user);
    }
  }
};

// axios 全局配置
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true;
axios.defaults.responseType = 'json';
axios.defaults.headers.common['_tk'] = util.getUserInfo().token || '';

// http request 请求 全局拦截器
axios.interceptors.request.use(
  (request) => {
    if (requestTimes > 0) {
      loadingIndex = util.loading();
    }
    // 赋值header tk参数
    if (!request.headers._tk) {
      request.headers._tk = util.getUserInfo().token || '';
    }

    //  qs全局解析一下请求数据
    if (request.method === 'post') request.data = qs.stringify(request.data);
    return request;
  },
  error => Promise.reject(error));

// http response 返回响应拦截器
axios.interceptors.response.use(
  response => {
    (requestTimes > 0) && requestTimes--;
    if (requestTimes <= 0 && loadingIndex) {
      loadingIndex.close();
    }
    // 格式化正常返回de数据
    const code = response.data.stat.code;
    const newUserToken = response.data.stat.newUserToken;
    // 重新设置token
    util.setNewUserToken(newUserToken);
    switch (code) {
      case 0:
        return formatResponseData(response.data);
      case -300:
      case -180:
      case -160:
      case -360:
      case -361:
        util.loginTimeOut();
        break;
      case -400:
        Message({
          type: 'warning',
          message: '权限不足'
        });
        break;
      default:
        Message({
          type: 'error',
          message: `HTTP响应的错误码${code}`
        });
        loadingIndex.close();
        break;
    }
    return response.data;
  },
  (error) => {
    // 报错也关闭loading
    (requestTimes > 0) && requestTimes--;
    loadingIndex && loadingIndex.close();
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 做点什么
          break;
        case 403:
          // 返回403 做点什么
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);   // 返回接口返回的错误信息
  });

// 返回封装的函数
export default {
  // post 方法
  post(params) {
    const csrfToken = util.getUserInfo().csrfToken || '';
    const urlPermissionStr = getUrlPermissionKey();
    params._gitCommitTime = config.gitCommitTime;
    params._domPermissionStr = params._domPermissionStr ? params._domPermissionStr : urlPermissionStr;
    const data = formatRequestParams(params, csrfToken);
    if (!data) {
      console.warn('请求参数格式化异常');
      return false;
    }
    const options = Object.assign({}, {
      timeout: 30000,
    }, params.options);
    const flag = JSON.stringify(params);
    if (requestQueue.includes(flag)) {
      console.warn(`重复请求被拦截 ${flag}`);
      return false;
    }
    requestQueue.push(flag);
    requestTimes++;
    if (!params.isLoading) {
      requestTimes--;
    }

    return axios({ method: 'post', url: config.apiUrl, data: data, timeout: options.timeout })
      .then(result => {
        util.removeQueue(flag);
        return result;
      }).catch(error => {
        util.removeQueue(flag);
        return error;
      });
  },
  // get 方法
  get(params) {
    const csrfToken = util.getUserInfo().csrfToken || '';
    const urlPermissionStr = getUrlPermissionKey();
    params._gitCommitTime = config.gitCommitTime;
    params._domPermissionStr = params._domPermissionStr ? params._domPermissionStr : urlPermissionStr;
    const data = formatRequestParams(params, csrfToken);
    if (!data) {
      console.warn('请求参数格式化异常');
      return false;
    }
    requestTimes++;
    if (!params.isLoading) {
      requestTimes--;
    }
    return axios({
      method: 'get',
      url: config.apiUrl,
      params: data
    });
  },
  // 上传文件
  uploadFile(params) {
    return new Promise((resolve, reject) => {
      ajax.upload({
        headers: {
          _tk: util.getUserInfo().token
        },
        withCredentials: params.withCredentials,
        file: params.file, // 单个文件上传 this.$refs.xxxx.files[0]
        files: params.files, // 多个文件上传 this.$refs.xxxx.files
        prefixName: params.name || params.prefix, // 上传文件的前缀名称
        action: config.fileUrl, // 上传文件的远程地址
        onProgress: e => {
          console.log(e);
        },
        onSuccess: res => {
          console.log(res);
          resolve(res);
        },
        onError: err => {
          reject(err);
          console.log(err);
        }
      });
    });
  }
};

