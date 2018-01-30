<template>
    <div id="resource">
      <!-- <button title="aaaa" name="aaaa" v-on:click="aaaa">aaaa</button>
      <button title="bbbb" name="bbbb" v-on:click="bbbb">bbbb</button> -->
      <div class="resource_tab_button">
        <el-button v-if="!jk_on_map" type="danger" @click="jkChange">监控</el-button>
        <el-button v-if="jk_on_map" @click="jkChange" type="primary">监控</el-button>
      </div>
      <div class="resource_tab_button">
        <el-button v-if="!olt_on_map" type="danger" @click="oltChange">OLT</el-button>
        <el-button v-if="olt_on_map" @click="oltChange" type="primary">OLT</el-button>
      </div>
      <div class="resource_tab_button">
        <el-button v-if="!onu_on_map" type="danger" @click="onuChange">ONU</el-button>
        <el-button v-if="onu_on_map" @click="onuChange" type="primary">ONU</el-button>
      </div>
      <div class="resource_tab_button">
        <el-button v-if="!gl_on_map" type="danger" @click="glChange">光缆</el-button>
        <el-button v-if="gl_on_map" @click="glChange" type="primary">光缆</el-button>
      </div>
    </div>
</template>

<script>
import map from "../utils/bmap";
import { layerc1, isShowLayer1 } from "../layers/layerC1";
import { layerc2, isShowLayer2 } from "../layers/layerC2";
import { layerc3, isShowLayer3 } from "../layers/layerC3";
import { layerc4, isShowLayer4 } from "../layers/layerC4";

export default {
  name: "resource",
  data() {
    return {
      jk_on_map: true,
      olt_on_map: true,
      onu_on_map: true,
      gl_on_map: true
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      map.addLayer(layerc1);
      map.addLayer(layerc2);
      map.addLayer(layerc3);
      map.addLayer(layerc4);
    },
    jkChange() {
      if (this.jk_on_map) {
        this.jk_on_map = !this.jk_on_map;
        map.removeLayer(layerc1);
        isShowLayer1(false);
      } else {
        this.jk_on_map = !this.jk_on_map;
        map.addLayer(layerc1);
        isShowLayer1(true);
      }
    },
    oltChange() {
      if (this.olt_on_map) {
        this.olt_on_map = !this.olt_on_map;
        map.removeLayer(layerc2);
        isShowLayer2(false);
      } else {
        this.olt_on_map = !this.olt_on_map;
        map.addLayer(layerc2);
        isShowLayer2(true);
      }
    },
    onuChange() {
      if (this.onu_on_map) {
        this.onu_on_map = !this.onu_on_map;
        map.removeLayer(layerc3);
        isShowLayer3(false);
      } else {
        this.onu_on_map = !this.onu_on_map;
        map.addLayer(layerc3);
        isShowLayer3(true);
      }
    },
    glChange() {
      if (this.gl_on_map) {
        this.gl_on_map = !this.gl_on_map;
        map.removeLayer(layerc4);
        isShowLayer4(false);
      } else {
        this.gl_on_map = !this.gl_on_map;
        map.addLayer(layerc4);
        isShowLayer4(true);
      }
    }
  }
};
</script>
<style scoped>
.resource_tab_button {
  margin-left: 10px;
  display: inline-block;
  display: inline;
  zoom: 1;
}
</style>
