<template>
  <div class="control mainPage">
    <keep-alive>
      <Device page='dev'></Device>
    </keep-alive>
    <div class="Group" v-if="show.devMod">
      <div class="GroupItem" style="padding: .1rem;border-bottom:0;">
        <div class="GroupItemField">
          <div class="GroupItemTitle">背包模式</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="common.WorkMode" @change="changeWorkMode"  :disabled="dis.WorkMode">
              <template v-for="item in OPTIONS_WORK_MODE">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div v-if="common.WorkModePush">
      <div class="Group">
        <div class="GroupTitle" @click="commonSettingShow=!commonSettingShow">
          常用设置
          <i class="titleIcon fa" :class="[commonSettingShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        </div>
        <transition name="slide-fade">
          <div v-show="commonSettingShow">
            <div class="GroupItem pushEnableSwitch" style="padding: .1rem;border-bottom:0;">
              <div class="GroupItemField">
                <div class="GroupItemTitle">传输开关</div>
                <div class="GroupItemValue">
                  <mt-switch v-model="common.dev_push_enableVal" @change="setDevPushEnable" :disabled="dis.dev_push_enable" style="width:30%"></mt-switch>
                        <span v-if="show.pushDisShow" style="color:red">{{transErrReason}}</span>
                </div>
              </div>
            </div>
            <div class="GroupItem">
              <div class="GroupItemField">
                <div class="GroupItemTitle">视频比特率(Mbps)</div>
                <div class="GroupItemValue">
                  <mt-range
                    v-model="common.dev_srVal_range"
                    class="ItemRange byteRange"
                    :min="BITRATE_MIN*10"
                    :max="BITRATE_MAX*10"
                    :step="1"
                    :bar-height="5"
                    :disabled="dis.dev_srVal_range"
                    @change="changeVideoBitrate">
                    <div style="color: #EEEEEE;padding: .01rem;" slot="start">{{BITRATE_MIN}}</div>
                    <div style="color: #EEEEEE;padding: .01rem;" slot="end">{{BITRATE_MAX}}</div>
                  </mt-range>
                  <input type="text" class="ItemIpt" v-model.number="common.dev_srVal_input" @blur="changeDevSrVal" :disabled="dis.dev_srVal_input">
                </div>
              </div>
            </div>
            <div class="GroupItem" v-if="show.delayShow">
              <div class="GroupItemField">
                <div class="GroupItemTitle">延时(s)</div>
                <div class="GroupItemValue">
                  <mt-range
                    v-model="common.dev_delayVal_range"
                    class="ItemRange byteRange"
                    :min="DELAY_MIN*10"
                    :max="DELAY_MAX*10"
                    :step.number="1"
                    :bar-height="5"
                    :disabled="dis.dev_delayVal_range"
                    @change="setDeviceParam('dev_delay_range')">
                    <div style="color: #EEEEEE;padding: .01rem;" slot="start">{{DELAY_MIN}}</div>
                    <div style="color: #EEEEEE;padding: .01rem;" slot="end">{{DELAY_MAX}}</div>
                  </mt-range>
                  <input type="text" class="ItemIpt" v-model.number="common.dev_delayVal_input" @blur="changeDelayInput" :disabled="dis.dev_delayVal_input">
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="Group">
        <div class="GroupTitle" @click="cardConfigShow=!cardConfigShow">
          网卡设置
          <i class="titleIcon fa" :class="[cardConfigShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        </div>
        <transition name="slide-fade">
          <div v-show="cardConfigShow">
            <div v-if="show.transModeShow">
              <div class="GroupItem">
              <div class="GroupItemField">
                <div class="GroupItemTitle">模式切换</div>
                  <div class="GroupItemValue">
                    <select class="ItemSelect" v-model="common.PushTsType" @change="changeTransMode"  :disabled="dis.PushTsType">
                      <template v-for="item in OPTIONS_TRANS_MODE">
                        <option :value="item.value">{{ item.text }}</option>
                      </template>
                    </select>
                  </div>
                </div>
              </div>
              <div class="GroupItem" v-if="show.cardSelShow">
                <div class="GroupItemField">
                  <div class="GroupItemTitle">网卡选择</div>
                  <div class="GroupItemValue">
                    <select class="ItemSelect" v-model="common.PushCard" @change="changeCard"  :disabled="dis.PushCard">
                      <template v-for="item in OPTIONS_TRANS_PUSH_CARD">
                        <option :value="item.value">{{ item.text }}</option>
                      </template>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="GroupItem" style="padding: .1rem;border-bottom:0;">
              <table class="netBoardTable">
                <thead>
                  <tr>
                    <th>网卡</th>
                    <th>模式</th>
                    <th>上传<br>Mbps</th>
                    <th>RTT<br>ms</th>
                    <th>强度<br>dBm</th>
                    <th>复位</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in netBoard">
                    <tr v-if="item.bShow">
                      <td class="td" :class="[item.online == '1' ? 'green': 'gray']">
                        {{ item.card_name }}
                        <mt-switch v-model="item.used" @change="switchCard(item)" :disabled="item.disable"></mt-switch>
                      </td>
                      <td class="td" v-if="showMode[item.card_id]">
                        <select class="ItemSelect selectMode" v-model="mode[item.card_id]" @change="changeSimMode(item.card_id)"  :disabled="item.modeDisable">
                          <template v-for="item1 in modeOption[item.card_id]">
                            <option :value="item1.value">{{ item1.text }}</option>
                          </template>
                        </select>
                      </td>
                      <td class="td" v-else>-</td>
                      <td class="td">{{ item.send_br }}</td>
                      <td class="td">{{ item.card_rtt }}</td>
                      <td class="td">{{ item.rssi }}</td>
                      <td class="td" v-if="showMode[item.card_id]" @click="clickSimReset(item.card_id,item.disable)">
                        <i class="fa fa-refresh" :class="spinClass[item.card_id]"></i>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div v-if="common.WorkModePull">
      <div class="Group">
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">视频输出</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.PullMHdmiOut" @change="changePullMHdmiOut"  :disabled="dis.PullMHdmiOut">
                <template v-for="item in OPTIONS_PULL_MHDMIOUT_1080">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">音频输出</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.PullMHdmiAS" @change="changePullMHdmiAS"  :disabled="dis.PullMHdmiAS">
                <template v-for="item in OPTIONS_PULL_HDMIOUT_1080">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">传输通道</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.PullTsNet" @change="changePullCard"  :disabled="dis.PullTsNet">
                <template v-for="item in OPTIONS_TRANS_PULL_CARD">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">传输开关</div>
            <div class="GroupItemValue" style="width:auto">
              <mt-switch v-model="common.PullTsOpen" @change="changePullOpen" :disabled="dis.PullTsOpen"></mt-switch>
            </div>
          </div>
        </div>
      </div>
      <!-- 拉流地址 -->
      <!-- <div class="Group">
        <div class="GroupTitle" @click="pullAddressShow=!pullAddressShow">
          拉流地址
          <i class="titleIcon fa" :class="[pullAddressShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        </div>
        <transition name="slide-fade">
          <div v-show="pullAddressShow">
            <div class="addressGroup" style="padding:0">
              <div>
                <PushUrl v-bind:lockState="pageLock" v-bind:workMode="devTypeArr[common.WorkMode]" v-bind:transMode="common.transMode"></PushUrl>
              </div>
            </div> 
          </div>      
        </transition>
      </div> -->
    </div>
    <div v-if="common.WorkModeAct">  
      <div class="Group">
        <div class="GroupTitle">常用设置</div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">传输开关</div>
            <div class="GroupItemValue">
              <mt-switch v-model="common.dev_srt" @change="changeDevSrt" :disabled="dis.dev_srt"></mt-switch>
            </div>
          </div>
        </div>
        <!-- <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">互动背包</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.ActDev" @change="changeAct"  :disabled="dis.ActDev">
                <template v-for="item in OPTIONS_ACTDEVSN">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div> -->
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">视频比特率(Mbps)</div>
            <div class="GroupItemValue">
              <mt-range
                v-model="common.dev_srVal_range"
                class="ItemRange byteRange"
                :min="BITRATE_MIN*10"
                :max="BITRATE_MAX*10"
                :step="1"
                :bar-height="5"
                :disabled="dis.dev_srVal_range"
                @change="changeVideoBitrate"><!-- setDeviceParam('dev_sr_range') -->
                <div style="color: #EEEEEE;padding: .01rem;" slot="start">{{BITRATE_MIN}}</div>
                <div style="color: #EEEEEE;padding: .01rem;" slot="end">{{BITRATE_MAX}}</div>
              </mt-range>
              <input type="text" class="ItemIpt" v-model.number="common.dev_srVal_input" @blur="setDeviceParam('dev_sr_input')" :disabled="dis.dev_srVal_input">
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">切换显示</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.ActDisplay" @change="setDeviceParam('ActDisplay', common.ActDisplay);"  :disabled="dis.ActDisplay">
                <template v-for="item in OPTIONS_ACT_DISPLAY_1080">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">HDMI输出</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.ActHdmiOut" @change="setDeviceParam('ActHdmiOut', common.ActHdmiOut);"  :disabled="dis.ActHdmiOut">
                <template v-for="item in OPTIONS_ACT_HDMIOUT_1080">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">耳机音频选择</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.ActMAudioOut" @change="changeActMAudioOut"  :disabled="dis.ActMAudioOut">
                <template v-for="item in OPTIONS_ACT_AUDIOOUT_1080">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">传输通道</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.SrtTransIf" @change="changeSrtTransIf"  :disabled="dis.SrtTransIf">
                <template v-for="item in OPTIONS_TRANS_SRT">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem" v-if="show.netWorkMode">
          <div class="GroupItemField">
            <div class="GroupItemTitle">网络模式</div>
            <div class="GroupItemValue">
              <select class="ItemSelect" v-model="common.netWorkMode" @change="changeNetWorkMode"  :disabled="dis.netWorkMode">
                <template v-for="item in OPTIONS_NET_WORKMODE">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
        </div>
        <div class="GroupItem" v-if="false">
          <div class="GroupItemField">
            <div class="GroupItemTitle">流媒体内网IP</div>
            <div class="GroupItemValue">
              <input type="text" class="ItemIpt" v-model="common.actAddrIp" @blur="setDeviceParam('dev_sr_input')" :disabled="dis.actAddrIp">
            </div>
          </div>
        </div>
        <div class="GroupItem" v-if="false">
          <div class="GroupItemField">
            <div class="GroupItemTitle">端口</div>
            <div class="GroupItemValue">
              <input type="text" class="ItemIpt" v-model="common.actAddrPort" @blur="setDeviceParam('dev_sr_input')" :disabled="dis.actAddrPort">
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">推流延时</div>
            <div class="GroupItemValue">
              <input type="text" class="ItemIpt" v-model="common.actPushLatency" @blur="setDeviceParam('dev_sr_input')" :disabled="dis.actPushLatency"><span style="color:#fff">ms</span>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle">拉流延时</div>
            <div class="GroupItemValue">
              <input type="text" class="ItemIpt" v-model="common.actPullLatency" @blur="setDeviceParam('dev_sr_input')" :disabled="dis.actPullLatency"><span style="color:#fff">ms</span>
            </div>
          </div>
        </div>
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle"></div>
            <div class="GroupItemValue" style="margin-left:30%">
              <mt-button class="ItemBtn" @click="setActAddr" type="primary" :disabled="!pageLock?false:true">确定</mt-button>
            </div>
          </div>
        </div>
        <div class="GroupItem" v-if="show.ActPushAddr">
          <div class="GroupItemField">
            <div class="GroupItemTitle">推流地址</div>
            <div class="GroupItemValue">
              <input type="text" class="ItemIpt" v-model="common.ActPushAddr" :disabled="!pageLock?false:true">
              <mt-button class="ItemBtn" type="primary" @click="setDeviceParam('ActPushAddr', common.ActPushAddr);" :disabled="dis.ActPushAddr">确定</mt-button>
            </div>
          </div>
        </div>
        <div class="GroupItem" v-if="show.ActPullAddr">
          <div class="GroupItemField">
            <div class="GroupItemTitle">拉流地址</div>
            <div class="GroupItemValue">
              <input type="text" class="ItemIpt" v-model="common.ActPullAddr" :disabled="!pageLock?false:true">
              <mt-button class="ItemBtn" type="primary" @click="setDeviceParam('ActPullAddr', common.ActPullAddr);" :disabled="dis.ActPullAddr">确定</mt-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Device from '../basic/Device';
  import PushUrl from '../basic/PushUrl';
  import { MessageBox } from 'mint-ui';
  import { mapState, mapMutations } from 'vuex';
  import { SET_DEVICE_MODE_SELECT } from '../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "Control",
    data(){
      return{
        developVer:false,
        R1080_RCV:R1080_RCV,
        curDevSeries:"",
        cardConfigShow:true,
        commonSettingShow:true,
        pullAddressShow:false,
        pageLock:false,
        BITRATE_MIN : 0.5, //Mbps   数据库里的dev_sr
        BITRATE_MAX : 100,
        DELAY_MIN : 0.5, //s
        DELAY_MAX : 20,
        delayMin : 0,
        delayMax : 0,
        speedMin : 0,
        speedMax : 0,
        devTypeArr : ["推流","拉流","互动"],
        //ActiveDevice:null,
        OPTIONS_5G_MODE: [{text: "AUTO",value: "0"},
                          {text: "NSA",value: "1"}, 
                          {text: "SA",value: "2"}, 
                          {text: "LTE",value: "3"}],
        OPTIONS_LTE_MODE: [{text: "LTE",value: "3"}],
        OPTIONS_NET_WORKMODE:[],//互动 - 网络模式
        //拉流 -- HDMI音频输出
        OPTIONS_PULL_HDMIOUT_1080: [{text: "开",value: "1"}, 
                                    {text: "关",value: "0"}],
        //HDMI输出
        OPTIONS_PULL_MHDMIOUT_1080: [{text: "1080i50",value: "0"}, 
                                    {text: "1080p25",value: "1"}, 
                                    {text: "1080p30",value: "2"}, 
                                    {text: "1080p50",value: "3"}, 
                                    {text: "1080p60",value: "4"}],
        transErrReason:"",
        common:{
          dev_push_enable:"0",
          dev_push_enableVal:false,
          dev_push_enableVal_act:false,
          dev_sr:0,
          dev_srVal:0,
          dev_srVal_range:0,
          dev_srVal_input:0,
          dev_srVal_range_act:0,
          dev_srVal_input_act:0,
          dev_delay:0,
          dev_delayVal:0,
          WorkMode:0,//工作模式
          WorkModePush:true,//推流模式
          WorkModeAct:false,//互动模式
          WorkModePull:false,//拉流模式
          WorkModeOri:0,//记录原始工作模式
          PushTsType:0,//传输模式
          PushCard:"",//单卡选择
          PullTsNet:"",//拉流-网卡选择
          PullTsOpen:"",//拉流-传输开关
          dev_srt:false,//互动传输开关
          ActDev:"",//互动背包
          ActDisplay:"",//互动显示
          ActHdmiOut:"",//HDMI输出
          ActMAudioOut:"",//耳机音频选择
          SrtTransIf:"",//传输通道
          netWorkMode:"",//网络模式
          actAddrIp:"",//流媒体内网IP
          actAddrPort:"",//端口
          actPushLatency:"",//推流延时
          actPullLatency:"",//拉流延时
          ActPullAddr:"",//拉流地址
          ActPushAddr:"",//推流地址
          //拉流
          PullMHdmiAS:0,//HDMI音频输出
          PullMHdmiOut:0,//HDMI视频输出
        },
        show:{
          pushDisShow:false,//推流 传输开关错误原因
          devMod:false,//背包模式
          ActPullAddr:false,//拉流地址
          ActPushAddr:false,//推流地址
          transModeShow:false,//模式切换
          cardSelShow:true,//推流网卡选择
          netWorkMode:false,//互动--网络模式
          delayShow:true,//延时
        },
        dis:{
          WorkMode:false,//背包模式
          dev_push_enable:false,//传输开关
          dev_srt:false,//互动传输开关
          PushTsType:false,//传输模式
          PushCard:false,//网卡选择
          dev_srVal_range:false,//视频比特率range
          dev_srVal_input:false,//视频比特率input
          dev_srVal_range_act:false,//视频比特率range 互动
          dev_srVal_input_act:false,//视频比特率input 互动
          dev_delayVal_range:false,//延时range
          dev_delayVal_input:false,//延时input
          PullTsOpen:false,//拉流-传输开关
          //互动
          ActDev:false,//互动背包
          ActHdmiOut:false,//HDMI输出
          ActMAudioOut:false,//耳机音频选择
          actAddrIp:false,//流媒体内网IP
          actAddrPort:false,//流媒体服务器端口
          actPushLatency:false,//推流延时
          actPullLatency:false,//拉流延时
          ActPushAddr:false,//推流地址
          ActPullAddr:false,//拉流地址
          //拉流
          PullMHdmiAS:false,//HDMI音频输出
          PullMHdmiOut:false,//HDMI视频输出
          PullTsNet:false,//网卡选择
          PullTsOpen:false,//传输开关
          
        },
        modeArr: ['_push','_act'], //不同模式下的视频比特率
        modeArr_4000:['_push'],
        netBoard:[],
        mode:{
          lte1:"",
          lte2:"",
          lte3:"",
        },
        modeOption:{
          lte1:"",
          lte2:"",
          lte3:"",
        },
        showMode:{
          lte1:true,
          lte2:true,
          lte3:true,
          lte4:true,
          lte5:true,
          lte6:true,
          eth0:false,
          wifi:false,
          "usb-lan":false,
          "usb-5g1":false,
          "usb-5g2":false,
        },
        OPTIONS_WORK_MODE:[/*{value: "0",text: "推流"},
                          {value: "1",text: "拉流"},
                          {value: "2",text: "互动"}*/],
        OPTIONS_TRANS_MODE:[{value: "0",text: "多卡汇聚"},
                            {value: "1",text: "单卡直推"}],
        OPTIONS_TRANS_PUSH_CARD:[],
        OPTIONS_TRANS_PULL_CARD:[],
        OPTIONS_ACTDEVSN:[],
        OPTIONS_ACT_DISPLAY_1080:[{text: "本地",value: "0"}, 
                            {text: "远端",value: "1"},
                            {text: "画中画",value: "2"}],
        /*OPTIONS_ACT_HDMIOUT: [{text: "720P",value: "0"}, 
                              {text: "1080I",value: "1"}],*/
        OPTIONS_ACT_HDMIOUT_1080: [{text: "1080I50",value: "0"}, 
                                  {text: "1080P50",value: "1"}],
        OPTIONS_ACT_AUDIOOUT_1080:[],
        OPTIONS_CARD: [{text: "ETH0",value: "eth0"}, 
                      {text: "LTE1",value: "lte1"}, 
                      {text: "LTE2",value: "lte2"},
                      {text: "LTE3",value: "lte3"},
                      {text: "USB-LAN1",value: "usb-lan"}, 
                      {text: "USB-5G1",value: "usb-5g1"}, 
                      {text: "USB-5G2",value: "usb-5g2"},
                      {text: "WiFi",value: "wifi"}],
        OPTIONS_TRANS_SRT:[],
        devType:{1:"all",2:"pushing",3:"online",4:"offline"},
        spinClass:{},
      }
    },
    computed: {
      ...mapState(['user','paramLockAck','lockUserId','ActiveDevice'])//"ActiveDeviceType",
    },
    components: {
      Device,PushUrl
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/control"){
            this.ActiveDevice = val;
            //this.getaAtDevList();
          }
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          var that = this;
          if(this.$route.fullPath == "/control"){
            this.controlShow();
            this.getNetBoard(function(data){
              that.netBoard = that.formatNetBoard(data); 
            });//获取网卡数据
            //this.getDevList();
            this.getDevListforAct();
            this.initDeviceParam();
            this.getDeviceControlParam(true);
            clearInterval(localStorage.getControlParam);
            localStorage.getControlParam = setInterval(function(){
              that.getNetBoard(function(data){
                that.netBoard = that.formatNetBoard(data); 
              });
              var initParam = false;
              that.getDeviceControlParam(initParam)
              //that.$global.getPushUrls(that, that.formatPushUrlState);
            },500)
          }
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      var that = this;
      //页面激活的时候先获取一遍数据，防止其他页面参数修改对该页面参数的影响
      this.controlShow();
      this.getNetBoard(function(data){
        that.netBoard = that.formatNetBoard(data); 
      });//获取网卡数据
      //this.getDevList();
      this.getDevListforAct();
      this.initDeviceParam();
      this.getDeviceControlParam(true);
      if(localStorage.getControlParam == "undefined"){
        localStorage.getControlParam = setInterval(function(){
          that.getNetBoard(function(data){
            that.netBoard = that.formatNetBoard(data); 
          });
          var initParam = false;
          that.getDeviceControlParam(initParam)
          //that.$global.getPushUrls(that, that.formatPushUrlState);
        },500)
      }
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getControlParam);
      localStorage.getControlParam = undefined;
    },
    methods:{
      ...mapMutations({
        SET_DEVICE_MODE_SELECT,
      }),
      controlShow(){
        this.curDevSeries = this.$global.getDevSeries(this.ActiveDevice?this.ActiveDevice.dev_sn:"");
        if(this.curDevSeries == "4000"){
          this.show.devMod = false;
          this.common.WorkModePush = true;//4000显示网卡设置
          this.common.WorkModePull = false;//拉流模式下的参数
          this.common.WorkModeAct = false;//互动模式下的参数
          this.show.transModeShow = false;//模式切换
        }else if(this.curDevSeries == "1080"){
          this.show.devMod = true;
          this.show.transModeShow = true;//模式切换
          if(this.common.WorkMode == "0"){
            this.common.WorkModePush = true;//推流模式下显示网卡设置
            this.common.WorkModePull = false;//拉流模式下的参数
            this.common.WorkModeAct = false;//互动模式下的参数
          }else if(this.common.WorkMode == "1"){
            this.common.WorkModePush = false;//互动模式下不显示网卡设置
            this.common.WorkModePull = true;//拉流模式下的参数
            this.common.WorkModeAct = false;//互动模式下的参数
          }else{
            this.common.WorkModePush = false;//互动模式下不显示网卡设置
            this.common.WorkModePull = false;//拉流模式下的参数
            this.common.WorkModeAct = true;//互动模式下的参数
          }
        }
      },
      initDeviceParam(){
        var that = this;
        //工作模式
        if(that.ActiveDevice){
          this.$global.getDevOptions(that.ActiveDevice.dev_sn,function(data){
            var options_workmode = [];
            for(var i=0;i<data.length;i++){
              options_workmode[i] = {};
              //options_workmode[i]['value']=data[i];
              if(data[i] == 'push'){
                options_workmode[i]['text']='推流';
                options_workmode[i]['value']=0;
              }else if(data[i] == 'pull'){
                options_workmode[i]['text']='拉流';
                options_workmode[i]['value']=1;
              }else if(data[i] == 'act'){
                options_workmode[i]['text']='互动';
                options_workmode[i]['value']=2;
              }
            }
            that.OPTIONS_WORK_MODE = options_workmode;
          });
        }
        //this.OPTIONS_TRANS_SRT = this.OPTIONS_CARD;
        //互动推拉流地址延时 默认125ms
        this.common.actPushLatency = 125;
        this.common.actPullLatency = 125;
        //视频比特率范围
        this.initSpeedEvent();
        //延时范围
        this.initDelay();
        //互动耳机音频选择
        this.OPTIONS_ACT_AUDIOOUT_1080 = this.$global.OPTIONS_ACT_AUDIOOUT_1080;
      },
      initDelay(){
        if(this.curDevSeries == "4000"){
          this.DELAY_MIN = 0.1;
        }else if(this.curDevSeries == "1080"){
          this.DELAY_MIN = 0.5;
        }
      },
      initSpeedEvent(){
        //视频比特率范围
        var that = this;
        var res = "";
        res = this.$global.getVideoBr(that.ActiveDevice.dev_sn);
        this.BITRATE_MIN = res.min;
        this.BITRATE_MAX = res.max;
      },
      changeVideoBitrate(){
        this.setDeviceParam('dev_sr_range');
        //视频比特率变化影响延时范围
        if(this.common.dev_srVal_input > 40){
          this.DELAY_MAX = 10;
        }else{
          this.DELAY_MAX = 20;
        }
        if(this.common.dev_delayVal > this.DELAY_MAX){
          this.common.dev_delayVal = this.DELAY_MAX;
          this.common.dev_delayVal_input = this.DELAY_MAX;
          this.common.dev_delayVal_range = this.DELAY_MAX*10;
          this.setDeviceParam('dev_sr_input');
        }
        var bindChart = this.ActiveDevice.dev_sn+"/"+this.ActiveDevice.rcv_sn+"/"+this.ActiveDevice.board_id;
        this.$global.initChartSessionData(bindChart);
      },
      changeDevSrVal(){
        if(this.common.dev_srVal_input>this.BITRATE_MAX){
          this.common.dev_srVal_input = this.BITRATE_MAX;
        }else if(this.common.dev_srVal_input < this.BITRATE_MIN){
          this.common.dev_srVal_input = this.BITRATE_MIN;
        }else{
          this.common.dev_srVal_input = (this.common.dev_srVal_input*1).toFixed(1);
        }
        this.setDeviceParam('dev_sr_input');
        var bindChart = this.ActiveDevice.dev_sn+"/"+this.ActiveDevice.rcv_sn+"/"+this.ActiveDevice.board_id;
        this.$global.initChartSessionData(bindChart);
      },
      changeDelayInput(){
        if(this.common.dev_delayVal_input>this.DELAY_MAX){
          this.common.dev_delayVal_input = this.DELAY_MAX;
        }else if(this.common.dev_delayVal_input < this.DELAY_MIN){
          this.common.dev_delayVal_input = this.DELAY_MIN;
        }else{
          this.common.dev_delayVal_input = (this.common.dev_delayVal_input*1).toFixed(1);
        }
        this.setDeviceParam('dev_delay_input')
      },
      setActAddr(){
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          return;
        }
        var actIp=this.common.actAddrIp;
        var actPort = this.common.actAddrPort;
        var actDev = this.common.ActDev;
        var pushLatency = this.common.actPushLatency;
        var pullLatency = this.common.actPullLatency;

        if(!this.$global.isValidIP(actIp)){
          this.$toast({
            message: "输入IP",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(!this.$global.isValidPort(actPort)){
          this.$toast({
            message: "输入端口",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(!this.$global.isValidSn(actDev)){
          this.$toast({
            message: "输入序列号",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(!this.$global.isValidActLatency(pushLatency)){
          this.$toast({
            message: "延时50-3000ms",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(!this.$global.isValidActLatency(pullLatency)){
          this.$toast({
            message: "延时50-3000ms",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //推流地址 本机序列号
        var pushAddr = 'srt://'+actIp+':'+actPort+'?streamid=uplive.deviser.com.cn/live/'+devSN+'&latency='+pushLatency;
        //拉流地址 互动背包序列号
        var pullAddr = 'srt://'+actIp+':'+actPort+'?streamid=live.deviser.com.cn/live/'+actDev+'&latency='+pullLatency;

        this.setDeviceParam('ActPushAddr', pushAddr);
        this.setDeviceParam('ActPullAddr', pullAddr);
        this.setDeviceParam('ActDev', actDev);

        this.common.ActPushAddr = pushAddr;
        this.common.ActPullAddr = pullAddr;
        this.$toast({
          message: "设置成功",
          position: 'middle',
          duration: 2000
        });
      },
      //切换互动背包
      changeAct(actDevSn){
        var that = this;
        var devSN = that.ActiveDevice.dev_sn;
        if (!devSN || !that.$global.isValidSn(devSN)) {
            return;
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            changeAct:true, 
            devSN: devSN,
            actDevSn: that.common.ActDev
          }),
          Api:"getDevStatusBySn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if((res.data['cur_dev'][0].online == '1') && (res.data['cur_dev'][0].dev_push_status != '0')){//推流
              that.$toast({
                message: "推流中的背包不支持切换!",
                position: 'middle',
                duration: 2000
              });
              that.common.ActDev = that.ActiveDevice.ActDev;
              return;
            }else{
              if(res.data['cur_dev'][0].ActDev == that.common.ActDev){
                return;
              }
              if(res.data['act_dev'][0]['online'] == '1') {
                if(res.data['act_dev'][0]['dev_push_status'] != 0){
                  var text = "选择的互动背包正在推流中，确定切换?"
                  MessageBox.confirm('',{
                    title:'提示',
                    message: text,
                    confirmButtonText:'确定',
                    cancelButtonText:'取消'
                  }).then(action => {
                    if (action == 'confirm') {
                      that.matchActData(res.data['cur_dev'][0],res.data['act_dev'][0]);
                    }
                  }).catch(error =>{
                    console.log(error)
                  });
                }else{
                  that.matchActData(res.data['cur_dev'][0],res.data['act_dev'][0]);
                }
              }else{
                that.$toast({
                  message: "选择的互动背包已离线,设置失败!",
                  position: 'middle',
                  duration: 2000
                });
                return;
              }
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
      matchActData(cur_dev,act_dev){
        var cur_dev_sn = cur_dev['dev_sn'];
        var cur_act_sn = cur_dev['ActDev'];
        var act_dev_sn = act_dev['dev_sn'];
        var act_act_sn = act_dev['ActDev'];
        this.$global.setDevParamList(['param_lock','dev_push_enable','WorkMode','ActDev'],[1,0,2,act_dev_sn]);//当前背包存储ActDev值
        this.$global.setDevParamList(['param_lock','dev_push_enable','WorkMode','ActDev'],[1,0,2,cur_dev_sn],act_dev_sn);
        this.$global.setDevParamList(['param_lock','dev_push_enable','ActDev'],[1,0,"''"],cur_act_sn);
        this.$global.setDevParamList(['param_lock','dev_push_enable','ActDev'],[1,0,"''"],act_act_sn);
      },
      /*getDevList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevAndMatch:true, 
            userId: that.user.id,
            userGroup: that.user.userGroup,
            prefixType: that.devType[that.deviceTypeSelect],
          }),
          Api:"getDevAndMatch",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(res.data.length != 0){
              var clickIndex = 0;
              that.OPTIONS_ACTDEVSN = [];
              for (var i = 0; i < res.data.length; i++) {
                var state = "";
                //当前登录用户有权限且在线背包list(过滤掉跟自己重名的设备)
                if((res.data[i]['online'] == '1') && (res.data[i]['dev_sn'] != that.ActiveDevice.dev_sn)){
                  if(res.data[i]['dev_push_status'] != '0'){
                    state = "推流:";
                  }else{
                    state = "在线:";
                  }
                  var option = {
                    text: state+res.data[i]['dev_name'],
                    value: res.data[i]['dev_sn'],
                  }
                  that.OPTIONS_ACTDEVSN.push(option);
                }
              }
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
      },*/
      getDevListforAct(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevListforAct:true, 
            actGrpId: "-1",
            /*userId: that.user.id*/
          }),
          Api:"getDevListforAct",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(res.data.length != 0){
              that.OPTIONS_ACTDEVSN = [];
              for (var i = 0; i < res.data.length; i++) {
                var state = "";
                //当前登录用户有权限且在线背包list(过滤掉跟自己重名的设备)
                if((res.data[i]['online'] == '1') && (res.data[i]['dev_sn'] != that.ActiveDevice.dev_sn)){
                  if(res.data[i]['dev_push_status'] != '0'){
                    state = "推流:";
                  }else{
                    state = "在线:";
                  }
                  var option = {
                    text: state+res.data[i]['dev_name'],
                    value: res.data[i]['dev_sn'],
                  }
                  that.OPTIONS_ACTDEVSN.push(option);
                }
              }
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
      getaAtDevList(){
        var that = this;
        var filterOwnList = [];
        for(var i = 0; i < that.OPTIONS_ACTDEVSN.length; i++){
          if(that.OPTIONS_ACTDEVSN[i].value != that.ActiveDevice.dev_sn){
          filterOwnList.push(that.OPTIONS_ACTDEVSN[i]);
          }
        }
        that.OPTIONS_ACTDEVSN = filterOwnList;
        //addSelOptions('actDevSn', filterOwnList);
      },
      /*formatNet(data){
        var that = this;
        that.netBoard = that.formatSwitch(data);
        that.updateCardSelOptions(data);//更新单卡选择select
      },*/
      userFunction(){
        if (this.user.id == SUPER) {
          this.show.SEI = true;//setting
          this.show.ArmSenderLogLevel = true;//setting
          this.show.ResendMode = true;//setting
          this.show.OpenfecMode = true;//setting
          if(this.feclevel_show){
            this.show.OpenfecLevel = true;//setting  
          }else{
            this.show.OpenfecLevel = false;//setting
          }
          this.show.dev_push_ip = true;//setting

          this.show.ActPushAddr = true;//control 互动 推流地址
          this.show.ActPullAddr = true;//control 互动 拉流地址
          this.show.devMod = true;//control 设置 背包模式
          $('#devMode_drop').show();
        } else {
          this.show.SEI = false;//setting
          this.show.ArmSenderLogLevel = false;//setting
          this.show.ResendMode = false;//setting
          this.show.OpenfecMode = false;//setting
          this.show.OpenfecLevel = false;//setting
          this.show.dev_push_ip = false;//setting
          this.show.ActPushAddr = false;//control 互动 推流地址
          this.show.ActPullAddr = false;//control 互动 拉流地址
          $('#devMode_drop').show();
          this.show.devMod = false;//control 设置 背包模式
        }
        //this.show.devMod = true;//调试暂时放开
      },
      changeSimMode(cardId){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            setSimMode : that.mode[cardId],
            cardId : cardId,
            devSN : that.ActiveDevice.dev_sn,
          }),
          Api:"setSimMode",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
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
      getNetBoard(cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevCardParam:true, 
            devSN: that.ActiveDevice?that.ActiveDevice.dev_sn:""
          }),
          Api:"getDevCardParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(cb){
              cb(res.data[0])
            }
            that.updateCardSelOptions(res.data[0]);//更新单卡选择select
          }else{
            that.netBoard = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatNetBoard(data){
        var that = this;
        var pushEnable = false;
        var netBoardArr = [];
        var netBoardObj = {};
        //更新单卡选择的下拉列表
        //updateCardSelOptions(data);/////live页面网卡选择调用
        //网卡设置
        for (var i = 0; i < data.length; i++) {
          netBoardObj = {};
          var cardId = data[i]["card_id"];
          //网卡的显示
          if( !data[i]['bShow'] ){
            continue;
          }
          var defaultText = '-';
          netBoardObj.send_br = defaultText;
          netBoardObj.card_rtt = defaultText;
          netBoardObj.rssi = defaultText;
          //netBoardObj.operator = defaultText;

          //判断权限
          var hasRights = that.$global.judgeUserHasDevRights();
          //判断锁定
          var locked = that.pageLock;
          //在线
          if (data[i]["online"] == "1") {
            netBoardObj.send_br = (data[i]["send_br"] / 1000.0).toFixed(1);//上传
            netBoardObj.card_rtt = (data[i]["card_rtt"]*1>999)?'>999':data[i]["card_rtt"];////rtt
            netBoardObj.rssi = data[i]["rssi"].split('dBm')[0];//信号强度
            //netBoardObj.operator = that.transOperator(data[i]["operator"]);//运营商
          }

          //更新启用和5G模式
          if(locked /*|| updateEnable*/){
            //启用
            if (data[i]["used"] == "1") {
              netBoardObj.used = true;
              pushEnable = true;
            } else { //禁用
              netBoardObj.used = false;
            }
          }
          //5G模式
          if (cardId.indexOf("lte") != -1) {
            if(data[i]["SimModule"] == "1"){
              that.modeOption[cardId] = that.OPTIONS_5G_MODE;
              that.mode[cardId] = data[i]["SetSimMode"];
            } else {
              that.modeOption[cardId] = that.OPTIONS_LTE_MODE;
              that.mode[cardId] = 3;
            }
          }
          //网卡没权限的，锁定的，都要设置disabled=true
          if (!hasRights || locked) {
            netBoardObj.disable = true;
          } else{
            netBoardObj.disable = false;
          }
          if (cardId.indexOf("lte") != -1) {
            if (!hasRights || locked) {
              netBoardObj.modeDisable = true;
            } else{
              netBoardObj.modeDisable = false;
            }
          }
          netBoardObj["card_id"] = data[i]["card_id"];
          netBoardObj["card_name"] = data[i]["card_name"];
          netBoardObj["online"] = data[i]["online"]
          netBoardObj["used"] = data[i]["used"]=="1"?true:false;
          netBoardObj["bShow"] = data[i]["bShow"]
          that.$set(that.spinClass,data[i]["card_id"],"");
          netBoardArr.push(netBoardObj); 
        }
        return netBoardArr;
      },
      formatSwitch(arr){
        var that = this;
        arr.forEach(function(item){
          if( item.card_id == "lte4" || item.card_id == "lte5" || item.card_id == "lte6"){
            item.cardShow = '0';
          } else if (item.card_id == "eth0" || item.card_id == "lte1" || item.card_id == "lte2" || item.card_id == "lte3"){
            item.cardShow = '1';
            var cardId = item.card_id;
            if(item["SimModule"] == "1"){
              that.modeOption[cardId] = that.OPTIONS_5G_MODE;
              that.mode[cardId] = item["SetSimMode"];
            } else {
              that.modeOption[cardId] = that.OPTIONS_LTE_MODE;
              that.mode[cardId] = 3;
            }
          } else if (item.card_id == "wifi" || item.card_id == "usb-lan" || item.card_id == "usb-5g1" || item.card_id == "usb-5g2") {
            if (item.online == "1") {
              item.cardShow = 1;
            } else {
              item.cardShow = 0;
            }
          }
          item.used = item.used=="1"?true:false;
          if(item.online == "1"){
            item.send_br = (item.send_br/1000.0).toFixed(1)
            item.card_rtt = item.card_rtt>999 ? ">999" : item.card_rtt;
            item.rssi = item.rssi.split('dBm')[0];
            item.operator = that.transOperator(item.operator);
          }else{
            item.send_br = '-';
            item.card_rtt = '-';
            item.rssi = '-';
            item.operator = '-';
          }
        })
        return arr;
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
      updateCardSelOptions(data){
        var that = this;
        var onlineArr = [];
        let isDV2010T = this.$global.sameToDV2010T(this.ActiveDevice.dev_sn);
        var card1080 = ["eth0","lte1","lte2","lte3"];
        var card2010 = ["eth0","lte1","lte2","lte3","lte4","lte5","lte6"];

        for (var i = 0; i < data.length; i++) {  
          if ((isDV2010T && card2010.indexOf(data[i]['card_id']) >-1 )
            || card1080.indexOf(data[i]['card_id']) >-1){
            var state = "";
            if(data[i]["online"] == '1'){
              state = "在线";
            }
            var json = {
              text: data[i]["card_name"]+(state==""?"":("("+state+")")),
              value: data[i]["card_id"],
            };
            onlineArr.push(json);
          }
        }
        //下拉框选项
        var valueArr = $.map(that.OPTIONS_TRANS_PUSH_CARD, function(e) { return e.value; });
        var nameArr = $.map(that.OPTIONS_TRANS_PUSH_CARD, function(e) {return e.text; });
        //更新标志
        var updateFlag = false;
        //是否更新
        if(that.OPTIONS_TRANS_PUSH_CARD.length != onlineArr.length){
          updateFlag = true;
        }else{
          for (var k = 0; k < onlineArr.length; k++) {
            if (onlineArr[k]["value"] != valueArr[k] || onlineArr[k]["text"] != nameArr[k]){
              updateFlag = true;
            }
          }  
        }
        //更新下拉选项
        if(updateFlag){
          that.OPTIONS_TRANS_PUSH_CARD = onlineArr;
          that.OPTIONS_TRANS_PULL_CARD = onlineArr;
          that.OPTIONS_TRANS_SRT = onlineArr;
        }
      },
      //定时获取背包参数
      getDeviceControlParam(initFlag){
        var that = this;
        that.$global.getDeviceParam(function(data){
          that.initDevParamByAjax(data,initFlag);
        })
      },
      initDevParamByAjax(data, initFlag){
        var that = this;
        var hasRights = that.$global.judgeUserHasDevRights();//用户权限
        var isOnline = (data['online'] == '0')?false:true;//判断在线
        if((data['param_lock_ack'] == '1' && data['param_lock'] == '1') //解锁
          && (that.lockUserId == that.user.id || that.lockUserId == "") //web解锁用户为当前用户
          && hasRights && isOnline){//解锁，在线且有权限
          that.pageLock = false;//锁显示：unlock
          
          if(initFlag){//初始化参数
            that.updateParam(data);
            that.setBtnDisabled(false);//插件enable
          }else{
            if (data['OffLinePushEnable'] == '1'){//文件回传中，输入编码下的参数不能编辑
              that.setEncodeParamDisabled(true);
            }else{
              that.setEncodeParamDisabled(false);
              if (data['dev_push_status'] == '1' || data['dev_push_enable'] == '1'){//传输中，传输模式不能编辑 单卡能编辑
                that.setTransParamDisabled(true);
              }
            } 
            that.setBtnDisabled(false);//插件enable
            return;
          }
        }else{//解锁，在线，有权限有一个不满足--显示lock
          that.pageLock = true;//锁显示：lock
          that.updateParam(data);
          that.setBtnDisabled(true);//插件disable
        }
      },
      //输入编码下的参数按钮置disabled
      setEncodeParamDisabled(disabled){
        var that = this;
        //视频比特率
        that.dis.dev_srVal_range = disabled;
        that.dis.dev_srVal_input = disabled;   
        /*setting canshu 
        //音频通道
        setSelectDisabled('#audioInput_sel', disabled);
        //视频接口
        setSelectDisabled('#videoInput_sel', disabled);
        //视频编码
        setSelectDisabled('#videoEncode_sel', disabled);
        //音频编码
        setSelectDisabled('#audioEncode_sel', disabled);
        //音频比特率
        setSelectDisabled('#AudioBitrate_sel', disabled);
        //码率控制
        setSelectDisabled('#bitrateMode_sel', disabled);
        //HDR
        setSelectDisabled('#HDR_sel', disabled);
        //时延模式
        setSelectDisabled('#latency_sel', disabled);
        //编码分辨率
        setSelectDisabled('#HDMI_format_sel', disabled);*/
      },
      //传输控制下的参数按钮置disabled
      setTransParamDisabled(disabled){
        var that = this;
        that.dis.PushTsType = disabled;//传输模式
        //that.dis.PushCard = disabled;//单卡选择
      },
      //更新插件数据
      updateParam(data){
        var that = this;
        //工作模式
        that.common.WorkMode = data["WorkMode"];
        if(that.common.WorkMode == '0'){
          that.common.WorkModePush = true;
          that.common.WorkModePull = false;
          that.common.WorkModeAct = false;
        }else if(that.common.WorkMode == '1'){
          that.common.WorkModePush = false;
          that.common.WorkModePull = true;
          that.common.WorkModeAct = false;
        }else{
          that.common.WorkModePush = false;
          that.common.WorkModePull = false;
          that.common.WorkModeAct = true;
        }
        that.common.WorkModeOri = data["WorkMode"];
        //推流-传输开关
        if(data.dev_push_enable == '0'){  //推流开关
          that.common.dev_push_enableVal = false;
          that.common.dev_push_enable = false;//拉流开关
          that.common.dev_srt = false;
          that.pushDisShow = false;
        }else if(data.dev_push_enable == '1'){
          that.common.dev_push_enableVal = true;
          that.common.dev_push_enable = true;//拉流开关
          that.common.dev_srt = true;
          that.$global.getPushUrls(that.formatPushUrlState);
        }
        if(this.curDevSeries == "1080"){
          //传输模式
          that.common.PushTsType = data["PushTsType"];
          if(data["PushTsType"] == "1"){
            that.show.cardSelShow = true;//显示网卡选择
            that.show.delayShow = false;//单卡隐藏延时
          }else{
            that.show.cardSelShow = false;//隐藏网卡选择
            that.show.delayShow = true;//汇聚显示延时
          }
          //单卡选择
          that.common.PushCard = that.$global.cardEnum2Id(data['PushTsNet']);
        }else if(this.curDevSeries == "4000"){
          that.show.delayShow = true;//4000显示延时
        }
        //拉流-HDMI输出
        that.common.PullMHdmiOut = data['PullMHdmiOut'];
        //拉流-HDMI音频输出
        that.common.PullMHdmiAS = data['PullMHdmiAS'];
        //拉流-网卡选择
        that.common.PullTsNet = that.$global.cardEnum2Id(data['PullTransIf']);
        //拉流-传输开关
        that.common.PullTsOpen = data['dev_push_enable']==1?true:false;
        //视频比特率范围
        if(data["video_encode"] == "4"){
          that.BITRATE_MAX = that.$global.BITRATE_MAX3_4000;
        }
        if(data["latency"] == 1){//超低延时
          that.BITRATE_MIN = that.$global.BITRATE_MIN2_4000;
        }
        that.common.dev_srVal = (data.dev_sr / 1000).toFixed(1); //(Mbps)
        if(that.common.dev_srVal > that.BITRATE_MAX){
          that.common.dev_srVal = that.BITRATE_MAX;
          that.common.dev_srVal_input = that.BITRATE_MAX;
          this.setDeviceParam('dev_sr_input');
        }else if(that.common.dev_srVal < that.BITRATE_MIN){
          that.common.dev_srVal = that.BITRATE_MIN;
          that.common.dev_srVal_input = that.BITRATE_MIN;
          this.setDeviceParam('dev_sr_input');
        }else{
          that.common.dev_srVal_range = that.common.dev_srVal*10;
          that.common.dev_srVal_input = that.common.dev_srVal;  
        }
        
        //视频比特率  互动
        that.common.dev_srVal_range_act = that.common.dev_srVal*10;
        that.common.dev_srVal_input_act = that.common.dev_srVal;
        
        //延时
        if(that.common.dev_srVal_input > 40){
          this.DELAY_MAX = 10;
        }else{
          this.DELAY_MAX = 20;
        }
        that.common.dev_delayVal = (data.dev_delay / 1000).toFixed(1); //(s)
        if(that.common.dev_delayVal > this.DELAY_MAX){
          that.common.dev_delayVal = this.DELAY_MAX
        }
        that.common.dev_delayVal_range = that.common.dev_delayVal*10;
        that.common.dev_delayVal_input = that.common.dev_delayVal;
        //互动背包
        that.common.ActDev = data['ActDev'];
        //互动显示
        that.common.ActDisplay = data['ActDisplay'];
        //HDMI输出
        that.common.ActHdmiOut = data['ActHdmiOut'];
        //耳机音频选择
        that.common.ActMAudioOut = data['ActMAudioOut'];
        //传输通道
        that.common.SrtTransIf = that.$global.cardEnum2Id(data['SrtTransIf']);
        //网络模式
        var cardId = that.common.SrtTransIf;
        if(cardId.indexOf("lte") != -1){
          this.show.netWorkMode = true;//显示网络模式
          this.getActNetModeParam(cardId);//获取网络模式
        }else{
          this.show.netWorkMode = false;//隐藏网络模式
        }
        for(var i=0; i<that.OPTIONS_TRANS_SRT.length; i++){
          if(that.common.SrtTransIf == that.OPTIONS_TRANS_SRT[i]["value"]
            && that.OPTIONS_TRANS_SRT[i]["text"].indexOf("在线") == -1){
            that.dis.dev_srt = true;//互动的传输开关
          }
        }

        //互动拉流地址
        that.getActAddr(data['ActPushAddr'],data['ActPullAddr']);
        that.common.ActPullAddr = data['ActPullAddr'];
        //互动推流地址
        that.common.ActPushAddr = data['ActPushAddr'];
      },
      //1080互动-网络模式
      getActNetModeParam(cardId){
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          return;
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            getDevCardParam: "true",
            devSN: devSN
          }),
          Api:"getDevCardParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var pushEnable = false;
            var data = res.data[0];
            //网卡设置
            for (var i = 0; i < data.length; i++) {
              if(data[i]["card_id"] == cardId){
                //5G模式
                if (cardId.indexOf("lte") != -1) {
                  if(data[i]["SimModule"] == "1"){
                    that.OPTIONS_NET_WORKMODE = that.OPTIONS_5G_MODE;
                    that.common.netWorkMode = data[i]["SetSimMode"];
                  } else {
                    that.OPTIONS_NET_WORKMODE = that.OPTIONS_LTE_MODE
                    that.common.netWorkMode = 3;
                  }
                }
              }
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
      //根据互动地址 提取参数
      getActAddr(pushurl,pullurl){
        var that = this;
        if(pushurl == '' || pullurl == ''){
          return
        }
        //srt://118.190.141.199:9090?streamid=uplive.deviser.com.cn/live/2000182146&latency=125
        //118.190.141.199:9090?streamid=uplive.deviser.com.cn/live/2000182146
        var tempstr = pullurl.split('://')[1];
        if(!tempstr){
          return;
        }
        //118.190.141.199:9090
        var ip_port = tempstr.split('?')[0];
        //streamid=uplive.deviser.com.cn/live/2000182146&latency=125
        //处理多个问号
        var nIndex = pullurl.indexOf('?');
        var paramstr = pullurl.substring(nIndex+1,pullurl.length);
        //2000182146&latency=125
        var actDev = pullurl.split('live/')[1];
        //2000182146
        actDev = actDev.split('&')[0];
        that.common.ActDev = actDev;//互动背包
        //118.190.141.199
        that.common.actAddrIp = ip_port.split(':')[0];//流媒体内网IP
        //9090
        that.common.actAddrPort = ip_port.split(':')[1];//端口
        //推流延时
        var pushLatency = pushurl.split('live/')[1]; //2000182146&latency=125
        pushLatency = pushLatency.split('latency=')[1];
        if(pushLatency == ''){
          pushLatency = 125;
        }
        that.common.actPushLatency = pushLatency;
        //拉流延时
        var pullLatency = pullurl.split('live/')[1];
        pullLatency = pullLatency.split('latency=')[1];
        if(pullLatency == ''){
          pullLatency = 125;
        }
        that.common.actPullLatency = pullLatency;
      },
      //更新插件disable状态
      setBtnDisabled(dis){
        var that = this;
        if(this.curDevSeries == "1080"){
          this.dis.WorkMode = dis;
          if(this.common.dev_push_enableVal){//推流
            //推流 
            this.dis.PushTsType = true;//传输模式
            this.dis.PushCard = true;//网卡选择
          }else{
            //推流 
            this.dis.PushTsType = dis;//传输模式
            this.dis.PushCard = dis;//网卡选择
          }
          if(this.common.PullTsOpen){//拉流
            /*//推流 
            this.dis.PushTsType = true;//传输模式
            this.dis.PushCard = true;//网卡选择*/
            //拉流
            this.dis.PullMHdmiAS = true;//HDMI音频输出
            this.dis.PullMHdmiOut = true;//HDMI视频输出
            this.dis.PullTsNet = true;//网卡选择
          }else{
            /*//推流 
            this.dis.PushTsType = dis;//传输模式
            this.dis.PushCard = dis;//网卡选择*/
            //拉流
            this.dis.PullMHdmiAS = dis;//HDMI音频输出
            this.dis.PullMHdmiOut = dis;//HDMI视频输出
            this.dis.PullTsNet = dis;//网卡选择
          }
          //互动
          this.dis.dev_srt = dis;//互动的传输开关
          this.dis.ActDev = dis; //互动背包
          this.dis.ActDisplay = dis; //切换显示
          this.dis.ActHdmiOut = dis; //HDMI输出
          this.dis.ActMAudioOut = dis;//耳机音频选择
          if(this.common.dev_srt){//互动的传输开关打开
            this.dis.SrtTransIf = true; //传输通道  
            this.dis.netWorkMode = true; //网络模式  
            this.dis.actAddrIp = true;//互动 流媒体内网IP
            this.dis.actAddrPort = true;//互动 端口
            this.dis.actPushLatency = true;//互动 推流延时
            this.dis.actPullLatency = true;//互动 拉流延时
          }else{
            this.dis.SrtTransIf = dis; //传输通道  
            this.dis.netWorkMode = dis; //网络模式  
            this.dis.actAddrIp = dis;//互动 流媒体内网IP
            this.dis.actAddrPort = dis;//互动 端口
            this.dis.actPushLatency = dis;//互动 推流延时
            this.dis.actPullLatency = dis;//互动 拉流延时
          }
          this.dis.ActPushAddr = dis;//互动 推流地址
          this.dis.ActPullAddr = dis;//互动 拉流地址
          //通用
          this.dis.dev_push_enable = dis;//传输开关
          this.dis.dev_delayVal_range = dis;//延时range
          this.dis.dev_delayVal_input = dis;//延时input
          this.dis.dev_srVal_range = dis;//视频比特率range
          this.dis.dev_srVal_input = dis;//视频比特率input
          this.dis.dev_srVal_range_act = dis;//互动-视频比特率-range
          this.dis.dev_srVal_input_act = dis;//互动-视频比特率-input

          //拉流
          //$('#pullOpen').bootstrapSwitch('disabled', disabled);//拉流的传输开关
          this.dis.PullTsOpen = dis;//拉流--传输开关
        }else if(this.curDevSeries == "4000"){
          //通用
          this.dis.dev_push_enable = dis;//传输开关
          this.dis.dev_delayVal_range = dis;//延时range
          this.dis.dev_delayVal_input = dis;//延时input
          this.dis.dev_srVal_range = dis;//视频比特率range
          this.dis.dev_srVal_input = dis;//视频比特率input
          //互动接收机
          //文件
          //*4000的互动接收机
          /*$('#dev_interactive_mode').bootstrapSwitch('disabled', disabled);//互动模式
          $('#dev_srt_4000').bootstrapSwitch('disabled', disabled);//互动开关
          setSelectDisabled('#srtAudioInput_sel', disabled);//音频切换
          $('#dev_srt_full').bootstrapSwitch('disabled', disabled);//全屏
          setSelectDisabled('#srtTrans4000_sel', disabled);//传输通道
          setSelectDisabled('#srtAudioMode_sel', disabled);//音频模式
          //*文件
          $('#back_enable').bootstrapSwitch('disabled', disabled);//回传按钮
          setSelectDisabled('#back_sel', disabled);//回传方式  
          $('#updateFileIcon').attr('disabled', disabled);//刷新文件列表按钮*/
        }
        //DV5000T
      },

      changeWorkMode(){
        var that = this;
        if(this.common.WorkModeOri == 0 || this.common.WorkModeOri == 2){//推流or互动
          //判断当前(切换之前)工作模式是否处于传输开关开启状态
          that.$global.getDevOneParam('', 'dev_push_enable', function(data) {
            if (data.dev_push_enable == '1') {//推流，互动传输开关开启
              that.common.WorkMode = that.common.WorkModeOri;
              that.$toast({
                message: '请先停止推流再进行模式切换!',
                position: 'middle',
                duration: 2000
              });
              return;
            }else{
              that.common.WorkModeOri = that.common.WorkMode;
              that.SET_DEVICE_MODE_SELECT(that.common.WorkMode);
              that.setDeviceParam('WorkMode',that.common.WorkMode);
              that.changeWorkModePage();
            }
          });
        }else if(this.common.WorkModeOri == 1){
          that.$global.getDevOneParam('', 'dev_push_enable', function(data) {
            if (data.dev_push_enable == '0') {//拉流，传输开关关闭
              that.common.WorkModeOri = that.common.WorkMode;
              that.SET_DEVICE_MODE_SELECT(that.common.WorkMode);
              that.setDeviceParam('WorkMode',that.common.WorkMode);
              that.changeWorkModePage();
              that.getDeviceControlParam(true);//切换模式后，重新获取一遍组件值
            }else{
              that.common.WorkMode = that.common.WorkModeOri;
              that.$toast({
                message: '请先停止推流再进行模式切换!',
                position: 'middle',
                duration: 2000
              });
              return;
            }
          });
        }
      },
      changeWorkModePage(){
        switch(this.common.WorkMode){
          case 0:
            this.common.WorkModePush = true;
            this.common.WorkModePull = false;
            this.common.WorkModeAct = false;
            break;
          case 1:
            this.common.WorkModePush = false;
            this.common.WorkModePull = true;
            this.common.WorkModeAct = false;
            break;
          case 2:
            this.common.WorkModePush = false;
            this.common.WorkModePull = false;
            this.common.WorkModeAct = true;
            break;
        }
      },
      changeTransMode(){
        var that = this;
        that.setDeviceParam('PushTsType');
        if(that.common.PushTsType == "1"){//单卡
          that.show.cardSelShow = true;
          that.show.delayShow = false;//单卡隐藏延时
        }else{
          that.show.cardSelShow = false;
          that.show.delayShow = true;
        }
      },
      changeCard(){
        var that = this;
        var cardId = that.common.PushCard;
        this.setDeviceParam('PushTsNet',that.$global.cardId2Enum(cardId));
      },
      changePullCard(){
        var that = this;
        var cardId = that.common.PullTsNet;
        this.setDeviceParam('PullTransIf',that.$global.cardId2Enum(cardId));
      },
      //检查推流地址是否只选了一个，大于一个全部取消勾选，加提示
      /*checkPushUrlOnlyOne(cb){
        console.log("checkPushUrlOnlyOne")
        var that = this;
        that.$global.getPushUrls(function(data){
          var pushAddressCount = 0;
          for(var i=0; i<data.length; i++){
            if(data[i]["nEnable"] == "1"){
              pushAddressCount += 1;
            }
          }
          var info = "";
          if(pushAddressCount > 1){
            for(var j=0; j<data.length; j++){
              if(data[j].nEnable == 1){
                data[j].nEnable = 0;
                that.setPushUrlEnable(data[j],0);
                //$('#url_table').bootstrapTable('uncheck',i);
              }
            }
            info = "单卡只能选择一个地址！";
            that.disTransSwitch(info);
          }else if(pushAddressCount == 0){
            info = "请选择推流地址";
            that.disTransSwitch(info);
          }else{
            cb();
          }
        })
      },*/
      disTransSwitch(info){
        var that = this;
        that.$toast({
          message: info,
          position: 'middle',
          duration: 2000
        });
        setTimeout(function(){
          that.common.dev_push_enableVal = false;  
        },1000)
      },
      setPushUrlEnable(row, flag){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            UrlcheckEnable: true,
            id: row.id,
            nEnable: flag,
          }),
          Api:"UrlcheckEnable",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
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
      switchCard(card){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            setCardEnable:true,
            cardId: card.card_id,
            devSN: that.ActiveDevice.dev_sn,
            used: card.used ? "1" : "0"
          }),
          Api:"setCardEnable",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          //页面随activeDevice实时刷新，无需调用getNetBoard
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatData(data){
        var that = this;
        if(data.dev_push_enable == '0' && data.dev_push_status == '0'){  //推流开关
          data.dev_push_enableVal = false;
          that.pushDisShow = false;
        }else if(data.dev_push_enable == '1'){
          data.dev_push_enableVal = true;
          that.$global.getPushUrls(that.formatPushUrlState);
        }
        data.dev_srVal = (data.dev_sr / 1000).toFixed(1); //(Mbps)
        data.dev_srVal_range = data.dev_srVal*10;
        data.dev_srVal_input = data.dev_srVal;
        data.dev_srVal_range_act = data.dev_srVal*10;
        data.dev_srVal_input_act = data.dev_srVal;
        data.dev_delayVal = (data.dev_delay / 1000).toFixed(1); //(s)
        data.dev_delayVal_range = data.dev_delayVal*10;
        data.dev_delayVal_input = data.dev_delayVal;

        return data;
      }, 
      //推流地址状态
      formatPushUrlState(data){
        var that = this;
        var closeStatusCount = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].push_sel == '1') {
            if (data[i].push_status == 'Closed') {
              that.transErrReason = "视频流异常";
              closeStatusCount++;
            } else if (data[i].push_status == 'Open output file error!') {
              that.transErrReason = "推流地址不通";
              closeStatusCount++;
            }
          }
        }
        that.pushDisShow = false;
        if(closeStatusCount > 0){
          if(that.common.dev_push_enableVal){
            that.pushDisShow = true;
          }
        }
      },
      
      //推流传输开关
      setDevPushEnable(){
        var that = this;
        this.show.pushDisShow = false;
        if (this.common.dev_push_enableVal == true) {
          this.$global.getPushUrls(function(data){
            //单卡模式直接开启,汇聚模式判断是否有启用的网卡
            if(that.common.PushTsType == 0){//汇聚
              var cardUsed = that.getUsedCardCount();
              if (cardUsed == 0) {
                that.$toast({
                  message: "无启用的网卡！",
                  position: 'middle',
                  duration: 2000
                });
                setTimeout(function(){
                  that.common.dev_push_enableVal = false;  
                },1000)
                return;
              }
            }else{//单卡模式
              var selectCardName = "";
              for(var k=0; k<that.OPTIONS_TRANS_PULL_CARD.length; k++){
                if(that.OPTIONS_TRANS_PULL_CARD[k]["value"] == that.common.PushCard){
                  selectCardName = that.OPTIONS_TRANS_PULL_CARD[k]["text"];
                }
              }
              if(selectCardName.indexOf("在线") == -1){//启用的单卡不在线
                that.$toast({
                  message: "无启用的网卡！",
                  position: 'middle',
                  duration: 2000
                });
                setTimeout(function(){
                  that.common.dev_push_enableVal = false;  
                },1000)
                return; 
              }
              var datas = data;
              var selectedCount = 0;
              for (var i = 0; i < datas.length; i++) {
                if (datas[i].oneCardEnable == 1) {
                  selectedCount++;
                }
              }
              if(selectedCount > 1){
                /*$('#url_table').bootstrapTable('refresh', {
                  silent: true
                });*/
                that.$toast({
                  message: "单卡模式下仅支持1路推流地址！",
                  position: 'middle',
                  duration: 2000
                });
                setTimeout(function(){
                  that.common.dev_push_enableVal = false;  
                },1000)
                return;
              }
            }
            //1080判断有无推流地址
            var pushUrlSel = 0;
            pushUrlSel = that.getUsedPushUrlCount(data);//获取勾选的推流地址个数
            if (pushUrlSel == 0 && that.curDevSeries == "1080") {
              var info = "无勾选的推流地址，无法开启直播推流！";
              that.disTransSwitch(info);
              return;
            }
            //回传中要询问
            var text = '';
            that.getDevState(function(data){
              if(data["online"] == '1' && data["OffLinePushEnable"] == '1'){//文件离线回传中
                var text = '是否停止背包文件回传？';
                //询问
                MessageBox.confirm('',{
                  title:'提示',
                  message: text,
                  confirmButtonText:'确定',
                  cancelButtonText:'取消'
                }).then(action => {
                  if (action == 'confirm') {
                    //停止文件回传
                    that.clickBackStopBtn();
                    //$('#back_enable').bootstrapSwitch('state', false, true);
                    setTimeout(function(){
                      that.common.dev_push_enableVal = false;  
                    },500)
                  }
                }).catch(error =>{
                  setTimeout(function(){
                    that.common.dev_push_enableVal = false;  
                  },500)
                });

              } else {
                that.setDeviceParam('dev_push_enable');
                //打开传输
                if(that.curDevSeries == "1080"){
                  that.common.dev_srt = true;//互动传输开关和推流传输开关状态切换保持  
                }/*else if(that.curDevSeries == "4000"){
                  that.setDeviceParam('dev_push_enable');
                }*/
              }
            })
          })
        } else {
          that.setDeviceParam('dev_push_enable');
          that.show.pushDisShow = false;
          if(that.curDevSeries == "1080"){
            that.common.dev_srt = false;//互动传输开关和推流传输开关状态切换保持
          }
        }
      },
      //获取背包状态
      getDevState(cb){
        var that = this;
        var devSn = this.ActiveDevice.dev_sn;
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
            if(cb){
              cb(res.data[0]);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //拉流传输开关
      changePullOpen(){
        var that = this;
        //0:关闭 1:打开
        if (this.common.PullTsOpen) {//拉流传输开关--开
          for(var i=0; i<this.OPTIONS_TRANS_PULL_CARD.length; i++){
            if(this.OPTIONS_TRANS_PULL_CARD[i]["value"] == this.common.PullTsNet){
              if(this.OPTIONS_TRANS_PULL_CARD[i]["text"].indexOf("在线") == -1){
                this.$toast({
                  message: "没有可用的网卡",
                  position: 'middle',
                  duration: 2000
                });
                setTimeout(function(){
                  that.common.PullTsOpen = false;
                },500)
                return;
              }else{
                this.setDeviceParam('dev_push_enable',1);
                /*this.dis.PullTsNet = true;//传输开关打开后，传输通道不能修改
                this.dis.PullMHdmiOut = true;
                this.dis.PullMHdmiAS = true;*/
              }
            }
          }
        } else {
          this.setDeviceParam('dev_push_enable',0);
          /*this.dis.PullTsNet = false;//传输开关关闭后，传输通道可以修改
          this.dis.PullMHdmiOut = false;
          this.dis.PullMHdmiAS = false;*/
        }
      },
      changePullMHdmiOut(){
        this.setDeviceParam('PullMHdmiOut',this.common.PullMHdmiOut);
      },
      changePullMHdmiAS(){
        this.setDeviceParam('PullMHdmiAS',this.common.PullMHdmiAS);
      },
      //获取勾选的推流地址个数
      getUsedPushUrlCount(data){
        var that = this;
        var res = 0;
        //1080配对1080R时，不支持推流功能
        if(this.$global.getRcvSeries(that.ActiveDevice.rcv_sn) === this.R1080_RCV){
          res = -1;
        }else{
          if(this.common.PushTsType == 1){//单卡
            for(var i=0; i<data.length; i++){
              if(data[i]["oneCardEnable"] == "1"){
                res += 1;
                break;
              }
            }
          }else{//汇聚
            for(var i=0; i<data.length; i++){
              if(data[i]["nEnable"] == "1"){
                res += 1;
              }
            }
          }
        }
        return res;
      },
      //互动传输开关
      changeDevSrt(){
        var that = this;
        var actDev = this.common.ActDev;//配对背包
        var actIp = this.common.actAddrIp;//流媒体IP
        var actPort = this.common.actAddrPort;//流媒体Port
        if (this.common.dev_srt == true) {
          if(!this.$global.isValidSn(actDev)){
            this.$toast({
              message: "请输入配对背包序列号",
              position: 'middle',
              duration: 2000
            });
            setTimeout(function(){
              that.common.dev_srt = false;  
            },500)
            
            return;
          }
          if(!this.$global.isValidIP(actIp)){
            this.$toast({
              message: "请输入IP",
              position: 'middle',
              duration: 2000
            });
            //this.common.dev_srt = false;
            setTimeout(function(){
              that.common.dev_srt = false;  
            },500)
            return;
          }
          if(!this.$global.isValidPort(actPort)){
            this.$toast({
              message: "请输入Port",
              position: 'middle',
              duration: 2000
            });
            //this.common.dev_srt = false;
            setTimeout(function(){
              that.common.dev_srt = false;  
            },500)
            return;
          }
          for(var i=0; i<this.OPTIONS_TRANS_SRT.length; i++){
            if(this.common.SrtTransIf == this.OPTIONS_TRANS_SRT[i]["value"]
              && this.OPTIONS_TRANS_SRT[i]["text"].indexOf("在线") == -1){
              this.$toast({
                message: "没有可用的网卡",
                position: 'middle',
                duration: 2000
              });
              setTimeout(function(){
                that.common.dev_srt = false;  //互动的传输开关
              },500)
              
              return;
            }
          }

          //同时设置两个背包的推流开关，显示切换到远端
          //setDevParam('dev_push_enable', 1, switchId);
          this.$global.setDevParamList(['dev_push_enable'],[1]);
          this.$global.setDevParamList(['param_lock','dev_push_enable'],[1,1],actDev);
          
          //this.common.ActDisplay = 1;
          this.common.dev_push_enableVal = true;//互动传输开关和推流传输开关状态切换保持
        } else {
          //互动关
          this.actModeClose(actDev);
        }
      },
      //
      changeActMAudioOut(){
        this.setDeviceParam('ActMAudioOut', this.common.ActMAudioOut);
      },
      //修改传输通道
      changeSrtTransIf(){
        var that = this;
        this.setDeviceParam('SrtTransIf', that.$global.cardId2Enum(that.common.SrtTransIf))
        for(var i=0; i<this.OPTIONS_TRANS_SRT.length; i++){
          if(this.common.SrtTransIf == this.OPTIONS_TRANS_SRT[i]["value"]
            && this.OPTIONS_TRANS_SRT[i]["text"].indexOf("在线") == -1){
            this.dis.dev_srt = true;//互动的传输开关
          }
        }
        for(var i=0; i<this.OPTIONS_TRANS_SRT.length; i++){
          if(this.common.SrtTransIf == this.OPTIONS_TRANS_SRT[i]["value"]
            && this.OPTIONS_TRANS_SRT[i]["text"].indexOf("在线") == -1){
            this.dis.dev_srt = true;//互动的传输开关
          }
        }
        var cardId = this.common.SrtTransIf;
        if(cardId.indexOf("lte") != -1){
          this.show.netWorkMode = true;
          this.getActNetModeParam(cardId);//网络模式
        }else{
          this.show.netWorkMode = false;
        }
      },
      //修改网络模式
      changeNetWorkMode(){
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;;
        var cardId = this.common.SrtTransIf;
        var modeVal = this.common.netWorkMode;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            setSimMode:modeVal,
            cardId:cardId,
            devSN:devSN,
          }),
          Api:"setSimMode",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //互动模式关闭
      actModeClose(actDev){//互动关
        this.$global.setDevParamList(['dev_push_enable'],[0]);
        this.$global.setDevParamList(['param_lock','dev_push_enable'],[1,0],actDev);
        this.common.dev_push_enableVal = false;//互动传输开关和推流传输开关状态切换保持
      },
      checkEnableUrl(cb){
        var that = this;
        that.$global.getPushUrls(function(data){
          var pushAddressCount = 0;
          for(var i=0; i<data.length; i++){
            if(data[i]["nEnable"] == "1"){
              pushAddressCount += 1;
            }
          }
          if(cb){
            cb(pushAddressCount);
          }
        })
      },
      //禁用所有推流地址
      stopDevPushUrl(cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            stopDevPushUrl:true,
            boardId: that.ActiveDevice.dev_sn
          }),
          Api:"stopDevPushUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(cb){
              cb()
            }
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
            that.common.dev_push_enableVal = true; 
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      setDeviceParam(key, val){
        var that = this;
        var devParamCol = key;
        var value;
        if(key == "dev_push_enable"){
          if(val != undefined){
            value = val;
          }else{
            value = that.common.dev_push_enableVal? "1" : "0";
          }
        }else if(key == "dev_sr_input"){
          value = parseFloat(that.common.dev_srVal_input) * 1000;
          that.common.dev_srVal_range = that.common.dev_srVal_input*10;
          devParamCol = "dev_sr";
        }else if(key == "dev_sr_range"){
          value = parseFloat(that.common.dev_srVal_range/10) * 1000;
          that.common.dev_srVal_input = that.common.dev_srVal_range/10;
          devParamCol = "dev_sr";
        }else if(key == "dev_delay_input"){
          value = parseFloat(that.common.dev_delayVal_input) * 1000;
          that.common.dev_delayVal_range = that.common.dev_delayVal_input*10;
          that.common.dev_delayVal = that.common.dev_delayVal_input;
          devParamCol = "dev_delay";
        }else if(key == "dev_delay_range"){
          value = parseFloat(that.common.dev_delayVal_range/10) * 1000;
          that.common.dev_delayVal_input = that.common.dev_delayVal_range/10;
          that.common.dev_delayVal = that.common.dev_delayVal_input;
          devParamCol = "dev_delay";
        }else if(key == "PushTsType"){//传输模式
          value = that.common.PushTsType;
        }else{
          if(val || val == "0"){
            value = val;
          } 
        }
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
          that.getDeviceControlParam();
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获取启用的网卡个数
      getUsedCardCount() {
        var that = this;
        var netBoards = that.netBoard;
        var usedCardCount = 0;
        for(let i=0; i<netBoards.length; i++){
          if(netBoards[i].bShow && netBoards[i].used){
            usedCardCount++;
          }
        }
        return usedCardCount;
      },
      //点击停止回传按钮
      clickBackStopBtn() {
        var that = this;
        //回传停止，隐藏传输状态
        /*$('#fileLi').children().html('文件');
        $('#updateFileIcon').removeClass('disabledIcon');*/
        this.setDeviceParam('FileCtrlFlag', 1);
        //devSn
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          this.$toast({
            message: "未选择背包",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            setDevFileStop: devSN,
          }),
          Api:"setDevFileStop",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //网卡复位
      clickSimReset(id, enable){
        var that = this;
        if(enable){
          this.$toast({
            message: "请先解锁",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(this.spinClass[id] == ""){
          this.setSimCardReset(id,this.ActiveDevice["dev_sn"],1,function(devSn,cardId){
            that.setViewSimCardReset(id,1);
          });
        }else{
          this.setSimCardReset(id,this.ActiveDevice["dev_sn"],0,function(devSn,cardId){
            that.setViewSimCardReset(id,0);
          });
        }
      },
      //设置网卡复位
      setSimCardReset(cardId, devSN, resetFlag,callback) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            setCardReset: true,
            cardId: cardId,
            devSN: devSN,
            reset:resetFlag,
          }),
          Api:"setCardReset",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(typeof(callback) === 'function'){
            callback(res['data']['devSN'],res['data']['cardId']);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //设置网卡复位按钮的显示
      setViewSimCardReset(cardId,resetFlag){
        if(+resetFlag === 1){
          this.$set(this.spinClass,cardId, 'fa-spin');  
        } else{
          this.$set(this.spinClass,cardId, '');  
        }
        console.log(this.spinClass)
      }
    }
  }
</script>

<style scoped>
    .control{
        margin-top: 60px;
        height: clac(100% - 115px);
        padding-bottom: 62px;
        overflow-y: auto;
        background-color: #212227;
    }
    .Group{
        margin-top: 0px;
    }
    .GroupTitle{
        border-top: 1px solid #222;
        border-bottom: 1px solid #222;
        text-align: left;
        text-indent: .1rem;
        padding: .06rem .00rem;
        background: linear-gradient(270deg,#111 0,#333 50%);
        /*border-radius: 5px;*/
        font-size: .15rem;
        font-weight:500;
        color: #B7B7B7
    }
    .GroupItem{
        padding: .1rem .1rem;
        border-bottom: 1px solid #333;
    }
    .GroupItemField{
        overflow: hidden;
        /*margin-bottom: .1rem;*/
    }
    .GroupItemTitle{
        width: 30%;
        float: left;
        line-height: .25rem;
        text-align: left;
        font-size: .14rem;
        color: #EEEEEE;
    }
    .GroupItemValue{
        width: 70%;
        float: left;
        text-align: left;
    }
    .ItemRange{
        width: 65%;
        margin-right: .08rem;
    }
    .ItemIpt{
        width:1.8rem;
        height: .22rem;
        line-height: .22rem;
        outline: none;
        border:1px solid #4b5056;
        border-radius: 5px;
        font-size: .12rem;
    }
    .byteIpt{
        float: left;
        margin-top: .02rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        font-size: .14rem;
        font-weight: 600;
    }
    .byteRange{
        float: left;
    }
    .netBoardTable{
        width: 100%;
        color: #EEE;
        font-size: .15rem;
        font-weight: 500;
    }
    .td{
        padding: .03rem 0;
        vertical-align: middle;
    }
    .green{
        color: #3dcb64;
    }
    .gray{
        color: #7E7E7E;
    }
    .mint-switch{
        transform: scale(.7);
        transform-origin:left;
    }
    .Group:nth-last-of-type(1){
        margin-bottom: .2rem;
    }
    .ItemSelect{
        width: 1.8rem;
        height: .26rem;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
    }
    .selectMode{
      width: .6rem;
      height: .28rem;
      text-indent: 3px;
    }
    .ItemBtn{
      font-size: .14rem;
      height: auto;
      padding: 3px 10px;
    }
    input:disabled{
      color:#b7b7b7;
    }
</style>
<style>
    .mint-switch-input:checked + .mint-switch-core{
        border-color: #3d81f1;
        background-color: #3d81f1;
    }
    .mt-range-progress{
        background-color: #3d81f1;
    }
    .mint-switch{
        transform: scale(.7);
    }
    .mt-range-thumb{
        width: 14px;
        height: 14px;
        top:0.03rem;
        border: 5px solid #3d81f1;
    }
</style>