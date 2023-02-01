<template>
  <div class="Device">
    <div class="channels">
      <div class="activeDevice" @click="showDeviceList" v-if="!!ActiveDevice">
        <div class="status">
          <span class="statusCircle" :class="[this.ActiveDevice.statusCircle]">
            <span class="sk-bounce1"></span>
          </span>
        </div>
        <div class="rate">
          <div v-if="this.ActiveDevice.dev_push_status!='0'"><!-- 背包工作中 -->
            <div v-if="this.ActiveDevice.WorkMode =='1'"><!-- 拉流模式 -->
              <span class="speedStyle" style="color:#00fcfc">{{ (+this.ActiveDevice.SrtKbps / 1000).toFixed(3) }}</span>  
            </div>
            <div v-else-if="this.ActiveDevice.WorkMode =='2'"><!-- 互动 -->
              <span class="speedStyle" style="color:#FFFF00">{{ (+this.ActiveDevice.dev_push_br / 1000).toFixed(3) }}</span>
              <span class="speedStyle" style="color:#22aadd">{{ (+this.ActiveDevice.rcv_br / 1000).toFixed(3) }}</span>
              <span class="speedStyle" style="color:#f5222d" v-if="this.ActiveDevice.TotalLossRate && this.ActiveDevice.TotalLossRate!=0" >{{ (+this.ActiveDevice.TotalLossRate / 10).toFixed(1) + '%' }}</span>  
            </div>
            <div v-else><!-- 推流 -->
              <span class="speedStyle" style="color:#FFFF00">{{ (+this.ActiveDevice.dev_push_br / 1000).toFixed(3) }}</span>
              <span class="speedStyle" style="color:#22aadd" v-if="ActiveDevice.PushTsType!=1">{{ (+this.ActiveDevice.rcv_br / 1000).toFixed(3) }}</span><!-- 单卡推流只显示上传速率 -->
              <span class="speedStyle" style="color:#f5222d" v-if="this.ActiveDevice.TotalLossRate && this.ActiveDevice.TotalLossRate!=0" >{{ (+this.ActiveDevice.TotalLossRate / 10).toFixed(1) + '%' }}</span>  
            </div>
          </div>
          <div v-else-if="this.ActiveDevice.pullStart!='0'"><!-- 接收机拉流中 -->
            <span class="speedStyle" style="color:#22aadd">{{ (+this.ActiveDevice.rcv_br / 1000).toFixed(3) }}</span>
          </div>
          <div v-else class="noSpeedInfo">--</div>
        </div>
        <div class="info nowrap" style="width:50%">
          <div style="width:100%">
            <span class="T">
              <span class="TCircle" :class="TCircleClass"></span>
              <span class="nowrapText">T: {{ this.ActiveDevice.dev_name }}</span>
            </span>
            <span class="R" v-if="this.ActiveDevice.WorkMode == 2">
              <span class="RCircle" :class="[this.ActiveDevice.actDevOnline == 1 ? (this.ActiveDevice.actDevPush != '0' ? 'red' : 'green') : 'gray']"></span>
              {{ $t( 'device.103000' ) }}<!-- 互动 -->: {{ this.ActiveDevice.actDevName }}
            </span>
            <span v-else>
              <span class="R">
                <span class="RCircle" :class="RCircleClass"></span>
                R: {{ this.ActiveDevice.rcv_name }}
              </span>
              <span class="B" v-if="this.ActiveDevice['board_online'] && this.ActiveDevice['board_id'].length != 10">
                <span class="BCircle" :class="BCircleClass"></span>
                B: {{ this.ActiveDevice.board_id*1+1 }}
              </span>
            </span>
          </div>
        </div>
        <div class="iconStyle">
          <div class="lock" v-if="pageType=='rcv'">
            <i class="fa fa-2x fa-lock" id="rcvlockIcon" aria-hidden="true" @click.stop="changeRcvLockState"></i>
          </div>
          <div class="lock" v-else-if="pageType=='dev'" disabled="lockDisable">
            <i class="fa fa-2x" id="lockIcon" aria-hidden="true" @click.stop="changeLockState" :disabled="lockDisable"></i>
          </div>
          <div class="stateInfo" v-if="ActiveDevice.infoStatus == 'infoRed'">
            <img src="../../assets/img/battery_low.png" width="24px" height="24px" />
          </div>  
        </div>
      </div>
    </div>
    <div class="popup">
      <mt-popup
        v-model="popupVisible"
        position="right"
        popup-transition="popup-fade">
        <div class="channelList">
          <div class="deviceTypeSelect">
            <div class="back" @click="backToActivePage" style="display:inline-block;width:10%">
              <i class="fa fa-chevron-left size2" aria-hidden="true"></i>
            </div>
            <div style="padding:5px;text-align:right">
              <button @click="deviceModePop = true" class="TypeSelect White" v-if="show.deviceModeShow">{{this.deviceModeCurName}}</button><!-- 背包模式 -->
              <button @click="deviceTypePop = true" class="TypeSelect White">{{this.deviceTypeCurName}}</button><!-- 在线类型 -->
              <button @click="devicePrefixPop = true" class="TypeSelect White" v-if="user.userGroup==ADMIN">{{this.devicePrefixCurName}}</button><!-- 用户组 -->
            </div>
          </div>
          <div class="deviceListDiv">
            <template v-for="(item,i) in deviceListShow">
              <div class="listChannel" @click="changeActiveDevice(item)" :class="[!!ActiveDevice?(ActiveDevice.dev_name == item.dev_name && ActiveDevice.rcv_name == item.rcv_name && ActiveDevice.board_id == item.board_id ? 'activeChanel' : ''):'']">
                <div class="status">
                  <span class="statusCircle" :class="[item.statusCircle]">
                    <span class="sk-bounce1"></span>
                  </span>
                </div>
                <div class="rate">
                  <div v-if="item.dev_push_status!='0'"><!-- 背包工作中 -->
                    <div v-if="item.WorkMode =='1'"><!-- 拉流模式 -->
                      <span class="speedStyle" style="color:#00fcfc">{{ (+item.SrtKbps / 1000).toFixed(3) }}</span>  
                    </div>
                    <div v-else-if="item.WorkMode =='2'"><!-- 互动 -->
                      <span class="speedStyle" style="color:#FFFF00">{{ (+item.dev_push_br / 1000).toFixed(3) }}</span>
                      <span class="speedStyle" style="color:#22aadd">{{ (+item.rcv_br / 1000).toFixed(3) }}</span>
                      <span class="speedStyle" style="color:#f5222d" v-if="item.TotalLossRate && item.TotalLossRate!=0" >{{ (+item.TotalLossRate / 10).toFixed(1) + '%' }}</span>  
                    </div>
                    <div v-else><!-- 推流 -->
                      <span class="speedStyle" style="color:#FFFF00">{{ (+item.dev_push_br / 1000).toFixed(3) }}</span>
                      <span class="speedStyle" style="color:#22aadd" v-if="item.PushTsType!=1">{{ (+item.rcv_br / 1000).toFixed(3) }}</span><!-- 单卡推流只显示上传速率 -->
                      <span class="speedStyle" style="color:#f5222d" v-if="item.TotalLossRate && item.TotalLossRate!=0" >{{ (+item.TotalLossRate / 10).toFixed(1) + '%' }}</span>  
                    </div>
                  </div>
                  <div v-else-if="item.pullStart!='0'"><!-- 接收机拉流中 -->
                    <span class="speedStyle" style="color:#22aadd">{{ (+item.rcv_br / 1000).toFixed(3) }}</span>
                  </div>
                  <div v-else class="noSpeedInfo">--</div>
                </div>
                <div class="info">
                  <div>
                    <span class="T">
                      <span class="TCircle" :class="item.TCircleClass"></span>
                      T: {{ item.dev_name }}
                    </span>
                    <span class="R" v-if="item.WorkMode == 2">
                      <span class="RCircle" :class="[item.actDevOnline == 1 ? (item.actDevPush != '0' ? 'red' : 'green') : 'gray']"></span>
                      {{ $t( 'device.103000' ) }}<!-- 互动 -->: {{ item.actDevName }}
                    </span>
                    <span v-else>
                      <span class="R">
                        <span class="RCircle" :class="item.RCircleClass"></span>
                        R: {{ item.rcv_name }}
                      </span>
                      <span class="B" v-if="item['board_online'] && item['board_id'].length != 10">
                        <span class="BCircle" :class="item.BCircleClass"></span>
                        B: {{ item.board_id*1+1 }}
                      </span>
                    </span>
                  </div>
                </div>
                <div class="tag" @click.stop="showDevStatus(item.dev_sn)">
                  <i class="fa fa-tags" :class="item.infoStatus" aria-hidden="true"></i>
                </div>
              </div>
            </template>
          </div>
        </div>
      </mt-popup>
      <mt-popup v-model="deviceTypePop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop">
        <span class="chevronDown" @click.stop="deviceTypePop=false">
          <i class="fa fa-chevron-down"></i>
        </span>
        <mt-radio
          v-model="deviceType"
          :options="deviceTypeOptions"
          @change="changeDeviceType">
        </mt-radio>
      </mt-popup>
      <mt-popup v-model="devicePrefixPop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop devicePrefixFilterPop">
        <span class="chevronDown" @click.stop="devicePrefixPop=false">
          <i class="fa fa-chevron-down"></i>
        </span>
        <mt-checklist
          v-model="devicePrefix"
          :options="this.allPrefix"
          @change="changeDevicePrefix">
        </mt-checklist>
      </mt-popup>
      <mt-popup v-model="deviceModePop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop">
        <span class="chevronDown" @click.stop="deviceModePop=false">
          <i class="fa fa-chevron-down"></i>
        </span>
        <mt-radio
          v-model="deviceModeSelect"
          :options="deviceModeOptions"
          @change="changeDeviceMode">
        </mt-radio>
      </mt-popup>
      <mt-popup v-model="popupTagsVisible" position="right" popup-transition="popup-slide">
        <div class="back" @click="closeDevStatus">
          <i class="fa fa-arrow-left" aria-hidden="true"></i>
          {{$t('device.103001')}}<!-- 背包状态 -->
        </div>
        <div class="devStatusDiv">
          <mt-cell :title="$t('device.103001')"><!-- 序列号 -->
            <span>{{status.devSn_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103002')"><!-- 温度 -->
            <span>{{status.IntTemp}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103003')"><!-- 内部电池 -->
            <span :class="status.battery1"></span>
          </mt-cell>
          <mt-cell :title="$t('device.103004')" v-if="show.extBattery"><!-- 外部电池 -->
            <span :class="status.battery2"></span>
          </mt-cell>
          <mt-cell :title="$t('device.103005')"><!-- GPS锁定 -->
            <span>{{status.gpsStatus}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103006')"><!-- 输入分辨率 -->
            <span>{{status.resolution_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103007')"><!-- 输出分辨率 -->
            <span>{{status.OutputFormat}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103008')"><!-- 工作状态 -->
            <span :style="{color:status.work_str_style}">{{status.work_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103009')"><!-- 延时(s) -->
            <span>{{status.delay_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103010')"><!-- 视频输入 -->
            <span>{{status.videoInput_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103011')"><!-- 视频比特率 -->
            <span>{{status.videoBr_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103012')"><!-- 视频编码 -->
            <span>{{status.videoEnc_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103013')"><!-- 音频输入 -->
            <span>{{status.audioInput_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103014')"><!-- 音频编码 -->
            <span>{{status.audioEnc_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103015')"><!-- 音频比特率 -->
            <span>{{status.audioBitrate_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103016')"><!-- 码率控制 -->
            <span>{{status.bitrateMode_str}}</span>
          </mt-cell>
          <mt-cell :title="$t('device.103017')"><!-- 流量总计 -->
            <span>{{status.TotalSendPktStr}}</span>
          </mt-cell>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_ACTIVE_DEVICE,SET_DEVICE_TYPE_SELECT,SET_DEVICE_MODE_SELECT,SET_DEVICE_PREFIX_SELECT,SET_PARAM_LOCK_ACK,SET_PARAM_LOCK,SET_LOCK_USERID,SET_RCV_TAB_SHOW_FLG,SET_MONITOR_TAB_SHOW_FLG } from '../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "Device",
    props:{
    	page:String
    },
    data(){
      return{
        curDevSeries:"",
        SUPER:SUPER,
        ADMIN:ADMIN,
        NORMAL:NORMAL,
        popupVisible:false,
        popupTagsVisible:false,
        lockDisable:false,
        defaultFlg:false, //默认列表过滤状态
        TCircleClass:"",
        RCircleClass:"",
        BCircleClass:"",
        deviceList:[/*{online:'',dev_sn:"",dev_name:"",dev_push_status:"",rcv_online:"",rcv_name:""}*/],
        active:{},
        //当前选中设备的相关参数
        deviceListShow:[],
        //deviceType:"1",
        pageType:this.page?this.page:'dev',
        /*hasRcvRight:this.hasRcvRight,*/
        //用户组
        devicePrefixPop:false,
        allPrefix:[],
        devicePrefix:"",
        devicePrefixCurName:this.$t('device.103019')/*"用户组"*/,
        //设备在线类型
        deviceTypePop: false,
        deviceType:"",
        deviceTypeCurName:"",
        deviceTypeOptions: [{label: this.$t('device.103020'),value: '1'},/*'全部背包'*/
                            {label: this.$t('device.103021'),value: '2'},/*'直播背包'*/
                            {label: this.$t('device.103022'),value: '3'},/*'在线背包'*/
                            {label: this.$t('device.103023'),value: '4'},/*'离线背包'*/
                            {label: this.$t('device.103024'),value: '5'}],/*'在线接收机'*/
        //背包模式
        deviceModePop:false,
        deviceModeSelect:"allMode",
        deviceModeCurName:"",
        deviceModeOptions: [{label: this.$t('device.103025'),value: 'allMode'},/*'全部模式'*/
                            {label: this.$t('device.103026'),value: '0'},/*'推流模式'*/
                            {label: this.$t('device.103027'),value: '1'},/*'拉流模式'*/
                            {label: this.$t('device.103028'),value: '2'}],/*'互动模式'*/
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
          TotalSendPktStr:"",
        },
        interval:{
          getParam:"",
        },
        show:{
          extBattery:false,
          deviceModeShow:true,
        },
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice','deviceTypeSelect',/*'deviceModeSelect',*/'devicePrefixSelect','paramLockAck','paramLock','lockUserId','rcvTabShowFlg'])
    },
    activated(){
      var that = this;
      that.initFilter();
      if(localStorage.deviceTimer){
        clearInterval(localStorage.deviceTimer);  
      }
      localStorage.deviceTimer = setInterval(function(){
        that.getDeviceList();
      },1000);
      that.deviceType = that.deviceTypeSelect;
      //that.deviceMode = that.deviceModeSelect;
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.deviceTimer);
    },
    methods:{
      ...mapMutations({
        SET_ACTIVE_DEVICE,
        SET_DEVICE_TYPE_SELECT,
        SET_DEVICE_MODE_SELECT,
        SET_DEVICE_PREFIX_SELECT,
        SET_PARAM_LOCK_ACK,
        SET_PARAM_LOCK,
        SET_LOCK_USERID,
        SET_RCV_TAB_SHOW_FLG,
        SET_MONITOR_TAB_SHOW_FLG
      }),
      backToActivePage(){
        if(this.deviceListShow.length == 0){
          this.$toast({
            message: this.$t('device.103029')/*'请重新选择'*/
          });
        }else{
          this.popupVisible=false;
        }
      },
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
        this.status.TotalSendPktStr = "";
        this.show.extBattery = false;
      },
      showDevStatus(devSn){
        this.curDevSeries = this.$global.getDevSeries(devSn);
        this.popupTagsVisible = true;
        //定时刷新设备参数 500ms
        this.startTimerParam(devSn,500);
      },
      //启动定时器刷新参数
      startTimerParam(devSN,ms) {
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
            that.initDevState(res,devSn)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      initDevState(res,devSn){
        var that = this;
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
          workStr = this.$t('device.103030')/*'待机'*/;
          workStrColor = '#00FF00';
          if(res.data[0]["OffLinePushEnable"] == '1'){
            workStr = this.$t('device.103031')/*'文件离线回传中'*/;
            workStrColor = '#FF0000';
          }
          else{
            if(res.data[0]["dev_push_status"] == '1'){
              workStr = this.$t('device.103032')/*'直播中'*/;
              workStrColor = '#FF0000';
              if(res.data[0]["record"] == '1'){
                workStr += this.$t('device.103033')/*' 录制中'*/;
              }
            }
            else if(res.data[0]["record"] == '1'){
              workStr = this.$t('device.103033')/*'录制中'*/;
              workStrColor = '#00FF00';
            }
          }
        }
        else{
          workStr = this.$t('device.103034')/*'离线'*/;
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
        if(this.curDevSeries == "1080"){
          latency_text = "";
        }
        this.status.delay_str = res.data[0]["dev_delay"] / 1000 + "s " + latency_text;
        //视频比特率
        this.status.videoBr_str = res.data[0]["dev_sr"] / 1000 + "Mbps";
        //视频编码
        var videoEncodeStr = "";
        var videoEncodeOption = this.$global.getDevParamRange(devSn,that.user.prefix,'video_encode')
        for (var i = 0; i < videoEncodeOption.length; i++) {
          if (videoEncodeOption[i]["value"] == res.data[0]["video_encode"]) {
            videoEncodeStr = videoEncodeOption[i]["text"];
          }
        }
        this.status.videoEnc_str = videoEncodeStr;
        //音频编码
        var audio_encode_text = "";
        for (var i = 0; i < this.$global.OPTIONS_AUDIO_ENCODE_4000.length; i++) {
          if (this.$global.OPTIONS_AUDIO_ENCODE_4000[i]["value"] == res.data[0]["AudioEnc"]) {
            audio_encode_text = this.$global.OPTIONS_AUDIO_ENCODE_4000[i]["text"];
          }
        }
        this.status.audioEnc_str = audio_encode_text;
        //音频比特率
        this.status.audioBitrate_str = res.data[0]["AudioBitrate"]+'kbps';
        //视频输入
        var video_input_text = "";
        var videoInputOption = this.$global.getDevParamRange(devSn,that.user.prefix,'video_input')
        for (var i = 0; i < videoInputOption.length; i++) {
          if (videoInputOption[i]["value"] == res.data[0]["video_input"]) {
            video_input_text = videoInputOption[i]["text"];
          }
        }
        this.status.videoInput_str = video_input_text;
        //音频输入
        var audio_input_text = "";
        for (var i = 0; i < this.$global.OPTIONS_AUDIOINPUT_4000.length; i++) {
          if (this.$global.OPTIONS_AUDIOINPUT_4000[i]["value"] == res.data[0]["audio_input"]) {
            audio_input_text = this.$global.OPTIONS_AUDIOINPUT_4000[i]["text"];
          }
        }
        this.status.audioInput_str = audio_input_text;
        //码率控制
        var bitrateMode_text = "";
        for (var i = 0; i < this.$global.OPTIONS_BITRATEMODE.length; i++) {
          if (this.$global.OPTIONS_BITRATEMODE[i]["value"] == res.data[0]["bitrate_mode"]) {
            bitrateMode_text = this.$global.OPTIONS_BITRATEMODE[i]["text"];
          }
        }
        this.status.bitrateMode_str = bitrateMode_text;
        //流量总计
        this.status.TotalSendPktStr = res.data[0].TotalSendPktStr;
        /*if (localStorage.mobileShow != "true") {
          $("#backpackStatus").css('overflow-y', 'auto');
        }*/
      },
      changeDeviceMode(){
        var that = this;
        that.SET_DEVICE_MODE_SELECT(that.deviceModeSelect);
        that.formatDeviceModeName();
      },
      changeDeviceType(){
        var that = this;
        that.SET_DEVICE_TYPE_SELECT(that.deviceType);
        that.formatDeviceTypeName();
        if(that.deviceType == 5){//接收机
          this.show.deviceModeShow = false;
        }else{
          this.show.deviceModeShow = true;
        }
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
          }else if(selectPrefix.length == 0){
            selectPrefix = ["all"];
          }
          that.devicePrefix = selectPrefix;  
        } 
        that.SET_DEVICE_PREFIX_SELECT(that.devicePrefix.join(","));
      },
      formatDeviceTypeName(){
        var that = this;
        that.deviceType = that.deviceTypeSelect;
        if(that.deviceType == 5){//接收机
          this.show.deviceModeShow = false;
        }else{
          this.show.deviceModeShow = true;
        }
        for(let i=0; i<that.deviceTypeOptions.length; i++){
          if(that.deviceTypeOptions[i].value == that.deviceType){
            that.deviceTypeCurName = that.deviceTypeOptions[i].label;
            break;
          }
        }
      },
      formatDeviceModeName(){
        var that = this;
        //that.deviceMode = that.deviceModeSelect;
        for(let i=0; i<that.deviceModeOptions.length; i++){
          if(that.deviceModeOptions[i].value == that.deviceModeSelect){
            that.deviceModeCurName = that.deviceModeOptions[i].label;
            break;
          }
        }
      },
      initFilter(){
        var that = this;
        that.formatDeviceTypeName();
        that.$global.getChildGrpArr(that.user.prefix, that.formatPrefix);
        //that.formatDeviceModeName();
      },
      formatPrefix(data){
        var that = this;
        var arr = [{"label":this.$t('global.109000')/*"全部"*/,"value":"all"},{"label":this.$t('global.109001')/*"无"*/,"value":"none"}];
        for(let i=0; i<data.length; i++){
          arr.push({"label":data[i]["prefix_name"],"value":data[i]["prefix"]})
        }
        that.allPrefix = arr;
        that.devicePrefix = that.devicePrefixSelect.split(",");
        if(document.body.clientHeight*1 <= that.allPrefix.length*48){
          $(".devicePrefixFilterPop").css('height','100%')
        }else{
          $(".devicePrefixFilterPop").css('height','auto')
        }
      },
      //更新当前设备参数
      refreshCurDevParam(datas){
        this.SET_ACTIVE_DEVICE(datas);
        this.getDevLockStatus();
        var curDevSeries = this.$global.getDevSeries(datas.dev_sn);
        var curRcvSeries = this.$global.getRcvSeries(datas.rcv_sn);
        var actRcv = this.$global.getRcvMode(datas.rcv_sn.substr(-4)) == 'DV4004R' ? true:false;
        var WorkMode = datas.WorkMode;
        var PushTsType = datas.PushTsType;
        if(!curRcvSeries){//没配接收机不显示接收机tab
        	this.SET_RCV_TAB_SHOW_FLG(false);
        }else{
        	this.SET_RCV_TAB_SHOW_FLG(true);
        	if(curDevSeries == "1080"){
        		if(WorkMode != 0){/*拉流互动不显示接收机tab*/
		          this.SET_RCV_TAB_SHOW_FLG(false);
		        }else{
		          if(curRcvSeries!=false && curRcvSeries!=VIR_RCV){//没有配对或者配了虚拟接收机不显示接收机页面,即只有实体接收机显示接收机页面
		            this.SET_RCV_TAB_SHOW_FLG(true);
		          }else{
		            this.SET_RCV_TAB_SHOW_FLG(false);
		          }
		        }		
        	}else if(curDevSeries == "4000"){
        		this.SET_RCV_TAB_SHOW_FLG(true);
        	}
        }
        
        if(datas.rcv_sn != ""){//只要配对了都显示监控
          this.SET_MONITOR_TAB_SHOW_FLG(true);
          /*if(curDevSeries == "4000"){
            if(actRcv){//互动接收机不显示监控
              this.SET_MONITOR_TAB_SHOW_FLG(false);
            }else{
              this.SET_MONITOR_TAB_SHOW_FLG(true);
            }
          }else if(curDevSeries == "1080"){
            if(WorkMode==0 && PushTsType==0){//推流模式，多卡汇聚显示监控
              this.SET_MONITOR_TAB_SHOW_FLG(true);
            }else{
              this.SET_MONITOR_TAB_SHOW_FLG(false);
            }
          }*/
        }else{//没有配对不显示监控页面
          this.SET_MONITOR_TAB_SHOW_FLG(false);
        }
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
            prefixType: that.devicePrefix.join(","),//that.user.prefix
            fliter: that.getDeviceFliter(that.defaultFlg)
          }),
          Api:"getDevAndMatch",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.deviceList = res.data;
            var len = that.deviceList.length;
            for(var j=0; j<len; j++){
              var row = that.deviceList[j];
              //汇聚模式背包汇聚都上线或单卡模式
              if (row.match_used == '1' 
                || (that.$global.getDevSeries(row.dev_sn) == "1080" && row.PushTsType == 1 )) {
                if (row.dev_push_status != '0') {
                  row.statusCircle = 'sk-spinner sk-spinner-three-bounce';
                }else{
                  row.statusCircle = 'green';
                }
              } else {
                row.statusCircle = 'gray';
              }
              row.TCircleClass = 'gray';
              row.RCircleClass = 'gray';
              if (row.online == '1') {
                if (row.videoInput !== 'NO INPUT') {
                  row.TCircleClass = 'green';
                }else{
                  row.TCircleClass = 'noInputColor';
                }
                if (row.dev_push_status != '0') {
                  row.TCircleClass = 'red';
                }
              }
              if (row.rcv_online == '1') {
                row.RCircleClass = 'green';
                if ((row.dev_push_status != '0' && row.WorkMode == '0' && row.PushTsType != '1') || row.pullStart != '0') {
                  row.RCircleClass = 'red';
                }
              } else if (row.rcv_online == '0') {
                row.RCircleClass = 'gray';
              }
              if (row.board_online && row.board_online != '0') {
                row.BCircleClass = 'green';
                if ((row.dev_push_status != '0' && row.WorkMode == '0' && row.PushTsType != '1') || row.pullStart != '0') {
                  row.BCircleClass = 'red';
                }
              } else if (row.board_online && row.board_online == '0') {
                row.BCircleClass = 'gray';
              }


              if(that.ActiveDevice 
                && (row["dev_sn"] == that.ActiveDevice["dev_sn"] && row["dev_sn"]!="")){
                that.refreshCurDevParam(row);
                that.TCircleClass = 'gray';
                if (row.online == '1') {
                  if (row.videoInput !== 'NO INPUT') {
                    that.TCircleClass = 'green';
                  }else{
                    that.TCircleClass = 'noInputColor';
                  }
                  if (row.dev_push_status != '0') {
                    that.TCircleClass = 'red';
                  }
                }
              }else if(row["dev_sn"] == ""){
                that.TCircleClass = 'gray';
                that.RCircleClass = 'gray';
                that.BCircleClass = 'gray';
                if (row.rcv_online == '1') {
                  that.RCircleClass = 'green';
                  if ((row.dev_push_status != '0' && row.WorkMode == '0' && row.PushTsType != '1') || row.pullStart != '0') {
                    that.RCircleClass = 'red';
                  }
                } else if (row.rcv_online == '0') {
                  that.RCircleClass = 'gray';
                }
                if (row.board_online && row.board_online != '0') {
                  that.BCircleClass = 'green';
                  if ((row.dev_push_status != '0' && row.WorkMode == '0' && row.PushTsType != '1') || row.pullStart != '0') {
                    that.BCircleClass = 'red';
                  }
                } else if (row.board_online && row.board_online == '0') {
                  that.BCircleClass = 'gray';
                }

              }
              //在线且没在充电中，才显示电池电量低
              var online = row.online;
              var fextBat = that.formatExtBat(row.ExtBat);
              var extBat = fextBat["exBat"];
              var fintBat = that.formatIntBat(row.IntBat);
              var intBat = fintBat["inBat"];
              //在线,有可能显示电池电量低
              if (online == 1){
                if(extBat == "nonexistent" 
                  && row.IntBat.indexOf("CHARGING") == -1 
                  && intBat <= 40){
                  //无外电池、无充电、内电池电量低
                  row["infoStatus"] = "infoRed";
                }else if(extBat != "nonexistent" && extBat<=40){
                  //有外电池，外电池电量低
                  row["infoStatus"] = "infoRed";
                }else{
                  row["infoStatus"] = "infoGreen";
                }
              } else {
                row["infoStatus"] = "infoGray";
              }
            }

            that.filterDevice();
            if(that.deviceList.length == 0){
              that.defaultFlg = true;
            }else{
              if(!that.ActiveDevice){
                that.SET_ACTIVE_DEVICE(that.deviceListShow[0]); 
                //that.deviceModeSelect = that.deviceListShow[0]["WorkMode"];
              }else{//存了ActiveDevice
                var devExist = false;
                for(var i=0; i<that.deviceList.length; i++){
                  if(that.deviceList[i]["dev_sn"] == that.ActiveDevice["dev_sn"] 
                    && that.deviceList[i]["rcv_sn"] == that.ActiveDevice["rcv_sn"]
                    && that.deviceList[i]["dev_push_status"] == that.ActiveDevice["dev_push_status"]){
                    devExist = true;
                  }
                }
                if(!devExist && that.deviceListShow.length!=0){//ActiveDevice不在设备列表中
                  that.SET_ACTIVE_DEVICE(that.deviceListShow[0]); 
                }
              }
              /*for(var i=0; i<that.deviceList.length; i++){
                if(that.deviceList[i]["dev_sn"] == that.ActiveDevice["dev_sn"]){
                  that.refreshCurDevParam(that.deviceList[i]);
                }
              }*/
              //that.getDevLockStatus();
            }
          }else{
            that.deviceList = [];
          }
          that.formatDeviceModeName();
        })
        .catch(function (error) {
          console.log(error);
        })
      },
      formatIntBat(inBat){
        var fIntBat = {"inBat":"","suffix":"","prefix":""};
        if (inBat) {
          if (inBat.indexOf("CHARGING") != -1) {
            fIntBat.inBat = inBat.split("(")[1].split(")")[0].split("%")[0];
            fIntBat.suffix = "_charge";
          } else if(inBat.indexOf("CHARGED") != -1){
            fIntBat.inBat = 100;
            fIntBat.suffix = "_charge";
          } else {
            fIntBat.inBat = inBat.split("%")[0];
          }
        }
        if (fIntBat.inBat >= 80) {
          fIntBat.prefix = "_100";
        } else if (fIntBat.inBat >= 60) {
          fIntBat.prefix = "_80";
        } else if (fIntBat.inBat >= 40) {
          fIntBat.prefix = "_60";
        } else if (fIntBat.inBat >= 20) {
          fIntBat.prefix = "_40";
        } else if (fIntBat.inBat >= 10) {
          fIntBat.prefix = "_20";
        } else {
          fIntBat.prefix = "_0";
        }  
        return fIntBat;
      },
      formatExtBat(exBat){
        var fExtBat = {"exBat":"","suffix":"","prefix":""};
        if (exBat) {
          if (exBat.indexOf("CHARGING") != -1) {
            fExtBat.exBat = exBat.split("(")[1].split(")")[0].split("%")[0];
            fExtBat.suffix = "_charge";
          } else if(exBat == "---"){
            fExtBat.exBat = "nonexistent";
          } else {
            fExtBat.exBat = exBat.split("%")[0];
          }
        }
        if(fExtBat.exBat == "nonexistent"){
        }else{
          if (fExtBat.exBat >= 80) {
            fExtBat.prefix = "_100";
          } else if (fExtBat.exBat >= 60) {
            fExtBat.prefix = "_80";
          } else if (fExtBat.exBat >= 40) {
            fExtBat.prefix = "_60";
          } else if (fExtBat.exBat >= 20) {
            fExtBat.prefix = "_40";
          } else if (fExtBat.exBat >= 10) {
            fExtBat.prefix = "_20";
          } else {
            fExtBat.prefix = "_0";
          }
        }
        return fExtBat;
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
        if(!this.lockDisable){
          var that = this;
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
        }
      },
      //status页面刷新图表
      /*refreshChart(){
        this.$emit('refreshChart')
      },*/
      //修改接收机锁
      changeRcvLockState(data){
        var that = this;
        var selRcvSn = this.ActiveDevice.rcv_sn;
        var selBoardId = this.ActiveDevice.board_id;
        this.$global.getRcvRights(selRcvSn, selBoardId, function(data) {
          that.hasRcvRight = data[0]["value"].split("_")[3]=="1"?true:false;
          if (that.hasRcvRight && (that.user.userGroup!=NORMAL)) {
              if($("#rcvlockIcon").hasClass("fa-lock")){
                that.$emit('changeRcvLockState',"unlock")
                $("#rcvlockIcon").removeClass("fa-lock").addClass("fa-unlock");
              }else{
                that.$emit('changeRcvLockState',"lock")
                $("#rcvlockIcon").removeClass("fa-unlock").addClass("fa-lock");
              }  
            }
        })
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
        this.refreshCurDevParam(item);
        this.popupVisible = false;
        this.$emit('changeRcvLockState',"lock")
        $("#rcvlockIcon").removeClass("fa-unlock").addClass("fa-lock");
      },
      //获取左侧设备列表的过滤选项
      /*
      * device: dev/praRcv
      * online: 0/1
      * WorkMode:0/1/2
      * dev_push_status:1/2
      * */
      getDeviceFliter(defaultFilter){
        var type = this.deviceTypeSelect.toString();;
        var mode = this.deviceModeSelect.toString();
        //var actGrpId = getCookie('uhd-actGrpId');
        var fliter = {device:'dev',online:'',WorkMode:'',dev_push_status:'',interact_grpid:'',curDevUpdate:true};
        if(defaultFilter){//默认状态
          this.deviceModeSelect = 'allMode';
          this.deviceTypeCurName = this.$t('device.103020')/*'全部背包'*/;
          mode = 'allMode';
          this.deviceType = 1;
          this.SET_DEVICE_TYPE_SELECT(this.deviceType);
          type = 1;
          this.deviceModeCurName = this.$t('device.103025')/*'全部模式'*/;
          
          /*fliter['online'] = '';
          fliter['device'] = 'dev';
          fliter['WorkMode'] = '';
          return filter;*/
        }
        if(type == '5'){
          //实体接收机
          fliter['online'] = '1';
          fliter['device'] = 'praRcv';
          fliter['WorkMode'] = '0';
        }else{//背包
          fliter['device'] = 'dev';
          //在线状态
          if(type === '3'){//在线
            fliter['online'] = '1';
          } else if (type === '4'){//离线
            fliter['online'] = '0';
          } else if (type === '2'){//直播
            fliter['online'] = '1';
            fliter['dev_push_status'] = '!=0';
          } else if (type === '1'){//全部
            fliter['online'] = '';
          }
          //工作模式
          if(mode === '0'){
            fliter['WorkMode'] = '0';
          } else if(mode === '1'){
            fliter['WorkMode'] = '1';
          } else if(mode === '2'){
            fliter['WorkMode'] = '2';
          } else if(mode === 'allMode'){
            fliter['WorkMode'] = '';
          }
          //互动组过滤
          /*if(mode === 'actMode' && actGrpId !== 'all'){
            fliter['interact_grpid'] = actGrpId;
          }*/
        }

        return fliter;
      },
      filterDevice(){
        var that = this;
        that.deviceListShow = that.deviceList;
        return;
        var deviceList = this.deviceList;
        var deviceTypeSelect = this.deviceTypeSelect.toString();
        var deviceModeSelect = this.deviceModeSelect.toString();
        switch (deviceTypeSelect){
          case "1":
            that.deviceListShow = that.deviceList;
            break;
          case "2":
            that.deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 1 && (item.dev_push_status == 1 || item.dev_push_status == 2))
            });
            break;
          case "3":
            that.deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 1)
            });
            break;
          case "4":
            that.deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 0)
            });
            break;
          case "5":
            that.deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 1 && item.device == 'praRcv' && item.WorkMode == 0)
            });
            break;
          default:
            that.deviceListShow = that.deviceList;
            break;
        }
        switch (deviceModeSelect){
          case "0":
            that.deviceListShow = that.deviceListShow.filter(function(item){
              return (item.WorkMode == 0)
            });
            break;
          case "1":
            that.deviceListShow = that.deviceListShow.filter(function(item){
              return (item.WorkMode == 1)
            });
            break;
          case "2":
            that.deviceListShow = that.deviceListShow.filter(function(item){
              return (item.WorkMode == 2)
            });
            break;
          default:
            that.deviceListShow = that.deviceListShow;
            break;
        }
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
        z-index: 1000;
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
        overflow-y:auto;
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
        width: 15%;
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
        width: 15%;
        /*padding-top: .08rem;*/
        padding-right:0.15rem;
        display:flex;
    }
    .rate div{
      margin:auto;
    }
    .noSpeedInfo{
      margin: auto 20%; 
      color:#eee
    }
    .speedStyle{
      display: block;
      font-size: .15rem;
      text-align: left;
    }
    .info{
        width: 60%;
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
    .noInputColor{background-color: #FFFA00;}
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
    /*.lock, .refreshIcon, .stateInfo{
      height:100%;
      display:inline-block;
      vertical-align:text-top;
    }*/
    .lock i, .refreshIcon i, .stateInfo i{
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
      color:#fff !important; 
      min-height: 48px !important;
      display: block !important;
    }
</style>
<style>
  .deviceFilterPop .mint-cell-wrapper{
    background-image:linear-gradient(180deg,#000,#000 50%,transparent 0) !important;
    padding:0 10px !important;
    padding-left:10px !important;
  }
  .deviceFilterPop .mint-cell{
    background-color:#3f4551 !important;
    color:#fff !important; 
    min-height: 48px !important;
    display: block !important;
  }
  .devStatusDiv .mint-cell-wrapper{
    padding:0 10px !important;
    background-image: linear-gradient(180deg,#d9d9d9,#d9d9d9 50%,transparent 0) !important;
  }
  .channelList .mint-loadmore-text{color: #FFF;}
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
    background: url("../../assets/img/bat/battery_0.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_20{
    background: url("../../assets/img/bat/battery_20.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_40{
    background: url("../../assets/img/bat/battery_40.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_60{
    background: url("../../assets/img/bat/battery_60.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_80{
    background: url("../../assets/img/bat/battery_80.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_100{
    background: url("../../assets/img/bat/battery_100.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_0_charge{
    background: url("../../assets/img/bat/dc_bat0.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_20_charge{
    background: url("../../assets/img/bat/dc_bat20.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_40_charge{
    background: url("../../assets/img/bat/dc_bat40.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_60_charge{
    background: url("../../assets/img/bat/dc_bat60.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_80_charge{
    background: url("../../assets/img/bat/dc_bat80.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .battery_100_charge{
    background: url("../../assets/img/bat/dc_bat100.png") no-repeat center center;
    background-size: contain;
    width: 40px;
    height: 40px;
  }
  .devStatusDiv .mint-cell-value{
    color:#fff;
  }
  .infoGray{
    color:#c5c5c5;
  }
  .infoGreen{
    color:#00ff00;
  }
  .infoRed{
    color:#ff0000;
  }
  .deviceTypeSelect{
    position: fixed;
    width: 100%;
    background: #000;
    height: .4rem;
  }
  .deviceListDiv{
    height:calc(100% - .4rem);
    margin-top:.4rem;
  }
  .stateInfo{
    color:red;
    margin-left:10px;
  }
  .iconStyle{
    display: flex;
    height: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    float: right;
    margin-right: 10px;
  }
</style>