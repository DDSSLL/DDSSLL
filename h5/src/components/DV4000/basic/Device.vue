<template>
  <div class="Device">
    <div class="channels">
      <div class="activeDevice" @click="showDeviceList" v-if="!!ActiveDevice">
        <div class="status">
          <span class="statusCircle" :class="[this.ActiveDevice.match_used == 0 ? 'gray': this.ActiveDevice.dev_push_status!=0 ? 'sk-spinner sk-spinner-three-bounce': 'green']">
            <span class="sk-bounce1"></span>
          </span>
        </div>
        <div class="rate">
          <div v-if="this.ActiveDevice.match_used=='1' && this.ActiveDevice.dev_push_status!='0'">
            <span class="us">{{ (+this.ActiveDevice.dev_push_br / 1000).toFixed(3) }}</span>
            <span class="ds">{{ (+this.ActiveDevice.rcv_br / 1000).toFixed(3) }}</span>
            <span class="rl" v-if="this.ActiveDevice.TotalLossRate!=0" >{{ (+this.ActiveDevice.TotalLossRate / 10).toFixed(1) + '%' }}</span>  
          </div>
          <div v-else class="noSpeedInfo">--</div>
        </div>
        <div class="info nowrap" style="width:45%">
          <div style="width:100%">
            <span class="T">
              <span class="TCircle" :class="[this.ActiveDevice.online== 1 ? (this.ActiveDevice.dev_push_status!=0 ? 'red' : 'green') : 'gray']"></span>
              <span class="nowrapText">T: {{ this.ActiveDevice.dev_name }}</span>
            </span>
            <span class="R">
              <span class="RCircle" :class="[this.ActiveDevice.rcv_online == 1 ? (this.ActiveDevice.dev_push_status != '0' ? 'red' : 'green') : 'gray']"></span>
              <span class="nowrapText">R: {{ this.ActiveDevice.rcv_name }}</span>
            </span>
            <span class="B" v-if="!(this.ActiveDevice.rcv_sn.substr(-4) == '2999')">
              <span class="BCircle" :class="[!this.ActiveDevice.board_online||this.ActiveDevice.board_online=='0' ? 'gray': this.ActiveDevice.dev_push_status!='0'?'red':'green']"></span>
              B: {{ this.ActiveDevice.board_id }}
            </span>
          </div>
        </div>
        <div class="lock">
          <i class="fa fa-2x" id="lockIcon" aria-hidden="true" @click.stop="changeLockState"></i>
        </div>
      </div>
    </div>
    <div class="popup">
      <mt-popup
        v-model="popupVisible"
        position="right"
        popup-transition="popup-slide">
        <div class="channelList">
          <div class="deviceTypeSelect" style="text-align:right;">
            <div class="back" @click="popupVisible=false">
              <i class="fa fa-arrow-left" aria-hidden="true"></i>
            </div>
            <!-- <select v-model="deviceType" class="TypeSelect" :class="{'White':deviceTypeSelect == '1','Red':deviceTypeSelect == '2','Green':deviceTypeSelect == '3','Gray':deviceTypeSelect == '4'}" style="width:1.1rem" @change="filterDevice">
              <option value="1" class="White"><span>全部设备</span></option>
              <option value="2" class="Red"><span>推流设备</span></option>
              <option value="3" class="Green"><span>在线设备</span></option>
              <option value="4" class="Gray"><span>离线设备</span></option>
            </select> -->
            <!-- <select v-model="devicePrefix" class="TypeSelect White" @change="filterDevice" v-if="this.user.id==this.SUPER" multiple>
              <template v-for="item in allPrefix">
                <option :value="item.value"  class="White">{{ item.text }}</option>
              </template>
            </select> -->
            <button @click="deviceTypePop = true" class="TypeSelect White">{{this.deviceTypeCurName}}</button>
            <button @click="devicePrefixPop = true" class="TypeSelect White" v-if="user.id==SUPER">{{this.devicePrefixCurName}}</button>
          </div>
          <mt-loadmore :top-method="getDeviceList" ref="loadmore">
            <template v-for="(item,i) in deviceListShow">
              <div class="listChannel" @click="changeActiveDevice(item)" :class="[!!ActiveDevice?(ActiveDevice.dev_name == item.dev_name ? 'activeChanel' : ''):'']">
                <div class="status">
                  <span class="statusCircle" :class="[item.match_used == 0 ? 'gray': item.dev_push_status!=0 ? 'sk-spinner sk-spinner-three-bounce': 'green']">
                    <span class="sk-bounce1"></span>
                  </span>
                </div>
                <div class="rate">
                  <div v-if="item['match_used']=='1' && item['dev_push_status']!='0'">
                    <span class="us">{{ (+item['dev_push_br'] / 1000).toFixed(3) }}</span>
                    <span class="ds">{{ (+item['rcv_br'] / 1000).toFixed(3) }}</span>
                    <span class="rl" v-if="item['TotalLossRate']!=0" >{{ (+item['TotalLossRate'] / 10).toFixed(1) + '%' }}</span>  
                  </div>
                  <div v-else class="noSpeedInfo">--</div>
                </div>
                <div class="info nowrap">
                  <div style="width:100%">
                    <span class="T">
                      <span class="TCircle" :class="[item.online== 1 ? (item.dev_push_status!=0 ? 'red' : 'green') : 'gray']"></span>
                      <span class="nowrapText">T: {{ item.dev_name }}</span>
                    </span>
                    <span class="R">
                      <span class="RCircle" :class="[item.rcv_online == 1 ? (item.dev_push_status != '0' ? 'red' : 'green') : 'gray']"></span>
                      <span class="nowrapText">R: {{ item.rcv_name }}</span>
                    </span>
                    <span class="B" v-if="!(item.rcv_sn.substr(-4) == '2999')">
                      <span class="BCircle" :class="[!item.board_online||item.board_online=='0' ? 'gray': item.dev_push_status!='0'?'red':'green']"></span>
                      B: {{ item.board_id }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </mt-loadmore>
        </div>
      </mt-popup>

      <mt-popup v-model="deviceTypePop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop">
        <mt-radio
          v-model="deviceType"
          :options="deviceTypeOptions"
          @change="changeDeviceType">
        </mt-radio>
      </mt-popup>
      <mt-popup v-model="devicePrefixPop" position="bottom" popup-transition="popup-slide" class="deviceFilterPop">
        <mt-checklist
          v-model="devicePrefix"
          :options="this.allPrefix"
          @change="changeDevicePrefix">
        </mt-checklist>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_ACTIVE_DEVICE,SET_DEVICE_TIMER,SET_DEVICE_TYPE_SELECT,SET_DEVICE_PREFIX_SELECT,SET_PARAM_LOCK_ACK,SET_PARAM_LOCK } from '../../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "Device",
    data(){
      return{
        SUPER : SUPER,
        timer:null,
        popupVisible:false,
        deviceList:[{online:'',dev_sn:"",dev_name:"",dev_push_status:"",rcv_online:"",rcv_name:""}],
        active:{},
        //当前选中设备的相关参数
        deviceListShow:[],
        
        
        
        //用户组
        devicePrefixPop:false,
        allPrefix:[],
        devicePrefix:"",
        devicePrefixCurName:"用户组",
        //设备在线类型
        deviceTypePop: false,
        deviceType:"",
        deviceTypeCurName:"",
        deviceTypeOptions: [{label: '全部设备',value: '1'},
                            {label: '推流设备',value: '2'},
                            {label: '在线设备',value: '3'},
                            {label: '离线设备',value: '4'}],
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice','DeviceTimer','deviceTypeSelect','devicePrefixSelect','paramLockAck','paramLock'])
    },
    created(){  //生命周期-页面创建后
      console.log("device created:")
      var that = this;
      that.initFilter();
      //that.getDeviceList();
      
      clearInterval(this.DeviceTimer);
      this.timer = setInterval(function(){
        that.getDeviceList();
      },1000);//调试暂时注掉
      this.SET_DEVICE_TIMER(this.timer);
    },
    activated(){
      console.log("device activated")
      var that = this;
      that.initFilter();
    },
    methods:{
      ...mapMutations({
          SET_ACTIVE_DEVICE,
          SET_DEVICE_TIMER,
          SET_DEVICE_TYPE_SELECT,
          SET_DEVICE_PREFIX_SELECT,
          SET_PARAM_LOCK_ACK,
          SET_PARAM_LOCK
      }),
      changeDeviceType(){
        var that = this;
        that.SET_DEVICE_TYPE_SELECT(that.deviceType);
        that.formatDeviceTypeName();
      },
      changeDevicePrefix(){
        var that = this;
        var selectPrefix = that.devicePrefix;
        if(selectPrefix[selectPrefix.length-1] == "all"){//当前选中all
          that.devicePrefix = ["all"];  
        }else{
          if(selectPrefix.length > 1){
            if($.inArray("all",selectPrefix) != -1){
              selectPrefix.splice(selectPrefix.indexOf("all"),1); 
            }
          }
          that.devicePrefix = selectPrefix;  
        } 
        that.SET_DEVICE_PREFIX_SELECT(that.devicePrefix.join(","));
      },
      formatDeviceTypeName(){
        var that = this;
        that.deviceType = that.deviceTypeSelect;
        for(let i=0; i<that.deviceTypeOptions.length; i++){
          if(that.deviceTypeOptions[i].value == that.deviceType){
            that.deviceTypeCurName = that.deviceTypeOptions[i].label;
            break;
          }
        }
      },
      initFilter(){
        var that = this;
        /*that.deviceType = that.deviceTypeSelect;
        for(let i=0; i<that.deviceTypeOptions.length; i++){
          if(that.deviceTypeOptions[i].value == that.deviceType){
            that.deviceTypeCurName = that.deviceTypeOptions[i].label;
            break;
          }
        }*/
        that.formatDeviceTypeName();
        that.$global.getUserPrefixArr(that.formatPrefix)
        
      },
      formatPrefix(data){
        var that = this;
        var arr = [{"label":"全部","value":"all"},{"label":"无","value":"none"}];
        for(let i=0; i<data.length; i++){
          arr.push({"label":data[i]["prefix_name"],"value":data[i]["prefix"]})
        }
        that.allPrefix = arr;
        that.devicePrefix = that.devicePrefixSelect.split(",");
      },
      refreshCurDevParam(datas){
        this.SET_ACTIVE_DEVICE(datas);
        //更新当前设备参数
      },
      getDeviceList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevAndMatch:true,
            userId: that.user.id,
            userGroup: that.user.userGroup,
            prefixType: that.devicePrefix.join(",")//that.user.prefix
          }),
          Api:"getDevAndMatch",
          AppId:"android",
          UserId:that.user.login_name
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.deviceList = res.data;
            that.filterDevice();
            that.$refs.loadmore.onTopLoaded();
            if(!that.ActiveDevice){
              that.SET_ACTIVE_DEVICE(that.deviceList[0]);
            }
            for(var i=0; i<that.deviceList.length; i++){
              if(that.deviceList[i]["dev_sn"] == that.ActiveDevice["dev_sn"]){
                that.refreshCurDevParam(that.deviceList[i]);
              }
            }
            that.getDevLockStatus();
          }else{
            that.deviceList = [];
          }
        })
          .catch(function (error) {
              console.log(error)
          })
      },
      //获取背包锁状态
      getDevLockStatus(){
        var that = this;
        this.$axios({
            method: 'post',
            url:"/page/index/indexData.php",
            data:this.$qs.stringify({
              getDevParam:true,
              devSN: that.ActiveDevice.dev_sn
            }),
            Api:"getDevParam",
            AppId:"android",
            UserId:that.user.login_name
        })
        .then(function (response) {
            let res = response.data;
            that.SET_PARAM_LOCK_ACK(res.data[0]['param_lock_ack'])
            that.SET_PARAM_LOCK(res.data[0]['param_lock'])
            if(res.data[0]['param_lock_ack'] == "1"){
              $("#lockIcon").removeClass("fa-lock").addClass("fa-unlock");
            }else{
              $("#lockIcon").removeClass("fa-unlock").addClass("fa-lock");
            }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      //修改锁
      changeLockState(){
        var that = this;
        if (this.paramLockAck == "1") {
          //已解锁，要加锁,背包不锁定
          that.setDeviceParam('param_lock',2)
        } else {
          //已加锁，要解锁,背包锁定
          that.setDeviceParam('param_lock',1)
        }
      },
      setDeviceParam(key,val){
        var that = this;
        var devParamCol = key;
        var value = val;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
              devSN: that.ActiveDevice.dev_sn,
              devParamCol: devParamCol,
              value: value
          }),
          Api:"SetDevParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
              //that.getDeviceParam();
          }else{
              //that.getDeviceParam();
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      showDeviceList(){
          this.popupVisible = true;
          this.getDeviceList();
      },
      changeActiveDevice(item){
          this.SET_ACTIVE_DEVICE(item);
          this.refreshCurDevParam(item);
          this.popupVisible = false;
      },
      filterDevice(){
        var that = this;
        var deviceList = this.deviceList;
        //设备在线类型
        var deviceListShow = [];
        switch (that.deviceType.toString()){
          case "1":
            deviceListShow = that.deviceList;
            break;
          case "2":
            deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 1 && (item.dev_push_status == 1 || item.dev_push_status == 2))
            });
            break;
          case "3":
            deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 1)
            });
            break;
          case "4":
            deviceListShow = that.deviceList.filter(function(item){
              return (item.online == 0)
            });
            break;
          default:
            deviceListShow = that.deviceList;
            break;
        }
        that.deviceListShow = deviceListShow  
      }
    }
  }
