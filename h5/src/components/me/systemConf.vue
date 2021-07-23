<template>
  <div class="systemConf">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="systemConfShow=!systemConfShow">
        系统设置
        <i class="titleIcon fa chevronStyle" :class="[systemConfShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
        <!--<i class="titleIcon addBtn fa fa-refresh" @click.stop="getAccountList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addUser" v-if="user.userGroup==ADMIN"></i>-->
      </div>
      <!-- <transition name="slide-fade"> -->
      <mt-popup v-model="systemConfShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div class="GroupItem" v-if="systemConfShow"  style="height:100%;background-color:#000">
          <div class="popTitle">
            <div class="back">
              <div  @click="systemConfShow=false" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">系统设置</span>
              </div>
            </div>
          </div>
          <div class="Group">
            <transition name="slide-fade">
              <div class="GroupItem" v-show="systemConfShow">
                <div class="GroupTitle">
                  版本号
                </div>
                <div class="GroupItemField">
                  <mt-cell title="APP版本" :value="app_ver"></mt-cell>
                  <mt-cell title="服务版本" :value="server_ver"></mt-cell>
                  <mt-cell title="数据库版本" :value="mysqlVer"></mt-cell>
                </div>
                <div class="GroupTitle">
                  备份服务器设置
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">服务器IP</div>
                    <div class="GroupItemValue">
                      <input type="text" class="inputStyle1" v-model="ftp_ip">
                    </div>
                  </div>
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">映射IP</div>
                    <div class="GroupItemValue">
                      <input type="text" class="inputStyle1" v-model="ftp_ipMapping">
                    </div>
                  </div>
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">服务器端口</div>
                    <div class="GroupItemValue">
                      <input type="text" class="inputStyle1" v-model="ftp_port">
                    </div>
                  </div>
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">UDP端口</div>
                    <div class="GroupItemValue">
                      <input type="text" class="inputStyle1" v-model="udp_port" style="width:60%">
                      <span style="color:#fff">(默认：21)</span>
                    </div>
                  </div>
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">用户名</div>
                    <div class="GroupItemValue">
                      <input type="text" class="inputStyle1" v-model="ftp_user">
                    </div>
                  </div>
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">密码</div>
                    <div class="GroupItemValue">
                      <input type="text" class="inputStyle1" v-model="ftp_pwd">
                    </div>
                  </div>
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">文件根目录</div>
                    <div class="GroupItemValue">
                      <input type="text" class="inputStyle1" v-model="ftp_path">
                    </div>
                  </div>
                </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle"></div>
                    <div class="GroupItemValue" style="float:right">
                      <mt-button class="ItemBtn" type="primary" @click="setFtpParam">保存</mt-button>
                      <mt-button class="ItemBtn" style="margin-left:10px;" @click="clearFtpParam">清空</mt-button>
                    </div>
                  </div>
                </div>
                 
              </div>
            </transition>
          </div>
        </div>
      </mt-popup>
      <!-- </transition> -->
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import $ from 'jquery';
  import { SET_USER, SET_NAV_STATUS, SET_ACTIVE_DEVICE, SET_TIMER_CLEAR, SET_CHART_STYLE, SET_DEVICE_TYPE_SELECT,SET_DEVICE_PREFIX_SELECT } from '../../store/mutation-types';
  export default {
    name: "systemConf",
    data(){
      return{
        systemConfShow:false,
        app_ver:"1.02.02",
        server_ver:"",
        mysqlVer:"",
        ftp_ip:"",
        ftp_ipMapping:"",
        ftp_port:"",
        ftp_user:"",
        ftp_pwd:"",
        ftp_path:"",
        udp_port:"",
      }
    },
    computed: {
      ...mapState(['user','navHide','ChartTimer','cardLineStyle','chartCardView','deviceTypeSelect','devicePrefixSelect'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          
        }
      }
    },
    mounted(){
      this.getServerVer();
      this.getSystemParam();
    },
    activated(){  //生命周期-缓存页面激活
      var that = this;
      this.getServerVer();
      this.getSystemParam();
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      ...mapMutations({
          
      }),
      //获取服务版本
      getServerVer() {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/sysInfo/sysInfo.php",
          data:this.$qs.stringify({
            getVersion: true,
          }),
          Api:"getVersion",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            that.server_ver = data[0]['server_ver'];
            that.mysqlVer = data[0]['mysqlVer'];
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            }); 
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获取ftp服务器
      getSystemParam() {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/sysInfo/sysInfo.php",
          data:this.$qs.stringify({
            getSystemParam: true,
          }),
          Api:"getSystemParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var arr = res.data[0]['ftpIp'].split('/');
            var ip = arr[0];
            var path = '';
            for (var i = 1; i < arr.length; i++) {
              path += '/' + arr[i];
            }
            var mappingIp = res.data[0]['ftpIpMapping'].split('/')[0];
            that["ftp_ip"] = ip;
            that["ftp_ipMapping"] = mappingIp;
            that["ftp_port"] = res.data[0]["ftpPort"];
            that["ftp_user"] = res.data[0]["ftpUser"];
            that["ftp_pwd"] = res.data[0]["ftpPwd"];
            that["ftp_path"] = path;
            that["udp_port"] = res.data[0]['udpPort'];
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            }); 
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      setFtpParam(){
        var that = this;
        var ip = this.ftp_ip;
        var ipMapping = this.ftp_ipMapping;
        var port = this.ftp_port;
        var udpPort = this.udp_port;
        var user = this.ftp_user;
        var pwd = this.ftp_pwd;
        var path = this.ftp_path;
        if (ip != '' && !this.$global.isValidIP(ip)) {
          that.$toast({
            message: '请输入合法IP!',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        if (ipMapping != '' && !this.$global.isValidIP(ipMapping)) {
          that.$toast({
            message: '请输入合法IP!',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        if (port != '' && !this.$global.isValidPort(port)) {
          that.$toast({
            message: '请输入合法端口号!',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        if (udpPort != '' && !this.$global.isValidPort(udpPort)) {
          that.$toast({
            message: '请输入合法端口号!',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        if (path.length > 32) {
          that.$toast({
            message: '长度<32',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        path = path.trim(); //去除左右两边空格
        var i = 0;
        for (i = 0; i < path.length; i++) {
          if (path[i] != '/') {
            break;
          }
        }
        path = path.substr(i); //去掉左侧多余‘/’

        this.$axios({
          method: 'post',
          url:"/page/sysInfo/sysInfo.php",
          data:this.$qs.stringify({
            setFtpParam : true,
            ip : ip + '/' + path,
            port : port,
            user : user,
            pwd : pwd,
            udpPort : udpPort,
            ipMapping : ipMapping + '/' + path,
          }),
          Api:"setFtpParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$toast({
              message: '保存成功',
              position: 'middle',
              duration: 2000
            }); 
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            }); 
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      clearFtpParam(){
        this.ftp_ip = "";
        this.ftp_ipMapping = "";
        this.ftp_port = "";
        this.udp_port = "";
        this.ftp_user = "";
        this.ftp_pwd = "";
      },
    }
  }
</script>

<style scoped>
    .me{
        background-color: #212227;
        height: calc(100% - 0.5rem);
        overflow:auto;
    }
    .Group{
        margin-top: 0px;
    }
    .GroupTitle{
        border-top: 1px solid #222;
        border-bottom: 1px solid #222;
        text-align: left;
        text-indent: .1rem;
        padding: .1rem .08rem;
        background: linear-gradient(270deg,#111 0,#333 50%);
        /*border-radius: 5px;*/
        font-size: .15rem;
        font-weight:500;
        color: #B7B7B7;
    }
    .logout{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .GroupItem{
        padding: .05rem .08rem;
    }
    .GroupItem0{
        padding: .05rem 0rem;
    }
    .GroupItemField{
        overflow: hidden;
        /*margin-bottom: .1rem;*/
    }
    .GroupItemTitle{
        width: 30%;
        float: left;
        line-height: .3rem;
        text-align: left;
        font-size: .14rem;
        color: #EEEEEE;
    }
    .GroupItemValue{
        width: 70%;
        float: left;
        text-align: left;
    }
    .GroupItemTitle1{
        width: 20%;
    }
    .GroupItemValue1{
        width: 80%;
    }
    .ItemInput{
        /*width: 1.75rem;*/
        width:100%;
        height: .22rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
    }
    .ItemSelect{
        /*width: 1.8rem;*/
        width:100%;
        height: .26rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
    }
    .ItemSelectBlack{
        width:80%;
        height: .26rem;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
    }
    .ItemBtn{
        width: 30%;
        height: .3rem;
        display: inline-block;
        background-color: #3d81f1;
        color: #FFFFFF;
        border: none;
        outline: none;
        border-radius: 5px;
        box-shadow: none;
        font-size: .12rem;
    }
    .lan,.wan{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        font-size: .12rem;
        background-color: #EEE;
        color: #000;
    }
    .lan{
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .wan{
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .btnSelect{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .GroupItemBtns{
        text-align: right;
    }
    .setBtn{
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        font-size: .12rem;
        border-radius: 5px;
        padding: 0 .1rem;
    }
    .mint-navbar .mint-tab-item{
        padding: .05rem 0;
    }
    .mint-navbar{
        margin-bottom: .1rem;
    }
    .mint-checklist-title{display: none;}
    .mint-checklist>>>.mint-cell-wrapper{padding-left: 0;}
    .mint-checklist>>>.mint-cell{min-height: .3rem;display:inline-block;}
    .mint-cell:last-child{background-image: none;}
    .mint-switch{
        margin-left: -.34rem;
    }
    .mint-checkbox-core{
      width:15px;
      height:15px;
    }
    .titleIcon{
        width: .2rem;
        height: .2rem;
        display: inline-block;
        color:#B7B7B7;
        vertical-align: text-top;
        margin-top: 2px;
    }
    .cellItem{overflow:hidden}
    .cellItem .cellName{float: left;text-align: left;}
    .cellItem .cellNameR{float: right;text-align: right;}
    .cellItem .cellAddr{color:#888;font-size:13px;}
    .cellItem .cellCard{color:#444}
    .slide-fade-enter-active {transition: all 1s ease;}
    .slide-fade-leave-active {transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-to{transform: translateY(5px);opacity: 0;}

    .addBtn{
        float: right;
        width: .3rem;
        text-align: center;
    }
    .popupTitle{
        padding: .1rem;
        font-size: .14rem;
    }
    .popupCloseBtn{
        float: right;
        width: .24rem;
        height: .24rem;
        color: #B00;
        font-size: .16rem;
        margin-top: -2px;
        text-align: right;
    }
    .deviceCardItem,.deviceItem,.devRightsItem{
      border-bottom: 2px solid #AAA;
      padding:2px 20px;
    }
    .deviceCardItem:last-child,.deviceItem:last-child{
      border-bottom: 0;
    }
    .deviceCardItem .cellItem,
    .deviceItem .cellItem{
      margin-top:3px;
    }
    .popupContainer{padding-bottom:15px;}
    .popupContainer .fGrp{overflow: hidden;padding: .1rem;}
    .popupContainer .fGrp .tl{width: 25%;float: left;  text-align: right;padding-top:0.07rem;margin-right: 5%;}
    .popupContainer .fGrp .vl{width: 62%;float: left; text-align: right}
    .popupContainer .fGrp button{padding: .02rem .1rem;width: .8rem;outline: none;border-radius: 4px;box-shadow:none;margin-top: .02rem;margin-right: .05rem;}
    .modalBtn{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        margin-right: .05rem;
    }
    .popupContainer input,.popupContainer select{
      color:#000;
    }
    .popupContainer .modalBtn{
      border: 1px solid rgb(61, 129, 241);
    }
    /*.deviceConfItem{overflow: hidden;padding: .1rem;}
    .deviceConfItemTitle{width: 40%;float: left;  text-align: left;padding-top:0.07rem;}
    .deviceConfItemValue{width: 60%;float: left; text-align: right}
    .deviceConfItem button{padding: .02rem .1rem;}*/

</style>
<style>
    .me .mint-cell-wrapper{background-image: none;color: #EEEEEE;}
    .me .mint-cell:last-child{background-image: none;}
    .me .mint-cell-swipe{border-bottom:4px solid #212227;}
    .me .mint-cell-swipe:last-child{border-bottom: 0;}
    .me .mint-checkbox-label{font-size: .12rem;margin-left:0;}
    .me .mint-checklist-label{padding:0;}
    .me .mint-checkbox-core{width:15px;height:15px;}
    .GroupItemValue1 .mint-checklist-title{display:none;}
    .me .mint-cell-value{
      display: block;
      color: #EEEEEE;
      padding: .1rem 0;
      width:100%;
      font-size:.16rem;
    }
    .me .mint-cell-swipe-buttongroup{
      border-radius:4px;
      display:table;
    }
    .me .mint-cell-swipe-button{
      height:100%;
      display:table-cell;
      vertical-align:middle;
      color:#000;
    }
    .mint-cell-right .mint-cell-swipe-button:first-child{
      background-color:#bae7ff;
      border-top-left-radius:4px;
      border-bottom-left-radius:4px;
    }
    .mint-cell-right .mint-cell-swipe-buttongroup .mint-cell-swipe-button:nth-child(2){
      background-color:#91d5ff;
    }
    .mint-cell-right .mint-cell-swipe-button:last-child{
      background-color:#69c0ff;
      border-top-right-radius:4px;
      border-bottom-right-radius:4px;
    }
    .mint-popup{border-radius: 6px;background-color: #EEE;}
    .me .mint-popup{
      width: 90%;
      overflow-y: auto;
      border-radius: 4px;
      max-height:100%;
    }
    .systemConf .mint-cell-title{
      width:50%;
      text-align: left;
      flex:auto;
      text-indent:.1rem;
    }
    .me .popupContainer .mint-cell-value{width:60%;text-align: right;padding:0;}
    .me .popupContainer .mint-cell{min-height:24px;}
    .onlineStyle{
      color:#00ff00;
    }
    .onBoardStyle{
      color:#ff0000;
    }
    #devList .mint-cell-value>.cellItem{
      display:flex;
    }
    #devList .mint-cell-value>.cellItem span:first-child{
      flex-shrink:0;
      flex-grow:1;  
    }
    #devList .mint-cell-value>.cellItem span:last-child{
      flex-shrink:1;
      text-align:right;
    }
    /*.mint-toast{
      z-index:2002;
    }*/
    .me .mint-navbar{background-color: #222;}
    .me .mint-cell{background-color: #35363a;}
    .me .mint-checklist .mint-cell-value{display: none;}
    .devRightsTable{
      width:100%; 
      padding:5px 10px;
    }
    .devRightsTable table{
      width:100%;
    }
    .devRightsTable table td,.devRightsTable table th{
      padding:5px;
    }
    #systemInfo .mint-cell-value{
      flex:1
    }
    #systemInfo .mint-cell-wrapper{
      font-size:.14rem !important;
    }
    .userPrefixPop.mint-popup{
      background-color: #212227;
      width: 100%;
      height: 100%;
    }
    .userPrefixPop.mint-popup>div{
      height:calc(100% - 30px);
      overflow:auto;
    }
    .systemConf .mint-cell-text{
      font-size: .15rem;
      font-weight: 500;
      text-indent: .1rem;
    }
    .systemConf .GroupItem{
      background-color:#35363a;
      text-indent:.1rem;
    }
    .systemConf .inputStyle1{
      width: 100%;
      margin-top: 0.06rem;
      text-indent: 0px;
      height: .2rem;
    }
</style>