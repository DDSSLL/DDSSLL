<template>
  <div id="dataAnalysePage" style="height:100%">
    <el-tabs :tab-position="tabPosition" style="height: 100%;">
      <el-tab-pane label="频谱数据">
        <div style="height:100%">
          <div class="tableToolbar">
            <el-select class="input_dark" v-model="filter.DeviceSn" filterable clearable placeholder="设备" size="mini" collapse-tags style="width:150px;" @change="changeDevSn(1)">
              <el-option
                v-for="item in DEVICE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span :style="{color:item.color}">{{ item.label }}</span>
              </el-option>
            </el-select>
            <el-select class="input_dark" v-model="filter.BoardId" filterable clearable placeholder="板卡" size="mini" collapse-tags  style="width:150px;">
              <el-option
                v-for="item in BOARD_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-date-picker v-model="filter.StartTime" type="datetime" placeholder="开始时间" size="mini" style="width:180px"  value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <el-date-picker v-model="filter.EndTime" type="datetime" placeholder="结束时间" size="mini" style="width:180px"   value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="clickSearch"></el-button>
          </div>
          <div id="spectChart" style="width:100%; height:400px"></div>
          <div class="progressDiv" v-if="sliderShow">
            <div style="display:inline-block" class="playBtn">
              <i class="iconStyle el-icon-video-play" @click="startDrawLine" v-if="showPlay"></i>
              <i class="iconStyle el-icon-video-pause" @click="stopDrawLine" v-if="showPause"></i>
            </div>
            <div style="display:inline-block; margin-let:20px;" class="playBtn">
              <i class="iconStyle el-icon-caret-left" @click="lastSpectChart" v-if="showLast"></i>
              <i class="iconStyle el-icon-caret-right" @click="nextSpectChart" v-if="showNext"></i>
            </div>
            <div class="sliderDiv">
              <el-slider v-model="sliderValue" :format-tooltip="formatTooltip" :min="0" :max="sliderMax" @change="changeSlider" :disabled="sliderDisable"></el-slider><!-- :step="sliderStep" -->

              <!-- <el-slider v-model="sliderValue1" :format-tooltip="formatTooltip" :min="0" :max="500" @change=""></el-slider> -->
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="录音文件">
        <div style="height:100%">
          <div class="tableToolbar">
            <el-select class="input_dark" v-model="filterRecord.DeviceSn" filterable clearable placeholder="设备" size="mini" collapse-tags style="width:150px;" @change="changeDevSn(2)">
              <el-option
                v-for="item in DEVICE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span :style="{color:item.color}">{{ item.label }}</span>
              </el-option>
            </el-select>
            <el-select class="input_dark" v-model="filterRecord.BoardId" filterable clearable placeholder="板卡" size="mini" collapse-tags  style="width:150px;">
              <el-option
                v-for="item in BOARD_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
           
            <el-date-picker v-model="filterRecord.StartTime" type="datetime" placeholder="开始时间" size="mini" style="width:150px"></el-date-picker>
            <el-date-picker v-model="filterRecord.EndTime" type="datetime" placeholder="结束时间" size="mini" style="width:150px"></el-date-picker>
            <el-input class="input_dark" v-model="filterRecord.Freq" placeholder="频率" size="mini" style="width:100px"></el-input>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="clickRecordSearch"></el-button>
          </div>
          <el-table ref="multipleTable" :data="recordData" stripe highlight-current-row style="width: 100%" @selection-change="" ><!-- :height="tableHeight" -->
            <!-- <el-table-column type="selection" :reserve-selection="true">
            </el-table-column> -->
            <el-table-column prop="RcvSn" label="设备序列号" sortable>
            </el-table-column>
            <el-table-column prop="BoardId" label="板卡号" sortable>
            </el-table-column>
            <el-table-column prop="Freq" label="频率(Hz)" sortable>
            </el-table-column>
            <el-table-column prop="Name" label="文件名" sortable>
            </el-table-column>
            <el-table-column prop="Path" label="文件路径" sortable>
            </el-table-column>
            <el-table-column prop="Size" label="文件大小(MB)" sortable>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" sortable>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  
                  type="text"
                  size="small">
                  播放
                </el-button>
                <i class="el-icon-caret-right" @click.native.prevent="editTaskRow(scope.$index, recordData)"></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import * as echarts from 'echarts'
  import { mapState,mapMutations } from 'vuex';
  export default {
    name: "dataAnalyse",
    data(){
    	return{
        DEVICE_OPTION:[],
        BOARD_OPTION:[],
        contentHeight:"",
        tableHeight:"",
      	tabPosition:"left",
        filter:{
          DeviceSn:"",
          BoardId: "",
          StartTime: "",
          EndTime: "",
        },
        filterRecord:{
          DeviceSn:"",
          BoardId: "",
          StartTime: "",
          EndTime: "",
          Freq:"",
        },
        spectRecordLen:0,
        spectArr:[],
        spectChart:"",
        drawLineTimer:"",
        curSpectIndex:0,
        recordData:[],
        sliderValue:0*1,
        sliderStep:100,
        sliderMax:100,
        sliderDisable:true,
        sliderShow:false,
        showPlay:false,
        showPause:true,
        showNext:false,
        showLast:false,
        sliderValue1:0,
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
        that.filter.DeviceSn = that.DEVICE_OPTION[0]["value"];
        that.filterRecord.DeviceSn = that.DEVICE_OPTION[0]["value"];
        that.GetBoardList(that.filter.DeviceSn,"",function(){
          that.GetAudioFileList();
        })
      })  

       //that.spectRecordLen = 2;//data.length-1;
       //that.sliderStep = (100/that.spectRecordLen).toFixed(0);   
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
      formatTooltip(val){
        return this.spectArr[val]["CreateTime"];  
      },
      //点查询后，会根据索引，将所有索引对应的数据都请求来，然后用本地数据that.spectArr中存储的数据画图
      clickSearch(){
        var that = this;
        if(this.drawLineTimer){
          clearInterval(this.drawLineTimer)
        }
        //获取索引
        this.GetSpectIndex(function(){
          var dataLen= that.spectArr.length;
          if(dataLen == 0){
            that.$message.error("无可显示数据");
            return;
          }
          that.curSpectIndex = 0;
          that.sliderShow = true;  
          for(var i=0; i<dataLen; i++){
            (function(i){
              //根据索引获取该索引的数据
              that.GetSpectByID(that.spectArr[i]["SpectID"])
            })(i)
          }
          if(dataLen!=0){
            setTimeout(function(){
              //显示图
              //that.showSpectChart();
              that.startDrawLine();
            },300)
          }
        })
      },
      clickRecordSearch(){
        this.GetAudioFileList();
      },
      startDrawLine(){
        this.showSpectChart();
        this.sliderDisable = true;
        this.showPlay = false;
        this.showPause = true;
        this.showLast = false;
        this.showNext = false;
      },
      stopDrawLine(){
        if(this.drawLineTimer){
          clearInterval(this.drawLineTimer);
        }
        this.sliderDisable = false;
        this.showPlay = true;
        this.showPause = false;
        this.showLast = true;
        this.showNext = true;
      },
      changeSlider(val){
        console.log("changeSlider")
        console.log("this.sliderValue:"+this.sliderValue)
        console.log("this.spectRecordLen:"+this.spectRecordLen)
        this.curSpectIndex = this.sliderValue///(100/this.spectRecordLen);
        console.log("this.curSpectIndex:"+this.curSpectIndex)
        this.initSpectChart(this.curSpectIndex);
      },
      //往前倒
      lastSpectChart(){
        console.log("往前倒")
        this.curSpectIndex--;
        this.sliderValue = this.curSpectIndex//*(100/this.spectRecordLen);
        this.initSpectChart(this.curSpectIndex);
      },
      //往后倒
      nextSpectChart(){
        console.log("往后倒")
        this.curSpectIndex++;
        this.sliderValue = this.curSpectIndex//*(100/this.spectRecordLen);
        this.initSpectChart(this.curSpectIndex);
      },
      showSpectChart(){
        var that = this;
        this.drawLineTimer = setInterval(function(){
          that.initSpectChart(that.curSpectIndex);
          that.sliderValue = that.curSpectIndex//(100/that.spectRecordLen)*that.curSpectIndex;
          that.curSpectIndex++;
          if(that.curSpectIndex >= that.spectArr.length){
            clearInterval(that.drawLineTimer);
            that.stopDrawLine();
            that.sliderValue = 0;
            that.curSpectIndex = 0;
            that.initSpectChart(that.curSpectIndex);
          }
        },300)
      },
      initSpectChart(dataIndex){
        console.log("initSpectChart")
        console.log("dataIndex:"+dataIndex)
        var that = this;
        /*if (!this.spectChart) {
          this.spectChart = echarts.init(document.getElementById("spectChart"));
        }*/
        /*var option = {};
        var legendName = [];
        var series = [];*/
        var data = that.spectArr[dataIndex];
        if(data["Spect"]){
          this.drawChart(data);
        }else{
          console.log("aaaaa")
          this.GetSpectByID(dataIndex,function(data){
            that.drawChart(data)
          })
        }
        console.log(data)
        /*var spectData = [];
        if(this.curSpectIndex == 0){
          spectData = ["56","50","58","64","55"];
        }else{
          spectData = ["40","50","60","70","30"];
        }*/
        
      },
      //画图
      drawChart(data){
        var that = this;
        if (!this.spectChart) {
          this.spectChart = echarts.init(document.getElementById("spectChart"));
        }
        var option = {};
        var legendName = [];
        var series = [];
        var spectData = data["Spect"];//["56","50","58","64","55"];//
        var min = data["SpectStart"];
        var max = data["SpectEnd"]
        var points = data["Points"];
        var inter = (max - min)/(points-1);
        /*console.log("min:"+min)
        console.log("max:"+max)
        console.log("points:"+points)
        console.log("inter:"+inter)*/
        var xAxisData = [];
        for(var i=0; i<points; i++){
          xAxisData.push(((min*1+i*inter)/1000000).toFixed(3)+"MHz")
        }
        /*console.log("xAxisData")
        console.log(xAxisData)*/
        series.push({
          name: '电平',
          type: "line",
          symbolSize: 3,
          symbol: 'circle',
          smooth: true,
          showSymbol: false,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              color: '#2976FF',
              lineStyle: that.lineStyle,
              borderColor: 'red', //图形的描边颜色。支持的格式同 color
              borderWidth: 8, //描边线宽。为 0 时无描边。[ default: 0 ] 
              barBorderRadius: 0,
              label: {
                show: false
              },
              opacity: 0.5
            }
          },
          data: spectData
        })
        var option = {
          title: '',
          legend: {
            show:false,
          },
          grid: {
            containLabel: true,
            borderWidth: 0,
            top: 40,
            bottom: 30,
            left: 40,
            right: 40,
            textStyle: {
              color: "#fff"
            }
          },
          xAxis: [{
            type: "category",
            axisLine: {lineStyle: {color: '#C1C1C1'}},
            axisTick: {show: false},
            axisLabel: {
              show: true,
              interval:points-2,
              inside: false,
              textStyle: {color: '#363636',fontWeight: 'normal',fontSize: '12'}
            },
            splitLine: {
              show: false,
              lineStyle: {color: '#32346c'}
            },
            splitArea: {show: false},
            boundaryGap: false, //, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
            data:xAxisData,
          }],
          yAxis: {
            type: 'value',
            name: '电平',
            nameTextStyle: {color: '#363636'},
            axisTick: {show: false},
            axisLine: {
              show: true,
              lineStyle: {color: '#C1C1C1'}
            },
            splitLine: {
              show: true,
              lineStyle: {color: '#fff'} //'#32346c '
            },
            axisLabel: {
              textStyle: {color: '#363636',fontWeight: 'normal',fontSize: '12'},
              formatter: function (value, index) {  
                return (value*1).toFixed(1);
              }
            }
          },
          series: series,
          animation: false
        };
        this.spectChart.setOption(option, true);
      },
      GetBoardList(devSn, type, cb){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",
          data:{
            GetBoardList: "1",
            DeviceSN: that.filter.DeviceSn,   
          },
          Api:"GetBoardList",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            if(data.length == 0){
              that.BOARD_OPTION = [];  
              that.filter.BoardId = "";
            }else{
              that.BOARD_OPTION = data.map((item) =>{
                return {"value":item.BoardId,"label":item.BoardIdStr,"color":item.Online=="1"?"#007E12":"#7E7E7E"}
              });
              if(!type){
                that.filter.BoardId = that.BOARD_OPTION[0]["value"];  
                that.filterRecord.BoardId = that.BOARD_OPTION[0]["value"];  
              }else if(type == 1){
                that.filter.BoardId = that.BOARD_OPTION[0]["value"];  
              }else{
                that.filterRecord.BoardId = that.BOARD_OPTION[0]["value"];  
              }
            }
            
            if(typeof(cb) == 'function'){
              cb();
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      changeDevSn(type){
        var that = this;
        that.GetBoardList(that.filter.DeviceSn, type);
      },
      //获取索引号SpectID
      GetSpectIndex(cb){
        var that = this;
        this.$axios({
          url:"/protocol/history.php",
          data:{
            GetSpectIndex:1,
            DeviceSN: that.filter.DeviceSn,
            BoardId:that.filter.BoardId,
            StartTime: that.filter.StartTime,
            EndTime: that.filter.EndTime,
          },
          Api:"GetSpectIndex",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            that.spectArr = data;
            //that.spectRecordLen = data.length-1;
            //that.sliderStep = (100/that.spectRecordLen).toFixed(3)*1;
            that.sliderMax = data.length-1;//that.spectRecordLen;
            //console.log("that.sliderMax :"+that.sliderMax )
            console.log("GetSpectIndex")
            console.log(that.spectArr)
            /*console.log("sliderValue")
            console.log(that.sliderValue)*/
            
            if(typeof(cb) == 'function'){
              cb()
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //通过索引获取该索引对应的数据
      GetSpectByID(SpectID,cb){
        var that = this;
        this.$axios({
          url:"/protocol/history.php",
          data:{
            GetSpectByID: "1",
            SpectID: SpectID,           
          },
          Api:"GetSpectByID",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            console.log("GetSpectByID")
            console.log(data)
            that.spectArr.map(item => {
              if(item.SpectID == SpectID){
                item.Spect = data.Spect;
                item.SpectStart = data.SpectStart;
                item.SpectEnd = data.SpectEnd;
                item.Points = data.Points;
              }
            });
            if(typeof("cb") == 'function'){
              cb(data);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获取录音文件
      GetAudioFileList(){
        var that = this;
        this.$axios({
          url:"/protocol/history.php",
          data:{
            GetAudioFileList: "1",
            DeviceSN: that.filterRecord.DeviceSn,
            BoardId: that.filterRecord.BoardId,
            StartTime: that.filterRecord.StartTime,
            EndTime: that.filterRecord.EndTime,
            Freq: that.filterRecord.Freq,
          },
          Api:"GetAudioFileList",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            console.log("GetSpectByID")
            console.log(data)
            that.recordData = data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
    }
  }
</script>

<style>
  .iconStyle{
    font-size:24px;
    line-height:inherit;
  }
  .progressDiv{
    width:80%;
    margin:auto;
  }
  .playBtn{
    float:left;
    height: 38px;
    line-height: 38px;
  }
  .playBtn i{
    line-height: inherit;
  }
  .sliderDiv{
    width:60%;
    display:inline-block;
    float:left;
    margin-left:80px;
  }
</style>