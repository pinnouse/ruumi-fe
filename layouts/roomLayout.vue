<template>
  <div>
    <nuxt class="room container" />
    <footer-component />
  </div>
</template>

<script>
import FooterComponent from '~/components/Footer.vue'
export default {
  components: {
    FooterComponent,
  }
}
</script>

<style lang="scss">
#__layout {
  & > div > .room.container {
    display: block;
  }
}
</style>
