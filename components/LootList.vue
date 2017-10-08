<template>
  <div class="gradients">
    <div ref="items" class="items" :class="{ 'moving' : scroll.enabled }">
      <transition-group name="list" class="transition">
        <div class="item" v-for="loot in crate.loots" :key="loot.id">
          <span v-if="loot.percentage && loot.percentage > 1" class="percentage" :class="{ 'green' : loot.percentage > 50, 'blue' : loot.percentage < 50 }"><span>{{ loot.percentage }}</span></span>
          <div class="image" :style="{ backgroundImage: `url(https://rustlabs.com/img/items180/${loot.dataId}.png)` }"></div>
          <div class="title">{{ loot.name ? loot.name : parseName(loot.dataId) }}</div>
        </div>
      </transition-group>
    </div>
    <div v-show="scroll.savedPosition" class="gradient-left"></div>
    <div class="gradient-right"></div>
  </div>
</template>

<script>
export default {
  name: 'LootList',
  props: ['crate'],
  data () {
    return {
      scroll: {
        enabled: false,
        clientX: 0,
        scrollLeft: 0,
        savedPosition: 0
      }
    }
  },
  mounted () {
    this.$refs.items.addEventListener('mousedown', (event) => {
      this.scroll.enabled = true
      this.scroll.scrollLeft = this.$refs.items.scrollLeft
      this.scroll.savedPosition = this.$refs.items.scrollLeft
      this.scroll.clientX = event.clientX
    })
    this.$refs.items.addEventListener('mouseup', () => {
      this.scroll.enabled = false
    })
    this.$refs.items.addEventListener('mouseleave', () => {
      this.scroll.enabled = false
    })
    this.$refs.items.addEventListener('mousemove', (event) => {
      event.preventDefault()
      if (this.scroll.enabled) {
        this.$refs.items.scrollLeft = this.scroll.scrollLeft + this.scroll.clientX - event.clientX
        this.scroll.savedPosition = this.$refs.items.scrollLeft
      }
    })
  },
  methods: {
    parseName (name) {
      const split = name.split('.')
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

.gradients {
  position: relative;
  .gradient-right {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100px;
    height: 100%;
    background: linear-gradient(to left, $primaryBackground 0%,rgba(125,185,232,0) 70%);
  }
  .gradient-left {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100px;
    height: 100%;
    background: linear-gradient(to right, $primaryBackground 0%,rgba(125,185,232,0) 70%);
  }
}

.items {
  user-select: none;
  -ms-overflow-style: none;  // IE 10+
  overflow: -moz-scrollbars-none;
  &::-webkit-scrollbar {
      display: none;  // Safari and Chrome
  }
  &.moving {
    cursor: w-resize;
  }
  .transition {
    display: flex;
  }
}

.item {
  background: $secondaryBackground;
  height: 128px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-right: 2px;
  flex: 0 0 120px;
  .percentage {
    position: absolute;
    top: 6px;
    right: 6px;
    height: 25px;
    width: 25px;
    font-size: 12px;
    border-radius: 16px;
    color: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    &.green {
      background: $primary;
    }
    &.blue {
      background: $secondary;
    }
  }
  .title {
    text-align: center;
    font-size: 14px;
  }
  .image {
    background-size: contain;
    margin: 8px;
    width: 60px;
    height: 60px;
  }
}

.list-enter-active, .list-leave-active {
  transition: all .3s;
}
.list-enter, .list-leave-to {
  opacity: 0;
}
</style>
