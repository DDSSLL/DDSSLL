<template>
  <div class="chartConf">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="ChartConfShow=!ChartConfShow">
        图表配置
        <i class="titleIcon fa chevronStyle" :class="[ChartConfShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
      </div>
      <mt-popup v-model="ChartConfShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div v-if="ChartConfShow"  style="height:100%">
          <div class="popTitle">
            <div class="back">
              <div  @click="ChartConfShow=false" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">图表配置</span>
              </div>
            </div>
          </div>
          <div class="Group">
            <transition name="slide-fade">
              <div class="GroupItem" v-show="ChartConfShow">
                <mt-navbar v-model="ChartConfTab">
                  <mt-tab-item id="1">单位</mt-tab-item>
                  <mt-tab-item id="2">概览图</mt-tab-item>
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
                        <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;position: static;line-height:0px" @click="setChartConfUnit">确定</button>
                        <button class="setBtn" style="background:#EEE;color:#000;position: static;line-height:0px;width:auto;" @click="getChartConfUnit">恢复当前值</button>
                      </div>
                    </div>
                  </mt-tab-container-item>
                  <mt-tab-container-item id="2">
                    <div class="GroupItem">
                      <div class="GroupItemField">
                        <div class="GroupItemTitle">发送速率</div>
                        <div class="GroupItemValue">
                          <mt-checklist v-model="totalSel.up" :options="totalSelOptionsUp">
                          </mt-checklist>
                        </div>
                      </div>
                    </div>
                    <div class="GroupItem">
                      <div class="GroupItemField">
                        <div class="GroupItemTitle">接收速率</div>
                        <div class="GroupItemValue">
                          <mt-checklist v-model="totalSel.down" :options="totalSelOptionsDown">
                          </mt-checklist>
                        </div>
                      </div>
                    </div>
                    <div class="GroupItem" v-if="avbrShowFlg">
                      <div class="GroupItemField">
                        <div class="GroupItemTitle">可变码率</div>
                        <div class="GroupItemValue">
                          <mt-checklist v-model="totalSel.avbr" :options="totalSelOptionsAVBR">
                          </mt-checklist>
                        </div>
                      </div>
                    </div>
                    <div class="GroupItem">
                      <div class="GroupItemField">
                        <div class="GroupItemTitle">传输丢包</div>
                        <div class="GroupItemValue">
                          <mt-checklist v-model="totalSel.trans" :options="totalSelOptionsTrans">
                          </mt-checklist>
                        </div>
                      </div>
                    </div>
                    <div class="GroupItem">
                      <div class="GroupItemField">
                        <div class="GroupItemTitle">业务丢包</div>
                        <div class="GroupItemValue">
                          <mt-checklist v-model="totalSel.buss" :options="totalSelOptionsBuss">
                          </mt-checklist>
                        </div>
                      </div>
                    </div>
                    <div class="GroupItem">
                      <div class="GroupItemField">
                        <div class="GroupItemTitle"></div>
                        <div class="GroupItemValue" style="width:100%">
                          <mt-button class="ItemBtn" style="margin-left:10px;" @click="chartClear">一键清空</mt-button>
                          <mt-button class="ItemBtn" style="margin-left:10px;" @click="chartSelectReset">恢复当前值</mt-button>
                          <mt-button class="ItemBtn" style="margin-left:10px;" @click="chartSelectDefaultReset">恢复默认值</mt-button>
                        </div>
                      </div>
                    </div>
                    
                    <div class="GroupItem">
                      <div class="GroupItemBtns">
                        <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;position: static;line-height:0px" @click="setChartConfTotal">确定</button>
                        <!-- <button class="setBtn" style="background:#EEE;color:#000;position: static;line-height:0px;width:auto;" @click="getChartConfTotal">恢复当前值</button> -->
                      </div>
                    </div>
                  </mt-tab-container-item>
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
                            <mt-checklist v-model="item.value" :options="ChartConf.simCheckList" @change="changeCardLineShow(item)">
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
                        <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;position: static;line-height:0px" @click="setChartConfCard">确定</button>
          		          <button class="setBtn" style="background:#EEE;color:#000;position: static;line-height:0px;width:auto;" @click="getChartConfCard">恢复当前值</button>
                      </div>
                    </div>
                  </mt-tab-container-item>
                </mt-tab-container>
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
    name: "chartConf",
    data(){
      return{
        ADMIN:ADMIN,
        ChartConfTab:'1',
        avbrShowFlg:false,
        avbrFlag:"",
        //ChartConfTotalUp:[],
        cardMatch : {
          "Total":["Total","Total"],
          "ETH0":["eth0","eth0"],
          "WIFI":["WIFI","WIFI"],
          "SIM1":["lte1","NR5G-NSA1"],
          "SIM2":["lte2","NR5G-NSA2"],
          "SIM3":["lte3","NR5G-NSA3"],
          "SIM4":["lte4","NR5G-NSA4"],
          "SIM5":["lte5","NR5G-NSA5"],
          "SIM6":["lte6","NR5G-NSA6"],
          "USB-5G1":["usb_5g1","usb-5g1"],
          "USB-5G2":["usb_5g2","usb-5g2"],
          "USB-LAN":["usb_lan","usb-lan"],
          "USB-LAN2":["usb_lan2","usb-lan2"]
        },
        chartLegendArr : ["Total"],
        /*checklist的选项*/
        totalSelOptionsUp:[],
        totalSelOptionsDown:[],
        totalSelOptionsAVBR:[],
        totalSelOptionsTrans:[],
        totalSelOptionsBuss:[],
        /*dev_line中保存的显示的line*/
        chartGeneralView : {
          "up":'Total',
          "down":'Total',
          "avbr":'Total',
          "trans":'Total',
          "buss":'Total'
        },
        totalSel:{
          up:"Total",
          down:"Total",
          avbr:"Total",
          trans:"Total",
          buss:"Total",
        },
        ChartConf:{
          unit:{
            chartAutoVal:true,
            chartAuto:"1",
            chartInterval:"",
            chartMax:"",
          },
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
            {label: '发送速率',value: 'up'},
            {label: '接收速率',value: 'down'},
            {label: '传输丢包',value: 'lossDev'}],
          selectBat:['up','down','lossDev'],
          selectBatBak:['up','down','lossDev']
        },
        ChartConfShow:false,
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
          //this.getChartConfUnit();
          //this.getChartConfTotal();
          //this.getChartConfCard();
          //this.initCardChartSelect();
        }
      }
    },
    mounted(){
      var that = this;
      this.$global.getDeviceParam(function(data){
        that.avbrFlag = data['bitrate_mode'] == 1 ? true : false;
        that.avbrShowFlg = that.avbrFlag;
      });
      this.getChartConfUnit();
      this.initChartSelect();
      this.getChartConfTotal();
      this.initCardChartSelect();
      this.getChartConfCard();
    },
    activated(){  //生命周期-缓存页面激活
      var that = this;
      this.$global.getDeviceParam(function(data){
        that.avbrFlag = data['bitrate_mode'] == 1 ? true : false;
        that.avbrShowFlg = that.avbrFlag;
      });
      this.getChartConfUnit();
      this.initChartSelect();
      this.getChartConfTotal();
      this.initCardChartSelect();
      this.getChartConfCard();
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      ...mapMutations({
          SET_USER,
          SET_NAV_STATUS,
          SET_ACTIVE_DEVICE,
          SET_TIMER_CLEAR,
          SET_CHART_STYLE,
          SET_DEVICE_TYPE_SELECT,
          SET_DEVICE_PREFIX_SELECT
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
        var max = that.ChartConf.unit.chartMax.toString();
        var interval = that.ChartConf.unit.chartInterval.toString();
        if(!that.ChartConf.unit.chartAutoVal){
          var reg = /^(([0-9])|([1-9]([0-9]+)))(.[0-9]{1,3})?$/;
          if (!reg.test(max) || max.replace(/(^\s*)|(\s*$)/g, "") == "") {
            that.$toast({
              message: "请输入合法数字，小数点后最多保留3位小数",
              position: 'middle',
              duration: 2000
            });
            return;
          }else if(max == 0){
            that.$toast({
              message: "速率最大值不能为0",
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if (!reg.test(interval) || interval.trim() == "") {
            that.$toast({
              message: "请输入合法数字，小数点后最多保留3位小数",
              position: 'middle',
              duration: 2000
            });
            return;
          }else if(interval == 0){
            that.$toast({
              message: "Mbps/每隔不能为0",
              position: 'middle',
              duration: 2000
            });
            return;
          }
        }
        if(interval*1 > max*1){
          that.$toast({
            message: "刻度数值不可大于速率最大值",
            position: 'middle',
            duration: 2000
          });
          return;
        }
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
      //概览图恢复当前配置
      chartSelectReset(){
        this.totalSel.up = this.chartGeneralView.up;
        this.totalSel.down = this.chartGeneralView.down;
        this.totalSel.avbr = this.chartGeneralView.avbr;
        this.totalSel.trans = this.chartGeneralView.trans;
        this.totalSel.buss = this.chartGeneralView.buss;
      },
      //概览图恢复默认配置
      chartSelectDefaultReset(){
        this.totalSel.up = "Total";
        this.totalSel.down = "Total";
        this.totalSel.avbr = "Total";
        this.totalSel.trans = "Total";
        this.totalSel.buss = "Total";
      },
      //概览图一键清空
      chartClear(){
        this.totalSel.up = "";
        this.totalSel.down = "";
        this.totalSel.avbr = "";
        this.totalSel.trans = "";
        this.totalSel.buss = "";
      },
      initChartSelect(){
        var that = this;
        var cardData = localStorage.cardData ? JSON.parse(localStorage.cardData) : "";
        var upArr = Object.keys(cardData.seriesDataUp); //有上传数据的网卡
        var downArr = Object.keys(cardData.seriesDataDown); //有下载数据的网卡
        var showCard = this.$global.MergeArray(upArr, downArr); 
        var optionBussDrop = "";
        for(var i=0; i<that.chartLegendArr.length; i++){
          if(that.chartLegendArr[i]=="Total" 
            || $.inArray(that.cardMatch[that.chartLegendArr[i]][0], showCard) != -1
            || $.inArray(that.cardMatch[that.chartLegendArr[i]][1], showCard) != -1){
            var option = that.chartLegendArr[i];
            that.totalSelOptionsUp = [];
            that.totalSelOptionsDown = [];
            that.totalSelOptionsAVBR = [];
            that.totalSelOptionsTrans = [];
            that.totalSelOptionsBuss = [];
            that.totalSelOptionsUp.push({label:option,value:option});
            that.totalSelOptionsDown.push({label:option,value:option});
            that.totalSelOptionsAVBR.push({label:option,value:option});
            that.totalSelOptionsTrans.push({label:option,value:option});
            that.totalSelOptionsBuss.push({label:option,value:option});
          }
        }
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
            var up = data["up"];//.split(",").map(function(x){return formatCardShow(x)});
            var down = data["down"];//.split(",").map(function(x){return formatCardShow(x)});
            var trans = data["lossDev"];//.split(",").map(function(x){return formatCardShow(x)});//传输丢包
            var buss = data["lossRcv"];//.split(",").map(function(x){return formatCardShow(x)});//业务丢包
            that.chartGeneralView.up = up;
            that.chartGeneralView.down = down;
            that.chartGeneralView.trans = trans;
            that.chartGeneralView.buss = buss;
            that.totalSel.up = up;
            that.totalSel.down = down;
            that.totalSel.trans = trans;
            that.totalSel.buss = buss;
            if(that.avbrFlag){
              var avbr = data["avbr"];//.split(",").map(function(x){return formatCardShow(x)});
              that.chartGeneralView.avbr = avbr;//可变码率  
              that.totalSel.avbr = avbr;
            }else{
              that.chartGeneralView.avbr = [];//可变码率  
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
            up: that.totalSel.up?"Total":"",
            down: that.totalSel.down?"Total":"",
            avbr: that.totalSel.avbr?"Total":"",
            lossDev: that.totalSel.trans?"Total":"",
            lossRcv: that.totalSel.buss?"Total":""
          }),
          Api:"setChartShowContent",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getChartConfTotal();
            that.$toast({
              message: '修改成功',
              position: 'middle',
              duration: 5000
            });
          }else{
            that.getChartConfTotal();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },

      setCardChartStyle(type){
        this.SET_CHART_STYLE(type);
      },
      getChartConfCard(){
        var that = this;
        var showCard = that.ChartConf.showCard;
        for(var j=0; j<showCard.length; j++){
          if(showCard[j]["key"].indexOf("LTE") != -1 || showCard[j]["key"].indexOf("NR5G") != -1){
            that.ChartConf.showCard[j]["value"] = that.chartCardView[showCard[j]["name"].toLowerCase()].split(",");
          }else{
            that.$set(that.ChartConf.showCard[j], 'value', that.chartCardView[showCard[j]["name"].toLowerCase()].split(","))
          }
        }
        that.initChartConfCard();
      },
      initChartConfCard(){
        var that = this;
        var chartCardView = that.chartCardView;
        for(var key in chartCardView){
          that.ChartConf.card[key] = chartCardView[key];
          that.ChartConf.card[key+"Val"] = chartCardView[key].split(",");
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
        that.ChartConf.showCard = [];
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
      },
      changeCardLineShow(e){
        var that = this;
        var order = ["up", "down", "lossDev"];
        var name = e["name"].toLowerCase();
        var value = e.value;
        var len = that.ChartConf.showCard.length;
        for(var i=0; i<len; i++){
          if(that.ChartConf.showCard[i]["name"] == e["name"]){
            that.ChartConf.showCard[i]["value"] = that.ChartConf.showCard[i]["value"].filter(function(item){
              return !!item;
            }).sort(function(a,b){
              return order.indexOf(a) - order.indexOf(b);
            });
          }
        }
        that.ChartConf.card[name+"Val"] = value.filter(function(item){
          return !!item;
        }).sort(function(a,b){
          return order.indexOf(a) - order.indexOf(b);
        });
        that.ChartConf.card[name] = value.filter(function(item){
          return !!item;
        }).sort(function(a,b){
          return order.indexOf(a) - order.indexOf(b);
        }).join(",");
      },
      setChartConfCard(){
        var that = this;
        for(var key in that.ChartConf.card){
          if(key.indexOf("Val") != -1){
            var card = key.substr(0, key.indexOf("Val")).toUpperCase();
            for(var i=0; i<that.ChartConf.showCard.length; i++){
              if(that.ChartConf.showCard[i]["name"] == card){
                that.ChartConf.card[key] = that.ChartConf.showCard[i]["value"];
              }
            }
          }
        }
        var paramData = {
          "eth0":that.ChartConf.card.eth0Val,
          "wifi":that.ChartConf.card.wifiVal,
          "sim1":that.ChartConf.card.sim1Val,
          "sim2":that.ChartConf.card.sim2Val,
          "sim3":that.ChartConf.card.sim3Val,
          "sim4":that.ChartConf.card.sim4Val,
          "sim5":that.ChartConf.card.sim5Val,
          "sim6":that.ChartConf.card.sim6Val,
          "usb-5g1":that.ChartConf.card["usb-5g1Val"],
          "usb-5g2":that.ChartConf.card["usb_5g2Val"],
          "usb-lan":that.ChartConf.card["usb_lan"],
          "usb-lan2":that.ChartConf.card["usb_lan2"],
        };
        that.$axios({
          method: 'post',
          url:"/page/index/chartData.php",
          data:that.$qs.stringify({
            setCardChartShowContent:true,
            devSn: that.ActiveDevice.dev_sn,
            data: JSON.stringify(paramData)
          }),
          Api:"setCardChartShowContent",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$toast({
              message: '操作成功'
            });
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
        var selectBat = this.ChartConf.selectBat;
        var selectBatBak = this.ChartConf.selectBatBak;
        var del = (selectBat.length > selectBatBak.length)?false:true;
        var addNew = "", delNew = "";
        if(del){//批量选择选项 增加了
          for(var i=0; i<selectBatBak.length; i++){
            if(selectBat.indexOf(selectBatBak[i]) == -1){  
              delNew = selectBatBak[i]
            }
          }
        }else{//批量选择选项 减少了
          for(var i=0; i<selectBat.length; i++){
            if(selectBat.indexOf(selectBatBak[i]) == -1){  
              addNew = selectBat[i]
            }
          }
        }
        this.ChartConf.selectBatBak = selectBat;
        var showCard = this.ChartConf.showCard;
        var order = ["up", "down", "lossDev"];
        for(var j=0; j<this.ChartConf.showCard.length; j++){
          if(addNew != ""){
            this.ChartConf.showCard[j]["value"].push(addNew);
            this.ChartConf.showCard[j]["value"] = this.ChartConf.showCard[j]["value"].sort(function(a,b){
              return order.indexOf(a) - order.indexOf(b); 
            })
          }else{
            if(this.ChartConf.showCard[j]["value"].indexOf(delNew) != -1){
              this.ChartConf.showCard[j]["value"].splice(this.ChartConf.showCard[j]["value"].indexOf(delNew),1);    
              this.ChartConf.showCard[j]["value"] = this.ChartConf.showCard[j]["value"].sort(function(a,b){
                return order.indexOf(a) - order.indexOf(b); 
              })
            }
          }
        }
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
</style>