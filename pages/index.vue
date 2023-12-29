<template>
  <div>
    <div class="page-title">
      <h1>Loot Tables</h1>
      <p>
        All lootable containers from Rust.
        <br/>Green marked item has most percentage chance to drop from box and blue marked has least.
      </p>
    </div>

    <div class="filter">
      <div class="search">
        <div class="search-input">
          <input type="text" v-model="search" placeholder="Search item or crate..."/>
          <spinner v-if="search && loading > 0"></spinner>
        </div>
      </div>
      <div>
        <checkbox v-model="filter.orderByChance">Order by chance</checkbox>
        <checkbox v-model="filter.hideBlueprints">Hide blueprints</checkbox>
        <checkbox v-model="filter.hideMiscCategory">Hide misc</checkbox>
      </div>
    </div>

    <template v-if="search || loading === 0">
      <template v-for="crate in filteredCrates">
        <div v-if="crate.loots.length" class="crate" :key="crate.name">
          <div
            class="name"
            :style="{ backgroundImage: `url(/images/crates/${crate.name.toLowerCase().replace(/ /g, '-')}.png)` }"
            @click="openModal(crate)"
          >
            <span>{{ crate.name }}</span>
            <span class="count">{{ crate.loots.length }} items</span>
          </div>
          <loot-list class="list" :loots="crate.loots"/>
        </div>
      </template>
      <modal ref="modal">
        <div v-if="selectedCrate">
          <h3>{{ selectedCrate.name }}</h3>
          <p>{{ selectedCrate.description }}</p>
          <a :href="selectedCrate.url" target="_blank">Rustlabs page</a>
        </div>
      </modal>
    </template>
    <div class="loading" v-else>
      <spinner :size="30"></spinner>
    </div>
  </div>
</template>

<script>

const getCrates = () => import('/assets/data.json').then(m => m.default || m)

export default {
  data: () => ({
    search: '',

    allCrates: [],

    filter: {
      orderByChance: true,
      hideBlueprints: false,
      hideMiscCategory: false
    },

    selectedCrate: null,
    showModal: false,

    loading: 0
  }),
  components: {
    LootList: () => import('~/components/LootList'),
    Spinner: () => import('~/components/Spinner'),
    Modal: () => import('~/components/Modal'),
    Checkbox: () => import('~/components/Checkbox')
  },
  computed: {
    filteredCrates: {
      cache: false,
      get() {
        const search = this.search.toLowerCase()
        const filteredCrates = this.allCrates.map(crate => {
          if (crate.name.toLowerCase().includes(search)) {
            return crate
          }

          const loots = crate.loots.filter(loot => {
            if (this.filter.hideBlueprints && loot.blueprint) {
              return false
            }

            if (this.filter.hideMiscCategory && loot.category === 'Misc') {
              return false
            }

            if (search && !loot.name.toLowerCase().includes(search)) {
              return false
            }

            return true
          })

          return {
            ...crate,
            loots
          }
        }).filter(crate => crate.loots.length)

        if (this.filter.orderByChance) {
          filteredCrates.sort((a, b) => {
            const aChance = a.loots.reduce((acc, loot) => acc + loot.chance, 0)
            const bChance = b.loots.reduce((acc, loot) => acc + loot.chance, 0)
            return bChance - aChance
          })
        }

        return filteredCrates
      }
    }
  },
  methods: {
    openModal(crate) {
      this.selectedCrate = crate
      this.$refs.modal.open()
    },
  },
  async mounted() {
    this.loading++
    this.allCrates = await getCrates()
    this.loading--
  },
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
    background: transparentize($black, 0.5);
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
  align-items: center;
  flex-flow: wrap;
  gap: 8px;
}

.search {
  display: flex;
  align-content: center;
  width: 100%;
  max-width: 100%;

  @media (min-width: 768px) {
    max-width: 300px;
  }

  .search-input {
    position: relative;
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
