// template 渲染还是 render 渲染？
<template>
  <div />
</template>

<script>
export default {
  inject: ['instance'],

  computed: {
    map () {
      return this.instance.map;
    },
  },

  watch: {
    map () {
      // map ready
    },
  },
};
</script>
