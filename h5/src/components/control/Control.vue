<template>
    <div class="control">
        <Device></Device>
        <div class="Group">
            <div class="GroupTitle">常用设置</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">传输开关</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="common.switch"></mt-switch>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">视频比特率(Mbps)</div>
                    <div class="GroupItemValue">
                        <mt-range
                                v-model="common.byte"
                                class="ItemRange byteRange"
                                :min="1"
                                :max="80"
                                :step="1"
                                :bar-height="5">
                            <div style="color: #FFFFFF;padding: .01rem;" slot="start">1</div>
                            <div style="color: #FFFFFF;padding: .01rem;" slot="end">80</div>
                        </mt-range>
                        <input type="text" class="ItemIpt byteIpt" v-model.number="common.byte">
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">延时(s)</div>
                    <div class="GroupItemValue">
                        <mt-range
                                v-model="common.delay"
                                class="ItemRange byteRange"
                                :min="0.1"
                                :max="20"
                                :step=".1"
                                :bar-height="5">
                            <div style="color: #FFFFFF;padding: .01rem;" slot="start">0.1</div>
                            <div style="color: #FFFFFF;padding: .01rem;" slot="end">20</div>
                        </mt-range>
                        <input type="text" class="ItemIpt byteIpt" v-model.number="common.delay">
                    </div>
                </div>
            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">网卡设置</div>
            <div class="GroupItem" style="padding: .1rem">
                <table class="netBoardTable">
                    <thead>
                    <tr>
                        <th>网卡</th>
                        <th>启用/禁用</th>
                        <th>上传<br>Mbps</th>
                        <th>RTT<br>ms</th>
                        <th>强度<br>dBm</th>
                        <th>运营商</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="item in netBoard">
                        <tr>
                            <td class="td" :class="[item.switch == true ? 'green': 'gray']">{{ item.card }}</td>
                            <td class="td"><mt-switch v-model="item.switch"></mt-switch></td>
                            <td class="td">{{ item.up }}</td>
                            <td class="td">{{ item.rtt }}</td>
                            <td class="td">{{ item.value }}</td>
                            <td class="td">{{ item.provider }}</td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Device from '../basic/Device';
    export default {
        name: "Control",
        data(){
            return{
                common:{
                    switch:true,
                    byte:20,
                    delay:2.5
                },
                netBoard:[
                    {card:'ETH0 ',switch:false,up:'-',rtt:'-',value:'-',provider:'-'},
                    {card:'1:LTE',switch:false,up:'-',rtt:'-',value:'-',provider:'-'},
                    {card:'2:LTE',switch:false,up:'-',rtt:'-',value:'-',provider:'-'},
                    {card:'3:LTE',switch:false,up:'-',rtt:'-',value:'-',provider:'-'},
                    {card:'4:5G-NSA',switch:true, up:10.66,rtt:29,value:-95,provider:'移动'},
                    {card:'5:5G-NSA',switch:true, up:11.249,rtt:32,value:-76,provider:'移动'},
                    {card:'6:5G-NSA',switch:false,up:0,rtt:0,value:-53,provider:'电信'}
                ]
            }
        },
        components: {
            Device
        },
        methods:{

        }
    }
</script>

<style scoped>
    .control{
        margin-top: 60px;
        height: 100%;
        background-color: #272D33;
    }
    .Group{
        margin-top: 0px;
    }
    .GroupTitle{
        border: 1px solid #272D33;
        text-align: left;
        text-indent: .1rem;
        padding: .1rem .08rem;
        background-color: #212227;
        border-radius: 5px;
        font-size: .16rem;
        color: #59B1A5;
    }
    .GroupItem{
        padding: .1rem .2rem;
    }
    .GroupItemField{
        overflow: hidden;
        /*margin-bottom: .1rem;*/
    }
    .GroupItemTitle{
        width: 25%;
        float: left;
        line-height: .3rem;
        text-align: left;
        font-size: .16rem;
        color: #FFFFFF;
    }
    .GroupItemValue{
        width: 75%;
        float: left;
        text-align: left;
    }
    .ItemRange{
        width: 68%;
        margin-right: .08rem;
    }
    .ItemIpt{
        width: 25%;
        height: .22rem;
        line-height: .22rem;
        outline: none;
        border:1px solid #b8bbbf;
        border-radius: 5px;
        font-size: .16rem;
    }
    .byteIpt{
        float: left;
        margin-top: .02rem;
    }
    .byteRange{
        float: left;
    }
    .netBoardTable{
        width: 100%;
        color: #FFFFFF;
        font-size: .16rem;
        font-weight: 500;
    }
    .td{
        padding: .03rem 0;
        vertical-align: middle;
    }
    .green{
        color: #00FB02;
    }
    .gray{
        color: #7E7E7E;
    }
    .mint-switch{
        transform: scale(.9);
    }
</style>
<style>
    .mint-switch-input:checked + .mint-switch-core{
        border-color: #69ACA0;
        background-color: #69ACA0;
    }
    .mt-range-progress{
        background-color: #69ACA0;
    }
</style>