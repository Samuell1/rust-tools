<template>
  <div class="container-center">
    <div class="content">
      <nuxt/>
    </div>
    <footer>
      Created by <a href="https://github.com/Samuell1">Samuell</a>. Images and informations are used from Rust Wiki and <a href="https://rustlabs.com">Rustlabs.com</a>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.container-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 16px;
  .content {
    width: 100%;
    max-width: 660px;
  }
}

footer {
  font-size: 12px;
  margin: 20px 0;
}
</style>

<style lang="scss">
.title {
  text-align: center;
  font-weight: 300;
}
</style>
