<template>
  <svg
    :width="size + 'px'"
    :height="size + 'px'"
    :fill="color">
    <circle :cx="size/2" :cy="size/2" :r="size/2"/>
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    size: {
      type: Number,
      default: 10,
    },
    color: {
      type: String,
      default: '#fff',
    },
  },
}
</script>
