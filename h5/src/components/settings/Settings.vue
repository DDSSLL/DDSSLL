<template>
  <div class="settings">
    <Device></Device>
    <div class="Group"><!-- 传输控制 -->
      <div class="GroupTitle">
        传输控制
        <span style="float:right">
          序列号:
          <span id="sn_str"></span>
        </span>
      </div>
      <div class="GroupItem"><!-- 传输IP -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">传输IP</div>
          <div class="GroupItemValue">
            <mt-radio
              title=""
              v-model="options.dev_push_ip"
              :options="RADIO_TRANS_IP"
              @change="setDeviceParam('dev_push_ip',options.dev_push_ip=='1'?'1':'')">
            </mt-radio>
          </div>
        </div>
      </div>
      <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 传输模式 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">传输模式</div>
          <div class="GroupItemValue">
            <mt-radio
              title=""
              v-model="options.PushTsType"
              :options="RADIO_TRANS_MODE"
              @change="changeTransMode"
              :disabled="paramLockAck == '1'?false:true">
            </mt-radio>
          </div>
        </div>
      </div>
      <div class="GroupItem" v-if="this.user.id==this.SUPER && this.card_sel_show"><!-- 单卡选择 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">单卡选择</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.PushCard" @change="setDeviceParam('PushCard', options.PushCard)"  :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in card_sel">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
      <div class="GroupItem"><!-- 录制开关 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">录制开关</div>
          <div class="GroupItemValue">
            <mt-switch v-model="options.record" @change="setDeviceParam('record',options.record?'1':'0')" :disabled="paramLockAck == '1'?false:true">
            </mt-switch>
          </div>
        </div>
      </div>
      <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 重传开关 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">重传开关</div>
          <div class="GroupItemValue">
            <mt-switch v-model="options.ResendMode" @change="setDeviceParam('ResendMode',options.ResendMode?'1':'0')" :disabled="paramLockAck == '1'?false:true">
            </mt-switch>
          </div>
        </div>
      </div>
      <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 纠错开关 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">纠错开关</div>
          <div class="GroupItemValue">
            <mt-switch v-model="options.OpenfecMode" @change="setDeviceParam('OpenfecMode',options.OpenfecMode?'1':'0')" :disabled="paramLockAck == '1'?false:true">
            </mt-switch>
          </div>
        </div>
      </div>
      <div class="GroupItem" v-if="this.user.id==this.SUPER && this.feclevel_show"><!-- 纠错能力 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">纠错能力</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.OpenfecLevel" @change="setDeviceParam('OpenfecLevel', options.OpenfecLevel)"  :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_FEC_LEVEL">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="Group"><!-- 输入编码 -->
      <div class="GroupTitle">输入编码</div>
      <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- SEI -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">SEI</div>
          <div class="GroupItemValue">
            <mt-switch v-model="options.SEI" @change="setDeviceParam('SEI',options.SEI?'1':'0')" :disabled="paramLockAck == '1'?false:true">
            </mt-switch>
          </div>
        </div>
      </div>
      <div class="GroupItem"><!-- 视频输入 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">视频输入</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.video_input" @change="setDeviceParam('video_input',options.video_input)"  :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_VIDEOINPUT">
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
            <select class="ItemSelect" v-model="options.audio_input" @change="setDeviceParam('audio_input',options.audio_input)"  :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_AUDIOINPUT">
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
            <select class="ItemSelect" v-model="options.video_encode" @change="setDeviceParam('video_encode',options.video_encode)" :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_VIDEOENCODE">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
      <div class="GroupItem"><!-- 音频编码 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">音频编码</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.AudioEnc" @change="setDeviceParam('AudioEnc',options.AudioEnc)" :disabled="paramLockAck == '1'?false:true">
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
            <select class="ItemSelect" v-model="options.AudioBitrate" @change="setDeviceParam('AudioBitrate',options.AudioBitrate)" :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_AUDIO_BR">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
      <div class="GroupItem"><!-- 码率控制 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">码率控制</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.bitrate_mode" @change="setDeviceParam('bitrate_mode',options.bitrate_mode)" :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_BITRATEMODE">
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
            <select class="ItemSelect" v-model="options.HdmiTransFormat" @change="setDeviceParam('HdmiTransFormat',options.HdmiTransFormat)" :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_HDMI_FORMAT">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="Group"  v-if="this.user.id==this.SUPER"><!-- 日志记录 -->
      <div class="GroupTitle">日志记录</div>
      <div class="GroupItem"><!-- 日志记录 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">日志记录</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.ArmSenderLogLevel" @change="setDeviceParam('ArmSenderLogLevel',options.ArmSenderLogLevel)"  :disabled="paramLockAck == '1'?false:true">
              <template v-for="item in OPTIONS_LOG_LEVEL">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER,SET_NAV_STATUS } from '../../store/mutation-types';
  import Device from '../basic/Device';
  import $ from 'jquery';
  export default {
    name: "Settings",
    data(){
      return{
        SUPER : SUPER,
        RADIO_TRANS_IP : [],
        RADIO_TRANS_MODE : [],
        card_sel_show : false,
        feclevel_show : false,
        card_sel:[],
        OPTIONS_FEC_LEVEL : [{text: "低",value: "0"}, 
                              {text: "中",value: "1"}, 
                              {text: "高",value: "2"}],
        OPTIONS_AUDIOINPUT : [{value: "1",text: "2-CH"}],
        OPTIONS_VIDEOINPUT : [{value: "0",text: "3G-SDI"}, {value: "1",text: "HDMI"}],
        OPTIONS_VIDEOENCODE : [{value: "0",text: "H.264"}],
        OPTIONS_BITRATEMODE : [{value: "0",text: "CBR"}, {value: "1",text: "AVBR"}],
        OPTIONS_HDMI_FORMAT :[{text: "1920x1080p30",value: "1"},
                              {text: "1920x1080p60",value: "2"}, 
                              {text: "1920x1080p50",value: "3"}, 
                              {text: "1920x1080p25",value: "4"}, 
                              {text: "1280x720p60",value: "7"}, 
                              {text: "1280x720p50",value: "8"}, 
                              {text: "1280x720p30",value: "9"}, 
                              {text: "1280x720p25",value: "10"}, 
                              {text: "720x576p50",value: "11"}, 
                              {text: "720x480p60",value: "12"}],
        OPTIONS_AUDIO_ENCODE : [{text: "AAC",value: "0"}],
        OPTIONS_AUDIO_BR : [{text: "256kbps",value: "256"}, 
                            {text: "128kbps",value: "128"},
                            {text: "64kbps",value: "64"}],
        OPTIONS_LOG_LEVEL : [{text: "OFF",value: "0"}, 
                            {text: "ERROR",value: "1"}, 
                            {text: "INFO",value: "2"},
                            {text: "DEBUG",value: "3"}],
        options:{
          dev_push_ip:'0',//传输IP
          PushTsType:'0',//传输模式
          PushCard : "",//单卡选择
          record:false,//录制开关
          ResendMode:false,//重传开关
          OpenfecMode:false,//纠错开关
          OpenfecLevel:0,//纠错能力
          SEI:false,//SEI
          video_input:'0',//视频输入
          audio_input:'1',//音频输入
          video_encode:'0',//视频编码
          AudioEnc:'0',//音频编码
          AudioBitrate:'256',//音频比特率
          bitrate_mode:'0',//码率控制
          HdmiTransFormat:'1',//编码分辨率
          ArmSenderLogLevel:'0',//日志记录
        }
      }
    },
    components: {
        Device
    },
    computed: {
        ...mapState(['user','navHide','ActiveDeviceType','paramLockAck'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          $("#sn_str").text(this.ActiveDevice.dev_sn)
          if(this.paramLockAck != "1"){
            this.getDeviceParam();
          }
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
          }],
          this.RADIO_TRANS_MODE = [{
            label: '单卡',
            value: '1',
            disabled: this.paramLockAck == '1'?false:true
          },{
            label: '汇聚',
            value: '0',
            disabled: this.paramLockAck == '1'?false:true
          }]
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      console.log("setting activated");
      this.getDeviceParam();
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_NAV_STATUS
      }),
      chooseIP(val){this.control.ip = val;},
      getDeviceParam(){
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
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          console.log("getDeviceParam")
          if(res.res.success){
            console.log("success");
            //that.options = that.formatData(res.data[0]);
            that.formatData(res.data[0]);
            console.log("options")
            console.log(that.options);
          }else{
            /*that.options = {
              dev_push_ip:'1',
              dev_push_mode:'0',
              record:'0',
              ResendMode:'0',
              ResendModeVal:false,
              OpenfecMode:'0',
              OpenfecModeVal:false,
              video_input:'0',
              audio_input:'1',
              video_encode:'0',
              AudioEnc:'0',
              AudioBitrate:'256',
              bitrate_mode:'0',
              hdr:'0',
              latency:'0',
              HdmiTransFormat:'1',
              sdiresolutionRate:'1080i',
              sdiresolutionValue:'50',
              hdmipenetrate:true,
              hdmiresolutionRate:'1080',
              hdmiresolutionValue:'59.94'
            };*/
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatData(data){
        var that = this;
        console.log("formatData")
        console.log(data)
        //传输IP
        that.options.dev_push_ip = data['dev_push_ip']=="1"?"1":"0";
        //data['dev_push_ip'] = data['dev_push_ip']=="1"?"1":"0";
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
          that.feclevel_show = true;
        }else{
          that.options.OpenfecMode = false;
          that.feclevel_show = false;
        }
        //纠错能力
        that.options.OpenfecLevel = data['OpenfecLevel'];
        //SEI
        var sei_state = "";
        that.options.SEI = (data['SEI'] == '1' ? true : false);
        //视频输入
        that.options.video_input = data['video_input'];
        //音频输入
        that.options.audio_input = data['audio_input'];
        //视频编码
        that.options.video_encode = data['video_encode'];
        //音频编码
        that.options.AudioEnc = data['AudioEnc'];
        //音频比特率
        that.options.AudioBitrate = data['AudioBitrate'];
        //码率控制
        that.options.bitrate_mode = data['bitrate_mode'];
        //编码分辨率
        that.options.HdmiTransFormat = data['HdmiTransFormat'];
        //日志等级
        that.options.ArmSenderLogLevel = data['ArmSenderLogLevel'];
        
        return data;
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
        this.setDeviceParam('dev_push_mode',this.options.PushTsType?'1':'0')
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
                        that.getDeviceParam();
                    }else{
                        that.getDeviceParam();
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
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
</style>