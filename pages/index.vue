<template>
  <div>
    <header>
      <img src="/box.png" alt="Rust Loot Tables">
      <div>
        <h1>Rust Loot Tables</h1>
        <p>List of loot tables for various crates, boxes, barrels, piles.</p>
      </div>
      <div class="search">
        <div class="search-input">
          <input type="text" v-model="search" placeholder="Search item...">
          <spinner v-if="search && loading > 0"></spinner>
        </div>
        <button @click="orderByChance = !orderByChance" class="order" :class="{ 'active' : orderByChance }">Order by Chance</button>
      </div>
    </header>
    <div class="info">
      <small>
        Double click on specific item it opens wiki. (Green marked items has max percentage chance, Blue marked items has min percentage chance)
        </small>
      <div class="lastupdate">
        Last updated {{ lastUpdate }}
      </div>
    </div>
    <template v-if="search || loading === 0">
      <div v-for="crate in allCrates" :key="crate.id" class="crate">
        <template v-if="crate.loots.length">
          <div class="name" :style="{ backgroundImage: crate.file ? `url(${getImage(crate.file.url)})` : `` }" @click="openModal(crate)">
            <span>{{ crate.name }}</span>
            <span class="count">{{ crate.lootCount.count }} items</span>
          </div>
          <loot-list class="list" :crate="crate"></loot-list>
        </template>
      </div>
      <modal ref="modal">
        <div v-if="selectedCrate">
          <h3>{{ selectedCrate.name }}</h3>
          <p>{{ selectedCrate.description }}</p>
        </div>
      </modal>
    </template>
    <div class="loading" v-else>
      <spinner :size="30"></spinner>
    </div>
  </div>
</template>

<script>
import timeago from 'timeago.js'

import allChangelogs from '~/apollo/allChangelogs.gql'
import allCrates from '~/apollo/allCrates.gql'

export default {
  data: () => ({
    search: '',
    orderByChance: false,

    selectedCrate: null,
    showModal: false,

    loading: 0
  }),
  components: {
    LootList: () => import('~/components/LootList'),
    Spinner: () => import('~/components/Spinner'),
    Modal: () => import('~/components/Modal')
  },
  computed: {
    lastUpdate () {
      return this.lastChange ? timeago().format(this.lastChange.date) : '...'
    }
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
      watchLoading (isLoading, countModifier) {
        this.$nextTick(() => {
          this.loading += countModifier
        })
      },
      prefetch: ({ route }) => ({ search: '', orderBy: 'name_DESC' })
    },
    lastChange: {
      query: allChangelogs,
      variables: {
        orderBy: 'date_DESC'
      },
      update: (data) => data.allChangelogs[0],
      prefetch: ({ route }) => ({ orderBy: 'date_DESC' })
    }
  },
  methods: {
    getImage (url, width = 200, height = 200) {
      const imageSize = width + 'x' + height
      return url.replace('https://files.graph.cool/', 'https://images.graph.cool/') + '/' + imageSize
    },
    openModal (crate) {
      this.selectedCrate = crate
      this.$refs.modal.open()
    }
  }
}
</script>

<style lang="scss">
@import 'assets/_variables.scss';

header {
  margin: 20px 0;
  display: flex;
  flex-flow: wrap;
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
    }
  }
  .list {
    overflow: hidden;
    width: 100%;
    margin: 0 -2px -2px;
  }
  .count {
    position: absolute;
    top: 6px;
    right: 6px;
    background: transparentize($black, .5);
    color: $white;
    font-size: 10px;
    border-radius: 3px;
    padding: 2px 4px;
    margin-left: 2px;
  }
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
}

.info {
  display: flex;
  flex-flow: wrap;
  .lastupdate {
    margin-left: auto;
    font-size: 12px;
    opacity: .6;
  }
}

.search {
  display: flex;
  margin-left: 20px;
  max-width: 500px;
  width: 100%;
  @media screen and (max-width: 1024px) {
    margin: 16px 0 0;
  }
  .search-input {
    position: relative;
    max-width: 300px;
    width: 100%;
    input {
      width: 100%;
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

  .order {
    background: $secondaryBackground;
    margin-left: 8px;
    cursor: pointer;
    border: 0px;
    font-size: 11px;
    padding: 4px 8px;
    color: $primaryText;
    border-radius: 3px;
    &.active {
      background: $primary;
      color: $white;
    }
  }
}
</style>
