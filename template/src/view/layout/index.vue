<template>
  <div class="yit-app" id="yitApp">
    <div class="yit-layout"
    :class="{ 'hideSidebar': !sidebar.opened}"
    >
      <div class="yit-side">
        <div class="yit-side-inner">
          <!-- menu -->
          <sidebar class="yit-sidebar"></sidebar>
        </div>
      </div>

      <div class="yit-main">
        <app-head></app-head>
        <app-main></app-main>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppHead from './app-head';
import AppMain from './app-main';
import Sidebar from './sidebar';
export default {
  name: 'yit-layout',
  components: {
    AppHead,
    AppMain,
    Sidebar
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      sidebar: state => state.sidebar,
    }),
  },
  methods: {
  }
};
</script>
<style></style>

