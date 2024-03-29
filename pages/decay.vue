<template>
  <div>
    <div class="page-title">
      <h1>Wall Decay</h1>
      <p>Calculated time is not 100% accurate because buildings decay from outside to inside layers with different
        timers!</p>
    </div>

    <div class="decay">
      <div class="walls">
        <div
          :class="['wall', { 'active': selectedWall === wallName }]"
          v-for="(wall, wallName, index) in walls"
          :key="wallName"
          @click="selectWall(wallName)"
          :style="{ backgroundImage: `url(${getImage(index)})` }"
        >
          <span class="name">{{ wallName }}</span>
          <span class="hp">Full hp: {{ wall.hp }}</span>
        </div>
      </div>

      <div class="decay-panel">
        <div class="hp-input">
          <label>Health of wall:</label>
          <input type="text" v-model.number="hp" placeholder="HP" size="2"/>
        </div>

        <div class="result">
          <span v-if="time > 0">
            Wall will decay in
            <b>{{ exactTime }}</b>
          </span>
          <span v-else>Wall is already decayed!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: () => ({
    title: 'Rust Wall Decay',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Calculate how much time wall will take to decay.'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'rust, playrust, decay, wall, twig, stone, metal, armored, calculcate'
      }
    ]
  }),
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
    time() {
      const wall = this.walls[this.selectedWall]
      const decayRateMinute = wall.hp / wall.decayTime / 60
      return (this.hp / decayRateMinute).toFixed(2)
    },
    exactTime() {
      const hours = Math.floor(this.time / 60)
      const minutes = (this.time % 60).toFixed(1)

      return `${hours ? `${hours} hour(s)` : ``} ${
        minutes > 0 ? `${minutes} minute(s)` : ``
      }`
    }
  },
  methods: {
    getImage(index) {
      return `/images/walls/${index}.png`
    },
    selectWall(wall) {
      this.selectedWall = wall
    }
  }
}
</script>

<style lang="scss">
.decay {
  max-width: 1000px;
  margin: 0 auto;
}

.walls {
  display: flex;
  flex-flow: wrap row;
  gap: 6px;
  margin-bottom: 6px;

  .wall {
    background-size: cover;
    background-position: center center;
    flex: 160px;
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: $white;
    text-shadow: 0px 0px 10px #000, 0px 0px 5px #000;
    text-transform: uppercase;
    font-weight: 500;
    position: relative;
    cursor: pointer;

    .hp {
      background: transparentize($black, 0.5);
      color: $white;
      font-size: 12px;
      border-radius: 3px;
      padding: 2px 4px;
      margin: 4px;
    }

    .name {
      display: block;
      width: 100%;
      text-align: center;
      padding: 6px 0;
    }

    &.active {
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid $primary;
      }
    }

    &:hover {
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid $primary;
      }
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
        outline: 1px solid $primary;
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
