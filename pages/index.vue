<template>
  <div>
    <div class="page-title">
      <h1>Loot Tables</h1>
      <p>All lootable containers from Rust. Double clicking on specific item opens a wiki in new tab. <br> Green marked item has most percentage chance to drop from box and blue marked has least.</p>
    </div>

    <div class="filter">
      <div class="search">
        <div class="search-input">
          <input type="text" v-model="search" placeholder="Search item...">
          <spinner v-if="search && loading > 0"></spinner>
        </div>
      </div>
      <div>
        <checkbox v-model="orderByChance">Order by chance</checkbox>
        <checkbox v-model="filter.hideBlueprints">Hide blueprints</checkbox>
        <checkbox v-model="filter.hideMiscCategory">Hide misc</checkbox>
      </div>
    </div>

    <template v-if="search || loading === 0">
      <template v-for="crate in allCrates">
        <div v-if="crate.loots.length" class="crate" :key="crate.id">
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
import timeago from 'timeago.js'
import debounce from 'lodash.debounce'

import allChangelogs from '~/apollo/allChangelogs.gql'
import allCrates from '~/apollo/allCrates.gql'

export default {
  data: () => ({
    search: '',
    searchInput: '',
    orderByChance: false,

    filter: {
      hideBlueprints: false,
      hideMiscCategory: false
    },

    selectedCrate: null,
    showModal: false,

    loading: 0,

    test: 0
  }),
  components: {
    LootList: () => import('~/components/LootList'),
    Spinner: () => import('~/components/Spinner'),
    Modal: () => import('~/components/Modal'),
    Dropdown: () => import('~/components/Dropdown'),
    Checkbox: () => import('~/components/Checkbox')
  },
  watch: {
    search () {
      this.getSearchInput()
    }
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
          search: this.searchInput,
          orderBy: this.orderByChance ? 'percentage_DESC' : 'name_ASC'
        }
      },
      loadingKey: 'loading',
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
    getSearchInput: debounce(function () {
      this.searchInput = this.search
    }, 200),
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

.filter {
  display: flex;
}

.search {
  display: flex;
  align-content: center;
  flex: 0 0 300px;
  margin-right: 16px;
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
