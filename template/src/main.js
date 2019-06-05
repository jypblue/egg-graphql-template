// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import config from './config';

// 第三方Vue组件库
import ElementUi from 'element-ui';
import VueEllipsis from 'vue-ellipsis';

// 权限管理
import './permission';
// http request
import axios from './http';

// 全局指令及filter
import * as directives from '@/utils/directive';
import * as filters from '@/utils/filter';
import * as mixin from '@/utils/mixin';
import * as components from '@/components';
import * as tool from '@/utils';

const bwUtils = require('@boss/boss-web-utils');

// 自定义svg icon
import '@/components/svg';
// ali iconfont
// import '@/assets/icon/iconfont.css';
// 引入font-awesome 字体包样式,icon选择地址：http://fontawesome.dashgame.com/
import 'font-awesome/css/font-awesome.css';
// 全局样式
import '@/styles/element-variables.scss';
import '@/styles/reset.scss';
import '@/styles/main.scss';



// 全局组件
Vue.use(ElementUi);
Vue.use(VueEllipsis);

// 全局自定义命令集合
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]);
});
// 全局自定义filter集合
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
// 全局混入
Object.keys(mixin).forEach(key => {
  Vue.mixin(mixin[key]);
});
// 全局组件
Object.keys(components).forEach(key => {
  Vue.component(key, components[key]);
});


Vue.prototype.$axios = axios;
Vue.prototype.$config = config;
Vue.prototype.$tool = Object.assign({}, tool, bwUtils);
Vue.config.productionTip = false;

// 全局error收集
Vue.config.errorHandler = function(err, vm, info, a) {
  Vue.nextTick(() => {
    console.log('error url:', window.location.href);
    console.error('error msg:', err);
    console.error('error info:', info);
  });
};



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
