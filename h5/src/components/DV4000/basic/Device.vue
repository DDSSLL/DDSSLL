<template>
  <div class="Device">
    <div class="channels">
      <div class="activeDevice" @click="showDeviceList" v-if="!!ActiveDevice">
        <div class="status">
          <span class="statusCircle" :class="[this.ActiveDevice.match_used == 0 ? 'gray': this.ActiveDevice.dev_push_status!=0 ? 'sk-spinner sk-spinner-three-bounce': 'green']">
            <span class="sk-bounce1"></span>
          </span>
        </div>
        <div class="rate">
          <div v-if="this.ActiveDevice.match_used=='1' && this.ActiveDevice.dev_push_status!='0'">
            <span class="us">{{ (+this.ActiveDevice.dev_push_br / 1000).toFixed(3) }}</span>
            <span class="ds">{{ (+this.ActiveDevice.rcv_br / 1000).toFixed(3) }}</span>
            <span class="rl" v-if="this.ActiveDevice.TotalLossRate && this.ActiveDevice.TotalLossRate!=0" >{{ (+this.ActiveDevice.TotalLossRate / 10).toFixed(1) + '%' }}</span>  
          </div>
          <div v-else class="noSpeedInfo">--</div>
        </div>
        <div class="info nowrap" style="width:45%">
          <div style="width:100%">
            <span class="T">
              <span class="TCircle" :class="[this.ActiveDevice.online== 1 ? (this.ActiveDevice.dev_push_status!=0 ? 'red' : 'green') : 'gray']"></span>
              <span class="nowrapText">T: {{ this.ActiveDevice.dev_name }}</span>
            </span>
            <span class="R">
              <span class="RCircle" :class="[this.ActiveDevice.rcv_online == 1 ? (this.ActiveDevice.dev_push_status != '0' ? 'red' : 'green') : 'gray']"></span>
              <span class="nowrapText">R: {{ this.ActiveDevice.rcv_name }}</span>
            </span>
            <span class="B" v-if="!(this.ActiveDevice.rcv_sn.substr(-4) == '2999')">
              <span class="BCircle" :class="[!this.ActiveDevice.board_online||this.ActiveDevice.board_online=='0' ? 'gray': this.ActiveDevice.dev_push_status!='0'?'red':'green']"></span>
              B: {{ this.ActiveDevice.board_id }}
            </span>
          </div>
        </div>
        <div class="refreshIcon" v-if="pageType=='status'">
          <i class="fa fa-2x fa-refresh" aria-hidden="true" @click.stop="refreshChart"></i>
        </div>
        <div class="lock" v-else-if="pageType=='rcv'">
          <i class="fa fa-2x fa-lock" id="rcvlockIcon" aria-hidden="true" @click.stop="changeRcvLockState"></i>
        </div>
        <div class="lock" v-else>
          <i class="fa fa-2x" id="lockIcon" aria-hidden="true" @click.stop="changeLockState" :disable="lockDisable"></i>
        </div>
        
      </div>
    </div>
    <div class="popup">
      <mt-popup
        v-model="popupVisible"
        position="right"
        popup-transition="popup-slide">
        <div class="channelList">
          <div class="deviceTypeSelect" style="text-align:right;">
            <div class="back" @click="popupVisible=false">
              <i class="fa fa-arrow-left" aria-hidden="true"></i>
            </div>
            <!-- <select v-model="deviceType" class="TypeSelect" :class="{'White':deviceTypeSelect == '1','Red':deviceTypeSelect == '2','Green':deviceTypeSelect == '3','Gray':deviceTypeSelect == '4'}" style="width:1.1rem" @change="filterDevice">
              <option value="1" class="White"><span>全部设备</span></option>
              <option value="2" class="Red"><span>推流设备</span></option>
              <option value="3" class="Green"><span>在线设备</span></option>
              <option value="4" class="Gray"><span>离线设备</span></option>
            </select> -->
            <!-- <select v-model="devicePrefix" class="TypeSelect White" @change="filterDevice" v-if="this.user.id==this.SUPER" multiple>
              <template v-for="item in allPrefix">
                <option :value="item.value"  class="White">{{ item.text }}</option>
              </template>
            </select> -->
            <button @click="deviceTypePop = true" class="TypeSelect White">{{this.deviceTypeCurName}}</button>
            <button @click="devicePrefixPop = true" class="TypeSelect White" v-if="user.id==SUPER">{{this.devicePrefixCurName}}</button>
          </div>
          <mt-loadmore :top-method="getDeviceList" ref="loadmore">
            <template v-for="(item,i) in deviceListShow">
              <div class="listChannel" @click="changeActiveDevice(item)" :class="[!!ActiveDevice?(ActiveDevice.dev_name == item.dev_name ? 'activeChanel' : ''):'']">
                <div class="status">
                  <span class="statusCircle" :class="[item.match_used == 0 ? 'gray': item.dev_push_status!=0 ? 'sk-spinner sk-spinner-three-bounce': 'green']">
                    <span class="sk-bounce1"></span>
                  </span>
                </div>
                <div class="rate">
                  <div v-if="item['match_used']=='1' && item['dev_push_status']!='0'">
                    <span class="us">{{ (+item['dev_push_br'] / 1000).toFixed(3) }}</span>
                    <span class="ds">{{ (+item['rcv_br'] / 1000).toFixed(3) }}</span>
                    <span class="rl" v-if="item['TotalLossRate'] && item['TotalLossRate']!=0" >{{ (+item['TotalLossRate'] / 10).toFixed(1) + '%' }}</span>  
                  </div>
                  <div v-else class="noSpeedInfo">--</div>
                </div>
                <div class="info nowrap">
                  <div style="width:100%">
                    <span class="T">
                      <span class="TCircle" :class="[item.online== 1 ? (item.dev_push_status!=0 ? 'red' : 'green') : 'gray']"></span>
                      <span class="nowrapText">T: {{ item.dev_name }}</span>
                    </span>
                    <span class="R">
                      <span class="RCircle" :class="[item.rcv_online == 1 ? (item.dev_push_status != '0' ? 'red' : 'green') : 'gray']"></span>
                      <span class="nowrapText">R: {{ item.rcv_name }}</span>
                    </span>
                    <span class="B" v-if="!(item.rcv_sn.substr(-4) == '2999')">
                      <span class="BCircle" :class="[!item.board_online||item.board_online=='0' ? 'gray': item.dev_push_status!='0'?'red':'green']"></span>
                      B: {{ item.board_id }}
                    </span>
                  </div>
                </div>
                <div class="tag" @click.stop="showDevStatus(item.dev_sn)">
                  <i class="fa fa-tags" aria-hidden="true"></i>
                </div>
              </div>
            </template>
          </mt-loadmore>
        </div>
      </mt-popup>
      <mt-popup v-model="deviceTypePop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop">
        <span class="chevronDown">
          <i class="fa fa-chevron-down" @click.stop="deviceTypePop=false"></i>
        </span>
        <mt-radio
          v-model="deviceType"
          :options="deviceTypeOptions"
          @change="changeDeviceType">
        </mt-radio>
      </mt-popup>
      <mt-popup v-model="devicePrefixPop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop devicePrefixFilterPop">
        <span class="chevronDown">
          <i class="fa fa-chevron-down" @click.stop="devicePrefixPop=false"></i>
        </span>
        <mt-checklist
          v-model="devicePrefix"
          :options="this.allPrefix"
          @change="changeDevicePrefix">
        </mt-checklist>
      </mt-popup>
      <mt-popup v-model="deviceModePop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop">
        <span class="chevronDown">
          <i class="fa fa-chevron-down" @click.stop="deviceModePop=false"></i>
        </span>
        <mt-radio
          v-model="deviceMode"
          :options="deviceModeOptions"
          @change="changeDeviceMode">
        </mt-radio>
      </mt-popup>
      <mt-popup v-model="popupTagsVisible" position="right" popup-transition="popup-slide">
        <div class="back" @click="closeDevStatus">
          <i class="fa fa-arrow-left" aria-hidden="true"></i>
          背包状态
        </div>
        <div class="devStatusDiv">
          <!-- <mt-cell title="序列号">
            <span>{{status.devSn_str}}</span>
          </mt-cell> -->
          <mt-cell title="温度">
            <span>{{status.IntTemp}}</span>
          </mt-cell>
          <mt-cell title="内部电池">
            <span :class="status.battery1"></span>
          </mt-cell>
          <mt-cell title="外部电池" v-if="show.extBattery">
            <span :class="status.battery2"></span>
          </mt-cell>
          <!-- <mt-cell title="GPS锁定">
            <span>{{status.gpsStatus}}</span>
          </mt-cell> -->
          <mt-cell title="输入分辨率">
            <span>{{status.resolution_str}}</span>
          </mt-cell>
          <mt-cell title="输出分辨率">
            <span>{{status.OutputFormat}}</span>
          </mt-cell>
          <!-- <span id="m50_format" style="display: none"></span>
              <span id="m50_fr" style="display: none"></span> -->
          <mt-cell title="工作状态">
            <span :style="{color:status.work_str_style}">{{status.work_str}}</span>
          </mt-cell>
          <mt-cell title="延时(s)">
            <span>{{status.delay_str}}</span>
          </mt-cell>
          <mt-cell title="视频输入">
            <span>{{status.videoInput_str}}</span>
          </mt-cell>
          <mt-cell title="视频比特率">
            <span>{{status.videoBr_str}}</span>
          </mt-cell>
          <mt-cell title="视频编码">
            <span>{{status.videoEnc_str}}</span>
          </mt-cell>
          <mt-cell title="音频输入">
            <span>{{status.audioInput_str}}</span>
          </mt-cell>
          <mt-cell title="音频编码">
            <span>{{status.audioEnc_str}}</span>
          </mt-cell>
          <mt-cell title="音频比特率">
            <span>{{status.audioBitrate_str}}</span>
          </mt-cell>
          <!-- <mt-cell title="码率控制">
            <span>{{status.bitrateMode_str}}</span>
          </mt-cell> -->
          <mt-cell title="HDR设置">
            <span>{{status.HDR_str}}</span>
          </mt-cell>
          <!-- <mt-cell title="历史数据" value=""  icon="fa-file-text-o">
            <span>{{status.OutputFormat}}</span>
          </mt-cell> -->
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_ACTIVE_DEVICE,SET_DEVICE_TIMER,SET_DEVICE_TYPE_SELECT,SET_DEVICE_PREFIX_SELECT,SET_PARAM_LOCK_ACK,SET_PARAM_LOCK,SET_LOCK_USERID } from '../../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "Device",
    props:['page'],
    data(){
      return{
        SUPER : SUPER,
        timer:null,
        popupVisible:false,
        popupTagsVisible:false,
        lockDisable:false,
        deviceList:[{online:'',dev_sn:"",dev_name:"",dev_push_status:"",rcv_online:"",rcv_name:""}],
        active:{},
        //当前选中设备的相关参数
        deviceListShow:[],
                       
        pageType:this.page,
        //用户组
        devicePrefixPop:false,
        allPrefix:[],
        devicePrefix:"",
        devicePrefixCurName:"用户组",
        //设备在线类型
        deviceTypePop: false,
        deviceType:"",
        deviceTypeCurName:"",
        deviceTypeOptions: [{label: '全部设备',value: '1'},
                            {label: '推流设备',value: '2'},
                            {label: '在线设备',value: '3'},
                            {label: '离线设备',value: '4'}],
        status:{
          devSn_str:"",
          IntTemp:"",
          battery1:"",
          battery2:"",
          gpsStatus:"",
          resolution_str:"",
          OutputFormat:"",
          work_str:"",
          work_str_style:"",
          delay_str:"",
          videoInput_str:"",
          videoBr_str:"",
          videoEnc_str:"",
          audioInput_str:"",
          audioEnc_str:"",
          audioBitrate_str:"",
          bitrateMode_str:"",
          HDR_str:"",
        },
        interval:{
          getParam:"",
        },
        show:{
          extBattery:false,
        },
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice','DeviceTimer','deviceTypeSelect','devicePrefixSelect','paramLockAck','paramLock','lockUserId'])
    },
    created(){  //生命周期-页面创建后
      var that = this;
      that.initFilter();
      clearInterval(this.DeviceTimer);
      this.timer = setInterval(function(){
        that.getDeviceList();
      },1000);//调试暂时注掉
      this.SET_DEVICE_TIMER(this.timer);
    },
    activated(){
      var that = this;
      that.initFilter();
    },
    methods:{
      ...mapMutations({
        SET_ACTIVE_DEVICE,
        SET_DEVICE_TIMER,
        SET_DEVICE_TYPE_SELECT,
        SET_DEVICE_PREFIX_SELECT,
        SET_PARAM_LOCK_ACK,
        SET_PARAM_LOCK,
        SET_LOCK_USERID
      }),
      closeDevStatus(){
        this.popupTagsVisible=false
        clearInterval(this.interval.getParam);
        this.interval.getParam = "";
        this.status.devSn_str = "";
        this.status.IntTemp = "";
        this.status.battery1 = "";
        this.status.battery2 = "";
        this.status.gpsStatus = "";
        this.status.resolution_str = "";
        this.status.OutputFormat = "";
        this.status.work_str = "";
        this.status.work_str_style = "";
        this.status.delay_str = "";
        this.status.videoInput_str = "";
        this.status.videoBr_str = "";
        this.status.videoEnc_str = "";
        this.status.audioInput_str = "";
        this.status.audioEnc_str = "";
        this.status.audioBitrate_str = "";
        this.status.bitrateMode_str = "";
        this.status.HDR_str = "";
        this.show.extBattery = false;
      },
      showDevStatus(devSn){
        console.log("showDevStatus:"+devSn)
        this.popupTagsVisible = true;
        //定时刷新设备参数 500ms
        this.startTimerParam(devSn,500);

      },
      //启动定时器刷新参数
      startTimerParam(devSN,ms) {
        console.log("startTimerParam")
        console.log("this.interval.getParam:"+this.interval.getParam)
        var that = this;
        if (this.interval.getParam == "") {
          this.interval.getParam = setInterval(function() {
            if (!devSN || !that.$global.isValidSn(devSN)) {
              return;
            }
            that.getDevState(devSN);
          }, ms);
        }
      },
      //获取背包状态
      getDevState(devSn) {
        console.log("getDevState："+devSn)
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevState:devSn,
          }),
          Api:"getDevState",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.initDevState(res)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      initDevState(res){
        console.log("initDevState")
        console.log(res)
        /*var text = '', color = '#ffffff';
        if (res.data[0].UdpLiveEnable == '0') {
          text = '没有推流';
          color = '#ffffff';
          $('#dev_error_tr').hide();
        } else {
          if (res.data[0].UdpLiveWorkStatus == 'running') {
            color = '#00ff00';
            text = '通过[' + res.data[0]['4GNetcardList'] + res.data[0]['5GNetcardList'] + ']' +
              '往{' + res.data[0].ServerUrl + '}推流正常';
            text = '推流正常';
            $('#dev_error_tr').hide();
          } else {
            color = '#FF0000';
            text = '通过[' + res.data[0]['4GNetcardList'] + res.data[0]['5GNetcardList'] + ']' +
              '往{' + res.data[0].ServerUrl + '}推流异常';
            text = '推流异常';
            $('#dev_error_tr').show();
          }
        }
        $('#UdpLiveWorkStatus').text(text).css('color', color);
        $('#dev_error').text(res.data[0]['UdpLiveWorkStatus']).css('color', color);*/

        //序列号
        this.status.devSn_str = res.data[0].dev_sn;
        //温度
        this.status.IntTemp = res.data[0].IntTemp + '°C';
        //电量 温度
        var inBat = res.data[0].IntBat;
        var inBatCharged = "";
        var suffix = "";
        var prefix = "";
        if (inBat) {
          if (inBat.indexOf("CHARGING") != -1) {
            inBat = inBat.split("(")[1].split(")")[0].split("%")[0];
            suffix = "_charge";
          } else if(inBat.indexOf("CHARGED") != -1){
            inBat = 100;
            suffix = "_charge";
          } else {
            inBat = inBat.split("%")[0];
          }
        }
        if (inBat >= 80) {
          prefix = "_100";
        } else if (inBat >= 60) {
          prefix = "_80";
        } else if (inBat >= 40) {
          prefix = "_60";
        } else if (inBat >= 20) {
          prefix = "_40";
        } else if (inBat >= 10) {
          prefix = "_20";
        } else {
          prefix = "_0";
        }
        this.status.battery1 = "battery"+prefix+suffix;
        var exBat = res.data[0].ExtBat;
        var exBatCharged = "";
        var suffix2 = "";
        var prefix2 = "";
        if (exBat) {
          if (exBat.indexOf("CHARGING") != -1) {
            exBat = exBat.split("(")[1].split(")")[0].split("%")[0];
            suffix2 = "_charge";
          } else if(exBat == "---"){
            exBat = "nonexistent";
          } else {
            exBat = exBat.split("%")[0];
          }
        }
        if(exBat == "nonexistent"){
          this.show.extBattery = false;
        }else{
          if (exBat >= 80) {
            prefix2 = "_100";
          } else if (exBat >= 60) {
            prefix2 = "_80";
          } else if (exBat >= 40) {
            prefix2 = "_60";
          } else if (exBat >= 20) {
            prefix2 = "_40";
          } else if (exBat >= 10) {
            prefix2 = "_20";
          } else {
            prefix2 = "_0";
          }
          this.show.extBattery = true;
          this.status.battery2 = "battery"+prefix2+suffix2;
        }
        //在线且没在充电中，才显示电池电量低
        /*if (res.data[0].online == 1 && exBat.indexOf("CHARGING") == -1) {
          if(inBat <= 40 || (exBat != "nonexistent" && exBat<=40 )){
            showWarn('devWarn', true, '电池电量低');
          } else {
            showWarn('devWarn', false);
          }
        } else {
          $("#devWarn").css('color', 'transparent');
        }*/
        //GPS锁定
        this.status.gpsStatus = res.data[0].GpsStatusStr;
        //输入分辨率
        var input = res.data[0].resolution_str.replace('-', '');
        this.status.resolution_str = input;
        //输出分辨率
        var outputArr = res.data[0].OutputFormat.split('/');
        var output = outputArr[outputArr.length-1];
        this.status.OutputFormat = output;
        //工作状态
        var workStr = '';
        var workStrColor = '#FFFFFF';
        if(res.data[0]["online"] == '1'){
          workStr = '待机';
          workStrColor = '#00FF00';
          if(res.data[0]["OffLinePushEnable"] == '1'){
            workStr = '文件离线回传中';
            workStrColor = '#FF0000';
          }
          else{
            if(res.data[0]["dev_push_status"] == '1'){
              workStr = '直播中';
              workStrColor = '#FF0000';
              if(res.data[0]["record"] == '1'){
                workStr += ' 录制中';
              }
            }
            else if(res.data[0]["record"] == '1'){
              workStr = '录制中';
              workStrColor = '#00FF00';
            }
          }
        }
        else{
          workStr = '离线';
        }
        this.status.work_str = workStr;
        this.status.work_str_style = workStrColor;
        //延时+时延模式
        var latency_text = "";
        for (var i = 0; i < this.$global.OPTIONS_LATENCY.length; i++) {
          if (this.$global.OPTIONS_LATENCY[i]["value"] == res.data[0]["latency"]) {
            latency_text = this.$global.OPTIONS_LATENCY[i]["text"];
          }
        }
        this.status.delay_str = res.data[0]["dev_delay"] / 1000 + "s";
        //视频比特率
        this.status.videoBr_str = res.data[0]["dev_sr"] / 1000 + "Mbps";
        //视频编码
        var videoEncodeStr = "";
        for (var i = 0; i < this.$global.OPTIONS_VIDEOENCODE_1080.length; i++) {
          if (this.$global.OPTIONS_VIDEOENCODE_1080[i]["value"] == res.data[0]["video_encode"]) {
            videoEncodeStr = this.$global.OPTIONS_VIDEOENCODE_1080[i]["text"];
          }
        }
        this.status.videoEnc_str = videoEncodeStr;
        //音频编码
        var audio_encode_text = "";
        for (var i = 0; i < this.$global.OPTIONS_AUDIO_ENCODE.length; i++) {
          if (this.$global.OPTIONS_AUDIO_ENCODE[i]["value"] == res.data[0]["AudioEnc"]) {
            audio_encode_text = this.$global.OPTIONS_AUDIO_ENCODE[i]["text"];
          }
        }
        this.status.audioEnc_str = audio_encode_text;
        //音频比特率
        this.status.audioBitrate_str = res.data[0]["AudioBitrate"]+'kbps';
        //视频输入
        var video_inpit_text = "";
        for (var i = 0; i < this.$global.OPTIONS_VIDEOINPUT_1080.length; i++) {
          if (this.$global.OPTIONS_VIDEOINPUT_1080[i]["value"] == res.data[0]["video_input"]) {
            video_inpit_text = this.$global.OPTIONS_VIDEOINPUT_1080[i]["text"];
          }
        }
        this.status.videoInput_str = video_inpit_text;
        //音频输入
        var audio_input_text = "";
        for (var i = 0; i < this.$global.OPTIONS_AUDIOINPUT.length; i++) {
          if (this.$global.OPTIONS_AUDIOINPUT[i]["value"] == res.data[0]["audio_input"]) {
            audio_input_text = this.$global.OPTIONS_AUDIOINPUT[i]["text"];
          }
        }
        this.status.audioInput_str = audio_input_text;
        //码率控制
        var bitrateMode_text = "";
        for (var i = 0; i < this.$global.OPTIONS_BITRATEMODE_1080.length; i++) {
          if (this.$global.OPTIONS_BITRATEMODE_1080[i]["value"] == res.data[0]["bitrate_mode"]) {
            bitrateMode_text = this.$global.OPTIONS_BITRATEMODE_1080[i]["text"];
          }
        }
        this.status.bitrateMode_str = bitrateMode_text;
        //HDR设置
        var HDR_text = "";
        for (var i = 0; i < this.$global.OPTIONS_HDR.length; i++) {
          if (this.$global.OPTIONS_HDR[i]["value"] == res.data[0]["hdr"]) {
            HDR_text = this.$global.OPTIONS_HDR[i]["text"];
          }
        }
        this.status.HDR_str = HDR_text;
        /*if (localStorage.mobileShow != "true") {
          $("#backpackStatus").css('overflow-y', 'auto');
        }*/
      },
      changeDeviceMode(){
        var that = this;
        that.SET_DEVICE_MODE_SELECT(that.deviceMode);
        that.formatDeviceModeName();
      },
      changeDeviceType(){
        var that = this;
        that.SET_DEVICE_TYPE_SELECT(that.deviceType);
        that.formatDeviceTypeName();
      },
      changeDevicePrefix(){
        var that = this;
        var selectPrefix = that.devicePrefix;
        if(selectPrefix[selectPrefix.length-1] == "all"){//当前选中all
          that.devicePrefix = ["all"];  
        }else{
          if(selectPrefix.length > 1){
            if($.inArray("all",selectPrefix) != -1){
              selectPrefix.splice(selectPrefix.indexOf("all"),1); 
            }
          }
          that.devicePrefix = selectPrefix;  
        } 
        that.SET_DEVICE_PREFIX_SELECT(that.devicePrefix.join(","));
      },
      formatDeviceTypeName(){
        var that = this;
        that.deviceType = that.deviceTypeSelect;
        for(let i=0; i<that.deviceTypeOptions.length; i++){
          if(that.deviceTypeOptions[i].value == that.deviceType){
            that.deviceTypeCurName = that.deviceTypeOptions[i].label;
            break;
          }
        }
      },
      initFilter(){
        var that = this;
        /*that.deviceType = that.deviceTypeSelect;
        for(let i=0; i<that.deviceTypeOptions.length; i++){
          if(that.deviceTypeOptions[i].value == that.deviceType){
            that.deviceTypeCurName = that.deviceTypeOptions[i].label;
            break;
          }
        }*/
        that.formatDeviceTypeName();
        that.$global.getUserPrefixArr(that.formatPrefix)
        
      },
      formatPrefix(data){
        var that = this;
        var arr = [{"label":"全部","value":"all"},{"label":"无","value":"none"}];
        for(let i=0; i<data.length; i++){
          arr.push({"label":data[i]["prefix_name"],"value":data[i]["prefix"]})
        }
        that.allPrefix = arr;
        that.devicePrefix = that.devicePrefixSelect.split(",");
      },
      refreshCurDevParam(datas){
        this.SET_ACTIVE_DEVICE(datas);
        this.getDevLockStatus();
      },
      getDeviceList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevAndMatch:true,
            userId: that.user.id,
            userGroup: that.user.userGroup,
            prefixType: that.devicePrefix.join(",")//that.user.prefix
          }),
          Api:"getDevAndMatch",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.deviceList = res.data;
            that.filterDevice();
            //that.$refs.loadmore.onTopLoaded();
            if(!that.ActiveDevice){
              that.SET_ACTIVE_DEVICE(that.deviceList[0]);
            }
            for(var i=0; i<that.deviceList.length; i++){
              if(that.deviceList[i]["dev_sn"] == that.ActiveDevice["dev_sn"]){
                that.refreshCurDevParam(that.deviceList[i]);
              }
            }
            that.getDevLockStatus();
          }else{
            that.deviceList = [];
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      //获取背包锁状态
      getDevLockStatus(){
        var that = this;
        this.$axios({
            method: 'post',
            url:"/page/index/indexData.php",
            data:this.$qs.stringify({
              getDevParam:true,
              devSN: that.ActiveDevice.dev_sn
            }),
            Api:"getDevParam",
            AppId:"android",
            UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          that.SET_PARAM_LOCK_ACK(res.data[0]['param_lock_ack'])
          that.SET_PARAM_LOCK(res.data[0]['param_lock'])
          that.SET_LOCK_USERID(res.data[0]['lock_userid'])
          if(res.data[0]['param_lock_ack'] == "1"){
            if(res.data[0]['lock_userid'] == that.user.id || res.data[0]['lock_userid'] == ""){
              $("#lockIcon").removeClass("fa-lock").addClass("fa-unlock");  
            }else{
              $("#lockIcon").removeClass("fa-unlock").addClass("fa-lock");  
            }
          }else{
            $("#lockIcon").removeClass("fa-unlock").addClass("fa-lock");
          }
          //没有权限不能解锁
          var hasRights = that.$global.judgeUserHasDevRights();
          if (!hasRights) {
            that.lockDisable = true;
          } else {
            that.lockDisable = false;
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      //修改锁
      changeLockState(){
        var that = this;
        //if (this.paramLockAck == "1") {
        if (this.paramLockAck == "1") {//平台端已解锁
          if(this.lockUserId != that.user.id){//当前设备为锁定标志
            that.setDeviceParam('lock_userid',that.user.id);
          }else{//当前设备为解锁标志
            //已解锁，要加锁,背包不锁定
            that.setDeviceParam('param_lock',2)
            that.setDeviceParam('lock_userid',"");
          }
        } else {
          //已加锁，要解锁,背包锁定
          that.setDeviceParam('param_lock',1)
          that.setDeviceParam('lock_userid',that.user.id);
        }
      },
      //status页面刷新图表
      refreshChart(){
        this.$emit('refreshChart')
      },
      //修改接收机锁
      changeRcvLockState(){
        if($("#rcvlockIcon").hasClass("fa-lock")){
          this.$emit('changeRcvLockState',"unlock")
          $("#rcvlockIcon").removeClass("fa-lock").addClass("fa-unlock");
        }else{
          this.$emit('changeRcvLockState',"lock")
          $("#rcvlockIcon").removeClass("fa-unlock").addClass("fa-lock");
        }
      },
      setDeviceParam(key,val){
        var that = this;
        var devParamCol = key;
        var value = val;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
              devSN: that.ActiveDevice.dev_sn,
              devParamCol: devParamCol,
              value: value
          }),
          Api:"SetDevParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
              //that.getDeviceParam();
          }else{
              //that.getDeviceParam();
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      showDeviceList(){
          this.popupVisible = true;
          this.getDeviceList();
      },
      changeActiveDevice(item){
          this.SET_ACTIVE_DEVICE(item);
          this.refreshCurDevParam(item);
          this.popupVisible = false;
      },
      filterDevice(){
        var that = this;
        var deviceList = this.deviceList;
        //设备在线类型
        var deviceListShow = [];
        switch (that.deviceType.toString()){
          case "1":
            deviceListShow = that.deviceList;
            break;
          case "2":
            deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 1 && (item.dev_push_status == 1 || item.dev_push_status == 2))
            });
            break;
          case "3":
            deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 1 || item.rcv_online == 1)
            });
            break;
          case "4":
            deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 0)
            });
            break;
          default:
            deviceListShow = that.deviceList;
            break;
        }
        that.deviceListShow = deviceListShow;
      }
    }
  }
