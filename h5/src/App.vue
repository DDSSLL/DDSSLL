<template>
  <div id="app">
    <!--<Ad v-show="false" @hideTabbarFn="hideTabbarFn"></Ad>-->
    <mt-tabbar v-model="activeTab" v-show="!hideTabbar">
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

export default {
  name: 'App',
  data(){
    return{
        name: 'app',
        activeTab: 'main',
        hideTabbar: false
    }
  },
  components: {
    Ad
  },
  watch: {
      activeTab:function (val) {
          switch (val){
              case 'main': this.$router.push("/main");break;
              case 'settings': this.$router.push("/settings");break;
              default: return null;
          }
      }
  },
  methods:{
      hideTabbarFn:function (data) {
          this.hideTabbar = data;
      }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  font-size: .14rem;
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
