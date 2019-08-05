<template>
  <div class="gradients">
    <div ref="items" class="items" :class="{ 'moving' : scroll.enabled }">
      <transition-group name="list" class="transition">
        <div v-for="loot in crate.loots" :key="loot.id" :class="['item', { 'green' : loot.percentage >= maxPercentage, 'blue' : loot.percentage <= minPercentage }]" @dblclick="openRustLabs(loot)">
          <div class="info">
            <span v-if="loot.percentage" class="percentage" title="Percentage chance">{{ loot.percentage }}%</span>
            <span v-if="loot.condition" title="Condition">{{ loot.condition }}%</span>
            <span v-if="loot.amount" class="amount" title="Amount">{{ loot.amount }}</span>
          </div>
          <div class="image">
            <lazy-image class="icon" :src="`https://rustlabs.com/img/items180/${loot.dataId}.png`" />
            <div v-if="loot.blueprint" class="blueprint"></div>
          </div>
          <div class="title">{{ loot.name }}</div>
        </div>
      </transition-group>
    </div>
    <div v-show="scroll.start" class="gradient-left"></div>
    <div v-show="!scroll.end" class="gradient-right"></div>
  </div>
</template>

<script>
export default {
  name: 'LootList',
  props: ['crate'],
  data: () => ({
    scroll: {
      enabled: false,
      clientX: 0,
      scrollLeft: 0,
      start: 0,
      end: false
    }
  }),
  components: {
    LazyImage: () => import('~/components/LazyImage')
  },
  computed: {
    maxPercentage () {
      const percentages = this.crate.loots.map((item) => item.percentage)
      return Math.max(...percentages)
    },
    minPercentage () {
      const percentages = this.crate.loots.map((item) => item.percentage)
      return Math.min(...percentages)
    }
  },
  mounted () {
    // recalculate right shadow
    this.scroll.end = this.$refs.items.scrollWidth - this.$refs.items.scrollLeft === this.$refs.items.clientWidth

    // detect mouse movement for smaller displays
    this.$refs.items.addEventListener('mousedown', (event) => {
      this.scroll.enabled = true
      this.scroll.scrollLeft = this.$refs.items.scrollLeft
      this.scroll.start = this.$refs.items.scrollLeft
      this.scroll.clientX = event.pageX
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
        this.$refs.items.scrollLeft = this.scroll.scrollLeft + this.scroll.clientX - event.pageX
        this.scroll.start = this.$refs.items.scrollLeft
        this.scroll.end = this.$refs.items.scrollWidth - this.$refs.items.scrollLeft === this.$refs.items.clientWidth
      }
    })
  },
  methods: {
    openRustLabs (loot) {
      window.open(`https://rustlabs.com/item/${this.slugify(loot.name)}`, '_blank')
    },
    slugify (text) {
      return text.toString().toLowerCase().trim()
        .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
        .replace(/^-+|-+$/g, '') // remove leading, trailing -
        .replace('-blueprint', '') // remove blueprint from name
    }
  }
}
</script>

<style lang="scss">
.gradients {
  position: relative;
  .gradient-right {
    position: absolute;
    z-index: 5;
    top: 0px;
    right: 0px;
    width: 100px;
    height: 100%;
    background: linear-gradient(to left, $primaryBackground 0%,rgba(125,185,232,0) 70%);
    pointer-events: none;
  }
  .gradient-left {
    position: absolute;
    z-index: 5;
    top: 0px;
    left: 0px;
    width: 100px;
    height: 100%;
    background: linear-gradient(to right, $primaryBackground 0%,rgba(125,185,232,0) 70%);
    pointer-events: none;
  }
}

.items {
  user-select: none;
  overflow-x: auto;
  overflow: -moz-scrollbars-none; // FF
  -ms-overflow-style: none;  // IE 10+
  scrollbar-width: none; // FFF 64
  &::-webkit-scrollbar {
    display: none;  // Safari and Chrome
  }
  &.moving {
    cursor: w-resize;
  }
  .transition {
    display: flex;
    @media screen and (min-width: 1024px) {
      flex-flow: wrap;
    }
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
  margin: 0 1px 2px;
  flex: 0 0 120px;
  &.green {
    background:#202721;
  }
  &.blue {
    background:#202027;
  }
  .info {
    position: absolute;
    top: 6px;
    right: 0;
    left: 0;
    padding: 0 6px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
    width: 100%;
    z-index: 2;
    span {
      background: darken($gray, 10%);
      color: $white;
      font-size: 10px;
      border-radius: 3px;
      padding: 2px 4px;
      margin-left: 2px;
      &:not(.percentage) {
        opacity: .7;
      }
      &.percentage {
        background: $blueBackground;
        color: $blueColor;
        margin-right: auto;
      }
    }
  }
  &:hover {
    transition: none;
    box-shadow: inset 0 0 0px 1px $primaryText;
  }
  .title {
    text-align: center;
    font-size: 14px;
    white-space: pre-wrap;
  }
  .image {
    position: relative;
    margin: 8px;
    width: 60px;
    height: 60px;
    .icon {
      position: relative;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .blueprint {
      position: absolute;
      background: url(/blueprint.png) center center no-repeat;
      background-size: contain;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  }
}

.list-enter-active, .list-leave-active {
  transition: all .3s;
}
.list-enter, .list-leave-to {
  opacity: 0;
}
</style>
