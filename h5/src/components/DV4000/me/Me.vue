<template>
  <div class="me">
    <!-- 背包 -->
    <DevMan></DevMan>
    
    <!-- 接收机 -->
    <RcvMan></RcvMan>
    
    <!-- 录机管理 -->
    <RecordMan></RecordMan>

    <!-- 用户 -->
    <UserMan></UserMan>
    
    <!-- 用户等级 -->
    <UserLevelMan></UserLevelMan>
    
    <div class="Group" v-if="false">
      <div class="GroupTitle" @click="ChartConfShow=!ChartConfShow">
        图表配置
        <i class="titleIcon fa" :class="[ChartConfShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-show="ChartConfShow">
          <mt-navbar v-model="ChartConfTab">
            <mt-tab-item id="1">单位</mt-tab-item>
            <!-- <mt-tab-item id="2">概览图</mt-tab-item> -->
            <mt-tab-item id="3">网卡图</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="ChartConfTab">
            <mt-tab-container-item id="1">
              <div class="GroupItem">
                <div class="GroupItemField">
                  <div class="GroupItemTitle">自适应</div>
                  <div class="GroupItemValue">
                    <mt-switch v-model="ChartConf.unit.chartAutoVal"></mt-switch>
                  </div>
                </div>
              </div>
              <div class="GroupItem" v-show="!ChartConf.unit.chartAutoVal">
                <div class="GroupItemField">
                  <div class="GroupItemTitle">速率最大值</div>
                  <div class="GroupItemValue">
                    <input type="text" class="" v-model.number="ChartConf.unit.chartMax">
                  </div>
                </div>
              </div>
              <div class="GroupItem" v-show="!ChartConf.unit.chartAutoVal">
                <div class="GroupItemField">
                  <div class="GroupItemTitle">Mbps/每格</div>
                  <div class="GroupItemValue">
                    <input type="text" class="" v-model.number="ChartConf.unit.chartInterval">
                  </div>
                </div>
              </div>
              <div class="GroupItem">
                <div class="GroupItemBtns">
                  <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;" @click="setChartConfUnit">确定</button>
                  <button class="setBtn" style="background:#EEE;color:#000;" @click="getChartConfUnit">恢复当前值</button>
                </div>
              </div>
            </mt-tab-container-item>
            <!-- <mt-tab-container-item id="2">
              <div class="GroupItem">
                <div class="GroupItemField">
                  <div class="GroupItemTitle">上传速率</div>
                  <div class="GroupItemValue">
                    <select class="ItemSelect">
                      <option v-for="item in ChartConf.total.up" :value="item">{{item}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="GroupItem">
                <div class="GroupItemField">
                  <div class="GroupItemTitle">下载速率</div>
                  <div class="GroupItemValue">
                    <select class="ItemSelect">
                      <option v-for="item in ChartConf.total.down" :value="item">{{item}}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="GroupItem">
                <div class="GroupItemField">
                  <div class="GroupItemTitle">传输丢包</div>
                  <div class="GroupItemValue">
                    <select class="ItemSelect">
                      <option v-for="item in ChartConf.total.lossDev" :value="item">{{item}}</option>
                    </select>
                  </div>
                </div>
              </div>
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle">业务丢包</div>
                    <div class="GroupItemValue">
                      <select class="ItemSelect">
                        <option v-for="item in ChartConf.total.lossRcv" :value="item">{{item}}</option>
                      </select>
                  </div>
                </div>
              </div>
              <div class="GroupItem">
                <div class="GroupItemBtns">
                  <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;" @click="setChartConfTotal">确定</button>
                  <button class="setBtn" @click="getChartConfTotal">恢复当前值</button>
                </div>
              </div>
            </mt-tab-container-item> -->
            <mt-tab-container-item id="3">
              <div class="GroupItem GroupItem0">
                <div class="GroupItemField">
                  <div class="GroupItemTitle" style="width:28%;">颜色样式</div>
                  <div class="GroupItemValue" style="width:72%;">
                    <button :class="[cardLineStyle == 'old' ? 'btnSelect' : '']" class="lan" @click="setCardChartStyle('old')">样式一</button>
                    <button :class="[cardLineStyle == 'new' ? 'btnSelect' : '']" class="wan" @click="setCardChartStyle('new')">样式二</button>
                  </div>
                </div>
              </div>
              <template v-for="item in ChartConf.showCard">
                <div class="GroupItem GroupItem0">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle GroupItemTitle1">{{item.name}}</div>
                    <div class="GroupItemValue GroupItemValue1">
                      <mt-checklist v-model="item.value" :options="ChartConf.simCheckList">
                      </mt-checklist>
                    </div>
                  </div>
                </div>
              </template>
              <div class="GroupItem GroupItem0">
                <div class="GroupItemField">
                  <div class="GroupItemTitle GroupItemTitle1">批量选择</div>
                  <div class="GroupItemValue GroupItemValue1">
                    <mt-checklist v-model="ChartConf.selectBat" :options="ChartConf.simCheckList" @change="setLineContent">
                    </mt-checklist>
                  </div>
                </div>
              </div>
              <div class="GroupItem">
                <div class="GroupItemBtns">
                  <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;" @click="setChartConfCard">确定</button>
                  <button class="setBtn" style="background:#EEE;color:#000;" @click="getChartConfCard">恢复当前值</button>
                </div>
              </div>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </transition>
    </div>
    <div class="Group">
      <div class="GroupTitle" @click="SystemShow=!SystemShow">
        系统
        <i class="titleIcon fa" :class="[SystemShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-show="SystemShow">
          <mt-button size="large" class="logout" @click="logout">登出</mt-button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import DevMan from './dev';
  import RcvMan from './rcv';
  import RecordMan from './record';
  import UserMan from './user';
  import UserLevelMan from './userLevel';
  
  
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER, SET_NAV_STATUS, SET_ACTIVE_DEVICE, SET_TIMER_CLEAR, SET_CHART_STYLE } from '../../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "Me",
    data(){
      return{
        ChartConfTab:'1',
        //ChartConfTotalUp:[],
        ChartConf:{
          unit:{chartAutoVal:true,chartAuto:"1",chartInterval:"",chartMax:""},
          total:{up: "", down: "", lossDev:"", lossRcv:""},
          card:{
            dev_sn: "8000102140",
            eth0: "up,down,lossDev",
            eth0Val:["up","down","lossDev"],
            wifi: "up,down,lossDev",
            wifiVal:["up","down","lossDev"],
            sim1: "up,down,lossDev",
            sim1Val:["up","down","lossDev"],
            sim2: "up,down,lossDev",
            sim2Val:["up","down","lossDev"],
            sim3: "up,down,lossDev",
            sim3Val:["up","down","lossDev"],
            sim4: "up,down,lossDev",
            sim4Val:["up","down","lossDev"],
            sim5: "up,down,lossDev",
            sim5Val:["up","down","lossDev"],
            sim6: "up,down,lossDev",
            sim6Val:["up","down","lossDev"],
            "usb-5g1": "up,down,lossDev",
            "usb-5g1Val": ["up","down","lossDev"],
            "usb-5g2": "up,down,lossDev",
            "usb-5g2Val": ["up","down","lossDev"],
            "usb-lan": "up,down,lossDev",
            "usb-lanVal": ["up","down","lossDev"],
            "usb-lan2": "up,down,lossDev",
            "usb-lan2Val": ["up","down","lossDev"],
            id: "1"
          },
          showCard:[],
          simCheckList : [
            {label: '上传速率',value: 'up'},
            {label: '下载速率',value: 'down'},
            {label: '传输丢包',value: 'lossDev'}],
          selectBat:[]
        },
        ChartConfShow:false,
        DeviceShow:false,
        ReceiverShow:false,
        AccountShow:false,
        SystemShow:true,
      }
    },
    computed: {
      ...mapState(['user','navHide','DeviceTimer','ChartTimer','cardLineStyle','chartCardView'])
    },
    components: {
      DevMan,RcvMan,UserMan,RecordMan,UserLevelMan
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          this.getChartConfUnit();
          this.getChartConfTotal();
          //this.getChartConfCard();
          //this.initCardChartSelect();
          /*this.getReceiverList();
          this.getAccountList();*/
        }
      }
    },
    mounted(){
      console.log("dd me mounted")
      this.getChartConfTotal();
      this.initCardChartSelect();
      this.getChartConfCard();
    },
    activated(){  //生命周期-缓存页面激活
      console.log("dd me activated")
      /*this.getChartConfUnit();
      this.getChartConfTotal();
      //this.getChartConfCard();
      this.getReceiverList();
      this.getAccountList();*/
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      ...mapMutations({
          SET_USER,
          SET_NAV_STATUS,
          SET_ACTIVE_DEVICE,
          SET_TIMER_CLEAR,
          SET_CHART_STYLE
      }),
      getChartConfUnit(){
          var that = this;
          this.$axios({
              method: 'post',
              url:"/page/index/chartData.php",
              data:this.$qs.stringify({
                  getChartParam:true,
                  devSN: that.ActiveDevice?that.ActiveDevice.dev_sn:""
              }),
              Api:"getChartParam",
              AppId:"android",
              UserId:that.user.id
          })
          .then(function (response) {
              let res = response.data;
              if(res.res.success){
                  that.ChartConf.unit = formatUnit(res.data[0]);
              }else{
                  that.ChartConf.unit = {chartAutoVal:true};
              }
          })
          .catch(function (error) {
              console.log(error)
          })
          function formatUnit(item){
              if(item.chartAuto == "1"){
                  item.chartAutoVal = true;
              }else{
                  item.chartAutoVal = false;
              }
              return item;
          }
      },
      setChartConfUnit(){
          var that = this;
          this.$axios({
              method: 'post',
              url:"/page/index/chartData.php",
              data:this.$qs.stringify({
                  setChartParam:true,
                  devSN: that.ActiveDevice.dev_sn,
                  chartAuto: that.ChartConf.unit.chartAutoVal? "1": "0",
                  chartMax: that.ChartConf.unit.chartMax,
                  chartInterval: that.ChartConf.unit.chartInterval
              }),
              Api:"setChartParam",
              AppId:"android",
              UserId:that.user.id
          })
          .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.$toast({
                  message: "操作成功",
                  position: 'middle',
                  duration: 2000
                });
              }else{
                  that.getChartConfUnit();
              }
          })
          .catch(function (error) {
              console.log(error)
          })
      },
      getChartConfTotal(){
          var that = this;
          this.$axios({
              method: 'post',
              url:"/page/index/chartData.php",
              data:this.$qs.stringify({
                  getChartShowContent:true,
                  devSn: that.ActiveDevice?that.ActiveDevice.dev_sn:"",
                  prefix: that.ActiveDevice?that.ActiveDevice.prefix:""
              }),
              Api:"getChartShowContent",
              AppId:"android",
              UserId:that.user.id
          })
          .then(function (response) {
              let res = response.data;
              if(res.res.success){
                var data = res.data[0];
                for(var key in data){
                  data[key] = data[key].split(",");
                }
                that.ChartConf.total = data;
              }else{
                that.$toast({
                  message: res.res.reason,
                  position: 'middle',
                  duration: 5000
                });
              }
          })
          .catch(function (error) {
              console.log(error)
          })
      },
      setChartConfTotal(){
          var that = this;
          this.$axios({
              method: 'post',
              url:"/page/index/chartData.php",
              data:this.$qs.stringify({
                  setChartShowContent:true,
                  devSn: that.ActiveDevice.dev_sn,
                  up: that.ChartConf.total.up,
                  down: that.ChartConf.total.down,
                  lossDev: that.ChartConf.total.lossDev,
                  lossRcv: that.ChartConf.total.lossRcv
              }),
              Api:"setChartShowContent",
              AppId:"android",
              UserId:that.user.id
          })
          .then(function (response) {
              let res = response.data;
              if(res.res.success){
                  that.getChartConfTotal();
              }else{
                  that.getChartConfTotal();
              }
          })
          .catch(function (error) {
              console.log(error)
          })
      },

      setCardChartStyle(type){
        console.log("setCardChartStyle:"+type);
          //this.ChartConf.card.id = type;
        this.SET_CHART_STYLE(type);
      },
      getChartConfCard(){
        console.log("!!!!!!!!!!")
        var that = this;
        var showCard = that.ChartConf.showCard;
        for(var j=0; j<showCard.length; j++){
          if(showCard[j]["key"].indexOf("LTE") != -1 || showCard[j]["key"].indexOf("NR5G") != -1){
            that.ChartConf.showCard[j]["value"] = that.chartCardView[showCard[j]["name"].toLowerCase()].split(",");
          }else{
            that.ChartConf.showCard[j]["value"] = that.chartCardView[showCard[j]["name"].toLowerCase()].split(",");
          }
        }
        console.log(that.ChartConf.showCard)
          /*this.$axios({
              method: 'post',
              url:"/page/index/chartData.php",
              data:this.$qs.stringify({
                  getCardChartShowContent:true,
                  devSn: that.ActiveDevice.dev_sn
              }),
              Api:"getCardChartShowContent",
              AppId:"android",
              UserId:that.user.id
          })
          .then(function (response) {
              let res = response.data;
              console.log("!!!!!!!!!!!!!!!!!!!")
              console.log(res.data);
              if(res.res.success){
                //that.ChartConf.card = formatUnit(res.data[0]);
                var data = res.data[0];
                for(var key in data){
                  if(key == "dev_sn" || key=="id"){
                    continue;
                  }
                  that.chartCardView[key] = data[key];
                }
              }else{
                that.$toast({
                  message: res.res.reason,
                  position: 'middle',
                  duration: 5000
                });
              }
          })
          .catch(function (error) {
              console.log(error)
          })*/
          function formatUnit(item){
              item.eth0Val = item.eth0.split(",");
              item.sim1Val = item.sim1.split(",");
              item.sim2Val = item.sim2.split(",");
              item.sim3Val = item.sim3.split(",");
              item.sim4Val = item.sim4.split(",");
              item.sim5Val = item.sim5.split(",");
              item.sim6Val = item.sim6.split(",");
              item.wifiVal = item.wifi.split(",");
              item.usb_5g1Val = item.usb_5g1.split(",");
              item.usb_5g2Val = item.usb_5g2.split(",");
              item.usb_lanVal = item.usb_lan.split(",");
              item.usb_lan2Val = item.usb_lan2.split(",");
              return item;
          }
      },
      initCardChartSelect(devSN){
        var that = this;
        var cardData = localStorage.cardData ? JSON.parse(localStorage.cardData) : "";
        if(!cardData){
          return;
        }
        var upArr = Object.keys(cardData.seriesDataUp); //有上传数据的网卡
        var downArr = Object.keys(cardData.seriesDataDown); //有下载数据的网卡
        var showCard = this.$global.MergeArray(upArr, downArr); 
        var cardDiv = "";
        
        for(var i=0; i<showCard.length; i++){
          var obj = {};
          var newName = "";
          if(showCard[i].indexOf("lte") != -1){
            newName = "SIM"+showCard[i].substr(showCard[i].length - 1);
          }else{
            newName = showCard[i].toUpperCase();
          }
          obj.name = newName;
          obj.key = showCard[i].toUpperCase();  
          that.ChartConf.showCard.push(obj);
        }

        //获取数据库中保存的值
        //$("#cardSetting select").selectpicker('val',['up','down','lossDev']);
        /*for(var j=0; j<showCard.length; j++){
          if(showCard[j].indexOf("lte") != -1 || showCard[j].indexOf("NR5G") != -1){
            $("#card_"+showCard[j].toUpperCase()).selectpicker('val',chartCardView["sim"+showCard[j].substr(showCard[j].length-1)].split(","));
          }else{
            $("#card_"+showCard[j].toUpperCase()).selectpicker('val',chartCardView[showCard[j]].split(","));
          }
        }*/
      },

      setChartConfCard(){
          var that = this;
          var paramData = {
              "eth0":that.ChartConf.card.eth0Val.join(","),
              "wifi":that.ChartConf.card.eth0Val.join(","),
              "sim1":that.ChartConf.card.eth0Val.join(","),
              "sim2":that.ChartConf.card.eth0Val.join(","),
              "sim3":that.ChartConf.card.eth0Val.join(","),
              "sim4":that.ChartConf.card.eth0Val.join(","),
              "sim5":that.ChartConf.card.eth0Val.join(","),
              "sim6":that.ChartConf.card.eth0Val.join(","),
              "usb-5g1":that.ChartConf.card.eth0Val.join(","),
              "usb-5g2":that.ChartConf.card.eth0Val.join(","),
              "usb-lan":that.ChartConf.card.eth0Val.join(","),
              "usb-lan2":that.ChartConf.card.eth0Val.join(","),
              "id":that.ChartConf.card.id
          };
          this.$axios({
              method: 'post',
              url:"/page/index/chartData.php",
              data:this.$qs.stringify({
                  setCardChartShowContent:true,
                  devSn: that.ActiveDevice.dev_sn,
                  data: paramData
              }),
              Api:"setCardChartShowContent",
              AppId:"android",
              UserId:that.user.id
          })
          .then(function (response) {
              let res = response.data;
              if(res.res.success){
                  that.getChartConfCard();
              }else{
                  that.getChartConfCard();
              }
          })
          .catch(function (error) {
              console.log(error)
          })
      },
      setLineContent(e){
        console.log("setLineContent")
        console.log(e)
      },
      
      
      getAccountList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getUsers:true,
            userId: that.user.id
          }),
          Api:"getUsers",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.accountList = res.data;
            console.log("cccccccccccc")
            console.log(that.accountList)
          }else{
            that.receiverList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },

      addReceiver(){
        this.receiverConfigVisible = true;
        this.receiverConfigType = "add";
        this.clearRcvPopup();
      },
      addUser(){
        this.userConfigVisible = true;
        this.userConfigType = "add";
        this.clearUserPopup();
      },

      editReceiver(item){
        this.receiverConfigVisible = true;
        this.receiverConfigType = "edit";
        this.receiverConfigForm = {
            rcvName:item.rcv_name,
            rcvSn:item.rcv_sn
        }
      },
      editUser(item){
        this.userConfigVisible = true;
        this.userConfigType = "edit";
        this.userConfigForm = {
            id:item.id,
            name: item.name,
            pwd: item.pwd,
            pwd2: item.pwd,
            mobilePhone: item.mobilePhone,
            emailAddress: item.emailAddress,
            remark: item.remark
        }
      },
      getUserList(){
        console.log("getUserList")
        var that = this;
        if(this.user.id == SUPER){
          this.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:this.$qs.stringify({
              getPrefixs:true
            }),
            Api:"getPrefixs",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              console.log("dddddddddddd")
              console.log(res.data);
              var userList = res.data;
              that.deviceConfigUserOptions = userList;
            }else{
              that.deviceConfigUserOptions = [];
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        }else{
          var option = [{
            text: this.user.id,
            value: this.user.id
          }];
          that.deviceConfigUserOptions = option;
          console.log("eeeeeeeeeeeeeeeee")
          console.log(option[0].value);
          that.deviceConfigForm.devUser = option[0].value;
        }
      },

      editMatchRow(){
        console.log("保存绑定");
        //未修改
        var that = this;
        if (!this.editMatchChange) {
          return;
        }
        var text = '是否切换配对关系？';
        this.getDevPushStatus(this.deviceConfigForm.devSn, function(data) {
          if (data == 'norcv') {
            that.editMatch();
          } else {
            if (data == '1') {
              text = '是否需要先停止推流再切换配对关系？'
            }
            //询问
            that.$messagebox.confirm(text).then(
              action => {
                that.editMatch(index, layero);
            }).catch();
          }
        });
      },
      //切换
      editMatch() {
        console.log("editMatch")
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editMatchByDevSn:true,
            dev_sn:that.deviceConfigForm.devSn,
            devName:that.deviceConfigForm.devName,
            new_rcv_sn:that.deviceConfigForm.server,
            new_board_id:that.deviceConfigForm.devSn
          }),
          Api:"editMatchByDevSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getDeviceList();
          }else{
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获取背包的推流状态
      getDevPushStatus(devSn, callback) {
        console.log("getDevPushStatus")
        console.log(devSn);
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevPushStatus:devSn
          }),
          Api:"getDevPushStatus",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            callback(res.data);
          }else{
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      deleteMatchRow(){
        var that = this;
        var text = '是否解除配对关系？';
        this.getDevPushStatus(this.deviceConfigForm.devSn, function(data) {
          if (data == '1') {
            text = '是否需要先停止推流再解除配对关系？'
          }
          that.$messagebox.confirm(text).then(
            action => {
              that.$axios({
                method: 'post',
                url:"/page/index/indexData.php",
                data:that.$qs.stringify({
                  delMatch:true,
                  dev_sn:that.deviceConfigForm.devSn
                }),
                Api:"delMatch",
                AppId:"android",
                UserId:that.user.id
              })
              .then(function (response) {
                let res = response.data;
                if(res.res.success){
                  that.getDeviceList();
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
          }).catch(() => {
             console.log("cancel");
          });
        });
      },


      clearRcvPopup(){
        this.receiverConfigForm.rcvName = "";
        this.receiverConfigForm.rcvSn = "";
      },
      clearUserPopup(){
        this.userConfigForm.name = "";
        this.userConfigForm.pwd = "";
        this.userConfigForm.mobilePhone = "";
        this.userConfigForm.emailAddress = "";
        this.userConfigForm.remark = "";
      },

      submitReceiverConfig(){
        var that = this;
        var rcvSn = this.receiverConfigForm.rcvSn;
        var mode = this.$global.getRcvMode(rcvSn.substr(-4));
        var upgrade = 0;
        if (!mode) {
          that.$toast({
            message: "接收机型号不支持!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(that.receiverConfigType == "add"){
          for(var i=0; i<this.receiverList.length; i++){
            if (this.receiverList[i].rcv_sn == rcvSn) {
              that.$toast({
                message: "该接收机已添加!",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            /*saveRcv:true,*/
            rcvName: that.receiverConfigForm.rcvName,
            rcvSn: that.receiverConfigForm.rcvSn,
            rcvModel: mode,
            userId: that.user.id,
            prefix: that.user.id,
            rcvUser: '',
            type: that.receiverConfigType
          }),
          Api:"saveRcv",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getReceiverList();
            that.receiverConfigVisible = false;
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
      submitUserConfig(){
        var that = this;
        var name = this.userConfigForm.name;
        var mobilePhone = this.userConfigForm.mobilePhone;
        var emailAddress = this.userConfigForm.emailAddress;
        var remark = this.userConfigForm.remark;
        var pwd = this.userConfigForm.pwd;
        if (this.userConfigForm.pwd != this.userConfigForm.pwd2) {
          that.$toast({
            message: "密码不一致!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (this.userConfigType == "add") {
          for (var i = 0; i < this.accountList.length; i++) {
            if (this.accountList[i].id == name) {
              that.$toast({
                message: "该用户已添加!",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        if (!this.$global.isValidMail(emailAddress)) {
          that.$toast({
            message: "请输入合法邮箱!",
            position: 'middle',
            duration: 2000
          });
          return;
        }

        if (this.userConfigType == "add") {//只有001-admin可以添加
          this.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:this.$qs.stringify({
              addUser: name,
              pwd: pwd,
              group: 1,
              prefix: name,
              prefixName: name,
              addPrefix: 1,
              loginId: name,
              enable: 1,
              mobilePhone: mobilePhone,
              emailAddress: emailAddress,
              remark: remark
            }),
            Api:"addUser",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getUserList();
              that.userConfigVisible = false;
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
        } else {
          console.log(this.userConfigForm)
          var oldName = this.userConfigForm.id;
          this.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:this.$qs.stringify({
              addUser: name,
              oldUser: oldName,
              pwd: pwd,
              group: 1,
              prefix: name,
              loginId: oldName,
              enable: 1,
              mobilePhone: mobilePhone,
              emailAddress: emailAddress,
              remark: remark
            }),
            Api:"addUser",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getUserList();
              that.userConfigVisible = false;
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
        }
      },
      showDevAuthority(item){
        console.log("showDevAuthority")
        console.log(item)
        var that = this;
        this.devRightsList = [];
        this.devRightsVisible = true;
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getDevList: true,
            userId: item.name,
            userGroup: 1,
            prefix: item.name,
            logId: item.name,
            logGroup: 1
          }),
          Api:"getDevList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.devRightsList = res.data;
          }else{
            that.devRightsList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      
      deleteUser(item){
        var that = this;
        this.$messagebox.confirm("确定删除此用户?").then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/users/users.php",
              data:this.$qs.stringify({
                delUserIds:"'"+item.id+"'"
              }),
              Api:"delUser",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.$toast({
                  message: '操作成功'
                });
              }else{
                that.$toast({
                  message: '操作失败'
                });
              }
              that.getAccountList();
            })
            .catch(function (error) {
              console.log(error)
            })
        });
      },
      showDevice(item){
        console.log("showDevice")
        console.log(item);
        var that = this;
        this.devicePopupList = [];
        this.deviceVisible = true;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getboardByVirRcvSn:true,
            rcvSN: item.rcv_sn,
            user_Id:that.user.id
          }),
          Api:"getboardByVirRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.devicePopupList = res.data;
            console.log("that.devicePopupList")
            console.log(that.devicePopupList)
            console.log(that.ReceiverShow)
          }else{
            that.devicePopupList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      deleteReceiver(item){
        console.log("deleteReceiver");
        console.log(item);
        var that = this;
        var delBroad = false;
        if(item.online == "直播"){
          delBroad = true;
          that.$toast({
            message: "当前设备正在直播!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var rcvSn = item.rcv_sn;
        var text = '确认删除选中设备?';
        this.$messagebox.confirm(text).then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                /*saveRcv:true,*/
                delRcvSns: rcvSn,
                userId: that.user.id
              }),
              Api:"delRcv",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.getReceiverList();
                that.receiverConfigVisible = false;
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
        }).catch(()=>{
          console.log("cancel");
        });
      },
      logout(){
        clearInterval(this.DeviceTimer);
        clearInterval(this.ChartTimer);
        this.SET_TIMER_CLEAR();
        var that = this;
        this.$toast({
          message: '操作成功'
        });
        setTimeout(function(){
          that.SET_USER(null);
          that.SET_NAV_STATUS(true);
          that.SET_ACTIVE_DEVICE(null);
          that.$router.replace("/login");
          localStorage.removeItem('LOGIN');
        }, 1000);
      }
    }
  }
</script>

<style scoped>
    .me{
        background-color: #212227;
        height: calc(100% - 54px);
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
    .me .mint-popup{width: 90%;max-height: 90%;overflow-y: auto;border-radius: 4px;}
    .me .popupContainer .mint-cell-title{width:40%;text-align: left;}
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
    .mint-toast{
      z-index:2002;
    }
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
</style>