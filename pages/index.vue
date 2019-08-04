<template>
  <div>
    <header>
      <div class="row">
        <div class="logo col">
          <img src="/box.png" alt="Rust Loot Tables">
          <div>
            <h1>Rust Loot Tables</h1>
            <small class="lastupdate" :title="lastUpdateDate">Last updated {{ lastUpdate }}</small>
          </div>
        </div>
        <div class="search col">
          <div class="search-input">
            <input type="text" v-model="search" placeholder="Search item...">
            <spinner v-if="search && loading > 0"></spinner>
          </div>
        </div>
        <div class="filter col">
          <button @click="orderByChance = !orderByChance" class="button" :class="{ 'active' : orderByChance }">Order by Chance</button>
        </div>
        <div class="info col">
          Double clicking on specific item opens a wiki in new tab. <br> Green marked item has most percentage chance to drop from box and blue marked has least.
        </div>
      </div>
    </header>
    <template v-if="search || loading === 0">
      <template v-for="crate in allCrates">
        <div v-if="crate.loots.length" class="crate" :key="crate.id">
          <div class="name" :style="{ backgroundImage: crate.file ? `url(${getImage(crate.file.url)})` : `` }" @click="openModal(crate)">
            <span>{{ crate.name }}</span>
            <span class="count">{{ crate.lootCount.count }} items</span>
          </div>
          <loot-list class="list" :crate="crate"></loot-list>
        </div>
      </template>
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
    Modal: () => import('~/components/Modal'),
    Dropdown: () => import('~/components/Dropdown')
  },
  computed: {
    lastUpdate () {
      return this.lastChange ? timeago().format(this.lastChange.date) : '...'
    },
    lastUpdateDate () {
      return new Date(Date.parse(this.lastChange.date)).toLocaleString()
    }
  },
  apollo: {
    allCrates: {
      query: allCrates,
      variables () {
        return {
          search: this.search,
          orderBy: this.orderByChance ? 'percentage_DESC' : 'name_ASC'
        }
      },
      watchLoading (isLoading, countModifier) {
        this.$nextTick(() => {
          this.loading += countModifier
        })
      },
      prefetch: ({ route }) => ({ search: '', orderBy: 'name_ASC' })
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
header {
  margin: 20px 0;
  background: $secondaryBackground;
  padding: 16px;
  border-radius: 3px;
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
  .info {
    white-space: initial;
    font-size: 12px;
    min-width: 0;
    flex: 1 1 auto;
  }
  .lastupdate {
    opacity: .6;
    font-size: 12px;
  }
  .logo {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
  }
  .filter {
    .button {
      margin-right: 6px;
    }
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
      box-shadow: inset 0 0 0px 1px $primary;
    }
  }
  .list {
    overflow: hidden;
    width: 100%;
    margin: 0 0px -2px;
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

.search {
  display: flex;
  align-content: center;
  flex: 0 0 300px;
  .search-input {
    position: relative;
    max-width: 300px;
    width: 100%;
    input {
      background: lighten($secondaryBackground, 5%);
      border: 0px;
      padding: 8px 26px 8px 12px;
      width: 100%;
      color: $secondaryText;
      font-size: 14px;
      border-radius: 3px;
      height: 38px;
      &:focus {
        background: lighten($secondaryBackground, 8%);
      }
    }
    .spinner {
      position: absolute;
      top: 11px;
      right: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.button {
  background: lighten($secondaryBackground, 8%);
  cursor: pointer;
  border: 0px;
  font-size: 11px;
  padding: 4px 8px;
  color: $primaryText;
  border-radius: 3px;
  height: 38px;
  &.active {
    background: $primary;
    color: $white;
  }
}

</style>
