<template>
  <div class="main">
    <!--<mt-header fixed>-->
      <!--<mt-button slot="left">UHDXpress</mt-button>-->
      <!--<mt-button slot="right">实时监测</mt-button>-->
    <!--</mt-header>-->
    <Device></Device>
    <div class="chartArea">
      <div class="mainChart" id="mainChart">
        <div class="chartTitle">概览</div>
        <div id="totalChart" class="totalChart"></div>
      </div>
      <div id="cardsChart" class="cardsChart">
        <div class="lteChart" v-if="eth0Show" :class="chartStyle">
          <div class="chartTitle">ETH0</div>
          <div id="chart_eth0" class="chart"></div>
        </div>
        <div class="lteChart" v-if="lte1Show" :class="chartStyle">
          <div class="chartTitle">LTE1</div>
          <div id="chart_lte1" class="chart"></div>
        </div>
       <div class="lteChart" v-if="lte2Show" :class="chartStyle">
          <div class="chartTitle">LTE2</div>
          <div id="chart_lte2" class="chart"></div>
        </div>
        <div class="lteChart" v-if="lte3Show" :class="chartStyle">
          <div class="chartTitle">LTE3</div>
          <div id="chart_lte3" class="chart"></div>
        </div>
        <div class="lteChart" v-if="lte4Show" :class="chartStyle">
          <div class="chartTitle">LTE4</div>
          <div id="chart_lte4" class="chart"></div>
        </div>
        <div class="lteChart" v-if="lte5Show" :class="chartStyle">
          <div class="chartTitle">LTE5</div>
          <div id="chart_lte5" class="chart"></div>
        </div>
        <div class="lteChart" v-if="lte6Show" :class="chartStyle">
          <div class="chartTitle">LTE6</div>
          <div id="chart_lte6" class="chart"></div>
        </div>
        <div class="lteChart" v-if="usblanShow" :class="chartStyle">
          <div class="chartTitle">USB-LAN</div>
          <div id="chart_usb-lan" class="chart"></div>
        </div>
        <div class="lteChart" v-if="usblan2Show" :class="chartStyle">
          <div class="chartTitle">USB-LAN2</div>
          <div id="chart_usb-lan2" class="chart"></div>
        </div>
        <div class="lteChart" v-if="usb5g1Show" :class="chartStyle">
          <div class="chartTitle">USB-5G1</div>
          <div id="chart_usb-5g1" class="chart"></div>
        </div>
        <div class="lteChart" v-if="usb5g2Show" :class="chartStyle">
          <div class="chartTitle">USB-5G2</div>
          <div id="chart_usb-5g2" class="chart"></div>
        </div>
        <div class="lteChart" v-if="wifiShow" :class="chartStyle">
          <div class="chartTitle">WIFI</div>
          <div id="chart_wifi" class="chart"></div>
        </div>
      </div>
    </div>
    <!--<mt-palette-button content="+" @expanded="main_log('expanded')" @collapse="main_log('collapse')"-->
                       <!--direction="lt" class="pb" :radius="80" ref="target_1" mainButtonStyle="color:#fff;background-color:#26a2ff;"-->
                       <!--style="position: fixed;right: 20px;bottom: 100px;">-->
      <!--<div class="my-icon-button indexicon icon-popup" @touchstart="sub_log(1)"></div>-->
      <!--<div class="my-icon-button indexicon icon-popup" @touchstart="sub_log(2)"></div>-->
      <!--<div class="my-icon-button indexicon icon-popup" @touchstart="sub_log(3)"></div>-->
    <!--</mt-palette-button>-->
  </div>
</template>

