<template>
  <div class="page">
    <div id="body">
      <h1 class="title">{{ title }}</h1>
      <div class="form-item">
        <input type="text" autocomplete="false" class="loginIpt" v-model="user.login_name" placeholder="登录账号">
      </div>
      <div class="form-item">
        <input type="password" autocomplete="false" class="loginIpt" v-model="user.password" placeholder="登录密码">
      </div>
      <div class="form-item" style="text-align: right;padding-right: .2rem;margin-bottom:0;">
        <input type="checkbox" style="vertical-align:bottom;" v-model="user.saveMe">
        <span style="margin-left:5px;vertical-align:top;margin-top:0.03rem;display:inline-block;">记住我</span>
      </div>
      <div class="form-item" style="overflow: hidden;">
        <mt-button class="loginBtn" size="large" @click.native="login">{{ $t( 'basic.login' ) }}</mt-button>
      </div>
      <div class="setBtn" @click="showConfig = !showConfig">
        <i class="fa fa-cog fa-2x" aria-hidden="true"></i>
      </div>
      <div class="loginGroup" v-show="showConfig">
        <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'DV4000' ? 'deviceLoginActive': '']" @click="GoDV4000Login('DV4000')">DV4000</mt-button>
        <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'DV1080' ? 'deviceLoginActive': '']" @click="ChoseDevice('DV1080')">DV1080</mt-button>
        <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'OTHER' ? 'deviceLoginActive': '']" @click="ChoseDevice('OTHER')">其他</mt-button>
        <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'WIFI' ? 'deviceLoginActive': '']" @click="connectWifi()">本机WiFi</mt-button>
      </div>
    </div>
    <mt-popup v-model="wifiUrlsEditVisible" popup-transition="popup-fade">
      <div class="pushEditModal">
        <div class="modalTitle">
          连接本机WiFi
          <i class="closeBtn fa fa-close" @click="wifiUrlsEditVisible = false"></i>
        </div>
        <div class="formContainer">
          <div class="formItem">
            <div class="formItemTitle">http://</div>
            <div class="formItemVal"><input type="text" v-model="wifiUrl"></div>
          </div>
          <div class="formItem" style="text-align: right;margin-bottom: 0;">
            <button class="modalBtn" @click="wifiUrlsEditVisible = false">取消</button>
            <button class="modalBtn" @click="setWifiUrl" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>


<script>
    import { mapState, mapMutations } from 'vuex';
    import { SET_USER,SET_NAV_STATUS,SET_ACTIVE_DEVICE_TYPE } from '../../../store/mutation-types';
    export default {
        name: "Login",
        data(){
            return {
                title : "UHDXpress",
                user:{
                    login_name:'',
                    password:'',
                    loginStatus:false,
                    saveMe:false
                },
                ActiveDeviceType:'DV4000',
                showConfig:false,
                wifiUrlsEditVisible:false,
                wifiUrl:""
            }
        },
        computed: {
            ...mapState(['navHide'])
        },
        mounted(){
            this.SET_ACTIVE_DEVICE_TYPE(this.ActiveDeviceType);
            this.$axios.defaults.baseURL = "http://47.104.164.249";
            this.user.saveMe = localStorage.getItem("SAVEME")?eval(localStorage.getItem("SAVEME")):false;
            if(this.user.saveMe){
                this.user.login_name = localStorage.getItem("USERNAME");
                this.user.password = localStorage.getItem("PASSWORD");
                this.ActiveDeviceType = localStorage.getItem("DEVICE");
            }
        },
        methods:{
            ...mapMutations({
                SET_USER,
                SET_NAV_STATUS,
                SET_ACTIVE_DEVICE_TYPE
            }),

            login(){
                var that = this;
                this.$toast({
                    message: "登录成功",
                    position: 'middle',
                    duration: 2000
                });
                setTimeout(function(){
                    that.$router.push("/dv4000status");
                    that.SET_NAV_STATUS(false);
                    that.SET_USER({id:"1"});
                    localStorage.setItem("LOGIN",true);
                    localStorage.setItem("USERNAME",that.user.login_name);
                    localStorage.setItem("PASSWORD",that.user.password);
                    localStorage.setItem("DEVICE",that.ActiveDeviceType);
                    localStorage.setItem("SAVEME",that.user.saveMe);
                    //每次重新登录echarts图都重新画
                    localStorage.removeItem("cardData");
                    localStorage.removeItem("chartKey");
                    localStorage.removeItem("curChart");
                    localStorage.removeItem("allChartData");
                },800)
            }
        }
    }
</script>

<style scoped>
    .page{
        height: 100%;
        overflow: hidden;
    }
    #body{
        height: 100%;
        box-sizing: border-box;
        /*background-color: #FFFFFF;*/
        /*color: #000000;*/
        background-color: #212227;
        color: #FFFFFF;
        padding-top: 1.8rem;
        padding-left: .3rem;
        padding-right: .3rem;
    }
    .title{
        font-size: .36rem;
        text-align: center;
        font-weight: 600;
        color: #FFFFFF;
        font-family: Arial;
        padding-bottom: .4rem;
    }
    .form-item{
        margin-bottom: 5px;
    }
    .loginIpt{
        /*background: #FFFFFF;*/
        /*border: .1em solid #DDDDDD;*/
        /*color: #333333;*/
        padding-left: 0;
        padding-right: 0;
        display: block;
        width: 100%;
        height: .34rem;
        line-height: .34rem;
        font-size: .15rem;
    }
    .loginBtn{
        background-color: #3d81f1;
        /*background-color: #484D57;*/
        color: #FFFFFF;
        box-shadow: none;
        margin-top: .1rem;
        /* margin-left: 1%; */
    }
    .registerBtn{
        float: left;
        color: #3d81f1;
        margin-top: .05rem;
        width:48%;
        font-weight: 600;
        text-align: left;
        font-size:.14rem;
    }
    .forgetPwd{
        float: left;
        color: #3d81f1;
        font-weight: 600;
        margin-top: .05rem;
        width:48%;
        text-align: right;
        font-size:.14rem;
    }
    .loginBottom{
        position: absolute;
        bottom: 10px;
        width: 100%;
        left: .1rem;
        font-size: .13rem;
        font-weight: 500;
    }
    .loginBottom span{
        display: block;
        line-height: .16rem;
    }
    .loginGroup{
        position: fixed;
        right: .55rem;
        bottom: .55rem;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }
    .deviceLogin{
        background-color: #484D57;
        color: #FFFFFF;
        box-shadow: none;
        font-size: .14rem;
        width: 1rem;
        height: .36rem;
        border-radius: 0;
    }
    .deviceLoginActive{
        background-color: #3d81f1;
    }
    .setBtn{
        position: fixed;
        z-index: 1;
        right: .2rem;
        bottom: .2rem;
        width: .5rem;
        height: .5rem;
        border-radius: 50%;
        color: #FFF;
        text-align: center;
        line-height: .64rem;
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
</style>