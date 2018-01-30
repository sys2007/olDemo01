<template>
  <el-dialog
    title="光缆信息"
    width="30%"
    :before-close="preClose"
    :modal="false"
    :close-on-click-modal="false"
    @open="preOpen"
    :visible.sync="addLineVisible">
    <el-form :rules="rules" ref="form" :model="form">
      <el-form-item label="编号" :label-width="formLabelWidth">
        <el-input v-model="form.platformId" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="标签" :label-width="formLabelWidth">
        <el-input v-model="form.Tags" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属区域" :label-width="formLabelWidth">
        <el-input v-model="form.ssqy" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="所属平台" :label-width="formLabelWidth">
        <el-input v-model="form.sspt" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="preClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      form: {
        name: "",
        platformId: "",
        Tags: "",
        ssqy: "",
        sspt: ""
      },
      formLabelWidth: "120px",
      rules: {
        name: [{ required: true, message: "请填写名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions(["addLineVisibleHandle", "addLineFromHandle"]),
    preOpen() {},
    preClose() {
      this.addLineFromHandle(null);
      // this.resetForm();
      this.addLineVisibleHandle(false);
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
         this.addLineFromHandle(this.form);
         this.addLineVisibleHandle(false);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.form = {};
    }
  },
  computed: {
    addLineVisible() {
      return this.$store.state._global.windowAddLineVisible;
    }
  }
};
</script>