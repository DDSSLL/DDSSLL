<template>
  <div id="logPage" style="height:100%">
    <el-tabs :tab-position="tabPosition" style="height: 100%;">
      <el-tab-pane label="操作日志">
        <div style="height:100%">
          <div class="tableToolbar">
            <el-select class="input_dark" v-model="filter.DeviceSN" filterable clearable placeholder="设备" size="mini" collapse-tags style="width:150px;">
              <el-option
                v-for="item in DEVICE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span :style="{color:item.color}">{{ item.label }}</span>
              </el-option>
            </el-select>
            <el-select class="input_dark" v-model="filter.UserID" filterable clearable placeholder="用户" size="mini" collapse-tags  style="width:150px;">
              <el-option
                v-for="item in USER_OPTION"
                :key="item.UserID"
                :label="item.UserName"
                :value="item.UserID">
              </el-option>
            </el-select>
            <el-date-picker v-model="filter.StartTime" type="datetime" placeholder="开始时间" size="mini" style="width:180px"></el-date-picker>
            <el-date-picker v-model="filter.EndTime" type="datetime" placeholder="结束时间" size="mini" style="width:180px"></el-date-picker>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="GetOperationLog"></el-button>
          </div>
          <el-table ref="multipleTable" :data="opLogData" stripe highlight-current-row style="width: 100%" @selection-change="" ><!-- :height="tableHeight" -->
            <!-- <el-table-column type="selection" :reserve-selection="true">
            </el-table-column> -->
            <el-table-column prop="CreateTime" label="时间" sortable>
            </el-table-column>
            <el-table-column prop="UserID" label="用户ID" sortable>
            </el-table-column>
            <el-table-column prop="UserName" label="用户名" sortable>
            </el-table-column>
            <el-table-column prop="RcvSn" label="设备序列号" sortable>
            </el-table-column>
            <el-table-column prop="RcvName" label="设备名" sortable>
            </el-table-column>
            <el-table-column prop="Operate" label="操作" sortable>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="运行日志">
        <div style="height:100%">
          <div class="tableToolbar">
            <el-select class="input_dark" v-model="filter.DeviceSN2" filterable clearable placeholder="设备" size="mini" collapse-tags style="width:150px;">
              <el-option
                v-for="item in DEVICE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span :style="{color:item.color}">{{ item.label }}</span>
              </el-option>
            </el-select>
            <!-- <el-select class="input_dark" v-model="filter.UserID2" filterable clearable placeholder="用户" size="mini" collapse-tags  style="width:150px;">
              <el-option
                v-for="item in USER_OPTION"
                :key="item.UserID"
                :label="item.UserName"
                :value="item.UserID">
              </el-option>
            </el-select> -->
            <el-date-picker v-model="filter.StartTime2" type="datetime" placeholder="开始时间" size="mini" style="width:180px"></el-date-picker>
            <el-date-picker v-model="filter.EndTime2" type="datetime" placeholder="结束时间" size="mini" style="width:180px"></el-date-picker>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="GetOperationLog"></el-button>
          </div>
          <el-table ref="multipleTable" :data="runLogData" stripe highlight-current-row style="width: 100%" @selection-change="" ><!-- :height="tableHeight" -->
            <!-- <el-table-column type="selection" :reserve-selection="true">
            </el-table-column> -->
            <el-table-column prop="RcvSn" label="设备序列号" sortable>
            </el-table-column>
            <el-table-column prop="RcvName" label="设备名" sortable>
            </el-table-column>
            <el-table-column prop="OnlineTime" label="上线时间" sortable>
            </el-table-column>
            <el-table-column prop="OfflineTime" label="离线时间" sortable>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import { mapState,mapMutations } from 'vuex';
  export default {
    name: "LogMan",
    data(){
    	return{
        contentHeight:"",
        tableHeight:"",
      	tabPosition:"left",
        filter:{
          DeviceSN:"",
          UserID: "",
          StartTime: "",
          EndTime: "",
          DeviceSN2:"",
          /*UserID2: "",*/
          StartTime2: "",
          EndTime2: ""
        },
        opLogData:[],
        runLogData:[],
        DEVICE_OPTION:[],
        USER_OPTION:[],
      }
    },
    computed: {
      ...mapState(['user'])
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
      var that = this;
      //this.contentHeight = document.getElementById("logPage").offsetHeight;
      this.$common.GetRcvSnList(function(data){ 
        console.log(data)
        that.DEVICE_OPTION = data.map((item) =>{
          return {"value":item.RcvSn,"label":item.RcvName,"color":item.Online=="1"?"#007E12":"#7E7E7E"}
        });
      })
      this.initUserOption();
      this.GetOperationLog();
      this.GetRunLog();
    },
    created(){
      /*this.contentHeight = document.getElementById("logPage").offsetHeight;
      this.tableHeight = (this.contentHeight-50)+"px";  */
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活
    },
    methods:{
      // ...mapMutations({
          
      // }),
      initUserOption(){
        console.log("initUserOption")
        console.log(this.user.level)
        if(this.user.level == 1){
          this.GetUserIDList();
          console.log(this.USER_OPTION)
        }else{
          this.USER_OPTION = [{"value":this.user.id, "label":this.user.name}]
          console.log(this.USER_OPTION)
        }
      },
      GetUserIDList(){
        var that = this;
        this.$axios({
          url:"/protocol/user.php",
          data:{
            GetUserIDList: "1",
          },
          Api:"GetUserIDList",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            that.USER_OPTION = res.data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      GetOperationLog(){
        var that = this;
        this.$axios({
          url:"/protocol/log.php",
          data:{
            GetOperationLog: "1",
            DeviceSN: that.filter.DeviceSN,
            UserID: that.filter.UserID,
            StartTime: that.filter.StartTime?that.filter.StartTime:"",
            EndTime: that.filter.EndTime?that.filter.EndTime:"",
          },
          Api:"GetOperationLog",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data= res.data;
            that.opLogData = data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      GetRunLog(){
        var that = this;
        this.$axios({
          url:"/protocol/log.php",
          data:{
            GetRunLog: "1",
            DeviceSN: that.filter.DeviceSN2,
            /*UserID: that.filter.UserID2,*/
            StartTime: that.filter.StartTime2?that.filter.StartTime2:"",
            EndTime: that.filter.EndTime2?that.filter.EndTime2:"",
          },
          Api:"GetRunLog",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data= res.data;
            console.log(data)
            that.runLogData = data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
    }
  }
</script>

<style scoped>

</style>