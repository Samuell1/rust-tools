<template>
    <div class="dropdown">
        <button class="button" @click="toggle">{{ name }}</button>
        <div class="content" v-if="show">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    name: String
  },
  data: () => ({
    show: false
  }),
  methods: {
    close () {
      this.show = false
    },
    open () {
      this.show = true
    },
    toggle () {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss">
.dropdown {
    position: relative;
    display: inline-block;
    .content {
        display: flex;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 160px;
        box-shadow: 0 3px 14px -.5px rgba(0,8,16,.08);
        z-index: 1;
        flex-direction: column;
        bottom: 40px;
        right: 0;
        b {
            padding: 8px 16px;
            font-size: 12px;
        }
        a {
            display: block;
            padding: 8px 16px 4px 16px;
            margin-right: 0;
            &:hover {
                background: $gray;
            }
            &.active {
                font-weight: bold;
            }
        }
    }
    .button {
        background: darker($gray, 10%);
        padding: 8px;
        display: flex;
        align-items: center;
    }
}
</style>
