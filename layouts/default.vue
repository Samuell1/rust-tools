<template>
  <div>
    <header>
      <div class="logo">
        <img src="/box.png" alt="iRust" />
        <h1>RUST</h1>
      </div>
      <nav>
        <nuxt-link to="/">Loot Tables</nuxt-link>
        <nuxt-link to="/decay">Wall Decay Calculator</nuxt-link>
      </nav>
    </header>
    <div class="container">
      <nuxt />
    </div>
    <footer>
      Created by
      <a href="https://github.com/Samuell1">Samuell</a>. Images and informations are used from Rust Wiki and
      <a href="https://rustlabs.com">Rustlabs.com</a>
    </footer>
  </div>
</template>

<style lang="scss">
header {
  display: flex;
  align-items: stretch;
  margin: 0;
  background: $secondaryBackground;
  padding: 0 16px;
  min-height: 60px;
  img {
    max-width: 40px;
    margin-right: 16px;
  }
  h1 {
    color: $secondaryText;
    font-size: 18px;
    font-weight: 300;
    margin: 0px;
  }
  .logo {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
  }
  nav {
    display: flex;
    margin: 0 16px;
    a {
      color: $primaryText;
      display: flex;
      align-items: center;
      padding: 0 16px;
      text-decoration: none;
      &.nuxt-link-active {
        background: lighten($secondaryBackground, 2%);
      }
      &:hover {
        background: lighten($secondaryBackground, 5%);
      }
    }
  }
}

.page-title {
  padding: 8px 0 8px;
  text-align: center;
  h1 {
    font-weight: 300;
    font-size: 24px;
  }
  p {
    font-size: 14px;
    color: $gray;
  }
}

.container {
  width: 100%;
  max-width: 1625px;
  margin: auto;
  padding: 0 16px;
  min-height: calc(100vh - 117px);
}

footer {
  font-size: 12px;
  padding: 20px 0;
  text-align: center;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.5s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
