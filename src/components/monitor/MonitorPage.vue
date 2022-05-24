<template>
  <div class="monitor">
    <el-row>
      <!-- left part 1 -->
      <el-col :span="8" class="leftDiv">
        <div class="contentDiv">
          <el-row>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">累计采集(次)</span>
              <span class="statisticsData">100000</span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">当前播音(个)</span>
              <span class="statisticsData">300  </span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">新频数量(个)</span>
              <span class="statisticsData">10</span>
            </el-col>
          </el-row>
        </div>
        <!-- left part 2 -->
        <div class="contentDiv">
          <el-row>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">接收机: 
                <span class="colorGreen">正常</span>
              </span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">数据库: 
                <span class="colorGreen">正常</span>
              </span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">指挥报警: 
                <span class="colorGreen">正常</span>
              </span>
            </el-col>
          </el-row>
        </div>
        
      </el-col>

      

      <el-col :span="16" class="rightDiv"></el-col>
    </el-row>
  </div>
</template>

<script>
  
  export default {
    name: "Me",
    data(){
      return{
      }
    },
    computed: {
     
    },
    components: {
      
    },
    /*watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
        }
      }
    },*/
    mounted(){
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      // ...mapMutations({
          
      // }),
      
    }
  }
</script>

<style scoped>
.monitor{
  height: 100%;
}
.monitor>.el-row {
  height: 100%;
}
.monitor>.el-row>.el-col{
  height: 100%;
  /*border:1px solid red;*/
}
.contentDiv{
  border:1px solid #1F2C62;
  border-radius: 4px;
  box-shadow: 1px 2px 2px 1px #1F2C62;
  margin-bottom: 10px;
}
.statisticsStyle{
  /*outline: 1px solid yellow;*/
  text-align: left;
  padding: 10px;
}
.statisticsTitle{
  font-size: 16px;
  display: block;
  text-align: left;
}
.statisticsData{
  font-size: 24px;
  display: block;
  text-align: left;
}

/*.monitor .el-row>.el-col .leftDiv{
  height: 100%;
  border:1px solid red;
}
.monitor .el-row>.el-col .rightDiv{
  height: 100%;
  border:1px solid red;
}*/
   

</style>