</script>

<style scoped>
    .Device{
        position: fixed;
        top: 0;
        width: 100%;
        height: 60px;
        z-index: 9;
        background-color: #106fb1;
    }
    .popup{
        position: fixed;
        left: 0;
        top: 0;
    }
    /*当前频点*/
    .channels{
        margin-top: 0px;
    }
    .activeDevice{
        overflow: hidden;
        height: .5rem;
        background-color: #106fb1;
        padding: .05rem 0;
    }
    .listChannel{
        border-bottom: 1px solid #474B50;
        overflow: hidden;
        height: .5rem;
        background-color: #212227;
        padding: .05rem 0;
    }
    .activeChanel{
      background: linear-gradient(to top, #106fb1 0%,#000 30%);
    }
    .status,.rate,.info{
        float: left;
        height: 100%;
    }
    .status{
        width: 15%;
        line-height: .5rem;
        text-align: center;
    }
    .statusCircle{
        display: inline-block;
        width: .12rem;
        height: .12rem;
        border-radius: 50%;
    }
    .rate{
        box-sizing: border-box;
        width: 24%;
        /*padding-top: .08rem;*/
        padding-right:0.15rem;
        display:flex;
    }
    .rate div{
      margin:auto;
    }
    .noSpeedInfo{
      margin: auto 20%; 
      color:#eee
    }
    .us{
        display: block;
        color: #FFFF00;
        font-size: .15rem;
        text-align: left;
    }
    .ds{
        display: block;
        color: #22aadd;
        font-size: .15rem;
        text-align: left;
    }
    .rl{
        display: block;
        color: #f5222d;
        font-size: .15rem;
        text-align: left;
    }
    .info{
        width: 50%;
        color: #FFFFFF;
        font-size: .15rem;
        box-sizing: border-box;
        padding-top: .02rem;
        display:flex;
    }
    .info>div{
      margin:auto;
      margin-left:10px;
    }
    .T,.R,.B{
        display: block;
    }
    .B{
        margin-left: .08rem;
    }
    .TCircle,.RCircle,.BCircle{
        display: inline-block;
        width: .08rem;
        height: .08rem;
        border-radius: 50%;
    }
    .sk-spinner-three-bounce .sk-bounce1{
      width: 100%;
      height: 100%;
      background-color: #ff0000;
      border-radius: 100%;
      display: inline-block;
      -webkit-animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
      animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
      /* Prevent first frame from flickering when animation starts */
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }
    @-webkit-keyframes sk-threeBounceDelay {
        0%,
        80%,
        100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        40% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }

    @keyframes sk-threeBounceDelay {
        0%,
        80%,
        100% {
            -webkit-transform: scale(0);
            transform: scale(0);
        }
        40% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }

    .gray{background-color: #B7B7B7;}
    .green{background-color: #28FC2E;}
    .red{background-color: #FC0E1B;}
    /*右侧弹出窗口(频点列表)*/
    .mint-popup{
        background-color: #212227;
        width: 100%;
        height: 100%;
    }
    .channelList{
        height: 100%;
        overflow-y: auto;
    }
    .TypeSelect{
      height: .3rem;
      background: #3F4551;
      color: #FFF;
      width: .9rem;
      border: none;
      outline: none;
      border-radius: 5px;
      padding-left: .1rem;
      margin: 1px 1px 0 0;
    }
    .White{color: #FFFFFF;}
    .Red{color: #FF0000;}
    .Green{color: #00FF00}
    .Gray{color: #B7B7B7;}
    .back{
      color: #fff;
      margin: 10px;
      position: absolute;
    }
    .lock{
      height:100%;
      display:flex;
    }
    .lock i{
      margin:auto;
    }
    .lock .fa-lock{
      color: #ff9945;
    }
    .lock .fa-unlock{
      color: #75d1c7;
    }
    .deviceFilterPop{
      height:auto;
      background-color:#3f4551;
      color:#fff;
    }

</style>
<style>
  .channelList .mint-loadmore-text{color: #FFF;}
  .deviceFilterPop .mint-cell-wrapper{
    background-image:linear-gradient(180deg,#000,#000 50%,transparent 0) !important;
  }
  .deviceFilterPop .mint-cell-wrapper{
    padding:0 10px !important;
    padding-left:10px !important;
  }
  .deviceFilterPop .mint-cell{
    background-color:#3f4551 !important;
    color:#fff !important; 
    min-height: 48px !important;
    display: block !important;
  }
  .deviceFilterPop .mint-checkbox-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.14rem !important;
  }
  .deviceFilterPop .mint-radio-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.16rem !important;
  }
  .deviceFilterPop .mint-radiolist-label {
    display: block !important;
    padding: 0 10px !important;
  }
  .deviceFilterPop .mint-radiolist-title,
  .deviceFilterPop .mint-checklist-title{
    margin: 0px;
  }
  .nowrap{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:100%;
    display:inline-block;
  }
  .nowrapText{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:90%;
    display:inline-block; 
    vertical-align: middle;
    padding-left:5px;
  }
  
</style>