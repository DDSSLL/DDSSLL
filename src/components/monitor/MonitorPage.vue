<template>
  <div class="monitor">
    <el-row style="height:100%">
      <el-col :span="6" class="leftDiv">
        <div class="contentDiv" style="height: calc(100% - 10px);" id="contentDiv">
          <div id="rcvParamDiv">
            <el-select class="input_dark" v-model="rcv_board" style="width:50%;" @change="changeRcv" size="small">
              <el-option
                v-for="item in RCV_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select class="input_dark" v-model="RefreshIntervalTime" style="width:50%;" @change="changeRefreshTime" size="small">
              <el-option
                v-for="item in REFRESH_TIME_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-row>
              <el-col :span="12">
                <div style="display: flex;flex-direction: row;align-items: center;">
                  <div style="text-align: left;width:70%"  class="input_dark" >
                    <div style="margin-top: 10px;display: inline-block;">
                      放大器
                      <el-select class="input_dark" v-model="amplifier" @change="" size="mini" style="width:60%">
                        <el-option
                          v-for="item in AMP_OPTION"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div style="margin-top: 10px;display: inline-block;float:right;">
                      衰减器
                      <el-input v-model="attenuator" autocomplete="off" size="mini" class="inputmstyle" @blur=""  :placeholder="range_ATT.min+'-'+range_ATT.max" style="width:60%">
                        <template slot="append">dB</template>
                      </el-input>
                    </div>
                  </div>
                  <div style="width:30%;padding:0 5px;margin-top:10px;">
                    <el-button type="primary" size="mini" style="height:63px;" @click="setParam">确定</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <el-card class="box-card dark_card" style="margin-top: 10px;height:63px;display: flex;align-items: center;">
                  <span class="statisticsTitle" style="font-size: 24px;">{{currentFreq+"MHz"}}</span>
                </el-card>
              </el-col>
            </el-row>
            <audio id="video-webrtc" controls autoplay style="width:100%;background-color:transparent;margin-top:10px;display:none" :muted="audio.muted"></audio>
            <!-- <video id="video-webrtc" autoplay style="width: 100%;height:300px; background-color: #000;" :muted="audio.muted"></video> -->
            <div style="width:100%; text-align:left;">
              <div style="float:left;overflow:hidden;display:none" class="input_dark">
                <el-select v-model="freq_type" size="mini" clearable @change="changeFreqType">
                  <el-option
                    v-for="freq in FREQ_TYPE"
                    :key="freq.value"
                    :label="freq.text"
                    :value="freq.value">
                  </el-option>
                </el-select>

                <!-- <el-radio-group v-model="freq_type" size="small" @change="changeFreqType">
                  <el-radio-button v-for="freq in FREQ_TYPE" :label="freq.value" :key="freq.value">{{freq.text}}</el-radio-button>
                </el-radio-group> -->
              </div>  
              <!-- <div style="float:right">
                <i class="el-icon-microphone" title="开启录音" style="color:#409EFF; font-size:24px" @click="changeRecordStatus" v-if="audio.Record==1"></i>  
                <i class="el-icon-turn-off-microphone" title='关闭录音' style="color:#409EFF; font-size:24px" @click="changeRecordStatus" v-else></i>  
              </div> -->
            </div>
          </div>
          <div style="margin-top: 10px;" class="monitorTable">
            <template >
              <el-table ref="channelTable" :data="channelData" height="250" border style="width: 100%;font-size:12px;" id="channelTable" highlight-current-row  @current-change="handleCurrentChange" :row-class-name="tableRowClassName">
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="freq" label="频率(MHz)" width="100px"></el-table-column>
                <el-table-column prop="Level" label="电平(dBm)" width="100px"></el-table-column>
                <el-table-column prop="Modulation" label="调制度(%)" width="100px"></el-table-column>
                <el-table-column label="监听">
                  <template slot-scope="scope">
                   
                    <el-button @click.native.prevent="startPlay(scope.$index, channelData)" type="text" size="mini" v-if="getIcon(scope.$index, scope.row)">
                      <i class="el-icon-headset"></i>
                    </el-button>
                    <el-button @click.native.prevent.stop="stopPlay(scope.$index, channelData)" type="text" size="mini" v-if="!getIcon(scope.$index, scope.row)">
                      <i class="fa fa-pause"></i>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </el-col>
      <el-col :span="18" class="rightDiv">
        <div class="contentDiv" style="height: calc(100% - 10px);margin-left: 10px;text-align: left;overflow-y: hidden;">
          <div style="height:64%; overflow-y:auto">
            <!-- 中播 -->
            <div v-for="o in total_AM" :key="'AM_'+o" class="text item chartStyle" :class="chartClass" v-if="show.AMChart">
              <div style="width:100%;height:100%;" class="chartDiv" :class="'chartDiv_'+o" ><!-- @click="changeActiveChart" -->
                <div v-bind:id="'chart_AM_' + o" style="width: 100%; height: 80%"></div>
                <div class="chartInfo" v-bind:id="'chart_info_AM_' + o" style="text-align: center;size:12px">
                  <span style="display:inline-block; padding:0 5px">
                    <span>频率:</span><span>{{chartInfo_AM[o-1]?chartInfo_AM[o-1]["freq"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>电平:</span><span>{{chartInfo_AM[o-1]?chartInfo_AM[o-1]["Level"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>调制度:</span><span>{{chartInfo_AM[o-1]?chartInfo_AM[o-1]["Modulation"]:""}}</span>
                  </span>
                  <br/>
                  <span style="display:inline-block; padding:0 5px">
                    <span>频偏:</span><span>{{chartInfo_AM[o-1]?chartInfo_AM[o-1]["Offset"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>带宽:</span><span>{{chartInfo_AM[o-1]?chartInfo_AM[o-1]["BW"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>载噪比:</span><span>{{chartInfo_AM[o-1]?chartInfo_AM[o-1]["CNR"]:""}}</span>
                  </span>
                </div>
              </div>
            </div>
            <!-- 短波 -->
            <div v-for="p in total_SW" :key="'SW_'+p" class="text item chartStyle" :class="chartClass" v-if="show.SWChart" style="position: relative;">
              <div style="width:100%;height:100%;" class="chartDiv" :class="'chartDiv_'+(total_AM+p)"><!-- @click="changeActiveChart" -->
                <!-- <div v-bind:id="'chart_SW_' + p" style="width: 100%; height: 80%"></div> -->
                <canvas v-bind:id="'Volume_SW_' + p" class="spectrum_canvas" style="width:5%;height:75%;margin-left:2%"></canvas>  
                <div style="width:90%;height:100%;display:inline-block">
                  <div style="width:100%;height:75%;display:inline-block" v-show="show['sw'][p]">
                    <canvas v-bind:id="'chart_SW_' + p" class="spectrum_canvas" style="width: 100%; height: 100%"></canvas> 
                  </div>
                  <div style="width:100%;height:75%;display:inline-block; position:relative" v-show="!show['sw'][p]">
                    <canvas v-bind:id="'crv_SW_' + p" class="spectrum_canvas" style="height:100%; width:100%"></canvas>
                    <canvas v-bind:id="'spect_SW_' + p" class="spectrum_canvas" style="width: 100%; height: 100%;position:absolute;left:0px; top:0px"></canvas>
                  </div>
                  <div class="chartInfo" v-bind:id="'chart_info_SW_' + p" style="text-align: center;size:12px">
                    <span style="display:inline-block; padding:0 5px">
                      <span>频率:</span><span>{{chartInfo_SW[p-1]?chartInfo_SW[p-1]["freq"]:""}}</span>
                    </span>
                    <span style="display:inline-block; padding:0 5px">
                      <span>电平:</span><span :style="{color:color['电平']}">{{chartInfo_SW[p-1]?chartInfo_SW[p-1]["Level"]:""}}</span>
                    </span>
                    <br/>
                    <span style="display:inline-block; padding:0 5px">
                      <span>调制度:</span><span :style="{color:color['调制度']}">{{chartInfo_SW[p-1]?chartInfo_SW[p-1]["Modulation"]:""}}</span>
                    </span>
                    <span style="display:inline-block; padding:0 5px">
                      <span>载噪比:</span><span :style="{color:color['载噪比']}">{{chartInfo_SW[p-1]?chartInfo_SW[p-1]["CNR"]:""}}</span>
                    </span>
                  </div> 
                </div>
              </div>
              <div style="position: absolute;bottom: 5px;right: 5px;"  @click="changeChart('sw',p)">
                <i class="el-icon-sort" style="float:right;transform:rotate(90deg);margin-right:5px"></i>
              </div>
            </div>
            <!-- 调频 -->
            <div v-for="q in total_FM" :key="'FM_'+q" class="text item chartStyle" :class="chartClass" v-if="show.FMChart">
              <div style="width:100%;height:100%;" class="chartDiv" :class="'chartDiv_'+(total_AM+total_SW+q)"><!--  @click="changeActiveChart" -->
                <div v-bind:id="'chart_FM_' + q" style="width: 100%; height: 80%"></div>
                <div class="chartInfo" v-bind:id="'chart_info_FM_' + q" style="text-align: center;size:12px">
                  <span style="display:inline-block; padding:0 5px">
                    <span>频率:</span><span>{{chartInfo_FM[q-1]?chartInfo_FM[q-1]["freq"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>电平:</span><span>{{chartInfo_FM[q-1]?chartInfo_FM[q-1]["Level"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>调制度:</span><span>{{chartInfo_FM[q-1]?chartInfo_FM[q-1]["Modulation"]:""}}</span>
                  </span>
                  <br/>
                  <span style="display:inline-block; padding:0 5px">
                    <span>频偏:</span><span>{{chartInfo_FM[q-1]?chartInfo_FM[q-1]["Offset"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>带宽:</span><span>{{chartInfo_FM[q-1]?chartInfo_FM[q-1]["BW"]:""}}</span>
                  </span>
                  <span style="display:inline-block; padding:0 5px">
                    <span>载噪比:</span><span>{{chartInfo_FM[q-1]?chartInfo_FM[q-1]["CNR"]:""}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <el-divider style="height:2%"></el-divider>
          <el-row style="height:34%;">
            <div class="" style="height: 100%;width:100%">
              <canvas id="specCanvas" class="spectrum_canvas" style="width:50%;height:100%;"></canvas>
              <canvas id="crvCanvas" class="spectrum_canvas" style="width:50%;height:100%"></canvas>  
            </div>
            <div style="position: absolute;bottom: 5px;right: 5px;"  @click="changeChartWidth">
              <i class="el-icon-sort" style="float:right;transform:rotate(90deg);margin-right:5px"></i>
            </div>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { mapState,mapMutations } from 'vuex';
  //import * as echarts from 'echarts'
  import adapter from '../common/adapter-7.4.0.min.js';
  import {SrsRtcPlayerAsync} from '../common/srs.sdk.js';
  import {GdiFigPillar} from '../common/JsGdi2.js';
  import {VolumePillar,spectrogramLine, Crv,voltageLine,GdiPoint,MARK1,MARK2,MARK3} from '../common/spectrum.js';
  export default {
    name: "MonitorPage",
    data(){
      return{
        chartData:"",
        chartSettings:{},
        rcv_board:"",
        rcvMode:'0',
        amplifier:"0",
        attenuator:"0",
        RCV_OPTION:[],
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
        FREQ_TYPE:[],//["中波","短波","调频"],
        FREQ_TYPE_MAP:{"0":"AM","短波":"SW","调频":"FM"},
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
        //intervalRealTime:"",
        RefreshIntervalTime:1,//刷新间隔
        RefreshInterval:1,
        spectInterval:"",//频谱刷新
        interval2:"",
        myChartArr : {},
        chartFreq1:"",
        reqTimes:0,
        total_AM:"",
        total_SW:"",
        total_FM:"",
        chartInfo_SW : [],/*短波*/
        chartInfo_AM : [],/*中播*/
        chartInfo_FM : [],/*调频*/
        currentFreq:"",
        color:{'电平':'#2976FF','调制度':"#31FF24",'yellow':'#ffff00','blue':'#2976FF','载噪比':'#EA39FF'},
        
        
        levelChartXAxis:30,
        levelChartDatas:{},
        chartData_SW:{},
        chartData_AM:{},
        chartData_FM:{},
        show:{
          AMChart:true,
          SWChart:true,
          FMChart:true,
          sw:{},
        },
        currentRow:"",
        selectedRowIndex:"",
        playFlag:null,
        freqDataTemp:[],
        lastTime:"",
        lastDraw:"",
        FREQ_REQUEST_INTERVAL:300,
        HEATMAP_DRAW_INTERVAL:3,
        specHandler:"",
        opticalHandler:"",
        spectHandler:"",
        volumeHandler:"",
        dBMaxArr : [],
        fig_num : 1,
        spectNBHandler:"",
        opticalNBHandler:"",
        handler:{},
        fullLen:false,
        crvParam: {
          "margin":{
            "left":50,
            "top":10,
            "right":20,
            "bottom":40,
          },
          "x":{
            "min":87,
            "max":108,
          },
          "y":{
            "min":-100,
            "max":-20,
          },
        },
      }
    },
    computed: {
      ...mapState(['range_ATT','range_AMP','range_ChannelType'])
    },
    components: {
      
    },
    mounted(){
      var that = this;
      this.initPageEle();
      this.levelChartDatas = localStorage.levelChartDatas?JSON.parse(localStorage.levelChartDatas):{};
      this.initPageStyle();
      this.$common.GetRcvBoardList(function(data){
        that.initRcvSelect(data);
        that.rcv_board = data[0]["RcvBoard"];
        that.GetAudioMonitor(function(){
          if(that.audio.DeviceSN != "" && that.audio.BoardId != ""){
            that.rcv_board = that.audio.DeviceSN+"_"+that.audio.BoardId;
          }
          that.getRcvAllData();
          that.initVideo();
        });
        
      })
    },
    activated(){  //生命周期-缓存页面激活
      console.log("activated")
      //this.levelChartDatas = localStorage.levelChartDatas?JSON.parse(localStorage.levelChartDatas):{};
    },
    destroyed(){   //生命周期-缓存页面失活
      this.stopPlay();
    },
    methods:{
      ...mapMutations({
        
      }),
      setParam(){
        var paramName = ['RealAMP','RealATT'];
        var paramValue = [this.amplifier, this.attenuator];
        var that = this;
        this.setRcvParams(paramName, paramValue)
      },
      changeChartWidth(){
        this.fullLen = !this.fullLen;
        if(this.fullLen){
          $("#specCanvas").width("100%");
          $("#crvCanvas").width("100%");
          $("#specCanvas").css({"position":"absolute","left":"0px","top":"0px"});
        }else{
          $("#specCanvas").width("50%");
          $("#crvCanvas").width("50%");
          $("#specCanvas").css({"position":"relative"});
        }
        this.initOptical("crvCanvas", this.crvParam);
      },
      changeChart(type, index){
        this.$set(this.show[type], index, !this.show[type][index]);
      },
      initPageEle(){
        this.AMP_OPTION = this.range_AMP;
        this.FREQ_TYPE = this.range_ChannelType;
      },
      initPageStyle(){
        setTimeout(function(){
          var contentHeight = document.getElementById("contentDiv").offsetHeight;
          var rcvParamDivHeight = document.getElementById("rcvParamDiv").offsetHeight;
          var tableHeight = contentHeight-rcvParamDivHeight-20;
          document.getElementById("channelTable").style.height =  tableHeight+"px";
        },500)
      },
      changeRcv(){//修改接收机时，清空定时器，重新开始获取数据
        var that = this;
        this.myChartArr = new Object();
        this.getRcvAllData();
        this.GetAudioMonitor(function(){
          that.initVideo();
        });
      },
      getRcvAllData(){
        /*this.formatFreqCharts([]);//初始化频谱图
        this.formatFreqHeatMap();//初始化热力图*/
        //this.initVoltage();//频谱图初始化
        
        this.initOptical("crvCanvas", this.crvParam);//初始化热力图
        this.GetBoardParam();//左侧参数
        this.getChannelData();//表格和电平数据
        this.getRealtimeSpectData();//频谱图和热力图的数据
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
        var paramValue = [this.RefreshIntervalTime];
        var that = this;
        this.setRcvParams(paramName, paramValue, function(data){
          that.getChannelData();//更新刷新时间后，重新定时
        })
      },
      setRcvParams(paramName,paramValue,callback){
        var that = this;
        var rcv_sn = this.rcv_board.split("_")[0];
        var board_id = this.rcv_board.split("_")[1];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/SetBoardParams.json",
          data:this.$qs.stringify({
            SetBoardParams: 1,
            DeviceSN: rcv_sn,
            BoardId:board_id,    
            ParamCol:paramName,
            ParamValue:paramValue
          }),
          Api:"SetRcvParams",
          AppId:"web",
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
            /*var date = new Date();
            var now = date.getTime();
            var interval = now-this.lastTime;
            this.lastTime = now;
            console.log("定时请求"+interval)*/
            that.GetRealtimeSpect();
          }else{
            clearInterval(that.spectInterval)
          }
        },this.FREQ_REQUEST_INTERVAL)

        /*setTimeout(function(){
          this.interval2 = setInterval(function(){
            var date = new Date();
            var now1 = date.getTime();
            var interval1 = now1-this.lastDraw;
            this.lastDraw = now1;
            if(that.$route.fullPath == "/monitorPage"){
              
              //console.log("画图前数组长："+that.freqDataTemp.length)
              that.formatFreqCharts(that.freqDataTemp[0]);
            }else{
              clearInterval(that.interval2)
            }
          },this.FREQ_REQUEST_INTERVAL)
          
        },1000)*/
        that.GetRealtimeSpect();
      },
      changeFreqType(){
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
      },
      GetChannelInfo(){
        var that = this;
        var ChannelType = "";
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
            GetNBSpect:1,
          }),
          Api:"GetChannelInfo",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            var dataAM = data.filter((item) => { return item.ChannelType == 0; })
            var dataSW = data.filter((item) => { return item.ChannelType == 1; })
            var dataFM = data.filter((item) => { return item.ChannelType == 2; })
            var orderData = dataAM.concat(dataSW, dataFM);
            that.channelAllData = orderData;
            var tableData = [];
            switch(that.freq_type){
              case 0:
                tableData = dataAM;
                break;
              case 1:
                tableData = dataSW;
                break;
              case 2:
                tableData = dataFM;
                break;
              default:
                tableData = orderData;
                break;
            }
            that.formatTable(tableData);
            that.formatCharts(data, dataAM, dataSW, dataFM);  
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatTable(data){
        //console.log("formatTable")
        this.channelData = data.map(item => {item.freq = (item.Freq/1000000).toFixed(3); return item});
        //console.log(this.channelData)
        /*if(this.currentRow){
          this.setCurrent(this.currentRow)
        }*/
      },
      tableRowClassName({row, rowIndex}) {
        row.row_index = rowIndex;
      },
      setCurrent(row) {
        var currentRowIndex = row.row_index;
        this.$refs.channelTable.setCurrentRow(this.channelData[currentRowIndex]);
      },
      
      handleCurrentChange(val) {
        console.log("handleCurrentChange")
        this.currentRow = val;
        var index = this.currentRow["row_index"];
        if(index || index==0){
            this.currentFreq = this.currentRow.freq;
            for(var i=0; i<this.total; i++){
              if(document.getElementsByClassName("chartDiv")[i]){
                document.getElementsByClassName("chartDiv")[i].classList.remove('activeChart')  
              }
            }
            
            document.getElementsByClassName("chartDiv")[this.currentRow.row_index].classList.add('activeChart')    
        }
        
        //this.selectedRowIndex = val.row_index;
      },
      formatCharts(data, dataAM, dataSW, dataFM){
        var that = this;
        this.total = data.length;
        this.total_AM = dataAM.length;
        this.total_SW = dataSW.length;
        this.total_FM = dataFM.length;
        if(data.length == 0){
          return;
        }
        this.initManyCharts(data.length)
        this.$nextTick(function(){
          if(this.show.AMChart){
            this.formatChartsAM(dataAM);  
          }
          if(this.show.SWChart){
            this.formatChartsSW(dataSW);  
          }
          if(this.show.FMChart){
            this.formatChartsFM(dataFM);
          } 
        })
      },
      formatChartsAM(data){
        var that = this;
        for(var i=1; i<this.total_AM+1; i++){
          that.initChartChannelChart(data[i-1], i, "AM");
          that.initChartChannelInfo(data[i-1], i-1, "AM");
        }
      },
      formatChartsSW(data){
        var that = this;
        for(var i=1; i<this.total_SW+1; i++){
          //that.show["sw"][i-1] = true;
          if(that.show['sw'][i] == undefined){
            that.$set(that.show['sw'], i, true);  
          }
          that.initChartChannelChart(data[i-1], i, "SW");
          that.initChartChannelInfo(data[i-1], i-1, "SW");
        }
      },
      formatChartsFM(data){
        var that = this;
        for(var i=1; i<this.total_FM+1; i++){
          that.initChartChannelChart(data[i-1], i, "FM");
          that.initChartChannelInfo(data[i-1], i-1, "FM");
        }
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
      initChartData(chartId,channelType){
        var rcvSn = this.rcv_board;
        if(!this.levelChartDatas[rcvSn]){
          this.levelChartDatas[rcvSn] = {};
          if(!this.levelChartDatas[rcvSn][chartId]){
            this.levelChartDatas[rcvSn][chartId] = {};
            this.levelChartDatas[rcvSn][chartId]["Level"] = (new Array(this.levelChartXAxis)).fill(0);
            this.levelChartDatas[rcvSn][chartId]["Modulation"] = (new Array(this.levelChartXAxis)).fill(0);
            this.levelChartDatas[rcvSn][chartId]["CNR"] = (new Array(this.levelChartXAxis)).fill(0);
          }
        }else{
          if(!this.levelChartDatas[rcvSn][chartId]){
            this.levelChartDatas[rcvSn][chartId] = {};
            this.levelChartDatas[rcvSn][chartId]["Level"] = (new Array(this.levelChartXAxis)).fill(0);
            this.levelChartDatas[rcvSn][chartId]["Modulation"] = (new Array(this.levelChartXAxis)).fill(0);
            this.levelChartDatas[rcvSn][chartId]["CNR"] = (new Array(this.levelChartXAxis)).fill(0);
          }
        }
        /*if(!this.levelChartDatas[rcvSn].chartData_SW[chartId]){
          this.levelChartDatas[chartId] = {};
          this.levelChartDatas[chartId]["Level"] = (new Array(this.levelChartXAxis)).fill(0)
          this.levelChartDatas[chartId]["Modulation"] = (new Array(this.levelChartXAxis)).fill(0)
        }*/
      },
      /*initChartChannelChart(data, index, channelType){
        var that = this;
        var chartId = "chart_"+channelType+"_"+index;
        this.initChartData(chartId, channelType);

        if (!this.myChartArr[chartId]) {
          this.myChartArr[chartId] = echarts.init(document.getElementById(chartId), null, {renderer:'svg'});
        }
        
        this.myChartArr[chartId].resize();
        var option = {};
        var legendName = ['电平','幅度'];
        var series = [];
        var rcvSn = this.rcv_board;
        this.levelChartDatas[rcvSn][chartId]["Level"].unshift(data.Level);
        this.levelChartDatas[rcvSn][chartId]["Level"].pop();
        var LevelData = this.levelChartDatas[rcvSn][chartId]["Level"]
        this.levelChartDatas[rcvSn][chartId]["Modulation"].unshift(data.Modulation);
        this.levelChartDatas[rcvSn][chartId]["Modulation"].pop();
        var ModulationData = this.levelChartDatas[rcvSn][chartId]["Modulation"]
        
        localStorage.setItem("levelChartDatas",JSON.stringify(this.levelChartDatas));
        var chartData = {"电平":LevelData, "幅度":ModulationData}
        for(var m=0; m<legendName.length; m++){
          var name = legendName[m];
          series.push({
            name: name,//.indexOf("电平")!=0?name+"(dbm)":name+("%"),
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
          grid: {
            containLabel: true,
            borderWidth: 0,
            top: 30,
            bottom: 10,
            left: 20,
            right: 20,
            textStyle: {
              color: "#fff"
            }
          },
          tooltip: that.commonOptionTooltipFalse,
          xAxis: Object.assign(that.commonOptionXAxis[0], {data: that.xData}),
          yAxis:[yAxisOption1, yAxisOption2],
          series: series,
          animation: false
        };
        this.myChartArr[chartId].setOption(option, true);
      },*/
      initChartChannelChart(data, index, channelType){
        var that = this;
        var chartId = "chart_"+channelType+"_"+index;
        var spectId = "spect_"+channelType+"_"+index;
        var crvId = "crv_"+channelType+"_"+index;
        var volumnId = "Volume_"+channelType+"_"+index;
        this.initChartData(chartId, channelType);
        var rcvSn = this.rcv_board;
        this.levelChartDatas[rcvSn][chartId]["Level"].unshift(data.Level);
        this.levelChartDatas[rcvSn][chartId]["Level"].pop();
        var LevelData = this.levelChartDatas[rcvSn][chartId]["Level"]
        
        this.levelChartDatas[rcvSn][chartId]["Modulation"].unshift(data.Modulation);
        this.levelChartDatas[rcvSn][chartId]["Modulation"].pop();
        var ModulationData = this.levelChartDatas[rcvSn][chartId]["Modulation"]
        
        this.levelChartDatas[rcvSn][chartId]["CNR"].unshift(data.CNR);
        this.levelChartDatas[rcvSn][chartId]["CNR"].pop();
        var CNRDatas = this.levelChartDatas[rcvSn][chartId]["CNR"]

        localStorage.setItem("levelChartDatas",JSON.stringify(this.levelChartDatas));
        //电平
        this.initVoltage(chartId);
        this.drawVoltage(LevelData,ModulationData,CNRDatas)
        //频谱
        var spectData = data['Spect'];
        var spectMin = Math.min.apply(null, spectData);
        var spectMax = Math.max.apply(null, spectData);
        var param={
          "margin":{
            "left":10,
            "top":5,
            "right":10,
            "bottom":5,
          },
          "x":{
            "min":0,
            "max":data.Points,
          },
          "y":{
            "min":spectMin-10,//-100,
            "max":spectMax+10,//-20,
          },
          "xLabelShow":false,
          "yLabelShow":false,
        };
        var crvParam = {
          "margin":{
            "left":10,
            "top":5,
            "right":10,
            "bottom":5,
          },
          "x":{
            "min":0,
            "max":data.Points,
          },
          "y":{
            "min":-100,
            "max":-20,
          },
        };
        if(!this.show["sw"][index]){
          this.initSpectrogram(spectId,param);
          this.spectHandler.updateSpectFig(data["Spect"]);//频谱图
          if(this.handler[crvId] == undefined){
            this.initOpticalNB(crvId, crvParam);  
          }
          
          this.handler[crvId].drawCrv(data["Spect"]);  
        }
        
        
        //音量
        this.initVolume(volumnId);
        this.drawDemodDB(data["Volume"]);

      },
      //电平图初始化
      initVoltage(chartId) {
        var Handler = new voltageLine(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //边距
        Handler.setMargin(45,5,20,5);
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
      initChartChannelInfo(data, index, channelType){
        this["chartInfo_"+channelType][index] = {};
        var datas = {
          "Freq":data["Freq"],
          "freq":(data["Freq"]/1000000).toFixed(3),
          "Level":data["Level"],
          "Modulation":data["Modulation"],
          "CNR":data["CNR"],
          "Offset":data["Offset"],
          "BW":data["BW"],
        }
        this.$set(this["chartInfo_"+channelType], index, datas);
      },
      changeActiveChart(e){
        if( e.currentTarget.getAttribute("class") && e.currentTarget.getAttribute("class").includes("activeChart") ){//点击的是当前选中项，什么也不做
          
        }else{
          for(var i=0; i<this.total; i++){
            //this.chartDivClass[i] = ""; 
            //this.$set(this.chartDivClass, i, "");
            if(document.getElementsByClassName("chartDiv")[i]){
              document.getElementsByClassName("chartDiv")[i].classList.remove('activeChart')  
            }
          }
          e.currentTarget.classList.add('activeChart')
          this.selectChartIndex = e.currentTarget.classList[1].split("_")[1]-1;
          this.currentFreq = this.channelAllData[this.selectChartIndex]["freq"];
        }
      },
      GetRealtimeSpect(){
        var that = this;
        var devSn = this.rcv_board.split("_")[0];
        var boardId = this.rcv_board.split("_")[1];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetRealtimeSpect.json",
          data:this.$qs.stringify({
            GetRealtimeSpect: "1",
            DeviceSN:devSn,
            BoardId:boardId,
          }),
          Api:"GetRealtimeSpect",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            that.allData = data;
            that.xAxisMin = data["SpectStart"];
            that.xAxisMax = data["SpectEnd"];
            that.xAxisNum = data["Points"];
            var inter = (that.xAxisMax - that.xAxisMin)/(that.xAxisNum-1);
            that.xAxisData = [];
            /*for(var i=0; i<that.xAxisNum; i++){
              that.xAxisData.push(((that.xAxisMin*1+i*inter)/1000000).toFixed(3)+"MHz")
            }
            that.freqDataTemp.push(data);
            that.formatFreqCharts(data);*/
            var param={
              "margin":{
                "left":50,
                "top":10,
                "right":20,
                "bottom":40,
              },
              "x":{
                "min":that.xAxisMin/1000000,
                "max":that.xAxisMax/1000000,
              },
              "y":{
                "min":-120,
                "max":20,
              },
              "xLabelShow":true,
              "yLabelShow":true,
            }
            that.initSpectrogram("specCanvas",param);
            that.spectHandler.updateSpectFig(data["Spect"]);//频谱图
            that.opticalHandler.drawCrv(data["Spect"]);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      /*formatFreqCharts(data){
        if(!data){
          return;
        }
        var date = new Date();
        var that = this;
        if (!this.chartFreq1) {
          this.chartFreq1 = echarts.init(document.getElementById("freq1"));
        }
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
        yAxisOption1.name = '电平(dbm)';
        yAxisOption1.axisLine.lineStyle.color = '#C1C1C1'
        yAxisOption1.min = "-130";
        yAxisOption1.max = "20";
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
        this.freqDataTemp.shift();
        this.freqDataTemp.shift();
        this.freqDataTemp.shift();
      },*/
      //频谱图初始化
      initSpectrogram(chartId, param) {
        var that = this;
        var Handler = new spectrogramLine(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        /*//光标名
        Handler.setMkrName(0,'A');
        Handler.setMkrName(1,'B');
        Handler.setMkrEnable([true,false,false,false,false,false]);*/
        //边距
        //Handler.setMargin(50,10,20,40);
        Handler.setMargin(param.margin.left,param.margin.top,param.margin.right,param.margin.bottom);
        //画背景和坐标轴
        Handler.drawFrame();
        //XY轴标注
        //console.log("xAxisMax:"+this.xAxisMax)
        //Handler.setXYAxis(this.xAxisMin/1000000,this.xAxisMax/1000000, -120, 20, true,true);
        //Handler.setXYAxis(param.x.min,param.x.max,param.y.min,param.y.max, true,true);
        Handler.setXYAxis(param.x.min,param.x.max,param.y.min,param.y.max, param.xLabelShow,param.yLabelShow);
        //画图
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
            console.log("MARK1")
            console.log(MARK1)
            console.log(MARK2)
            console.log(MARK3)
            active_mark = mkr.setActiveMkrByPoint([MARK1,MARK2,MARK3], point);
            console.log("active_mark:"+active_mark)
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
      //光谱图初始化
      initOptical(chartId, param) {
        var Handler  = new Crv(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //边距
        //Handler.setMargin(50,10,20,40);
        Handler.setMargin(param.margin.left,param.margin.top,param.margin.right,param.margin.bottom);
        //XY坐标轴
        //Handler.drawXYAxis(87, 108, -120, 0);
        Handler.drawXYAxis(param.x.min,param.x.max,param.y.min,param.y.max, true);
        GDI.removeAllFigure();
        GDI.removeAllText();
        GDI.draw();
        this.opticalHandler = Handler;
      },
      //光谱图初始化
      initOpticalNB(chartId, param) {
        var Handler  = new Crv(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //边距
        //Handler.setMargin(50,10,20,0);
        Handler.setMargin(param.margin.left,param.margin.top,param.margin.right,param.margin.bottom);
        //XY坐标轴
        //Handler.drawXYAxis(87, 108, -120, 0);
        Handler.drawXYAxis(param.x.min,param.x.max,param.y.min,param.y.max, false);
        GDI.removeAllFigure();
        GDI.removeAllText();
        GDI.draw();
        this.$set(this.handler, chartId, Handler);
      },
      /*formatFreqHeatMap(){
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
        yAxisOption1.data = yData;
        yAxisOption1.axisLine.lineStyle.color = '#C1C1C1'
        yAxisOption1.axisTick.show = false;
        yAxisOption1.axisLabel.show = true;
        yAxisOption1.name = "";
        var xAxisOption = that.$common.copy(that.commonOptionXAxis[0]);
        xAxisOption["axisLabel"].show = true;
        xAxisOption["axisLabel"].type = 'category';
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
            show:true,
            min: -120,
            max: 0,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            top: '5',
            itemWidth:10,
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
      },*/
      GetAudioMonitor(cb){
        var that = this;
        var DeviceSN = this.rcv_board.split("_")[0];
        var BoardId = this.rcv_board.split("_")[1];
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
      startPlay(index, datas){
        var that = this;
        var switchFlg = "1"
        this.currentFreq = datas[index]["Freq"];//(datas[index]["Freq"]/1000000).toFixed(3);
        this.SetAudioMonitor(index, datas, switchFlg, function(res){
          that.PullUrl = res.data[0]["PullUrl"];
          that.webrtcClose();
          that.webrtcPlay();
          that.playFlag = index;
        })
      },
      stopPlay(index, datas){
        var that = this;
        var switchFlg = "0"
        this.SetAudioMonitor(index, datas, switchFlg, function(res){
          that.GetAudioMonitor();
          that.webrtcClose();
          that.playFlag = null;
        })
      },
      SetAudioMonitor(index, datas, switchFlg, cb){
        var that = this;
        var DeviceSN = this.rcv_board.split("_")[0];
        var BoardId = this.rcv_board.split("_")[1];
        var freq = "";
        if(index){
          freq = datas[index]["Freq"];
        }else{
          freq = this.currentFreq
        }
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetChannelInfo.json",
          data:this.$qs.stringify({
            SetAudioMonitor: "1",
            DeviceSN:DeviceSN,          //10位序列号
            BoardId:BoardId,          //板卡号
            Freq:freq,               //频率,Hz
            Switch:switchFlg,           //开关,0:停止 1:开启
            Record:that.audio.Record,           //是否录音,0:不录制 1:录制
          }),
          Api:"SetAudioMonitor",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            if(typeof(cb) == 'function'){
              cb(res)
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      initVideo(){
        this.webrtcClose();
        if(this.audio.PullUrl != ""){
          console.log("play")
          this.webrtcPlay();
        }
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
      changeRecordStatus(){
        console.log("changeRecordStatus")
        if(this.audio.Record == "1"){
          this.audio.Record = "0"
        }else{
          this.audio.Record = "1"
        }
      },
      getIcon(index, row){
        if(index == this.playFlag || (row.freq == this.audio.freq && this.audio.Switch==1)){
          /*if(!this.stopPlay){
            this.stopPlay==row.index; 
          }*/
          //return 'fa-pause'  
          return false;
        }else{
          //return 'fa-volume-control-phone';  
          return true;
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
</style>
<style scoped>
 
</style>