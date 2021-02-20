<template>
  <div class="settings">
    <Device></Device>
    <div class="Group"><!-- 传输控制 -->
      <div class="GroupTitle" @click="transControlShow=!transControlShow">
        传输控制
        <i class="titleIcon fa" :class="[transControlShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="transControlShow">
          <div class="GroupItem"><!-- 传输IP -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">传输IP</div>
              <div class="GroupItemValue">
                <mt-radio
                  title=""
                  v-model="options.dev_push_ip"
                  :options="RADIO_TRANS_IP"
                  @change="$global.setDeviceParam('dev_push_ip',options.dev_push_ip=='1'?'1':'')">
                </mt-radio>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 录制开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">录制开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.record" @change="$global.setDeviceParam('record',options.record?'1':'0')" :disabled="paramLockAck == '1'?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.prefix==this.PREFIX"><!-- 重传开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">重传开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.ResendMode" @change="$global.setDeviceParam('ResendMode',options.ResendMode?'1':'0')" :disabled="paramLockAck == '1'?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.prefix==this.PREFIX"><!-- 纠错开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">纠错开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.OpenfecMode" @change="$global.setDeviceParam('OpenfecMode',options.OpenfecMode?'1':'0')" :disabled="paramLockAck == '1'?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.prefix==this.PREFIX && this.options.OpenfecMode"><!-- 纠错能力 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">纠错能力</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.OpenfecLevel" @change="$global.setDeviceParam('OpenfecLevel', options.OpenfecLevel)"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_FEC_LEVEL">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 5G模式 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">5G模式</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.Mode5G" @change="$global.setDeviceParam('5GMode', options.Mode5G)"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_NETMODE_PARAMS">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- ETH0 IP -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">ETH0 IP</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.Eth0Type" @change="$global.setDeviceParam('Eth0Type', options.Eth0Type)"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_ETH0_TYPE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 显示别名 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">显示别名</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.DevAliasSwitch" @change="$global.setDeviceParam('DevAliasSwitch',options.DevAliasSwitch?'1':'0')" :disabled="paramLockAck == '1'?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
        </div>
      </transition> 
    </div>
    <div class="Group"><!-- 输入编码 -->
      <div class="GroupTitle" @click="inputEncodeShow=!inputEncodeShow">
        输入编码
        <i class="titleIcon fa" :class="[inputEncodeShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="inputEncodeShow">
          <div class="GroupItem"><!-- 视频输入 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">视频输入</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.video_input" @change="changeVideoInput"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_VIDEOINPUT">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 视频编码 只有H.264-->
            <div class="GroupItemField">
              <div class="GroupItemTitle">视频编码</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.video_encode" @change="changeVideoEncode" :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_VIDEOENCODE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 音频输入 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音频输入</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.audio_input" @change="changeDevParam('audio_input')"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_AUDIOINPUT">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="audioEncodeShow"><!-- 音频编码 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音频编码</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.AudioEnc" @change="changeDevParam('AudioEnc')" :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_AUDIO_ENCODE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 音频比特率 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音频比特率</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.AudioBitrate" @change="changeDevParam('AudioBitrate')" :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_AUDIO_BR">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.prefix == this.PREFIX"><!-- 码率控制 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">码率控制</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.bitrate_mode" @change="changeDevParam('bitrate_mode')" :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_BITRATEMODE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="hdrShow"><!-- HDR设置 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">HDR设置</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.hdr" @change="changeDevParam('hdr')" :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_HDR">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-show="latencyShow"><!-- 时延模式 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">时延模式</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.latency" @change="changeDevParam('latency')" :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_LATENCY">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 编码分辨率 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">编码分辨率</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.HdmiTransFormat" @change="changeDevParam('HdmiTransFormat')" :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_HDMI_FORMAT">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group matchConfig"><!-- 配对设置 -->
      <div class="GroupTitle" @click="matchConfigShow=!matchConfigShow">
        配对设置
        <i class="titleIcon fa" :class="[matchConfigShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="matchConfigShow">
          <div class="GroupItem"><!-- 背包 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">背包</div>
              <div class="GroupItemValue">
                <input type="text" class="" v-model="ActiveDevice.dev_name+'_'+ActiveDevice.dev_sn" style="width: 100%;border: none;background: transparent;margin-top: 0.06rem;" readonly>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 接收机 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">接收机</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.matchRcv" @change="changeMatchRcv"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in options.RcvList">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="boardShow"><!-- 板卡 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">板卡</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.matchBoard" @change=""  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in options.boardList">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if=""><!-- 按钮 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle"></div>
              <div class="GroupItemValue" style="float:right">
                <mt-button class="ItemBtn" type="primary" @click="saveMatch">绑定</mt-button>
                <mt-button class="ItemBtn" style="margin-left:10px;" @click="unbindMatch">解绑</mt-button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group" v-show="false" v-if="this.user.prefix==this.PREFIX"><!-- 互动 -->
      <div class="GroupTitle" @click="activityShow=!activityShow">
        互动
        <i class="titleIcon fa" :class="[activityShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="activityShow">
          <div class="GroupItem"><!-- 日志记录 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">日志记录</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.ArmSenderLogLevel" @change="$global.setDeviceParam('ArmSenderLogLevel',options.ArmSenderLogLevel)"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_LOG_LEVEL">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group"  v-if="this.user.prefix==this.PREFIX"><!-- 日志记录 -->
      <div class="GroupTitle" @click="logShow=!logShow">
        日志记录
        <i class="titleIcon fa" :class="[logShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="logShow">
          <div class="GroupItem"><!-- 日志记录 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">日志记录</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.ArmSenderLogLevel" @change="$global.setDeviceParam('ArmSenderLogLevel',options.ArmSenderLogLevel)"  :disabled="paramLockAck == '1'?false:true">
                  <template v-for="item in OPTIONS_LOG_LEVEL">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER,SET_NAV_STATUS,SET_DEV_PARAM,SET_RCV_PARAM } from '../../../store/mutation-types';
  import Device from '../basic/Device';
  import $ from 'jquery';
  export default {
    name: "Settings",
    data(){
      return{
        transControlShow:true,
        inputEncodeShow:false,
        matchConfigShow:false,
        activityShow:false,
        logShow:false,
        boardShow:false,
        PREFIX : PREFIX,
        RADIO_TRANS_IP : [],
        RADIO_TRANS_MODE : [],
        card_sel_show : false,
        hdrShow : true,
        latencyShow : true,
        audioEncodeShow : true,
        card_sel:[],
        OPTIONS_FEC_LEVEL : [{text: "低",value: "0"}, 
                              {text: "中",value: "1"}, 
                              {text: "高",value: "2"}],
        OPTIONS_AUDIOINPUT : [],//视频输入
        OPTIONS_VIDEOINPUT : [],//音频输入
        OPTIONS_VIDEOENCODE : [],//视频编码
        OPTIONS_BITRATEMODE : [],//码率控制
        OPTIONS_HDMI_FORMAT :[],//编码分辨率
        OPTIONS_AUDIO_ENCODE_ORI:[],
        OPTIONS_AUDIO_ENCODE : [],//音频编码
        OPTIONS_AUDIO_BR : [],//音频比特率
        OPTIONS_LOG_LEVEL : [{text: "OFF",value: "0"}, 
                            {text: "ERROR",value: "1"}, 
                            {text: "INFO",value: "2"},
                            {text: "DEBUG",value: "3"}],
        OPTIONS_NETMODE_PARAMS : [{text: "NSA",value: "0"}, 
                                  {text: "SA",value: "1"}],
        OPTIONS_ETH0_TYPE : [{text: "固定IP地址",value: "0"}, 
                            {text: "自动获取IP地址",value: "1"}],
        OPTIONS_HDR_ORI : [],
        OPTIONS_HDR : [],
        OPTIONS_LATENCY : [],
        options_old_264:{
          audio_input : "",
          AudioEnc : "",
          AudioBitrate : "",
          bitrate_mode : "",
          hdr : "",
          HdmiTransFormat : "",
          latency:"",
        },
        options_old_265:{
          audio_input : "",
          AudioEnc : "",
          AudioBitrate : "",
          bitrate_mode : "",
          hdr : "",
          HdmiTransFormat : "",
          latency:"",
        },
        options:{
          dev_push_ip:'0',//传输IP
          PushTsType:'0',//传输模式
          PushCard : "",//单卡选择
          record:false,//录制开关
          ResendMode:false,//重传开关
          OpenfecMode:false,//纠错开关
          OpenfecLevel:0,//纠错能力
          Mode5G:0,//5G模式
          Eth0Type:0,//Eth0Type
          DevAliasSwitch:false,//显示别名
          
          video_input:'0',//视频输入
          audio_input:'1',//音频输入
          video_encode:'0',//视频编码
          AudioEnc:'0',//音频编码
          AudioBitrate:'256',//音频比特率
          bitrate_mode:'0',//码率控制
          hdr:'',//HDR设置
          latency:'',//时延
          HdmiTransFormat:'1',//编码分辨率
          ArmSenderLogLevel:'0',//日志记录
          //配对设置
          devNameSn:"",
          RcvList:[],
          matchRcv:"",
          boardList:[],
          matchBoard:"",
        }
      }
    },
    components: {
        Device
    },
    computed: {
        ...mapState(['user','navHide','ActiveDevice','ActiveDeviceType','paramLockAck','devParam','rcvParam'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          //$("#sn_str").text(this.ActiveDevice.dev_sn)
          /*if(this.paramLockAck != "1"){
            //this.getDeviceParam();
            this.$global.getDeviceParam(this.formatData)
          }*/
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          this.$global.getDeviceParam(this.formatData)
          this.$global.getRcvList4000(this.formatRcvList);
        }
      },
      '$store.state.paramLockAck':{
        immediate: true,
        handler(val) {
          this.RADIO_TRANS_IP = [{
            label: '内网',
            value: '1',
            disabled: this.paramLockAck == '1'?false:true
          },{
            label: '公网',
            value: '0',
            disabled: this.paramLockAck == '1'?false:true
          }]
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      this.getSelectOptions();
      var that = this;
      localStorage.getSettingParam = setInterval(function(){
        if(that.paramLockAck != "1"){
          that.$global.getDeviceParam(that.formatData)
        }
      },1000)

    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getSettingParam);
    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_NAV_STATUS,
        SET_DEV_PARAM,
        SET_RCV_PARAM
      }),
      chooseIP(val){this.control.ip = val;},
      getSelectOptions(){
        var that = this;
        var dev_sn = that.ActiveDevice.dev_sn;
        var userPrefix = that.user.prefix;
        //视频输入
        that.OPTIONS_VIDEOINPUT = that.$global.getDevParamRange(dev_sn,userPrefix,'video_input');
        //音频编码
        that.OPTIONS_AUDIO_ENCODE_ORI = that.$global.getDevParamRange(dev_sn,userPrefix,'audio_encode');
        //码率控制
        that.OPTIONS_BITRATEMODE = that.$global.getDevParamRange(dev_sn,userPrefix,'bitrate_mode');
        //音频比特率
        that.OPTIONS_AUDIO_BR = that.$global.OPTIONS_AUDIO_BR;
        //HDR设置
        that.OPTIONS_HDR_ORI = that.$global.getDevParamRange(dev_sn,userPrefix,"hdr");
        //时延模式
        that.OPTIONS_LATENCY = that.$global.getDevParamRange(dev_sn,userPrefix,"latency");
         
      },
      formatData(data){
        var that = this;
        console.log("formatData")
        console.log(data)
        /*------------------------传输控制------------------------*/
        //传输IP
        that.options.dev_push_ip = data['dev_push_ip']=="1"?"1":"0";
        //传输模式
        that.options.PushTsType = data['PushTsType'];
        if(data['PushTsType'] == 1){
          that.card_sel_show = true;
        }else{
          that.card_sel_show = false;
        }
        //单卡选择
        that.getDevCardParam(that.formatCardSel);
        //录制开关
        that.options.record = (data['record'] == '1' ? true : false);
        //重传开关
        that.options.ResendMode = (data['ResendMode'] == '1' ? true : false);
        //纠错开关
        if(data['OpenfecMode'] == '1'){
          that.options.OpenfecMode = true;
          /*that.feclevel_show = true;*/
        }else{
          that.options.OpenfecMode = false;
          /*that.feclevel_show = false;*/
        }
        //纠错能力
        that.options.OpenfecLevel = data['OpenfecLevel'];
        //5G模式
        that.options.Mode5G = data['5GMode'];
        //ETH0 IP
        that.options.Eth0Type = data['Eth0Type'];
        //显示别名
        that.options.DevAliasSwitch = (data['DevAliasSwitch'] == '1' ? true : false );
        
        /*------------------------输入编码------------------------*/
        //视频输入
        that.options.video_input = data['video_input'];
        that.changeVideoInput(data);
        /*if(that.options.video_encode == '4'){
          that.formatVideoEncode264();
        }else{
          that.formatVideoEncode265();
        }*/
        //视频输入
        that.options.audio_input = data['audio_input'];
        //音频编码
        that.options.AudioEnc = data['AudioEnc'];
        //音频比特率
        that.options.AudioBitrate = data['AudioBitrate'];
        //码率控制
        that.options.bitrate_mode = data['bitrate_mode'];
        //hdr设置
        that.options.hdr = data['hdr'];
        //时延模式
        that.options.latency = data['latency'];
        //编码分辨率
        that.options.HdmiTransFormat = data['HdmiTransFormat'];

        if(that.options.video_encode == '4'){
          //视频输入
          that.options_old_264.audio_input = data['audio_input'];
          //音频编码
          that.options_old_264.AudioEnc = data['AudioEnc'];
          //音频比特率
          that.options_old_264.AudioBitrate = data['AudioBitrate'];
          //码率控制
          that.options_old_264.bitrate_mode = data['bitrate_mode'];
          //hdr设置
          that.options_old_264.hdr = data['hdr'];
          //编码分辨率
          that.options_old_264.HdmiTransFormat = data['HdmiTransFormat'];

          //切换视频编码时做的初始化工作
          //视频输入
          that.options_old_265.audio_input = that.OPTIONS_AUDIOINPUT[0].value;
          //音频编码
          that.options_old_265.AudioEnc = that.OPTIONS_AUDIO_ENCODE[0].value;
          //音频比特率
          that.options_old_265.AudioBitrate = that.OPTIONS_AUDIO_BR[0].value;
          //码率控制
          that.options_old_265.bitrate_mode = that.OPTIONS_BITRATEMODE[0].value;
          //hdr设置
          that.options_old_265.hdr = that.OPTIONS_HDR[0].value;
          //编码分辨率
          that.options_old_265.HdmiTransFormat = that.OPTIONS_HDMI_FORMAT[0].value;
          //时延
          that.options_old_265.latency = that.OPTIONS_LATENCY[0].value;
        }else{
          //视频输入
          that.options_old_265.audio_input = data['audio_input'];
          //音频编码
          that.options_old_265.AudioEnc = data['AudioEnc'];
          //音频比特率
          that.options_old_265.AudioBitrate = data['AudioBitrate'];
          //码率控制
          that.options_old_265.bitrate_mode = data['bitrate_mode'];
          //hdr设置
          that.options_old_265.hdr = data['hdr'];
          //编码分辨率
          that.options_old_265.HdmiTransFormat = data['HdmiTransFormat'];
          //时延
          that.options_old_265.latency = data['latency'];
          //切换视频编码时做的初始化工作
          //视频输入
          that.options_old_264.audio_input = that.OPTIONS_AUDIOINPUT[1].value;
          //音频编码
          that.options_old_264.AudioEnc = that.OPTIONS_AUDIO_ENCODE[0].value;
          //音频比特率
          that.options_old_264.AudioBitrate = that.OPTIONS_AUDIO_BR[0].value;
          //码率控制
          that.options_old_264.bitrate_mode = that.OPTIONS_BITRATEMODE[0].value;
          //hdr设置
          that.options_old_264.hdr = that.OPTIONS_HDR[0].value;
          //编码分辨率
          that.options_old_264.HdmiTransFormat = that.OPTIONS_HDMI_FORMAT[0].value;
          //时延
          that.options_old_265.latency = that.OPTIONS_LATENCY[0].value;
        }
        /*------------------------配对设置------------------------*/
        //that.options.devNameSn = that.ActiveDevice.dev_name + "_" + that.ActiveDevice.dev_sn;
        /*------------------------日志记录------------------------*/

        //日志等级
        that.options.ArmSenderLogLevel = data['ArmSenderLogLevel'];
        
        return data;
      },
      formatVideoEncode264(){
        console.log("formatVideoEncode264");
        var that = this;
        //音频输入  只支持2-CH
        that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264;
        //音频编码  AAC
        that.OPTIONS_AUDIO_ENCODE = that.OPTIONS_AUDIO_ENCODE_ORI.filter(function(item){
          return (item.value == '0')
        })
        //音频比特率 256 128 64kbps
        //码率控制  CBR VBR
        //HDR设置 SDR
        that.OPTIONS_HDR = that.OPTIONS_HDR_ORI.filter(function(item){
          return (item.value=='0');
        })
        //时延模式  隐藏，设置成标准时延
        that.latencyShow = false;
        that.options.latency = 0;
        //编码分辨率 显示全部选项
        that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT

        //赋值上次对应参数
        //视频输入
        that.options.audio_input = that.options_old_264.audio_input;
        //音频编码
        that.options.AudioEnc = that.options_old_264.AudioEnc;
        //音频比特率
        that.options.AudioBitrate = that.options_old_264.AudioBitrate;
        //码率控制
        that.options.bitrate_mode = that.options_old_264.bitrate_mode;
        //hdr设置
        that.options.hdr = that.options_old_264.hdr;
        //编码分辨率
        that.options.HdmiTransFormat = that.options_old_264.HdmiTransFormat;
        
      },
      formatVideoEncode265(){
        console.log("formatVideoEncode265");
        var that = this;
        //音频输入  0 2 4
        that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT;
        //音频编码  AAC LPCM MPRG1L2(对用户组还有区分)
        that.OPTIONS_AUDIO_ENCODE = that.OPTIONS_AUDIO_ENCODE_ORI;
        //音频比特率 256 128 64 
        //码率控制  CBR VBR 
        //HDR设置 SDR HLG
        that.OPTIONS_HDR = that.OPTIONS_HDR_ORI
        //时延模式  标准时延 超低时延
        that.latencyShow = true;
        //编码分辨率 只支持自动
        that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT.filter(function(item){
          return (item.value == 0)
        });

        //赋值上次对应参数
        //视频输入
        that.options.audio_input = that.options_old_265.audio_input;
        //音频编码
        that.options.AudioEnc = that.options_old_265.AudioEnc;
        //音频比特率
        that.options.AudioBitrate = that.options_old_265.AudioBitrate;
        //码率控制
        that.options.bitrate_mode = that.options_old_265.bitrate_mode;
        //hdr设置
        that.options.hdr = that.options_old_265.hdr;
        //编码分辨率
        that.options.HdmiTransFormat = that.options_old_265.HdmiTransFormat;
        //时延模式
        that.options.latency = that.options_old_265.latency;
      },
      changeVideoInput(data){
        var that = this;
        var video_encode_option =  that.$global.getDevParamRange(that.ActiveDevice.dev_sn,that.user.prefix,'video_encode');
        if(that.options.video_input == '4'){//视频编码为HDMI 只支持H.264
          that.OPTIONS_VIDEOENCODE = video_encode_option.filter(function(item){
            return (item.value == '4');
          })
          if(that.OPTIONS_VIDEOENCODE.length == 0){
            that.OPTIONS_VIDEOENCODE = [{value: "4",text: "H.264"}];
          }
          that.options.video_encode = '4';
        }else{
          that.OPTIONS_VIDEOENCODE = video_encode_option;
          if(data)
            that.options.video_encode = data["video_encode"];
        }
        that.$global.setDeviceParam('video_input', that.options.video_input);
        that.changeVideoEncode();
      },
      changeVideoEncode(){
        console.log("changeVideoEncode")
        var that = this;
        if(that.options.video_encode == '4'){
          that.formatVideoEncode264();
        }else{
          that.formatVideoEncode265();
        }
        that.$global.setDeviceParam('video_encode',that.options.video_encode);
      },
      //修改参数并做本地数据保存，切换264.265时，进行对应参数保存
      changeDevParam(paramType){
        console.log("changeDevParam")
        console.log(paramType)
        var that = this;
        that.$global.setDeviceParam(paramType,that.options[paramType]);
        if(that.options.video_encode == "4"){//264
          console.log("264")
          that.options_old_264[paramType] = that.options[paramType];
        }else{
          that.options_old_265[paramType] = that.options[paramType];
        }
      },
      
      //格式化单卡选择
      formatCardSel(data){
        var cardSel = [];
        var cardSelObj = {};
        for(let i=0; i<data.length; i++){
          cardSelObj = {};
          if(data[i]["online"] == "1"){
            cardSelObj.text = data[i]["card_name"];
            cardSelObj.value = data[i]["card_id"];
            cardSel.push(cardSelObj);
          }
        }
        if(cardSel.length == 0){
          cardSel = [{"text":"无可用网卡","value":""}]  
        }
        this.card_sel = cardSel;
      },
      getDevCardParam(cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevCardParam:true,
            devSN: that.ActiveDevice.dev_sn
          }),
          Api:"getDevCardParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(cb){
              cb(res.data[0]);
            }
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            }); 
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //改变传输模式
      changeTransMode(){
        console.log("changeTransMode")
        if(this.options.PushTsType == "1"){
          this.card_sel_show = true;
        }else{
           this.card_sel_show = false;
        }
        this.$global.setDeviceParam('dev_push_mode',this.options.PushTsType?'1':'0')
      },
      //配对设置
      formatRcvList(data){
        console.log("formatRcvList")
        var that = this;
        var result = [];
        //判断是否有当前配对的接收机的权限
        var bFind = false;
        if (data.length == 0) {//无可用接收机，显示空值
          console.log("无可用接收机，显示空值")
          result.push({
            value: store.state.ActiveDevice.rcv_sn,
            text: store.state.ActiveDevice.rcv_name
          });
          that.options.RcvList = result;
        } else {//有可用接收机，赋值接收机列表和当前配对的接收机
          console.log("有可用接收机，赋值接收机列表和当前配对的接收机")
          for (let k = 0; k < data.length; k++) {
            if (data[k].rcv_sn == that.ActiveDevice.rcv_sn) {
              bFind = true;
              break;
            }
          }
          console.log("bFind:"+bFind);
          if (!bFind) {
            result.push({
              value: that.ActiveDevice.rcv_sn?that.ActiveDevice.rcv_sn:"",
              text: that.ActiveDevice.rcv_name?that.ActiveDevice.rcv_name:""
            });
          }
          console.log("result")
          console.log(result)
          $.each(data, function(key, value) {
            var add = "";
            if(value.online == "1"){
              add = "在线 : ";
            }else{
              add = "离线 : ";
            }
            result.push({
              value: value.rcv_sn,
              text: add+value.rcv_name
            });
          });
          console.log("result")
          console.log(result)
          //addSelOptions('edit_rcv_sel', result);
          that.options.RcvList = result;
          that.options.matchRcv = that.ActiveDevice.rcv_sn;
        }
        if(!that.ActiveDevice.rcv_sn){//当前配对的接收机为空，则板卡列表显示为空
          that.options.boardList = [];
          that.options.matchBoard = "";
        }else{//当前配对的接收机不为空，获取当前接收机对应的可用板卡
          that.$global.getUnusedBoard(that.ActiveDevice.rcv_sn, that.formatBoardList);
        }
      
        /*//获取当前所选的接收机的板卡
        bFind = false;
        for (var i = 0; i < result.length; i++) {
          if (result[i]['value'] == that.ActiveDevice.rcv_sn) {
            $('#edit_rcv_sel').selectpicker('val', result[i]['value']);
            $('#edit_rcv_sel').attr("oVal", result[i]['value']);
            getUnusedBoard(result[i]['value'], curEditMatchRow, row.board_id, cb);
            bFind = true;
            break;
          }
        }
        if (!bFind) {
          getUnusedBoard(result[0]['value'], curEditMatchRow, row.board_id, cb);
        }*/
        if(that.ActiveDevice.rcv_sn){
          var rcvMode = that.$global.getRcvMode(that.ActiveDevice.rcv_sn.substr(-4));
          if (rcvMode == 'DV4000RV') {
            that.boardShow = false;
          } else {
            that.boardShow = true;
          }
        }else{
          that.boardShow = true;
        }
      },
      formatBoardList(data){
        console.log("formatBoardList")
        console.log(data);
        var result = [];
        var that = this;
        //无可用板卡
        if (data.length == 0) {
          if (that.ActiveDevice == undefined) {
            result.push({
              value: -1,
              text: '无可用板卡'
            });
            that.setBoardListAndValue(result, -1);
          } else {
            if((that.options.matchRcv == that.ActiveDevice.rcv_sn) && that.options.matchRcv!=""){
              result.push({
                value: that.ActiveDevice.board_id,
                text: '板卡' + that.ActiveDevice.board_id
              });
              that.setBoardListAndValue(result, that.ActiveDevice.board_id);
            }else{
              result.push({
                value: -1,
                text: '无可用板卡'
              });
              that.setBoardListAndValue(result, -1);
            }
          }
        } else {
          if (that.ActiveDevice && that.ActiveDevice.rcv_sn == that.options.matchRcv) {
            result.push({
              value: that.ActiveDevice.board_id,
              text: '板卡' + that.ActiveDevice.board_id
            });
          }
          $.each(data, function(key, value) {
            result.push({
              value: value,
              text: '板卡' + value
            });
          });
          if(that.ActiveDevice.board_id){
            that.setBoardListAndValue(result, that.ActiveDevice.board_id);
          }else{
            that.setBoardListAndValue(result, result[0]["value"]);
          }
        }
      },
      setBoardListAndValue(result,value){
        var that = this;
        that.options.boardList = result;
        that.options.matchBoard = value;
      },
      changeMatchRcv(){
        //接收机下拉框切换
        var that = this;
        var rcvSn = that.options.matchRcv;
        //虚拟接收机
        var rcvMode = that.$global.getRcvMode(rcvSn.substr(-4));
        if (rcvMode == 'DV4000RV') {
          that.boardShow = false;
        } else {
          that.boardShow = true;
          that.$global.getUnusedBoard(rcvSn, that.formatBoardList);
        }
      },
      saveMatch(){
        console.log("dd saveMatch");
        var that = this;
        var dev_sn = that.ActiveDevice.dev_sn;
        var rcv = that.options.matchRcv;
        var board = that.options.matchBoard;
        var sub = rcv.substr(-4);
        //未修改
        if(that.ActiveDevice.rcv_sn == that.options.matchRcv 
          && that.ActiveDevice.board_id == that.options.matchBoard){
          return;
        }
        
        //是否是虚拟接收机
        var DV4000RV = false;
        if (sub == '2999') {//虚拟接收机
          DV4000RV = true;
          board = that.ActiveDevice.dev_sn;
        } else {//实体接收机
          //无可用板卡
          if (board == '' || board == '-1' && !DV4000RV) {
            return;
          }
          board = (+board) - 1;
        }

        var text = '是否切换配对关系？';
        that.$global.getDevPushStatus(dev_sn, function(data) {
          if (data == 'norcv') {
            console.log("norcv")
            that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name);
          } else {
            if (data == '1') {
              text = '是否需要先停止推流再切换配对关系？'
            }
            that.$messagebox.confirm(text).then(
              action => {
                that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name);
            }).catch();
          }
        });
      },
      unbindMatch(){
        var that = this;
        var text = '是否解除配对关系？';
        var dev_sn = that.ActiveDevice.dev_sn;
        var rcv_sn = that.ActiveDevice.rcv_sn;
        var board_id = that.ActiveDevice.board_id;
        var bindChart = dev_sn + "/" +rcv_sn + "/" + board_id;
        that.$global.getDevPushStatus(dev_sn, function(data) {
          if (data == '1') {
            text = '是否需要先停止推流再解除配对关系？'
          }
          //询问
          that.$messagebox.confirm(text).then(
            action => {
              //that.$global.clickRecordBtn('0');
              
              that.$axios({
                method: 'post',
                url:"/page/index/indexData.php",
                data:that.$qs.stringify({
                  delMatch:true,
                  dev_sn: dev_sn
                }),
                Api:"delMatch",
                AppId:"android",
                UserId:that.user.id
              })
              .then(function (response) {
                let res = response.data;
                if(res.res.success){
                  //推流开关关上，回传开关关上 实时监测界面
                  /*$("#dev_push_enable").bootstrapSwitch('state', false, true);
                  if($("#back_enable").bootstrapSwitch('state') == true){
                    $("#back_enable").bootstrapSwitch('state', false, true);
                    clickBackStopBtn();
                  }*/
                  //chars数据删除--start
                  that.$global.initChartSessionData(bindChart, "del");
                  //chars数据删除--end  
                  that.ActiveDevice.rcv_sn = "";
                  that.ActiveDevice.rcv_name = "";
                  that.ActiveDevice.board_id = "";
                  that.$global.getRcvList4000(that.formatRcvList);
                  that.options.matchBoard = "";
                  that.options.matchRcv = "";
                }else{
                  that.$toast({
                    message: res.res.reason,
                    position: 'middle',
                    duration: 2000
                  }); 
                }
              })
              .catch(function (error) {
                console.log(error)
              })
            }).catch();
        });
      }
    }
  }