<script>
import Vue from 'vue'
import Device from '../basic/Device';
import { mapState } from 'vuex';
import echarts from 'echarts';
import $ from 'jquery';
Vue.prototype.$echarts = echarts;
export default {
  name: 'Status',
  data(){
    return{
      ActiveDevice:null,
      timer:null,
      /*keyArr: [],
      allChartData: [],
      curChart: [],
      cardData : [],*/
      myChartTotal:null,
      lteChart : null,
      eth0Show:false,
      lte1Show:false,
      lte2Show:false,
      lte3Show:false,
      chartStyle:"",
      myChartCards: {},
      marginTitleLeft:100,
      gridTop:110,
      marginLeft:30,
      legendTop:20,
      xData : [],
      chartLegendArr : ["Total"],
      chartGeneralView : {
        "up":["Total"],
        "down":["Total"],
        "trans":["Total"],
        "buss":["Total"]
      },
      charts : {
        "eth0": "chart_eth0",
        "wifi": "chart_wifi",
        "lte1": "chart_lte1",
        "lte2": "chart_lte2",
        "lte3": "chart_lte3",
        "lte4": "chart_lte4",
        "lte5": "chart_lte5",
        "lte6": "chart_lte6",
        "usb-lan": "chart_usb-lan",
        "usb-lan2": "chart_usb-lan2",
        "usb-5g1": "chart_usb-5g1",
        "usb-5g2": "chart_usb-5g2"
      },
      chartCardView : {
        "eth0": "",
        "sim1": "",
        "sim2": "",
        "sim3": "",
        "sim4": "",
        "sim5": "",
        "sim6": "",
        "usb-5g1": "",
        "usb-5g2": "",
        "usb-lan": "",
        "usb-lan2": "",
        "wifi": ""
      },
      lineStyle : {
        width: 1,
        type: 'solid' //'dotted'虚线 'solid'实线
      },
      commonOptionXAxis : [{
        type: "category",
        axisLine: {
          lineStyle: {
            color: '#32346c'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
          //interval:3,
          inside: false,
          textStyle: {
            color: '#bac0c0',
            fontWeight: 'normal',
            fontSize: '12'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#32346c'
          }
        },
        splitArea: {
          show: false
        },
        boundaryGap: false //, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样
        //data: xData,
      }],
      commonOptionYAxis1 : {
        type: 'value',
        name: '速率(Mbps)',
        /*min:0,
        max:80,*/
        nameTextStyle: {
          color: '#ddd'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#32346c'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#1c1c45' //'#32346c '
          }
        },
        axisLabel: {
          textStyle: {
            color: '#bac0c0',
            fontWeight: 'normal',
            fontSize: '12'
          },
          formatter: '{value}'
        }
      },
      commonOptionYAxis2 : {
        type: 'value',
        name: '丢包率(%)',
        min: 0,
        max: 100,
        nameTextStyle: {
          color: '#ddd'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#32346c'
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#32346c '
          }
        },
        axisLabel: {
          textStyle: {
            color: '#bac0c0',
            fontWeight: 'normal',
            fontSize: '12'
          },
          formatter: '{value}'
        }
      },
      commonOptionTitle : [{
        text: "",
        left: this.marginTitleLeft,
        top: 0,
        textStyle: {
          color: '#fff',
          fontSize: '14',
          fontWeight: 'bold',
          text: ""
        }
      }, {
        text: "",
        left: 'center',
        //right: marginTitleRight,
        top: 2,
        textStyle: {
          color: '#ddd',
          fontSize: '12',
          fontWeight: 'normal',
          rich: {
            'totalUp':      {color: colorGV['上传速率'],fontWeight: 'bold',fontSize: '12'},
            'totalDown':    {color: colorGV['下载速率'],fontWeight: 'bold',fontSize: '12'},
            'TotalLossDev': {color: colorGV['传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'TotalLossRcv': {color: colorGV['业务丢包'],  fontWeight: 'bold',fontSize: '12'},

            'SIM1Up':       {color: colorGV['SIM1↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM1Down':     {color: colorGV['SIM1↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM1LossDev':  {color: colorGV['SIM1传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM1LossRcv':  {color: colorGV['SIM1业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM2Up':       {color: colorGV['SIM2↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM2Down':     {color: colorGV['SIM2↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM2LossDev':  {color: colorGV['SIM2传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM2LossRcv':  {color: colorGV['SIM2业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM3Up':       {color: colorGV['SIM3↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM3Down':     {color: colorGV['SIM3↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM3LossDev':  {color: colorGV['SIM3传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM3LossRcv':  {color: colorGV['SIM3业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM4Up':       {color: colorGV['SIM4↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM4Down':     {color: colorGV['SIM4↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM4LossDev':  {color: colorGV['SIM4传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM4LossRcv':  {color: colorGV['SIM4业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM5Up':       {color: colorGV['SIM5↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM5Down':     {color: colorGV['SIM5↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM5LossDev':  {color: colorGV['SIM5传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM5LossRcv':  {color: colorGV['SIM5业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM6Up':       {color: colorGV['SIM6↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM6Down':     {color: colorGV['SIM6↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM6LossDev':  {color: colorGV['SIM6传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM6LossRcv':  {color: colorGV['SIM6业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'ETH0Up':       {color: colorGV['ETH0↑'],fontWeight: 'bold',fontSize: '12'},
            'ETH0Down':     {color: colorGV['ETH0↓'],fontWeight: 'bold',fontSize: '12'},
            'ETH0LossDev':  {color: colorGV['ETH0传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'ETH0LossRcv':  {color: colorGV['ETH0业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-5G1Up':       {color: colorGV['USB-5G1↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G1Down':     {color: colorGV['USB-5G1↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G1LossDev':  {color: colorGV['USB-5G1传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G1LossRcv':  {color: colorGV['USB-5G1业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-5G2Up':       {color: colorGV['USB-5G2↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G2Down':     {color: colorGV['USB-5G2↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G2LossDev':  {color: colorGV['USB-5G2传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G2LossRcv':  {color: colorGV['USB-5G2业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-LANUp':       {color: colorGV['USB-LAN↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-LANDown':     {color: colorGV['USB-LAN↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-LANLossDev':  {color: colorGV['USB-LAN传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-LANLossRcv':  {color: colorGV['USB-LAN业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-LAN2Up':       {color: colorGV['USB-LAN2↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-LAN2Down':     {color: colorGV['USB-LAN2↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-LAN2LossDev':  {color: colorGV['USB-LAN2传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-LAN2LossRcv':  {color: colorGV['USB-LAN2业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'WIFIUp':       {color: colorGV['WIFI↑'],fontWeight: 'bold',fontSize: '12'},
            'WIFIDown':     {color: colorGV['WIFI↓'],fontWeight: 'bold',fontSize: '12'},
            'WIFILossDev':  {color: colorGV['WIFI传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'WIFILossRcv':  {color: colorGV['WIFI业务丢包'],fontWeight: 'bold',fontSize: '12'}
          }
        }
      }],
      commonOptionTitleCard : [{
        text: "",
        left: 10,
        top: 0,
        textStyle: {
          color: '#fff',
          fontSize: '12',
          fontWeight: 'bold',
          text: ""
        }
      }, {
        text: "",
        right: 10,
        top: 0,
        textStyle: {
          color: '#ddd',
          fontSize: '10',
          fontWeight: 'normal',
          rich: {
            'SIM1Up':       {color: colorGV['SIM1↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM1Down':     {color: colorGV['SIM1↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM1LossDev':  {color: colorGV['SIM1传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM1LossRcv':  {color: colorGV['SIM1业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM2Up':       {color: colorGV['SIM2↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM2Down':     {color: colorGV['SIM2↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM2LossDev':  {color: colorGV['SIM2传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM2LossRcv':  {color: colorGV['SIM2业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM3Up':       {color: colorGV['SIM3↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM3Down':     {color: colorGV['SIM3↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM3LossDev':  {color: colorGV['SIM3传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM3LossRcv':  {color: colorGV['SIM3业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM4Up':       {color: colorGV['SIM4↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM4Down':     {color: colorGV['SIM4↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM4LossDev':  {color: colorGV['SIM4传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM4LossRcv':  {color: colorGV['SIM4业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM5Up':       {color: colorGV['SIM5↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM5Down':     {color: colorGV['SIM5↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM5LossDev':  {color: colorGV['SIM5传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM5LossRcv':  {color: colorGV['SIM5业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'SIM6Up':       {color: colorGV['SIM6↑'],fontWeight: 'bold',fontSize: '12'},
            'SIM6Down':     {color: colorGV['SIM6↓'],fontWeight: 'bold',fontSize: '12'},
            'SIM6LossDev':  {color: colorGV['SIM6传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'SIM6LossRcv':  {color: colorGV['SIM6业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'ETH0Up':       {color: colorGV['ETH0↑'],fontWeight: 'bold',fontSize: '12'},
            'ETH0Down':     {color: colorGV['ETH0↓'],fontWeight: 'bold',fontSize: '12'},
            'ETH0LossDev':  {color: colorGV['ETH0传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'ETH0LossRcv':  {color: colorGV['ETH0业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-5G1Up':       {color: colorGV['USB-5G1↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G1Down':     {color: colorGV['USB-5G1↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G1LossDev':  {color: colorGV['USB-5G1传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G1LossRcv':  {color: colorGV['USB-5G1业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-5G2Up':       {color: colorGV['USB-5G2↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G2Down':     {color: colorGV['USB-5G2↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G2LossDev':  {color: colorGV['USB-5G2传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-5G2LossRcv':  {color: colorGV['USB-5G2业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-LANUp':       {color: colorGV['USB-LAN↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-LANDown':     {color: colorGV['USB-LAN↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-LANLossDev':  {color: colorGV['USB-LAN传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-LANLossRcv':  {color: colorGV['USB-LAN业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'USB-LAN2Up':       {color: colorGV['USB-LAN2↑'],fontWeight: 'bold',fontSize: '12'},
            'USB-LAN2Down':     {color: colorGV['USB-LAN2↓'],fontWeight: 'bold',fontSize: '12'},
            'USB-LAN2LossDev':  {color: colorGV['USB-LAN2传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'USB-LAN2LossRcv':  {color: colorGV['USB-LAN2业务丢包'],fontWeight: 'bold',fontSize: '12'},

            'WIFIUp':       {color: colorGV['WIFI↑'],fontWeight: 'bold',fontSize: '12'},
            'WIFIDown':     {color: colorGV['WIFI↓'],fontWeight: 'bold',fontSize: '12'},
            'WIFILossDev':  {color: colorGV['WIFI传输丢包'],fontWeight: 'bold',fontSize: '12'},
            'WIFILossRcv':  {color: colorGV['WIFI业务丢包'],fontWeight: 'bold',fontSize: '12'}
          }
        }
      }, {
        text: "",
        left: 'center',
        top: 22,
        textStyle: {
          color: '#fff',
          fontSize: '12',
          fontWeight: 'normal',
          text: ""
        }
      }],
      commonOptionGrid : {
        containLabel: true,
        borderWidth: 0,
        top: this.gridTop,
        bottom: 10,
        left: 20,
        right: 20,
        textStyle: {
          color: "#fff"
        }
      },
      commonOptionTooltipFalse : {
        show: false
      },
      commonOptionLegend : {
        type: 'scroll',
        pageTextStyle: {
          color: '#ccc'
        },
        pageIconColor: '#337ab7',
        pageIconInactiveColor: "#B4B5B7",
        top: this.legendTop,
        itemGap: 5,
        itemWidth: 5,
        textStyle: {
          color: '#ddd',
          fontSize: '10'
        },
        tooltip: {
          show: true
        },
        data: name
      }
    }
  },
  computed: {
    ...mapState(['user','ActiveDevice'])
  },
  components: {
    Device
  },
  watch:{   //监听当前设备值变化
    '$store.state.ActiveDevice': {
      immediate: true,
      handler(val) {
        console.warn(val)
        if(val){
          var that = this;
          that.ActiveDevice = val;
          that.myChartCards = {};
          var initData = that.initChartData();
          console.log("切换设备，重启定时器");
          clearInterval(that.timer);
          var devSns = initData.devSns;
          that.getChartData(devSns);  
          that.timer = setInterval(function(){
            that.getChartData(devSns);  
          },1000)
        }
      }
    }
  },
  activated(){  //生命周期-缓存页面激活

  },
  deactivated(){   //生命周期-缓存页面失活

  },
  created(){
    console.log("created"); 
  },
  mounted() { //生命周期-页面初始化完成
    console.log("mounted")
    var that = this;
    that.formatXData();
  },
  methods:{
    testMint(){
      this.$toast({
        message: '操作成功',
        iconClass: 'icon icon-success'
      });
    },
    showChannelList(){
      this.popupVisible = true;
    },
    changeChannelList(item){
      this.activeChannel = item;
      this.popupVisible = false;
    },
    main_log(val) {
      console.log('main_log', val);
    },
    sub_log(val) {
      console.log('sub_log', val);
      this.$refs.target_1.collapse();
    },
    //初始化图表数据
    initChartData(){
      var that = this;
      var activeDevice = that.ActiveDevice;//当前选中设备
      if(!activeDevice){//没有可显示的数据(没有配对的设备)
        console.log("no active device");
        return;
      }
      var curChart = activeDevice.dev_sn+"/"+activeDevice.rcv_sn+"/"+activeDevice.board_id;//当前点击的背包对
      localStorage.curChart = JSON.stringify(curChart);
      var keyArr = localStorage.chartKey ? JSON.parse(localStorage.chartKey) : [];
      var cardDatasObj = localStorage.allChartData ? JSON.parse(localStorage.allChartData) : {};
      if(Object.keys(cardDatasObj).length === 0){
        keyArr = [];//没有数据的时候即使localStorage.chartKey有值allDevKey也置空
      }
      var cardDataShow = {}; //当前要显示的图的数据
      var allChartData = {}; //已存过的每个图的数据，都已经有值了，只是更新数据
      //循环所有依存数据，为每个图初始化数据
      for (var key in cardDatasObj) {
        allChartData[key] = cardDatasObj[key];
      }
      //没有存储过数据的背包对，
      //则将该背包加入到请求设备列表里
      //将所有存储数据赋初值0
      if (keyArr.indexOf(curChart) == -1) { 
        if (!curChart) {//curChart为undefined
          return;
        }
        keyArr.push(curChart);
        localStorage.chartKey = JSON.stringify(keyArr);//存所有要请求数据的背包
        allChartData[curChart] = {
          "seriesDataUp": {}, //各网卡的上传速率
          "seriesDataDown": {}, //各网卡的下载速率
          "seriesCardLost": {}, //各网卡的上行丢包率
          "seriesDevLost": [], //总的上传丢包率
          "seriesTotalLoss": [], //总的下载丢包率
          "seriesDataDev": [], //上传总速率
          "seriesDataRcv": [] //下载总速率
        };
        //11个网卡上先都填充0
        for (var i = 0; i < cardIdArr.length; i++) {
          //上行速率
          allChartData[curChart].seriesDataUp[cardIdArr[i]] = {};
          allChartData[curChart].seriesDataUp[cardIdArr[i]]["ip"] = "";
          allChartData[curChart].seriesDataUp[cardIdArr[i]]["name"] = "";
          allChartData[curChart].seriesDataUp[cardIdArr[i]]["operator"] = "";
          allChartData[curChart].seriesDataUp[cardIdArr[i]]["data"] = new Array(xSplit).fill(0);
          //下行速率
          allChartData[curChart].seriesDataDown[cardIdArr[i]] = {};
          allChartData[curChart].seriesDataDown[cardIdArr[i]]["ip"] = "";
          allChartData[curChart].seriesDataDown[cardIdArr[i]]["name"] = "";
          allChartData[curChart].seriesDataDown[cardIdArr[i]]["data"] = new Array(xSplit).fill(0);
          //上行丢包率
          allChartData[curChart].seriesCardLost[cardIdArr[i]] = {};
          allChartData[curChart].seriesCardLost[cardIdArr[i]]["data"] = new Array(xSplit).fill(0);
        }
        allChartData[curChart].seriesDataDev = new Array(xSplit).fill(0); //上行总速率
        allChartData[curChart].seriesDataRcv = new Array(xSplit).fill(0); //下行总速率
        allChartData[curChart].seriesDevLost = new Array(xSplit).fill(0); //上行总丢包率
        allChartData[curChart].seriesTotalLoss = new Array(xSplit).fill(0); //下行总丢包率
        localStorage.allChartData = JSON.stringify(allChartData);
      }
      var devSns = keyArr.map(x=> x.split("/")[0]);
      //过滤掉被报名非法和重复的背包
      var devFilterArr = [];
      for (var i = 0; i < devSns.length; i++) {
        if(devSns[i] != "undefined" && devFilterArr.indexOf(devSns[i]) == -1){
          devFilterArr.push(devSns[i]);
        }
      }
      devSns = devFilterArr.join("/");
      var resData = {};
      resData.devSns = devSns;
      /*resData.logId = logId;
      resData.allChartData = allChartData;
      resData.keyArr = keyArr;
      resData.curChart = curChart;
      var logId = getLoginId();*/
      return resData;
    },
    getChartData(devSns){
      console.log("getChartData")
      var that = this;
      this.$axios({
        method: 'post',
        url:"/page/index/chartData.php",
        data:this.$qs.stringify({
          getChartsData:true,
          userId: that.user.id,
          devSNs: devSns
        }),
        Api:"getChartsData",
        AppId:"android",
        UserId:that.user.id
      })
      .then(function (response) {
        let res = response.data;
        if(res.res.success){
          that.formatChartData(res.data);
          var cardData = localStorage.cardData ? JSON.parse(localStorage.cardData) : {};
          that.initChartStyle(cardData);
          that.getChartShowContent(cardData);
        }else{
          console.log(error)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    },
    formatChartData(data){//data:当前请求到的数据
      var that = this;
      var keyArr = localStorage.chartKey ? JSON.parse(localStorage.chartKey) : [];
      var allChartData = localStorage.allChartData ? JSON.parse(localStorage.allChartData) : {};
      var curChart = localStorage.curChart ? JSON.parse(localStorage.curChart) : {};
      for (var key in data) {
        if(!data[key]){
          continue;
        }
        var dataAll = data[key][0]; //上行速率，下行速率，上行丢包率
        var dataDev = data[key][1]["dev_push_br"]; //上行总速率
        var dataRcv = data[key][2] ? data[key][2]["rcv_br"] : 0; //下行速率
        var dataDownLoss = data[key][3] ? data[key][3]["TotalLossRate"] : 0; //下行总丢包
        var dataUpLoss = data[key][data[key].length - 1]["dev_lost_br"]; //上行总丢包
        var curChartDevRcvBoard = "";//当前设备的 devsn/rcvsn/boardid
        for (var i = 0; i < keyArr.length; i++) {
          if (keyArr[i].split("/")[0] == key) {
            curChartDevRcvBoard = keyArr[i];
          }
        }
        //allChartData中缺少curChart数据
        if(!allChartData.hasOwnProperty(curChartDevRcvBoard)){
          //删除chartKey
          var chartKey = JSON.parse(localStorage.getItem("chartKey"));
          var newChartKey = [];
          var delSn = curChartDevRcvBoard.split('/')[0]; //要删除的背包序列号
          for(var m=0; m<chartKey.length; m++){
            if(chartKey[m].split('/')[0] != delSn){
              newChartKey.push(chartKey[m]);
            }
          }
          localStorage.setItem('chartKey',JSON.stringify(newChartKey));
          return;
        }
        var seriesDataUp = allChartData[curChartDevRcvBoard].seriesDataUp;
        var seriesDataDown = allChartData[curChartDevRcvBoard].seriesDataDown;
        var seriesCardLost = allChartData[curChartDevRcvBoard].seriesCardLost;
        var seriesDataDev = allChartData[curChartDevRcvBoard].seriesDataDev;
        var seriesDataRcv = allChartData[curChartDevRcvBoard].seriesDataRcv;
        var seriesDevLost = allChartData[curChartDevRcvBoard].seriesDevLost;
        var seriesTotalLoss = allChartData[curChartDevRcvBoard].seriesTotalLoss;
        for (var i = 0; i < dataAll.length; i++) {
          if (cardIdArr.indexOf(dataAll[i]['card_id']) == -1) {
            continue;
          }
          //如果当前网卡没有存过数据，则将该网卡初始化
          //网卡上行速率
          if (!seriesDataUp[dataAll[i]["card_id"]]) {
            seriesDataUp[dataAll[i]["card_id"]] = {};
            seriesDataUp[dataAll[i]["card_id"]]["ip"] = "";
            seriesDataUp[dataAll[i]["card_id"]]["name"] = "";
            seriesDataUp[dataAll[i]["card_id"]]["operator"] = "";
            seriesDataUp[dataAll[i]["card_id"]]["data"] = new Array(xSplit).fill(0);
          }
          //网卡下行速率
          if (!seriesDataDown[dataAll[i]["card_id"]]) {
            seriesDataDown[dataAll[i]["card_id"]] = {};
            seriesDataDown[dataAll[i]["card_id"]]["ip"] = "";
            seriesDataDown[dataAll[i]["card_id"]]["name"] = "";
            seriesDataDown[dataAll[i]["card_id"]]["data"] = new Array(xSplit).fill(0);
          }
          //网卡丢包率
          if (!seriesCardLost[dataAll[i]["card_id"]]) {
            seriesCardLost[dataAll[i]["card_id"]] = {};
            seriesCardLost[dataAll[i]["card_id"]]["data"] = new Array(xSplit).fill(0);
          }
          //给网卡上行速率，下行速率，丢包率数据赋值
          seriesDataUp[dataAll[i]["card_id"]]["ip"] = dataAll[i]["card_ip"];
          seriesDataUp[dataAll[i]["card_id"]]["name"] = dataAll[i]["card_name"];
          seriesDataUp[dataAll[i]["card_id"]]["operator"] = dataAll[i]["operator"];
          seriesDataUp[dataAll[i]["card_id"]]["data"].unshift(dataAll[i]["send_br"]);
          seriesDataUp[dataAll[i]["card_id"]]["data"].pop();
          seriesDataDown[dataAll[i]["card_id"]]["ip"] = dataAll[i]["card_ip"];
          seriesDataDown[dataAll[i]["card_id"]]["name"] = dataAll[i]["card_name"];
          seriesDataDown[dataAll[i]["card_id"]]["data"].unshift(dataAll[i]["receive_br_10"]);
          seriesDataDown[dataAll[i]["card_id"]]["data"].pop();
          seriesCardLost[dataAll[i]["card_id"]]["data"].unshift(dataAll[i]["card_lost_br"]);
          seriesCardLost[dataAll[i]["card_id"]]["data"].pop();
        }
        //dataAll里没有的，多余的网卡从seriesDataUp里删除
        for (var keys in seriesDataUp){
          var bFind = false;
          for(var i=0; i<dataAll.length; i++){
            if(dataAll[i].card_id == keys){
              bFind = true;
            }
          }
          if(!bFind){
            delete seriesDataUp[keys];
            delete seriesDataDown[keys];
            delete seriesCardLost[keys];
          }
        }
        //过滤出不是全0的数据，备份6张网卡的默认值
        var validSeriesDataUp = {};
        var validSeriesDataDown = {};
        var validSeriesCardLost = {};
        var defaultDataUp = {};
        var defaultDataDown = {};
        var defaultDataLost = {};
        for (var key1 in seriesDataUp) {
          //备份6张网卡的默认值
          if(key1 == 'lte1' || key1 == 'lte2' || key1 == 'lte3' 
            || key1 == 'lte4' || key1 == 'lte5' || key1 == 'lte6'){
            defaultDataUp[key1] = {};
            defaultDataUp[key1]["ip"] = seriesDataUp[key1]["ip"];
            defaultDataUp[key1]["name"] = seriesDataUp[key1]["name"];
            defaultDataUp[key1]["data"] = seriesDataUp[key1]["data"];
            defaultDataUp[key1]["operator"] = seriesDataUp[key1]["operator"];
            defaultDataDown[key1] = {};
            defaultDataDown[key1]["ip"] = seriesDataDown[key1]["ip"];
            defaultDataDown[key1]["name"] = seriesDataDown[key1]["name"];
            defaultDataDown[key1]["data"] = seriesDataDown[key1]["data"];
            defaultDataLost[key1] = {};
            defaultDataLost[key1]["data"] = seriesCardLost[key1]["data"];
          }
          //过滤出不是全0的数据
          var dataValid = seriesDataUp[key1]["data"];
          for (var i = 0; i < dataValid.length; i++) {
            if (dataValid[i] != 0 && dataValid[i] != null) {
              validSeriesDataUp[key1] = {};
              validSeriesDataUp[key1]["ip"] = seriesDataUp[key1]["ip"];
              validSeriesDataUp[key1]["name"] = seriesDataUp[key1]["name"];
              validSeriesDataUp[key1]["data"] = seriesDataUp[key1]["data"];
              validSeriesDataUp[key1]["operator"] = seriesDataUp[key1]["operator"];
            }
          }
        }
        for (var key2 in seriesDataDown) {
          var data2 = seriesDataDown[key2]["data"];
          for (var i = 0; i < data2.length; i++) {
            if (data2[i] != 0 && data2[i] != null) {
              validSeriesDataDown[key2] = {};
              validSeriesDataDown[key2]["ip"] = seriesDataDown[key2]["ip"];
              validSeriesDataDown[key2]["name"] = seriesDataDown[key2]["name"];
              validSeriesDataDown[key2]["data"] = seriesDataDown[key2]["data"];
            }
          }
        }
        for (var key3 in seriesCardLost) {
          var data3 = seriesCardLost[key3]["data"];
          for (var i = 0; i < data3.length; i++) {
            if (data3[i] != 0 && data3[i] != null) {
              validSeriesCardLost[key3] = {};
              validSeriesCardLost[key3]["data"] = seriesCardLost[key3]["data"];
            }
          }
        }
        seriesDataDev.unshift(dataDev);
        seriesDataDev.pop();
        seriesDataRcv.unshift(dataRcv);
        seriesDataRcv.pop();
        seriesTotalLoss.unshift(dataDownLoss);
        seriesTotalLoss.pop();
        seriesDevLost.unshift(dataUpLoss);
        seriesDevLost.pop();


        if($.isEmptyObject(validSeriesDataUp) && $.isEmptyObject(validSeriesDataDown) &&
          $.isEmptyObject(validSeriesCardLost)){
          allChartData[curChartDevRcvBoard].seriesDataUp = defaultDataUp;
          allChartData[curChartDevRcvBoard].seriesDataDown = defaultDataDown;
          allChartData[curChartDevRcvBoard].seriesCardLost = defaultDataLost;
        } else{
          allChartData[curChartDevRcvBoard].seriesDataUp = validSeriesDataUp;
          allChartData[curChartDevRcvBoard].seriesDataDown = validSeriesDataDown;
          allChartData[curChartDevRcvBoard].seriesCardLost = validSeriesCardLost;
        }
        allChartData[curChartDevRcvBoard].seriesDataDev = seriesDataDev;
        allChartData[curChartDevRcvBoard].seriesDataRcv = seriesDataRcv;
        allChartData[curChartDevRcvBoard].seriesDevLost = seriesDevLost;
        allChartData[curChartDevRcvBoard].seriesTotalLoss = seriesTotalLoss;
        localStorage.allChartData = JSON.stringify(allChartData);
        if (curChart.split("/")[0] == key) { //当前要显示的放在sessionStorage.cardData中
          localStorage.cardData = JSON.stringify(allChartData[curChart]);
        }
      }
    },
    initChartStyle(cardData){
      var that = this;
      var dataUpShow = cardData.seriesDataUp;
      var dataDownShow = cardData.seriesDataDown;
      var dataUpLoss = cardData.seriesCardLost; 
      var upArr = Object.keys(dataUpShow); //有上传数据的网卡
      var downArr = Object.keys(dataDownShow); //有下载数据的网卡
      var showCard = that.MergeArray(upArr, downArr); //所有有数据的网卡名称
      var cardNum = showCard.length;
      console.log("showCard")
      console.log(showCard)
      switch(cardNum){
        case 1:
          $("#mainChart").css("height","50%");
          $("#cardsChart").css("height","50%")
          that.judgeCardShow(showCard);//判断哪张网卡显示，哪张不显示
          break;
        case 2:
          $("#mainChart").css("height","34%");
          $("#cardsChart").css("height","66%");
          that.judgeCardShow(showCard);
          break;
        case 3:
          $("#mainChart").css("height","25%")
          $("#cardsChart").css("height","75%")
          that.judgeCardShow(showCard);
          break;
        default:
          $("#mainChart").css("height","34%")
          $("#cardsChart").css("height","66%")
          that.judgeCardShow(showCard);
          break;
      }
    },
    initChartTotal(cardData) {
      var that = this;
      var rateMax = 1.5;
      var rateMin = 0.5;
      var splitNumber = 5;
      var maxYaxis = 0;
      var minYaxis = 0;
      var interval = 0;
      //if (localStorage.chartAuto == "true") {
        maxYaxis = Math.ceil(sessionStorage.speedInput * rateMax);
        maxYaxis = maxYaxis + 5 - maxYaxis % 5;
        minYaxis = Math.floor(sessionStorage.speedInput * rateMin);
        minYaxis = minYaxis - minYaxis % 5;
      /*} else {
        interval = sessionStorage.chartInterval;
        maxYaxis = sessionStorage.chartMax;
        minYaxis = (sessionStorage.chartMax - sessionStorage.chartInterval * 5) > 0 ? (sessionStorage.chartMax - sessionStorage.chartInterval * 5) : 0;
      }*/
      if (!that.myChartTotal) {
        that.myChartTotal = echarts.init(document.getElementById('totalChart'));
      }
      that.myChartTotal.resize();
      var upShow = that.chartGeneralView.up.map(function(item){if(item==""){return ""};return item+"↑";});
      var downShow = that.chartGeneralView.down.map(function(item){if(item==""){return ""};return item+"↓";});
      var transShow = that.chartGeneralView.trans.map(function(item){if(item==""){return ""};return item+"传输丢包";});
      var bussShow = that.chartGeneralView.buss.map(function(item){if(item==""){return ""};return item+"业务丢包";});
      var legendName = upShow.concat(downShow).concat(transShow).concat(bussShow).filter(function (el) {return el !== '';});
      
      var dataAll = {};
      var maxDevLoss = 0;
      var maxRcvLoss = 0;
      var maxLoss = 0;
      for(var k=0; k<legendName.length; k++){
        if(legendName[k].indexOf("↑") != -1){//上行
          if(legendName[k].split("↑")[0] == that.chartLegendArr[0]){//total
            dataAll[legendName[k]] = cardData.seriesDataDev.map(function(x){return (x/1000).toFixed(3)*1});  
          }else{
            if(JSON.stringify(cardData.seriesDataUp) == "{}"){//没有推流，没有数据，
              dataAll[legendName[k]] = new Array(xSplit).fill(0);
            }else{
              if(cardData.seriesDataUp[cardMatch[legendName[k].split("↑")[0]][0]]){
                dataAll[legendName[k]] = cardData.seriesDataUp[cardMatch[legendName[k].split("↑")[0]][0]]["data"].map(function(x){return (x/1000).toFixed(3)*1});  
              }else if(cardData.seriesDataUp[cardMatch[legendName[k].split("↑")[0]][1]]){
                dataAll[legendName[k]] = cardData.seriesDataUp[cardMatch[legendName[k].split("↑")[0]][1]]["data"].map(function(x){return (x/1000).toFixed(3)*1});  
              }else{
                dataAll[legendName[k]] = new Array(xSplit).fill(0);
              }
            }
          }
        }else if(legendName[k].indexOf("↓") != -1){//下行
          if(legendName[k].split("↓")[0] == that.chartLegendArr[0]){//total
            dataAll[legendName[k]] = cardData.seriesDataRcv.map(function(x){return (x/1000).toFixed(3)*1});  
          }else{
            if(JSON.stringify(cardData.seriesDataDown) == "{}"){//没有推流，没有数据，
              dataAll[legendName[k]] = new Array(xSplit).fill(0);
            }else{
              if(cardData.seriesDataDown[cardMatch[legendName[k].split("↓")[0]][0]]){
                dataAll[legendName[k]] = cardData.seriesDataDown[cardMatch[legendName[k].split("↓")[0]][0]]["data"].map(function(x){return (x/1000).toFixed(3)*1});
              }else if(cardData.seriesDataDown[cardMatch[legendName[k].split("↓")[0]][1]]){
                dataAll[legendName[k]] = cardData.seriesDataDown[cardMatch[legendName[k].split("↓")[0]][1]]["data"].map(function(x){return (x/1000).toFixed(3)*1});
              }else{
                dataAll[legendName[k]] = new Array(xSplit).fill(0);
              }
            }
          }
        }else if(legendName[k].indexOf("传输丢包") != -1){//传输丢包
          if(legendName[k].split("传输丢包")[0] == that.chartLegendArr[0]){//total
            dataAll[legendName[k]] = cardData.seriesDevLost.map(function(x){return (parseInt(x)/10).toFixed(1)*1});  
          }else{
            if(JSON.stringify(cardData.seriesCardLost) == "{}"){//没有推流，没有数据，
              dataAll[legendName[k]] = new Array(xSplit).fill(0);
            }else{
              if(cardData.seriesCardLost[cardMatch[legendName[k].split("传输丢包")[0]][0]]){
                dataAll[legendName[k]] = cardData.seriesCardLost[cardMatch[legendName[k].split("传输丢包")[0]][0]]["data"].map(function(x){return (x/10).toFixed(1)*1});
              }else if(cardData.seriesCardLost[cardMatch[legendName[k].split("传输丢包")[0]][1]]){
                dataAll[legendName[k]] = cardData.seriesCardLost[cardMatch[legendName[k].split("传输丢包")[0]][1]]["data"].map(function(x){return (x/10).toFixed(1)*1});
              }else{
                dataAll[legendName[k]] = new Array(xSplit).fill(0);
              }
            }
          }
        }else if(legendName[k].indexOf("业务丢包") != -1){//业务丢包
          dataAll[legendName[k]] = cardData.seriesTotalLoss.map(function(x){return (x/10).toFixed(1)*1});  
        }
      }
      var maxDevLoss = 0;
      var maxRcvLoss = 0;
      var maxLoss = 0;
      var series = [];
      if(dataAll["Total传输丢包"] && dataAll["Total业务丢包"]){
        for (var i = 0; i < xSplit; i++) {
          maxDevLoss = (maxDevLoss>dataAll["Total传输丢包"][i] ? maxDevLoss : dataAll["Total传输丢包"][i]);
          maxRcvLoss = (maxRcvLoss>dataAll["Total业务丢包"][i] ? maxRcvLoss : dataAll["Total业务丢包"][i]);
        }
      }else if(!dataAll["Total传输丢包"]){
        maxDevLoss = 0;
      }else if(!dataAll["Total业务丢包"]){
        maxRcvLoss = 0;
      }
      maxLoss = maxDevLoss>maxRcvLoss?maxDevLoss:maxRcvLoss;
      if(that.user.prefix == PREFIX){
        if(maxLoss >= 4){
          maxLoss = 30;
        }else if(maxLoss < 2){
          maxLoss = 3;
        }else{
          maxLoss = 5;
        }
      }
      else{
        maxLoss = 30;
      }

      for(var m=0; m<legendName.length; m++){
        var name = "";
        if(legendName[m] == "Total↑"){
          name = "上传速率";
        }else if(legendName[m] == "Total↓"){
          name = "下载速率";
        }else if(legendName[m] == "Total传输丢包"){
          name = "传输丢包";
        }else if(legendName[m] == "Total业务丢包"){
          name = "业务丢包";
        }else{
          name = legendName[m];
        }
        series.push({
          name: name,
          type: "line",
          symbolSize: 3,
          symbol: 'circle',
          smooth: true,
          showSymbol: false,
          yAxisIndex: legendName[m].indexOf("丢包")!=-1?1:0,
          itemStyle: {
            normal: {
              color: colorGV[name],
              lineStyle: that.lineStyle,
              borderColor: colorGV[name], //图形的描边颜色。支持的格式同 color
              borderWidth: 8, //描边线宽。为 0 时无描边。[ default: 0 ] 
              barBorderRadius: 0,
              label: {
                show: false
              },
              opacity: 0.5
            }
          },
          areaStyle: {
            show:legendName[m].indexOf("丢包")!=-1?false:true,
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: colorGV[name]
              }, {
                offset: 0.8,
                color: 'rgba(255,255,255,0)'
              }], false),
              shadowBlur: 10,
              opacity: 0.3
            }
          },
          data: dataAll[legendName[m]]
        })
      }
      
      var xAxisOption = {};
      var yAxisOption1 = that.copy(that.commonOptionYAxis1);
      var yAxisOption2 = that.copy(that.commonOptionYAxis2);
      var option = {
        title: that.commonOptionTitle,
        legend: {
          show:false,
          type: 'scroll',
          pageTextStyle: {
            color: '#ccc'
          },
          pageIconColor: '#337ab7',
          pageIconInactiveColor: "#B4B5B7",
          top: this.legendTop,
          itemGap: 5,
          itemWidth: 5,
          textStyle: {
            color: '#ddd',
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
        yAxis: [yAxisOption1, yAxisOption2],
        series: series,
        animation: false
      };
      /*option.title[0].text = "概览";*/
      option.grid.top = '60';
      option.legend.top = 20;
      option.title[1].top = 5;
      var title = "";
      for(var n=0; n<legendName.length; n++){
        if(n%2==0 && n!= 0){
          title += "\n";
        }
        var name = "";
        if(legendName[n] == "Total↑"){
          name = "上传速率";
        }else if(legendName[n] == "Total↓"){
          name = "下载速率";
        }else if(legendName[n] == "Total传输丢包"){
          name = "传输丢包";
        }else if(legendName[n] == "Total业务丢包"){
          name = "业务丢包";
        }else{
          name = legendName[n];
        }
        if(legendName[n].indexOf("丢包") == -1){
          title += [name+" : ",
                  '{'+colorObj[name]+'|' + dataAll[legendName[n]][0] + '}Mbps  '].join("");
        }else{
          if(dataAll[legendName[n]]){
            title += [name+" : ",
                  '{'+colorObj[name]+'|' + dataAll[legendName[n]][0] + '}%  '].join("");
          }
        }
      }
      option.title[1].text = title;


      //文件回传且Y轴选自适应,图像的Y轴不设置yAxis，其他情况设置yAxis
      /*if(!(sessionStorage.chartAuto == "true" && $('#back_enable').bootstrapSwitch('state') == true)){
        option.yAxis[0].min = minYaxis;
        option.yAxis[0].max = maxYaxis;
      }
      option.yAxis[1].min = 0;
      option.yAxis[1].max = maxLoss;
      if (interval) {
        option.yAxis[0].interval = interval * 1;
      }*/
      option.legend.data = legendName.map(function(x){
                              if(x == "Total↑"){
                                return "上传速率";
                              }else if(x == "Total↓"){
                                return "下载速率";
                              }else if(x == "Total传输丢包"){
                                return "传输丢包";
                              }else if(x == "Total业务丢包"){
                                return "业务丢包";
                              }else {
                                return x;
                              }
                          });
      that.myChartTotal.setOption(option, true);
    },
    initChartCards(cardData){
      var cardData = JSON.parse(localStorage.cardData);
      var dataUpShow = cardData.seriesDataUp;
      var dataDownShow = cardData.seriesDataDown;
      var dataUpLoss = cardData.seriesCardLost; 
      var upArr = Object.keys(dataUpShow); //有上传数据的网卡
      var downArr = Object.keys(dataDownShow); //有下载数据的网卡
      var showCard = this.MergeArray(upArr, downArr); //所有有数据的网卡名称
      var cardNum = showCard.length;
      for (var i = 0; i < cardNum; i++) {
        var key = showCard[i];
        this.initChartCard(key, cardNum, dataUpShow, dataDownShow, dataUpLoss);
      }
    },
    initChartCard(key, cardNum, dataUpShow, dataDownShow, dataUpLoss){
      var that = this;
      var chartName = that.charts[key];
      var devSn = JSON.parse(localStorage.curChart).split("/")[0];
      if (!that.myChartCards[devSn]) {
        that.myChartCards[devSn] = {};
        that.myChartCards[devSn][chartName] = echarts.init(document.getElementById('chart_' + key));
      }else{
        if(!that.myChartCards[devSn][chartName]){
          that.myChartCards[devSn][chartName] = echarts.init(document.getElementById('chart_' + key));
        }
      }
      that.myChartCards[devSn][chartName].resize();
      var series = [];
      var dataUps = dataUpShow[key] ? dataUpShow[key]["data"].slice(0) : new Array(xSplit).fill(0);
      var dataDowns = dataDownShow[key] ? dataDownShow[key]["data"].slice(0) : new Array(xSplit).fill(0);
      var dataUpLoss = dataUpLoss[key] ? dataUpLoss[key]["data"] .slice(0): new Array(xSplit).fill(0);
      var name = dataUpShow[key] ? dataUpShow[key]['name'] : dataDownShow[key]['name'];
      var operator = dataUpShow[key] ? dataUpShow[key]['operator'] : "";
      operator = that.transOperator(operator);

      var maxUp = 0;
      var maxDown = 0;
      var maxUpLoss = 0;
      var max = 0;
      for (var i = 0; i < xSplit; i++) {
        dataUps[i] = (dataUps[i] / 1000).toFixed(3);
        dataDowns[i] = (dataDowns[i] / 1000).toFixed(3);
        dataUpLoss[i] = (dataUpLoss[i] / 10).toFixed(1);
        maxUp = (maxUp>dataUps[i] ? maxUp : dataUps[i]);
        maxDown = (maxDown>dataDowns[i] ? maxDown : dataDowns[i]);
        maxUpLoss = (maxUpLoss>dataUpLoss[i] ? maxUpLoss : dataUpLoss[i]);
      }
      max = maxUp>maxDown?maxUp:maxDown;
      var cardName = ""; 
      if(key.indexOf("lte")!=-1){
        cardName = "sim"+key.substr(key.length-1);
      }else{
        cardName = key;
      }
      var cardLine = that.chartCardView[cardName];
      var legendName = [];
      var title1Text = "";
      var cardLineArr = cardLine.split(",");
      if(cardLine != ""){
        function typeFormat(typeText){
          var showText = ""
          switch(typeText){
            case "上传速率":
              showText = "↑";
              break;
            case "下载速率":
              showText = "↓";
              break;
            case "传输丢包":
              showText = "传输丢包";
              break;
            case "业务丢包":
              showText = "业务丢包";
              break;
          }
          return showText;
        }
        for(var j=0; j<cardLineArr.length; j++){
          var colorName = "";
          var keyName = "";
          var seriesName = "";
          var data = "";
          switch(key){
            case "lte1":case "NR5G-NSA1":
              keyName = "SIM1";
              break;
            case "lte2":case "NR5G-NSA2":
              keyName = "SIM2";
              break;
            case "lte3":case "NR5G-NSA3":
              keyName = "SIM3";
              break;
            case "lte4":case "NR5G-NSA4":
              keyName = "SIM4";
              break;
            case "lte5":case "NR5G-NSA5":
              keyName = "SIM5";
              break;
            case "lte6":case "NR5G-NSA6":
              keyName = "SIM6";
              break;
            case "eth0":
              keyName = "ETH0";
              break;
            case "usb-5g1":
              keyName = "USB-5G1";
              break;
            case "usb-5g2":
              keyName = "USB-5G2";
              break;
            case "usb-lan":
              keyName = "USB-LAN";
              break;
            case "usb-lan2":
              keyName = "USB-LAN2";
              break;
            case "wifi":
              keyName = "WIFI";
              break;         
          }
          if(cardLineArr[j] == "up"){
            seriesName = "上传速率";
            data = dataUps;
            legendName.push("上传速率");
            title1Text += "{"+colorObj[keyName+'↑']+"|"+ dataUps[0] + "}Mbps/";
          }else if(cardLineArr[j] == "down"){
            seriesName = "下载速率";
            data = dataDowns;
            legendName.push("下载速率");
            title1Text += "{"+colorObj[keyName+'↓']+"|" + dataDowns[0] + "}Mbps/";
          }else{
            seriesName = "传输丢包";
            data = dataUpLoss;
            legendName.push("传输丢包");
            title1Text += "{"+colorObj[keyName+'传输丢包']+"|" + dataUpLoss[0] + "}%";
          }
          console.log("title1Text")
          console.log(title1Text)
          colorName = keyName + typeFormat(seriesName);
          series.push({
            name: seriesName,
            type: "line",
            symbolSize: 3,
            symbol: 'circle',
            smooth: true,
            showSymbol: false,
            yAxisIndex: seriesName.indexOf("丢包")!=-1 ? 1 : 0,
            itemStyle: {
              normal: {
                color: colorGV[colorName],
                lineStyle: that.lineStyle,
                borderColor: colorGV[colorName], //图形的描边颜色。支持的格式同 color
                borderWidth: 8, //描边线宽。为 0 时无描边。[ default: 0 ] 
                barBorderRadius: 0,
                label: {
                  show: false
                },
                opacity: 0.5
              }
            },
            data: data
          })
        }
      }
      var xAxisOption = {};
      var option = {
        title: that.commonOptionTitleCard,
        legend: that.commonOptionLegend,
        grid: that.commonOptionGrid,
        tooltip: that.commonOptionTooltipFalse,
        xAxis: [$.extend(xAxisOption, that.commonOptionXAxis[0], {
          data: that.xData
        })],
        yAxis: [{
          type: 'value',
          name: '速率(Mbps)',
          /*min:0,
          max:80,*/
          nameTextStyle: {
            color: '#ddd'
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#32346c'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#1c1c45' //'#32346c '
            }
          },
          axisLabel: {
            textStyle: {
              color: '#bac0c0',
              fontWeight: 'normal',
              fontSize: '12'
            },
            formatter: '{value}'
          }
        }, that.commonOptionYAxis2],
        series: series,
        animation: false
      };
      option.title[0].text = name;
      option.title[1].text = title1Text;
      option.title[2].text = operator;
      option.grid.top = 55;
      option.legend.show = false;
    
      option.xAxis[0]["axisLabel"]["textStyle"]["fontSize"] = 10;
      if(max <= 0.1){
        option.yAxis[0].min = 0;
        option.yAxis[0].max = 0.1;
      }
      option.yAxis[0]["axisLabel"]["textStyle"]["fontSize"] = 10;
      option.yAxis[1]["axisLabel"]["textStyle"]["fontSize"] = 10;

      option.legend.data = legendName;
      console.log(option)
      that.myChartCards[devSn][chartName].setOption(option, true);
      //that.lteChart.setOption(option, true);

    },
    getChartShowContent(cardData){
      var that = this;
      var devSn = JSON.parse(localStorage.curChart).split("/")[0] ;
      that.$axios({
        method: 'post',
        url:"/page/index/chartData.php",
        data:that.$qs.stringify({
          getChartShowContent:true,
          devSn: devSn,
          prefix: that.user.prefix
        }),
        Api:"getChartShowContent",
        AppId:"android",
        UserId:that.user.id
      })
      .then(function (response) {
        let res = response.data;
        if(res.res.success){
          //console.log("getChartShowContent")
          var data = res.data[0];
          //console.log(data);
          that.chartGeneralView["up"] = data["up"].split(",").map(function(x){return that.formatCardShow(x)});
          that.chartGeneralView["down"] = data["down"].split(",").map(function(x){return that.formatCardShow(x)});
          that.chartGeneralView["trans"] = data["lossDev"].split(",").map(function(x){return that.formatCardShow(x)});//传输丢包
          that.chartGeneralView["buss"] = data["lossRcv"].split(",").map(function(x){return that.formatCardShow(x)});//业务丢包
          //console.log(that.chartGeneralView)
          that.getCardChartShowContent(devSn,cardData)
        }else{
          console.log(res)
        }
      })
      .catch(function (res) {
        console.log(res)
      })
    },
    getCardChartShowContent(devSn,cardData){
      var that = this;
      var devSn = JSON.parse(localStorage.curChart).split("/")[0];
      that.$axios({
        method: 'post',
        url:"/page/index/chartData.php",
        data:that.$qs.stringify({
          getCardChartShowContent:true,
          devSn: devSn
        }),
        Api:"getCardChartShowContent",
        AppId:"android",
        UserId:that.user.id
      })
      .then(function (response) {
        let res = response.data;
        if(res.res.success){
          //console.log('getCardChartShowContent')
          var data = res.data[0];
          //console.log(data)
          for(var key in data){
            if(key == "dev_sn" || key=="id"){
              continue;
            }
            that.chartCardView[key] = data[key];
          }
          //console.log(that.chartCardView);
          that.initChartTotal(cardData);
          that.initChartCards(cardData);
        }else{
          console.log(res)
        }
      })
      .catch(function (res) {
        console.log(res)
      })
    },  
    judgeCardShow(showCard){
      var that = this;
      that.eth0Show = false;
      that.lte1Show = false;
      that.lte2Show = false;
      that.lte3Show = false;
      that.lte4Show = false;
      that.lte5Show = false;
      that.lte6Show = false;
      that.usblanShow = false;
      that.usblan2Show = false;
      that.usb5g1Show = false;
      that.usb5g2Show = false;
      that.wifiShow = false;
      for(var i=0; i<showCard.length; i++){
        switch(showCard[i]){
          case "eth0":
            that.eth0Show = true;
            break;
          case "lte1":
            that.lte1Show = true;
            break;
          case "lte2":
            that.lte2Show = true;
            break;
          case "lte3":
            that.lte3Show = true;
            break;
          case "lte4":
            that.lte4Show = true;
            break;
          case "lte5":
            that.lte5Show = true;
            break;
          case "lte6":
            that.lte6Show = true;
            break;
          case "usb-lan":
            that.usblanShow = true;
            break;
          case "usb-lan2":
            that.usblan2Show = true;
            break;
          case "usb-5g1":
            that.usb5g1Show = true;
            break;
          case "usb-5g2":
            that.usb5g2Show = true;
            break;
          case "wifi":
            that.wifiShow = true;
            break;
        }
        that.chartStyle = "card"+showCard.length+"Style";
      }
    },
    //深拷贝对象
    copy(obj) {
      var newobj = obj.constructor === Array ? [] : {};
      if (typeof obj !== 'object') {
        return;
      }
      for (var i in obj) {
        newobj[i] = typeof obj[i] === 'object' ? this.copy(obj[i]) : obj[i];
      }
      return newobj
    },
    //数组合并去重
    MergeArray(arr1, arr2) {
      var _arr = new Array();
      for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i]);
      }
      for (var i = 0; i < arr2.length; i++) {
        var flag = true;
        for (var j = 0; j < arr1.length; j++) {
          if (arr2[i] == arr1[j]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          _arr.push(arr2[i]);
        }
      }
      return _arr;
    },
    transOperator(operator){
      if (operator == "CMCC" || operator == "CHINA MOBILE CMCC" || operator == "CHINA MOBILE") {
        operator = "移动";
      } else if (operator == "CHN-CT"|| operator == "Mi Mobile") {
        operator = "电信";
      } else if (operator == "CHN-UNICOM") {
        operator = "联通";
      } else if (operator == "CHN-BN" || operator == "CBN") {
        operator = "广电";
      }
      return operator;
    },
    formatCardShow(card){
      if(card.indexOf("lte") != -1 || card.indexOf("NR5G-NSA)") != -1){
        return "SIM" + card.substr(card.length-1);
      }else{
        return card;
      }
    },
    //横轴
    formatXData(){
      for (var i = 0; i < xSplit; i++) {
        this.xData.push(i);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main{
    height: 92%;
    overflow-y: auto;
    background-color: #272D33;
  }
  .mint-header{
    background-color: #212227;
  }
  /*当前频点*/
  .channels{
    margin-top: 0px;
  }
  .activeChannel{
    overflow: hidden;
    height: .5rem;
    background-color: #212227;
    padding: .05rem 0;
  }
  .listChannel{
    border-bottom: 1px solid #474B50;
    overflow: hidden;
    height: .5rem;
    background-color: #212227;
    padding: .05rem 0;
  }
  .status,.rate,.info{
    float: left;
    height: 100%;
  }
  .status{
    width: 20%;
    line-height: .5rem;
    text-align: center;
  }
  .statusCircle{
    display: inline-block;
    width: .12rem;
    height: .12rem;
    border-radius: 50%;
  }
  .rate{
    box-sizing: border-box;
    width: 24%;
    padding-top: .08rem;
  }
  .us{
    display: block;
    color: #FEFD37;
    font-size: .15rem;
    text-align: left;
  }
  .ds{
    display: block;
    color: #2DABDB;
    font-size: .15rem;
    text-align: left;
  }
  .info{
    width: 40%;
    color: #FFFFFF;
    font-size: .15rem;
    box-sizing: border-box;
    padding-top: .02rem;
  }
  .T,.R,.B{
    display: block;
  }
  .B{
    margin-left: .08rem;
  }
  .TCircle,.RCircle,.BCircle{
    display: inline-block;
    width: .08rem;
    height: .08rem;
    border-radius: 50%;
  }
  .gray{background-color: #B7B7B7;}
  .green{background-color: #28FC2E;}
  .red{background-color: #FC0E1B;}
  /*右侧弹出窗口(频点列表)*/
  .mint-popup{
    background-color: #212227;
    width: 100%;
    height: 100%;
  }
  .channelList{
    height: 100%;
    overflow-y: auto;
  }
  /*图表*/
  .chartArea{
    overflow: hidden;
    margin-top: 60px;
    height: 91%;
  }
  .mainChart{
    float: left;
    width: 100%;
    height: 30%;
  }
  .height50{
    height:50%;
  }
  .height33{
    height:33%;
  }
  .height25{
    height:25%;
  }
  .cardsChart{
    float: left;
    width: 100%;
    /*height: 70%;*/
  }
  /*.cardsChart_1080 >>> .lteChart{
    float: left;
    width: 100%;
    height: 33%;
  }*/
  
  /*.lteChart{
    float: left;
    width: 50%;
    height: 23%;
  }*/
  .cardsChart >>> .chartTitle,
  .mainChart .chartTitle{
    border: 1px solid #272D33;
    text-align: left;
    text-indent: .1rem;
    padding: .1rem .08rem;
    background-color: #212227;
    border-radius: 5px;
    font-size: .16rem;
    color: #59B1A5;
    height: 8%;
  }
  .totalChart{
    width: 100%;
    height: 80%;
  }
  .chart{
    height: 78%;
    width:100%;
    /*height:100%;*/
  }
  .card1Style{
    width:100%;
    height:100%;
  }
  .card2Style{
    width:100%;
    height:50%;
  }
  .card3Style{
    width:100%;
    height:33%;
  }
  .card4Style{
    width:50%;
    height:50%;
  }
</style>
