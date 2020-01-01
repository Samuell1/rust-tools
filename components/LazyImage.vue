<script>
export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String
    },
    alt: {
      type: String
    },
    srcPlaceholder: {
      type: String,
      default: '/lazy-image.png'
    }
  },
  inheritAttrs: false,
  data: () => ({
    observer: null,
    intersected: false,
    loaded: false
  }),
  computed: {
    srcImage () {
      return this.intersected && this.src ? this.src : this.srcPlaceholder
    }
  },
  methods: {
    load () {
      if (this.$el.getAttribute('src') !== this.srcPlaceholder) {
        this.loaded = true
      }
    }
  },
  mounted () {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        const image = entries[0]
        if (image.isIntersecting) {
          this.intersected = true
          this.observer.disconnect()
        }
      }, this.intersectionOptions)
      this.observer.observe(this.$el)
    } else {
      // callback
      this.intersected = true
    }
  },
  destroyed () {
    if ('IntersectionObserver' in window) {
      this.observer.disconnect()
    }
  },
  render (h) {
    return h('img', {
      attrs: {
        src: this.srcImage,
        srcset: this.srcsetImage
      },
      domProps: this.$attrs,
      class: {
        'lazy-image': true,
        loaded: this.loaded
      },
      on: { load: this.load }
    })
  }
}
</script>

<style lang="scss">
.lazy-image {
  filter: blur(10px);
  transition: filter 0.3s;
  &.loaded {
    filter: blur(0);
  }
}
</style>
