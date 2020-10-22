<template>
    <div class="Device">
        <div class="channels">
            <div class="activeDevice" @click="showDeviceList">
                <div class="status">
                    <span class="statusCircle" :class="[ActiveDevice.online == 0 ? 'gray': '',ActiveDevice.online == 1 ? 'green': '',ActiveDevice.online == 2 ? 'red': '']"></span>
                </div>
                <div class="rate">
                    <span class="us">{{ ActiveDevice.us }}</span>
                    <span class="ds">{{ ActiveDevice.ds }}</span>
                </div>
                <div class="info">
            <span class="T">
              <span class="TCircle" :class="[ActiveDevice.dev_push_status == 0 ? 'gray': '',ActiveDevice.dev_push_status == 1 ? 'green': '',ActiveDevice.dev_push_status == 2 ? 'red': '']"></span>
              T: {{ ActiveDevice.dev_name }}
            </span>
                    <span class="R">
              <span class="RCircle" :class="[ActiveDevice.rcv_online == 0 ? 'gray': '',ActiveDevice.rcv_online == 1 ? 'green': '',ActiveDevice.rcv_online == 2 ? 'red': '']"></span>
              R: {{ ActiveDevice.rcv_name }}
            </span>
                    <span class="B" v-if="ActiveDevice.B">
              <span class="BCircle" :class="[ActiveDevice.BStatus == 0 ? 'gray': '',ActiveDevice.BStatus == 1 ? 'green': '',ActiveDevice.BStatus == 2 ? 'red': '']"></span>
              B: {{ ActiveDevice.B }}
            </span>
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
                        <div class="listChannel" @click="changeActiveDevice(item)">
                            <div class="status">
                                <span class="statusCircle" :class="[item.online == 0 ? 'gray': '',item.online == 1 ? 'green': '',item.online == 2 ? 'red': '']"></span>
                            </div>
                            <div class="rate">
                                <span class="us">{{ item.us }}</span>
                                <span class="ds">{{ item.ds }}</span>
                            </div>
                            <div class="info">
            <span class="T">
              <span class="TCircle" :class="[item.dev_push_status == 0 ? 'gray': '',item.dev_push_status == 1 ? 'green': '',item.dev_push_status == 2 ? 'red': '']"></span>
              T: {{ item.dev_name }}
            </span>
                                <span class="R">
              <span class="RCircle" :class="[item.rcv_online == 0 ? 'gray': '',item.rcv_online == 1 ? 'green': '',item.rcv_online == 2 ? 'red': '']"></span>
              R: {{ item.rcv_name }}
            </span>
                                <span class="B" v-if="item.B">
              <span class="BCircle" :class="[item.BStatus == 0 ? 'gray': '',item.BStatus == 1 ? 'green': '',item.BStatus == 2 ? 'red': '']"></span>
              B: {{ item.B }}
            </span>
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
    import { SET_ACTIVE_DEVICE } from '../../store/mutation-types';
    export default {
        name: "Device",
        data(){
            return{
                timer:null,
                popupVisible:false,
                deviceList:[{online:'',dev_sn:"",dev_name:"",dev_push_status:"",rcv_online:"",rcv_name:""}],
                active:{}
            }
        },
        computed: {
            ...mapState(['user','ActiveDevice'])
        },
        created(){  //生命周期-页面创建后
            console.warn(this.ActiveDevice)
            var that = this;
            // if(!this.ActiveDevice){
                this.getDeviceList();
            // }
            // this.timer = setInterval(function(){
            //     that.getDeviceList();
            // },5000);
        },
        methods:{
            ...mapMutations({
                SET_ACTIVE_DEVICE
            }),

            getDeviceList(){
                // this.deviceList = [];
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
                      if(!that.ActiveDevice || !that.ActiveDevice.dev_name){
                        that.SET_ACTIVE_DEVICE(that.deviceList[0]);
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
        background-color: #212227;
        padding: .05rem 0;
    }
    .listChannel{
        border-bottom: 1px solid #474B50;
        overflow: hidden;
        height: .5rem;
        background-color: #212227;
        padding: .05rem 0;
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
        padding-top: .08rem;
    }
    .us{
        display: block;
        color: #FEFD37;
        font-size: .15rem;
        text-align: left;
    }
    .ds{
        display: block;
        color: #2DABDB;
        font-size: .15rem;
        text-align: left;
    }
    .info{
        width: 40%;
        color: #FFFFFF;
        font-size: .15rem;
        box-sizing: border-box;
        padding-top: .02rem;
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
</style>