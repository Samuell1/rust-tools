<template>
  <div :class="['checkbox',{ 'checked': checked }]" @click="toggle">
    <span class="label"></span>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    name: String
  },
  model: {
    prop: 'checked',
    event: 'change'
  },
  data: () => ({
    checked: false
  }),
  watch: {
    checked () {
      this.$emit('change', this.checked)
    }
  },
  methods: {
    toggle () {
      this.checked = !this.checked
    }
  }
}
</script>

<style lang="scss">
.checkbox {
  position: relative;
  padding: 6px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  input {
    display: none;
  }
  .label {
    margin-right: 6px;
    position: relative;
    height: 24px;
    width: 24px;
    background-color: lighten($secondaryBackground, 5%);
    border-radius: 5px;
    border: 2px solid lighten($secondaryBackground, 5%);
  }
  &.checked .label::after {
    opacity: 1;
  }
  .label::after {
    transform: rotate(45deg) scale(1);
    position: absolute;
    content: '';
    left: 8px;
    top: 3px;
    width: 6px;
    height: 12px;
    border-radius: 0;
    border: solid $primary;
    opacity: 0;
    border-width: 0 2px 2px 0;
    transition: opacity 0.3s;
    background-color: transparent;
  }
}
</style>
