<template>
  <div>
    <nuxt class="room container" />
  </div>
</template>

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
  background-color: var(--background-color);
  color: #ffffff;
}

#__layout {
  margin: 32px 10vw;

  & > div > .room.container {
    display: block;
  }
}
</style>
