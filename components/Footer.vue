<template>
    <footer>
      <a href="https://twitter.com/__Ruumi" target="_blank" rel="noreferrer"><img src="~assets/Twitter_Logo_WhiteOnImage.svg" /></a>
      <a href="https://www.patreon.com/pinnouse" target="_blank" rel="noreferrer"><img src="~assets/Patreon_Mark_White.svg" /></a>
    </footer>
</template>

<style lang="scss">
footer {
  position: fixed;
  bottom: 16px;
  left: 0;
  width: 100%;
  padding: 0 16px;
  height: 22px;
  text-align: right;

  & > a {
    height: 100%;

    & > img {
      height: 100%;
    }
  }
}
</style>