<template>
  <div id="layerEdit">
    <el-button type="primary" @click="showDiv" size="mini">编辑</el-button>
    <el-checkbox-group v-if="toolsShow" v-model="checkList" style="display: inline">
      <el-checkbox label="选择" border @change="selectChangedCheckBox"></el-checkbox>
      <el-checkbox label="编辑" border @change="editChangedCheckBox"></el-checkbox>
      <el-checkbox label="添加" v-model="addCbx" border @change="addChangedCheckBox"></el-checkbox>
    </el-checkbox-group>
    <el-button v-if="toolsShow" size="mini" type="primary" plain @click= "delClick" style="display: inline">删除</el-button>
    <el-button v-if="toolsShow" size="mini" type="primary" plain @click= "saveClick" style="display: inline">保存</el-button>
  </div>
</template>
<script>
import bmap from "../utils/bmap";
import BmapUtils from "../utils/BmapUtils";
import Feature from "ol/Feature";
import LineString from "ol/geom/linestring";
import MultiLineString from "ol/geom/multilinestring";
import { mapActions } from "vuex";
import { layerc4, layerc4QueryWfs } from "../layers/layerC4";
let bmapUtils = new BmapUtils();
let newId = 4;
export default {
  data() {
    return {
      addCbx: false,
      operator: "update",
      toolsShow: false,
      drawLayer: null,
      selectInteraction: null,
      modifyInteraction: null,
      drawInteraction: null,
      modifiedFeature: null,
      checkList: []
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    addLineVisible() {
      return this.$store.state._global.windowAddLineVisible;
    }
  },
  watch: {
    addLineVisible: function(val, oldVal) {
      if (!val) {
        let form = this.$store.state._global.addLineFrom;
        this.addLineHandle(form);
      }
    }
  },
  methods: {
    ...mapActions(["addLineVisibleHandle"]),
    init() {
      this.selectInteraction = bmapUtils.selectInteraction(layerc4);
      this.modifyInteraction = bmapUtils.modifyInteraction({
        selectInteraction: this.selectInteraction,
        callback: this.afterModifyFeature
      });
      let { drawInteraction, drawLayer } = bmapUtils.drawLine(
        this.afterAddFeature
      );
      this.drawInteraction = drawInteraction;
      this.drawLayer = drawLayer;
      bmap.addLayer(this.drawLayer);
    },
    showDiv() {
      this.toolsShow = !this.toolsShow;
    },
    selectChangedCheckBox(value) {
      if (value) {
        bmap.addInteraction(this.selectInteraction);
      } else {
        bmap.removeInteraction(this.selectInteraction);
      }
    },
    editChangedCheckBox(value) {
      if (value) {
        this.operator = "update";
        bmap.addInteraction(this.modifyInteraction);
      } else {
        bmap.removeInteraction(this.modifyInteraction);
      }
    },
    addChangedCheckBox(value) {
      if (value) {
        console.log(this.addCbx);
        this.operator = "add";
        bmap.addInteraction(this.drawInteraction);
      } else {
        this.drawLayer.getSource().clear();
        bmap.removeInteraction(this.drawInteraction);
      }
    },
    /**
     * 编辑后获取当前元素
     * @augments */
    afterModifyFeature(features) {
      this.modifiedFeature = features;
    },
    /**
     * 加线后获取当前元素
     * @augments */
    afterAddFeature(features) {
      bmap.removeInteraction(this.drawInteraction);
      this.modifiedFeature = features;
      this.addLineVisibleHandle(true);
    },
    saveClick() {
      let _id = newId++;
      if (this.operator === "add") {
      } else {
        bmapUtils.onSave(this.modifiedFeature);
      }
    },
    /**
     * 添加线缆
     * @augments */
    addLineHandle(form = null) {
      if (form) {
        // 转换坐标
        var geometry = this.modifiedFeature.getGeometry().clone();
        geometry.transform("EPSG:3857","EPSG:4326")
        geometry.applyTransform(function(
          flatCoordinates,
          flatCoordinates2,
          stride
        ) {
          for (var j = 0; j < flatCoordinates.length; j += stride) {
            var y = flatCoordinates[j];
            var x = flatCoordinates[j + 1];
            flatCoordinates[j] = x;
            flatCoordinates[j + 1] = y;
          }
        });
        // 设置feature对应的属性，这些属性是根据数据源的字段来设置的
        let newFeature = new Feature();
        let _id = new Date().getTime();
        newFeature.setGeometryName("location");
        newFeature.set("id", _id);
        newFeature.set("location", null);
        newFeature.set("name", form.name);
        newFeature.set("platformId", form.platformId);
        newFeature.set("Tags", form.Tags);
        newFeature.set("ssqy", form.ssqy);
        newFeature.set("sspt", form.sspt);
        newFeature.setGeometry(new LineString(geometry.getCoordinates()));
        // newFeature.setId(`c4_projections.new.${bb}`);
        bmapUtils.addWfs([newFeature], this.afterSaveAddFeature);
      }
    },
    delClick() {
      // 删选择器选中的feature
      if (this.selectInteraction.getFeatures().getLength() > 0) {
        bmapUtils.deleteWfs([this.selectInteraction.getFeatures().item(0)]);
      }
    },
    /**
     * 线缆保存后方法
     * @augments */
    afterSaveAddFeature() {
      this.addCbx = false;
      this.drawLayer.getSource().clear();
      bmap.removeInteraction(this.drawInteraction);
      bmap.removeLayer(layerc4);
      layerc4QueryWfs();
      bmap.addLayer(layerc4);
    }
  }
};
</script>
<style scoped>

</style>
