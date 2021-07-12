<template>
  <div class="me">
    <!-- 背包 -->
    <DevMan></DevMan>
    
    <!-- 实体接收机 -->
    <RcvMan></RcvMan>

    <!-- 虚拟服务器 -->
    <VirRcvMan></VirRcvMan>
    
    <!-- 录机管理 -->
    <Record></Record>
    
    <!-- 用户 -->
    <UserMan></UserMan>

    <!-- 用户组 -->
    <PrefixMan v-if="user.userGroup == ADMIN"></PrefixMan>

    <!-- 图表配置 -->
    <chartConf></chartConf>

    <!-- 系统设置 -->
    <systemConf></systemConf>
    <!-- 路测 -->
    <!-- <RoadTest></RoadTest> -->
    
    <div class="Group">
      <!-- <div class="GroupTitle" @click="SystemShow=!SystemShow">
        系统
        <i class="titleIcon fa" :class="[SystemShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div> -->
      <!-- <transition name="slide-fade"> -->
        <div class="GroupItem" v-show="SystemShow" id="systemInfo">
          <mt-cell title="当前登录用户" :value="user.id" style="font-size:.14rem"></mt-cell>
          <!-- <mt-cell title="设备版本" value="1.00.02"></mt-cell> -->
          <mt-button size="large" class="logout" @click="logout">退出</mt-button>
        </div>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
  import DevMan from './dev';
  import RcvMan from './rcv';
  import VirRcvMan from './virrcv';
  import Record from './record';
  import UserMan from './user';
  import PrefixMan from './prefix';
  import RoadTest from './roadTest';
  import chartConf from './chartConf';
  import systemConf from './systemConf';
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER, SET_NAV_STATUS, SET_ACTIVE_DEVICE, SET_TIMER_CLEAR,SET_DEVICE_TYPE_SELECT,SET_DEVICE_PREFIX_SELECT } from '../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "Me",
    data(){
      return{
        SystemShow:true,
        RoadTestShow:false,
      }
    },
    computed: {
      ...mapState(['user','navHide','ChartTimer'])
    },
    components: {
      DevMan,RcvMan,VirRcvMan,Record,UserMan,PrefixMan,RoadTest,chartConf,systemConf
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
        }
      }
    },
    mounted(){
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      ...mapMutations({
          SET_USER,
          SET_NAV_STATUS,
          SET_ACTIVE_DEVICE,
          SET_TIMER_CLEAR,
          SET_DEVICE_TYPE_SELECT,
          SET_DEVICE_PREFIX_SELECT
      }),
      logout(){
        clearInterval(this.ChartTimer);
        this.SET_TIMER_CLEAR();
        var that = this;
        this.$toast({
          message: '操作成功',
          position: 'middle',
          duration: 2000
        });
        setTimeout(function(){
          that.SET_USER(null);
          that.SET_NAV_STATUS(true);
          that.SET_ACTIVE_DEVICE(null);
          that.SET_DEVICE_TYPE_SELECT(1);
          that.SET_DEVICE_PREFIX_SELECT("all");
          that.$router.replace("/login");
          localStorage.removeItem('LOGIN');
          clearInterval(localStorage.loginTimer);
        }, 1000);
      }
    }
  }
</script>

