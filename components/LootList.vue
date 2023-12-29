<template>
  <div class="gradients">
    <div ref="items" class="items" :class="{ 'moving' : scroll.enabled }">
      <TransitionGroup name="list" tag="div" class="items__content">
        <div
          v-for="loot in loots"
          :key="loot.name"
          :class="['item', { 'green' : loot.percentage >= maxPercentage, 'blue' : loot.percentage <= minPercentage }]"
        >
          <div class="info">
            <span
              v-if="loot.percentage"
              class="percentage"
              title="Percentage chance"
            >{{ loot.percentage }}%</span>
            <span v-if="loot.condition" title="Condition">{{ loot.condition }}%</span>
            <span v-if="loot.amount" class="amount" title="Amount">{{ loot.amount }}</span>
          </div>
          <div class="image">
            <LazyImage class="icon" :src="`/images/items/${loot.image}`" :alt="loot.name"/>
            <div v-if="loot.blueprint" class="blueprint"></div>
          </div>
          <div class="title">{{ loot.name }}</div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
import LazyImage from "~/components/LazyImage.vue";

export default {
  name: 'LootList',
  props: ['loots'],
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
    LazyImage
  },
  computed: {
    maxPercentage() {
      const percentages = this.loots.map(item => item.percentage)
      return Math.max(...percentages)
    },
    minPercentage() {
      const percentages = this.loots.map(item => item.percentage)
      return Math.min(...percentages)
    }
  },
  mounted() {
    // recalculate right shadow
    this.scroll.end =
      this.$refs.items.scrollWidth - this.$refs.items.scrollLeft ===
      this.$refs.items.clientWidth

    // detect mouse movement for smaller displays
    this.$refs.items.addEventListener('mousedown', event => {
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
    this.$refs.items.addEventListener('mousemove', event => {
      event.preventDefault()
      if (this.scroll.enabled) {
        this.$refs.items.scrollLeft =
          this.scroll.scrollLeft + this.scroll.clientX - event.pageX
        this.scroll.start = this.$refs.items.scrollLeft
        this.scroll.end =
          this.$refs.items.scrollWidth - this.$refs.items.scrollLeft ===
          this.$refs.items.clientWidth
      }
    })
  },
}
</script>

<style lang="scss">
.items {
  user-select: none;
  overflow-x: auto;
  overflow: -moz-scrollbars-none; // FF
  -ms-overflow-style: none; // IE 10+
  scrollbar-width: none; // FFF 64
  &::-webkit-scrollbar {
    display: none; // Safari and Chrome
  }

  &.moving {
    cursor: w-resize;
  }

  &__content {
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
    background: #202721;
  }

  &.blue {
    background: #202027;
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
        opacity: 0.7;
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
      background: url(/images/blueprint.png) center center no-repeat;
      background-size: contain;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
}
</style>
