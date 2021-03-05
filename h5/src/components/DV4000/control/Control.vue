<template>
  <div class="control">
    <keep-alive>
      <Device></Device>
    </keep-alive>
    <div class="Group">
      <div class="GroupTitle">网卡设置</div>
      <div class="GroupItem" style="padding: .1rem;border-bottom:0;">
        <table class="netBoardTable">
          <thead>
            <tr>
              <th>网卡</th>
              <th>启用/禁用</th>
              <th>上传<br>Mbps</th>
              <th>RTT<br>ms</th>
              <th>强度<br>dBm</th>
              <th>运营商</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in netBoard">
              <tr v-if="item.cardShow == '1'">
                <td class="td" :class="[item.online == '1' ? 'green': 'gray']">{{ item.card_name }}</td>
                <td class="td"><mt-switch v-model="item.used" @change="switchCard(item)" :disabled="(!pageLock && ActiveDevice.online=='1')?false:true"></mt-switch></td>
                <td class="td">{{ item.send_br }}</td>
                <td class="td">{{ item.card_rtt }}</td>
                <td class="td">{{ item.rssi }}</td>
                <td class="td">{{ transOperator(item.operator) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="Group">
      <div class="GroupTitle pushEnableSwitch" style="padding:0px;border-bottom:0px;">
        <div class="GroupItem">
          <div class="GroupItemField">
            <div class="GroupItemTitle" style="text-indent:0px">传输开关</div>
            <div class="GroupItemValue">
              <mt-switch v-model="common.dev_push_enableVal" @change="setDevPushEnable" :disabled="(paramLockAck=='1' && ActiveDevice.online=='1')?false:true"></mt-switch>
              <span id="url_dis" v-if="pushDisShow" style="color:red">推流地址不通</span>
            </div>
          </div>
        </div>
      </div>
      <div class="GroupTitle">常用设置</div>
      
      <div class="GroupItem">
        <div class="GroupItemField">
          <div class="GroupItemTitle">视频比特率(Mbps)</div>
          <div class="GroupItemValue">
            <mt-range
              v-model="common.dev_srVal_range"
              class="ItemRange byteRange"
              :min="BITRATE_MIN"
              :max="BITRATE_MAX"
              :step="0.1"
              :bar-height="5"
              :disabled="(paramLockAck=='1' && ActiveDevice.online=='1')?false:true"
              @change="setDeviceParam('dev_sr_range')">
              <div style="color: #EEEEEE;padding: .01rem;" slot="start">{{BITRATE_MIN}}</div>
              <div style="color: #EEEEEE;padding: .01rem;" slot="end">{{BITRATE_MAX}}</div>
            </mt-range>
            <input type="text" class="ItemIpt byteIpt" v-model.number="common.dev_srVal_input" @blur="setDeviceParam('dev_sr_input')" :disabled="(paramLockAck=='1' && ActiveDevice.online=='1')?false:true">
          </div>
        </div>
      </div>
      <div class="GroupItem">
        <div class="GroupItemField">
          <div class="GroupItemTitle">延时(s)</div>
          <div class="GroupItemValue">
            <mt-range
              v-model="common.dev_delayVal_range"
              class="ItemRange byteRange"
              :min="DELAY_MIN"
              :max="DELAY_MAX"
              :step.number="0.1"
              :bar-height="5"
              :disabled="(!pageLock && ActiveDevice.online=='1')?false:true"
              @change="setDeviceParam('dev_delay_range')">
              <div style="color: #EEEEEE;padding: .01rem;" slot="start">{{DELAY_MIN}}</div>
              <div style="color: #EEEEEE;padding: .01rem;" slot="end">{{DELAY_MAX}}</div>
            </mt-range>
            <input type="text" class="ItemIpt byteIpt" v-model.number="common.dev_delayVal_input" @blur="setDeviceParam('dev_delay_input')" :disabled="!pageLock?false:true">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Device from '../basic/Device';
  import { mapState, mapMutations } from 'vuex';
  /*import {  } from '../../../store/mutation-types';*/
  import $ from 'jquery';
  export default {
    name: "Control",
    data(){
      return{
        pageLock:false,
        BITRATE_MIN : 0, //Mbps   数据库里的dev_sr
        BITRATE_MAX : 0,
        DELAY_MIN : 0.1, //s
        DELAY_MAX : 20,
        delayMin : 0,
        delayMax : 0,
        speedMin : 0,
        speedMax : 0,
        ActiveDevice:null,
        pushDisShow:false,
        common:{
          dev_push_enable:"0",
          dev_push_enableVal:false,
          dev_sr:0,
          dev_srVal:0,
          dev_srVal_range:0,
          dev_srVal_input:0,
          dev_delay:0,
          dev_delayVal:0
        },
        netBoard:[]
      }
    },
    computed: {
      ...mapState(['user',"ActiveDeviceType",'paramLockAck','lockUserId'])
    },
    components: {
      Device
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          this.getLockStates();
          /*if(this.paramLockAck != "1"){
            this.getNetBoard();
            this.$global.getDeviceParam(this.formatData)
          }
          this.$global.getPushUrls(this, this.formatPushUrlState);*/
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      this.getNetBoard();
      this.$global.getDeviceParam(this.formatData)
      this.getLockStates();
      var that = this;
      localStorage.getControlParam = setInterval(function(){
        that.getNetBoard();
        //if(that.paramLockAck != "1"){//页面锁定
        if(!that.pageLock){//页面锁定
          that.$global.getDeviceParam(that.formatData)
        }
        that.$global.getPushUrls(that, that.formatPushUrlState);
      },1000)
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getControlParam)
    },
    methods:{
      /*...mapMutations({
          
      }),*/
      getLockStates(){
        console.log("getLockStates");
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
      },
      getNetBoard(){
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
            that.netBoard = that.formatSwitch(res.data[0]);
          }else{
            that.netBoard = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatSwitch(arr){
        var that = this;
        arr.forEach(function(item){
          var defaultShowArr = ["eth0", "lte1", "lte2", "lte3", "lte4", "lte5", "lte6"]
            if ($.inArray(item.card_id, defaultShowArr) != -1){
              item.cardShow = '1';
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
      /*getDeviceParam(){
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
          if(res.res.success){
            that.common = that.formatData(res.data[0]);
          }else{
            that.common = {
              dev_push_enable:"0",
              dev_push_enableVal:false,
              dev_sr:0,
              dev_srVal:0,
              dev_srVal_range : 0,
              dev_srVal_input : 0,
              dev_delay:0,
              dev_delayVal_range : 0,
              dev_delayVal_input : 0,
              dev_delayVal:0
            };
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },*/
      formatData(data){
        console.log("formatData")
        console.log(data);
        var that = this;
        var prefix = that.user.prefix;
        if(data.dev_push_enable == '0' && data.dev_push_status == '0'){  //推流开关
          that.common.dev_push_enableVal = false;
          that.common.pushDisShow = false;
        }else if(data.dev_push_enable == '1'){
          that.common.dev_push_enableVal = true;
          that.$global.getPushUrls(that, that.formatPushUrlState);
        }
        //视频比特率最大值
        if(data['video_input'] == '4'){//视频输入是HDMI(此情况下无超低延时)
          that.BITRATE_MAX = 20;
        }else{
           if(prefix == "001" || prefix == "xs" || prefix == "hngd"){
              that.BITRATE_MAX = 100;
           }else{
              that.BITRATE_MAX = 40;
           }
        }
        //视频比特率最小值
        if(this.user.prefix != "001" && data.latency == "1"){
          that.BITRATE_MIN = 8;
        }else{
          that.BITRATE_MIN = 1;
        }
        
        that.common.dev_srVal = (data.dev_sr / 1000).toFixed(1); //(Mbps)
        that.common.dev_srVal_range = that.common.dev_srVal;
        that.common.dev_srVal_input = that.common.dev_srVal;
        //延时
        if(that.common.dev_srVal <= 40){
          that.DELAY_MAX = 20;
        }else{
          that.DELAY_MAX = 10;
        }
        that.common.dev_delayVal = (data.dev_delay / 1000).toFixed(3); //(s)
        that.common.dev_delayVal_range = that.common.dev_delayVal;
        that.common.dev_delayVal_input = that.common.dev_delayVal;
      },
      //推流地址状态
      formatPushUrlState(data){
        var that = this;
        var runningStatusCount = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].push_sel == '1') {
            if (data[i].push_status == 'running') {
              runningStatusCount++;
            }
          }
        }
        that.pushDisShow = false;
        if(runningStatusCount == 0 && that.common.dev_push_enableVal){
          that.pushDisShow = true;
        }
      },
      
      //传输开关
      setDevPushEnable(){
        var that = this;
        if(that.common.dev_push_enableVal){//开
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
          //回传中要询问
          var text = '';
          if ($('#work_str').text() == '文件离线回传中') {
            text = '是否停止背包文件回传？';
            //询问
            layer.confirm(text, {
              btn: ['确定', '取消'], //按钮
              shade: [0.8, '#393D49'] //显示遮罩
            }, function(index, layero) {
              //停止文件回传
              clickBackStopBtn();
              $('#back_enable').bootstrapSwitch('state', false, true);
              //setDevParam('dev_push_enable', 1, switchId);
              $("#dev_push_enable").bootstrapSwitch('state', false, true);
              layer.load(1, {
                shade: [0.1, '#fff'],
                time: 2000
              });
              layer.close(index);
            }, function() {
              //取消
            });
          } else {
            //打开传输
            that.setDeviceParam('dev_push_enable');
            //setDevPush = 1;
          }
        }else{
          that.setDeviceParam('dev_push_enable');
        }
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
      //判断是否有推流地址，没有推流地址不能打开传输开关,有推流地址，启用所有推流地址
      checkDevPushCondition(cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            checkDevPushCondition:true,
            boardId: that.ActiveDevice.dev_sn
          }),
          Api:"checkDevPushCondition",
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
            that.common.dev_push_enableVal = false; 
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      setDeviceParam(key){
        console.log("setDeviceParam:"+key)
        var that = this;
        var devParamCol = key;
        var value;
        if(key == "dev_push_enable"){
          value = that.common.dev_push_enableVal? "1" : "0";
        }else if(key == "dev_sr_input"){
          value = parseFloat(that.common.dev_srVal_input) * 1000;
          that.common.dev_srVal_range = that.common.dev_srVal_input;
          devParamCol = "dev_sr";
        }else if(key == "dev_sr_range"){
          value = parseFloat(that.common.dev_srVal_range) * 1000;
          that.common.dev_srVal_input = that.common.dev_srVal_range;
          devParamCol = "dev_sr";
        }else if(key == "dev_delay_input"){
          value = parseFloat(that.common.dev_delayVal_input) * 1000;
          that.common.dev_delayVal_range = that.common.dev_delayVal_input;
          devParamCol = "dev_delay";
        }else if(key == "dev_delay_range"){
          value = parseFloat(that.common.dev_delayVal_range) * 1000;
          that.common.dev_delayVal_input = that.common.dev_delayVal_range;
          devParamCol = "dev_delay";
        }
        console.log("value:"+value);
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
            that.$global.getDeviceParam(that.formatData)
          }else{
            that.$global.getDeviceParam(that.formatData)
          }
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
        if(netBoards[i].cardShow == 1 && netBoards[i].used == 1){
          usedCardCount++;
        }
      }
      return usedCardCount;
    }
  }
}
</script>

<style scoped>
    .control{
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
        line-height: .3rem;
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
        width: 25%;
        height: .22rem;
        line-height: .22rem;
        outline: none;
        border:1px solid #b8bbbf;
        border-radius: 5px;
        font-size: .16rem;
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
    .pushEnableSwitch .mint-switch{
      transform: scale(0.9);
    }
</style>