<style scoped>
    .me{
        background-color: #212227;
        height: calc(100% - 0.5rem);
        overflow:auto;
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
    .logout{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .GroupItem{
        padding: .05rem .08rem;
    }
    .GroupItem0{
        padding: .05rem 0rem;
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
    .GroupItemTitle1{
        width: 20%;
    }
    .GroupItemValue1{
        width: 80%;
    }
    .ItemInput{
        /*width: 1.75rem;*/
        width:100%;
        height: .22rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
    }
    .ItemSelect{
        /*width: 1.8rem;*/
        width:100%;
        height: .26rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
    }
    .ItemSelectBlack{
        width:80%;
        height: .26rem;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
    }
    .ItemBtn{
        width: 30%;
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
    .lan,.wan{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        font-size: .12rem;
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
    .GroupItemBtns{
        text-align: right;
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
    .mint-navbar .mint-tab-item{
        padding: .05rem 0;
    }
    .mint-navbar{
        margin-bottom: .1rem;
    }
    .mint-checklist-title{display: none;}
    .mint-checklist>>>.mint-cell-wrapper{padding-left: 0;}
    .mint-checklist>>>.mint-cell{min-height: .3rem;display:inline-block;}
    .mint-cell:last-child{background-image: none;}
    .mint-switch{
        margin-left: -.34rem;
    }
    .mint-checkbox-core{
      width:15px;
      height:15px;
    }
    .titleIcon{
        width: .2rem;
        height: .2rem;
        display: inline-block;
        color:#B7B7B7;
        vertical-align: text-top;
        margin-top: 2px;
    }
    .cellItem{overflow:hidden}
    .cellItem .cellName{float: left;text-align: left;}
    .cellItem .cellNameR{float: right;text-align: right;}
    .cellItem .cellAddr{color:#888;font-size:13px;}
    .cellItem .cellCard{color:#444}
    .slide-fade-enter-active {transition: all 1s ease;}
    .slide-fade-leave-active {transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-to{transform: translateY(5px);opacity: 0;}

    .addBtn{
        float: right;
        width: .3rem;
        text-align: center;
    }
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
      padding:2px 20px;
    }
    .deviceCardItem:last-child,.deviceItem:last-child{
      border-bottom: 0;
    }
    .deviceCardItem .cellItem,
    .deviceItem .cellItem{
      margin-top:3px;
    }
    .popupContainer{padding-bottom:15px;}
    .popupContainer .fGrp{overflow: hidden;padding: .1rem;}
    .popupContainer .fGrp .tl{width: 25%;float: left;  text-align: right;padding-top:0.07rem;margin-right: 5%;}
    .popupContainer .fGrp .vl{width: 62%;float: left; text-align: right}
    .popupContainer .fGrp button{padding: .02rem .1rem;width: .8rem;outline: none;border-radius: 4px;box-shadow:none;margin-top: .02rem;margin-right: .05rem;}
    .modalBtn{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        margin-right: .05rem;
    }
    .popupContainer input,.popupContainer select{
      color:#000;
    }
    .popupContainer .modalBtn{
      border: 1px solid rgb(61, 129, 241);
    }
    /*.deviceConfItem{overflow: hidden;padding: .1rem;}
    .deviceConfItemTitle{width: 40%;float: left;  text-align: left;padding-top:0.07rem;}
    .deviceConfItemValue{width: 60%;float: left; text-align: right}
    .deviceConfItem button{padding: .02rem .1rem;}*/

</style>
<style>
    .me .mint-cell-wrapper{background-image: none;color: #EEEEEE;}
    .me .mint-cell:last-child{background-image: none;}
    .me .mint-cell-swipe{border-bottom:4px solid #212227;}
    .me .mint-cell-swipe:last-child{border-bottom: 0;}
    .me .mint-checkbox-label{font-size: .12rem;margin-left:0;}
    .me .mint-checklist-label{padding:0;}
    .me .mint-checkbox-core{width:15px;height:15px;}
    .GroupItemValue1 .mint-checklist-title{display:none;}
    .me .mint-cell-value{
      display: block;
      color: #EEEEEE;
      padding: .1rem 0;
      width:100%;
      font-size:.16rem;
    }
    .me .mint-cell-swipe-buttongroup{
      border-radius:4px;
      display:table;
    }
    .me .mint-cell-swipe-button{
      height:100%;
      display:table-cell;
      vertical-align:middle;
      color:#000;
    }
    .mint-cell-right .mint-cell-swipe-button:first-child{
      background-color:#bae7ff;
      border-top-left-radius:4px;
      border-bottom-left-radius:4px;
    }
    .mint-cell-right .mint-cell-swipe-buttongroup .mint-cell-swipe-button:nth-child(2){
      background-color:#91d5ff;
    }
    .mint-cell-right .mint-cell-swipe-button:last-child{
      background-color:#69c0ff;
      border-top-right-radius:4px;
      border-bottom-right-radius:4px;
    }
    .mint-popup{border-radius: 6px;background-color: #EEE;}
    .me .mint-popup{
      width: 90%;
      overflow-y: auto;
      border-radius: 4px;
      max-height:100%;
    }
    .me .popupContainer .mint-cell-title{width:40%;text-align: left;}
    .me .popupContainer .mint-cell-value{width:60%;text-align: right;padding:0;}
    .me .popupContainer .mint-cell{min-height:24px;}
    .onlineStyle{
      color:#00ff00;
    }
    .onBoardStyle{
      color:#ff0000;
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
    /*.mint-toast{
      z-index:2002;
    }*/
    .me .mint-navbar{background-color: #222;}
    .me .mint-cell{background-color: #35363a;}
    .me .mint-checklist .mint-cell-value{display: none;}
    .devRightsTable{
      width:100%; 
      padding:5px 10px;
    }
    .devRightsTable table{
      width:100%;
    }
    .devRightsTable table td,.devRightsTable table th{
      padding:5px;
    }
    #systemInfo .mint-cell-value{
      flex:1
    }
    #systemInfo .mint-cell-wrapper{
      font-size:.14rem !important;
    }
    .userPrefixPop.mint-popup{
      background-color: #212227;
      width: 100%;
      height: 100%;
    }
    .userPrefixPop.mint-popup>div{
      height:calc(100% - 30px);
      overflow:auto;
    }
    .chevronStyle{
      float:right;
      margin-right:10px;
    }
</style>