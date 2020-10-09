<template>
    <div class="live">
        <Device></Device>
        <div class="Group">
            <div class="GroupTitle">直播设置</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">传输速率(Mbps)</div>
                    <div class="GroupItemValue">
                        <mt-range
                                v-model="live.rate"
                                class="ItemRange byteRange"
                                :min="0.5"
                                :max="80"
                                :step=".1"
                                :bar-height="5">
                            <div style="color: #FFFFFF;padding: .01rem;" slot="start">0.5</div>
                            <div style="color: #FFFFFF;padding: .01rem;" slot="end">80</div>
                        </mt-range>
                        <input type="text" class="ItemIpt byteIpt" v-model.number="live.rate">
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">分辨率</div>
                    <div class="GroupItemValue">
                        <select type="text" class="ItemSel" v-model="live.resolution">
                            <option value="1080p">1080p</option>
                            <option value="720p">720p</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">推流地址</div>
                    <div class="GroupItemValue">
                        <mt-button type="default" class="ItemBtn" size="mini">添加</mt-button>
                        <mt-button type="default" class="ItemBtn" size="mini" style="margin-left: .2rem;">一键开启</mt-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Device from '../basic/Device';
    export default {
        name: "Live",
        data(){
            return{
                live:{
                    rate:1,
                    resolution:'1080p'
                }
            }
        },
        components: {
            Device
        }
    }
</script>

<style scoped>
    .live{
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
    .ItemSel{
        width: 35%;
        height: .3rem;
        line-height: .3rem;
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
    .ItemBtn{
        width: 40%;
        height: .3rem;
        display: inline-block;
        background-color: #454B56;
        color: #FFFFFF;
    }
</style>