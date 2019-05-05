<template>
  <div class="decay">
    <h2 class="title">Rust Wall decay</h2>
    <div class="walls">
      <div :class="['wall', { 'active': selectedWall === wallName }]" v-for="(wall, wallName, index) in walls" :key="wallName" @click="selectWall(wallName)" :style="{ backgroundImage: `url(${getImage(index)})` }">
        <span>{{ wallName }}</span>
        <span class="hp">Full hp: {{ wall.hp }}</span>
      </div>
    </div>

    <div class="decay-panel">
      <div class="hp-input">
        <label>Health of wall:</label>
        <input type="text" v-model.number="hp" placeholder="HP" size="2" autofocus>
      </div>

      <div class="result">
        <span v-if="time > 0">Wall will decay in <b>{{ exactTime }}</b></span>
        <span v-else>Wall is already decayed!</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'centered',
  data: () => ({
    walls: {
      twig: {
        hp: 10,
        decayTime: 1
      },
      wood: {
        hp: 250,
        decayTime: 3
      },
      stone: {
        hp: 500,
        decayTime: 5
      },
      metal: {
        hp: 1000,
        decayTime: 8
      },
      armored: {
        hp: 2000,
        decayTime: 12
      }
    },

    hp: 10,
    selectedWall: 'twig'
  }),
  computed: {
    time () {
      const wall = this.walls[this.selectedWall]
      const decayRateMinute = (wall.hp / wall.decayTime) / 60
      return (this.hp / decayRateMinute).toFixed(2)
    },
    exactTime () {
      const hours = Math.floor(this.time / 60)
      const minutes = (this.time % 60).toFixed(1)

      return `${hours ? `${hours} hour(s)` : ``} ${minutes > 0 ? `${minutes} minute(s)` : ``}`
    }
  },
  methods: {
    getImage (index) {
      return `https://rustlabs.com/img/screenshots/wall${index}.png`
    },
    selectWall (wall) {
      this.selectedWall = wall
    }
  }
}
</script>

<style lang="scss">
@import 'assets/_variables.scss';

.decay {
  padding: 60px 0;
}

.walls {
  display: flex;
  flex-flow: wrap row;
  margin: 0 -2px 6px -2px;
  .wall {
    margin: 2px;
    background-size: cover;
    background-position: center center;
    flex: 128px;
    height: 128px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: $white;
    text-shadow: 0px 0px 3px #000;
    text-transform: uppercase;
    .hp {
      background: transparentize($black, .5);
      color: $white;
      font-size: 10px;
      border-radius: 3px;
      padding: 2px 4px;
      margin-top: 8px;
    }
    &.active {
      box-shadow: inset 0 0 0px 1px $primary;
    }
    &:hover {
      cursor: pointer;
      box-shadow: inset 0 0 0px 1px $primary;
    }
  }
}

.decay-panel {
  display: flex;
  flex-flow: wrap row;
  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
  .hp-input {
    background: $secondaryBackground;
    border: 0px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    @media screen and (max-width: 600px) {
      flex-grow: 1;
    }
    label {
      padding: 6px 16px;
      white-space: nowrap;
    }
    input {
      color: $secondaryText;
      background: lighten($secondaryBackground, 2%);
      width: 80px;
      height: 60px;
      font-size: 18px;
      padding: 16px;
      @media screen and (max-width: 600px) {
        width: 100%;
      }
      &:focus {
        background: lighten($secondaryBackground, 5%);
      }
    }
  }
  .result {
    display: flex;
    align-items: center;
    padding: 16px;
    margin-left: 6px;
    background: $secondaryBackground;
    flex-grow: 1;
    @media screen and (max-width: 600px) {
      margin-left: 0px;
      margin-top: 6px;
    }
    b {
      color: $primary;
    }
  }
}

</style>
