<template>
  <div class="login-container">
    <el-form ref="loginForm" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">\{{title}}</h3>
      </div>
      <div class="text-center">
        <img :src="logo" width="200" height="200" alt="">
      </div>
      <div class="yit-login-tips text-center">
         请前往一条权限系统进行授权登录
      </div>
      <div class="yit-jump2sso">
        <el-button type="text" @click="handleJump2SsoSystem">点击跳转到权限系统</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
// 引入延签文件
import '@/assets/file/sam.loginWithSSOTicket';
import { getQueryString } from '@/utils/tool';
import logo from '@/assets/img/logo.png';

export default {
  name: 'Login',
  data() {
    return {
      title: 'XX系统',
      logo: logo
    };
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.name === 'Login') {
          const key = getQueryString('key');
          if (key) {
            console.log('?key=' + key);
            this.loginWithSSOTicket(key);
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    // sso 登录
    async loginWithSSOTicket(SSOTicket) {
      const params = {
        method: 'post',
        mt: 'sam.loginWithSSOTicket',
        data: {
          SSOTicket
        }
      };
      const result = await this.fnFetch(params);
      console.log('login by key', result);
      if (result) {
        const data = result[0].data;
        if (data.permissionList && data.permissionList.length === 0) {
          this.$router.push({ name: 'NoPermission' });
        } else {
          // 每次登录前手动清除之前的localStorage;
          window.localStorage.removeItem(this.$config.appKey);
          this.$store.commit('SET_USER', data);
          // 跳转默认需要跳转的页面,现在默认是首页
          this.$router.push({ path: '/home' });
        }
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
  @import './login.scss';
</style>