</script>

<style scoped>
    .Device{
        position: fixed;
        top: 0;
        width: 100%;
        height: 60px;
        z-index: 9;
        /*background-color: #106fb1;*/
        background-color: #353535;
    }
    .popup{
        position: fixed;
        left: 0;
        top: 0;
    }
    /*当前频点*/
    .channels{
        margin-top: 0px;
    }
    .activeDevice{
        overflow: hidden;
        height: .5rem;
        /*background-color: #106fb1;*/
        background-color: #353535;
        padding: .05rem 0;
    }
    .listChannel{
        border-bottom: 1px solid #474B50;
        overflow: hidden;
        height: .5rem;
        background-color: #212227;
        padding: .05rem 0;
    }
    .activeChanel{
      background: linear-gradient(to top, #106fb1 0%,#000 30%);
    }
    .status,.rate,.info{
        float: left;
        height: 100%;
    }
    .status{
        width: 13%;
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
        width: 13%;
        /*padding-top: .08rem;*/
        /*padding-right:0.15rem;*/
        display:flex;
    }
    .rate div{
      margin:auto;
    }
    .noSpeedInfo{
      margin: auto 20%; 
      color:#eee
    }
    .us{
        display: block;
        color: #FFFF00;
        font-size: .15rem;
        text-align: left;
    }
    .ds{
        display: block;
        color: #22aadd;
        font-size: .15rem;
        text-align: left;
    }
    .rl{
        display: block;
        color: #f5222d;
        font-size: .15rem;
        text-align: left;
    }
    .info{
        width: 64%;
        color: #FFFFFF;
        font-size: .15rem;
        box-sizing: border-box;
        padding-top: .02rem;
        display:flex;
    }
    .tag{
      width:10%;
      height:100%;
      line-height:.6rem;
      color:#fff;
      display:inline-block;

    }
    .info>div{
      margin:auto;
      margin-left:10px;
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
    .sk-spinner-three-bounce .sk-bounce1{
      width: 100%;
      height: 100%;
      background-color: #ff0000;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
      animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
      /* Prevent first frame from flickering when animation starts */
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }
    @-webkit-keyframes sk-threeBounceDelay {
        0%,
        80%,
        100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        40% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }

    @keyframes sk-threeBounceDelay {
        0%,
        80%,
        100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        40% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
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
    .TypeSelect{
      height: .3rem;
      background: #3F4551;
      color: #FFF;
      width: .9rem;
      border: none;
      outline: none;
      border-radius: 5px;
      padding-left: .1rem;
      margin: 1px 1px 0 0;
    }
    .White{color: #FFFFFF;}
    .Red{color: #FF0000;}
    .Green{color: #00FF00}
    .Gray{color: #B7B7B7;}
    .back{
      color: #fff;
      margin: 10px;
      position: absolute;
    }
    .lock, .refreshIcon{
      height:100%;
      display:flex;
    }
    .lock i, .refreshIcon i{
      margin:auto;
    }
    .lock .fa-lock{
      color: #ff9945;
    }
    .lock .fa-unlock{
      color: #75d1c7;
    }
    .refreshIcon .fa-refresh{
      color:#fff;
    }
    .deviceFilterPop{
      height:auto;
      background-color:#3f4551;
      color:#fff;
    }
    .devStatusDiv{
      color:#fff;
      margin-top:35px;
      height:calc(100% - 35px);
      overflow:auto;
    }
    .devStatusDiv .mint-cell{
      background-color:transparent;
    }
</style>
<style>
  .channelList .mint-loadmore-text{color: #FFF;}
  .deviceFilterPop .mint-cell-wrapper{
    background-image:linear-gradient(180deg,#000,#000 50%,transparent 0) !important;
  }
  .deviceFilterPop .mint-cell-wrapper{
    padding:0 10px !important;
    padding-left:10px !important;
  }
  .deviceFilterPop .mint-cell{
    background-color:#3f4551 !important;
    color:#fff !important; 
    min-height: 48px !important;
    display: block !important;
  }
  .deviceFilterPop .mint-checkbox-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.14rem !important;
  }
  .deviceFilterPop .mint-radio-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.16rem !important;
  }
  .deviceFilterPop .mint-radiolist-label {
    display: block !important;
    padding: 0 10px !important;
  }
  .deviceFilterPop .mint-radiolist-title,
  .deviceFilterPop .mint-checklist-title{
    margin: 0px;
  }
  .nowrap{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:100%;
    display:inline-block;
  }
  .nowrapText{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:90%;
    display:inline-block; 
    vertical-align: middle;
    padding-left:5px;
  }
  .battery_0{
    background: url("../../../assets/img/bat/battery_0.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_20{
    background: url("../../../assets/img/bat/battery_20.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_40{
    background: url("../../../assets/img/bat/battery_40.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_60{
    background: url("../../../assets/img/bat/battery_60.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_80{
    background: url("../../../assets/img/bat/battery_80.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_100{
    background: url("../../../assets/img/bat/battery_100.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_0_charge{
    background: url("../../../assets/img/bat/dc_bat0.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_20_charge{
    background: url("../../../assets/img/bat/dc_bat20.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_40_charge{
    background: url("../../../assets/img/bat/dc_bat40.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_60_charge{
    background: url("../../../assets/img/bat/dc_bat60.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_80_charge{
    background: url("../../../assets/img/bat/dc_bat80.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_100_charge{
    background: url("../../../assets/img/bat/dc_bat100.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .devStatusDiv .mint-cell-value{
    color:#fff;
  }
</style>