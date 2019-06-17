<template>
  <div
    class="animation-wrapper"
    :style="{ width: mapedSize, height: mapedSize }">
    <slot name="svg-icon"></slot>
    <span class="animation-ripples" :style="{ width: mapedSize, height: mapedSize, background: color }"></span>
  </div>
</template>

<script>
export default {
  name: 'Ripples',
  props: {
    color: {
      type: String,
      default: '#fff',
    },
    size: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    mapedSize () {
      return this.size * 2 + 'px';
    },
  },
}
</script>
