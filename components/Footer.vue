<template>
    <footer>
      <nuxt-link to="/"><img alt="Logo" id="logo" src="~assets/Ruumi.svg"></nuxt-link>
      <div>
        <span>&COPY; pinnouse 2020</span>
        <a href="https://twitter.com/__Ruumi" target="_blank" rel="noreferrer"><img src="~assets/Twitter_Logo_WhiteOnImage.svg" /></a>
        <a href="https://www.patreon.com/pinnouse" target="_blank" rel="noreferrer"><img src="~assets/Patreon_Mark_White.svg" /></a>
      </div>
    </footer>
</template>

<style lang="scss">
footer {
  cursor: default;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 8px 12px 12px;
  font-size: 10px;
  height: 40px;

  & > * {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
  }

  & > a > #logo {
    height: 26px;
    width: 26px;
    padding: 2px;
  }

  & > div {

    & > span {
      margin: 0 4px;
    }
    
    & > a {
      display: inline-block;
      width: 26px;
      height: 26px;
      margin: 0 3px;
      background: rgba(124, 83, 160, 0.164);
      transition: background .3s ease;

      & > img {
        width: 26px;
        height: 26px;
        vertical-align: bottom;
        padding: 4px;
      }

      &:hover {
        background: rgba(124, 83, 160, 0.315);
      }
    }
  }
}
</style>