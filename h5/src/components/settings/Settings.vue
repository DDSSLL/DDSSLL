<template>
    <div class="settings">
        <Device></Device>
        <div class="Group">
            <div class="GroupTitle">传输控制</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">传输IP</div>
                    <div class="GroupItemValue">
                        <button :class="[control.ip == 'lan' ? 'btnSelect' : '']" class="lan" @click="chooseIP('lan')">内网</button>
                        <button :class="[control.ip == 'wan' ? 'btnSelect' : '']" class="wan" @click="chooseIP('wan')">外网</button>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">录制开关</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="control.rec">
                        </mt-switch>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">重传开关</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="control.send">
                        </mt-switch>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">纠错开关</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="control.cer">
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
                        <select class="ItemSelect" v-model="input.video">
                            <option value="1">3G-SDI[1]</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">音频输入</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.audio">
                            <option value="1">2-CH</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">视频编码</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.videoCode">
                            <option value="1">H.265 Main(4:2:0/8bit)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">音频编码</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.audioCode">
                            <option value="1">AAC</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">音频比特率</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.audioByte">
                            <option value="1">64kbps</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">码率控制</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.rate">
                            <option value="1">CBR</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">HDR设置</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.hdr">
                            <option value="1">SDR</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">时延模式</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.delay">
                            <option value="1">标准时延</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">编码分辨率</div>
                    <div class="GroupItemValue">
                        <select class="ItemSelect" v-model="input.resolution">
                            <option value="1">自动</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">SDI</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">分辨率帧率</div>
                    <div class="GroupItemValue">
                        <input type="text" class="x2Ipt" v-model="sdi.resolutionRate">
                        <input type="text" class="x1Ipt" v-model="sdi.resolutionValue">
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
        <div class="Group">
            <div class="GroupTitle">HDMI</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">输出透传</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="hdmi.penetrate">
                        </mt-switch>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">分辨率帧率</div>
                    <div class="GroupItemValue">
                        <select class="x2Ipt" v-model="hdmi.resolutionRate">
                            <option value="1080">1080p</option>
                        </select>
                        <select class="x1Ipt" v-model="hdmi.resolutionValue">
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
                control:{
                    ip:'lan',
                    rec:false,
                    send:true,
                    cer:false
                },
                input:{
                    video:'1',
                    audio:'1',
                    videoCode:'1',
                    audioCode:'1',
                    audioByte:'1',
                    rate:'1',
                    hdr:'1',
                    delay:'1',
                    resolution:'1'
                },
                sdi:{
                    resolutionRate:'1080i',
                    resolutionValue:'50'
                },
                hdmi:{
                    penetrate:true,
                    resolutionRate:'1080',
                    resolutionValue:'59.94'
                }
            }
        },
        components: {
            Device
        },
        computed: {
            ...mapState(['navHide'])
        },
        methods:{
            ...mapMutations({
                SET_USER,
                SET_NAV_STATUS
            }),

            chooseIP(val){this.control.ip = val;},

            refresh(){},

            save(){},

            apply(){}
        }
    }
</script>

<style scoped>
    .settings{
        margin-top: 60px;
        /*background-color: #272D33;*/
        height: 84%;
        padding-bottom: 62px;
        overflow-y: auto;
    }
    .Group{
        margin-top: 0px;
    }
    .GroupTitle{
        border-top: 1px solid #DDDDDD;
        border-bottom: 1px solid #DDDDDD;
        text-align: left;
        text-indent: .1rem;
        padding: .1rem .08rem;
        background-color: #ecf0f4;
        /*border-radius: 5px;*/
        font-size: .15rem;
        font-weight:500;
        color: #000000;
    }
    .GroupItem{
        padding: .05rem .2rem;
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
        color: #000000;
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