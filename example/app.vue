<template>
  <div class="map-example">
    <ul class="menu">
      <li>
        <router-link to="/map-point">
          marker
        </router-link>
      </li>
      <li>
        <router-link to="/regions">
          regions
        </router-link>
      </li>
    </ul>
    <router-view />
  </div>
</template>

<style lang="scss">
  // move to reset, then let style be scoped
  html,
  body,
  .map-example {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  .menu {
    position: absolute;
    z-index: 9;
    background: #4196ff;
  }
</style>
