<template>
  <div class="yit-home">
      <div class="yit-home-title">
        <h3 class="title">\{{title}}</h3>
      </div>
  </div>
</template>

<script>
export default {
  name: 'page-home',
  data() {
    return {
      title: 'Boss Web 单页模板 首页'
    };
  },
};
</script>

<style lang="scss">
  @import './home.scss';
</style>
