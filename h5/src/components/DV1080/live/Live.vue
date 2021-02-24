<template>
  <div class="live">
    <Device page='rcv' @changeRcvLockState='changeRcvLockState'></Device>
    <div class="addressGroup">
      <template v-for="(item,i) in address">
        <div class="address" :key="i">
          <div class="title" :class="dev_push_enable?'width100':'widthPart'">
            <p :class="[item.push_url ? 'addressTitleLineH' : '']">{{ item.remark?item.remark : "推流地址"+(i+1) }}</p>
            <p :class="[item.push_url ? 'addressTitleLineH' : '', 
            item.push_status == 'running' ? 'pushStyle' : (item.push_status == '' ? 'defaultStyle' : 'errStyle')]" class="addressUrl" v-if="item.push_url">{{ item.push_url }}</p>
          </div>
          <div class="buttons" v-if="!dev_push_enable">
            <mt-switch v-model="item.nEnable=='1'?true:false" style="display: inline-block;vertical-align: middle;transform: scale(0.6);" @change="changeUrlEnable(item)"></mt-switch>  
            <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true" @click="showEditUrls(item)"></i>
            <i class="iconBtn fa fa-trash-o" aria-hidden="true" @click="delUrl(item)"></i>
          </div>
        </div>
      </template>
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
          <div class="formItem" style="text-align: right;margin-bottom: 0;">
            <button class="modalBtn" @click="hideEditUrls">取消</button>
            <button class="modalBtn" @click="saveEditUrls" style="background-color: #3d81f1;color:#fff;">确定</button>
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
        rcvParamLock: true,
        pushUrlsEditVisible:false,
        activePushObj:{},
        dev_push_enable:false,
        live:{
          rate:1,
          resolution:'1080p'
        },
        address:[]
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice','ActiveDeviceType','devPushEnable'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          //console.warn(val)
         /* if(val){
            var that = this;
            if(that.dev_push_enable){
              console.log("111")
              that.$global.getPushUrls(that, that.formatPushUrls);  
            }
            that.getPushParam();
          }*/
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          clearInterval(localStorage.getPushUrl1080);
          this.getPushUrl();
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      console.log("live activated")
      this.getPushUrl();
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getPushUrl1080);
    },
    /*mounted(){
    console.log("mounted")

    },*/
    components: {
      Device
    },
    methods:{

      /*//修改接收机锁定状态
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
      },*/
      getPushUrl(){
        console.log("getPushUrl")

        var that = this;
        console.log(that.ActiveDevice.rcv_sn)

        console.log(that.ActiveDevice.board_id)
        that.address = [];
        if(!that.ActiveDevice.rcv_sn && !that.ActiveDevice.board_id){
          return ;
        }
        that.$global.getPushUrls(that, that.formatPushUrls);
        that.getPushParam();
        localStorage.getPushUrl1080 = setInterval(function(){
          if(that.dev_push_enable){
            that.$global.getPushUrls(that, that.formatPushUrls);  
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
            nEnable: item.nEnable?1:0,

          }),
          Api:"UrlcheckEnable",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          console.log("changeUrlEnable")
          console.log(res)
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
        console.log("dl")
        console.log(item)
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
              that.getAccountList();
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
            that.$global.getPushUrls(that, that.formatPushUrls);
            that.pushUrlsEditVisible = false;
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
            that.$global.getPushUrls(that, that.formatPushUrls);
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
</style>