</script>

<style scoped>
    .settings{
        margin-top: 60px;
        background-color: #212227;
        height: 84%;
        padding-bottom: 62px;
        overflow-y: auto;
    }
    .Group{
        margin-top: 0px;
    }
    .GroupTitle{
        border-top: 1px solid #222;
        border-bottom: 1px solid #222;
        text-align: left;
        text-indent: .1rem;
        padding: .1rem .08rem;
        background: linear-gradient(270deg,#111 0,#333 50%);
        /*border-radius: 5px;*/
        font-size: .15rem;
        font-weight:500;
        color: #B7B7B7;
    }
    .Group .GroupItem:last-child{
        border-bottom: 0;
    }
    .GroupItem{
        padding: .05rem .2rem;
        border-bottom: 1px solid #333;
    }
    .GroupItemField{
        overflow: hidden;
        /*margin-bottom: .1rem;*/
    }
    .GroupItemTitle{
        width: 35%;
        float: left;
        line-height: .3rem;
        text-align: left;
        font-size: .14rem;
        color: #EEEEEE;
    }
    .GroupItemValue{
        width: 65%;
        float: left;
        text-align: left;
    }
    .lan,.wan{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        background-color: #EEE;
        color: #000;
    }
    .lan{
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .wan{
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .btnSelect{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .ItemSelect{
        width: 1.8rem;
        height: .26rem;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
    }
    .ItemBtn{
      width:auto;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .12rem; 
    }
    .x2Ipt{
        width: 1.2rem;
        height: .24rem;
        border-radius: 5px;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        font-size: .12rem;
    }
    .x1Ipt{
        width: .6rem;
        height: .24rem;
        border-radius: 5px;
        margin-left: .1rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        font-size: .12rem;
    }
    .x2Btn{
        width: 1.25rem;
        height: .24rem;
        border-radius: 5px;
        border: none;
        outline: none;
        box-shadow: none;
        background-color: #3d81f1;
        color: #FFFFFF;
        font-size: .14rem;
    }
    .x1Btn{
        width: .64rem;
        height: .24rem;
        border-radius: 5px;
        margin-left: .08rem;
        border: none;
        outline: none;
        box-shadow: none;
        background-color: #3d81f1;
        color: #FFFFFF;
        font-size: .14rem;
    }
    .Group:nth-last-of-type(1){
        margin-bottom: .2rem;
    }
    .mint-switch{
        transform: scale(.7);
        transform-origin:left;
    }
    .slide-fade-enter-active {transition: all 1s ease;}
    .slide-fade-leave-active {transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-to{transform: translateY(5px);opacity: 0;}
</style>
<style>
    .settings .mint-cell{
        background-color: transparent;
        background-image: none !important;
        display: inline-block;
        min-height: auto;
    }
    .settings .mint-cell-wrapper{
        background-image: none;
        color: #EEEEEE;
        padding-left:0px;
    }
    .settings .mint-radiolist-title{
        margin:0px;
    }
    .settings .mint-radio-label{
        font-size:.12rem;
    }
    .settings .mint-radiolist-label{
        padding-left:0px;
    }
    .matchConfig .GroupItemTitle{
      width:25%;
    }
    .matchConfig .GroupItemValue{
      width:75%;
    }
    .matchConfig .GroupItemValue .ItemSelect{
      width:100%;
    }
</style>