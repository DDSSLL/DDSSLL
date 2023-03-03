<template>
  <div id="app">
    <!-- <Ad v-show="true" @hideTabbarFn="hideTabbarFn"></Ad> -->
    <!--DV1080-->
    <mt-tabbar v-model="activeTab" v-if="tabShow" v-show="!navHide">
      <mt-tab-item id="status">
        <i class="tab tab-main" v-bind:class="{ 'tab-main-active': activeTab == 'status' }"></i>
        {{ $t('basic.status') }}
      </mt-tab-item>
      <mt-tab-item id="control" v-show="devParamShowFlg">
        <i class="tab tab-control" v-bind:class="{ 'tab-control-active': activeTab == 'control' }"></i>
        {{ $t('basic.control') }}
      </mt-tab-item>
      <mt-tab-item id="settings" v-show="devParamShowFlg">
        <i class="tab tab-settings" v-bind:class="{ 'tab-settings-active': activeTab == 'settings' }"></i>
        {{ $t('basic.settings') }}
      </mt-tab-item>
      <mt-tab-item id="live" v-show="rcvTabShowFlg">
        <i class="tab tab-live" v-bind:class="{ 'tab-live-active': activeTab == 'live' }"></i>
        <span>{{ $t('basic.live4000') }}</span>
      </mt-tab-item>
      <mt-tab-item id="monitor" v-show="monitorFlg && devParamShowFlg">
        <i class="tab tab-monitor" v-bind:class="{ 'tab-monitor-active': activeTab == 'monitor' }"></i>
        <span>{{ $t('basic.monitor') }}</span>
      </mt-tab-item>
      <mt-tab-item id="me">
        <i class="tab tab-me" v-bind:class="{ 'tab-me-active': activeTab == 'me' }"></i>
        {{ $t('basic.me') }}
      </mt-tab-item>
    </mt-tabbar>
    <keep-alive v-if="isLoggedIn">
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive || !isLoggedIn"></router-view>
  </div>
</template>

<script>
  import Ad from '@/components/common/Ad'
  import { mapState, mapMutations } from 'vuex';
  import { SET_NAV_STATUS } from './store/mutation-types';
  
  export default {
    name: 'App',
    data(){
      return{
        name: 'app',
        activeTab: 'status',
        isLoggedIn: false,
        tabShow:false,
        curDevSeries:'1080',
        curRcvSeries:"",
        workMode:"",
        VIR_RCV:VIR_RCV,
        PRA_RCV:PRA_RCV,
        R1080_RCV:R1080_RCV,
      }
    },
    components: {Ad},
    computed: {
      ...mapState(['user','navHide','activedevicetype','ActiveDevice','rcvTabShowFlg','monitorFlg','devParamShowFlg'])
    },
    mounted(){
      this.SET_NAV_STATUS(true);
    },
    watch: {
      '$store.state.activedevicetype': {
        immediate: true,
        handler(val) {
          if(val){
            var that = this;
            that.tabShow = true;
          }
        }
      },
      '$store.state.navHide': {
        immediate: true,
        handler(val) {
          if(val){
            var that = this;
            this.activeTab = 'status';
          }
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          if(val){
            var that = this;
            this.curDevSeries = this.$global.getDevSeries(this.ActiveDevice.dev_sn);
            if(this.curDevSeries == "1080"){
              this.curDevSeries = '1080';
            }else{
              this.curDevSeries = '4000';
            }
          }
        }
      },
      activeTab(val){
        this.curRcvSeries = this.$global.getRcvSeries(this.ActiveDevice.rcv_sn);
        if(this.user.id){
          switch (val){
            //DV1080
            case 'status': this.$router.push("/status");break;
            case 'control': this.$router.push("/control");break;
            case 'live': 
              if(this.curRcvSeries == VIR_RCV){
                this.$router.push("/live1080");
              }else if(this.curRcvSeries==PRA_RCV || this.curRcvSeries==R1080_RCV){
                this.$router.push("/live4000");
              }
              break;
            case 'settings': this.$router.push("/settings");break;
            case 'monitor': this.$router.push("/monitor");break;
            case 'me': this.$router.push("/me");break;
            default: return null;
          }
        }
      },
      user(val){
        if(!Boolean(val.id)){
          this.activeTab = 'status';
        }
      },
      $route() {
        // if the route changes...
        let token = localStorage.getItem("LOGIN")||''
        if (token) {
          // firebase returns null if user logged out
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      }
    },
    methods:{
      ...mapMutations({
        SET_NAV_STATUS
      }),

      hideTabbarFn:function (data) {
        this.hideTabbar = data;
      }
    }
  }
</script>

<style>
html,body{
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #000000;
  font-size: .14rem;
  height: 100%;
  background-color: #000;
}
.tab{
  display: block;
  margin: 0 auto;
  /*background-image: url('assets/img/icons.png');*/
  /*background-size: 3.08rem 4.64rem;*/
  background-size:contain;
  background-repeat: no-repeat;
  width: .35rem;
  height: .35rem;
  transform: scale(.75);
}
/*.tab-main{
  background-position: -.26rem -.49rem;
}
.tab-control{
  background-position: -.84rem -.49rem;
}
.tab-live{
  background-position: -1.42rem -.49rem;
}
.tab-settings{
  background-position: -2.58rem -.49rem;
}
.tab-me{
  background-position: -2rem -.49rem;
}*/
.tab-main{
  background-image: url('assets/icon/chart_white_48.png');
}
.tab-control{
  background-image: url('assets/icon/control_white_48.png');
}
.tab-live{
  background-image: url('assets/icon/videocam_white_48.png');
}
.tab-monitor{
  background-image: url('assets/icon/monitor_white_48.png');
}
.tab-settings{
  background-image: url('assets/icon/settings_white_48.png');
}
.tab-me{
  background-image: url('assets/icon/me_white_48.png');
}
/*.tab-main-active{
  background-position: -.26rem -1.22rem;
}
.tab-control-active{
  background-position: -.84rem -1.22rem;
}
.tab-live-active{
  background-position: -1.42rem -1.22rem;
}
.tab-settings-active{
  background-position: -2.58rem -1.22rem;
}
.tab-me-active{
  background-position: -2rem -1.22rem;
}*/
.tab-main-active{
  background-image: url('assets/icon/chart_48.png');
}
.tab-control-active{
  background-image: url('assets/icon/control_48.png');
}
.tab-live-active{
  background-image: url('assets/icon/videocam_48.png');
}
.tab-settings-active{
  background-image: url('assets/icon/settings_48.png');
}
.tab-monitor-active{
  background-image: url('assets/icon/monitor_48.png');
}
.tab-me-active{
  background-image: url('assets/icon/me_48.png');
}
.mint-tabbar{
  z-index: 1;
  background-color: #353535;
  background-image: none;
}
.mint-tab-item{
  padding: 4px 0;
  color: #FFFFFF;
}
.mint-tabbar>.mint-tab-item.is-selected {
  background-color: #585e6d;
  color: #FFFFFF;
}

input,select{
  background:#2B2E33;
  border:1px solid #4B5056;
  color:#FFF;
  text-indent:10px;
}
::-webkit-input-placeholder {
  padding-left: 10px;
}
.mint-switch-core{border:1px solid #333;}
.mint-switch-core:before{
  background-color:#2B2E33;
}
.mint-toast{
  z-index:3000 !important;
}
.redText{
    color: #ff0000 !important;
}
</style>