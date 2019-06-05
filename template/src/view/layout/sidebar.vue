<template>
    <el-menu mode="vertical"
    :default-active="$route.path"
    :collapse="isCollapse"
    :background-color="bgcolor"
    :text-color="textcolor"
    :active-text-color="activecolor"
    >
      <sidebar-item
      :routes="routesMap"
      ></sidebar-item>
    </el-menu>
</template>

<script>
import { mapState } from 'vuex';
import SidebarItem from './sidebar-item';

export default {
  components: {
    SidebarItem,
  },
  data() {
    return {
      bgcolor: '#304156',
      textcolor: '#bfcbd9',
      activecolor: '#fff'
    };
  },
  computed: {
    ...mapState({
      sidebar: state => state.sidebar,
      routesMap: state => state.permission.routers,
    }),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
};
</script>

<style lang="scss">
  @import './layout.scss';
</style>
