<template>
  <div id="app">

    <el-container>
      <!-- <div > -->
      <el-header v-if="!loginShow">
        <el-row style="display: flex;align-items: center;">
          <el-col :span="4">
            <div class="grid-content bg-purple" style="text-align: left;">
              <!-- <span style="height: 60px;line-height: 60px;font-size: 36px;font-weight: bold;">DEVISER</span> -->
              <img alt="Vue logo" src="./assets/logo.png" style="height: auto;width: 150px;">
            </div>
          </el-col>
          <el-col :span="16">
            <div class="sysMenu grid-content bg-purple-light">
              <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#2C468D"
                text-color="#fff"
                active-text-color="#7BB5EA"
                :router="true">
                <!-- <el-menu-item index="/homePage">首页</el-menu-item> -->
                <el-menu-item index="/monitorPage">实时监测</el-menu-item>
                <el-menu-item index="/deviceMan">接收机管理</el-menu-item>
                <el-menu-item index="/taskMan">运行图管理</el-menu-item>
                <el-menu-item index="/userMan">用户管理</el-menu-item>
                <el-menu-item index="/logMan" v-if="user.level == 1">日志</el-menu-item>
                <el-menu-item index="/dataAnalyse">数据分析</el-menu-item>
                <el-menu-item index="/test">测试页面</el-menu-item>
              </el-menu><!-- 深色系："#01152E" -->
            </div>
          </el-col>
          <el-col :span="4" style="color: #fff;height: 60px;line-height: 60px;cursor: pointer;">
            <!-- <i class="fa fa-volume-up fa-lg" style="margin-left: 20px"></i> -->
            <span>V1.00.03</span>
            <i class="fa fa-user-o fa-lg" style="margin-left: 20px"></i><span style="margin-left:5px;">{{user.name}}</span>
            <i class="fa fa-sign-out fa-lg" style="margin-left: 20px" @click="siginOut"></i>
            
          </el-col>
        </el-row>
      </el-header>
      <!-- </div> -->
      <el-main>
        <div class="navContent">
          <router-view></router-view>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <i class="el-icon-edit"></i>
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import { SET_LOGIN_STATUS,SET_ACTIVE_TAB } from './store/mutation-types';
export default {
  name: 'App',
  data() {
    return {
      activeIndex: this.activeTab,//'/monitorPage',
    };
  },
  watch:{
    '$route.path':{
      handler(routePath){
        this.initMenuActive(routePath)
      },
      immediate:true
    }
  },
  components: {
    // HelloWorld
  },
  computed: {
  ...mapState(['user','loginShow','activeTab'])
  },
  mounted(){
    if(this.$route.fullPath == "/login"){
      this.SET_LOGIN_STATUS(true);
    }else{
      this.SET_LOGIN_STATUS(false);
    }
    console.log("activeIndex:"+this.activeIndex)
    console.log(this.$route.fullPath)
  },
  created(){
    if(this.$route.fullPath == "/login"){
      this.SET_LOGIN_STATUS(true);
    }else{
      this.SET_LOGIN_STATUS(false);
    }
  },
  methods: {
    ...mapMutations({
      SET_LOGIN_STATUS,SET_ACTIVE_TAB
    }),
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    initMenuActive(routePath){
      /*if(routePath == '/homePage'){
        this.activeIndex = '/homePage'
      }else*/ if(routePath == '/monitorPage'){
        this.activeIndex = '/monitorPage'
      }else if(routePath == '/deviceMan'){
        this.activeIndex = '/deviceMan'
      }else if(routePath == '/taskMan'){
        this.activeIndex = '/taskMan'
      }else if(routePath == '/userMan'){
        this.activeIndex = '/userMan'
      }else if(routePath == '/logMan'){
        this.activeIndex = '/LogMan'
      }else if(routePath == '/dataAnalyse'){
        this.activeIndex = '/DataAnalyse'
      }else{
        this.activeIndex = routePath;
      }
    },
    siginOut(){
      this.$router.push("/login");
      this.SET_LOGIN_STATUS(true);
      this.SET_ACTIVE_TAB('/login');
    },

  }

}
</script>

<style>
.navContent{
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  font-size: 14px;
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
.el-container{
  height: 100%;
}
.el-header{
  /*background: #101933;*/
  /*background: #121929;
  border-bottom: 1px solid #1a53ff;*/

  background: #01152E;
  border-bottom: 1px solid #A0A5B2;
}
.el-menu--horizontal>.el-menu-item{
  height: 59px;
}
.el-footer{
  position: absolute;
  bottom: 0px;
  height: 30px;
}
.el-menu.el-menu--horizontal{
  /*border-bottom: 1px solid #1a53ff;*/
  border-bottom: 1px solid #A0A5B2;
}
</style>
