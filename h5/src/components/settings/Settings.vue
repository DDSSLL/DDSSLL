<template>
    <div class="settings">
        <Device></Device>
        <div class="Group">
            <div class="GroupTitle">传输控制</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">传输IP</div>
                    <div class="GroupItemValue">
                        <button :class="[options.dev_push_ip == '1' ? 'btnSelect' : '']" class="lan" @click="setDeviceParam('dev_push_ip','1')">内网</button>
                        <button :class="[options.dev_push_ip == '0' ? 'btnSelect' : '']" class="wan" @click="setDeviceParam('dev_push_ip','0')">外网</button>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">录制开关</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="options.recordVal" @change="setDeviceParam('record',options.recordVal?'1':'0')">
                        </mt-switch>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">重传开关</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="options.ResendModeVal" @change="setDeviceParam('ResendMode',options.ResendModeVal?'1':'0')">
                        </mt-switch>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">纠错开关</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="options.OpenfecModeVal" @change="setDeviceParam('OpenfecMode',options.OpenfecModeVal?'1':'0')">
                        </mt-switch>
                    </div>
                </div>
            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">输入编码</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">视频输入</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.video_input" @change="setDeviceParam('video_input',options.video_input)">
                            <template v-for="item in OPTIONS_VIDEOINPUT">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">音频输入</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.audio_input" @change="setDeviceParam('audio_input',options.audio_input)">
                            <template v-for="item in OPTIONS_AUDIOINPUT">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">视频编码</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.video_encode" @change="setDeviceParam('video_encode',options.video_encode)">
                            <template v-for="item in OPTIONS_VIDEOENCODE">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">音频编码</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.AudioEnc" @change="setDeviceParam('AudioEnc',options.AudioEnc)">
                            <template v-for="item in OPTIONS_AUDIO_ENCODE">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">音频比特率</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.AudioBitrate" @change="setDeviceParam('AudioBitrate',options.AudioBitrate)">
                            <template v-for="item in OPTIONS_AUDIO_BR">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">码率控制</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.bitrate_mode" @change="setDeviceParam('bitrate_mode',options.bitrate_mode)">
                            <template v-for="item in OPTIONS_BITRATEMODE">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">HDR设置</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.hdr" @change="setDeviceParam('hdr',options.hdr)">
                            <template v-for="item in OPTIONS_HDR">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">时延模式</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.latency" @change="setDeviceParam('latency',options.latency)">
                            <template v-for="item in OPTIONS_LATENCY">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">编码分辨率</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="options.HdmiTransFormat" @change="setDeviceParam('HdmiTransFormat',options.HdmiTransFormat)">
                            <template v-for="item in OPTIONS_HDMI_FORMAT">
                                <option :value="item.value">{{ item.text }}</option>
                            </template>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="Group" v-if="ActiveDeviceType == 'DV4000'">
            <div class="GroupTitle">SDI</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">分辨率帧率</div>
                    <div class="GroupItemValue">
                        <input type="text" class="x2Ipt" v-model="options.sdiresolutionRate">
                        <input type="text" class="x1Ipt" v-model="options.sdiresolutionValue">
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">解码器</div>
                    <div class="GroupItemValue">
                        <button class="x2Btn">复位</button>
                        <button class="x1Btn">停止</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="Group" v-if="ActiveDeviceType == 'DV4000'">
            <div class="GroupTitle">HDMI</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">输出透传</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="options.hdmipenetrate">
                        </mt-switch>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">分辨率帧率</div>
                    <div class="GroupItemValue">
                        <select class="x2Ipt" v-model="options.hdmiresolutionRate">
                            <option value="1080">1080p</option>
                        </select>
                        <select class="x1Ipt" v-model="options.hdmiresolutionValue">
                            <option value="59.94">59.94</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { SET_USER,SET_NAV_STATUS } from '../../store/mutation-types';
    import Device from '../basic/Device';
    export default {
        name: "Settings",
        data(){
            return{
                OPTIONS_AUDIOINPUT : [{
                    value: "1",
                    text: "2-CH"
                }],
                OPTIONS_VIDEOINPUT : [{
                    value: "0",
                    text: "3G-SDI"
                }, {
                    value: "1",
                    text: "HDMI"
                }],
                OPTIONS_VIDEOENCODE : [{
                    value: "0",
                    text: "H.264"
                }],
                OPTIONS_BITRATEMODE : [{
                    value: "0",
                    text: "CBR"
                }, {
                    value: "1",
                    text: "AVBR"
                }],
                OPTIONS_HDR : [{
                    text: "SDR",
                    value: "0"
                }],
                OPTIONS_LATENCY : [{
                    text: "标准时延",
                    value: "0"
                }],
                OPTIONS_HDMI_FORMAT : [{
                    text: "1920x1080p29.97",
                    value: "1"
                }, {
                    text: "1920x1080p59.94",
                    value: "2"
                }, {
                    text: "1920x1080p50",
                    value: "3"
                }, {
                    text: "1920x1080p25",
                    value: "4"
                }, {
                    text: "1920x1080i59.94",
                    value: "5"
                }, {
                    text: "1920x1080i50",
                    value: "6"
                }, {
                    text: "1280x720p59.94",
                    value: "7"
                }, {
                    text: "1280x720p50",
                    value: "8"
                }, {
                    text: "1280x720p29.97",
                    value: "9"
                }, {
                    text: "1280x720p25",
                    value: "10"
                }, {
                    text: "720x576p50",
                    value: "11"
                }, {
                    text: "720x480p59.94",
                    value: "12"
                }],
                OPTIONS_AUDIO_ENCODE : [{
                    text: "AAC",
                    value: "0"
                }],
                OPTIONS_AUDIO_BR : [{
                    text: "256kbps",
                    value: "256"
                }, {
                    text: "128kbps",
                    value: "128"
                },{
                    text: "64kbps",
                    value: "64"
                }],
                options:{
                    dev_push_ip:'1',
                    record:'0',
                    recordVal:false,
                    ResendMode:'0',
                    ResendModeVal:false,
                    OpenfecMode:'0',
                    OpenfecModeVal:false,
                    video_input:'0',
                    audio_input:'1',
                    video_encode:'0',
                    AudioEnc:'0',
                    AudioBitrate:'256',
                    bitrate_mode:'0',
                    hdr:'0',
                    latency:'0',
                    HdmiTransFormat:'1',
                    sdiresolutionRate:'1080i',
                    sdiresolutionValue:'50',
                    hdmipenetrate:true,
                    hdmiresolutionRate:'1080',
                    hdmiresolutionValue:'59.94'
                }
            }
        },
        components: {
            Device
        },
        computed: {
            ...mapState(['user','navHide','ActiveDeviceType'])
        },
        watch:{   //监听当前设备值变化
            '$store.state.ActiveDevice': {
                immediate: true,
                handler(val) {
                    this.ActiveDevice = val;
                    this.getDeviceParam();
                }
            }
        },
        activated(){  //生命周期-缓存页面激活
            this.getDeviceParam();
        },
        deactivated(){   //生命周期-缓存页面失活

        },
        methods:{
            ...mapMutations({
                SET_USER,
                SET_NAV_STATUS
            }),

            chooseIP(val){this.control.ip = val;},

            getDeviceParam(){
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
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.options = formatData(res.data[0]);
                    }else{
                        that.options = {
                            dev_push_ip:'1',
                            record:'0',
                            recordVal:false,
                            ResendMode:'0',
                            ResendModeVal:false,
                            OpenfecMode:'0',
                            OpenfecModeVal:false,
                            video_input:'0',
                            audio_input:'1',
                            video_encode:'0',
                            AudioEnc:'0',
                            AudioBitrate:'256',
                            bitrate_mode:'0',
                            hdr:'0',
                            latency:'0',
                            HdmiTransFormat:'1',
                            sdiresolutionRate:'1080i',
                            sdiresolutionValue:'50',
                            hdmipenetrate:true,
                            hdmiresolutionRate:'1080',
                            hdmiresolutionValue:'59.94'
                        };
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })

                function formatData(data){
                    if(data.record == '0'){  //录制开关
                        data.recordVal = false;
                    }else if(data.record == '1'){
                        data.recordVal = true;
                    }
                    if(data.ResendMode == '0'){  //重传开关
                        data.ResendModeVal = false;
                    }else if(data.ResendMode == '1'){
                        data.ResendModeVal = true;
                    }
                    if(data.OpenfecMode == '0'){  //纠错开关
                        data.OpenfecModeVal = false;
                    }else if(data.OpenfecMode == '1'){
                        data.OpenfecModeVal = true;
                    }
                    return data;
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
                        that.getDeviceParam();
                    }else{
                        that.getDeviceParam();
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            }
        }
    }
