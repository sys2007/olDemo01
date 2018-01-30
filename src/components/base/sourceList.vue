<template>
  <div id="sourceList" :class="{statisticsopen:openyes,statisticsclose:!openyes}">
    <el-button size="mini" style="width: 100%;background-color:rgba(0,60,136,.5);" type="primary"
               @click="statisticsOpen">资源列表
    </el-button>
    <el-collapse v-show="openyes" v-model="activeNames">
      <el-collapse-item title="监控" name="1">
        <el-table
          @row-click="layerC1Click"
          size="mini"
          :data="layerC1Data_1"
          style="width: 100%">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="安装地点"
            min-width="300">
          </el-table-column>
        </el-table>
        <el-pagination          
          small
          :current-page='currentPage'
          :page-size='pageSize'
          @current-change="pageChangeHandle"
          layout="prev, pager, next"
          :total="this.layerC1Data.length">
        </el-pagination>
      </el-collapse-item>
      <el-collapse-item title="OLT" name="2">
        <el-table
          @row-click="layerC2Click"
          size="mini"
          :data="layerC2Data"
          style="width: 100%">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="安装地点"
            min-width="300">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="ONU" name="3">
        <el-table
          @row-click="layerC3Click"
          size="mini"
          :data="layerC3Data"
          style="width: 100%">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="安装地点"
            min-width="300">
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="光缆" name="4">
        <el-table
          @row-click="layerC4Click"
          size="mini"
          :data="layerC4Data"
          style="width: 100%">
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="安装地点"
            min-width="300">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>

</template>
<script>
import ol from "ol";
import pagehelper from "../utils/pagehelper";
import { layerc1 } from "../layers/layerC1";
import { layerc2 } from "../layers/layerC2";
import { layerc3 } from "../layers/layerC3";
import { layerc4 } from "../layers/layerC4";

export default {
  data() {
    return {
      pageSize: 500,
      currentPage: 1,
      openyes: false,
      activeNames: ["1"],
      layerC1Data_1: []
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {},
    pageChangeHandle(val) {
      this.layerC1Data_1 = pagehelper(this.layerC1Data, this.pageSize, val);
    },
    statisticsOpen() {
      this.openyes = !this.openyes;
    },
    layerC1Click(row, event, column) {
      layerc1
        .getSource().getSource()
        .getFeatureById(row.UID)
        .dispatchEvent({ type: "featureClick" });
    },
    layerC2Click(row, event, column) {
      layerc2
        .getSource().getSource()
        .getFeatureById(row.UID)
        .dispatchEvent({ type: "featureClick" });
    },
    layerC3Click(row, event, column) {
      layerc3
        .getSource().getSource()
        .getFeatureById(row.UID)
        .dispatchEvent({ type: "featureClick" });
    },
    layerC4Click(row, event, column) {
      layerc4
        .getSource()
        .getFeatureById(row.UID)
        .dispatchEvent({ type: "featureClick" });
    }
  },
  watch: {
    layerC1Data(val) {
      if (val.length > 0) {
        this.pageChangeHandle(this.currentPage);
      } else {
        this.layerC1Data_1 = [];
      }
    }
  },
  computed: {
    layerC1Data() {
      return this.$store.state._global.layerC1Data;
    },
    layerC2Data() {
      return this.$store.state._global.layerC2Data;
    },
    layerC3Data() {
      return this.$store.state._global.layerC3Data;
    },
    layerC4Data() {
      return this.$store.state._global.layerC4Data;
    }
  }
};
</script>
<style>
.statisticsclose {
  position: absolute;
}

.statisticsopen {
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 600px;
  position: absolute;
  width: 20%;
}

.statisticsopen {
  overflow-x: hidden;
  overflow-y: hidden;
  max-height: 600px;
  position: absolute;
  width: 20%;
}

.statisticsopen .el-collapse-item__header {
  background-color: #fafaff;
  font-weight: bold;
  padding-left: 10px;
}

.statisticsopen .el-collapse-item__content {
  max-height: 240px;
  overflow: auto;
}
</style>
