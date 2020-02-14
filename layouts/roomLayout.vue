<template>
  <div>
    <nuxt class="room container" />
    <footer>
      <a href="https://www.patreon.com/pinnouse" target="_blank" rel="noreferrer"><img src="~assets/Patreon_Mark_White.svg" /></a>
    </footer>
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

footer {
  position: fixed;
  bottom: 16px;
  left: 0;
  width: 100%;
  padding: 0 16px;
  height: 18px;
  text-align: right;

  & > a {
    height: 100%;

    & > img {
      height: 100%;
    }
  }
}
</style>
