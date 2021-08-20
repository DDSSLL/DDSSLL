<template>
  <div class="page">
    <div id="body">
      <h1 class="title"><LoginSetBtn v-if="hidShow" v-bind:content="title"></LoginSetBtn></h1>
      <div v-if="show.loginPageShow">
        <div class="form-item">
          <input type="text" autocomplete="false" class="loginIpt" v-model="user.login_name" placeholder="登录账号">
        </div>
        <div class="form-item">
          <input type="password" autocomplete="false" class="loginIpt" v-model="user.password" placeholder="登录密码">
        </div>
        <div class="form-item" style="text-align: right;padding-right: .2rem;margin-bottom:0;">
          <input type="checkbox" style="vertical-align:bottom;" v-model="user.saveMe_1080">
          <span style="margin-left:5px;vertical-align:top;margin-top:0.03rem;display:inline-block;">记住我</span>
        </div>
        <div class="form-item" style="overflow: hidden;">
          <mt-button class="loginBtn" size="large" @click.native="login" v-if="loginBtnShow">{{ $t( 'basic.login' ) }}</mt-button>
          <mt-button class="loginBtn" size="large" @click="downloadAppNew" v-if="updateBtnShow">{{updateText}}</mt-button>
        </div>
        <div class="form-item">
          <!-- <span class="forgetPwd">忘记密码了?</span>
          <span style="float: left;width:4%;text-align: center;margin-top:0.05rem;">|</span> -->
          <span class="registerBtn" @click="registerNew">注册一个新账号</span>
        </div>
        <!-- <appVersion v-if="hidShow"></appVersion> -->
        
      </div>  
      <div v-if="show.registerPageShow">
        <div class="form-item">
          <input type="text" autocomplete="false" class="rigisterIpt" v-model="register.userName" placeholder="请输入用户名" @blur="judgeUserName">
          <i class="fa fa-check fa-lg pass tips" v-if="show.passName"></i>
          <i class="fa fa-exclamation-circle fa-lg fail tips" v-if="show.failName"></i>
        </div>
        <div class="form-item">
          <input type="password" autocomplete="false" class="rigisterIpt" v-model="register.pwd" placeholder="请输入密码" @blur="judgePwd">
          <i class="fa fa-check fa-lg pass tips" id="_pass" v-if="show.passPwd"></i>
          <i class="fa fa-exclamation-circle fa-lg fail tips" v-if="show.failPwd"></i>
        </div>
        <div class="form-item">
          <input type="password" autocomplete="false" class="rigisterIpt" v-model="register.pwd2" placeholder="请再次输入密码" @blur="judgePwd2">
          <i class="fa fa-check fa-lg pass tips" v-if="show.passPwd2"></i>
          <i class="fa fa-exclamation-circle fa-lg fail tips" v-if="show.failPwd2"></i>
        </div>
        <div class="form-item">
          <input type="text" autocomplete="false" class="rigisterIpt" v-model="register.devSn" placeholder="请输入背包序列号" @blur="judgeDevSn">
          <i class="fa fa-check fa-lg pass tips" v-if="show.passDevSn"></i>
          <i class="fa fa-exclamation-circle fa-lg fail tips" v-if="show.failDevSn"></i>
        </div>
        <div class="form-item">
          <input type="text" autocomplete="false" class="rigisterIpt" v-model="register.devCode" placeholder="请输入背包注册ID" @blur="judgeDevCode">
          <i class="fa fa-check fa-lg pass tips" v-if="show.passDevCode"></i>
          <i class="fa fa-exclamation-circle fa-lg fail tips" v-if="show.failDevCode"></i>
        </div>
        <div class="form-item" style="overflow: hidden;">
          <mt-button class="loginBtn" size="large" @click.native="clickRegisterBtn">注 册</mt-button>
        </div>
        <!-- 
          <button class="btn m-b" id="registerBtn" style="margin-top: 1em;">注 册</button>
        </div>-->
        <p class="text-muted text-center login_p registerBtn" style="font-size: 14px">
          <span style="color:#fff">已经有账户了？</span><a  @click="changeToLogin">点此登录</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import LoginSetBtn from './LoginSetBtn';
  /*import appVersion from '../common/appVersion';*/
  import md5 from 'md5';
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER,SET_NAV_STATUS,SET_ACTIVE_DEVICE,SET_ACTIVE_DEVICE_TYPE } from '../../store/mutation-types';
  export default {
    name: "Login",
    data(){
      return {
        DStreamer_BUILD:DStreamer_BUILD,
        //title : "HDXpress",
        appVersion:"",//"1.02.02",
        lastestVersion:"",
        loginBtnShow:true,
        updateBtnShow:false,
        updateText:"请下载最新软件",
        title : "DStreamer",
        user:{
          login_name:'',
          password:'',
          loginStatus:false,
          saveMe_1080:false
        },
        wifiUrlsEditVisible:false,
        wifiUrl:"",
        hidShow:true,
        /*HDXPRESS_BUILD:HDXPRESS_BUILD,*/
        DStreamer_BUILD:DStreamer_BUILD,
        DStreamer_SERVE:DStreamer_SERVE,
        show:{
          loginPageShow:true,
          registerPageShow:false,
          passName:false,
          failName:false,
          passPwd:false,
          failPwd:false,
          passPwd2:false,
          failPwd2:false,
          passDevSn:false,
          failDevSn:false,
          passDevCode:false,
          failDevCode:false,
        },
        register:{
          userName:"",
          pwd:"",
          pwd2:"",
          devSn:"",
          devCode:"",
        },
      }
    },
    computed: {
    ...mapState(['navHide','activedevicetype'])
    },
    components: {
      LoginSetBtn/*,appVersion*/
    },
    watch:{   //监听当前设备类型变化
      '$store.state.activedevicetype': {
        immediate: true,
        handler(val) {
          if(val){
            var that = this;
            switch(this.activedevicetype){
              case "DV1080":
                //that.title = 'HDXpress';
                if(that.user.saveMe_1080){
                  that.user.login_name = localStorage.getItem("USERNAME_1080");
                  that.user.password = localStorage.getItem("PASSWORD_1080");
		            }else{
		              that.user.login_name = "";
                  that.user.password = "";
            		}
                break;
              case "DV4000":
                //that.title = 'UHDXpress';
                that.user.login_name = localStorage.getItem("USERNAME_4000");
                that.user.password = localStorage.getItem("PASSWORD_4000");
                break;
              default:
                //that.title = 'OTHER';
                break;
            }
          }
        }
      }
    },
    created(){
    },
    mounted(){
      var that = this;
      this.SET_ACTIVE_DEVICE_TYPE("DV1080")
      this.$axios.defaults.baseURL = this.DStreamer_BUILD;//一级域名
      this.user.saveMe_1080 = localStorage.getItem("SAVEME_1080")=="true"?true:false;
      if(this.user.saveMe_1080){
        this.user.login_name = localStorage.getItem("USERNAME_1080");
        this.user.password = localStorage.getItem("PASSWORD_1080");
      }else{
        this.user.login_name = "";
        this.user.password = "";
      }
      //移动端输入法弹起页面被顶上来解决方法
      this.docmHeight = document.documentElement.clientHeight;//获取当前屏幕高度
      window.onresize = () => {//屏幕高度变化时判断
        return (() => {
          let showHeight = document.body.clientHeight;
          this.hidshow = this.docmHeight > showHeight ? false : true;
        })();
      };
      this.getLastestVersion(function(){
        document.addEventListener("deviceready", onDeviceReady1, false);
        function onDeviceReady1(){
          cordova.getAppVersion.getVersionNumber().then(function(version){
            that.appVersion = version;
            if(that.appVersion == that.lastestVersion){
              that.loginBtnShow = true;
              that.updateBtnShow = false;
            }else{
              that.loginBtnShow = false;
              that.updateBtnShow = true;
            }
          })
        }
      });
    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_NAV_STATUS,
        SET_ACTIVE_DEVICE,
        SET_ACTIVE_DEVICE_TYPE
      }),
      getLastestVersion(cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/login/login.php",
          data:{
            getLastestVersion: "true",
          },
          Api:"getLastestVersion",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.lastestVersion = res.res.data['app_ver'];
            if(typeof(cb) == 'function'){
              cb()
            }
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 3000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      downloadAppNew(){
        var that = this;
        this.updateText = "正在下载,请稍后...";
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 10*1024*1024,
            function (fs) {
              let url = that.DStreamer_BUILD+'/data/app/DStreamer.apk';
              fs.root.getFile('DStreamer.apk', { create: true, exclusive: false }, 
                function(fileEntry) {
                  download(fileEntry, url)
                },
                function(){
                  console.log("onErrorCreateFile")
                }
              )
            },
            function(){
              console.log("onErrorLoadFs")
            }
          )
        };
        function download(fileEntry, uri, readBinaryData) {
          var fileTransfer = new FileTransfer();
          var fileURL = fileEntry.toURL();
          /*fileTransfer.onprogress = function(progressEvent){
            if(progressEvent.lengthComputable){
              var downloadProgress = (progressEvent.loaded / progressEvent.total);
              if(Math.floor(downloadProgress) == 100){
                that.$toast({
                  message: '下载完成后会自动弹出安装',
                  position: 'middle',
                  duration: 3000
                })
              }else{
                that.$toast({
                  message: '已下载'+Math.floor(downloadProgress),
                  position: 'middle',
                  duration: 3000
                })
              }
            }
          }*/
          fileTransfer.download(
            uri, 
            fileURL,//window.cordova.file.externalRootDirectory + 'test.apk',//
            function (entry) {
              window.cordova.plugins.fileOpener2.open(entry.toURL(), 'application/vnd.android.package-archive', {
                error() {},
                success: function() {}
              })
            },
            function (error) {
              console.log("download error source " + error.source);
              console.log("download error target " + error.target);
              console.log("download error code" + error.code);
              console.log(error)
            },
            null, // or, pass false
            {
              //headers: {
              //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
              //}
            }
          );
        }
      },
      registerNew(){
        this.show.loginPageShow = false;
        this.show.registerPageShow = true;
        this.register.userName = "";
        this.register.pwd = "";
        this.register.pwd2 = "";
        this.register.devSn = "";
        this.register.devCode = "";
      },
      changeToLogin(){
        this.show.loginPageShow = true;
        this.show.registerPageShow = false;
      },
      //验证用户名
      judgeUserName(){
        var res = true;
        var string = this.register.userName;
        if(!this.nameCheckType3(string)){
          this.$toast({
            message: '长度1~15，仅支持字母,数字,+,_,@,()',
            position: 'middle',
            duration: 3000
          })
          res = false;
        }
        if(res){
          this.show.passName = true;
          this.show.failName = false;
        }
        else{
          this.show.passName = false;
          this.show.failName = true;
        }
        return res;
      },
      //名称校验 支持字母/数字/+/_/@/(/) /长度：15
      nameCheckType3(name) {
        var pattern = /^[A-Za-z0-9\@\+\_\(\)（）]{1,15}$/gi;
        if(name == SUPER){
            return true;
        }
        return pattern.test(name);
      },
      //验证密码
      judgePwd(){
        var res = true;
        var string = this.register.pwd;
        if(this.$global.pwdCheckType(string)){
          res = true;
        }
        else{
          this.$toast({
            message: '6-16位，至少包含一个数字一个字母',
            position: 'middle',
            duration: 3000
          })
          res = false;
        }
        if(res){
          this.show.passPwd = true;
          this.show.failPwd = false;
        }
        else{
          this.show.passPwd = false;
          this.show.failPwd = true;
        }
        return res;
      },
      //验证确认密码
      judgePwd2(){
        var res = true;
        var string = this.register.pwd;
        var string2 = this.register.pwd2;
        if(string != string2){
          this.$toast({
            message: '两次密码不一致',
            position: 'middle',
            duration: 3000
          })
          res = false;
        }
        if(res){
          this.show.passPwd2 = true;
          this.show.failPwd2 = false;
        }
        else{
          this.show.passPwd2 = false;
          this.show.failPwd2 = true;
        }
        return res;
      },
      //验证背包序列号
      judgeDevSn(){
        var res = true;
        var string = this.register.devSn;
        if(!this.$global.isValidSn(string)){
          this.$toast({
            message: '请输入10位背包序列号',
            position: 'middle',
            duration: 3000
          })
          res = false;
        }
        if(res){
          this.show.passDevSn = true;
          this.show.failDevSn = false;
        }else{
          this.show.passDevSn = false;
          this.show.failDevSn = true;
        }
        return res;
      },
      //验证背包激活码
      judgeDevCode(){
        var res = true;
        var string = this.register.devCode;
        if (string.length != 8) {
            res = false;
        }
        if (/^[0-9]+$/.test(string)) {
            res = true;
        } else {
            res = false;
        }
        if(res){
          this.show.passDevCode = true;
          this.show.failDevCode = false;
        }else{
          this.$toast({
            message: '请输入8位背包激活码',
            position: 'middle',
            duration: 3000
          });
          this.show.passDevCode = false;
          this.show.failDevCode = true;
        }
        return res;
      },
      //注册
      clickRegisterBtn(){
        var that = this;
        if(!this.judgeUserName() || !this.judgePwd() || !this.judgePwd2() || !this.judgeDevSn() || !this.judgeDevCode()) {
          return;
        }
        //传递用户名密码
        var name = this.register.userName;
        this.$axios({
          method: 'post',
          url:"/login/register.php",
          data:{
            register: "true",
            userId: name,
            name: name,
            pwd : md5(that.register.pwd),
            devSn : that.register.devSn,
            devCode : that.register.devCode,
          },
          Api:"register",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.show.loginPageShow = true;
            that.show.registerPageShow = false;
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 3000
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      login(){
        var that = this;
        //that.$axios.defaults.baseURL = that.domain;
        this.$axios({
          method: 'post',
          url:"/login/login.php",
          data:{
            loginId: that.user.login_name,
            pwd: md5(that.user.password),
            curTime: that.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
          },
          Api:"SetLogin",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            setTimeout(function(){
              that.$router.push("/status");
              that.SET_NAV_STATUS(false);
              var data = res.res.data;
              data.pwd = md5(data['pwd'])
              that.SET_USER(res.res.data);
              localStorage.setItem("LOGIN",true);
              localStorage.setItem("USERNAME_1080",that.user.login_name);
              localStorage.setItem("PASSWORD_1080",that.user.password);
              localStorage.setItem("DEVICE",that.activedevicetype);
              localStorage.setItem("SAVEME_1080",that.user.saveMe_1080);
              //每次重新登录echarts图都重新画
              localStorage.removeItem("cardData");
              localStorage.removeItem("chartKey");
              localStorage.removeItem("curChart");
              localStorage.removeItem("allChartData");

              localStorage.loginTimer = setInterval(function(){
                that.CheckLogged(res.res.data)
              },1000)
            },800)
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 3000
            })
            localStorage.setItem("USERNAME_1080",that.user.login_name);
            localStorage.setItem("PASSWORD_1080",that.user.password);
            localStorage.setItem("DEVICE",that.activedevicetype);
            localStorage.setItem("SAVEM_1080",that.user.saveMe_1080);
            that.$axios.defaults.baseURL = that.DStreamer_BUILD;
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
      //单用户登录校验
      CheckLogged(data){
        var that = this;
        that.$axios({
          method: 'post',
          url:"/login/login.php",
          data:{
            isLogged: data.id.toString(),
            loginRand: data.loginRand.toString(),
            pwd: data.pwd.toString(),
          },
          Api:"CheckLogged",
          AppId:"android",
          UserId:data.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            
          }else{
            that.SET_USER(null);
            that.SET_NAV_STATUS(true);
            that.SET_ACTIVE_DEVICE(null);
            that.$router.replace("/login");
            localStorage.removeItem('LOGIN');
            clearInterval(localStorage.loginTimer);
            localStorage.loginTimer = undefined;  
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      /*register(){},*/
      connectWifi(){
        this.$router.push("/wifi");
      },

      setWifiUrl(){
        this.$axios.defaults.baseURL = "http://" + this.wifiUrl;
        this.activedevicetype = "WIFI";
        this.wifiUrlsEditVisible = false;
        this.showConfig = false;
      },

      /*GoDV4000Login(){
        this.$router.push("/dv4000login");
      }*/
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
        padding-left: 0;
        padding-right: 0;
        display: block;
        width: 100%;
        height: .34rem;
        line-height: .34rem;
        font-size: .15rem;
    }
    .rigisterIpt{
      padding-left: 0;
      padding-right: 0;
      display: inline-block;
      width: 90%;
      height: .34rem;
      line-height: .34rem;
      font-size: .15rem;
    }
    .tips{
      margin-left:5px;
    }
    .pass{
      color:#00ff00;
    }
    .fail{
      color:#ff0000;
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
        /*float: left;*/
        color: #3d81f1;
        margin-top: .05rem;
        /*width:48%;*/
        font-weight: 600;
        text-align: left;
        font-size:.14rem;
        text-align: center;
        display: inline-block;
        width: 100%;
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