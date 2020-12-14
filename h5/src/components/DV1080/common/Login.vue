<template>
    <div class="page">
        <!--<mt-header fixed v-bind:title="title">-->
            <!--<mt-button slot="left" @click.native="back"> < </mt-button>-->
        <!--</mt-header>-->
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
            <div class="form-item">
                <span class="forgetPwd">忘记密码了?</span>
                <span style="float: left;width:4%;text-align: center;margin-top:0.05rem;">|</span>
                <span class="registerBtn">注册一个新账号</span>
            </div>
            <div class="setBtn"  @click="loginSetting" v-if="showConfigBtn"><!-- @click="showConfig = !showConfig" -->
                <i class="fa fa-cog fa-2x" aria-hidden="true"></i>
            </div>
            <div class="loginGroup" v-show="showConfig">
                <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'DV4000' ? 'deviceLoginActive': '']" @click="GoDV4000Login('DV4000')">DV4000</mt-button>
                <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'DV1080' ? 'deviceLoginActive': '']" @click="ChoseDevice('DV1080')">DV1080</mt-button>
                <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'OTHER' ? 'deviceLoginActive': '']" @click="ChoseDevice('OTHER')">其他</mt-button>
                <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'WIFI' ? 'deviceLoginActive': '']" @click="connectWifi()">本机WiFi</mt-button>
            </div>
            <!--<div class="loginBottom">-->
                <!--<div class="copyright">-->
                    <!--<span>版权所有：</span>-->
                    <!--<span>天津德力仪器设备有限公司 本网站所有下载资料仅供参考  </span>-->
                <!--</div>-->
                <!--<div class="address">-->
                    <!--<span>地址：</span>-->
                    <!--<span>天津市西青区高新技术产业园区 (外环) 海泰创新三路8号 </span>-->
                    <!--<span><a style="color: #5AB1A7;" href="https://beian.miit.gov.cn" target="_blank">津ICP备16000820号</a></span>-->
                <!--</div>-->
                <!--<div class="tel">-->
                    <!--<span>总机：022-27645003</span>-->
                    <!--<span>传真：022-27645002</span>-->
                    <!--<span>E-mail：market@deviser.com.cn</span>-->
                <!--</div>-->
            <!--</div>-->
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

        <mt-popup v-model="debugSetting" position="right" class="debugSetting">
          <h1 class="debugSettingTitle">请输入开发者密码</h1>
          <div class="form-item debugSettingInput">
            <input type="text" class="" v-model="debugSettingPwd">
          </div>
          <div class="form-item debugSettingBtn">
            <mt-button type="default" size="small" @click="backToLogin">返回</mt-button>
            <mt-button type="primary" size="small" style="margin-left:15px" @click="changeDebug">确定</mt-button>
          </div>
          <!-- <div class="GroupItemBtns">
            <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;" @click="setChartConfUnit">确定</button>
            <button class="setBtn" style="background:#EEE;color:#000;" @click="getChartConfUnit">恢复当前值</button>
          </div> -->
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
        title : "HDXpress",
        user:{
          login_name:'',
          password:'',
          loginStatus:false,
          saveMe:false
        },
        ActiveDeviceType:'DV1080',
        showConfigBtn:true,
        showConfig:false,
        wifiUrlsEditVisible:false,
        wifiUrl:"",
        DEBUGMODECOUNT : 5,//连续点击5次，没两次点击的间隔小于1s
        lastClick : null,
        clickTimes : 0,
        debugSetting:false,
        debugSettingPwd:"",
        DEBUGMODEPWD : "mode=debug",
        DOMAIN : "http://www.hdxpress.cn",//一级域名
        HDXPRESS_BUILD : "http://www.hdxpress.cn",//1080一级域名
        HDXPRESS_SERVE : "http://1080.hdxpress.cn:8088/",//1080二级域名
        UHDXPRESS_BUILD : "http://www.uhdxpress.com",//4000一级域名
        UHDXPRESS_SERVE : "http://www.uhdxpress.com",//4000二级域名
      }
    },
    computed: {
    ...mapState(['navHide'])
    },
    mounted(){
      console.log("mounted")
      
      // if(localStorage.getItem("LOGIN")){
      this.$axios.defaults.baseURL = this.HDXPRESS_BUILD;//默认1080一级域名
      console.log("this.$axios.defaults.baseURL:"+this.$axios.defaults.baseURL)
      //"http://1080.hdxpress.cn:8088/";//二级域名
      //"http://127.0.0.1/dv1080/";//
      this.user.saveMe = localStorage.getItem("SAVEME")?eval(localStorage.getItem("SAVEME")):false;
      if(this.user.saveMe){
        this.user.login_name = localStorage.getItem("USERNAME");
        this.user.password = localStorage.getItem("PASSWORD");
        this.ActiveDeviceType = localStorage.getItem("DEVICE");
        // this.login();
      }
      // }
    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_NAV_STATUS,
        SET_ACTIVE_DEVICE_TYPE
      }),
      loginSetting(){
        console.log("loginSetting")
        var that = this;
        if(!that.lastClick){
          that.lastClick = (new Date()).getTime();
          that.clickTimes++;
        }else{
          var newClick = (new Date()).getTime();
          if(newClick - that.lastClick > 1000){//两次点击间隔大于1s
            that.clickTimes = 0;
          }else{
            ++that.clickTimes;
          }
          that.lastClick = newClick;
          if(that.clickTimes == that.DEBUGMODECOUNT){//连续点击5次
            this.debugSetting = true;
            that.clickTimes = 0;
            that.lastClick = "";
          }
        }
      },
      changeDebug(){
        if(this.debugSettingPwd == this.DEBUGMODEPWD){//进入debug模式
          if(this.ActiveDeviceType == "DV1080"){
            this.DOMAIN = this.HDXPRESS_SERVE;    
          }else if(this.ActiveDeviceType == "DV4000"){
            this.DOMAIN = this.UHDXPRESS_SERVE;    
          }
          this.$axios.defaults.baseURL = this.DOMAIN;
          this.debugSetting = false;
        }else{
          this.$toast({
            message: "密码错误",
            position: 'middle',
            duration: 2000
          });
        }
      },
      backToLogin(){
        this.debugSetting = false;
      },
      back(){
        this.$router.go(-1)
      },
      login(){
        console.log("login")
        console.log(this.DOMAIN)
        console.log(this.$axios.defaults.baseURL);
        var that = this;
        this.$axios({
          method: 'post',
          url:"/login/login.php",
          data:{
            loginId: that.user.login_name,
            pwd: that.user.password,
            curTime: that.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          },
          Api:"SetLogin",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            /*that.$toast({
                message: "登录成功",
                position: 'middle',
                duration: 2000
            });*/
            setTimeout(function(){
              that.$router.push("/status");
              that.SET_NAV_STATUS(false);
              that.SET_USER(res.res.data);
              that.SET_ACTIVE_DEVICE_TYPE(that.ActiveDeviceType);
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
          }else{
            that.$toast({
              message: "登录失败",
              position: 'middle',
              duration: 3000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
          that.$toast({
            message: "登录失败",
            position: 'middle',
            duration: 3000
          })
        })

        /*生成随机数*/
        function generateMixed(n) {
          var chars = ["0","1","2","3","4","5","6","7","8","9",
            "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
            "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
          var res = "";
          for (var i = 0; i < n; i++) {
            var id = Math.ceil(Math.random() * 61);
            res += chars[id];
          }
          return res;
        }
      },
      register(){},

      ChoseDevice(val){
        this.ActiveDeviceType = val;
        this.SET_ACTIVE_DEVICE_TYPE(this.ActiveDeviceType);
        switch(this.ActiveDeviceType){
          case "DV1080":this.title = "HDXpress";
              //this.$axios.defaults.baseURL = "http://47.104.164.249";
              this.$axios.defaults.baseURL = this.DOMAIN;//"http://1080.hdxpress.cn:8088/";//"http://127.0.0.1";
              break;
          case "DV4000":this.title = "UHDXpress";this.$axios.defaults.baseURL = "http://117.131.178.104:8088";break;
          case "OTHER":this.title = "UHDXpress";this.$axios.defaults.baseURL = "http://47.104.164.249";break;
        }
        this.showConfig = false;
      },

      connectWifi(){
        //this.wifiUrlsEditVisible = true;
        this.$router.push("/wifi");
      },

      setWifiUrl(){
        this.$axios.defaults.baseURL = "http://" + this.wifiUrl;
        this.ActiveDeviceType = "WIFI";
        this.wifiUrlsEditVisible = false;
        this.showConfig = false;
      },

      GoDV4000Login(){
        this.$router.push("/dv4000login");
      }
    }
  }
</script>

<style scoped>
  .debugSetting{
    width:100%;
    height:100%; 
    background-color:#000 !important;
    font-size: .16rem;
  }
  .debugSettingTitle{
    padding-top:2rem;
    color: #fff;
    text-align: center;
  }
  .debugSettingInput{
    text-align: center;
    margin-top: 15px;
    font-size:0.16rem;
  }
  .debugSettingBtn{
    text-align: center;
    margin-top: 15px;
  }
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