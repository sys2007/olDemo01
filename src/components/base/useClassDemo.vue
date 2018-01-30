<template>
    <div id="filterDiv">
        <select>
            <option value="code">编码</option>  
            <option value="pinyin">拼音</option>  
        </select>  
        <input type="text" value="100032" style="width: 80px;"/>
        <button @click= "propertiesQuery">属性查询</button>   
        <button @click= "spatialQuery">空间查询</button>  
    </div>
</template>

<script>
import point from '../utils/mapTools2'
export default {
  name: "filterDiv",
  mounted() {
    this.init();
  },
  methods: {
      init() {
        //   new Point(2,3).toString()
      },
      propertiesQuery() {

      },
      spatialQuery() {
          let a = new point(22.33);
          a.toString();
      }
  }
};
</script>
<style scoped>

</style>
