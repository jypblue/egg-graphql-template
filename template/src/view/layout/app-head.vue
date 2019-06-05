<template>
  <div class="yit-head flex">
    <div class="yit-sidebar-toggle pl20" @click="toggleSidebar">
      <i class="iconfont icon-menu"></i>
    </div>
    <div class="flex-1">

    </div>
    <div class="pr20">
      <el-button round size="small" @click="logout">登出</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'yit-head',
  data() {
    return {
    };
  },
  methods: {
    ...mapMutations({
      toggleSidebar: 'TOGGLE_SIDEBAR',
    }),
    logout() {
      // 手动登出
      this.$store.dispatch('FedLogOut').then(() => {
        window.localStorage.removeItem(this.$config.appKey);
        this.handleJump2SsoSystem();
      });
    },
  }
};
</script>

