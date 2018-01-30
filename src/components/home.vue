<template>
  <div id="home">    
    <mapBase class="map"/>
    <myResource class="resource"/>
    <myTools class="maptool"/>
    <sourceList class="resourceList"/>
    <layerEdit class="layerEdit"/>
    <filterTools class="filterTools"/>
    <addLineInfo/> 
  </div>
</template>

<script>
import mapBase from "./base/map";
import myResource from "./base/resource";
import myTools from "./base/mapTools";
import sourceList from "./base/sourceList";
import filterTools from "./base/filterTools";
import layerEdit from "./base/layerEdit";
import addLineInfo from "./base/addLineInfo";

export default {
  name: "home",
  components: {
    mapBase,
    myResource,
    myTools,
    sourceList,
    filterTools,
    layerEdit,
    addLineInfo
  }
};
</script>

<style>
#home {
  width: 100%;
  height: 100%;
}
.maptool {
  width: 50%;
  position: absolute;
  top: 1%;
  left: 3%;
  text-align: left;
}
.resource {
  width: 100%;
  position: absolute;
  bottom: 20px;
  text-align: center;
}
.resourceList {
  position: absolute;
  top: 15%;
  left: 3%;
}
.layerEdit {
  position: absolute;
  top: 10%;
  left: 3%;
}
.filterTools {
  position: absolute;
  top: 5%;
  left: 3%;
}
.map {
  width: 100%;
  height: 100%;
}
</style>
