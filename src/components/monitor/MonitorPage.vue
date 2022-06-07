<template>
  <div class="monitor">
    <el-row style="height: 65%">
      <!-- left part 1 -->
      <el-col :span="4" class="leftDiv">
        <div class="contentDiv" style="height: 96%" id="contentDiv">
          <div id="rcvParamDiv">
            <el-select class="input_dark" v-model="rcv" style="width:50%;" @change="changeRcv">
              <el-option
                v-for="item in RCV_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select class="input_dark" v-model="rcvMode" style="width:50%;" @change="changeRcvMode">
              <el-option
                v-for="item in RCV_MODE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div style="text-align: left;"  class="input_dark" >
              <div style="margin-top: 10px;width:45%;display: inline-block;">
                <el-input v-model="amplifier" :min="0" :max="50" class="inputmstyle" @blur="changeAMP">
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
              <el-checkbox-group v-model="freq_type" size="medium" @change="changeFreqType">
                <el-checkbox-button v-for="freq in FREQ_TYPE" :label="freq" :key="freq">{{freq}}</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>
          <div style="margin-top: 10px;" class="monitorTable">
            <template >
              <el-table :data="channelData" height="250" border style="width: 100%" id="channelTable">
                <el-table-column type="index" width="50"></el-table-column>
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
            <div style="width:100%;height:100%;outline: 1px solid #0F2E62" class="chartDiv" :class="'chartDiv_'+o" @click="changeActiveChart">
              <div v-bind:id="'chart_' + o" style="width: 100%; height: 80%"></div>
              <div v-bind:id="'chart_info_' + o" style="text-align: center;">
                <span style="display:inline-block; padding:0 5px">
                  <span>频率:</span><span>{{chartInfo[o]?chartInfo[o]["Freq"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>电平:</span><span>{{chartInfo[o]?chartInfo[o]["Level"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>幅度:</span><span>{{chartInfo[o]?chartInfo[o]["Modulation"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>频偏:</span><span>{{chartInfo[o]?chartInfo[o]["Offset"]:""}}</span>
                </span>
                <span style="display:inline-block; padding:0 5px">
                  <span>带宽:</span><span>{{chartInfo[o]?chartInfo[o]["BW"]:""}}</span>
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
            <div id="test" style="width:50%;height: 100%"></div>
          </el-col>
          <el-col :span="12">
            <div class=""></div>
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
        rcv:"",
        rcvMode:'0',
        amplifier:"0",
        attenuator:"0",
        amplifier_0:"",
        amplifier_1:"",
        attenuator_0:"",
        attenuator_1:"",
        RCV_OPTION:[],
        RCV_MODE_OPTION:[{
          value: '0',
          label: '实时模式'
        }, {
          value: '1',
          label: '任务模式'
        }],
        freq_type:[],
        FREQ_TYPE:["中波","短波","调频"],
        FREQ_TYPE_MAP:{"中波":"0","短波":"1","调频":"2"},
        channelData:[],
        total:"",
        allData:[],
        chartClass:"",
        selectChartIndex:0,
        //chartDivClass:[],
        RefreshIntervalTime:1,//刷新间隔
        RefreshInterval:"",
        myChartArr : [],
        chartInfo : [],
        currentFreq:"",
        color:{'电平':'#2976FF','幅度':"#31FF24"},
        commonOptionGrid : {
          containLabel: true,
          borderWidth: 0,
          top: 40,
          bottom: 20,
          left: 20,
          right: 20,
          textStyle: {
            color: "#fff"
          }
        },
        commonOptionXAxis : [{
          type: "category",
          axisLine: {lineStyle: {color: '#32346c'}},
          axisTick: {show: false},
          axisLabel: {
            show: false,
            //interval:3,
            inside: false,
            textStyle: {color: '#BFBFBF',fontWeight: 'normal',fontSize: '14'}
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
          nameTextStyle: {color: '#BFBFBF'},
          axisTick: {show: false},
          axisLine: {
            show: true,
            lineStyle: {color: '#32346c'}
          },
          splitLine: {
            show: true,
            lineStyle: {color: '#1c1c45'} //'#32346c '
          },
          axisLabel: {
            textStyle: {color: '#BFBFBF',fontWeight: 'normal',fontSize: '14'},
            formatter: function (value, index) {           
              return value.toFixed(2);      
            }
          }
        },
        commonOptionYAxis2 : {
          type: 'value',
          name: '幅度',
          nameTextStyle: {color: '#BFBFBF'},
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
            textStyle: {color: '#BFBFBF',fontWeight: 'normal',fontSize: '14'},
            formatter: '{value}'
          }
        },
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
      this.initPageStyle();
      this.$common.GetRcvSnList(function(data){
        that.initRcvSelect(data);
        that.rcv = data[0]["RcvSn"];
        that.getRcvAllData();
      })
      
      /*this.initCharts();
      this.initManyCharts();*/
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      // ...mapMutations({
          
      // }),
      initPageStyle(){
        setTimeout(function(){
          console.log( )
          console.log()
          var contentHeight = document.getElementById("contentDiv").offsetHeight;
          var rcvParamDivHeight = document.getElementById("rcvParamDiv").offsetHeight;
          var tableHeight = contentHeight-rcvParamDivHeight-20;
          console.log("tableHeight:"+tableHeight)
          document.getElementById("channelTable").style.height =  tableHeight+"px";
        },500)
      },
      changeRcv(){//修改接收机时，清空定时器，重新开始获取数据
        if(this.RefreshInterval){
          this.getRcvAllData();
        }
        

      },
      getRcvAllData(){
        this.getRcvModeParam();
        this.getChannelData();
      },
      initRcvSelect(data){
        var option = {};
        for(var i=0; i<data.length; i++){
          option = {};
          option.label = data[i]["RcvName"];
          option.value = data[i]["RcvSn"];
          this.RCV_OPTION.push(option);
        }
      },
      getRcvModeParam(){
        var that = this;
        this.$axios({
          url:"/testJson/GetRcvModeParam.json",
          data:this.$qs.stringify({
            GetRcvModeParam: 1,
            RcvSn: that.rcv,         //序列号
          }),
          Api:"GetRcvModeParam",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          console.log(res)
          if(res.code == "0000"){
            console.log(res.data)
            var data = res.data;
            that.rcvMode = data[0]["WorkMode"];
            that.amplifier_0=data[0]["RealAMP"];
            that.amplifier_1=data[0]["AMP"];
            that.attenuator_0=data[0]["RealATT"];
            that.attenuator_1=data[0]["ATT"];
            if(that.rcvMode == 0){
              that.amplifier = data[0]["RealAMP"];
              that.attenuator = data[0]["RealATT"];
            }else{
              that.amplifier = data[0]["AMP"];
              that.attenuator = data[0]["ATT"];
            }
            that.RefreshIntervalTime = data[0]["RefreshInterval"];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      changeRcvMode(){
        if(this.rcvMode == 0){
          this.amplifier = this.amplifier_0;
          this.attenuator = this.attenuator_0;
        }else{
          this.amplifier = this.amplifier_1;
          this.attenuator = this.attenuator_1;
        }
      },
      changeAMP(){
        var paramName = ['AMP'];
        var paramValue = [this.amplifier];
        var that = this;
        this.setRcvParams(paramName, paramValue, function(data){
          if(that.rcvMode == 0){
            that.amplifier_0 = that.amplifier;
            that.attenuator_0 = that.attenuator;
          }else{
            that.amplifier_1 = that.amplifier;
            that.attenuator_1 = that.attenuator;
          }
        })
      },
      changeATT(){
        var paramName = ['ATT'];
        var paramValue = [this.attenuator];
        var that = this;
        this.setRcvParams(paramName, paramValue, function(data){
          if(that.rcvMode == 0){
            that.attenuator_0 = that.attenuator;
          }else{
            that.attenuator_1 = that.attenuator;
          }
        })
      },
      setRcvParams(paramName,paramValue,callback){
        var that = this;
        this.$axios({
          url:"/testJson/SetRcvParams.json",
          data:this.$qs.stringify({
            SetRcvParams: 1,
            RcvSn: "" ,         
            ParamCol:paramName,
            ParamValue:paramValue
          }),
          Api:"SetRcvParams",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          console.log(res)
          if(res.code == "0000"){
            console.log(res.data)
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
        /*this.RefreshInterval = setInterval(function(){
          that.GetChannelInfo();
        },that.RefreshIntervalTime)*/
        that.GetChannelInfo();
      },
      changeFreqType(){
        this.getChannelData();
      },
      GetChannelInfo(){
        var that = this;
        var ChannelType = this.freq_type.map(item => {
          return this.FREQ_TYPE_MAP[item];
        }).join(",");
        this.$axios({
          url:"/testJson/GetChannelInfo.json",
          data:this.$qs.stringify({
            GetChannelInfo: "1",
            DeviceSN:that.rcv,           //10位序列号
            ChannelType:ChannelType,        //0中波,1短波,2调频，不填代表所有类型
            Freq:"",                //频率,不填代表所有频率
            GetPoints:"1",  
          }),
          Api:"GetChannelInfo",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          console.log(res)
          if(res.code == "0000"){
            console.log(res.data)
            var data = res.data;
            that.allData = data;
            that.formatTable(data);
            that.formatCharts(data);
            that.currentFreq = data[that.selectChartIndex]["Freq"];
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
        console.log("formatCharts")
        console.log(data)
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
      initChartChannelChart(data, index){
        console.log("initChartChannel："+index)
        console.log(data)
        var that = this;
        var chartId = "chart_"+index;
        if (!this.myChartArr[chartId]) {
          this.myChartArr[chartId] = echarts.init(document.getElementById(chartId), null, {renderer:'svg'});
        }
        
        console.log(this.myChartArr[chartId])
        this.myChartArr[chartId].resize();
        var option = {};
        var legendName = ['电平','幅度'];
        var series = [];
        var LevelData = data.Points.map(item => {return item.Level});
        var ModulationData = data.Points.map(item => {return item.Modulation});
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
            yAxisIndex: legendName[m].indexOf("电平")!=-1?1:0,
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
        var yAxisOption1 = that.commonOptionYAxis1;
        var yAxisOption2 = that.commonOptionYAxis2;
        
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
       
        
        console.log(option)
        this.myChartArr[chartId].setOption(option, true);
      },
      initChartChannelInfo(data, index){
        console.log("initChartChannelInfo")
        console.log(data)
        this.chartInfo[index] = {};
        var datas = {
          "Freq":data["Freq"],
          "Level":data["Level"],
          "Modulation":data["Modulation"],
          "Offset":data["Offset"],
          "BW":data["BW"],
        }
        this.$set(this.chartInfo, index, datas);
       /* this.chartInfo[index]["Freq"] = data["Freq"]
        this.chartInfo[index]["Level"] = data["Level"]
        this.chartInfo[index]["Modulation"] = data["Modulation"]
        this.chartInfo[index]["Offset"] = data["Offset"]
        this.chartInfo[index]["BW"] = data["BW"]*/
        console.log(this.chartInfo)
      },
      changeActiveChart(e){
        console.log("changeActiveChart")
        console.log(e.currentTarget)
        console.log()
        if( e.currentTarget.getAttribute("class") && e.currentTarget.getAttribute("class").includes("activeChart") ){//点击的是当前选中项，什么也不做
          
        }else{
          console.log("else")
          for(var i=0; i<this.total; i++){
            //this.chartDivClass[i] = ""; 
            //this.$set(this.chartDivClass, i, "");
            document.getElementsByClassName("chartDiv")[i].classList.remove('activeChart')
          }
          e.currentTarget.classList.add('activeChart')
          this.selectChartIndex = e.currentTarget.classList[1].split("_")[1]-1;
          console.log("this.selectChartIndex:"+this.selectChartIndex)
          this.currentFreq = this.allData[this.selectChartIndex]["Freq"];
        }
      },
      initCharts(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('test'));
        // 绘制图表
        myChart.setOption({
          title: {
            text: 'ECharts 入门示例'
          },
          tooltip: {},
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [
            {
              name: '销量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }
          ]
        });
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
.contentDiv{
  border:1px solid #1F2C62;
  border-radius: 4px;
  box-shadow: 1px 2px 2px 1px #1F2C62;
  margin-bottom: 10px;
  padding: 5px;
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
.activeChart{
  /*outline:1px solid red;*/
  background-color: #0A2148;
}
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
</style>