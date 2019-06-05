<template>
  <section class="yit-content" style="min-height: 100%">
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view :key="$route.fullpath"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'yit-main',
};
</script>
