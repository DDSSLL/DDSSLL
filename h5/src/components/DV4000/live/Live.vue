<template>
  <div class="live mainPage">
    <Device page='rcv' @changeRcvLockState='changeRcvLockState'></Device>
    <div class="Group" v-if="show.pushUrl"><!-- 视频分发 -->
      <div class="GroupTitle" @click="boardUrlShow=!boardUrlShow">
        视频分发
        <i class="titleIcon fa" :class="[boardUrlShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="boardUrlShow">
          <!-- <div class="GroupItem" v-show="show.boardMbps">
            <div class="GroupItemField">
              <div class="GroupItemTitle">传输速率(Mbps)</div>
              <div class="GroupItemValue">
                <mt-range
                  v-model="options.board_mbps_range"
                  class="ItemRange byteRange"
                  :min="MBPS_MIN*10"
                  :max="MBPS_MAX*10"
                  :step="1"
                  :bar-height="5"
                  :disabled="disable.board_mbps"
                  @change="changeBoardMbpsRange">
                  <div style="color: #EEEEEE;padding: .01rem;" slot="start">{{MBPS_MIN}}</div>
                  <div style="color: #EEEEEE;padding: .01rem;" slot="end">{{MBPS_MAX}}</div>
                </mt-range>
                <input type="text" class="ItemIpt byteIpt" v-model.number="options.board_mbps" @blur="changeBoardMbps" :disabled="disable.board_mbps">
              </div>
            </div>
          </div>
          <div class="GroupItem" v-show="show.sel_resolution">
            <div class="GroupItemField">
              <div class="GroupItemTitle">分辨率</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.sel_resolution" @change="changeResolution" :disabled="disable.sel_resolution">
                  <template v-for="item in $global.OPTIONS_PUSH_RESULUTION">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div> -->
          <div class="GroupItem" v-show="show.sel_resolution">
            <div class="GroupItemField">
              <div class="GroupItemTitle">源1 (背包透传)</div>
              <div class="GroupItemValue" style="color:#fff;line-height:.3rem">
                <span>{{ options.urlBr1 }}</span><span>Mbps/ </span>
                <span>{{ options.urlresolution1 }}</span><span>/ </span>
                <span>{{ options.urlVEnc1 }}</span><span>/ </span>
                <span>{{ options.urlAEnc1 }}</span>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-show="show.source2">
            <div class="GroupItemField">
              <div class="GroupItemTitle">源2
                <a id="urlParam2Edit" style="color:#3d81f1;" @click="showUrlSourceWin">
                  <i class="fa fa-pencil-square-o fa-lg"></i>
                </a>
              </div>
              <div class="GroupItemValue" style="color:#fff;line-height:.3rem">
                <span>{{ options.urlBr2 }}</span><span>Mbps/</span>
                <span>{{ options.urlresolution2 }}</span><span>/</span>
                <span>{{ options.urlVEnc2 }}</span><span>/</span>
                <span>{{ options.urlAEnc2 }}</span>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 推流地址 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">推流地址</div>
              <div class="GroupItemValue">
                <mt-button class="ItemBtn" style="margin-left:10px;" :disabled="disable.url_add" @click="addUrl">添加</mt-button>
                <mt-button class="ItemBtn" style="margin-left:10px;" :disabled="disable.url_all" @click="clickUrlAll">{{options.pushBtnName}}</mt-button>
              </div>
            </div>
          </div>
          <div class="addressGroup">
            <template v-for="(item,i) in options.address">
              <div class="address" :key="i">
                <div class="title">
                  <p :class="[item.push_status == 'running' ? 'pushStyle' : (item.push_status == '' ? 'defaultStyle' : 'errStyle')]">{{ item.remark?item.remark : "推流地址"+(i+1) }}</p>
                  <!-- <p :class="[item.push_url ? 'addressTitleLineH' : '']">{{ item.remark?item.remark : "推流地址"+(i+1) }}</p> -->
                  <!-- <p :class="[item.push_url ? 'addressTitleLineH' : '', 
                  item.push_status == 'running' ? 'pushStyle' : (item.push_status == '' ? 'defaultStyle' : 'errStyle')]" class="addressUrl" v-if="item.push_url">{{ item.push_url }}</p> -->
                </div>
                <div class="buttons" :style="{display:(disable.editDisable?'none':'')}">
                  <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true" @click="showEditUrls(item)"></i>
                  <i class="iconBtn fa fa-trash-o" aria-hidden="true" @click="delUrl(item)"></i>
                  <i class="iconBtn fa" :class="[item.push_sel=='1'?'fa-pause':'fa-play']" aria-hidden="true" @click="changePushStatus(item)"></i>
                </div>
              </div>
            </template>
          </div>
        </div>
      </transition> 
    </div>
    <div class="Group" v-if="show.showOutput"><!-- 输出 -->
      <div class="GroupTitle" @click="outputShow=!outputShow">
        输出
        <i class="titleIcon fa" :class="[outputShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="outputShow">
          <div class="GroupItem"><!-- SDI -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">SDI</div>
              <div class="GroupItemValue infoShow" v-show="show.SDIinfoShow">
                {{options.outputSDIInfo}}
              </div>
            </div>
          </div>
          <div v-show="show.SDIShow">
            <div class="GroupItem"><!-- 分辨率 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">分辨率</div>
                <div class="GroupItemValue">
                  <select class="ItemSelect" v-model="options.SDI_resolution" @change="editBoardListParam('value3',options.SDI_resolution)" :disabled="disable.SDI_resolution">
                  <template v-for="item in OPTIONS_SDI_RESULUTION_SDI">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 帧率 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">帧率</div>
                <div class="GroupItemValue">
                  <select class="ItemSelect" v-model="options.SDI_framerate" @change="editBoardListParam('value4',options.SDI_framerate)" :disabled="disable.SDI_framerate">
                    <template v-for="item in OPTIONS_FRAMERATE_SDI">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 解码器 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">解码器</div>
                <div class="GroupItemValue">
                  <mt-button class="ItemBtn" type="primary" @click="clickEncodeResetBtn" :disabled="disable.encodeReset">{{options.encodeResetName}}</mt-button>
                  <mt-button class="ItemBtn" style="margin-left:10px;" @click="clickEncodeStartBtn" :disabled="disable.encodeStop">停止</mt-button>
                </div>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- hdmi -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">HDMI</div>
              <div class="GroupItemValue infoShow" v-show="show.HDMIinfoShow">
                {{options.outputHDMIInfo}}
              </div>
            </div>
          </div>
          <div v-show="show.HDMIShow">
            <div class="GroupItem"><!-- 输出透传 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">输出透传</div>
                <div class="GroupItemValue">
                  <mt-switch v-model="options.HDMI_througu" @change="changeHDMIThrougu" :disabled="disable.HDMI_througu">
                  </mt-switch>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 分辨率 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">分辨率</div>
                <div class="GroupItemValue">
                  <select class="ItemSelect" v-model="options.HDMI_resolution" @change="editBoardListParam('value7',options.HDMI_resolution)" :disabled="disable.HDMI_resolution">
                  <template v-for="item in $global.OPTIONS_HDMI_RESULUTION">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 帧率 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">帧率</div>
                <div class="GroupItemValue">
                  <select class="ItemSelect" v-model="options.HDMI_framerate" @change="editBoardListParam('value8',options.HDMI_framerate)" :disabled="disable.HDMI_framerate">
                    <template v-for="item in OPTIONS_FRAMERATE_HDMI">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group" v-if="show.record"><!-- 录机 -->
      <div class="GroupTitle" @click="recordShow=!recordShow">
        录机
        <i class="titleIcon fa" :class="[recordShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="recordShow">
          <div class="GroupItem"><!-- 录机 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">录机IP</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.record_sel" @change="getRecordParam(options.record_sel)" :disabled="disable.record_sel">
                  <template v-for="item in OPTIONS_RECORD_SEL">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 录机端口 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">录机端口</div>
              <div class="GroupItemValue">
                <input type="text" class="ItemIpt byteIpt" v-model="options.record_port" :disabled="disable.record_port">
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 录制开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">录制开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.rcv_record" @change="changeRecordSwitch" :disabled="disable.rcv_record">
                </mt-switch>
                <span v-show="show.recordErrInfo">{{options.recordErrInfo}}</span>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-show='show.recordOnShow'><!-- 录制大小 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">录制大小</div>
              <div class="GroupItemValue infoShow">
                <span>{{options.record_size}}</span>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-show='show.recordOnShow'><!-- 容量信息 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">容量信息</div>
              <div class="GroupItemValue infoShow">
                <span>{{options.unused_size}}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <mt-popup v-model="pushUrlsEditVisible" popup-transition="popup-fade">
      <div class="pushEditModal">
        <div class="modalTitle">
          推流地址
          <i class="closeBtn fa fa-close" @click="hideEditUrls"></i>
        </div>
        <div class="formContainer">
          <div class="formItem">
            <div class="formItemTitle">备注名</div>
            <div class="formItemVal formItemTextArea">
              <mt-field label="" placeholder="" type="textarea" rows="3" v-model="activePushObj.remark"  :disabled="this.dev_push_enable"></mt-field>
            </div>
          </div>
          <div class="formItem">
            <div class="formItemTitle">视频源</div>
            <div class="formItemVal">
              <select class="ItemSelect2" v-model="activePushObj.videoSource">
                <template v-for="item in videoSource">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="formItem formItemTextArea">
            <div class="formItemTitle">推流地址</div>
            <div class="formItemVal">
              <mt-field label="" placeholder="" type="textarea" rows="3" v-model="activePushObj.push_url"  :disabled="this.dev_push_enable"></mt-field>
              <p class="rtmpTip">支持 RTMP+H.264、RTMP+H.265、RTSP+H.265、SRT</p>
            </div>
          </div>
          <div class="formItem" style="text-align: right;margin-bottom: 0;">
            <button class="modalBtn" @click="hideEditUrls">取消</button>
            <button class="modalBtn" @click="saveEditUrls" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </div>
      </div>
    </mt-popup>
    <!-- 编辑源2 -->
    <mt-popup v-model="source2Visible" popup-transition="popup-fade">
      <div class="pushEditModal">
        <div class="modalTitle">
          源2配置
          <i class="closeBtn fa fa-close" @click="source2Visible=false"></i>
        </div>
        <div class="formContainer">
          <div class="formItem">
            <div class="formItemTitle">视频比特率</div>
            <div class="formItemVal">
              <input type="text" class="ItemInput" v-model="options.url_VBr_input" style="width:30%">&nbsp;Mbps
              <span style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">(0.5-12Mbps)</span>
            </div>
          </div>
          <div class="formItem">
            <div class="formItemTitle">分辨率</div>
            <div class="formItemVal">
              <select class="ItemSelect2" v-model="options.url_resolution_sel">
                <template v-for="(item,i) in $global.OPTIONS_PUSH_RESULUTION">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="formItem">
            <div class="formItemTitle">视频编码</div>
            <div class="formItemVal">
              <select class="ItemSelect2" v-model="options.url_VEnc_sel">
                <template v-for="(item,i) in $global.OPTIONS_URL_V_ENC">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="formItem">
            <div class="formItemTitle">音频编码</div>
            <div class="formItemVal">
              <select class="ItemSelect2" v-model="options.url_AEnc_sel">
                <template v-for="(item,i) in $global.OPTIONS_URL_A_ENC">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="formItem" style="text-align: right;margin-bottom: 0;">
            <button class="modalBtn" @click="source2Visible=false">取消</button>
            <button class="modalBtn" @click="clickUrlParam2Btn" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </div>
      </div>
    </mt-popup>

  </div>
