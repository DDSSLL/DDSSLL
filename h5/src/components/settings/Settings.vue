<template>
  <div class="settings mainPage">
    <Device page='dev'></Device>
    <div class="Group" v-if="dev1080Show">
      <div class="GroupItem" style="padding: .1rem;border-bottom:0;text-indent:.1rem">
        <div class="GroupItemField">
          <div class="GroupItemTitle">背包模式</div>
          <div class="GroupItemValue">
            <span style="font-size: .14rem;vertical-align: baseline;line-height: .3rem;color:#fff;">{{options.WorkMode}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="Group"><!-- 传输控制 -->
      <div class="GroupTitle" @click="transConfigShow=!transConfigShow">
        传输控制
        <i class="titleIcon fa" :class="[transConfigShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <span style="float:right">
          序列号:
          <span>{{ options.curDevSn }}</span>
        </span>
      </div>
      <transition name="slide-fade">
        <div v-show="transConfigShow">
          <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 传输IP -->
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
                <mt-switch v-model="options.record" @change="$global.setDeviceParam('record',options.record?'1':'0')" :disabled="!pageLock?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 重传开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">重传开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.ResendMode" @change="$global.setDeviceParam('ResendMode',options.ResendMode?'1':'0')" :disabled="!pageLock?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 纠错开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">纠错开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.OpenfecMode" @change="$global.setDeviceParam('OpenfecMode',options.OpenfecMode?'1':'0')" :disabled="!pageLock?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="user.id==SUPER && options.OpenfecMode"><!-- 纠错能力 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">纠错能力</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.OpenfecLevel" @change="$global.setDeviceParam('OpenfecLevel', options.OpenfecLevel)"  :disabled="!pageLock?false:true">
                  <template v-for="item in OPTIONS_FEC_LEVEL">
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
                <select class="ItemSelect" v-model="options['Eth0Type']" @change="changeEth0"  :disabled="!pageLock?false:true">
                  <template v-for="item in OPTIONS_ETH0_TYPE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- WiFi/热点 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">WiFi/热点</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.WiFiSwitch" @change="$global.setDeviceParam('WiFiSwitch', options['WiFiSwitch']?1:0)" :disabled="pageLock||(options.dev_push_enable==1)?true:false">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 显示别名 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">显示别名</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.DevAliasSwitch" @change="$global.setDeviceParam('DevAliasSwitch',options.DevAliasSwitch?'1':'0')" :disabled="!pageLock?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 别名 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">别名</div>
              <div class="GroupItemValue">
                <input class="ItemInput" v-model="options.DevAlias" type="text" @change="changeAliasName" pattern="^[A-z0-9\u4e00-\u9fa5+-@()（） ]{1,10}$" :disabled="!pageLock?false:true">
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
          <div v-if="dev1080Show">
            <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- SEI -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">SEI</div>
                <div class="GroupItemValue">
                  <mt-switch v-model="options.SEI" @change="$global.setDeviceParam('SEI',options.SEI?'1':'0')" :disabled="!pageLock?false:true">
                  </mt-switch>
                </div>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 视频输入 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">视频输入</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.video_input" @change="changeVideoInput"  :disabled="!pageLock?false:true">
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
                <select class="ItemSelect" v-model="options.audio_input" @change="$global.setDeviceParam('audio_input',options.audio_input)"  :disabled="!pageLock?false:true">
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
                <select class="ItemSelect" v-model="options.video_encode" @change="changeVideoEncode" :disabled="!pageLock?false:true">
                  <template v-for="item in OPTIONS_VIDEOENCODE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="audioEncShow"><!-- 音频编码 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音频编码</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.AudioEnc" @change="$global.setDeviceParam('AudioEnc',options.AudioEnc)" :disabled="!pageLock?false:true">
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
                <select class="ItemSelect" v-model="options.AudioBitrate" @change="$global.setDeviceParam('AudioBitrate',options.AudioBitrate)" :disabled="!pageLock?false:true">
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
                <select class="ItemSelect" v-model="options.bitrate_mode" @change="changeBitrateMode" :disabled="!pageLock?false:true">
                  <template v-for="item in OPTIONS_BITRATEMODE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div v-if="dev4000Show">
            <div class="GroupItem" v-if="hdrShow"><!-- HDR设置 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">HDR设置</div>
                <div class="GroupItemValue">
                  <select class="ItemSelect" v-model="options.hdr" @change="changeDevParam('hdr')" :disabled="!pageLock?false:true">
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
                  <select class="ItemSelect" v-model="options.latency" @change="changeLatency" :disabled="!pageLock?false:true">
                    <template v-for="item in OPTIONS_LATENCY">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 编码分辨率 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">编码分辨率</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.HdmiTransFormat" @change="$global.setDeviceParam('HdmiTransFormat',options.HdmiTransFormat)" :disabled="!pageLock?false:true">
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
                <input type="text" class="" v-model="ActiveDevice.dev_name+'_'+ActiveDevice.dev_sn" style="width: 100%;border: none;background: transparent;margin-top: 0.06rem;text-indent:0" readonly>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 类型 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">类型</div>
              <div class="GroupItemValue">
                <mt-radio
                  title=""
                  v-model="options.rcvType"
                  :options="$global.OPTIONS_RCV_TYPE"
                  @change="changeRcvType">
                </mt-radio>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 虚拟服务器/实体接收机 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">{{options.serveName}}</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.matchRcv" @change="changeMatchRcv">
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
                <select class="ItemSelect" v-model="options.matchBoard" @change="">
                  <template v-for="item in options.boardList">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 按钮 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle"></div>
              <div class="GroupItemValue" style="float:right">
                <mt-button class="ItemBtn" type="primary" @click="saveMatch">绑定</mt-button>
                <mt-button class="ItemBtn" style="margin-left:10px;" @click="unbindMatch" v-if="unbindBtnShow">解绑</mt-button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group" v-if="dev4000Show"><!-- 直播地址 -->
      <div class="GroupTitle" @click="liveUrlShow=!liveUrlShow">
        直播地址
        <i class="titleIcon fa" :class="[liveUrlShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="liveUrlShow">
          <!-- <div class="GroupItem">
            <div class="GroupItemField">
              <div class="GroupItemTitle">推流地址</div>
              <div style="display:inline-block;line-height:.3rem;" v-if="showAddUrl">
                <i class="titleIcon fa fa-plus fa-large" @click="clickAddUrl"></i>
              </div>
            </div>
          </div> -->
          <div class="addressGroup" style="padding:0">
            <PushUrl  v-bind:lockState="pageLock" v-bind:workMode="workMode"></PushUrl><!-- @childFn="parentFn" -->
          </div>      
        </div>
      </transition>
    </div>
    <div class="Group"  v-if="this.user.id==this.SUPER"><!-- 日志记录 -->
      <div class="GroupTitle"  @click="logShow=!logShow">
        日志记录
        <i class="titleIcon fa" :class="[logShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="logShow">
          <div class="GroupItem"><!-- 日志记录 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">日志记录</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.ArmSenderLogLevel" @change="$global.setDeviceParam('ArmSenderLogLevel',options.ArmSenderLogLevel)"  :disabled="!pageLock?false:true">
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
  import { SET_USER,SET_NAV_STATUS } from '../../store/mutation-types';
  import PushUrl from '../basic/PushUrl';
  import Device from '../basic/Device';
  import $ from 'jquery';
  export default {
    name: "Settings",
    data(){
      return{
        workMode:"推流",
        curDevSeries:"",
        curRcvSeries:"",
        dev1080Show:false,
        dev4000Show:false,
        transConfigShow:true,
        inputEncodeShow:false,
        matchConfigShow:false,
        liveUrlShow:false,
        showAddUrl:false,
        logShow:false,
        pageLock:false,
        URL_MAX:5,
        getPushUrl:"",
        SUPER : SUPER,
        RADIO_TRANS_IP : [],
        audioEncShow:true,
        hdrShow : true,
        latencyShow : true,
        feclevel_show : false,
        show_5g:false,
        OPTIONS_VIDEOINPUT:[],//视频输入
        OPTIONS_AUDIOINPUT:[],//音频输入
        OPTIONS_VIDEOENCODE:[],//视频编码
        OPTIONS_AUDIO_ENCODE:[],//音频编码
        OPTIONS_AUDIO_ENCODE_ORI:[],//音频编码
        OPTIONS_BITRATEMODE:[],//码率控制
        OPTIONS_AUDIO_BR:[],//音频比特率
        OPTIONS_HDR:[],//HDR设置
        //OPTIONS_HDR_ORI:[],//HDR设置
        OPTIONS_LATENCY:[],//时延模式
        OPTIONS_HDMI_FORMAT:[],//编码分辨率

        OPTIONS_FEC_LEVEL : [{text: "低",value: "0"}, 
                              {text: "中",value: "1"}, 
                              {text: "高",value: "2"}],
        OPTIONS_LOG_LEVEL : [{text: "OFF",value: "0"}, 
                            {text: "ERROR",value: "1"}, 
                            {text: "INFO",value: "2"},
                            {text: "DEBUG",value: "3"}],
        OPTIONS_NETMODE_PARAMS : [{text: "NSA",value: "0"}, 
                                  {text: "SA",value: "1"}, 
                                  {text: "LTE ONLY",value: "2"}],
        OPTIONS_ETH0_TYPE : [{text: "固定IP地址", value: "0"}, 
                            {text: "自动获取IP地址", value: "1"}],
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
          WorkMode:"",//传输模式
          dev_push_enable:"",//推流开关
          curDevSn:"",//序列号
          dev_push_ip:'0',//传输IP
          //PushTsType:'0',//传输模式
          //PushCard : "",//单卡选择
          record:false,//录制开关
          ResendMode:false,//重传开关
          OpenfecMode:false,//纠错开关
          OpenfecLevel:0,//纠错能力
          Mode5G:"",//5G模式
          Eth0Type:"",//ETH0 IP
          WiFiSwitch:"",//WIFI热点
          SSHSwitch:"",//SSH反向
          DevAliasSwitch:"",//显示别名
          DevAlias:"",//别名
          SEI:false,//SEI
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
          PushTsType:"",//传输模式
          //配对设置
          devNameSn:"",
          RcvList:[],
          matchRcv:"",
          matchRcvBak:"",
          boardList:[],
          matchBoard:"",
          matchBoardBak:"",
          rcvType:"0",
          rcv_board_param:"",
          address:"",
        },
        boardShow:false,//板卡显示
        unbindBtnShow:false,
      }
    },
    components: {
        Device,PushUrl
    },
    computed: {
        ...mapState(['user','navHide','paramLockAck','lockUserId','ActiveDevice'])//"ActiveDeviceType",
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/settings"){
            this.ActiveDevice = val;
            this.getLockStates();
          }
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/settings"){
            var that=this;
            //1080-4000显示初始化
            this.selectShow();//判断设备类型显示不同内容1080 or 4000
            this.getSelectOptions();
            this.$global.getDeviceParam(that.formatData);
            this.initDevMatch();//背包配对的接收机
            this.$global.getRcvList(that.formatRcvListData);
          }
        }
      },
      '$store.state.paramLockAck':{
        immediate: true,
        handler(val) {
          this.getLockStates();
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      var that = this;
      this.getLockStates();
      //1080-4000显示初始化
      this.selectShow();//判断设备类型显示不同内容1080 or 4000
      this.getSelectOptions();
      this.$global.getDeviceParam(that.formatData);
      this.initDevMatch();//背包配对的接收机
      this.$global.getRcvList(that.formatRcvListData);
      this.options.curDevSn = this.ActiveDevice.dev_sn;
      localStorage.getSettingParam1080 = setInterval(function(){
        if(that.pageLock){//加锁
          that.$global.getDeviceParam(that.formatData)
        }
      },1000)
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getSettingParam1080);
      clearInterval(this.getPushUrl);
    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_NAV_STATUS
      }),
      /*clickAddUrl(){
        this.getRcvParam();
      },
      //获取接收机相关数据
      getRcvParam() {
        var that = this;
        //当前选中行的接收机板卡
        var selRcvSn = that.ActiveDevice.rcv_sn;
        var selBoardId = that.ActiveDevice.board_id;
        that.$global.getRcvRights(selRcvSn, selBoardId, function(data) {
          for (var i = 0; i < data.length; i++) {
            //接收机sn_板卡id_boardListId_操作权限_查看权限
            var value = data[i].value;
            if (value.split('_')[0] == selRcvSn && value.split('_')[1] == selBoardId) {
              that.options.rcv_board_param = value;
              //根据权限设置控件是否禁用
              break;
            }
          }
          that.addUrl();
        });
      },
      //点击添加URL
      addUrl() {
        var that = this;
        if (that.options.address.length >= that.URL_MAX) {
          that.$toast({
            message: "已达添加上限!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var boardListId = that.options.rcv_board_param.split("_")[2]
        var rcvSn = that.options.rcv_board_param.split("_")[0]
        var boardId = that.options.rcv_board_param.split("_")[1]
        var pushUrl = "";
        that.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            addUrl: boardListId,
            rcvSn : rcvSn,
            boardId : boardId,
            url : pushUrl,
          }),
          Api:"addUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },*/
      /*getPushUrlFun(){
        var that = this;
        this.getPushUrl = setInterval(()=>{
          this.getBoardUrl(function(data){
            that.formatBoardUrl(data);
          });
        },500)
      },
      getBoardUrl(){
        var that = this;
        this.$global.getPushUrls(function(data){
          that.formatBoardUrl(data);
        });
      },
      formatBoardUrl(data){
        this.options.address = data;
        if(data.length >= this.URL_MAX){
          this.showAddUrl = false;
        }else{
          this.showAddUrl = true;
        }
      },*/
      changeLatency(){
        var that = this;
        this.changeDevParam('latency');
        if(this.curDevSeries == "4000"){
          if(this.options.latency == 1){//超低时延，无AVBR
            this.OPTIONS_BITRATEMODE = this.$global.OPTIONS_BITRATEMODE2;
            this.options.bitrate_mode = 0;
            this.$global.setDeviceParam('bitrate_mode',0)
          }else{//4000选标准时延时，码率控制为CBR,AVBR
            this.OPTIONS_BITRATEMODE = this.$global.OPTIONS_BITRATEMODE;
            /*var options = this.$global.getDevParamRange(that.ActiveDevice.dev_sn, that.user.prefix, 'bitrate_mode');
            this.OPTIONS_BITRATEMODE = options;*/
          }  
        }
      },
      latencyChange(DV4000RV){
        //时延模式
        var that = this;
        var options = [];
        options = this.$global.getDevParamRange(that.ActiveDevice.dev_sn, that.user.prefix, 'latency', DV4000RV);//4000T和虚拟接收机配对时无超低时延
        that.OPTIONS_LATENCY = options;
        if(DV4000RV){//4000T切换配对时，从实体配对的超低时延(1)切换到虚拟接收机时，只有标准时延，背包参数latency要从1(超低时延)变更为0(标准时延)、1080T默认为0标准时延
          that.$global.setDeviceParam('latency', 0);
        }
      },
      changeEth0(){
        var that = this;
        /*this.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'dev_push_enable', function(data){
          
        });*/
        if (this.options.dev_push_enable == '1') {//推流
          that.$toast({
            message: '请先停止推流再进行ETH0 IP切换!',
            position: 'middle',
            duration: 2000
          });
          that.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'Eth0Type', function(data) {
            that.options.Eth0Type = data.Eth0Type;
          })
          return;
        }else{
          that.$global.setDeviceParam('Eth0Type', that.options['Eth0Type'])
        }
      },
      changeMatchRcv(){
        var that = this;
        var rcvSn = that.options.matchRcv;
        if (that.$global.getRcvSeries(rcvSn) == PRA_RCV) {
          that.$global.getUnusedBoard(rcvSn, "", that.formatUnusedBoard);
        }
      },
      changeRcvType(){
        var that = this;
        if(this.options.rcvType == 0){
          this.showRcvOrVirRcv(0);
        }else{
          this.showRcvOrVirRcv(1);
        }
        this.$global.getRcvList(that.formatRcvListData);
      },
      formatRcvListData(data){
        var that = this;
        //判断是否有当前配对的接收机的权限
        var bFind = false;
        var result = [];
        var curRcvSn = that.ActiveDevice.rcv_sn;
        var curRcvName = that.ActiveDevice.rcv_name;
        if (data.length == 0) {
          that.options.RcvList = [{value: curRcvSn,text:curRcvName}];
          that.options.matchRcv = curRcvSn;
        } else {
          for (var k = 0; k < data.length; k++) {
            if (data[k].rcv_sn == curRcvSn) {
              bFind = true;
              break;
            }
          }
          if (!bFind) {
            result.push({
              value: curRcvSn?curRcvSn:"",
              text: curRcvName?curRcvName:""
            });
          }
          $.each(data, function(key, value) {
            var rcvType = that.$global.getRcvSeries(value.rcv_sn);
            //虚拟还是实体接收机
            if(that.options.rcvType == '0' && rcvType == VIR_RCV){
              //虚拟接收机
              result.push({
                value: value.rcv_sn,
                text: (value.color == "#2de505" ? "在线: ":"离线: ")+value.rcv_name
              });
            }else if(that.options.rcvType == '1' && rcvType == PRA_RCV){
              //实体接收机
              result.push({
                value: value.rcv_sn,
                text: (value.color == "#2de505" ? "在线: ":"离线: ")+value.rcv_name,
              });
            }
          });
          that.options.RcvList = result;
        }

        //获取当前所选的接收机的板卡
        bFind = false;
        for (var i = 0; i < result.length; i++) {
          if (result[i]['value'] == curRcvSn) {
            that.options.matchRcv = result[i]['value'];
            //that.options.matchRcvBak = result[i]['value'];
            //$('#edit_rcv_sel').selectpicker('val', result[i]['value']);
            //$('#edit_rcv_sel').attr("oVal", result[i]['value']);
            that.$global.getUnusedBoard(result[i]['value'],"",that.formatUnusedBoard);
            bFind = true;
            break;
          }
        }
        if (!bFind && result.length != 0) {
          that.$global.getUnusedBoard(result[0]['value'],"",that.formatUnusedBoard);
        }
        if(that.options.matchRcv != ""){
          that.unbindBtnShow = true;
        }else{
          that.unbindBtnShow = false;
        }
      },
      formatUnusedBoard(rcvSn,curBoard,data){
        var that = this;
        var result = [ ];
        var showBoardId = +that.ActiveDevice.board_id*1+1;
        //无可用板卡
        if (data.length == 0) {
          if (that.ActiveDevice.rcv_sn == "") {
            result.push({
              value: -1,
              text: '无可用板卡'
            });
          } else {
            if (rcvSn == that.ActiveDevice.rcv_sn) {
              result.push({
                value: that.ActiveDevice.board_id,
                text: '板卡' + showBoardId
              });
            } else if (that.ActiveDevice.rcv_sn == "" && selectBoardId != "" && selectBoardId != undefined) {
              result.push({
                value: selectBoardId,
                text: '板卡' + selectBoardId
              });
            } else {
              result.push({
                value: -1,
                text: '无可用板卡'
              });
            }
          }
        } else {
          if (rcvSn == that.ActiveDevice.rcv_sn) {
            result.push({
              value: that.ActiveDevice.board_id,
              text: '板卡' + showBoardId
            });
          }
          $.each(data, function(key, value) {
            result.push({
              value: value,
              text: '板卡' + (+value+1)
            });
          });
        }
        that.options.boardList = result;
        that.options.matchBoard = result[0]["value"];
        if (that.ActiveDevice.board_id != "" && that.ActiveDevice.board_id != undefined) {
          for (var i = 0; i < result.length; i++) {
            if (result[i]['value'] == that.ActiveDevice.board_id) {
              that.options.matchBoard = result[i]['value'];
              that.options.matchBoardBak = result[i]['value'];
              break;
            }
          }
        }
      },
      //根据背包配对的接收机序列号来区分汇聚和接收机
      initDevMatch(rcvSn) {
        var that = this;
        var rcvType = this.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
        if(rcvType === VIR_RCV){
          this.options.rcvType = 0;
          this.showRcvOrVirRcv(0);
        }else{
          this.options.rcvType = 1;
          this.showRcvOrVirRcv(1);
        }
      },
      //汇聚和接收机的显示切换
      showRcvOrVirRcv(type){
        type = +type;
        if(type === 0){
          //汇聚
          this.boardShow = false;
          this.options.serveName = "虚拟服务器";
        }
        else{
          //接收机
          this.boardShow = true;
          this.options.serveName = "实体接收机";
        }
      },
      getSelectOptions(){
        var that = this;
        var dev_sn = that.ActiveDevice.dev_sn;
        var userPrefix = that.user.prefix;
        if(this.curDevSeries == "1080"){
          that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_1080;//视频输入
          that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_1080;//音频输入
          that.OPTIONS_VIDEOENCODE = that.$global.OPTIONS_VIDEOENCODE_1080;//视频编码
          that.OPTIONS_AUDIO_ENCODE = that.$global.OPTIONS_AUDIO_ENCODE_1080;//音频编码
          that.OPTIONS_AUDIO_BR = that.$global.OPTIONS_AUDIO_BR;//音频比特率
          that.OPTIONS_BITRATEMODE = that.$global.getDevParamRange(dev_sn, userPrefix, 'bitrate_mode');//码率控制that.$global.OPTIONS_BITRATEMODE;
          that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_1080;//编码分辨率
        }else if(this.curDevSeries == "4000"){
          //视频输入 判断是否是PCIE版本
          that.$global.getDevListOneParam('hardVer',function(data){
            if(data.hardVer != '' && data.hardVer != null){
              var hardVer = parseFloat(data.hardVer.split("-")[0]);
              if(hardVer >= 1.3){//PCIE
                that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_PCIE_4000;
              }else{
                that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_4000;
              }
            }else{
              that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_4000;
            }
          })
          that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_4000;//音频输入
          that.OPTIONS_VIDEOENCODE = that.$global.OPTIONS_VIDEOENCODE_4000;//视频编码
          that.OPTIONS_AUDIO_ENCODE = that.$global.OPTIONS_AUDIO_ENCODE_4000;//音频编码
          that.OPTIONS_AUDIO_ENCODE_ORI = that.$global.getDevParamRange(dev_sn,userPrefix,'audio_encode');
          that.OPTIONS_AUDIO_BR = that.$global.OPTIONS_AUDIO_BR;//音频比特率
          that.OPTIONS_BITRATEMODE = that.$global.getDevParamRange(dev_sn, userPrefix, 'bitrate_mode');//that.$global.OPTIONS_BITRATEMODE;//码率控制
          that.OPTIONS_AUDIO_BR = that.$global.OPTIONS_AUDIO_BR;//音频比特率
          that.OPTIONS_HDR = that.$global.getDevParamRange(dev_sn,userPrefix,"hdr");//HDR设置
          //that.OPTIONS_HDR_ORI = that.$global.getDevParamRange(dev_sn,userPrefix,"hdr");//HDR设置
          //that.OPTIONS_LATENCY = that.$global.getDevParamRange(dev_sn,userPrefix,"latency");//时延模式
          that.OPTIONS_HDMI_FORMAT = that.OPTIONS_HDMI_FORMAT_4000;//编码分辨率
          that.initLatency();
        }
      },
      //判断设备类型显示不同内容1080 or 4000
      selectShow(){
        var that = this;
        this.curDevSeries = this.$global.getDevSeries(that.ActiveDevice.dev_sn);
        if(this.curDevSeries == "1080"){
          this.dev1080Show = true;
          this.dev4000Show = false;
        }else if(this.curDevSeries == "4000"){
          this.dev1080Show = false;
          this.dev4000Show = true;
        }
      },
      changeBitrateMode(){
        if(this.curDevSeries == "4000"){
          this.$global.setDeviceParam('bitrate_mode',this.options.bitrate_mode)
        }else if(this.curDevSeries == "1080"){
          if(this.options.PushTsType == 1){//单卡推流
            //单卡推流不支持AVBR
            if(this.options.bitrate_mode == 1){
              this.options.bitrate_mode = 0;
              this.$toast({
                message: '单卡推流不支持AVBR',
                position: 'middle',
                duration: 2000
              });
              return;
            }else{
              this.$global.setDeviceParam('bitrate_mode',this.options.bitrate_mode)
            }
          }
        }
      },
      getLockStates(){
        var that = this;
        if(that.paramLockAck == "1"){
          if(that.lockUserId == that.user.id || that.lockUserId == ""){
            that.pageLock = false;
          }else{
            that.pageLock = true;
          }
        }else{
          that.pageLock = true;
        }
        that.RADIO_TRANS_IP = [{
          label: '内网',
          value: '1',
          disabled: this.pageLock?true:false
        },{
          label: '公网',
          value: '0',
          disabled: this.pageLock?true:false
        }]
      },
      formatData(data){
        var that = this;
        that.options.curDevSn = this.ActiveDevice.dev_sn;
        that.options.dev_push_enable = data["dev_push_enable"];
        var devTypeArr = ["推流","拉流","互动"];
        that.options.WorkMode = devTypeArr[data["WorkMode"]];
        //传输模式
        that.options.PushTsType = data['PushTsType'];
        /*------------------------传输控制------------------------*/
        that.options.dev_push_ip = data['dev_push_ip']=="1"?"1":"0";//传输IP
        that.options.record = (data['record'] == '1' ? true : false);//录制开关
        that.options.ResendMode = (data['ResendMode'] == '1' ? true : false);//重传开关
        if(data['OpenfecMode'] == '1'){//纠错开关
          that.options.OpenfecMode = true;
        }else{
          that.options.OpenfecMode = false;
        }
        that.options.OpenfecLevel = data['OpenfecLevel'];//纠错能力
        that.options.Eth0Type = data['Eth0Type'];//ETH0 IP
        that.options.WiFiSwitch = data['WiFiSwitch']=='1'?true:false;//wifi
        that.options.DevAliasSwitch = (data['DevAliasSwitch'] == '1')?true:false;//显示别名开关
        that.options.DevAlias = data['dev_name'];//别名
        /*------------------------输入编码------------------------*/
        //视频输入
        that.options.video_input = data['video_input'];
        if(that.curDevSeries == "4000"){
          that.changeVideoInput(data);
        }
        //音频输入
        that.options.audio_input = data['audio_input'];
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
        //that.initLatency();//视频输入和视频编码的值，影响时延模式的选项
        if(that.curDevSeries == "4000"){
          //that.changeVideoInput(data);
          //hdr设置
          that.options.hdr = data['hdr'];
          //时延模式
          that.options.latency = data['latency'];
          if(that.options.latency == 1){//超低时延，无AVBR
            that.OPTIONS_BITRATEMODE = that.$global.OPTIONS_BITRATEMODE2;
          }
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
        }else if(that.curDevSeries == "1080"){
          //SEI
          //var sei_state = "";
          that.options.SEI = (data['SEI'] == '1' ? true : false);
          //视频编码
          that.options.video_encode = data['video_encode'];
        }
        return data;
      },
      changeVideoInput(data){
        var that = this;
        if(this.curDevSeries == "1080"){
          this.$global.setDeviceParam('video_input', that.options.video_input);
        }else if(this.curDevSeries == "4000"){
          var video_encode_option =  that.$global.getDevParamRange(that.ActiveDevice.dev_sn,that.user.prefix,'video_encode');
          if(that.options.video_input == '4'){//视频输入为HDMI 视频编码只支持H.264
            that.OPTIONS_VIDEOENCODE = video_encode_option.filter(function(item){
              return (item.value == '4');
            })
            if(that.OPTIONS_VIDEOENCODE.length == 0){
              that.OPTIONS_VIDEOENCODE = [{value: "4",text: "H.264"}];
            }
            that.options.video_encode = '4';
            that.audioEncShow = false;//HDMI隐藏音频编码
            that.hdrShow = false;//HDMI隐藏HDR
          }else{
            that.OPTIONS_VIDEOENCODE = video_encode_option;
            if(data["video_encode"]){
              that.options.video_encode = data["video_encode"];
            }else{
              that.options.video_encode = 0;
            }
            that.audioEncShow = true;//非HDMI显示音频编码
            that.hdrShow = true;//非HDMI显示HDR
          }
          that.$global.setDeviceParam('video_input', that.options.video_input);
          that.changeVideoEncode();
          that.initLatency();
        }
      },
      initLatency(){
        var that = this;
        if(this.curDevSeries == "1080"){
          this.latencyShow = false;//1080：时延模式hide
        }else if(this.curDevSeries == "4000"){
          if(this.options.video_input == 4){//视频输入为HDMI，时延模式hide
            this.latencyShow = false;
          }else{//视频输入非HDMI，时延模式show
            this.latencyShow = true;
          }
          
          this.curRcvSeries = this.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
          if( !this.curRcvSeries ){//非法接收机序列号，当前接收机类型设为虚拟接收机
            this.curRcvSeries = VIR_RCV;
          }
          if(this.curRcvSeries == VIR_RCV){//配对接收机为虚拟接收机。时延模式只有“标准延时”
            this.OPTIONS_LATENCY = this.$global.OPTIONS_LATENCY2;
          }else{//实体接收机
            if(this.options.video_encode == "4"){//视频编码为264,时延模式只有“标准延时”
              this.OPTIONS_LATENCY = this.$global.OPTIONS_LATENCY2;
            }else{
              this.OPTIONS_LATENCY = this.$global.OPTIONS_LATENCY;
            }
          }
        }
      },
      changeVideoEncode(){
        var that = this;
        that.initLatency();//视频编码的修改影响时延模式的选项
        if(that.options.video_encode == '4'){
          that.formatVideoEncode264();
        }else{
          that.formatVideoEncode265();
        }
        that.$global.setDeviceParam('video_encode',that.options.video_encode/*,function(){
          that.$global.getDeviceParam(that.formatData)
        }*/);
      },
      formatVideoEncode264(){
        var that = this;
        //音频输入  只支持2-CH
        that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264;
        //时延模式  隐藏，设置成标准时延
        //that.latencyShow = false;
        that.options.latency = 0;
        //编码分辨率 显示全部选项
        that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_4000
        //HDR
        that.OPTIONS_HDR = that.$global.OPTIONS_HDR_1080;//h.264只显示SDR
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
        var that = this;
        //音频输入  0 2 4
        that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_4000;
        //音频编码  AAC LPCM MPRG1L2(对用户组还有区分)
        that.OPTIONS_AUDIO_ENCODE = that.OPTIONS_AUDIO_ENCODE_ORI;
        //时延模式  标准时延 超低时延
        //that.latencyShow = true;
        //编码分辨率 只支持自动
        that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_4000.filter(function(item){
          return (item.value == 0)
        });
        that.OPTIONS_HDR = that.$global.getDevParamRange(that.ActiveDevice.dev_sn,that.user.prefix,"hdr");//HDR设置
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
      //修改别名
      changeAliasName(){
        var that = this;
        /*var aliasNameId = '#dev_alias_name_switch';
        var aliasValue = $('#dev_alias_name').val();*/
        var len = that.$global.Substr(that.options.DevAlias, 0);
        if(len > 10){
          that.$toast({
            message: '别名长度不超过10',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        //别名名称校验
        if (!that.nameDevAliasCheckType(that.options.DevAlias)) {
          that.$toast({
            message: '长度1~10，仅支持中文,字母,数字,+,-,@,(),和空格',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        that.$global.setDeviceParam('DevAlias',that.options.DevAlias)
        that.setDevNameParam('dev_name', that.options.DevAlias);
      },
      changeDevParam(paramType){
        var that = this;
        that.$global.setDeviceParam(paramType,that.options[paramType]);
        if(that.options.video_encode == "4"){//264
          that.options_old_264[paramType] = that.options[paramType];
        }else{
          that.options_old_265[paramType] = that.options[paramType];
        }
      },
      //设置背包名称dev_name参数(跟别名保持一致)
      setDevNameParam(param, value) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            devSN: that.ActiveDevice.dev_sn,
            devNameCol: param,
            value : value+"",
          }),
          Api:"SetDevNameParam",
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
      nameDevAliasCheckType(name) {
        var pattern = /^[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]{1,10}$/gi;
        return pattern.test(name);
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
      /*setDeviceParam(key,val){
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
            that.$global.getDeviceParam(that.formatData);
          }else{
            console.log(res.reason)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },*/
      saveMatch(){
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
        if (sub == VIR_RCV) {//虚拟接收机
          DV4000RV = true;
          board = that.ActiveDevice.dev_sn;
        } else {//实体接收机
          //无可用板卡
          if (board == '' || board == '-1' && !DV4000RV) {
            return;
          }
          board = (+board);
        }
        
        var text = '是否切换配对关系？';
        that.$global.getPushAndPrefixMatch(dev_sn,rcv,function(data){//判断背包和虚拟接收机是否跨组配对以及背包推流开关
          if (data == 'norcv_push_samePrefix') {//无配对，背包、接收机在同一个组
            that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name, -1, -1, function(){
              that.unbindBtnShow = true;
              that.latencyChange(DV4000RV);
            });
          }else if(data == 'norcv_push_difPrefix'){//无配对，背包、接收机要跨组配对
            text = '是否进行背包和接收机跨组配对？';
            that.$messagebox.confirm(text).then(
              action => {
                that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name, -1, -1, function(){
                  that.unbindBtnShow = true;
                  that.latencyChange(DV4000RV);
                });
              } 
            );
          } else {
            /*if (data == 'push_samePrefix') {
              text = '是否需要先停止推流再切换配对关系？'
            }else if(data == 'push_difPrefix'){
              text = '是否需要停止推流并且进行跨组配对？'
            }else */if(data == 'nopush_difPrefix'){
              text = '是否进行背包和接收机跨组配对切换？'
            }
            that.$messagebox.confirm(text).then(
              action => {
                that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name, -1, -1, function(){
                  that.unbindBtnShow = true;
                  that.latencyChange(DV4000RV);
                });
              } 
            );
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
                  that.$global.getRcvList4000(that.formatRcvListData);
                  that.options.matchBoard = "";
                  that.options.matchRcv = "";
                  that.bindBtnShow = false;
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
    .ItemInput{
      width: 1.8rem;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .13rem;
      padding: 0px;
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
    .ItemBtn{
      width:auto;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .12rem; 
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
    .mint-field.is-textarea{
      width:100%;
    }
</style>