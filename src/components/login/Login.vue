<template>
  <div class="loginPage">
    <div class="loginBg">
      <div class="loginDiv">
        <span class="title">{{title}}</span>
        <el-form ref="form"  label-width="80px">
          <div class="noLableForm">
           <el-input v-model="user.login_name" autocomplete="false" placeholder="登录账号"></el-input>
          </div>
          <div class="noLableForm">
            <el-input type="password" v-model="user.password" autocomplete="off" placeholder="登录密码"></el-input>
          </div>
          <div class="noLableForm">
            <el-input type="text" v-model="user.checkCode" autocomplete="off" style="width: 50%;display: inline-block !important;" placeholder="输入验证码" @blur="changeCheckCode"></el-input>
            <img :src="vImg" id="checkImg" class="loginIpt" style="width: 30%;height:100%;display: inline-block;vertical-align: bottom;border: 4px solid #fff;margin-left:10px" @click="changeCheckImg">
            <i class="fa fa-check fa-lg" v-show="show.devCode_pass" style="color: #2fb62f"></i>
            <i class="fa fa-times fa-lg" v-show="show.devCode_fail" style="color: #ff2e2a"></i>
          </div>
          <div class="noLableForm" style="text-align: center;">
            <el-button type="primary" @click.native="login" class="loginBtn">登 录</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'MD5';
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER,SET_LOGIN_STATUS,SET_ACTIVE_TAB,SET_RANGE_FREQ, SET_RANGE_ATT, SET_RANGE_AMP, SET_RANGE_CHANNELTYPE, SET_RANGE_SAMPINTERVAL, SET_RANGE_SAMPRATE, SET_RANGE_FFT, SET_RANGE_ZOOM, SET_RANGE_CHANNELMODE} from '../../store/mutation-types';
  export default {
    name: "Login",
    data(){
      return {
        baseURL:"",
        title : "中短波监测系统",
        user:{
          login_name:'',
          password:'',
          checkCode:"",
          loginStatus:false,
        },
        show:{
          devCode_pass:false,
          devCode_fail:false,
        },
        /*SYS_BUILD:SYS_BUILD,
        SYS_SERVE:SYS_SERVE,*/
        
        sessionId:"",
        vImg:"",
      }
    },
    computed: {
    ...mapState([/*'navHide'*/])
    },
    /*components: {},*/
    watch:{   //监听当前设备类型变化
      /*'$store.state.activedevicetype': {
        immediate: true,
        handler(val) {
          if(val){
            var that = this;
            
          }
        }
      }*/
    },
    activated(){
      this.SET_LOGIN_STATUS(true);
    },
    created(){
      this.SET_LOGIN_STATUS(true);
      //初始化验证码
      this.sessionId = md5(Math.random());
      this.vImg = window.baseURL+"/protocol/ValidationCode.class.php?num="+this.sessionId;
    },
    mounted(){
      // var that = this;
      // this.$axios.defaults.baseURL = this.SYS_SERVE;//一级域名
      // this.user.login_name = "";
      // this.user.password = "";
      // this.vImg = this.$axios.defaults.baseURL+"/login/ValidationCode.class.php?num="+this.sessionId;
    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_LOGIN_STATUS,
        SET_ACTIVE_TAB,
        SET_RANGE_FREQ,
        SET_RANGE_ATT,
        SET_RANGE_AMP,
        SET_RANGE_CHANNELTYPE,
        SET_RANGE_SAMPINTERVAL,
        SET_RANGE_SAMPRATE,
        SET_RANGE_FFT,
        SET_RANGE_ZOOM,
        SET_RANGE_CHANNELMODE
      }),
      changeCheckCode(){
        var that = this;
        this.$axios({
          url:"/protocol/checkCode.php?num="+that.sessionId,
          data:{
            validateCode: that.user.checkCode
          },
          Api:"validateCode",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          var msg=res;    //设置标志用于表示验证码是否正确
          if(msg=='1'){
            //正确
            that.show.devCode_pass = true;
            that.show.devCode_fail = false;
          }
          else{
            that.show.devCode_pass = false;
            that.show.devCode_fail = true;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      changeCheckImg(){
        this.vImg = this.$axios.defaults.baseURL+"/protocol/ValidationCode.class.php?num="+this.sessionId+"&aa="+Math.random();
      },
      login(){
        /*this.$router.push("/monitorPage");
        this.SET_LOGIN_STATUS(false);
        this.SET_ACTIVE_TAB('/monitorPage');
        return;*/

        var that = this;
        if (this.user.login_name == '') {
          this.$message.error('请输入登录账号！');
          return;
        }
        if (this.user.password == '') {
          this.$message.error('请输入登录密码！');
          return;
        }
        //验证码
        if(this.user.checkCode === ''){
          this.$message.error('请输入验证码！');
          return;
        }
        //that.$axios.defaults.baseURL = that.domain;
        this.$axios({
          //method: 'post',
          url:"/protocol/login.php?num="+that.sessionId,//"/testJson/login.json",//
          data:{
            UserLogin: "1",
            LoginId:that.user.login_name,     //登录名
            LoginPwd:that.$common.encrypPwd(md5(that.user.password)), //登录密码，AES(md5(原始密码))
            ValidateCode:that.user.checkCode,      //验证码
          },
          Api:"UserLogin",
          AppId:"web",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          console.log("res")
          console.log(res)
          if(res.code == "0000"){
            //that.$router.push("/homePage");
            that.$router.push("/monitorPage");
            that.SET_USER({id:that.user.login_name, level:res.data.UserLevel,name:res.data.UserName});
            that.SET_LOGIN_STATUS(false);
            //that.SET_ACTIVE_TAB('/homePage');
            that.SET_ACTIVE_TAB('/monitorPage');
            that.GetParamValueRange();
            localStorage.loginTimer = setInterval(function(){
              that.CheckLogged(res.data,that.user.password)
            },1000)
          }else{
            that.$message.error(res.msg);
            that.changeCheckImg();
            that.user.checkCode = "";
            that.show.devCode_pass = false;
            that.show.devCode_fail = false;
          }
        })
        .catch(function (error) {
          console.log(error)
          that.$message.error("登录失败");
          
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
      CheckLogged(data, pwd){
        var that = this;
        that.$axios({
          method: 'post',
          url:"/protocol/login.php",//"testJson/UserIsLogged.json",//
          data:{
            IsLogged: that.user.login_name,          //登录名
            LoginPwd:that.$common.encrypPwd(md5(pwd)),          //登录密码，AES(md5(原始密码))
            LoginRand:data.LoginRand,         //登录随机数
          },
          Api:"UserIsLogged",
          AppId:"web",
          //UserId:data.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            
          }else{
            console.log("CheckLogged")
            clearInterval(localStorage.loginTimer)
            that.$router.push("/login");

          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      GetParamValueRange(){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",
          data:{ GetParamValueRange: "1", },
          Api:"GetParamValueRange",
          AppId:"web",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          console.log("res")
          console.log(res)
          var data = res.data[0];
          if(res.code == "0000"){
            that.SET_RANGE_FREQ({"min":data["Freq"]["min"],"max":data["Freq"]["max"]})
            that.SET_RANGE_ATT({"min":data["ATT"]["min"],"max":data["ATT"]["max"]})
            that.SET_RANGE_AMP(data["AMP"])
            that.SET_RANGE_CHANNELTYPE(data["ChannelType"])
            that.SET_RANGE_SAMPINTERVAL({"min":data["SampInterval"]["min"],"max":data["SampInterval"]["max"]})
            that.SET_RANGE_SAMPRATE(data["SampRate"])
            that.SET_RANGE_FFT(data["FFT"])
            that.SET_RANGE_ZOOM({"min":data["Zoom"]["min"],"max":data["Zoom"]["max"]})
            that.SET_RANGE_CHANNELMODE(data["ChannelMode"])
          }else{
          
          }
        })
        .catch(function (error) {
          console.log(error)
          that.$message.error("登录失败");
          
        })
      },
    }
  }
</script>

<style scoped>
    .loginPage{
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      /*background-image: url('../../assets/img/2.png');*/
    }
    .loginBg{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-70%);
      /*background-image: url('../../assets/img/loginBg.png');*/
      background-size:cover;
      padding-top: 20px;
      padding-bottom: 20px;
    }
    .loginDiv{
      /*background-color: red;*/
      width: 20%;
      min-width: 200px;
      margin-left: 50%;
      transform: translateX(-50%);
      /*position: absolute;
      top:50%;
      left: 50%;
      transform: translate(-50%, -70%);*/
    }
    .noLableForm{
      margin-top: 15px;
      margin-bottom: 15px;
      text-align: left;
    }
    .title{
      font-size: 30px;
      display: block;
      margin-bottom: 20px;
      font-weight: bold;
      letter-spacing: 10px;
      color:#2C468D;
    }
    .loginBtn{
      width: 100%;
      font-size: 18px;
    }
</style>