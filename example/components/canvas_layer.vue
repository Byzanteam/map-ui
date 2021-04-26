<template>
  <base-map
    :map-options="{
      zoom: 15,
      center: [116.335183, 39.941735]
    }"
    use-map-ui
  >
    <canvas-layer
      ref="canvasLayer"
      :draw="draw"
      :canvas="canvas"
      :options="{
        bounds: [
          [116.328911, 39.937229],
          [116.342659, 39.946275]
        ],
        zooms: [3, 18],
      }"
    />
  </base-map>
</template>

<script>
import BaseMap from '../../src/components/map.vue';
import { CanvasLayer } from '../../src/components/canvas_layer.vue';

export default {
  components: {
    BaseMap,
    CanvasLayer,
  },

  data () {
    return {
      context: null,
      canvas: null,
    };
  },

  created () {
    this.initCanvas();
  },

  methods: {
    initCanvas () {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 200;
      this.canvas.height = 200;

      this.context = this.canvas.getContext('2d');
      this.context.fillStyle = 'rgb(0,100,255)';
      this.context.strokeStyle = 'white';
      this.context.globalAlpha = 1;
      this.context.lineWidth = 2;

      this.radious = 0;
    },
    draw () {
      const { context } = this;
      context.clearRect(0, 0, 200, 200);
      context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1;
      this.radious = (this.radious + 1) % 100;

      context.beginPath();
      context.arc(100, 100, this.radious, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
    },
  },
};
</script>
