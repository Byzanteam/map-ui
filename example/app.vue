<template>
  <div class="map-example">
    <ul class="menu">
      <li>
        <router-link to="/marker">
          marker
        </router-link>
      </li>
      <li>
        <router-link to="/elastic_marker">
          elastic_marker
        </router-link>
      </li>
      <li>
        <router-link to="/regions">
          regions
        </router-link>
      </li>
      <li>
        <router-link to="/label-marker">
          labelMarker
        </router-link>
      </li>
      <li>
        <router-link to="/heat-map">
          heatMap
        </router-link>
      </li>
      <li>
        <router-link to="/airline">
          airline
        </router-link>
      </li>
      <li>
        <router-link to="/cluster">
          cluster
        </router-link>
      </li>
      <li>
        <router-link to="/stratum_marker">
          stratum_marker
        </router-link>
      </li>
      <li>
        <router-link to="/custom_marker">
          custom_marker
        </router-link>
      </li>
      <li>
        <router-link to="/info_window">
          info_window
        </router-link>
      </li>
      <li>
        <router-link to="/canvas-layer">
          canvas_layer
        </router-link>
      </li>
      <li>
        <router-link to="/3d">
          3D
        </router-link>
      </li>
      <li>
        <router-link to="/pathReplay">
          pathReplay
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
