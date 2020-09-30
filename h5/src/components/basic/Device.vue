<template>
    <div class="Device">
        <div class="channels">
            <div class="activeDevice" @click="showDeviceList">
                <div class="status">
                    <span class="statusCircle" :class="[ActiveDevice.status == 0 ? 'gray': '',ActiveDevice.status == 1 ? 'green': '',ActiveDevice.status == 2 ? 'red': '']"></span>
                </div>
                <div class="rate">
                    <span class="us">{{ ActiveDevice.us }}</span>
                    <span class="ds">{{ ActiveDevice.ds }}</span>
                </div>
                <div class="info">
            <span class="T">
              <span class="TCircle" :class="[ActiveDevice.TStatus == 0 ? 'gray': '',ActiveDevice.TStatus == 1 ? 'green': '',ActiveDevice.TStatus == 2 ? 'red': '']"></span>
              T: {{ ActiveDevice.T }}
            </span>
                    <span class="R">
              <span class="RCircle" :class="[ActiveDevice.RStatus == 0 ? 'gray': '',ActiveDevice.RStatus == 1 ? 'green': '',ActiveDevice.RStatus == 2 ? 'red': '']"></span>
              R: {{ ActiveDevice.R }}
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
                                <span class="statusCircle" :class="[item.status == 0 ? 'gray': '',item.status == 1 ? 'green': '',item.status == 2 ? 'red': '']"></span>
                            </div>
                            <div class="rate">
                                <span class="us">{{ item.us }}</span>
                                <span class="ds">{{ item.ds }}</span>
                            </div>
                            <div class="info">
            <span class="T">
              <span class="TCircle" :class="[item.TStatus == 0 ? 'gray': '',item.TStatus == 1 ? 'green': '',item.TStatus == 2 ? 'red': '']"></span>
              T: {{ item.T }}
            </span>
                                <span class="R">
              <span class="RCircle" :class="[item.RStatus == 0 ? 'gray': '',item.RStatus == 1 ? 'green': '',item.RStatus == 2 ? 'red': '']"></span>
              R: {{ item.R }}
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
                popupVisible:false,
                deviceList:[],
                active:{}
            }
        },
        computed: {
            ...mapState(['ActiveDevice'])
        },
        created(){
            this.getDeviceList();
        },
        methods:{
            ...mapMutations({
                SET_ACTIVE_DEVICE
            }),

            getDeviceList(){
                this.deviceList = [
                    {status:0,us:'2.931',ds:'2.649',T:"100028",R:"R6",B:"2",TStatus:2,RStatus:1,BStatus:2},
                    {status:0,us:'-',ds:'-',T:"100034(宋世杰)",R:"Vir-Huawei",TStatus:0,RStatus:1},
                    {status:0,us:'-',ds:'-',T:"100035(移动香港)",R:"Vir-Huawei",TStatus:0,RStatus:1}
                ];
                if(!this.ActiveDevice || !this.ActiveDevice.T){
                    this.SET_ACTIVE_DEVICE(this.deviceList[0]);
                }
            },
            showDeviceList(){
                this.popupVisible = true;
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