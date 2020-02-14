<template>
  <div>
    <nuxt class="container" />
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

body {
  margin: 0;
  padding: 0;
}

#__layout {
  margin: 32px 10vw;

  & > div > .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

footer {
  position: absolute;
  bottom: 12px;
  left: 0;
  width: 100%;
  height: 18px;
  text-align: center;

  & > a {
    height: 100%;

    & > img {
      height: 100%;
    }
  }
}
</style>
