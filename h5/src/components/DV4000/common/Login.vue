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
        <input type="checkbox" style="vertical-align:bottom;" v-model="user.saveMe_1080">
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
      <LoginSetBtn></LoginSetBtn>    
    </div>
  </div>
</template>

<script>
  import LoginSetBtn from '../../common/LoginSetBtn';
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER,SET_NAV_STATUS,SET_ACTIVE_DEVICE_TYPE,SET_DOMAIN } from '../../../store/mutation-types';
  export default {
    name: "Login",
    data(){
      return {
        title : "HDXpress",
        //UHDXPRESS_BUILD : "http://www.uhdxpress.com",//4000一级域名
        //UHDXPRESS_BUILD : "http://127.0.0.1/new-trank",
        user:{
          login_name:'',
          password:'',
          loginStatus:false,
          saveMe_1080:false
        },
        wifiUrlsEditVisible:false,
        wifiUrl:"",
      }
    },
    computed: {
    ...mapState(['navHide','activedevicetype','domain'])
    },
    components: {
      LoginSetBtn
    },
    watch:{   //监听当前设备类型变化
      '$store.state.activedevicetype': {
        immediate: true,
        handler(val) {
          if(val){
            var that = this;
            switch(this.activedevicetype){
              case "DV1080":
                that.title = 'HDXpress';
                that.user.login_name = localStorage.getItem("USERNAME_1080");
                that.user.password = localStorage.getItem("PASSWORD_1080");
                break;
              case "DV4000":
                that.title = 'UHDXpress';
                that.user.login_name = localStorage.getItem("USERNAME_4000");
                that.user.password = localStorage.getItem("PASSWORD_4000");
                break;
              default:
                that.title = 'OTHER';
                break;
            }
          }
        }
      }
    },
    mounted(){
      this.SET_ACTIVE_DEVICE_TYPE("DV4000")
      this.SET_DOMAIN(this.UHDXPRESS_BUILD);
      this.$axios.defaults.baseURL = this.UHDXPRESS_BUILD;//默认1080的一级域名
      this.user.saveMe_4000 = localStorage.getItem("SAVEME_4000")?eval(localStorage.getItem("SAVEME_4000")):false;
      if(this.user.saveMe1080){
        this.user.login_name = localStorage.getItem("USERNAME_4000");
        this.user.password = localStorage.getItem("PASSWORD_4000");
      }
    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_NAV_STATUS,
        SET_ACTIVE_DEVICE_TYPE,
        SET_DOMAIN
      }),
      login(){
        var that = this;
        that.$axios.defaults.baseURL = that.domain;
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
            setTimeout(function(){
              that.$router.push("/dv4000status");
              that.SET_NAV_STATUS(false);
              that.SET_USER(res.res.data);
              localStorage.setItem("LOGIN",true);
              localStorage.setItem("USERNAME_4000",that.user.login_name);
              localStorage.setItem("PASSWORD_4000",that.user.password);
              localStorage.setItem("DEVICE",that.activedevicetype);
              localStorage.setItem("SAVEME_4000",that.user.saveMe_1080);
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
            localStorage.setItem("USERNAME_4000",that.user.login_name);
            localStorage.setItem("PASSWORD_4000",that.user.password);
            localStorage.setItem("DEVICE",that.activedevicetype);
            localStorage.setItem("SAVEM_4000",that.user.saveMe_1080);
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
      connectWifi(){
        this.$router.push("/wifi");
      },

      setWifiUrl(){
        this.$axios.defaults.baseURL = "http://" + this.wifiUrl;
        this.activedevicetype = "WIFI";
        this.wifiUrlsEditVisible = false;
        this.showConfig = false;
      },
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
/*    .loginGroup{
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
    */

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