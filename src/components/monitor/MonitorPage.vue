<template>
  <div class="monitor">
    <el-row style="height: 64%">
      <!-- left part 1 -->
      <el-col :span="4" class="leftDiv">
        <div class="contentDiv" style="height: 96%" id="contentDiv">
          <div id="rcvParamDiv">
            <el-select class="input_dark" v-model="rcv_board" style="width:50%;" @change="changeRcv" size="small">
              <el-option
                v-for="item in RCV_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select class="input_dark" v-model="RefreshInterval" style="width:50%;" @change="changeRefreshTime" size="small">
              <el-option
                v-for="item in REFRESH_TIME_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-select class="input_dark" v-model="rcvMode" style="width:50%;" @change="changeRcvMode">
              <el-option
                v-for="item in RCV_MODE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
            <div style="text-align: left;"  class="input_dark" >
              <div style="margin-top: 10px;width:45%;display: inline-block;">
                <el-input v-model="amplifier" :min="0" :max="50" class="inputmstyle" @blur="changeAMP" style="padding:0 5px">
                  <template slot="prepend">放大器</template>
                  <template slot="append">db</template>
                </el-input>
              </div>
              <div style="margin-top: 10px;width:45%;display: inline-block;float:right;">
                <el-input v-model="attenuator" min="0" max="50" class="inputmstyle" @blur="changeATT">
                  <template slot="prepend">衰减器</template>
                  <template slot="append">db</template>
                </el-input>
              </div>
            </div>
            <el-card class="box-card dark_card" style="margin-top: 10px;">
              <span class="statisticsTitle" style="font-size: 24px;">{{currentFreq}}</span>
            </el-card>
            <div style="margin-top: 15px" class="input_dark">
              <el-checkbox-group v-model="freq_type" size="small" @change="changeFreqType">
                <el-checkbox-button v-for="freq in FREQ_TYPE" :label="freq" :key="freq">{{freq}}</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>
          <div style="margin-top: 10px;" class="monitorTable">
            <template >
              <el-table :data="channelData" height="250" border style="width: 100%;font-size:12px;" id="channelTable">
                <el-table-column type="index" width="40"></el-table-column>
                <el-table-column prop="Freq" label="频率"></el-table-column>
                <el-table-column prop="Level" label="电平"></el-table-column>
                <el-table-column prop="Modulation" label="幅度"></el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="20" class="rightDiv">
        <div class="contentDiv" style="height: 96%;margin-left: 10px;text-align: left;overflow-y: auto;">
          <div v-for="o in total" :key="o" class="text item chartStyle" :class="chartClass">
            <div style="width:100%;height:100%;" class="chartDiv" :class="'chartDiv_'+o" @click="changeActiveChart">
              <div v-bind:id="'chart_' + o" style="width: 100%; height: 80%"></div>
              <div class="chartInfo" v-bind:id="'chart_info_' + o" style="text-align: center;size:12px">
                <span style="display:inline-block; padding:0 5px">
                  <span>频率:</span><span>{{chartInfo[o-1]?chartInfo[o-1]["Freq"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>电平:</span><span>{{chartInfo[o-1]?chartInfo[o-1]["Level"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>幅度:</span><span>{{chartInfo[o-1]?chartInfo[o-1]["Modulation"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>频偏:</span><span>{{chartInfo[o-1]?chartInfo[o-1]["Offset"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>带宽:</span><span>{{chartInfo[o-1]?chartInfo[o-1]["BW"]:""}}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="height:35%;">
      <div class="contentDiv" style="height: 100%;">
        <el-row style="height: 100%">
          <el-col :span="12" style="height:100%">
            <div id="freq1" style="width:100%;height:100%"></div>
<!--              <canvas id="crvCanvas" class="spectrum_canvas"></canvas> -->
          </el-col>
          <el-col :span="12" style="height:100%">
            <div id="freq2" style="width:100%;height:100%"></div>
          </el-col>
        </el-row>

      </div>
    </el-row>
  </div>
</template>

<script>
  import * as echarts from 'echarts'
  export default {
    name: "Me",
    data(){
      return{
        rcv_board:"",
        rcvMode:'0',
        amplifier:"0",
        attenuator:"0",
        RCV_OPTION:[],
        /*RCV_MODE_OPTION:[{
          value: '0',
          label: '实时模式'
        }, {
          value: '1',
          label: '任务模式'
        }],*/
        REFRESH_TIME_OPTION:[{
          value: '1',
          label: '1s定时刷新'
        }, {
          value: '2',
          label: '2s定时刷新'
        }, {
          value: '3',
          label: '3s定时刷新'
        }, {
          value: '4',
          label: '4s定时刷新'
        }, {
          value: '5',
          label: '5s定时刷新'
        }],
        freq_type:[],
        FREQ_TYPE:["中波","短波","调频"],
        FREQ_TYPE_MAP:{"中波":"0","短波":"1","调频":"2"},
        channelData:[],
        total:"",
        allData:[],
        totalData:[],
        xAxisMin:"",
        xAxisMax:"",
        xAxisNum:"",
        xAxisData:[],
        chartClass:"",
        selectChartIndex:0,
        //chartDivClass:[],
        intervalRealTime:"",
        RefreshIntervalTime:1,//刷新间隔
        RefreshInterval:1,
        spectInterval:"",//频谱刷新
        myChartArr : [],
        chartFreq1:"",
        reqTimes:0,
        chartInfo : [],
        currentFreq:"",
        color:{'电平':'#2976FF','幅度':"#31FF24",'yellow':'#ffff00'},
        commonOptionGrid : {
          containLabel: true,
          borderWidth: 0,
          top: 40,
          bottom: 5,
          left: 20,
          right: 20,
          textStyle: {
            color: "#fff"
          }
        },
        lineStyle : {
          width: 1,
          type: 'solid' //'dotted'虚线 'solid'实线
        },
        commonOptionXAxis : [{
          type: "category",
          axisLine: {lineStyle: {color: '#32346c'}},
          axisTick: {show: false},
          axisLabel: {
            show: false,
            //interval:3,
            inside: false,
            textStyle: {color: '#363636',fontWeight: 'normal',fontSize: '14'}
          },
          splitLine: {
            show: false,
            lineStyle: {color: '#32346c'}
          },
          splitArea: {show: false},
          boundaryGap: false //, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
        }],
        commonOptionYAxis1 : {
          type: 'value',
          name: '电平',
          nameTextStyle: {color: '#363636'},
          axisTick: {show: false},
          axisLine: {
            show: true,
            lineStyle: {color: '#32346c'}
          },
          splitLine: {
            show: true,
            lineStyle: {color: '#fff'} //'#32346c '
          },
          axisLabel: {
            textStyle: {color: '#363636',fontWeight: 'normal',fontSize: '12'},
            formatter: function (value, index) {           
              return value.toFixed(1);      
            }
          }
        },
        commonOptionYAxis2 : {
          type: 'value',
          name: '幅度',
          nameTextStyle: {color: '#363636'},
          axisTick: {show: false},
          axisLine: {
            show: true,
            lineStyle: {color: '#32346c'}
          },
          splitLine: {
            show: false,
            lineStyle: {color: '#32346c'}
          },
          axisLabel: {
            textStyle: {color: '#363636',fontWeight: 'normal',fontSize: '12'},
            formatter: '{value}'
          }
        },
        levelChartXAxis:30,
        levelChartDatas:{},
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
      var that = this;
      this.levelChartDatas = localStorage.levelChartDatas?JSON.parse(localStorage.levelChartDatas):{};
      this.initPageStyle();
      this.$common.GetRcvBoardList(function(data){
        that.initRcvSelect(data);
        that.rcv_board = data[0]["RcvBoard"];
        that.getRcvAllData();
      })
    },
    activated(){  //生命周期-缓存页面激活
      console.log("activated")
      this.levelChartDatas = JSON.parse(localStorage.levelChartDatas);
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      // ...mapMutations({
          
      // }),
      initPageStyle(){
        setTimeout(function(){
          var contentHeight = document.getElementById("contentDiv").offsetHeight;
          var rcvParamDivHeight = document.getElementById("rcvParamDiv").offsetHeight;
          var tableHeight = contentHeight-rcvParamDivHeight-20;
          document.getElementById("channelTable").style.height =  tableHeight+"px";
        },500)
      },
      changeRcv(){//修改接收机时，清空定时器，重新开始获取数据
        if(this.RefreshInterval){
          this.getRcvAllData();
        }
        

      },
      getRcvAllData(){
        this.GetBoardParam();
        this.getChannelData();
        this.getRealtimeSpectData();
      },
      initRcvSelect(data){
        var option = {};
        for(var i=0; i<data.length; i++){
          option = {};
          option.label = data[i]["RcvName"];
          option.value = data[i]["RcvBoard"];
          this.RCV_OPTION.push(option);
        }
      },
      GetBoardParam(){
        var that = this;
        var rcvSn = this.rcv_board.split("_")[0];
        var boardId = this.rcv_board.split("_")[1];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetRcvModeParam.json",
          data:this.$qs.stringify({
            GetBoardParam: 1,
            DeviceSN: rcvSn,   
            BoardId:boardId,
          }),
          Api:"GetBoardParam",
          AppId:"web",
          //UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            that.amplifier = data[0]["RealAMP"];
            that.attenuator = data[0]["RealATT"];
            that.RefreshIntervalTime = data[0]["RefreshInterval"];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      changeAMP(){
        var paramName = ['RealAMP'];
        var paramValue = [this.amplifier];
        var that = this;
        this.setRcvParams(paramName, paramValue)
      },
      changeATT(){
        var paramName = ['RealATT'];
        var paramValue = [this.attenuator];
        var that = this;
        this.setRcvParams(paramName, paramValue)
      },
      changeRefreshTime(){
        var paramName = ['RefreshInterval'];
        var paramValue = [this.RefreshInterval];
        var that = this;
        this.setRcvParams(paramName, paramValue/*, function(data){
          if(that.rcvMode == 0){
            that.attenuator_0 = that.attenuator;
          }else{
            that.attenuator_1 = that.attenuator;
          }
        }*/)
      },
      setRcvParams(paramName,paramValue,callback){
        var that = this;
        var rcn_sn = this.rcv_board.split("_")[0];
        var board_id = this.rcv_board.split("_")[1];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/SetBoardParams.json",
          data:this.$qs.stringify({
            SetBoardParams: 1,
            RcvSn: rcn_sn ,
            BoardId:board_id,    
            ParamCol:paramName,
            ParamValue:paramValue
          }),
          Api:"SetRcvParams",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            if(typeof(callback) == 'function'){
              callback(data);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      getChannelData(){
        var that = this;
        clearInterval(this.RefreshInterval);//清除定时刷新 
        this.RefreshInterval = setInterval(function(){
          if(that.$route.fullPath == "/monitorPage"){
            that.GetChannelInfo();  
          }
        },that.RefreshIntervalTime*1000)
        that.GetChannelInfo();
      },
      getRealtimeSpectData(){
        var that = this;
        clearInterval(this.spectInterval);//清除定时刷新 
        this.spectInterval = setInterval(function(){
          if(that.$route.fullPath == "/monitorPage"){
            that.intervalRealTime = that.GetRealtimeSpect();
          }else{
            clearInterval(that.intervalRealTime)
          }
          
        },300)
        that.GetRealtimeSpect();
      },
      changeFreqType(){
        this.getChannelData();
      },
      GetChannelInfo(){
        var that = this;
        var ChannelType = this.freq_type.map(item => {
          return this.FREQ_TYPE_MAP[item];
        }).join(",");
        var rcvSn = this.rcv_board.split("_")[0];
        var boardId = this.rcv_board.split("_")[1];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetChannelInfo.json",
          data:this.$qs.stringify({
            GetChannelInfo: "1",
            DeviceSN:rcvSn,           //10位序列号
            BoardId:boardId,
            ChannelType:ChannelType,        //0中波,1短波,2调频，不填代表所有类型
            Freq:"",                //频率,不填代表所有频率
            GetPoints:"1",  
          }),
          Api:"GetChannelInfo",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            that.allData = data;
            if(data.length != 0){
              that.formatTable(data);
              that.formatCharts(data);
              that.currentFreq = data[that.selectChartIndex]["Freq"];
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatTable(data){
        this.channelData = data;
      },
      formatCharts(data){
        var that = this;
        this.total = data.length;
        this.initManyCharts(data.length)
        this.$nextTick(function(){
          for(var i=1; i<this.total+1; i++){
            that.initChartChannelChart(data[i-1], i);
            that.initChartChannelInfo(data[i-1], i-1);
          }
          document.getElementsByClassName("chartDiv")[that.selectChartIndex].classList.add('activeChart')
        })
      },
      initManyCharts(){
        var chartClass = "";
        switch(this.total){
          case 1:
            chartClass = "chart_1_1";
            break;
          case 2:
            chartClass = "chart_1_2";
            break;
          case 3:
          case 4:
            chartClass = "chart_2_2";
            break;
          case 5:
          case 6:
            chartClass = "chart_2_3";
            break;
          case 7:
          case 8:
            chartClass = "chart_2_4";
            break;
          case 9:
            chartClass = "chart_3_3";
            break;
          case 10:
          case 11:
          case 12:
            chartClass = "chart_3_4";
            break;
          default:
            chartClass = "chart_3_4";
            break;
        }
        this.chartClass = chartClass;
      },
      initChartData(chartId){
        if(!this.levelChartDatas[chartId]){
          this.levelChartDatas[chartId] = {};
          this.levelChartDatas[chartId]["Level"] = (new Array(this.levelChartXAxis)).fill(0)
          this.levelChartDatas[chartId]["Modulation"] = (new Array(this.levelChartXAxis)).fill(0)
        }
      },
      initChartChannelChart(data, index){
        var that = this;
        var chartId = "chart_"+index;
        this.initChartData(chartId);
        if (!this.myChartArr[chartId]) {
          this.myChartArr[chartId] = echarts.init(document.getElementById(chartId), null, {renderer:'svg'});
        }
        
        this.myChartArr[chartId].resize();
        var option = {};
        var legendName = ['电平','幅度'];
        var series = [];
        this.levelChartDatas[chartId]["Level"].unshift(data.Level);
        this.levelChartDatas[chartId]["Level"].pop();
        var LevelData = this.levelChartDatas[chartId]["Level"]
        this.levelChartDatas[chartId]["Modulation"].unshift(data.Modulation);
        this.levelChartDatas[chartId]["Modulation"].pop();
        var ModulationData = this.levelChartDatas[chartId]["Modulation"]
        
        localStorage.setItem("levelChartDatas",JSON.stringify(this.levelChartDatas));
        var chartData = {"电平":LevelData, "幅度":ModulationData}
        for(var m=0; m<legendName.length; m++){
          var name = legendName[m];
          series.push({
            name: name,
            type: "line",
            symbolSize: 3,
            symbol: 'circle',
            smooth: true,
            showSymbol: false,
            yAxisIndex: legendName[m].indexOf("电平")!=-1?0:1,
            itemStyle: {
              normal: {
                color: this.color[legendName[m]],
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
            data: chartData[legendName[m]]
          })
        }
        var xAxisOption = {};
        var yAxisOption1 = that.$common.copy(that.commonOptionYAxis1);
        var yAxisOption2 = that.$common.copy(that.commonOptionYAxis2);
        
        var option = {
          title: '',
          legend: {
            show:false,
            type: 'scroll',
            pageTextStyle: {
              color: '#ccc'
            },
            /*pageIconColor: '#337ab7',
            pageIconInactiveColor: "#B4B5B7",*/
            top: this.legendTop,
            itemGap: 5,
            itemWidth: 5,
            textStyle: {
              color: '#DDD',
              fontSize: '10'
            },
            tooltip: {
              show: true
            },
            data: legendName
          },
          grid: that.commonOptionGrid,
          tooltip: that.commonOptionTooltipFalse,
          xAxis: Object.assign(that.commonOptionXAxis[0], {data: that.xData}),
          yAxis: (that.curDevSeries=="4000")?[yAxisOption1, yAxisOption2, yAxisOption3]:[yAxisOption1, yAxisOption2],
          series: series,
          animation: false
        };
        this.myChartArr[chartId].setOption(option, true);
      },
      initChartChannelInfo(data, index){
        this.chartInfo[index] = {};
        var datas = {
          "Freq":data["Freq"],
          "Level":data["Level"],
          "Modulation":data["Modulation"],
          "Offset":data["Offset"],
          "BW":data["BW"],
        }
        this.$set(this.chartInfo, index, datas);
      },
      changeActiveChart(e){
        if( e.currentTarget.getAttribute("class") && e.currentTarget.getAttribute("class").includes("activeChart") ){//点击的是当前选中项，什么也不做
          
        }else{
          for(var i=0; i<this.total; i++){
            //this.chartDivClass[i] = ""; 
            //this.$set(this.chartDivClass, i, "");
            document.getElementsByClassName("chartDiv")[i].classList.remove('activeChart')
          }
          e.currentTarget.classList.add('activeChart')
          this.selectChartIndex = e.currentTarget.classList[1].split("_")[1]-1;
          this.currentFreq = this.allData[this.selectChartIndex]["Freq"];
        }
      },
      GetRealtimeSpect(){
        //console.log("GetRealtimeSpect")
        var that = this;
        var devSn = "1000012150";//this.rcv_board.split("_")[0];
        var boardId = 0;//this.rcv_board.split("_")[1];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetRealtimeSpect.json",
          data:this.$qs.stringify({
            GetRealtimeSpect: "1",
            DeviceSN:devSn,
            BoardId:boardId,
          }),
          Api:"GetRealtimeSpect",
          AppId:"web",
          //UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            that.allData = data;
            /*if(that.totalData.length >= 30){
              that.totalData.shift();
            }
            that.totalData.push(data["Spect"]);*/
            that.xAxisMin = data["SpectStart"];
            that.xAxisMax = data["SpectEnd"];
            that.xAxisNum = data["Points"];
            var inter = (that.xAxisMax - that.xAxisMin)/(that.xAxisNum-1);
            that.xAxisData = [];
            for(var i=0; i<that.xAxisNum; i++){
              that.xAxisData.push((that.xAxisMin*1+i*inter)/1000000+"MHz")
            }
            that.formatFreqCharts(data);
            if(++that.reqTimes == 3){
              if(that.totalData.length >= 30){
                that.totalData.shift();
              }
              that.totalData.push(data["Spect"]);
              that.formatFreqHeatMap(data);
              that.reqTimes = 0;
            }
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatFreqCharts(data){
        var that = this;
        if (!this.chartFreq1) {
          this.chartFreq1 = echarts.init(document.getElementById("freq1"));
        }
        //this.myChartArr[chartId].resize();
        var option = {};
        var legendName = ['电平'];
        var series = [];
        var spectData = data["Spect"];
        var min = data["SpectStart"];
        var max = data["SpectEnd"]
        var points = data["Points"];
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
              color: this.color['yellow'],
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
        var yAxisOption1 = that.$common.copy(that.commonOptionYAxis1);
        yAxisOption1.name = '电平';
        var xAxisOption = that.$common.copy(that.commonOptionXAxis[0]);
        xAxisOption["axisLabel"].show = true;
        xAxisOption["axisLabel"].type = 'category';
        xAxisOption["axisLabel"].interval = points-2;
        xAxisOption["data"] = that.xAxisData;
        var grid = that.commonOptionGrid;
        grid.left = 40;
        grid.right = 40;
        var option = {
          title: '',
          legend: {
            show:false,
            type: 'scroll',
            pageTextStyle: {
              color: '#ccc'
            },
            /*pageIconColor: '#337ab7',
            pageIconInactiveColor: "#B4B5B7",*/
            top: this.legendTop,
            itemGap: 5,
            itemWidth: 5,
            textStyle: {
              color: '#DDD',
              fontSize: '10'
            },
            tooltip: {
              show: true
            },
            data: legendName
          },
          grid: grid,
          tooltip: that.commonOptionTooltipFalse,
          xAxis: xAxisOption,
          yAxis: yAxisOption1,
          series: series,
          animation: false
        };
        this.chartFreq1.setOption(option, true);
      },
      formatFreqHeatMap(data){
        var that = this;
        //return;
        if (!this.chartFreq2) {
          this.chartFreq2 = echarts.init(document.getElementById("freq2"));
        }
        //this.myChartArr[chartId].resize();
        var option = {};
        //var legendName = ['电平'];
        var yData = [];
        for (let y = 0; y < 30; y++) {
          yData.push(y);
        }
        var yAxisOption1 = that.$common.copy(that.commonOptionYAxis1);
        yAxisOption1.axisLabel.show = false;
        yAxisOption1.type = 'category';
        yAxisOption1.data =  yData;
        var xAxisOption = that.$common.copy(that.commonOptionXAxis[0]);
        xAxisOption["axisLabel"].show = true;
        xAxisOption["axisLabel"].type = 'category';
        var xx = [];
        for(var m=0; m<500; m++){
          xx.push(m)
        }
        xAxisOption["data"] = that.xAxisData;
        var grid = that.commonOptionGrid;
        grid.left = 40;
        grid.right = 40;

        var series = [];
        var xData = xx;//that.xAxisData;
        var seriesData = [];
       
        for(var i=0; i<xData.length; i++){
          for(var j=0; j<that.totalData.length; j++){
            seriesData.push([xData[i], j, that.totalData[j][i]])
          }
        }
        series.push({
          type: 'heatmap',
          data: seriesData,
          emphasis: {
            itemStyle: {
              borderColor: '#333',
              borderWidth: 1
            }
          },
          progressive: 1000,
          animation: false
        })
        var option = {
          tooltip: {},
          xAxis: {
            type: 'category',
            data: xData
          },
          yAxis: {
            type: 'category',
            data: yData
          },
          visualMap: {
            show:false,
            min: 0,
            max: 87,
            calculable: true,
            realtime: false,
            inRange: {
              color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            }
          },
          series: [
            {
              name: '',
              type: 'heatmap',
              data: seriesData,
              emphasis: {
                itemStyle: {
                  borderColor: '#333',
                  borderWidth: 1
                }
              },
              progressive: 0,
              animation: false
            }
          ]
        };
        this.chartFreq2.setOption(option, true);
      },
    }
  }
</script>

<style>
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
/*.contentDiv{
  border:1px solid #1F2C62;
  border-radius: 4px;
  box-shadow: 1px 2px 2px 1px #1F2C62;
  margin-bottom: 10px;
  padding: 5px;
}*/
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

.monitor .el-row>.el-col .leftDiv{
  height: 100%;
  border:1px solid red;
}
.monitor .el-row>.el-col .rightDiv{
  height: 100%;
  border:1px solid red;
}
.chartStyle{
  display: inline-block;
  /*outline: 1px solid red;*/
}
/*.activeChart{
  background-color: #0A2148;
}*/
.chart_1_1{
  width: 100%;
  height: 100%;
}  
.chart_1_2{
  width: 50%;
  height: 100%;
}  
.chart_1_3{
  width: 33%;
  height: 100%;
} 
.chart_2_2{
  width: 50%;
  height: 50%;
} 
.chart_2_3{
  width: 33%;
  height: 50%;
} 
.chart_2_4{
  width: 25%;
  height: 50%;
} 
.chart_3_3{
  width: 33%;
  height: 33%;
} 
.chart_3_4{
  width: 25%;
  height: 33%;
} 
.chart_4_4{
  width: 25%;
  height: 25%;
} 
.monitorTable .el-table--border .el-table__cell{
  border-right: 0px;
}
.monitorTable .el-table--border::after{
  background-color: transparent;
}
.monitorTable .el-table .el-table__cell{
  padding:2px;
}
.monitorTable .el-table__body-wrapper{
  overflow-x: hidden;
}
.inputmstyle .el-input__inner{
  padding:0 5px;
}
</style>