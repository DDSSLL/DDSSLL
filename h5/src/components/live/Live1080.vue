<template>
  <div class="live mainPage">
    <Device page='dev'></Device>
    <!-- <Device></Device> -->
    <div class="Group" v-if="show.devMod">
      <div class="GroupItem" style="padding: .1rem;border-bottom:0;text-indent:.1rem">
        <div class="GroupItemField">
          <div class="GroupItemTitle">背包模式</div>
          <div class="GroupItemValue">
            <span style="font-size: .14rem;vertical-align: baseline;line-height: .3rem;color:#fff;">{{common.WorkMode}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="Group" v-if="common.WorkMode!='互动'">
      <div v-if="common.WorkMode == '推流'">
        <div class="GroupTitle">推流地址</div>
        <transition name="slide-fade">
          <div v-show="liveUrlShow1080">
            <div class="addressGroup" style="padding:0">
              <div v-if="curDevSeries=='4000'">
                <PushUrl  v-bind:lockState="pageLock" v-bind:workMode="common.WorkMode"></PushUrl>  
              </div>
              <div v-else>
                <PushUrl  v-bind:lockState="pageLock" v-bind:workMode="common.WorkMode" v-bind:transMode="common.transMode"></PushUrl>
              </div>
            </div>      
          </div>
        </transition>
      </div>
      <div v-if="common.WorkMode == '拉流'">
        <div class="GroupTitle">拉流地址</div>
      </div>
      <!-- <div class="Group" v-if="common.WorkMode!='互动'">
        <PushUrl @childFn="parentFn" v-bind:lockState="rcvParamLock" v-bind:workMode="common.WorkMode" v-bind:transMode="common.transMode" v-bind:cardId="common.cardId"></PushUrl>
      </div> -->
      <mt-popup v-model="pushUrlsEditVisible" popup-transition="popup-fade">
        <div class="pushEditModal">
          <div class="modalTitle">
            推流地址
            <i class="closeBtn fa fa-close" @click="hideEditUrls"></i>
          </div>
          <div class="formContainer">
            <div class="formItem">
              <div class="formItemTitle">备注名</div>
              <div class="formItemVal">
                <input type="text" v-model="activePushObj.remark" :disabled="this.dev_push_enable">
              </div>
            </div>
            <div class="formItem">
              <div class="formItemTitle">推流地址</div>
              <div class="formItemVal">
                <input type="text" v-model="activePushObj.push_url" :disabled="this.dev_push_enable">
                <p class="rtmpTip">支持 RTMP+H.264、RTMP+H.265</p>
              </div>
            </div>
            <div class="formItem" style="text-align: right;margin-bottom: 0;" v-if="!rcvParamLock">
              <button class="modalBtn" @click="hideEditUrls">取消</button>
              <button class="modalBtn" @click="saveEditUrls" style="background-color: #3d81f1;color:#fff;">确定</button>
            </div>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import Device from '../basic/Device';
  import PushUrl from '../basic/PushUrl';
  import { mapState } from 'vuex';
  export default {
    name: "Live1080",
    data(){
      return{
        curDevSeries:"",
        pageLock:false,
        liveUrlShow1080:true,
        //pageLock:false,
        devTypeArr : ["推流","拉流","互动"],
        OPTIONS_CARD : [{text: "ETH0",value: "eth0"}, 
                        {text: "LTE1",value: "lte1"}, 
                        {text: "LTE2",value: "lte2"},
                        {text: "LTE3",value: "lte3"},
                        {text: "USB-LAN1",value: "usb-lan"}, 
                        {text: "USB-5G1",value: "usb-5g1"}, 
                        {text: "USB-5G2",value: "usb-5g2"},
                        {text: "WiFi",value: "wifi"}],
        pushUrlsEditVisible:false,
        activePushObj:{},
        dev_push_enable:false,
        live:{
          rate:1,
          resolution:'1080p'
        },
        address:[],
        RADIO_TRANS_MODE:[],
        common:{
          WorkMode:"",
          transMode:"",
          PushCard:"",
          cardId:"",
        },
        dis:{
          PushCard:"",
        },
        show:{
          devMod:false,
          cardSelShow:false,
        },
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice','devPushEnable','paramLockAck','lockUserId'])//"ActiveDeviceType",
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          var that = this;
          if(this.$route.fullPath == "/live1080"){
            this.getLockStates();
            this.$global.getNetBoard(function(data){
              that.formatCardSel(data)
            })
          }
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/live1080"){
            this.curDevSeries = this.$global.getDevSeries(this.ActiveDevice.dev_sn);
            if(this.curDevSeries == '4000'){
              this.$router.push("/live4000");
            }else{
              this.$router.push("/live1080");
            }
            clearInterval(localStorage.getPushUrl1080);
            this.getPushUrl();
            this.getDeviceParam();
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
      this.userFunction();
      this.getPushUrl();
      this.getDeviceParam();
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getPushUrl1080);
    },
    /*mounted(){
    console.log("mounted")

    },*/
    components: {
      Device, PushUrl
    },
    methods:{
      parentFn(data){
        this.dev_push_enable = data.dev_push_enable;
      },
      formatCardSel(data){
        var onlineArr = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i]["card_id"] == "lte1" || data[i]["card_id"] == "lte2" ||
              data[i]["card_id"] == "lte3" || data[i]["card_id"] == "eth0"){
            var text = "离线:";
            if(data[i]["online"] == '1'){
              text = "在线:";
            }
            var json = {
              text: text+data[i]["card_name"],
              value: data[i]["card_id"],
            };
            onlineArr.push(json);
          }
        }
        this.OPTIONS_CARD = onlineArr;
      },
      /*changeTransMode(){
        if(this.common.transMode==1){
          //this.$global.setDeviceParam('PushTsType', 1);
          this.show.cardSelShow = true;
          this.$global.setDevParamList(['PushTsType','bitrate_mode'],[1,0]);//1080推流模式，汇聚->单卡时码率控制设置成0
        }else{
          this.$global.setDeviceParam('PushTsType', 0);
          this.show.cardSelShow = false;
        }
      },*/
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
        /*that.RADIO_TRANS_MODE = [{
          label: '汇聚',
          value: '0',
          disabled: this.rcvParamLock?true:false
        },{
          label: '单卡',
          value: '1',
          disabled: this.rcvParamLock?true:false
        }]*/
      },
      userFunction(){
        if (this.user.id == SUPER) {
          this.show.devMod = true;//背包模式
        } else {
          this.show.devMod = false;//背包模式
        }
        this.show.devMod = true;//调试暂时放开
      },
      getDeviceParam(){
        var that = this;
        that.$global.getDeviceParam(function(data){
          that.common.WorkMode = that.devTypeArr[data["WorkMode"]];
          that.common.transMode = data["PushTsType"];
          if(data["PushTsType"] == "1"){
            that.show.cardSelShow = true;
          }else{
            that.show.cardSelShow = false;
          }
          that.common.PushCard = that.$global.cardEnum2Id(data['PushTsNet']);
        })
      },
      setPushTsNet(){
        this.$global.setDeviceParam('PushTsNet',this.$global.cardId2Enum(this.common.PushCard));
      },
      //修改接收机锁定状态
      changeRcvLockState(data){
        console.log("changeRcvLockState")
        if(data == "lock"){
          this.rcvParamLock = true;
        }else{
          this.rcvParamLock = false;
        }
        console.log("this.rcvParamLock:"+this.rcvParamLock)
      },
      getPushUrl(){
        var that = this;
        that.address = [];
        that.$global.getPushUrls(that.formatPushUrls);
        that.getPushParam();
        localStorage.getPushUrl1080 = setInterval(function(){
          if(that.dev_push_enable){
            that.$global.getPushUrls(that.formatPushUrls);  
          }
          that.getPushParam();
        },500)
      },
      //URL地址nEnable
      changeUrlEnable(item){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            UrlcheckEnable: true,
            id: item.id,
            nEnable: item.enable?1:0,

          }),
          Api:"UrlcheckEnable",
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
      formatPushUrls(data){
        var that = this;
        for(let i=0; i<data.length; i++){
          if (data[i].push_status != 'running' && data[i].push_status != '') {
            data[i].push_url += ('(' + data[i].push_status + ')');
          } 
          data[i]["enable"] = data[i]["nEnable"]=='1'?true:false;
        }
        that.address = data;
      },
      //获取推流开关参数
      getPushParam(){
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
            var data = res.data[0];
            if(data.dev_push_enable == '0' && data.dev_push_status == '0'){  //推流开关
              that.dev_push_enable = false;
            }else if(data.dev_push_enable == '1'){
              that.dev_push_enable = true;
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //数据库删除url
      delUrl(item) {
        var that = this;
        this.$messagebox.confirm("确定删除该推流地址?").then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/index/indexData.php",
              data:this.$qs.stringify({
                delUrl:item.id
              }),
              Api:"delUrl",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.$toast({
                  message: '操作成功'
                });
              }else{
                that.$toast({
                  message: '操作失败'
                });
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        });
      },
      showEditUrls(obj){
        this.pushUrlsEditVisible = true;
        this.activePushObj = obj;
        //this.getPushParam();
      },
      hideEditUrls(){
        this.pushUrlsEditVisible = false;
        this.activePushObj = {};
      },
      saveEditUrls(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editUrlRemark:that.activePushObj.id,
            rcvSn: that.activePushObj.rcv_sn,
            boardId: that.activePushObj.board_id,
            url: that.activePushObj.push_url,
            remark: that.activePushObj.remark
          }),
          Api:"editUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$global.getPushUrls(that.formatPushUrls);
            that.pushUrlsEditVisible = false;
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
            that.$global.getPushUrls(that.formatPushUrls);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      /*switchPush(item){
        var value =  (item.push_status == 'running' ? 0 : 1);
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editUrl:item.id,
            col: "push_sel",
            value: value
          }),
          Api:"editUrlStatus",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$global.getPushUrls(that, that.formatPushUrls);
          }else{
            that.$global.getPushUrls(that, that.formatPushUrls);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      }*/
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
        font-size: .16rem;
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
        float: left;
        width: 32%;
        padding-right: 2%;
        text-align: right;
    }
    .iconBtn{
        cursor: pointer;
        font-size: .21rem;
        margin-right: .12rem;
        margin-top: .08rem;
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
        border: none;
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
    .width100{
      width:100%;
    }
    .widthPart{
      width:65%;
    }
    .ItemSelect{
      width: 1.8rem;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .12rem;
    }
</style>
<style>
    .mint-radiolist .mint-cell{
      background-color: transparent;
      background-image: none!important;
      display: inline-block;
      min-height: auto;
      color: #fff;
    }
    .mint-radiolist .mint-cell .mint-cell-wrapper{
      padding:0px;
      background-image:none;
    }
    .mint-radiolist  .mint-radiolist-title{
      display:none;
    }
    .mint-radiolist .mint-radio-label{
      font-size:.14rem;
    }
    .mint-radiolist-label{
      padding-left:0px;
    }
</style>