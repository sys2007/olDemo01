<template>
    <div id="filterDiv">        
        <el-button size="mini" style="background-color:rgba(0,60,136,.5);" type="primary" @click="showTools">查询</el-button>        
        <div v-if="toolsShow" style="display: inline">
            <el-select v-model="queryType" placeholder="请选择" size="mini" style="width:120px">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>        
            <el-input size="mini" v-model="queryLabel" placeholder="请输入内容" style="width:120px"></el-input>
            <el-button size="mini" type="primary" plain @click= "propertiesQuery">属性查询</el-button>
            <el-button size="mini" type="primary" plain @click= "spatialQuery">拉框查询</el-button>
            <el-button size="mini" type="primary" plain @click= "resetQuery">重置</el-button>
        </div>
    </div>
</template>

<script>
import { layerc1, queryFilter, spatialQueryFilter } from "../layers/layerC1";
import { layerc2, queryFilter2, spatialQueryFilter2 } from "../layers/layerC2";
import { layerc3, queryFilter3, spatialQueryFilter3 } from "../layers/layerC3";

import bmap from "../utils/bmap";
import BmapUtils from "../utils/BmapUtils";
import Polygon from "ol/geom/polygon";
let bmapUtils = new BmapUtils();
export default {
  name: "filterDiv",
  data() {
    return {
      drawInteraction: null,
      drawLayer: null,
      toolsShow: false,
      queryLabel: "",
      queryType: "name",
      options: [{ value: "tempId", label: "ID" }, { value: "name", label: "名称" }]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let { drawInteraction, drawLayer } = bmapUtils.drawRectangle(
        this.afterDrawRectangle
      );
      this.drawInteraction = drawInteraction;
      this.drawLayer = drawLayer;
      if (this.drawLayer) {
        this.drawLayer.setZIndex(-1);
        bmap.addLayer(this.drawLayer);
      }
    },
    showTools() {
      this.toolsShow = !this.toolsShow;
    },
    propertiesQuery() {
      queryFilter(this.queryType, this.queryLabel);
      queryFilter2(this.queryType, this.queryLabel);
      queryFilter3(this.queryType, this.queryLabel);
    },
    spatialQuery() {
      if (this.drawInteraction) {
        bmap.addInteraction(this.drawInteraction);
      }
      if (this.drawLayer) {
        this.drawLayer.getSource().clear();
      }
    },
    resetQuery() {
      if (this.drawInteraction) {
        bmap.removeInteraction(this.drawInteraction);
      }
      if (this.drawLayer) {
        this.drawLayer.getSource().clear();
      }
      this.queryLabel = ''
      queryFilter();
      queryFilter2();
      queryFilter3();
    },
    afterDrawRectangle(feature) {
      if (this.drawInteraction) {
        bmap.removeInteraction(this.drawInteraction);
      }
      let geometry = feature.getGeometry();
      geometry.transform("EPSG:3857", "EPSG:4326");
      if (geometry instanceof Polygon) {
        let [tooltipCoord] = geometry.getCoordinates();
        if (tooltipCoord) {
          let coords = "";
          tooltipCoord.forEach(
            ([element0, element1]) => (coords += `,${element0} ${element1}`)
          );
          coords = coords.substr(1);
          spatialQueryFilter(coords);
          spatialQueryFilter2(coords);
          spatialQueryFilter3(coords);          
        }
      }
    }
  }
};
</script>
<style scoped>

</style>
