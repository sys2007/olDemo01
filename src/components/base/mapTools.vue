<template>
  <div id="maptool">
    <el-button type="primary" class="maptool_button" @click="showTools" size="mini">工具</el-button>
    <el-button v-if="toolsShow" type="success" class="maptool_button" @click="drawLine" size="mini">测距</el-button>
    <el-button v-if="toolsShow" type="success" class="maptool_button" @click="drawArea" size="mini">面积</el-button>
    <el-button v-if="toolsShow" type="success" class="maptool_button" @click="exportPNG" size="mini">导出</el-button>
    <el-button v-if="toolsShow" type="success" class="maptool_button" @click="renderMapCenter" size="mini">居中</el-button>
    <el-button v-if="toolsShow" type="success" class="maptool_button" @click="cleanMap" size="mini">清除</el-button> 
  </div>
</template>
<script>
import drawOverlay from "../utils/mapTools";

export default {
  data() {
    return {
      toolsShow: false
    };
  },
  methods: {
    showTools() {
      this.toolsShow = !this.toolsShow;
    },
    drawLine() {
      drawOverlay("LineString");
    },
    drawArea() {
      drawOverlay("Polygon");
    },
    exportPNG() {
      //参考： http://openlayers.org/en/latest/examples/export-map.html?q=format
        drawOverlay('exportPNG');
    },
    renderMapCenter() {
      drawOverlay("center");
    },
    cleanMap() {
      drawOverlay("clear");
    }
  }
};
</script>
<style scoped>
.maptool_button {
  border: 0;
  display: inline;
  zoom: 1;
  background-color: rgba(0, 60, 136, 0.5);
}

#maptool .el-button + .el-button {
  margin-left: 0px;
}
</style>
