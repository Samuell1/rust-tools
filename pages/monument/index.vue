<template>
  <div>
    <div class="page-title">
      <h1>Monuments</h1>
      <p></p>
    </div>

    <template v-if="search || loading === 0">
      <template v-for="crate in allCrates">
        <div v-if="crate.loots.length" class="monument" :key="crate.id">
          <div class="name" :style="{ backgroundImage: crate.file ? `url(${getImage(crate.file.url)})` : `` }" @click="openModal(crate)">
            <span>{{ crate.name }}</span>
            <span class="count">{{ crate.lootCount.count }} items</span>
          </div>
          <loot-list class="list" :crate="crate" :filter="filter"/>
        </div>
      </template>
      <modal ref="modal">
        <div v-if="selectedCrate">
          <h3>{{ selectedCrate.name }}</h3>
          <p>{{ selectedCrate.description }}</p>
        </div>
      </modal>
    </template>
    <template class="loading" v-else>
      <spinner :size="30"></spinner>
    </template>
  </div>
</template>

<script>
import allMonuments from '~/apollo/allMonuments.gql'

export default {
  data: () => ({
    loading: 0
  }),
  apollo: {
    allMonuments: {
      query: allMonuments,
      loadingKey: 'loading',
      prefetch: true
    }
  },
  methods: {
    getImage (url, width = 200, height = 200) {
      const imageSize = width + 'x' + height
      return url.replace('https://files.graph.cool/', 'https://images.graph.cool/') + '/' + imageSize
    }
  }
}
</script>

<style lang="scss">
.monument {
  margin: 24px 0;
  display: flex;
  overflow: hidden;
  .name {
    background-size: cover;
    background-position: center center;
    width: 128px;
    height: 128px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    margin-right: 10px;
    color: $secondaryText;
    font-weight: 500;
    text-shadow: 0px 0px 3px #000;
    &:hover {
      cursor: pointer;
      box-shadow: inset 0 0 0px 1px $primary;
    }
  }
}
</style>