</template>

<script>
  import Device from '../basic/Device';
  import { mapState } from 'vuex';
  export default {
    name: "Live",
    data(){
      return{
        boardUrlShow:true,
        outputShow:false,
        recordShow:false,
        rcvParamLock: true,
        MBPS_MIN : 0,
        MBPS_MAX : 0,
        URL_MAX:5,
        OPTIONS_RECORD_SEL:[],
        OPTIONS_SDI_RESULUTION_SDI:"",
        OPTIONS_FRAMERATE_SDI: this.$global.OPTIONS_FRAMERATE_6,
        OPTIONS_FRAMERATE_HDMI: this.$global.OPTIONS_FRAMERATE_6,
        OPTIONS_URL_SOURCE: [{text: "自动",value: "0"}],
        OPTIONS_URL_SOURCE1: [{text: "源1(背包透传)",value: "1"}],
        dev_options:{
          video_encode:"",
          latency:"",
        },
        options:{
          rcv_board_param:"",
          board_mbps_range:"",//传输速率
          board_mbps:"",
          pushBtnName:"一键停止", 
          address:[],//推流地址
          sel_resolution:"",//分辨率
          SDI_resolution:"",//SDI分辨率
          SDI_framerate:"",//SDI帧率
          encodeResetName:"复位",//
          HDMI_resolution:"",//HDMI分辨率
          HDMI_framerate:"",//HDMI帧率
          HDMI_througu:"",//输出透传
          outputSDIInfo:"",//输出提示信息
          outputHDMIInfo:"",//输出提示信息
          record_sel:"",//录机IP
          record_port:"",//录机端口
          recordErrInfo:"",//录制开关报错
          record_ip:"",
          record_name:"",
          record_pathL:"",
          record_max:"",
          rcv_record:false,//录制开关
          record_size:"",//录制大小
          unused_size:"",//"容量信息"
          push_resolution:"",
          url_VBr_input:"",
          url_VBr_input_min:"",
          url_VBr_input_max:"",
          url_resolution_sel:"",
          url_VEnc_sel:"",
          url_AEnc_sel:"",
          urlBr1:"20.5",
          urlresolution1:"1080p50",
          urlVEnc1:"H.265",
          urlAEnc1:"LPCM",
          urlBr2:"0.5",
          urlresolution2:"1080p50",
          urlVEnc2:"H.264",
          urlAEnc2:"AAC",
        },
        disable:{
          board_mbps:false,//传输速率
          sel_resolution:false,//分辨率
          SDI_resolution:false,//SDI分辨率
          SDI_framerate:false,//SDI帧率
          encodeReset:false,//复位
          encodeStop:false,//停止
          HDMI_resolution:false,//HDMI分辨率
          HDMI_framerate:false,//HDMI帧率
          record_sel:false,//录机IP
          record_port:false,//录机端口
          rcv_record:false,//录制开关
          editDisable:true,//推流地址
        },
        show:{
          pushUrl:true,
          record:true,
          showOutput:true,//输出tab
          SDIShow:true,//SDI输出
          HDMIShow:true,//HDMI输出
          SDIinfoShow:false,//输出提示信息
          HDMIinfoShow:false,//输出提示信息
          boardMbps:true,//传输速率
          sel_resolution:true,//分辨率
          recordOnShow:false,//录制大小。容量信息
          recordErrInfo:false,//录制开关报错信息
          source2:false,//源2显示
        },
        pushUrlsEditVisible:false,
        source2Visible:false,//源2配置
        activePushObj:{},
        dev_push_enable:false,
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice','devPushEnable'])//'ActiveDeviceType',
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          //console.warn(val)
          if(val){
            var that = this;
            //that.getRcvParam();
            //that.getBoardUrl();
          }
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          console.warn(val)
          if(val){
            var that = this;
            that.getRcvParam();
            that.source2Show();
          }
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      console.log("live activated")
      this.$global.getDeviceParam(this.initDevParam);//获取设备参数
      this.$global.getMbps();
      this.getRcvParam();
      this.source2Show();
      var that = this;

      localStorage.getPushUrl = setInterval(function(){
        that.getBoardUrl();
      },500)
    },
    deactivated(){   //生命周期-缓存页面失活
      console.log("live deactivated")
      clearInterval(localStorage.getPushUrl);
    },
    /*mounted(){
    console.log("mounted")

    },*/
    components: {
      Device
    },
    methods:{
      source2Show(){
        console.log("source2Show")
        var that = this;
        if(that.ActiveDevice.rcv_sn == "" 
        || (that.ActiveDevice.rcv_sn == "" && that.ActiveDevice.board_id.length == 10)){//没有配对或者是虚拟接收机
          that.show.source2 = false;
        }else{
          that.show.source2 = true;
        }
      },
      //修改接收机锁定状态
      changeRcvLockState(data){
        if(data == "lock"){
          this.rcvParamLock = true;
          this.setRcvParamDisable(true);
        }else{
          this.rcvParamLock = false;
          this.setRcvParamDisable(false);
        }
      },
      setRcvParamDisable(disFlg){
        if(disFlg){
          this.setBoardSettingDisabled(disFlg);
        }else{
          this.setBoardSettingDisabled(this.getSelRcvBoard('disabled'))
        }
      },
      changeBoardMbpsRange(){
        var that = this;
        if(that.options.board_mbps == that.options.board_mbps_range){//修改input，联动range，下发命令，不需要再修改输入框
          that.editBoardListParam('value15', that.options.board_mbps*1024*1024/10);
        }else{//滑动滑块，下发命令，联动修改输入框
          that.editBoardListParam('value15', that.options.board_mbps_range*1024*1024/10,function(){
            that.options.board_mbps = that.options.board_mbps_range;
          })
        }
      },
      changeBoardMbps(){
        var that = this;
        that.options.board_mbps_range = that.options.board_mbps/10;
        that.changeBoardMbpsRange();
      },
      changeResolution(){
        //分辨率
        var that = this;
        this.editBoardListParam('push_resolution', that.options.sel_resolution);
      },
      initDevParam(data){
        console.log("initDevParam")
        console.log(data)
        var that = this;
        that.dev_options.video_encode = data["video_encode"];
        that.dev_options.latency = data["latency"];
      },
      //获取直播速率范围
      /*getMbps() {
        this.MBPS_MIN = 0.5
        var prefix = this.user.prefix;
        if(prefix == "001" || prefix == "xs"){
          this.MBPS_MAX = 80
        }else{
          this.MBPS_MAX = 12
        }
      },*/
      //获取接收机相关数据
      getRcvParam() {
        console.log("getRcvParam");
        var that = this;
        that.getDevState();//获取背包参数
        var rcv_sn = that.ActiveDevice.rcv_sn;
        var boardId = that.ActiveDevice.board_id;
        if(rcv_sn == ""){
          that.show.pushUrl = false;
          that.show.record = false;
          that.show.showOutput = false;
          return;
        }else{
          that.show.pushUrl = true;
          that.show.record = true;
          that.show.showOutput = true;
        }
        //接收机序列号合法判断
        if (!that.$global.isValidRcvSn(rcv_sn)) {
          //无配对接收机
          that.options.board_mbps = "";
          that.OPTIONS_RECORD_SEL = [];
          that.options.record_ip = "";
          that.options.record_port = "";
          /*$('#record_path').val('');
          $('#record_name').val('');
          $('#record_maxsize').val('');*/
          return;
        }
        //虚拟接收机隐藏输出
        if (boardId.length == 10) {
          that.show.showOutput = false;
        } else {
          that.show.showOutput = true;
        }

        //当前选中行的接收机板卡
        var selRcvSn = that.ActiveDevice.rcv_sn;
        var selBoardId = that.ActiveDevice.board_id;
        if (selBoardId.length != 10) {
          selBoardId = selBoardId - 1;
        }
        that.getRcvRights(selRcvSn, selBoardId, function(data) {
          for (var i = 0; i < data.length; i++) {
            //接收机sn_板卡id_boardListId_操作权限_查看权限
            var value = data[i].value;
            if (value.split('_')[0] == selRcvSn && value.split('_')[1] == selBoardId) {
              that.options.rcv_board_param = value;
              //根据权限设置控件是否禁用
              if(that.rcvParamLock){
                that.setRcvParamDisable(true);
              }else{
                that.setBoardSettingDisabled(that.getSelRcvBoard('disabled'));  
              }
              break;
            }
          }
          var rcvSn = that.getSelRcvBoard('rcvSn');
          var boardId = that.getSelRcvBoard('boardId');
          if (rcvSn) {
            //获取板卡参数
            that.getBoardListParam(rcvSn, boardId);
          }
          //获取录机参数
          that.initRecordList(rcvSn, boardId);
          /*if (getSelRcvBoard('setting') == "1") { //用户有接收机权限
            hasRcvRight = true;
          } else {
            hasRcvRight = false;
          }*/
        });
      },
      //获取背包参数
      getDevState(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevState:that.ActiveDevice.dev_sn
          }),
          Api:"getDevState",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          var data = res.data[0];
          //视频分发 源1 参数
          var br = data["dev_sr"] / 1000;
          //输出分辨率
          console.log("data.OutputFormat")
          console.log(data.OutputFormat)
          var outputArr = data.OutputFormat.split('/');
          var output = outputArr[outputArr.length-1];
          //视频编码
          var videoEncodeStr = "";
          var videoEncode = that.$global.OPTIONS_VIDEOENCODE;
          for (var i = 0; i < videoEncode.length; i++) {
            if (videoEncode[i]["value"] == data["video_encode"]) {
              videoEncodeStr = videoEncode[i]["text"];
            }
          }
          //音频编码
          var audio_encode_text = "";
          var audioEncode = that.$global.OPTIONS_AUDIO_ENCODE;
          for (var i = 0; i < audioEncode.length; i++) {
            if (audioEncode[i]["value"] == data["AudioEnc"]) {
              audio_encode_text = audioEncode[i]["text"];
            }
          }
          that.options.urlBr1 = br.toFixed(1);
          that.options.urlresolution1 = (output.indexOf("x")!= -1)?(output.split('x'[1])):output;
          that.options.urlVEnc1 = videoEncodeStr.split(' ')[0];
          that.options.urlAEnc1 = audio_encode_text;
        })
        .catch(function (error) {
          console.log(error)
        })  
      },
      //获取录机列表
      initRecordList(rcvSn, boardId) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getRecordList:true,
            rcvSn: rcvSn,
            boardId:boardId
          }),
          Api:"getRecordList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if (res.data.length == 0) {
            that.OPTIONS_RECORD_SEL = [{text: "无可用录机",value: "-1"}];
            that.options.record_sel = -1
            that.options.record_port = "---";
            that.disable.record_port = true;
          } else {
            var options = [];
            var value = res.data[0].record_sn;
            var ip = res.data[0].record_ip;
            for (var i = 0; i < res.data.length; i++) {
              options.push({
                text: res.data[i].record_ip,
                value: res.data[i].record_sn
              });
              if (rcvSn == res.data[i].rcv_sn) {
                value = res.data[i].record_sn;
                ip = res.data[i].record_ip;
              }
            }
            that.OPTIONS_RECORD_SEL = options;
            that.options.record_sel = value
            //获取录机参数
            that.getRecordParam(value);
          }
        })
        .catch(function (error) {
          console.log(error)
        })  
      },
      //获取录机参数
      getRecordParam(recordSn) {
        var that = this;
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        that.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            getRecordParam: true,
            recordSn: recordSn,
            rcvSn: rcvSn,
            boardId: boardId
          }),
          Api:"getRecordParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          var res = response.data;
          if (res.data) {
            that.options.record_port = res.data.record_port==""?9188:res.data.record_port;
            if(res.data.value1 != "0"){
              that.show.recordOnShow = true;
              that.getRecordCapacity(recordSn,that.ActiveDevice.dev_sn,rcvSn,boardId);
            }else{
              that.show.recordOnShow = false;
            }
            that.options.record_name = res.data.record_name
            that.options.record_path = res.data.record_path
            that.options.record_max = res.data.record_max
            that.options.record_ip = res.data.record_ip
          } else {
            that.options.record_port = '---';
            that.options.record_name = '---';
            that.options.record_path = '---';
            that.options.record_max = '---';
            that.options.record_ip = '---';
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      getRecordCapacity(record, devSn, rcvSn, boardId){
        var that = this;
        localStorage.getRecordCapacityInterval = setInterval(function(){
          that.$axios({
            method: 'post',
            url:"/page/index/indexData.php",
            data:that.$qs.stringify({
              getRecordCapacity : true,
              record : record,
              devSn : devSn,
              rcvSn : rcvSn,
              boardId : boardId,
            }),
            Api:"getRecordCapacity",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            var data = res.data;
            if(data){
              that.options.record_size = data["record_size"];
              that.options.unused_size = data["unused_cap"]+"/"+data["capacity"];
            }
          })
          .catch(function (error) {
            console.log(error)
          })     
        },1000)
      },
      //获取接收板卡权限
      getRcvRights(rcvSn, boardId, cb) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getRcvRights : true,
            userId : that.user.id,
            userGroup : that.user.userGroup,
            prefix : that.user.prefix,
            rcvSn : rcvSn,
            boardId : boardId,
          }),
          Api:"getRcvRights",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if (typeof(cb) == 'function') {
              cb(res.data);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获取当前所选的接收机板卡
      getSelRcvBoard(type) {
        var that = this;
        var value = that.options.rcv_board_param;
        if (value == null) {
          return '';
        }
        if (type == 'rcvSn') {
          return value.split('_')[0];
        } else if (type == 'boardId') {
          return value.split('_')[1];
        } else if (type == 'boardListId') {
          return value.split('_')[2];
        } else if (type == 'setting') {
          return value.split('_')[3];
        } else if (type == 'view') {
          return value.split('_')[4];
        } else if (type == 'disabled') {
          var rights = value.split('_')[3];
          if (rights == '1') {
            return false;
          } else {
            return true;
          }
        } else {
          return '';
        }
      },
      //根据权限设置板卡设置界面的控件是否禁用
      setBoardSettingDisabled(disabled) {
        var that = this;
        if (disabled) {
          that.disable.board_mbps = true;//视频速率
          that.disable.sel_resolution = true;//分辨率
          that.disable.url_add = true;//添加推流地址
          that.disable.url_all = true;//推流地址一键
          that.disable.SDI_resolution = true;//SDI分辨率
          that.disable.SDI_framerate = true;//SDI帧率
          that.disable.encodeReset = true;//复位
          that.disable.encodeStop = true;//停止
          that.disable.HDMI_througu = true;//HDMI输出透传
          that.disable.HDMI_resolution = true;//HDMI分辨率
          that.disable.HDMI_framerate = true;//HDMI帧率
          that.disable.record_sel =true;//录机IP
          that.disable.record_port = true;//录机端口
          that.disable.rcv_record = true;//录制开关
          that.disable.editDisable = true;//推流地址
        } else {
          that.disable.board_mbps = false;//视频速率
          that.disable.sel_resolution = false;//分辨率
          that.disable.url_add = false;//添加推流地址
          that.disable.url_all = false;//推流地址一键
          that.disable.SDI_resolution = false;//SDI分辨率
          that.disable.SDI_framerate = false;//SDI帧率
          that.disable.encodeReset = false;//复位
          that.disable.encodeStop = false;//停止
          that.disable.HDMI_througu = false;//HDMI输出透传
          that.disable.HDMI_resolution = false;//HDMI分辨率
          that.disable.HDMI_framerate = false;//HDMI帧率
          that.disable.record_sel =false;//录机IP
          that.disable.record_port = false;//录机端口
          that.disable.rcv_record = false;//录制开关
          that.disable.editDisable = false;//推流地址
        }
        //推流地址
        /*$("#url_add").attr('disabled', disabled);
        $("#url_all").attr('disabled', disabled);
        $('#addUrl_btn').attr('disabled', disabled);
        $('#delUrl_btn').attr('disabled', disabled);
        */
      },
      //获取boardList参数
      getBoardListParam(rcvSn, boardId) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getBoardParam:boardId,
            rcvSn: rcvSn
          }),
          Api:"getBoardParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.initBoardParam(res, rcvSn, boardId)
          }
        })
        .catch(function (error) {
          console.log(error)
        })        
      },
      initBoardParam(res, rcvSn, boardId){
        var that = this;

        //虚拟接收机隐藏源2
        if(that.$global.getRcvMode(rcvSn.substr(-4)) == 'DV4000RV'){
          that.show.source2 = false;
        } else{
          that.show.source2 = true;
        }
        //源2参数
        var push_res = that.$global.OPTIONS_PUSH_RESULUTION;
        for(var i=0; i<push_res.length; i++){
          if(push_res[i].value == res.data[0].push_resolution){
            that.options.urlresolution2 = push_res[i]["text"];
          }
        }
        //视频速率
        var mbps = +res.data[0].value15 / 1024 / 1024;
        if (mbps == 0) {
          mbps = MBPS_MIN;
        }
        that.options.urlBr2 = mbps.toFixed(1)
        
        //分辨率
        that.options.sel_resolution = res.data[0].push_resolution;
        //视频速率
        var mbps = +res.data[0].value15 / 1024 / 1024*10;
        if (mbps == 0) {
          mbps = MBPS_MIN; 
        }
        that.options.board_mbps = mbps.toFixed(1);
        that.options.board_mbps_range = mbps.toFixed(1);
        //SDI输出
        //视频编码是H.264，无SDI输出
        if(that.dev_options.video_encode == '4'){
          that.show.SDIShow = false;
          that.show.SDIinfoShow = true;
          that.options.outputSDIInfo = 'H.264无SDI输出';
        }else{
          that.show.SDIShow = true;
          that.show.SDIinfoShow = false;
        }
        //透传 不是4k
        //4k:分辨率可填，帧率不可以填写
        //非4k：分辨率帧率都不能改
        if (res.data[0].is4k == false) {
          if(!that.getSelRcvBoard('disabled')){
            that.disable.SDI_resolution = true;//SDI分辨率
            that.disable.SDI_framerate = true;//SDI帧率
          }
          that.getDevParamM50('SDI');
        } else { //4k
          if(!that.getSelRcvBoard('disabled')){
            that.disable.SDI_resolution = false;//SDI分辨率
            that.disable.SDI_framerate = true;//SDI帧率
          }
          that.getDevParamM50('SDI', 'framerate');  //设置帧率 背包透传
          //SDI分辨率
          var newOption = [];
          if (res.data[0].Support12G == '1') {
            for (var i = 0; i < that.$global.OPTIONS_SDI_RESULUTION.length; i++) {
              if (i != 3 && i != 4 && i != 5) {
                newOption.push(that.$global.OPTIONS_SDI_RESULUTION[i]);
              }
            }
            that.OPTIONS_SDI_RESULUTION_SDI = newOption;
          } else {
            for (var i = 0; i < that.$global.OPTIONS_SDI_RESULUTION.length; i++) {
              if (i != 2 && i != 3 && i != 4 && i != 5) {
                newOption.push(that.$global.OPTIONS_SDI_RESULUTION[i]);
              }
            }
            that.OPTIONS_SDI_RESULUTION_SDI = newOption;
          }
          //如果原value3的值不在4k分辨率选项范围内，需要更新value3
          var newValue3 = res.data[0].value3;
          if(+res.data[0].value3 > 1 && +res.data[0].value3 < 5){
            newValue3 = 0;
          }
          /*if(newValue3 != +res.data[0].value3){
            that.options.SDI_resolution = newValue3;
          }*/
          that.options.SDI_resolution = newValue3;
        }

        //编码器复位
        if (res.data[0].value14 == '0') {
          that.options.encodeResetName = "复位";
          that.disable.encodeReset = false;
          that.disable.encodeStop = true;
        } else {
          that.options.encodeResetName = "复位中...";
          that.disable.encodeReset = true;
          that.disable.encodeStop = false;
          that.updateEncodeReset();
        }
        //HDMI输出
        //超低时延，无HDMI输出
        if(that.dev_options.video_encode == '2' || that.dev_options.video_encode == '3'){
          that.show.HDMIShow = false;
          that.show.HDMIinfoShow = true;
          that.options.outputHDMIInfo = 'H.265 4:2:2无HDMI输出';
        }else if(that.dev_options.latency == '1'){
          that.show.HDMIShow = false;
          that.show.HDMIinfoShow = true;
          that.options.outputHDMIInfo = '超低时延无HDMI输出';
        }else{
          that.show.HDMIShow = true;
          that.show.HDMIinfoShow = false;
        }
        //HDMI输出透传
        if (res.data[0].value6 == '0') {
          that.options.HDMI_througu = true;
          if (that.getSelRcvBoard('disabled') == false) {
            that.disable.HDMI_resolution = true;
            that.disable.HDMI_framerate = true;
          }
          that.getDevParamM50('HDMI');
        } else { //不透传
          that.options.HDMI_througu = false;
          if (that.getSelRcvBoard('disabled') == false) {
            that.disable.HDMI_resolution = false;
            that.disable.HDMI_framerate = false;
          }
          //HDMI输出分辨率
          that.options.HDMI_resolution = res.data[0].value7;
          //HDMI输出帧率
          if (res.data[0].value7 == '2' || res.data[0].value7 == '3') { //1080I/720P
            var newOption = [];
            for (var i = 0; i < that.$global.OPTIONS_FRAMERATE_6.length; i++) {
              if (i != 3 && i != 4 && i != 5) {
                newOption.push(that.$global.OPTIONS_FRAMERATE_6[i]);
              }
            }
            that.OPTIONS_FRAMERATE_HDMI = newOption;
          }
          that.options.HDMI_framerate = res.data[0].value8
        }
        //回流录制
        /*if (res.data[0].value1 == '0') {
          that.options.rcv_record = false;
          that.disable.record_port = false;
        } else {
          that.options.rcv_record = true;
          that.disable.record_port = true;
        }*/
        /*if ($("#lockIconRcv i").hasClass("fa-lock")) {
          $('#encodeResetBtn').attr('disabled', true);
          $('#encodeStopBtn').attr('disabled', true);
          $('#HDMI_througu').bootstrapSwitch('disabled', true);
          $("#rcv_record").bootstrapSwitch('disabled', true)
        }*/
      },
      //更新复位是否完成
      updateEncodeReset() {
        var that = this;
        var timerAck = setInterval(function() {
          that.getEncodeResetAck(function(data) {
            if(data.length == 0){
              clearInterval(timerAck);
              return;
            }
            if (data[0].value14 == '0') {
              clearInterval(timerAck);
              that.options.encodeResetName = "复位";
              that.disable.encodeReset = false;
            }
          });
        }, 200);
      },
      //获取编码器复位成功标志
      getEncodeResetAck(callback) {
        var that = this;
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        that.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            getEncodeResetAck:true,
            rcvSn: rcvSn,
            boardId:boardId
          }),
          Api:"getEncodeResetAck",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          var res = response.data;
          if (typeof(callback) == 'function') {
            callback(res.data);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //根据接收机和板卡获取配对的背包的M50参数 分辨率和帧率 select:选择分辨率还是帧率
      getDevParamM50(type, select, callback) {
        var that = this;
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        that.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            getDevM50:true,
            rcvSn: rcvSn,
            boardId:boardId
          }),
          Api:"getDevM50",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          var data = res.data[0];
          var format = that.convertM50Format(data['m50_format'], type);
          var fr = that.convertM50Fr(data['m50_fr']);
          if (select == 'framerate') {
            that.options[type + '_framerate'] = fr;
          } else if (select == 'resolution') {
            that.options[type + '_resolution'] = format;
          } else {
            if(type == 'HDMI'){
              var newOption = [];
              if(format == 2 || format == 3){
                for (var i = 0; i < that.$global.OPTIONS_FRAMERATE_6.length; i++) {
                  if (i <= 2) {
                    newOption.push(that.$global.OPTIONS_FRAMERATE_6[i]);
                  }
                }
                if(fr > 2){
                  fr = 2;
                }
              }else{
                for (var i = 0; i < that.$global.OPTIONS_FRAMERATE_6.length; i++) {
                  newOption.push(that.$global.OPTIONS_FRAMERATE_6[i]);
                }
              }
              that.OPTIONS_FRAMERATE_HDMI = newOption;
            }
            that.options[type + '_resolution'] = format;
            that.options[type + '_framerate'] = fr;
          }
          if (typeof(callback) == 'function') {
            callback(format, fr);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //根据接收机和板卡获取板卡参数 分辨率和帧率
      getBoardParamM50(type) {
        var that = this;
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getBoardM50:true,
            rcvSn : rcvSn,
            boardId : boardId,
          }),
          Api:"getBoardM50",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data[0];
            var format = 0, fr = 0;
            if (type == 'SDI') {
              format = data['value3'];
              fr = data['value4'];
            } else if (type == 'HDMI') {
              format = data['value7'];
              fr = data['value8'];
            }
            var newOption = [];
            if(format == 2 || format == 3){
              for (var i = 0; i < that.$global.OPTIONS_FRAMERATE_6.length; i++) {
                if (i <= 2) {
                  newOption.push(that.$global.OPTIONS_FRAMERATE_6[i]);
                }
              }
            }else{
              for (var i = 0; i < that.$global.OPTIONS_FRAMERATE_6.length; i++) {
                newOption.push(that.$global.OPTIONS_FRAMERATE_6[i]);
              }
            }
            if(type == 'HDMI'){
              that.OPTIONS_FRAMERATE_HDMI = newOption
            }
            that.options.HDMI_resolution = format;
            that.options.HDMI_framerate = fr;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //m50转成板卡的分辨率
      convertM50Format(format, type) {
        var res = -1;
        format = +format;
        switch (format) {
          case 0: //E1080I
            if (type == 'SDI') {
              res = 3;
            } else if (type == 'HDMI') {
              res = 2;
            }
            break;
          case 4: //480I
          case 5: //576I
          case 8: //480P
          case 9: //576P
          case 2: //E720P
            if (type == 'SDI') {
              res = 4;
            } else if (type == 'HDMI') {
              res = 3;
            }
            break;
          case 30: //E1080P
            if (type == 'SDI') {
              res = 2;
            } else if (type == 'HDMI') {
              res = 0;
            }
            break;
          case 50: //2160P_SQ
            if (type == 'SDI') {
              res = 1;
            } else if (type == 'HDMI') {
              res = 1;
            }
            break;
          case 51: //2160P_2SI
            if (type == 'SDI') {
              res = 0;
            } else if (type == 'HDMI') {
              res = 1;
            }
            break;
          default:
            res = -1;
            break;
        }
        return res;
      },
      //m50转成板卡的帧率
      convertM50Fr(fr) {
        var res = -1;
        fr = +fr;
        switch (fr) {
          case 1: //23.976
          case 2: //24
          case 3: //ENC25HZ
            res = 5;
            break;
          case 4: //ENC2997HZ
            res = 4;
            break;
          case 5: //ENC30HZ
            res = 3;
            break;
          case 6: //ENC50HZ
            res = 2;
            break;
          case 7: //ENC5994HZ
            res = 1;
            break;
          case 8: //ENC60H
            res = 0;
            break;
          default:
            res = -1;
            break;
        }
        return res;
      },
      //设置板卡参数
      editBoardListParam(col, value, cb) {
        var that = this;
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editBoard:boardId,
            rcvSn: rcvSn,
            col:col,
            value:value
          }),
          Api:"rcvParamList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$toast({
              message: '设置成功',
              position: 'middle',
              duration: 2000
            });
            if(cb){
              cb();
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
      //点击编码器复位按钮
      clickEncodeResetBtn() {
        var that = this;
        that.editBoardListParam('value14', '1');
        that.options.encodeResetName = "复位中...";
        that.disable.encodeReset = true;
        that.disable.encodeStop = false;
        that.updateEncodeReset();
      },
      //点击编码器复位停止按钮
      clickEncodeStartBtn() {
        var that = this;
        that.disable.encodeStop = true;
        that.editBoardListParam('value14', '0');
      },
      //HDMI输出透传
      changeHDMIThrougu(){
        var that = this;
        if(that.options.HDMI_througu){
          that.editBoardListParam('value6', '0');
          if (that.getSelRcvBoard('disabled') == false) {
            that.disable.HDMI_framerate = true;
            that.disable.HDMI_resolution = true;
          }
          that.getDevParamM50('HDMI');
        }else{
          that.editBoardListParam('value6', '1');
          if (that.getSelRcvBoard('disabled') == false) {
            that.disable.HDMI_framerate = false;
            that.disable.HDMI_resolution = false;
          }
          that.getBoardParamM50('HDMI');
        }
      },
      //录制开关切换
      changeRecordSwitch(){
        var that = this;
        if (that.options.rcv_record == true) {
          that.clickRecordBtn('1');
          that.disable.record_port = true;
          that.disable.record_sel = true;
        } else {
          that.stopRecord();
        }
      },
      //点击板卡录制按钮
      clickRecordBtn(on) {
        var error = '';
        var that = this;
        var record = that.options.record_sel;
        if (on == 1 && record == -1) {
          error = '无可用的录机';
        }
        var ip = that.options.record_ip;
        var port = that.options.record_port;
        var name = that.options.record_name;
        var maxsize = that.options.record_maxsize;
        if (port == '' || !that.$global.isValidPort(port)) {
          error = '端口不合法';
        }
        if (maxsize < 1) {
          maxsize = 1;
          that.options.record_maxsize = 1;
        } else if (maxsize > 500) {
          maxsize = 500;
          that.options.record_maxsize = 500;
        }
        if (name.length > 10) {
          error = '文件名长度要<10';
        }
        if (error != '') {
          that.show.recordErrInfo = true;
          that.options.recordErrInfo = error;
          that.options.rcv_record = false;
          return;
        }
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        var devSN = that.ActiveDevice.dev_sn;
        that.setRecordParam(record, ip, port, name, maxsize, on, rcvSn, boardId, devSN);
        that.editBoardListParam('value1', on);
        that.editBoardListParam('value12', ip);
        that.editBoardListParam('value13', port);
        if (on == '1') {
          that.disable.record_port = true;
          that.show.recordOnShow = true;
          that.getRecordCapacity(record, devSN, rcvSn, boardId);
        } else {
          that.disable.record_port = false;
          that.show.recordOnShow = false;
          clearInterval(localStorage.getRecordCapacityInterval);
        }
      },
      //关闭录制开关
      stopRecord(){
        var that = this;
        that.clickRecordBtn('0');
        that.disable.record_port = false;
        that.disable.record_sel = false;
        that.disable.rcv_record = false;
      },
      //设置录机参数
      setRecordParam(recordSn, ip, port, name, maxsize, on, rcvSn, boardId, devSN) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            setRecordParam : recordSn,
            ip : ip,
            port : port,
            name : name,
            max : maxsize,
            use : on,
            rcvSn : rcvSn,
            boardId : boardId,
            devSn : devSN
          }),
          Api:"setRecordParam",
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
      },
      //获取推流开关参数
      getBoardUrl(){
        var that = this;
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getBoardUrl:true,
            rcvSn : rcvSn,
            boardId : boardId,
          }),
          Api:"getBoardUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.options.address = res.data;
            var data = res.data;
            var sFlg = true;
            for(let i=0; i<data.length; i++){
              if (data[i].push_sel == '1') {
                that.options.pushBtnName = '一键停止'
                sFlg = false;
                break;
              }
            }
            if(sFlg){
              that.options.pushBtnName = '一键开启'
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
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
      },
      //数据库删除url
      delUrl(item) {
        var text = "确定删除该推流地址?";
        var that = this;
        var ids = item.id;
        that.$messagebox.confirm(text).then(
          action => {
            that.$axios({
              method: 'post',
              url:"/page/index/indexData.php",
              data:this.$qs.stringify({
                delUrl: ids
              }),
              Api:"delUrl",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.$toast({
                  message: '删除成功！',
                  position: 'middle',
                  duration: 2000
                });
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }).catch();
      },
      //开启或停止推流
      changePushStatus(item){
        var that = this;
        var disabled = that.disable.url_add;
        if (disabled) {
          that.$toast({
            message: "没有权限！!",
            position: 'middle',
            duration: 2000
          });
        }
        if (item.push_url == '') {
          that.$toast({
            message: "请先输入推流地址！!",
            position: 'middle',
            duration: 2000
          });
        } else {
          var checked = '0';
          if (item.push_sel == '0') {
            checked = '1';
          } else {
            checked = '0';
          }
          //srt只能生效一个
          var datas = that.options.address;
          var srt = 0;
          for (var i = 0; i < datas.length; i++) {
            if (datas[i].id == item.id) {
              continue;
            }
            if (datas[i].push_url.indexOf('srt://') != -1 && datas[i].push_sel == '1') {
              srt++;
            }
          }
          if (item.push_url.indexOf('srt://') != -1 && srt > 0) {
            that.$toast({
              message: "srt只能生效一个！!",
              position: 'middle',
              duration: 2000
            });
            return
          }
          that.editUrl(item.id, 'push_sel', checked);
        }
      },
      clickUrlAll() {
        var that = this;
        if(that.options.pushBtnName == "一键开启"){
          that.setAllUrlPushSel(1);
        }else{
          that.setAllUrlPushSel(0);
        }
      },
      //一键开启
      setAllUrlPushSel(sel) {
        var that = this;
        var address = that.options.address;
        for (var i = 0; i < address.length; i++) {
          if (sel == 1) {
            //srt只能生效一个，不能一键全开
            if (address[i].push_url.indexOf('srt://') != -1) {
              continue;
            }
            //无推流地址，跳过
            if (address[i].push_url == '') {
              continue;
            }
            that.editUrl(address[i].id, 'push_sel', sel);
            address[i].push_sel = sel;
            address[i].push_status = '';
          } else {
            //一键停止
            that.editUrl(address[i].id, 'push_sel', sel);
            address[i].push_sel = sel;
            address[i].push_status = '';
          }
        }
      },
      //数据库编辑url
      editUrl(id, col, value) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editUrl : id,
            col : col,
            value : value
          }),
          Api:"editUrlStatus",
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
      },
      showEditUrls(obj){
        console.log("showEditUrls")
        console.log(obj);
        var that = this;
        var disabled = that.disable.url_add;
        if (disabled) {
          that.$toast({
            message: "没有权限！",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        that.pushUrlsEditVisible = true;
        if(that.ActiveDevice.board_id.length == 10){    //虚拟
          that.videoSource = that.OPTIONS_URL_SOURCE1;
        } else{
          that.videoSource = that.OPTIONS_URL_SOURCE;
        }
        that.activePushObj = obj;
      },
      hideEditUrls(){
        this.pushUrlsEditVisible = false;
        this.activePushObj = {};
      },
      saveEditUrls(){
        var that = this;
        var urlId = that.activePushObj.id;
        var rcvSn = that.activePushObj.rcv_sn;
        var boardID = that.activePushObj.board_id;
        var url = that.activePushObj.push_url;
        var remark = that.activePushObj.remark;
        var result = that.checkUrl(url);
        if (result != '') {
          that.$toast({
            message: result,
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //重复判断
        var datas = that.options.address;
        for (var i = 0; i < datas.length; i++) {
          if (datas[i].push_url == url && datas[i].id != urlId) {
            that.$toast({
              message: '推流地址重复！',
              position: 'middle',
              duration: 2000
            });
            return;
          }
        }
        //写数据库
        that.editUrlRemark(urlId, rcvSn, boardID, url, remark, function(res) {
          if (res.res.success) {
            that.pushUrlsEditVisible = false;
          } else {
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
          }
        });
      },
      //数据库编辑url和备注
      editUrlRemark(id, rcvSn, boardId, pushUrl, remark, callback) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editUrlRemark:id,
            rcvSn : rcvSn,
            boardId : boardId,
            url : pushUrl,
            remark : remark,
          }),
          Api:"editUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if (typeof(callback) == 'function') {
            callback(res);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //判断URL合法性
      checkUrl(url) {
        var result = '';
        if (url == '') {
          return result;
        }
        if (url.indexOf('rtmp://') != 0 && url.indexOf('rtsp://') != 0 && url.indexOf('udp://') != 0 &&
          url.indexOf('rtp://') != 0 && url.indexOf('srt://')) {
          result = "仅支持 'rtmp://'、'rtsp://'、'udp://'、'rtp://'、'srt://'";
        }
        if(url.indexOf(' ') >= 0){
          result = "不能有空格！";
        }
        return result;
      },
      //显示视频源2配置弹窗
      showUrlSourceWin() {
        //板卡参数
        var that = this;
        that.source2Visible = true;
        var rcvSn = that.getSelRcvBoard('rcvSn');
        var boardId = that.getSelRcvBoard('boardId');
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getBoardParam : boardId,
            rcvSn : rcvSn,
          }),
          Api:"getBoardParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data[0];
            console.log("showUrlSourceWin")
            console.log(data)
            that.options.url_resolution_sel = data["push_resolution"];//分辨率
            //视频速率范围
            var range = that.$global.getMbps();
            that.setSource2BrRange(range.min,range.max);
            //视频速率
            var mbps = data.value15 / 1024 / 1024;
            if (mbps == 0) {
              mbps = MBPS_MIN;
            }
            that.options.url_VBr_input = mbps.toFixed(1)
            that.options.url_VEnc_sel = 0;
            that.options.url_AEnc_sel = 0;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //设置源2视频比特率的输入范围
      setSource2BrRange(min, max){
        this.options.url_VBr_input_min = min;
        this.options.url_VBr_input_max = max;
      },
      //校验直播速率
      checkMbps(el){
        var value = this.options[el];
        var min = this.options[el+"_min"];
        var max = this.options[el+"_max"];
        if (value != '') {
          if (value < min) {
            this.options[el] = min;
          } else if (value > max) {
            this.options[el] = max;
          }
        }
      },
      clickUrlParam2Btn(){
        var that = this;
        //视频速率
        this.checkMbps("url_VBr_input");
        var strbps = this.options.url_VBr_input;
        if(strbps == ''){
          that.$toast({
            message: '视频速率不能为空',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var bps = +strbps * 1024 * 1024;
        that.editBoardListParam('value15', bps);
        //分辨率
        that.editBoardListParam('push_resolution', that.options.url_resolution_sel);
        //视频编码

        //音频编码

        //关弹窗
        that.source2Visible = false;
        //更新数值
        that.options.urlBr2 = strbps;
        that.options.urlresolution2 = that.options.url_resolution_sel;
        var push_res = that.$global.OPTIONS_PUSH_RESULUTION;
        for(var i=0; i<push_res.length; i++){
          if(push_res[i]["value"] == that.options.url_resolution_sel){
            that.options.urlresolution2 = push_res[i]["text"];
            return;
          }
        }
      },
    }
  }
</script>

<style scoped>
    .live{
        margin-top: 60px;
        height: 84%;
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
        padding: .1rem .08rem;
        background: linear-gradient(270deg,#111 0,#333 50%);
        /*border-radius: 5px;*/
        font-size: .15rem;
        font-weight:500;
        color: #B7B7B7;
    }
    .GroupItem{
        padding: .1rem .2rem;
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
    .ItemRange{
        width: 68%;
        margin-right: .08rem;
    }
    .ItemIpt{
        width: 25%;
        height: .22rem;
        line-height: .22rem;
        outline: none;
        border: 1px solid #3d81f1;
        border-radius: 5px;
        font-size: .12rem;
    }
    .ItemSel{
        width: 35%;
        height: .3rem;
        line-height: .3rem;
        outline: none;
        border: 1px solid #3d81f1;
        border-radius: 5px;
        font-size: .12rem;
    }
    .byteIpt{
        float: left;
        margin-top: .02rem;
    }
    .byteRange{
        float: left;
    }
    .ItemBtn{
        width: 40%;
        height: .3rem;
        display: inline-block;
        background-color: #3d81f1;
        color: #FFFFFF;
        border: none;
        outline: none;
        border-radius: 5px;
        box-shadow: none;
        font-size: .12rem;
    }
    .addressGroup{
        /* border-top: 2px solid #DDDDDD; */
        margin: 0;
        padding-top: .05rem;
        margin-bottom: .2rem;
    }
    .address{
        color: #EEEEEE;
        line-height: .4rem;
        overflow: hidden;
        border-bottom: 1px solid #333;
        padding: 0.06rem 0;
    }
    .address:last-child{border-bottom: none;}
    .address .title{
        float: left;
        word-break: break-all;
        /*width: 60%;*/
    }
    .address .title p{
        font-size: .14rem;
        text-indent: .2rem;
        font-weight: 500;
    }
    .addressTitleLineH{
        line-height: .22rem;
    }
    .address .title .addressUrl{
        font-size: .14rem;
        font-weight: 300;
    }
    .address .buttons{
        float: right;
        width: 25%;
        padding-right: 2%;
        text-align: right;
    }
    .iconBtn{
        cursor: pointer;
        font-size: .16rem;
        margin-right: .12rem;
        margin-top: .08rem;
    }
    .iconBtn.fa-pause{
      color:#5AB1A7;
    }
    .pushEditModal{
        width: 3rem;
    }
    .modalTitle{
        padding: .1rem;
        font-size: .13rem;
        font-weight: 500;
        line-height: .14rem;
    }
    .closeBtn{
        float: right;
        margin-right: 0;
        display: inline-block;
        margin-top: -2px;
        color: #F33;
    }
    .formContainer{
        padding: .1rem;

    }
    .formItem{
        overflow: hidden;
        margin-bottom: .1rem;
    }
    .formItemTitle{
        float:left;
        width: 25%;
        color: #333;
        line-height: .28rem;
        font-size: .13rem;
        text-align: right;
        margin-right: 5%;
    }
    .formItemVal{
        float: left;
        width: 70%;
    }
    .formItemVal input{
        display: inline-block;
        width: 93%;
        background: #FFFFFF;
        border: 1px solid #ccc;
        color: #333333;
        height: .24rem;
        line-height: .24rem;
        font-size: .13rem;
        outline:none;
        border-radius: 4px;
    }
    .modalBtn{
        width: .6rem;
        border: 1px solid #ccc;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        margin-right: .05rem;
    }
    .mint-popup{border-radius: 6px;background-color: #EEE;}
    .rtmp{
        background: #4C5157;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        color: #FFF;
        text-align: center;
        display: inline-block;
        padding: .06rem .08rem;
    }
    .rtmpTip{
        color: #f88a22;
        font-size: .12rem;
    }
    .pushStyle{
      color:#2de505;
    }
    .defaultStyle{
      color : #ffffff;
    }
    .errStyle{
      color : #FF4D52;
    } 
    .slide-fade-enter-active {transition: all 1s ease;}
    .slide-fade-leave-active {transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-to{transform: translateY(5px);opacity: 0;}
    .ItemSelect{
      width: 1.8rem;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .12rem;
    }
    .ItemSelect2{
      width: 100%;
      height: .26rem;
      border: 1px solid #3d81f1;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .12rem;
      background-color: #fff;
      color: #000;
    }
    .mint-switch{
      transform: scale(.7);
      transform-origin:left;
    }
    .infoShow{
      color:#fff;
      font-size:0.14rem;
      line-height:.3rem;
    }
</style>
<style>
  .formItemTextArea .mint-cell-wrapper{
    border-radius:4px;
    border:1px solid #ccc;
  }
  .formItemVal textarea{
    font-size:.13rem;
  }
</style>