</script>

<style scoped>
    .settings{
        margin-top: 60px;
        background-color: #212227;
        height: 84%;
        padding-bottom: 62px;
        overflow-y: auto;
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
    .Group .GroupItem:last-child{
        border-bottom: 0;
    }
    .GroupItem{
        padding: .05rem .2rem;
        border-bottom: 1px solid #333;
    }
    .GroupItemField{
        overflow: hidden;
        /*margin-bottom: .1rem;*/
    }
    .GroupItemTitle{
        width: 35%;
        float: left;
        line-height: .3rem;
        text-align: left;
        font-size: .14rem;
        color: #EEEEEE;
    }
    .GroupItemValue{
        width: 65%;
        float: left;
        text-align: left;
    }
    .lan,.wan{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
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
    .ItemSelect{
        width: 1.8rem;
        height: .26rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
    }
    .x2Ipt{
        width: 1.2rem;
        height: .24rem;
        border-radius: 5px;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        font-size: .12rem;
    }
    .x1Ipt{
        width: .6rem;
        height: .24rem;
        border-radius: 5px;
        margin-left: .1rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        font-size: .12rem;
    }
    .x2Btn{
        width: 1.25rem;
        height: .24rem;
        border-radius: 5px;
        border: none;
        outline: none;
        box-shadow: none;
        background-color: #3d81f1;
        color: #FFFFFF;
        font-size: .14rem;
    }
    .x1Btn{
        width: .64rem;
        height: .24rem;
        border-radius: 5px;
        margin-left: .08rem;
        border: none;
        outline: none;
        box-shadow: none;
        background-color: #3d81f1;
        color: #FFFFFF;
        font-size: .14rem;
    }
    .Group:nth-last-of-type(1){
        margin-bottom: .2rem;
    }
    .mint-switch{
        margin-left: -.34rem;
    }
</style>