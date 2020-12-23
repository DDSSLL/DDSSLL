<template>
  <div class="LoginSetBtn">
    <div class="setBtn"  @click="loginSetting" v-if="showConfigBtn">
      <i class="fa fa-cog fa-2x" aria-hidden="true"></i>
    </div>
    <div class="loginGroup" v-show="showConfig">
      <mt-button class="deviceLogin" :class="[activedevicetype == 'DV4000' ? 'deviceLoginActive': '']" @click="GoDV4000Login('DV4000')">DV4000</mt-button>
      <mt-button class="deviceLogin" :class="[activedevicetype == 'DV1080' ? 'deviceLoginActive': '']" @click="GoDV1080Login('DV1080')">DV1080</mt-button>
      <mt-button class="deviceLogin" :class="[activedevicetype == 'OTHER' ? 'deviceLoginActive': '']" @click="ChoseDevice('OTHER')">其他</mt-button>
      <mt-button class="deviceLogin" :class="[activedevicetype == 'WIFI' ? 'deviceLoginActive': '']" @click="connectWifi()">本机WiFi</mt-button>
    </div> 
    <mt-popup v-model="debugSetting" position="right" class="debugSetting">
      <h1 class="debugSettingTitle">{{ this.title }}</h1>
      <h1 class="debugSettingTitle" style="padding-top:0.2rem">请输入开发者密码</h1>
      <div class="form-item debugSettingInput">
        <input type="text" class="" v-model="debugSettingPwd">
      </div>
      <div class="form-item debugSettingBtn">
        <mt-button type="default" size="small" @click="backToLogin">返回</mt-button>
        <mt-button type="primary" size="small" style="margin-left:15px" @click="changeDebug">确定</mt-button>
      </div>
    </mt-popup> 
    <!-- <mt-popup v-model="wifiUrlsEditVisible" popup-transition="popup-fade">
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
    </mt-popup> -->
  </div>	
</template>
<script>
	import { mapState, mapMutations } from 'vuex';
  import { SET_ACTIVE_DEVICE_TYPE, SET_DOMAIN } from '../../store/mutation-types';
	import $ from 'jquery';
	export default {
    name: "LoginSetBtn",
    data(){
      return{
        title:'HDXpress',
        singleClick : true,
        /*ActiveDeviceType:'DV1080',*/
        showConfigBtn:true,
        showConfig:false,
        DEBUGMODECOUNT : 5,//连续点击5次，没两次点击的间隔小于1s
        lastClick : null,
        clickTimes : 0,
        debugSetting:false,
        debugSettingPwd:"",
        DEBUGMODEPWD : "mode=debug",
        //DOMAIN : "http://www.hdxpress.cn",//一级域名
        HDXPRESS_BUILD : "http://www.hdxpress.cn",//1080一级域名
        HDXPRESS_SERVE : "http://1080.hdxpress.cn:8088/",//1080二级域名
        UHDXPRESS_BUILD : "http://4000.uhdxpress.com",//4000一级域名
        UHDXPRESS_SERVE : "http://192.168.100.110:8088/",//4000二级域名
        //UHDXPRESS_SERVE : "http://127.0.0.1/new-trank",//本地测试
      }
    },
    computed: {
      ...mapState(['DOMAIN','activedevicetype','domain'])
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
                break;
              case "DV4000":
                that.title = 'UHDXpress';
                break;
              default:
                that.title = 'OTHER';
                break;
            }
          }
        }
      }
    },
    created(){  //生命周期-页面创建后
      
    },
    mounted(){
      var that = this;
      console.log("activedevicetype:"+this.activedevicetype)
      console.log("domain:"+this.domain)
    },
    activated(){
      //this.deviceType = this.deviceTypeSelect;
    },
    methods:{
      ...mapMutations({SET_ACTIVE_DEVICE_TYPE,SET_DOMAIN}),
      
      /*loginSetting(){
        console.log("loginSetting")
        var that = this;
        if(!that.lastClick){//第一次点击
          console.log("第一次点击")
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
            console.log("连续点击5次");
            that.debugSetting = true;
            that.clickTimes = 0;
            that.lastClick = "";
          }
          that.singleClick = false;
        }
        setTimeout(function(){//点设置按钮后过一秒如果singleClick==true,则显示选型
          if(that.singleClick){
            console.log("切换设备")
            that.showConfig = !that.showConfig;
            that.singleClick = true;
            that.lastClick = "";
            that.clickTimes = 0;
          }
        },1000)
      },*/
      loginSetting(){
        console.log("loginSetting")
        var that = this;
        if(!that.lastClick){//第一次点击
          console.log("第一次点击")
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
            console.log("连续点击5次");
            that.debugSetting = true;
            that.clickTimes = 0;
            that.lastClick = "";
          }
          //that.singleClick = false;
        }
        that.showConfig = !that.showConfig;//发版本暂时隐藏
        /*setTimeout(function(){//点设置按钮后过一秒如果singleClick==true,则显示选型
          if(that.singleClick){
            console.log("切换设备")
            that.showConfig = !that.showConfig;
            that.singleClick = true;
            that.lastClick = "";
            that.clickTimes = 0;
          }
        },1000)*/
      },
      GoDV4000Login(val){
        this.$router.push("/dv4000login");
        this.SET_DOMAIN(this.UHDXPRESS_BUILD);
        this.$axios.defaults.baseURL = this.domain;
        this.SET_ACTIVE_DEVICE_TYPE(val);
      },
      GoDV1080Login(val){
        this.$router.push("/login");
        this.SET_DOMAIN(this.HDXPRESS_BUILD);
        this.$axios.defaults.baseURL = this.domain;
        this.SET_ACTIVE_DEVICE_TYPE(val);
      },
      
      ChoseDevice(val){
        this.SET_ACTIVE_DEVICE_TYPE(val);
        switch(val){
          case "DV1080":
            this.$router.push("/login");
            this.SET_DOMAIN(this.HDXPRESS_BUILD);
            this.$axios.defaults.baseURL = this.domain;
            this.SET_ACTIVE_DEVICE_TYPE(this.activedevicetype);
            console.log("切换1080")
            console.log("设备："+this.activedevicetype);
            break;
          case "OTHER":
            this.title = "OTHER";
            this.$axios.defaults.baseURL = "http://47.104.164.249";
            break;
        }
        this.showConfig = false;
      },
      changeDebug(){
        console.log("changeDebug")
        var that = this;
        if(this.debugSettingPwd == this.DEBUGMODEPWD){//进入debug模式
          if(that.activedevicetype == "DV1080"){
            console.log("1080")
            //this.DOMAIN = this.HDXPRESS_SERVE;  
            that.SET_DOMAIN(that.HDXPRESS_SERVE);  
            that.$axios.defaults.baseURL = that.HDXPRESS_SERVE;
          }else if(that.activedevicetype == "DV4000"){
            //this.DOMAIN = this.UHDXPRESS_SERVE;    
            that.SET_DOMAIN(that.UHDXPRESS_SERVE);  
            that.$axios.defaults.baseURL = that.UHDXPRESS_SERVE;
          }
          //that.$axios.defaults.baseURL = that.domain;
          that.debugSetting = false;
          that.showConfig = false;
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
        this.singleClick = true;
      },
      /*connectWifi(){
        //this.wifiUrlsEditVisible = true;
        this.$router.push("/wifi");
      },

      setWifiUrl(){
        this.$axios.defaults.baseURL = "http://" + this.wifiUrl;
        this.activedevicetype = "WIFI";
        this.wifiUrlsEditVisible = false;
        this.showConfig = false;
      },*/
    }
  }
</script>
<style>
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
</style>