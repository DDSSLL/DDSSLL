<template>
  <div id="app">
    <!--<Ad v-show="false" @hideTabbarFn="hideTabbarFn"></Ad>-->
    <mt-tabbar v-model="activeTab" v-show="!navHide">
      <mt-tab-item id="status">
        <i class="tab tab-main" v-bind:class="{ 'tab-main-active': activeTab == 'status' }"></i>
        {{ $t('basic.status') }}
      </mt-tab-item>
      <mt-tab-item id="control">
        <i class="tab tab-control" v-bind:class="{ 'tab-control-active': activeTab == 'control' }"></i>
        {{ $t('basic.control') }}
      </mt-tab-item>
      <mt-tab-item id="live">
        <i class="tab tab-live" v-bind:class="{ 'tab-live-active': activeTab == 'live' }"></i>
        {{ $t('basic.live') }}
      </mt-tab-item>
      <mt-tab-item id="settings">
        <i class="tab tab-settings" v-bind:class="{ 'tab-settings-active': activeTab == 'settings' }"></i>
        {{ $t('basic.settings') }}
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
        isLoggedIn: false
    }
  },
  components: {
    Ad
  },
  mounted(){
      if(this.user.id){
          this.SET_NAV_STATUS(false);
      }else{
          this.SET_NAV_STATUS(true);
      }
  },
  computed: {
      ...mapState(['user','navHide'])
  },
  watch: {
      activeTab(val){
          if(this.user.id){
              switch (val){
                  case 'status': this.$router.push("/status");break;
                  case 'control': this.$router.push("/control");break;
                  case 'live': this.$router.push("/live");break;
                  case 'settings': this.$router.push("/settings");break;
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
  background-color: #FFFFFF;
}
.tab{
  display: block;
  margin: 0 auto;
  background-image: url('assets/img/icons.png');
  background-size: 3.08rem 4.64rem;
  background-repeat: no-repeat;
  width: .35rem;
  height: .35rem;
  transform: scale(.75);
}
.tab-main{
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
}
.tab-main-active{
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
}
.mint-tab-item{
  padding: 4px 0;
}
.mint-tabbar>.mint-tab-item.is-selected {
  background-color: #eaeaea;
  color: #106fb1;
}
</style>
