<template>
  <div>
    <header>
      <img src="/box.png" alt="Rust Loot Tables">
      <div>
        <h1>Rust Loot Tables</h1>
        <p>List of loot tables for various crates, boxes, barrels, piles.</p>
      </div>
    </header>
    <div class="search">
      <input type="text" v-model="search" placeholder="Search...">
      <svg v-if="loading > 0" class="spinner" width="16px" height="16px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
    <div class="info">
      <small>(Press on list of items and move left, right to move long list of items.)</small>
      <div class="order">
        <button @click="orderByChance = !orderByChance" :class="{ 'active' : orderByChance }">Order by Chance</button>
      </div>
    </div>
    <div v-for="crate in allCrates" :key="crate.id" v-if="crate.loots.length" class="crate">
      <div class="name" :style="{ backgroundImage: crate.file ? `url(${getImage(crate.file.url)})` : `` }">
        <span>{{ crate.normalName ? crate.normalName : normalCase(crate.name) }}</span>
      </div>
      <loot-list class="list" :crate="crate"></loot-list>
    </div>
  </div>
</template>

<script>
import allCrates from '~/apollo/allCrates.gql'

import LootList from '~/components/LootList'

export default {
  data () {
    return {
      search: '',
      orderByChance: false,

      loading: 0
    }
  },
  components: {
    LootList
  },
  apollo: {
    allCrates: {
      query: allCrates,
      variables () {
        return {
          search: this.search,
          orderBy: this.orderByChance ? 'percentage_DESC' : 'name_DESC'
        }
      },
      loadingKey: 'loading'
    }
  },
  methods: {
    getImage (url, width = 200, height = 200) {
      const imageSize = width + 'x' + height
      return url.replace('https://files.graph.cool/', 'https://images.graph.cool/') + '/' + imageSize
    },
    normalCase (name) {
      const split = name.split(/_|-/)
      return split.map((key) => this.capitalizeFirstLetter(key)).join(' ')
    },
    capitalizeFirstLetter (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>

<style lang="scss">
@import 'assets/variables.scss';

header {
  margin: 20px 0 0;
  display: flex;
  align-items: center;
  img {
    max-width: 60px;
    margin-right: 16px;
  }
  h1 {
    color: $secondaryText;
    font-size: 18px;
    font-weight: 300;
    margin: 0px;
  }
  p {
    margin: 0px;
  }
}

.crate {
  margin: 16px 0;
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
  }
  .list {
    overflow: hidden;
    width: 100%;
  }
}

.info {
  display: flex;
  .order {
    margin-left: auto;
    button {
      background: $secondaryBackground;
      cursor: pointer;
      border: 0px;
      font-size: 11px;
      padding: 4px 6px;
      color: $primaryText;
      border-radius: 3px;
      &.active {
        background: $primary;
        color: $white;
      }
    }
  }
}

.search {
  position: relative;
  margin: 16px 0;
  max-width: 300px;
  input {
    background: $secondaryBackground;
    border: 0px;
    padding: 8px 26px 8px 12px;
    width: 100%;
    color: $secondaryText;
    &:focus {
      background: lighten($secondaryBackground, 5%);
    }
  }
  .spinner {
    position: absolute;
    top: 9px;
    right: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
