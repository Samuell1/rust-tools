<script>
import {computed, h, onBeforeUnmount, onMounted, reactive, ref} from "vue"

export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    srcPlaceholder: {
      type: String,
      default: '/images/lazy-image.png'
    }
  },
  inheritAttrs: false,
  setup(props, {attrs, slots, emit}) {
    const root = ref(null);
    const data = reactive({
      observer: null,
      intersected: false,
      loaded: false
    })

    const srcImage = computed(() =>
      data.intersected && props.src ? props.src : props.srcPlaceholder
    )

    const load = () => {
      if (
        root.value &&
        root.value.getAttribute("src") !== props.srcPlaceholder
      ) {
        data.loaded = true;
        emit("load", root.value)
      }
    }
    const error = () => emit("error", root.value)

    onMounted(() => {
      if ("IntersectionObserver" in window) {
        data.observer = new IntersectionObserver((entries) => {
          const image = entries[0];
          if (image.isIntersecting) {
            data.intersected = true;
            data.observer.disconnect();
            emit("intersect");
          }
        }, props.intersectionOptions);

        data.observer.observe(root.value);
      }
    });

    onBeforeUnmount(() => {
      if ("IntersectionObserver" in window && data.observer) {
        data.observer.disconnect();
      }
    });

    return () => {
      return h("img", {
        ref: root,
        src: srcImage.value,
        ...attrs,
        class: [
          attrs.class,
          'lazy-image',
          {'loaded': data.loaded}
        ],
        onLoad: load
      })
    }
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
