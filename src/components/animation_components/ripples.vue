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
      default () {
        return "white";
      },
    },
    size: {
      type: Number,
      default () {
        return 10;
      },
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
      transform: scale(1);
      opacity: .2;
    }
    40%{
      transform: scale(1.4);
      opacity: .3;
    }
    60%{
      transform: scale(1.6);
      opacity: .2;
    }
    80%{
      transform: scale(1.8);
      opacity: .1;
    }
    100%{
      transform: scale(2);
      opacity: 0;
    }
  }
	.animation-wrapper {
		background-position: 0 0;
		border-radius: 50%;
		position: relative;
	}

  .animation-wrapper span {
    position: absolute;
    left: 0;
    bottom: 0;
    opacity: .1;
    border-radius: 50%;
    animation: ripples 2s linear infinite;
		-moz-animation: ripples 2s linear infinite;
		-webkit-animation: ripples 2s linear infinite;
		-o-animation: ripples 2s linear infinite;
    z-index: -1;
  }
</style>
