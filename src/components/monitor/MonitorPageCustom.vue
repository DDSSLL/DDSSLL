<template>
  <div class="monitor">
    <el-row style="height:100%">
      <el-col :span="12" class="" style="height:100%;padding-right:20px;">
        <div class="contentDiv" style="height: calc(50% - 20px)" ><!-- id="contentDiv" -->
          <div id="rcvParamDiv" style="height:100%">
            <el-row style="width:100%; height:45%">
              <el-col :span="12" style="text-align:left;height:100%" >
                <el-card class="box-card dark_card" style="margin-top: 10px;width:97%;height:100%;display: flex;align-items: center;">
                  <span class="statisticsTitle" style="font-size: 48px;">LOGO</span>
                </el-card>
              </el-col>
              <el-col :span="12" style="height:100%" >
                <el-card class="box-card dark_card" style="margin-top: 10px;height:100%;display: flex;align-items: center;flex-direction: row; justify-content: center;">
                  <span class="statisticsTitle" style="font-size: 48px;">{{currentFreq+"MHz"}}</span>
                </el-card>
              </el-col>
            </el-row>
            <el-row style="height:46%;margin-top:15px;">
              <el-col :span="7" style="height:100%;">
                <el-card class="box-card dark_card" style="margin-top: 10px;width:100%;height:70%;display: flex;align-items: center;">
                  <span class="statisticsTitle" style="font-size: 48px;">{{countdown}}</span>
                </el-card>
                <div style="height:24%; margin-top:2%;">
                  <el-button type="primary" size="mini" style="width:45%;height:100%;" @click="stopMonitor">结束监测</el-button>
                  <el-button type="primary" size="mini" style="width:45%;height:100%;float:right;" @click="delayMonitor">延长监测</el-button>  
                </div>
              </el-col>
              <!-- <el-col :span="4" style="height: 100%;padding-left: 2%;margin-top: 10px;">
                <div style="width: 100%;height: 100%;" class="monitorBtn">
                  
                </div>
              </el-col> -->
              <el-col :span="10":offset="1">
                <div style="margin-top: 10px;">
                  放大器
                  <el-select class="input_dark" v-model="amplifier" @change="changeAMP" size="mini" style="width:80%">
                    <el-option
                      v-for="item in AMP_OPTION"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
                <div style="margin-top: 10px;width:100%">
                  衰减器
                  <el-input v-model="attenuator" autocomplete="off" size="mini" class="inputmstyle" @blur="changeATT"  :placeholder="range_ATT.min+'-'+range_ATT.max" style="width:80%">
                    <template slot="append">db</template>
                  </el-input>
                </div>
                <el-select class="input_dark" v-model="RefreshIntervalTime" style="width:90%;margin-top:10px;" @change="changeRefreshTime" size="small">
                  <el-option
                    v-for="item in REFRESH_TIME_OPTION"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="5":offset="1" style="height:100%">
                <div style="display: flex;font-size: 48px;flex-direction: column;height: 100%;justify-content: center;">
                  <i class="el-icon-video-play" @click="playAudio" v-if="show.play"></i>
                  <i class="el-icon-video-pause" @click="pauseAudio" v-if="show.pause"></i>  
                </div>
              </el-col>
            </el-row>
            <audio id="video-webrtc" controls autoplay style="width:100%;background-color:transparent;margin-top:10px;display:none" :muted="audio.muted"></audio>
          </div>
        </div>
        <div class="contentDiv" style="height: calc(50% - 20px)" >
          <!-- 音柱图 -->
           <el-row style="width:100%; height:100%">
            <el-col :span="1" style="height:100%">
              <canvas id="Volume" class="spectrum_canvas" style="width:100%;height:90%"></canvas>  
            </el-col>
            <el-col :span="23" style="height:100%">
              <!-- 电平图 -->
              <div class="text item chartStyle chart_1_1">
                <div style="width:100%;height:100%;outline:none" class="chartDiv">
                  <!-- <div id="chart_v" style="width: 100%; height: 90%"></div> -->
                  <canvas id="chart_v" class="spectrum_canvas" style="width:100%;height:90%"></canvas>  
                  <div class="chartInfo" id="chart_info_v" style="text-align: center;size:12px">
                    <span style="display:inline-block; padding:0 5px">
                      <span>频率:</span><span>{{chartInfo?chartInfo["freq"]:""}}</span>
                    </span>
                    <span style="display:inline-block; padding:0 5px">
                      <span>电平:</span><span :style="{color:color['电平']}">{{chartInfo?chartInfo["Level"]:""}}</span>
                    </span>
                    <span style="display:inline-block; padding:0 5px">
                      <span>调制度:</span><span :style="{color:color['调制度']}">{{chartInfo?chartInfo["Modulation"]:""}}</span>
                    </span>
                    <span style="display:inline-block; padding:0 5px">
                      <span>载噪比:</span><span :style="{color:color['载噪比']}">{{chartInfo?chartInfo["CNR"]:""}}</span>
                    </span>
                    <!-- <span style="display:inline-block; padding:0 5px">
                      <span>频偏:</span><span>{{chartInfo?chartInfo["Offset"]:""}}</span>
                    </span>
                    <span style="display:inline-block; padding:0 5px">
                      <span>带宽:</span><span>{{chartInfo?chartInfo["BW"]:""}}</span>
                    </span> -->
                  </div>
                </div>
              </div>
            </el-col>
           </el-row>
              
          
          
        </div>
      </el-col>
      <el-col :span="12" class="" style="height:100%">
        <div class="contentDiv" style="height:calc(100% - 20px)">
          <!-- <div id="freq1" style="width:100%;height:50%"></div> -->
          
          <canvas id="specCanvas" class="spectrum_canvas" style="width:100%;height:50%"></canvas>  
          <!-- <div id="freq2" style="width:100%;height:50%"></div> -->
          <canvas id="crvCanvas" class="spectrum_canvas" style="width:100%;height:50%"></canvas>  
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { mapState,mapMutations } from 'vuex';
  import { SET_LOGIN_STATUS} from '../../store/mutation-types';
  import * as echarts from 'echarts'
  import adapter from '../common/adapter-7.4.0.min.js';
  import {SrsRtcPlayerAsync} from '../common/srs.sdk.js';
  import {GdiFigPillar} from '../common/JsGdi2.js';
  import {VolumePillar, Spectrum, Crv,voltageLine,spectrogramLine } from '../common/spectrum.js';
  export default {
    name: "MonitorPageCustom",
    data(){
      return{
        rcv_board:"",
        rcvMode:'0',

        rcvSn:"",
        boardId:"",
        freq:"",
        range_ATT:{
          min:"", 
          max:"",
        },
        range_AMP:"",
        range_ChannelType:"",
        amplifier:"0",
        attenuator:"0",
        //RCV_OPTION:[],
        AMP_OPTION:[],
        freq1_count:0,
        freq2_count:0,
        freq2Rows:50,
        audio:{
          DeviceSN:"",
          BoardId:"",
          Freq:"",
          Switch:"",
          Record:"",
          PushUrl:"",
          PullUrl:"",
          srcObject:"",
          muted:false,
          ListenPullUrl:"",//"webrtc://192.168.100.150/live/livestream",
          rtcSdk:"",
          setRecord:"",
        },
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
        channelData:[],
        allData:[],
        channelAllData:[],//一次请求的所有电平图的数据
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
        myChartV : "",
        chartFreq1:"",
        reqTimes:0,
        total_AM:"",
        total_SW:"",
        total_FM:"",
        chartInfo:{
          "Freq":"",
          "freq":"",
          "Level":"",
          "Modulation":"",
          "Offset":"",
          "BW":"",
        },
        currentFreq:"",
        color:{'电平':'#2976FF','调制度':"#31FF24",'载噪比':'#EA39FF','yellow':'#ffff00','blue':'#2976FF'},
        commonOptionYAxis2 : {
          type: 'value',
          name: '调制度',
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
        voltageChartDatas:{},
        chartData_SW:{},
        chartData_AM:{},
        chartData_FM:{},
        show:{
          AMChart:true,
          SWChart:true,
          FMChart:true,
        },
        currentRow:"",
        selectedRowIndex:"",
        playFlag:null,
        opticalHandler:"",
        countdown:"00:00",
        OneAlarmTimeId:"",
        OneAlarmTimeDuration:"",
        duration:"",
        durationInterval:"",
        show:{
          play:true,
          pause:false,
        },
        //音柱图
        volumeHandler:"",
        dBMaxArr : [],
        fig_num : 1,
        requestTimes:0,
        firstDrawVoltage:true,
      }
    },
    computed: {
      ...mapState([])
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
    created(){
    },
    mounted(){
      var that = this;
      this.firstDrawVoltage = true;
      //http://localhost:8081/#/monitorPageCustom?rcvSn=5C77382999&boardId=0&freq=10500000
      console.log("this.$route.fullPath:"+this.$route.fullPath)
      var reqParam = this.$route.fullPath.split("?")[1].split("&");
      this.rcvSn = reqParam[0].split("=")[1];
      this.boardId = reqParam[1].split("=")[1];
      this.freq = reqParam[2].split("=")[1];
      //console.log(this.rcvSn+"/"+this.boardId+"/"+this.freq)
      setTimeout(function(){that.SET_LOGIN_STATUS(true);},0)
      this.GetParamValueRange(function(){
        that.initPageEle();
      })
      
      this.voltageChartDatas = localStorage.voltageChartDatas?JSON.parse(localStorage.voltageChartDatas):{};
      //this.initPageStyle();
      this.GetAudioMonitor(function(){
        that.getRcvAllData();
        if(that.audio.Switch == 1){//播放
          that.show.play = false;
          that.show.pause = true;
          that.webrtcPlay();
        }else{
          that.show.play = true;
          that.show.pause = false;
          that.webrtcClose();
        }
      });
      this.GetOneAlarmTime();
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活
    },
    methods:{
      ...mapMutations({
        SET_LOGIN_STATUS,
      }),
      //页面初始化--start
      initPageEle(){
        this.AMP_OPTION = this.range_AMP;
        this.FREQ_TYPE = this.range_ChannelType;
      },
      initPageStyle(){
        setTimeout(function(){
          var contentHeight = document.getElementById("contentDiv").offsetHeight;
          var rcvParamDivHeight = document.getElementById("rcvParamDiv").offsetHeight;
          var tableHeight = contentHeight-rcvParamDivHeight-50;
          document.getElementById("channelTable").style.height =  tableHeight+"px";
        },500)
      },
      //页面初始化--end

      //获取任务参数--start
      GetOneAlarmTime(){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",
          data:{ 
            GetOneAlarmTime: "1",
            DeviceSN:that.rcvSn,
            BoardId:that.boardId,
            Freq:that.freq
          },
          Api:"GetOneAlarmTime",
          AppId:"web",
          UserId:"ggd"
        })
        .then(function (response) {
          let res = response.data;
          var data = res.data[0];
          if(res.code == "0000"){
            that.OneAlarmTimeId = data["ID"];
            that.OneAlarmTimeDuration = data["Duration"];
            //that.OneAlarmTimeDuration = 10
            that.duration = that.OneAlarmTimeDuration;
            that.showDuration(that.duration);
            that.duration--;
            that.durationInterval = setInterval(function(){
              if(that.duration>=0){
                that.showDuration(that.duration);
                that.duration--;  
              }else{
                //clearInterval(that.durationInterval)
                that.stopMonitor()
              }
            },1000)
          }else{
          
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      showDuration(time){
        var mm=this.formatTime(parseInt(time/60%60));
        var ss=this.formatTime(parseInt(time%60));
        this.countdown = mm+":"+ss;
      },
      formatTime(tt){
        if(tt*1 < 10){
          return "0"+tt;
        }else{
          return tt;
        }
      },
      deleteTask(cb){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",
          data:{ 
            DelAlarmTimeFreq: "1",
            DelIDs:[that.OneAlarmTimeId],  
          },
          Api:"DelAlarmTimeFreq",
          AppId:"web",
          UserId:"ggd"
        })
        .then(function (response) {
          let res = response.data;
          var data = res.data[0];
          if(res.code == "0000"){
            if(typeof(cb) == 'function'){
              cb();
            }
          }else{
          
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      stopMonitor(){
        var that = this;
        this.deleteTask(function(){
          that.duration = 0;  
          clearInterval(this.durationInterval);
        })
      },
      delayMonitor(){
        var that = this;
        clearInterval(this.durationInterval);
        this.duration+=60;
        this.durationInterval = setInterval(function(){
          if(that.duration>=0){
            that.showDuration(that.duration);
            that.duration--;  
          }else{
            clearInterval(that.durationInterval)
          }
        },1000)
      },
      //获取任务参数--end

      // 获取放大器等参数
      GetParamValueRange(cb){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",
          data:{ GetParamValueRange: "1", },
          Api:"GetParamValueRange",
          AppId:"web",
          UserId:"ggd"
        })
        .then(function (response) {
          let res = response.data;
          /*console.log("res")
          console.log(res)*/
          var data = res.data[0];
          if(res.code == "0000"){
            that.range_ATT.min = data["ATT"]["max"];
            that.range_ATT.max = data["ATT"]["max"];
            that.range_AMP = data["AMP"];
            that.range_ChannelType = data["ChannelType"];
            if(typeof(cb) == 'function'){
              cb();
            }
          }else{
          
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      
      //各种图
      getRcvAllData(){
        //this.formatFreqCharts([]);//初始化频谱图
        this.initOptical("crvCanvas");//初始化热力图
        this.GetBoardParam();//左侧参数
        this.initVolume("Volume")//初始化音柱图
        this.getChannelData();//电平数据
        this.getRealtimeSpectData();//频谱图和热力图的数据
      },
      //获取放大器等参数
      GetBoardParam(){
        var that = this;
        var rcvSn = this.rcvSn;
        var boardId = this.boardId;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetRcvModeParam.json",
          data:this.$qs.stringify({
            GetBoardParam: 1,
            DeviceSN: rcvSn,   
            BoardId:boardId,
          }),
          Api:"GetBoardParam",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            that.amplifier = data[0]["RealAMP"]*1;
            that.attenuator = data[0]["RealATT"]+"";
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
        this.setRcvParams(paramName, paramValue)
      },
      setRcvParams(paramName,paramValue,callback){
        var that = this;
        var rcn_sn = this.rcv_board.split("_")[0];
        var board_id = this.rcv_board.split("_")[1];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/SetBoardParams.json",
          data:this.$qs.stringify({
            SetBoardParams: 1,
            DeviceSN: rcn_sn ,
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
          //console.log("aaaa")
          var path = that.$route.fullPath
          //console.log(path)
          //console.log(path.indexOf("/monitorPageCustom"))
          if(that.$route.fullPath.indexOf("/monitorPageCustom") != -1){
            that.GetChannelInfo();  
          }
        },200)/*that.RefreshIntervalTime*1000*/
        that.GetChannelInfo();
      },
      GetChannelInfo(){
        var that = this;
        var ChannelType = "";
        var rcvSn = this.rcvSn;
        var boardId = this.boardId;
        var freq = this.freq;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetChannelInfo.json",
          data:this.$qs.stringify({
            GetChannelInfo: "1",
            DeviceSN:rcvSn,           //10位序列号
            BoardId:boardId,
            ChannelType:ChannelType,        //0中波,1短波,2调频，不填代表所有类型
            Freq:freq,                //频率,不填代表所有频率
            GetPoints:"1",  
          }),
          Api:"GetChannelInfo",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            if(data){
              console.log("GetChannelInfo")
              console.log(data)
              that.currentFreq = (data[0]["Freq"]/1000000).toFixed(3);
              if(that.requestTimes>=5*that.RefreshIntervalTime || that.firstDrawVoltage){
                that.formatCharts(data); 
                that.requestTimes = 0;
                that.firstDrawVoltage = false;
              }else{
                that.requestTimes++;
              }
              that.drawDemodDB(data[0]["Volume"]);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      getRealtimeSpectData(){
        var that = this;
        clearInterval(this.spectInterval);//清除定时刷新 
        this.spectInterval = setInterval(function(){
          if(that.$route.fullPath.indexOf("/monitorPageCustom") != -1){
            that.intervalRealTime = that.GetChannelNBSpect();
          }else{
            clearInterval(that.intervalRealTime)
          }
        },100)
        that.GetChannelNBSpect();
      },
      changeFreqType(){
        //console.log("changeFreqType")
        //console.log("this.freq_type:"+this.freq_type)
        if(this.freq_type === ""){
          this.show.AMChart = true;
          this.show.SWChart = true;
          this.show.FMChart = true;  
        }else{
          this.show.AMChart = false;
          this.show.SWChart = false;
          this.show.FMChart = false;  
          this.myChartArr = new Object();
          this.show[this.FREQ_TYPE_MAP[this.freq_type]+"Chart"] = true;
        }
        for(var i=0; i<this.total; i++){
          if(document.getElementsByClassName("chartDiv")[i]){
            document.getElementsByClassName("chartDiv")[i].classList.remove('activeChart')  
          }
        }
        
        /*var ChannelType = this.freq_type.map(item => {
          return this.FREQ_TYPE_MAP[item];
        }).join(",");*/
      },
      
      formatCharts(data){
        var that = this;
        this.total = data.length;
        if(data.length == 0){
          return;
        }
        this.$nextTick(function(){
          this.formatChartsV(data);
        })
      },
      formatChartsV(data){
        var that = this;
        that.initChartChannelChart(data[0]);
        that.initChartChannelInfo(data[0]);
      },
      initChartData(){
        if(JSON.stringify(this.voltageChartDatas) == '{}' ){
          this.voltageChartDatas["Level"] = (new Array(this.levelChartXAxis)).fill(0);
          this.voltageChartDatas["Modulation"] = (new Array(this.levelChartXAxis)).fill(0);
          this.voltageChartDatas["CNR"] = (new Array(this.levelChartXAxis)).fill(0);
        }
      },
      initChartChannelChart(data){
        var that = this;
        var chartId = "chart_v";
        this.initChartData();
        if (!this.myChartV) {
          this.myChartV = echarts.init(document.getElementById(chartId), null, {renderer:'svg'});
        }
        this.myChartV.resize();
        var option = {};
        var legendName = ['电平','调制度','载噪比'];
        var series = [];
        var rcvSn = this.rcv_board;
        this.voltageChartDatas["Level"].unshift(data.Level);
        this.voltageChartDatas["Level"].pop();
        var LevelData = this.voltageChartDatas["Level"]
        this.voltageChartDatas["Modulation"].unshift(data.Modulation);
        this.voltageChartDatas["Modulation"].pop();
        var ModulationData = this.voltageChartDatas["Modulation"]
        this.voltageChartDatas["CNR"].unshift(data.CNR);
        this.voltageChartDatas["CNR"].pop();
        var CNRData = this.voltageChartDatas["CNR"]
        localStorage.setItem("voltageChartDatas",JSON.stringify(this.voltageChartDatas));

        this.initVoltage(chartId);
        this.drawVoltage(LevelData,ModulationData,CNRData);
      },
            //电平图初始化
      initVoltage(chartId) {
        var Handler = new voltageLine(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //边距
        Handler.setMargin(45,10,45,5);
        //画背景和坐标轴
        Handler.drawFrame();
        //XY轴标注
        Handler.setXYAxis(1, 1, -120, 0);
        //右侧XY轴标注
        Handler.setLostXYAxis(1, 1, 0, 100);
        //音量图
        Handler.drawSpeedFig();
        GDI.draw();
        this.specHandler = Handler;
      },
      //画背包网速图
      drawVoltage(data1,data2,data3){
        this.specHandler.updateSpeedFig(data1,data2,data3);
      },

      initChartChannelInfo(data){
        var datas = {
          "Freq":data["Freq"],
          "freq":(data["Freq"]/1000000).toFixed(3),
          "Level":data["Level"],
          "Modulation":data["Modulation"],
          "CNR":data["CNR"],
          "Offset":data["Offset"],
          "BW":data["BW"],
        }
        this.chartInfo = datas;
      },
      GetChannelNBSpect(){
        var that = this;
        var devSn = this.rcvSn;
        var boardId = this.boardId;
        var Freq = this.freq;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetChannelNBSpect.json",
          data:this.$qs.stringify({
            GetChannelNBSpect: "1",
            DeviceSN:devSn,          
            BoardId:boardId,         
            Freq:Freq,
          }),
          Api:"GetChannelNBSpect",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            /*that.allData = data;
            that.xAxisNum = data["Points"];
            that.xAxisData = [];
            for(var i=0; i<that.xAxisNum; i++){
              that.xAxisData.push(i);
            }
            if(++that.freq1_count == 3){
              that.formatFreqCharts(data);
              that.freq1_count = 0;
            }*/
            that.allData = data;
            that.xAxisMin = (Freq-6000)/1000000;
            that.xAxisMax = (Freq*1+6000)/1000000;
            that.xAxisNum = data["Points"];
            that.xAxisData = [];

            that.initSpectrogram("specCanvas");
            that.spectHandler.updateSpectFig(data["Spect"]);//频谱图
            that.opticalHandler.drawCrv(data["Spect"]);
            /*that.totalData.push(data["Spect"]);
            if(that.totalData.length >= that.freq2Rows){
              that.totalData.shift();
            }
            if(++that.freq2_count == 10){
              that.formatFreqHeatMap();
              that.freq2_count = 0;
            }*/
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //频谱图初始化
      initSpectrogram(chartId) {
        var that = this;
        var Handler = new spectrogramLine(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        /*//光标名
        Handler.setMkrName(0,'A');
        Handler.setMkrName(1,'B');
        Handler.setMkrEnable([true,false,false,false,false,false]);*/
        //边距
        Handler.setMargin(50,10,20,40);
        //画背景和坐标轴
        Handler.drawFrame();
        //XY轴标注
        //console.log("xAxisMax:"+this.xAxisMax)
        Handler.setXYAxis(this.xAxisMin,this.xAxisMax, -120, 20, true, true);
        //音量图
        Handler.drawSpectFig();
        /*GDI.removeAllFigure();
        GDI.removeAllText();*/
        GDI.draw();
        /*游标移动的处理*/
        var active_mark = undefined;
        // 消息处理
        Canvas.onmousedown = function (e) {
          //鼠标点击函数--e:事件；obj:点击的对象
          mouseDownFn(e);
        };
        Canvas.onmousemove = function (e) {
          mouseMoveFn(e);
        };
        Canvas.onmouseup = function (e) {
          mouseUpFn(e);
        };

        this.spectHandler = Handler;

        function mouseDownFn(e){
          var obj = e.currentTarget;//当前点击的画布
          $(obj).focus();
          var jsgdi, mkr;
          jsgdi = that.spectHandler.getJsGdi();
          mkr = jsgdi.getMarkerManager();
          if (e.button === 0) {
            // 左键按下
            var point;
            if (e.offsetX !== undefined && e.offsetY !== undefined) {
              point = new GdiPoint(e.offsetX, e.offsetY);
            } else {
              point = new GdiPoint(
                e.pageX - this.offsetLeft,
                e.pageY - this.offsetTop
              );
            }
            active_mark = mkr.setActiveMkrByPoint([MARK1,MARK2,MARK3], point);
            if(active_mark) {
              mkr.moveActiveMkrByPoint(active_mark["mkrGrp"], point);
              //updateScansMaker(point,active_mark["mkrGrp"]);
              jsgdi.draw();
              //specHandler.redraw();
            }
          }
          return true;
        }
        function mouseMoveFn(e){
          if (active_mark) {
            var jsgdi, mkr,gdiFrm,frmRect;
            jsgdi = this.spectHandler.getJsGdi();
            mkr = jsgdi.getMarkerManager();
            gdiFrm = jsgdi.getFrame();
            frmRect = gdiFrm.getBorderRect();
            var group = active_mark["mkrGrp"];
            var index = active_mark["index"];
            var point;
            if (e.offsetX !== undefined && e.offsetY !== undefined) {
              point = new GdiPoint(e.offsetX, e.offsetY);
            } else {
              point = new GdiPoint(
                e.pageX - this.offsetLeft,
                e.pageY - this.offsetTop
              );
            }
            mkr.moveActiveMkrByPoint(group, point);
            var marker = mkr.getMarkerAt(group, 0);
            marker.setTextPos(point.x + 100 > frmRect.right ? gdiTextPos.OUTER_LEFTTOP : gdiTextPos.OUTER_RIGHTTOP);
            //updateScansMaker(point,active_mark["mkrGrp"]);
            jsgdi.draw();
            //specHandler.redraw();
          }
          return true;
        }
        function mouseUpFn(e){
          if (active_mark) {
            var jsgdi, mkr;
            jsgdi = this.spectHandler.getJsGdi();
            mkr = jsgdi.getMarkerManager();
            mkr.setInactMkrByIndex(active_mark["mkrGrp"], active_mark["index"]);
            active_mark = null;
          }
        }
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
        /*var min = data["SpectStart"];
        var max = data["SpectEnd"]*/
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
              color: this.color['blue'],
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
        yAxisOption1.axisLine.lineStyle.color = '#C1C1C1'

        var xAxisOption = that.$common.copy(that.commonOptionXAxis[0]);
        xAxisOption["axisLabel"].show = true;
        xAxisOption["axisLabel"].type = 'category';
        xAxisOption["axisLabel"].interval = points-2;
        xAxisOption.axisLine.lineStyle.color = '#C1C1C1';
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
          xAxis: /*{
            type: 'category',
            axisLine: {lineStyle: {color: '#C1C1C1'}},
            axisTick: {show: false},
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            splitArea: {show: false},
          },//*/xAxisOption,
          yAxis: yAxisOption1,
          series: series,
          animation: false
        };
        this.chartFreq1.setOption(option, true);
      },
      //光谱图初始化
      initOptical(chartId) {
        var Handler  = new Crv(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //边距
        Handler.setMargin(50,10,20,40);
        //XY坐标轴
        Handler.drawXYAxis(87, 108, -100, -20, true);
        GDI.removeAllFigure();
        GDI.removeAllText();
        GDI.draw();
        this.opticalHandler = Handler;
      },
      formatFreqHeatMap(){
        var that = this;
        if (!this.chartFreq2) {
          this.chartFreq2 = echarts.init(document.getElementById("freq2"));
        }
        //this.myChartArr[chartId].resize();
        var option = {};
        //var legendName = ['电平'];
        var yData = [];
        for (let y = 0; y < this.freq2Rows; y++) {
          yData.push(y);
        }
        var yAxisOption1 = that.$common.copy(that.commonOptionYAxis1);
        yAxisOption1.axisLabel.show = false;
        yAxisOption1.type = 'category';
        yAxisOption1.data =  yData;
        yAxisOption1.axisLine.lineStyle.color = '#C1C1C1'
        yAxisOption1.axisTick.show = false;
        yAxisOption1.axisLabel.show = true;
        yAxisOption1.name = "";
        var xAxisOption = that.$common.copy(that.commonOptionXAxis[0]);
        xAxisOption["axisLabel"].show = true;
        xAxisOption["axisLabel"].type = 'category';
        //xAxisOption.axisLine.show = true;
        var xx = [];
        for(var m=0; m<500; m++){
          xx.push(m)
        }
        xAxisOption["data"] = that.xAxisData;
        var grid = that.commonOptionGrid;
        grid.left = 40;
        grid.right = 40;

        var series = [];
        var xData = that.xAxisData;//xx;//
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
          grid: grid,
          xAxis: {
            type: 'category',
            axisLine: {lineStyle: {color: '#C1C1C1'}},
            axisTick: {show: false},
            axisLabel: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            splitArea: {show: false},
            data: xData
          },
          yAxis: yAxisOption1,
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
      GetAudioMonitor(cb){
        var that = this;
        var DeviceSN = this.rcvSn;
        var BoardId = this.boardId;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetChannelInfo.json",
          data:this.$qs.stringify({
            GetAudioMonitor: 1,
            DeviceSN:DeviceSN,           //10位序列号
            BoardId:BoardId,           //板卡号
          }),
          Api:"GetAudioMonitor",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            that.audio.DeviceSN = res.data[0]["DeviceSN"];
            that.audio.BoardId = res.data[0]["BoardId"];
            that.audio.Freq = res.data[0]["Freq"];
            that.audio.freq = (res.data[0]["Freq"]/1000000).toFixed(3);
            that.audio.Switch = res.data[0]["Switch"];
            that.audio.Record = res.data[0]["Record"];
            that.audio.PushUrl = res.data[0]["PushUrl"];
            that.audio.PullUrl = res.data[0]["PullUrl"];
            that.currentFreq = that.audio.freq;
            if(typeof(cb) == 'function'){
              cb();
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      SetAudioMonitor(Switch, cb){
        var that = this;
        var DeviceSN = this.rcvSn;
        var BoardId = this.boardId;
        var freq = this.freq;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetChannelInfo.json",
          data:this.$qs.stringify({
            SetAudioMonitor: "1",
            DeviceSN:DeviceSN,          //10位序列号
            BoardId:BoardId,          //板卡号
            Freq:freq,               //频率,Hz
            Switch:Switch,           //开关,0:停止 1:开启
            Record:that.audio.Record,           //是否录音,0:不录制 1:录制
          }),
          Api:"SetAudioMonitor",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            that.PullUrl = res.data[0]["PullUrl"];
            that.webrtcClose();
            that.webrtcPlay();
            if(typeof(cb) == 'function'){
              cb(res);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //监控视频sdk播放
      webrtcPlay(){
        var webrtcUrl = this.audio.PullUrl;
        //var webrtcUrl = "webrtc://111.160.79.93/live/mengbin?eip=111.160.79.93";//视频流
        //var webrtcUrl = "webrtc://111.160.79.93/live/mengbin2?eip=111.160.79.93";//音频流
        var rtcSdk = this.audio.rtcSdk;
        this.audio.muted = false;
        if (rtcSdk) {
          rtcSdk.close();
        }
        rtcSdk = new SrsRtcPlayerAsync();
        //this.audio.srcObject = rtcSdk.stream;
        $('#video-webrtc').prop('srcObject', rtcSdk.stream);
        rtcSdk.play(webrtcUrl).catch(function (reason) {
          rtcSdk.close();
        });
      },
      //监控视频sdk播放
      webrtcClose(){
        if (this.audio.rtcSdk) {
          this.audio.rtcSdk.close();
        }
      },
      //点击播放
      playAudio(){
        var that = this;
        console.log("playAudio")
        var switchFlg = "1";
        this.SetAudioMonitor(switchFlg, function(res){
          that.PullUrl = res.data[0]["PullUrl"];
          that.webrtcClose();
          that.webrtcPlay();
          that.show.play = false;
          that.show.pause = true;
        })
      },
      pauseAudio(){
        var that = this;
        console.log("pauseAudio")
        var switchFlg = "0";
        this.SetAudioMonitor(switchFlg, function(res){
          that.PullUrl = res.data[0]["PullUrl"];
          that.webrtcClose();
          that.show.play = true;
          that.show.pause = false;
        })
      },
      changeRecordStatus(){
        if(this.audio.Record == "1"){
          this.audio.Record = "0"
        }else{
          this.audio.Record = "1"
        }
      },
      getIcon(index){
        if(index == this.playFlag){
          //return 'fa-pause'  
          return false;
        }else{
          //return 'fa-volume-control-phone';  
          return true;
        }
      },
      //音柱图初始化
      initVolume(id) {
        var Handler = new VolumePillar(id);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        GDI.removeAllFigure();
        GDI.removeAllPattern();
        GDI.removeAllText();
        //边距
        Handler.setMargin(10,10,10,0);
        //画背景和坐标轴
        Handler.drawFrame();
        //设置数量
        Handler.initFigs(this.fig_num);
        //音量图
        Handler.drawVolumeFigs();
        for(var i=0; i<this.fig_num; i++){
            this.dBMaxArr[i] = -9999;
        }

        GDI.draw();
        this.volumeHandler = Handler;
      },
      //画音量图
      drawDemodDB(dataArr){
        console.log("drawDemodDB")
        console.log(dataArr)
        var curArr = [],freqArr = [];
        for(var i=0; i<dataArr.length; i++){
          var dataJson = dataArr[i];
          if(dataJson.dB != 0){
              //dataJson.dB = dataJson.dB + Math.random()*5;
          }
          //dataJson.dB = parseFloat(dataJson.dB.toFixed(1));
          if(this.dBMaxArr[i] < dataJson.dB){
              this.dBMaxArr[i] = dataJson.dB;
          }
          curArr[i] = dataJson.dB;
          freqArr[i] = dataJson.dB;
          //freqArr[i] = dataJson.freqHz / freqRadio;
          freqArr[i] = freqArr[i].toFixed(1);
        }
        this.volumeHandler.updateVolumeFig([''/*,'1','2','2'*/],curArr,this.dBMaxArr);
        for(i=0; i<dataArr.length; i++){
          this.dBMaxArr[i]--;
        }
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
.el-divider--horizontal{
  margin:5px 0;
}
.monitorTable .el-table__header, .monitorTable .el-table__body{
  width:auto !important;
}
audio::-webkit-media-controls-panel{
  background-color:#F5F5F5;
}
.el-select-dropdown__item{
  font-size:12px;
} 
.monitorTable .el-table tr{
  background: #F5F5F5;
}
.monitorTable .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
  background:#B7EAFF;
}
.monitorTable .el-table__body tr.current-row>td.el-table__cell{
  background:#B7EAFF; 
}

.box-card{
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
}
</style>
<style scoped>
 
</style>