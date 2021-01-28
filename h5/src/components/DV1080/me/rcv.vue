<template>
  <div class="RcvMan">
    <div class="Group">
      <div class="GroupTitle" @click="ReceiverShow=!ReceiverShow">
        汇聚服务器信息
        <i class="titleIcon fa" :class="[ReceiverShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getReceiverList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addReceiver" v-if="rcvAddShow"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="ReceiverShow" id="rcvList">
          <template v-for="(item,i) in receiverList">
            <mt-cell-swipe
              :right="[ 
              {content: '背包',handler:() => showDevice(item)},
              {content: '编辑',handler:() => editReceiver(item)},
              {content: '删除',style:{display:rcvDelShow?'':'none'}, handler:() => deleteReceiver(item)}
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">服务器名称</span>
                <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.rcv_name }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">状态</span>
                <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.online }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">序列号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_sn }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">上线时间</span>
                <span class="cellName cellValue" style="float: right;">{{ item.datetime }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">映射IP</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_ip }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">本地IP</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_ownIP }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">型号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_model }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">软件版本</span>
                <span class="cellName cellValue" style="float: right;">{{ item.softVer }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">MAC</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_mac }}</span>
              </div>
            </mt-cell-swipe>
          </template>
        </div>
      </transition>
    </div>
    <!-- 背包信息 -->
    <mt-popup v-model="deviceVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          背包
          <i class="popupCloseBtn fa fa-times" @click="deviceVisible = false"></i>
        </div>
        <template v-for="(item,i) in devicePopupList">
          <div class="deviceItem">
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">背包名</span>
              <span class="cellName cellValue" style="float: right;">{{ item.board_id }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">状态</span>
              <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.online }}</span>
            </div>
          </div>
        </template>
      </div>
    </mt-popup>
    <!-- 汇聚服务器配置 -->
    <mt-popup v-model="receiverConfigVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          汇聚服务器配置
          <i class="popupCloseBtn fa fa-times" @click="receiverConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitReceiverConfig">
          <div class="fGrp">
            <div class="tl">名称</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="receiverConfigForm.rcvName" required pattern="[A-z0-9+-@() ]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,(),空格" :disabled="receiverConfigType=='edit' && user.id == SUPER">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1-15,仅支持中文,字母,数字,+,-,@,()和空格</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="receiverConfigForm.rcvSn" required pattern="[A-z0-9]{10}" title="10位数字或字母序列号" :disabled="receiverConfigType == 'edit'"> 
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button @click="receiverConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button type="submit">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { } from '../../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "DevMan",
    data(){
      return{
        selected: '1',
        SUPER : SUPER,
        ADVANCE : ADVANCE,
        NORMAL : NORMAL,
        ADMIN : ADMIN,
        ReceiverShow:false,
        rcvAddShow:true,//添加按钮
        rcvDelShow:true,//删除按钮
        receiverList:[],
        receiverConfigVisible:false,
        receiverConfigType:'add',
        receiverConfigForm:{
          rcvName:"",
          rcvSn:""
        },
        deviceVisible:false,
        devicePopupList:[],
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          this.getReceiverList();
        }
      }
    },
    created(){  //生命周期-页面创建后
      var that = this;
      if(that.user.id == that.SUPER){
        that.rcvAddShow = true;
        that.rcvDelShow = true;
      }else{
        that.rcvAddShow = false;
        that.rcvDelShow = false;
      }
      this.getReceiverList();
    },
    activated(){
      console.log("devMan activated")
      this.getReceiverList();
    },
    methods:{
      ...mapMutations({
          
      }),
      getReceiverList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getRcv:true,
            userId: that.user.id
          }),
          Api:"getRcv",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            var mapArr = {"直播":1,"在线":2,"离线":3}
            that.receiverList = data.sort(function(a, b){
              return (mapArr[a.online] - mapArr[b.online])
            });
          }else{
            that.receiverList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      showDevice(item){
        var that = this;
        this.devicePopupList = [];
        this.deviceVisible = true;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getboardByVirRcvSn:true,
            rcvSN: item.rcv_sn,
            user_Id:that.user.id
          }),
          Api:"getboardByVirRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.devicePopupList = res.data;
          }else{
            that.devicePopupList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      editReceiver(item){
        this.receiverConfigVisible = true;
        this.receiverConfigType = "edit";
        this.receiverConfigForm = {
            rcvName:item.rcv_name,
            rcvSn:item.rcv_sn
        }
      },
      deleteReceiver(item){
        var that = this;
        var delBroad = false;
        if(item.online == "直播"){
          delBroad = true;
          that.$toast({
            message: "当前设备正在直播!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var rcvSn = item.rcv_sn;
        var text = '确认删除选中设备?';
        this.$messagebox.confirm(text).then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delRcvSns: rcvSn,
                userId: that.user.id
              }),
              Api:"delRcv",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.getReceiverList();
                that.receiverConfigVisible = false;
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
        }).catch(()=>{
          console.log("cancel");
        });
      },
      submitReceiverConfig(){
        var that = this;
        var rcvSn = this.receiverConfigForm.rcvSn;
        var mode = this.$global.getRcvMode(rcvSn.substr(-4));
        var upgrade = 0;
        if (!mode) {
          that.$toast({
            message: "接收机型号不支持!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(that.receiverConfigType == "add"){
          for(var i=0; i<this.receiverList.length; i++){
            if (this.receiverList[i].rcv_sn == rcvSn) {
              that.$toast({
                message: "该接收机已添加!",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            rcvName: that.receiverConfigForm.rcvName,
            rcvSn: that.receiverConfigForm.rcvSn,
            rcvModel: mode,
            userId: that.user.id,
            prefix: that.user.id,
            rcvUser: '',
            type: that.receiverConfigType
          }),
          Api:"saveRcv",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getReceiverList();
            that.receiverConfigVisible = false;
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
      addReceiver(){
        this.receiverConfigVisible = true;
        this.receiverConfigType = "add";
        this.clearRcvPopup();
      },
      clearRcvPopup(){
        this.receiverConfigForm.rcvName = "";
        this.receiverConfigForm.rcvSn = "";
      },
    }
  }
</script>

<style scoped>
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
    font-size: .15rem;
    font-weight:500;
    color: #B7B7B7;
  }
  .GroupItem{
      padding: .05rem .08rem;
  }
  .GroupItemField{
      overflow: hidden;
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
  .ItemSelect{
    width:100%;
    height: .26rem;
    border: 1px solid #3d81f1;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
    font-size: .12rem;
    background-color: #FFFFFF;
    color:#000;
  }
  .ItemSelectBlack{
    background-color: #000;
    color:#fff;
    width: 1.8rem;
    height: .26rem;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
    font-size: .12rem;
  }
  .setBtn{
    border: none;
    outline: none;
    box-shadow: none;
    height: .26rem;
    margin-top: .02rem;
    font-size: .12rem;
    border-radius: 5px;
    padding: 0 .1rem;
  }
  .titleIcon{
    width: .2rem;
    height: .2rem;
    display: inline-block;
    color:#B7B7B7;
    vertical-align: text-top;
    margin-top: 2px;
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
  .ItemInput{
    width:100%;
    height: .22rem;
    border: 1px solid #3d81f1;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
    font-size: .12rem;
    background-color: #FFFFFF;
    color:#000;
  }
  .addBtn{
    float: right;
    width: .3rem;
    text-align: center;
  }
  .userPrefixPop.mint-popup{
    background-color: #212227;
    width: 100%;
    height: auto;
  }
  .chevronDown{
    width: 100%;
    background-color: #3f4551!important;
    color: #fff;
    border: 1px;
    display: block;
    text-align: center;
    padding: 5px;
    font-size: .16rem;
  }
  .cellItem{overflow:hidden}
  .cellItem .cellName{float: left;text-align: left;}
  .cellItem .cellNameR{float: right;text-align: right;}
  .cellItem .cellAddr{color:#888;font-size:13px;}
  .cellItem .cellCard{color:#444}
  .popupTitle{
    padding: .1rem;
    font-size: .14rem;
  }
  .popupCloseBtn{
    float: right;
    width: .24rem;
    height: .24rem;
    color: #B00;
    font-size: .16rem;
    margin-top: -2px;
    text-align: right;
  }
  .deviceCardItem,.deviceItem,.devRightsItem{
    border-bottom: 2px solid #AAA;
    padding:2px 10px;
  }
  .deviceCardItem:last-child,.deviceItem:last-child{
    border-bottom: 0;
  }
  .deviceCardItem .cellItem,
    .deviceItem .cellItem{
    margin-top:3px;
  }
  .navTitle{
    text-align:center;
    display:inline-block;
    width:100%;
  }
  .wholePagePop{
    background-color:#212227;
    font-size:.14rem;
    color:#fff;
    width: 100% !important;
    height: 100%;
    max-height: 100% !important;
  }
  .wholePagePop .page-title{
    font-size:.16rem;
    color:#fff;
    padding:10px;
  }
  .mint-switch{
    transform: scale(.7);
    transform-origin: left;
  }
</style>
<style>
  .DevMan .mint-checkbox-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.14rem !important;
  }
  .userPrefix .mint-cell-title{
    flex:auto;
    font-size:.14rem;
  }
  .userPrefix .mint-cell-value{
    width:auto !important;
  }
  .userPrefix .mint-cell-wrapper{
    background-color:#000;
  }
  
  .cardInfoPop.mint-popup{
    width: 90% !important;
    max-height: 90% !important;
    overflow-y: auto !important;
    border-radius: 4px !important;
    background-color: #EEE !important;
  }
  .cardInfoPop .popupContainer{
    font-size:.14rem;
  }
  .popupContainer .mint-cell-title{width:40%;text-align: left;}
  .popupContainer .mint-cell-value{width:60%;text-align: right;padding:0;}
  .popupContainer .mint-cell{min-height:24px;}
  .popupContainer .fGrp{overflow: hidden;padding: .1rem;}
  .popupContainer .fGrp .tl{width: 25%;float: left;  text-align: right;padding-top:0.07rem;margin-right: 5%;}
  .popupContainer .fGrp .vl{width: 62%;float: left; text-align: right}
  .popupContainer .fGrp button{padding: .02rem .1rem;width: .8rem;outline: none;border-radius: 4px;box-shadow:none;margin-top: .02rem;margin-right: .05rem;}
  .onlineStyle{
    color:#00ff00;
  }
  #devList .mint-cell-value>.cellItem{
    display:flex;
  }
  #devList .mint-cell-value>.cellItem span:first-child{
    flex-shrink:0;
    flex-grow:1;  
  }
  #devList .mint-cell-value>.cellItem span:last-child{
    flex-shrink:1;
    text-align:right;
  }

  .channelList .mint-loadmore-text{color: #FFF;}
  .DevMan .mint-cell-wrapper{
    background-image:linear-gradient(180deg,#000,#000 50%,transparent 0) !important;
  }
  .DevMan .mint-cell-wrapper{
    padding:0 10px !important;
    padding-left:10px !important;
  }
  .DevMan .mint-cell{
    background-color:#3f4551 !important;
    color:#fff !important; 
    min-height: 48px !important;
    display: block !important;
  }
  .DevMan .mint-radio-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.16rem !important;
  }
  .DevMan .mint-radiolist-label {
    display: block !important;
    padding: 0 10px !important;
  }
  .userPrefixPop .mint-radiolist-title,
  .userPrefixPop .mint-checklist-title{
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
  /*.mint-toast{
    z-index:2010 !important;
  }*/
</style>