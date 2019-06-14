<template>
  <div
    class="animation-wrapper"
    :style="{ width: mapedSize, height: mapedSize }">
    <slot name="svg-icon"></slot>
    <span :style="{ width: mapedSize, height: mapedSize, background: color }"></span>
  </div>
</template>

<script>
export default {
  name: "Ripples",
  props: {
    color: {
      type: String,
      default: "#fff",
    },
    size: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    mapedSize () {
      return this.size * 2 + 'px'
    }
  }
}
</script>

<style>
  @keyframes ripples {
    0%{
      opacity: .2;
      transform: scale(1);
    }
    40%{
      opacity: .3;
      transform: scale(1.4);
    }
    60%{
      opacity: .2;
      transform: scale(1.6);
    }
    80%{
      opacity: .1;
      transform: scale(1.8);
    }
    100%{
      opacity: 0;
      transform: scale(2);
    }
  }
	.animation-wrapper {
		background-position: 0 0;
		border-radius: 50%;
		position: relative;
	}

  .animation-wrapper span {
    animation: ripples 2s linear infinite;
    left: 0;
    bottom: 0;
    border-radius: 50%;
    opacity: .1;
    position: absolute;
    z-index: -1;
  }
</style>
