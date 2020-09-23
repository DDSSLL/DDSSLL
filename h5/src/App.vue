<template>
  <div id="app">
    <!--<Ad v-show="false" @hideTabbarFn="hideTabbarFn"></Ad>-->
    <mt-tabbar v-model="activeTab" v-show="!navHide">
      <mt-tab-item id="main">
        <i class="tab tab-main" v-bind:class="{ 'tab-main-active': activeTab == 'main' }"></i>
        {{ $t('basic.main') }}
      </mt-tab-item>
      <mt-tab-item id="settings">
        <i class="tab tab-settings" v-bind:class="{ 'tab-settings-active': activeTab == 'settings' }"></i>
        {{ $t('basic.settings') }}
      </mt-tab-item>
    </mt-tabbar>
    <router-view/>
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
        activeTab: 'main'
    }
  },
  components: {
    Ad
  },
  mounted(){
      if(this.user.loginStatus){
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
          if(this.user.loginStatus){
              switch (val){
                  case 'main': this.$router.push("/main");break;
                  case 'settings': this.$router.push("/settings");break;
                  default: return null;
              }
          }
      },
      user(val){
          if(!Boolean(val.loginStatus)){
              this.activeTab = 'main';
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
}
.tab-main{
  background-position: -.26rem -.49rem;
}
.tab-settings{
  background-position: -.84rem -.49rem;
}
.tab-main-active{
  background-position: -.26rem -1.22rem;
}
.tab-settings-active{
  background-position: -.84rem -1.22rem;
}
</style>
