<template>
  <div
    :style="{ width: mapedSize, height: mapedSize }"
    class="animation-wrapper">
    <slot name="svg-icon" />
    <span
      :style="{ width: mapedSize, height: mapedSize, background: color }"
      class="animation-ripples">
    </span>
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
      return `${this.size * 2}px`;
    },
  },
};
</script>
