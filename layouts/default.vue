<template>
  <div>
    <nuxt class="container" />
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