<template>
    <div class="live">
        <Device></Device>
        <div class="Group">
            <div class="GroupTitle">直播设置</div>
            <div class="GroupItem" v-if="ActiveDeviceType == 'DV4000'">
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
            <div class="GroupItem" v-if="ActiveDeviceType == 'DV4000'">
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
            <!--<div class="GroupItem">-->
                <!--<div class="GroupItemField">-->
                    <!--<div class="GroupItemTitle">推流地址</div>-->
                    <!--<div class="GroupItemValue">-->
                        <!--&lt;!&ndash;<mt-button type="default" class="ItemBtn">添加</mt-button>&ndash;&gt;-->
                        <!--<mt-button type="default" class="ItemBtn">一键开启</mt-button>-->
                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        </div>
        <div class="addressGroup">
            <template v-for="(item,i) in address">
                <div class="address">
                    <div class="title">{{ item.remark }}</div>
                    <div class="buttons">
                        <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true" @click="showEditUrls(item)"></i>
                        <!--<i class="iconBtn fa fa-trash-o" aria-hidden="true"></i>-->
                        <i class="iconBtn fa" :class="[item.push_status == 'running'? 'fa-stop' : 'fa-play']" aria-hidden="true" @click="switchPush(item)"></i>
                    </div>
                </div>
            </template>
        </div>
        <mt-popup
                v-model="pushUrlsEditVisible"
                popup-transition="popup-fade">
            <div class="pushEditModal">
                <div class="modalTitle">
                    推流地址
                    <i class="closeBtn fa fa-close" @click="hideEditUrls"></i>
                </div>
                <div class="formContainer">
                    <div class="formItem">
                        <div class="formItemTitle">备注名</div>
                        <div class="formItemVal"><input type="text" v-model="activePushObj.remark"></div>
                    </div>
                    <div class="formItem">
                        <div class="formItemTitle">推流地址</div>
                        <div class="formItemVal">
                            <span class="rtmp">RTMP</span><input type="text" v-model="activePushObj.push_url" style="width: 65%;">
                            <p class="rtmpTip">支持 RTMP+H.264、RTMP+H.265</p>
                        </div>
                    </div>
                    <div class="formItem" style="text-align: right;margin-bottom: 0;">
                        <button class="modalBtn" @click="hideEditUrls">取消</button>
                        <button class="modalBtn" @click="saveEditUrls">确定</button>
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import Device from '../basic/Device';
    import { mapState } from 'vuex';
    export default {
        name: "Live",
        data(){
            return{
                pushUrlsEditVisible:false,
                activePushObj:{},
                live:{
                    rate:1,
                    resolution:'1080p'
                },
                address:[]
            }
        },
        computed: {
            ...mapState(['user','ActiveDevice','ActiveDeviceType'])
        },
        watch:{   //监听当前设备值变化
            '$store.state.ActiveDevice': {
                immediate: true,
                handler(val) {
                    console.warn(val)
                    if(val){
                        var that = this;
                        that.getPushUrls();
                    }
                }
            }
        },
        activated(){  //生命周期-缓存页面激活
            this.getPushUrls();
        },
        deactivated(){   //生命周期-缓存页面失活

        },
        components: {
            Device
        },
        methods:{
            getPushUrls(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/indexData.php",
                    data:this.$qs.stringify({
                        getBoardUrl:true,
                        rcvSn: that.ActiveDevice.rcv_sn,
                        boardId: that.ActiveDevice.board_id
                    }),
                    Api:"getBoardUrl",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.address = res.data;
                    }else{
                        that.address = [];
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },
            showEditUrls(obj){
                this.pushUrlsEditVisible = true;
                this.activePushObj = obj;
            },
            hideEditUrls(){
                this.pushUrlsEditVisible = false;
                this.activePushObj = {};
            },
            saveEditUrls(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/indexData.php",
                    data:this.$qs.stringify({
                        editUrlRemark:that.activePushObj.id,
                        rcvSn: that.activePushObj.rcv_sn,
                        boardId: that.activePushObj.board_id,
                        url: that.activePushObj.push_url,
                        remark: that.activePushObj.remark
                    }),
                    Api:"editUrl",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    that.pushUrlsEditVisible = false;
                    if(res.res.success){
                        that.getPushUrls();
                    }else{
                        that.getPushUrls();
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },
            switchPush(item){
                var value =  (item.push_status == 'running' ? 0 : 1);
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/indexData.php",
                    data:this.$qs.stringify({
                        editUrl:item.id,
                        col: "push_sel",
                        value: value
                    }),
                    Api:"editUrlStatus",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.getPushUrls();
                    }else{
                        that.getPushUrls();
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
    .live{
        margin-top: 60px;
        height: 84%;
        padding-bottom: 62px;
        overflow-y: auto;
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
        margin: 0;
        padding-top: .05rem;
        margin-bottom: .2rem;
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
    .pushEditModal{
        width: 3rem;
    }
    .modalTitle{
        padding: .1rem;
        background-color: #DDDDDD;
        font-size: .14rem;
        font-weight: 500;
        line-height: .14rem;
    }
    .closeBtn{
        float: right;
        margin-right: 0;
        display: inline-block;
        margin-top: -2px;
    }
    .formContainer{
        padding: .1rem;

    }
    .formItem{
        overflow: hidden;
        margin-bottom: .1rem;
    }
    .formItemTitle{
        float:left;
        width: 30%;
        color: #333;
        line-height: .28rem;
        font-size: .13rem;
    }
    .formItemVal{
        float: left;
        width: 70%;
    }
    .formItemVal input{
        display: inline-block;
        width: 93%;
        background: #FFFFFF;
        border: 1px solid #ccc;
        color: #333333;
        height: .24rem;
        line-height: .24rem;
        font-size: .13rem;
        outline:none;
        border-radius: 4px;
    }
    .modalBtn{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        margin-right: .05rem;
    }
    .rtmp{
        background: #4C5157;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        color: #FFF;
        text-align: center;
        display: inline-block;
        padding: .06rem .08rem;
    }
    .rtmpTip{
        color: #f88a22;
        font-size: .12rem;
    }
</style>