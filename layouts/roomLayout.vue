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
html {
  font-family: 'Montserrat', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 18px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

#__layout {
  margin: 32px 10vw;

  & > div > .room.container {
    display: block;
  }
}
</style>
