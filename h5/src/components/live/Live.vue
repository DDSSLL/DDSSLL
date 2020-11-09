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
                            <div style="color: #333333;padding: .01rem;" slot="start">0.5</div>
                            <div style="color: #333333;padding: .01rem;" slot="end">80</div>
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
                        <mt-button type="default" class="ItemBtn">添加</mt-button>
                        <mt-button type="default" class="ItemBtn" style="margin-left: .2rem;">一键开启</mt-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="addressGroup">
            <template v-for="(item,i) in address">
                <div class="address">
                    <div class="title">{{ item.name }}</div>
                    <div class="buttons">
                        <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true"></i>
                        <i class="iconBtn fa fa-trash-o" aria-hidden="true"></i>
                        <i class="iconBtn fa fa-play" aria-hidden="true"></i>
                    </div>
                </div>
            </template>
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
                },
                address:[
                    {name:'deli'},
                    {name:'推流地址二'}
                ]
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
        /*background-color: #272D33;*/
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
        padding: .1rem .2rem;
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
    .ItemRange{
        width: 68%;
        margin-right: .08rem;
    }
    .ItemIpt{
        width: 25%;
        height: .22rem;
        line-height: .22rem;
        outline: none;
        border: 1px solid #3d81f1;
        border-radius: 5px;
        font-size: .12rem;
    }
    .ItemSel{
        width: 35%;
        height: .3rem;
        line-height: .3rem;
        outline: none;
        border: 1px solid #3d81f1;
        border-radius: 5px;
        font-size: .12rem;
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
        background-color: #3d81f1;
        color: #FFFFFF;
        border: none;
        outline: none;
        border-radius: 5px;
        box-shadow: none;
        font-size: .12rem;
    }
    .addressGroup{
        border-top: 2px solid #DDDDDD;
        margin: 0.05rem 0;
        padding-top: .05rem;
    }
    .address{
        color: #333333;
        line-height: .4rem;
        overflow: hidden;
    }
    .address .title{
        font-size: .12rem;
        text-indent: .2rem;
        float: left;
        width: 60%;
        font-weight: 500;
    }
    .address .buttons{
        float: left;
        width: 38%;
        padding-right: 2%;
        text-align: right;
    }
    .iconBtn{
        cursor: pointer;
        font-size: .18rem;
        margin-right: .12rem;
    }
</style>