<template>
    <div id="div_map">
      <div id="mymap" tabindex="0"/>
      <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>
    </div>
</template>

<script>
import map from "../utils/bmap";

export default {
  name: "div_map",
  mounted() {
    this.init();
  },
  methods: {    
    init() {
      map.setTarget("mymap");      
    },
    test(event) {
      console.log('test2=================')
    }
  }
};
</script>

<style>

</style>
