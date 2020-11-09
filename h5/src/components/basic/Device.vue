<template>
  <div class="Device">
    <div class="channels">
      <div class="activeDevice" @click="showDeviceList" v-if="!!ActiveDevice">
        <div class="status">
          <span class="statusCircle" :class="[this.AD_match_used == 0 ? 'gray': this.AD_dev_push_status!=0 ? 'sk-spinner sk-spinner-three-bounce': 'green']">
            <span class="sk-bounce1"></span>
          </span>
        </div>
        <div class="rate">
          <div v-if="this.AD_match_used=='1' && this.AD_dev_push_status!='0'">
            <span class="us">{{ (+this.AD_dev_push_br / 1000).toFixed(3) }}</span>
            <span class="ds">{{ (+this.AD_rcv_br / 1000).toFixed(3) }}</span>
            <span class="rl" v-if="this.AD_TotalLossRate!=0" >{{ (+this.AD_TotalLossRate / 10).toFixed(1) + '%' }}</span>  
          </div>
          <div v-else class="noSpeedInfo">--</div>
        </div>
        <div class="info">
          <div>
            <span class="T">
              <span class="TCircle" :class="[this.AD_online== 1 ? (this.AD_dev_push_status!=0 ? 'red' : 'green') : 'gray']"></span>
              T: {{ this.AD_dev_name }}
            </span>
            <span class="R">
              <span class="RCircle" :class="[this.AD_rcv_online == 1 ? (this.AD_dev_push_status != '0' ? 'red' : 'green') : 'gray']"></span>
              R: {{ this.AD_rcv_name }}
            </span>
            <span class="B" v-if="ActiveDeviceType=='DV4000'">
              <span class="BCircle" :class="[!this.AD_board_online||this.AD_board_online=='0' ? 'gray': this.AD_dev_push_status!='0'?'red':'green']"></span>
              B: {{ this.AD_board_id }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="popup">
      <mt-popup
        v-model="popupVisible"
        position="right"
        popup-transition="popup-slide">
        <div class="channelList">
          <template v-for="(item,i) in deviceList">
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
              <div class="info">
                <div>
                  <span class="T">
                    <span class="TCircle" :class="[item.online== 1 ? (item.dev_push_status!=0 ? 'red' : 'green') : 'gray']"></span>
                    T: {{ item.dev_name }}
                  </span>
                  <span class="R">
                    <span class="RCircle" :class="[item.rcv_online == 1 ? (item.dev_push_status != '0' ? 'red' : 'green') : 'gray']"></span>
                    R: {{ item.rcv_name }}
                  </span>
                  <span class="B" v-if="ActiveDeviceType=='DV4000'">
                    <span class="BCircle" :class="[!ActiveDevice.board_online||ActiveDevice.board_online=='0' ? 'gray': ActiveDevice.dev_push_status!='0'?'red':'green']"></span>
                    B: {{ ActiveDevice.board_id }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { SET_ACTIVE_DEVICE,SET_DEVICE_TIMER } from '../../store/mutation-types';
    export default {
        name: "Device",
        data(){
            return{
                timer:null,
                popupVisible:false,
                deviceList:[{online:'',dev_sn:"",dev_name:"",dev_push_status:"",rcv_online:"",rcv_name:""}],
                active:{},
                //当前选中设备的相关参数
                AD_match_used: null,
                AD_dev_push_status: null,
                AD_dev_push_br: null,
                AD_rcv_br: null,
                AD_TotalLossRate : null,
                AD_online: null,
                AD_dev_name: null,
                AD_rcv_online: null,
                AD_rcv_name: null,
                AD_board_online: null,
                AD_board_id: null
            }
        },
        computed: {
            ...mapState(['user','ActiveDevice','DeviceTimer'])
        },
        created(){  //生命周期-页面创建后
            console.warn(this.ActiveDevice)
            var that = this;
            // if(!this.ActiveDevice){
            this.getDeviceList();
            // }

            clearInterval(this.DeviceTimer);
            this.timer = setInterval(function(){
              that.getDeviceList();
            },1000);
            this.SET_DEVICE_TIMER(this.timer);
        },
        methods:{
            ...mapMutations({
                SET_ACTIVE_DEVICE,
                SET_DEVICE_TIMER
            }),
            refreshCurDevParam(datas){
              //更新当前设备参数
              this.AD_match_used = datas.match_used;
              this.AD_dev_push_status = datas.dev_push_status;
              this.AD_dev_push_br = datas.dev_push_br;
              this.AD_rcv_br = datas.rcv_br;
              this.AD_TotalLossRate = datas.TotalLossRate;
              this.AD_online = datas.online;
              this.AD_dev_name = datas.dev_name;
              this.AD_rcv_online = datas.rcv_online;
              this.AD_rcv_name = datas.rcv_name;
              this.AD_board_online = datas.board_online;
              this.AD_board_id = datas.board_id;
            },
            getDeviceList(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/indexData.php",
                    data:this.$qs.stringify({
                      getDevAndMatch:true,
                      userId: that.user.id,
                      userGroup: that.user.userGroup
                    }),
                    Api:"getDevAndMatch",
                    AppId:"android",
                    UserId:that.user.login_name
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                      that.deviceList = res.data;
                      if(!that.ActiveDevice){
                        that.SET_ACTIVE_DEVICE(that.deviceList[0]);
                      }
                      for(var i=0; i<that.deviceList.length; i++){
                        if(that.deviceList[i]["dev_sn"] == that.ActiveDevice["dev_sn"]){
                          that.refreshCurDevParam(that.deviceList[i]);
                        }
                      }
                      
                    }else{
                      that.deviceList = [];
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
      background-color:#3E4247;
    }
    .status,.rate,.info{
        float: left;
        height: 100%;
    }
    .status{
        width: 20%;
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
        width: 40%;
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
        background-color: #FFFFFF;
        width: 100%;
        height: 100%;
    }
    .channelList{
        height: 100%;
        overflow-y: auto;
    }
</style>