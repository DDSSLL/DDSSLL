<template>
  <div class="monitor mainPage" >
    <keep-alive>
      <Device page='dev'></Device>
    </keep-alive>
    <video id="video-webrtc" autoplay style="width: 100%;height:300px; background-color: #000;" :muted="options.muted"></video>
    <div id="controlBtn" style="background-color: transparent;font-size: 40px;line-height: 40px;margin-left: .2rem;padding: 10px 0;">
      <i class="fa fa-play" aria-hidden="true" style="color: #bfbfbf;" id="playControl" @click="playOrPause"></i>
    </div>
    <input v-model="rtcUrl" disabled style="display: none"/>
    <div class="Group">
      <div class="GroupItem"><!-- 推拉流 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">推拉流</div>
          <div class="GroupItemValue">
            <mt-radio
              title=""
              v-model="options.monitorType"
              :options="OPTIONS_MONITOR_TYPE"
              @change="changeMonitorType">
            </mt-radio>
          </div>
        </div>
      </div>
      <div class="GroupItem" v-if="show.customType"><!-- 内网IP -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">内网IP</div>
          <div class="GroupItemValue">
            <input class="ItemInput" v-model="options.rtmp_ip" type="text" @change="">
          </div>
        </div>
      </div>  
      <div class="GroupItem" v-if="show.customType"><!-- 公网IP -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">公网IP</div>
          <div class="GroupItemValue">
            <input class="ItemInput" v-model="options.rtmp_ipMapping" type="text" @change="">
          </div>
        </div>
      </div>    
      <div class="GroupItem" v-if="show.customType"><!-- 推流IP -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">推流IP</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.pushIp_sel" @change="">
              <template v-for="item in OPTIONS_IP_TYPE">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
      <div class="GroupItem" v-if="show.customType"><!-- 拉流IP -->
        <div class="GroupItemField">
          <div class="GroupItemTitle">拉流IP</div>
          <div class="GroupItemValue">
            <select class="ItemSelect" v-model="options.pullIp_sel" @change="">
              <template v-for="item in OPTIONS_IP_TYPE">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
      </div>
      <div class="GroupItem"  v-if="show.customType"><!-- 按钮 -->
        <div class="GroupItemField">
          <div class="GroupItemTitle"></div>
          <div class="GroupItemValue" style="float:right">
            <mt-button class="ItemBtn" type="primary" @click="saveCustom">保存</mt-button>
            <mt-button class="ItemBtn" style="margin-left:10px;" @click="">清空</mt-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Device from '../basic/Device';
  import { MessageBox } from 'mint-ui';
  import { mapState, mapMutations } from 'vuex';
  import { SET_DEVICE_MODE_SELECT } from '../../store/mutation-types';
  import $ from 'jquery';
  import adapter from '../../plugin/adapter-7.4.0.min.js';
  import {SrsRtcPlayerAsync} from '../../plugin/srs.sdk.js';
  export default {
    name: "Monitor",
    data(){
      return{
        rtcUrl:"",
        rtcSdk:null,
        options:{
          monitorType:0,
          rtmp_ipMapping:"",
          rtmp_ip:"",
          pushIp_sel:0,
          pullIp_sel:0,
          muted:false,
          status:"",
        },
        show:{
          customType:false,
        },
        OPTIONS_MONITOR_TYPE:[{label: "本机", value: "0"}, 
                      {label: "自定义", value: "1"}],
        OPTIONS_IP_TYPE:[{text: "内网IP", value: "0"}, 
                         {text: "公网IP", value: "1"}],
      }
    },
    computed: {
      ...mapState(['user','paramLockAck','lockUserId','ActiveDevice'])//"ActiveDeviceType",
    },
    components: {
      Device
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          /*if(this.$route.fullPath == "/control"){
            this.ActiveDevice = val;
          }*/
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          var devSn = this.ActiveDevice.dev_sn;
          var rcvSn = this.ActiveDevice.rcv_sn;
          var boardId = this.ActiveDevice.board_id;
          this.showMonitorParam();
          this.webrtcClose();
          $("#playControl").removeClass("fa-pause").addClass("fa-play");
          this.updateBoardPushSel(0,devSn, rcvSn, boardId);
          this.options.status = "pause";
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      var that = this;
      var devSn = this.ActiveDevice.dev_sn;
      this.showMonitorParam();
      this.webrtcClose();
      $("#playControl").removeClass("fa-pause").addClass("fa-play");
      this.updateBoardPushSel(0,devSn, rcvSn, boardId);
      this.options.status = "pause";
    },
    deactivated(){   //生命周期-缓存页面失活
      this.webrtcClose();
    },
    methods:{
      ...mapMutations({
        SET_DEVICE_MODE_SELECT,
      }),
      /*视频监控参数*/
      showMonitorParam(){
        this.getMonitorParam(this.initVideo);
      },
      getMonitorParam(cb){
        console.log("getMonitorParam")
        /*console.log(this.ActiveDevice)*/
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getMonitorParam: true,
            rcvSn: that.ActiveDevice.rcv_sn,
            boardId: that.ActiveDevice.board_id,
          }),
          Api:"getMonitorParam",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            console.log("getMonitorParam")
            var data = res.data[0];
            console.log(data)
            if(data.monitorType == 0){
              that.show.customType = false;
            }else{
              that.show.customType = true;
            }
            that.options.monitorType = data.monitorType;
            that.options.rtmp_ip = data.rtmp_ip;
            that.options.rtmp_ipMapping = data.rtmp_ipMapping;
            that.options.push_sel = data.push_sel;
            that.options.pull_sel = data.pull_sel;
            if(cb){
              cb(data);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      changeMonitorType(){
        if(this.options.monitorType==0){
          this.show.customType = false;
          this.setMonitorType(0)
        }else{
          this.show.customType = true;
          this.setMonitorType(1)
        }
      },
      setMonitorType(type){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({    
            setMonitorType: true,
            monitorType: type,
            rcvSn: that.ActiveDevice.rcv_sn,
            boardId: that.ActiveDevice.board_id,
          }),
          Api:"setRtmpParam",
          AppId:"android",
          UserId:that.user.login_name
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
      saveCustom(){
        this.setRtmpParam();
        this.getMonitorParam(this.initVideo);
      },
      setRtmpParam() {
        var rtmpIp = this.options.rtmp_ip;
        var mappingIp = this.options.rtmp_ipMapping;
        var pullIpSel = this.options.pullIp_sel;
        var pushIpSel = this.options.pushIp_sel;
        if (!this.$global.isValidIP(rtmpIp)) {
          this.$toast({
            message: '请输入合法内网IP'
          });
          return;
        }
        if (pullIpSel == '1') {//拉流IP为公网IP
          if (!this.$global.isValidIP(mappingIp)) {
            this.$toast({
              message: '请输入合法公网IP'
            });
            return;
          }
        } else {//拉流IP为内网IP
          if (!this.$global.isValidIP(mappingIp)) {
            mappingIp = rtmpIp;
          }
        }
        if (rtmpIp == '') {
          this.$toast({
            message: '内网IP不能为空！'
          });
          return;
        }
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({    
            setRtmpParam: true,
            rcvSn: that.ActiveDevice.rcv_sn,
            boardId: that.ActiveDevice.board_id,
            rtmpIp: rtmpIp,
            mappingIp: mappingIp,
            pullIpSel: pullIpSel,
            pushIpSel: pushIpSel,
          }),
          Api:"setRtmpParam",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$toast({
              message: '保存成功'
            });
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //监控视频sdk播放
      webrtcPlay(){
        var that = this;
        var webrtcUrl = this.rtcUrl;
        if (this.rtcSdk) {
          this.rtcSdk.close();
        }

        this.rtcSdk = new SrsRtcPlayerAsync();
        $('#video-webrtc').prop('srcObject', this.rtcSdk.stream);
        this.rtcSdk.play(webrtcUrl).catch(function (reason) {
          that.rtcSdk.close();
          console.error(reason);
        });
      },
      //监控视频sdk播放
      webrtcClose(){
        if(this.rtcSdk){
          this.rtcSdk.close();
        }
      },
      /*initVideo(){
        var webrtcAddr = "webrtc://111.160.79.84/live/1000362140?eip=111.160.79.84";
        console.log("webrtcAddr:"+webrtcAddr)
        var url = webrtcAddr;
        this.rtcUrl = url;
        this.webrtcPlay();
      },*/
      initVideo(data){
        console.log("initVideo")
        console.log(data)
        var devSn = this.ActiveDevice.dev_sn;
        var rcvSn = this.ActiveDevice.rcv_sn;
        var boardId = this.ActiveDevice.board_id;
        var pushIp = "", pullIp = "";
        var monitorType = this.options.monitorType;
        if(monitorType == 0){//本机
          pushIp = "192.168.253.100";
          pullIp = data.rcv_ip;
        }else{
          if(data.push_sel == 0){//推流IP为内网IP
            pushIp = data.rtmp_ip;
          }else{
            pushIp = data.rtmp_ipMapping;
          }
          if(data.pull_sel == 0){//拉流IP为内网IP
            pullIp = data.rtmp_ip;
          }else{
            pullIp = data.rtmp_ipMapping; 
          }
        }
        var rtmpAddr = "rtmp://"+pushIp+"/live/"+devSn;
        console.log("rtmpAddr:"+rtmpAddr)
        var webrtcAddr = "webrtc://"+pullIp+"/live/"+devSn+"?eip="+pullIp;
        console.log("webrtcAddr:"+webrtcAddr)
        var url = webrtcAddr;
        this.rtcUrl = url;
        this.options.muted = false;//$('#video-webrtc').prop('muted', false);
        this.insertBoardPush(pushIp,devSn,rcvSn,boardId);
      },
      insertBoardPush(ip,devSn,rcvSn,boardId){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({    
            insertBoardPush: true,
            ip: ip,
            devSn: devSn,
            rcvSn: rcvSn,
            boardId: boardId,
          }),
          Api:"insertBoardPush",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            /*that.$toast({
              message: '保存成功'
            });*/
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      playOrPause(){
        var devSn = this.ActiveDevice.dev_sn;
        var rcvSn = this.ActiveDevice.rcv_sn;
        var boardId = this.ActiveDevice.board_id;
        if(this.options.status == "" || this.options.status == "pause"){
          if(this.options.monitorType == "1"){//自定义
            if(this.options.push_sel == 0){//推流IP为内网IP
              if(this.options.rtmp_ip == ""){
                this.$toast({
                  message: '请填写内网IP'
                });
                return; 
              }
            }else{//推流IP为公网IP
              if(this.options.rtmp_ipMapping == ""){
                this.$toast({
                  message: '请填写公网IP'
                });
                return;
              }
            }
            if(this.options.pullIp_sel == 0){//拉流IP为内网IP
              if(this.options.rtmp_ip == ""){
                this.$toast({
                  message: '请填写内网IP'
                });
                return;
              }
            }else{//拉流流IP为公网IP
              if(this.options.rtmp_ipMapping == ""){
                this.$toast({
                  message: '请填写公网IP'
                });
                return;
              }
            }
          }
          this.webrtcPlay();
          $("#playControl").removeClass("fa-play").addClass("fa-pause");
          this.updateBoardPushSel(1,devSn, rcvSn, boardId);
          this.options.status = "play";
        }else{
          this.webrtcClose();
          $("#playControl").removeClass("fa-pause").addClass("fa-play");
          //this.updateBoardPushSel(0,devSn, rcvSn, boardId);
          this.options.status = "pause";
        }
      },
      // 向board_push表中push_sel字段置位
      updateBoardPushSel(sel,devSn, rcvSn, boardId){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({    
            updateBoardPushSel: true,
            push_sel: sel,
            devSn: devSn,
            rcvSn: rcvSn,
            boardId: boardId,
          }),
          Api:"updateBoardPushSel",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
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
    .monitor{
        margin-top: 60px;
        /*height: clac(100% - 115px);
        padding-bottom: 62px;*/
        overflow-x:hidden;
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
        padding: .05rem .2rem;
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
    .ItemInput{
      width: 1.8rem;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .13rem;
      padding: 0px;
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