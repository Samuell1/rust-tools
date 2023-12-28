<template>
  <div class="gradients">
    <div ref="items" class="items">
      <div class="items__content">
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
            <img class="icon" :src="`/images/items/${loot.image}`"/>
            <div v-if="loot.blueprint" class="blueprint"></div>
          </div>
          <div class="title">{{ loot.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LootList',
  props: ['crate', 'filter'],
  computed: {
    loots() {
      return this.crate.loots.filter(item => {
        return (
          (this.filter.hideBlueprints ? item.blueprint === false : true) &&
          (this.filter.hideMiscCategory && item.category
            ? item.category.name !== 'Misc'
            : true)
        )
      })
    },
    maxPercentage() {
      const percentages = this.loots.map(item => item.percentage)
      return Math.max(...percentages)
    },
    minPercentage() {
      const percentages = this.loots.map(item => item.percentage)
      return Math.min(...percentages)
    }
  },
}
</script>

<style lang="scss">
.items {
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
