<template>
    <div class="me">
        <div class="Group">
            <div class="GroupTitle">背包信息</div>
            <div class="GroupItem">

            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">接收机信息</div>
            <div class="GroupItem">

            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">账号信息</div>
            <div class="GroupItem">

            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">权限信息</div>
            <div class="GroupItem">

            </div>
        </div>
         <div class="Group">
            <div class="GroupTitle">图表配置</div>
            <div class="GroupItem">
                <mt-navbar v-model="ChartConfTab">
                    <mt-tab-item id="1">单位</mt-tab-item>
                    <mt-tab-item id="2">概览图</mt-tab-item>
                    <mt-tab-item id="3">网卡图</mt-tab-item>
                </mt-navbar>
                <mt-tab-container v-model="ChartConfTab">
                <mt-tab-container-item id="1">
                    <div class="GroupItem">
                        <div class="GroupItemField">
                            <div class="GroupItemTitle">自适应</div>
                            <div class="GroupItemValue">
                                <mt-switch v-model="ChartConf.unit.chartAutoVal">
                                </mt-switch>
                            </div>
                        </div>
                    </div>
                    <div class="GroupItem">
                        <div class="GroupItemBtns">
                            <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;" @click="setChartConfUnit">确定</button>
                            <button class="setBtn" @click="getChartConfUnit">恢复当前值</button>
                        </div>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="2">
                    <div class="GroupItem">
                        <div class="GroupItemField">
                            <div class="GroupItemTitle">上传速率</div>
                            <div class="GroupItemValue">
                                <select class="ItemSelect" v-model="ChartConf.total.up">
                                        <option value="Total">Total</option>
                                        <option value=" ">Null</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="GroupItem">
                        <div class="GroupItemField">
                            <div class="GroupItemTitle">下载速率</div>
                            <div class="GroupItemValue">
                                <select class="ItemSelect" v-model="ChartConf.total.down">
                                        <option value="Total">Total</option>
                                         <option value=" ">Null</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="GroupItem">
                        <div class="GroupItemField">
                            <div class="GroupItemTitle">传输丢包</div>
                            <div class="GroupItemValue">
                                <select class="ItemSelect" v-model="ChartConf.total.lossDev">
                                        <option value="Total">Total</option>
                                         <option value=" ">Null</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="GroupItem">
                        <div class="GroupItemField">
                            <div class="GroupItemTitle">业务丢包</div>
                            <div class="GroupItemValue">
                                <select class="ItemSelect" v-model="ChartConf.total.lossRcv">
                                        <option value="Total">Total</option>
                                         <option value=" ">Null</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="GroupItem">
                        <div class="GroupItemBtns">
                            <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;" @click="setChartConfTotal">确定</button>
                            <button class="setBtn" @click="getChartConfTotal">恢复当前值</button>
                        </div>
                    </div>
                </mt-tab-container-item>
                <mt-tab-container-item id="3">
                    <div class="GroupItem">
                        <div class="GroupItemField">
                            <div class="GroupItemTitle" style="width:28%;">颜色样式</div>
                            <div class="GroupItemValue" style="width:72%;">
                                <button :class="[ChartConf.card.id == '1' ? 'btnSelect' : '']" class="lan" @click="setCardChartStyle('1')">样式一</button>
                                <button :class="[ChartConf.card.id == '2' ? 'btnSelect' : '']" class="wan" @click="setCardChartStyle('2')">样式二</button>
                            </div>
                        </div>
                    </div>
                    <div class="GroupItem">
                        <div class="GroupItemField">
                            <div class="GroupItemTitle">批量选择</div>
                            <div class="GroupItemValue">
                                <mt-checklist
                                    v-model="ChartConf.card.eth0Val"
                                    :options="[{label:'上传速率',value:'up'},{label:'下载速率',value:'down'},{label:'传输丢包',value:'lossDev'}]">
                                </mt-checklist>
                            </div>
                        </div>
                    </div>
                    <div class="GroupItem">
                        <div class="GroupItemBtns">
                            <button class="setBtn" style="background:rgb(43,162,69);margin-right:.06rem;color:#FFF;" @click="setChartConfCard">确定</button>
                            <button class="setBtn" @click="getChartConfCard">恢复当前值</button>
                        </div>
                    </div>
                </mt-tab-container-item>
                </mt-tab-container>
            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">系统</div>
            <div class="GroupItem">
                <mt-button size="large" class="logout" @click="logout">登出</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { SET_USER,SET_NAV_STATUS,SET_ACTIVE_DEVICE,SET_TIMER_CLEAR } from '../../store/mutation-types';
    export default {
        name: "Me",
        data(){
            return{
                ChartConfTab:'1',
                ChartConf:{
                    unit:{chartAutoVal:true,chartAuto:"1",chartInterval:"",chartMax:""},
                    total:{dev_sn: "8000102140", down: "Total",id: "1",lossDev: "Total",lossRcv: "Total",up: "Total"},
                    card:{
                        dev_sn: "8000102140",
                        eth0: "up,down,lossDev",
                        eth0Val:["up","down","lossDev"],
                        wifi: "up,down,lossDev",
                        wifiVal:["up","down","lossDev"],
                        sim1: "up,down,lossDev",
                        sim1Val:["up","down","lossDev"],
                        sim2: "up,down,lossDev",
                        sim2Val:["up","down","lossDev"],
                        sim3: "up,down,lossDev",
                        sim3Val:["up","down","lossDev"],
                        sim4: "up,down,lossDev",
                        sim4Val:["up","down","lossDev"],
                        sim5: "up,down,lossDev",
                        sim5Val:["up","down","lossDev"],
                        sim6: "up,down,lossDev",
                        sim6Val:["up","down","lossDev"],
                        "usb-5g1": "up,down,lossDev",
                        "usb-5g1Val": ["up","down","lossDev"],
                        "usb-5g2": "up,down,lossDev",
                        "usb-5g2Val": ["up","down","lossDev"],
                        "usb-lan": "up,down,lossDev",
                        "usb-lanVal": ["up","down","lossDev"],
                        "usb-lan2": "up,down,lossDev",
                        "usb-lan2Val": ["up","down","lossDev"],
                        id: "1"
                    }
                }
            }
        },
        computed: {
            ...mapState(['user','navHide','DeviceTimer','ChartTimer'])
        },
        watch:{   //监听当前设备值变化
            '$store.state.ActiveDevice': {
                immediate: true,
                handler(val) {
                    this.ActiveDevice = val;
                    this.getChartConfUnit();
                    this.getChartConfTotal();
                    this.getChartConfCard();
                }
            }
        },
        activated(){  //生命周期-缓存页面激活
            this.getChartConfUnit();
            this.getChartConfTotal();
            this.getChartConfCard();
        },
        deactivated(){   //生命周期-缓存页面失活

        },
        methods:{
            ...mapMutations({
                SET_USER,
                SET_NAV_STATUS,
                SET_ACTIVE_DEVICE,
                SET_TIMER_CLEAR
            }),

            getChartConfUnit(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/chartData.php",
                    data:this.$qs.stringify({
                        getChartParam:true,
                        devSn: that.ActiveDevice.dev_sn
                    }),
                    Api:"getChartParam",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.ChartConf.unit = formatUnit(res.data[0]);
                    }else{
                        that.ChartConf.unit = {chartAutoVal:true};
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
                function formatUnit(item){
                    if(item.chartAuto == "1"){
                        item.chartAutoVal = true;
                    }else{
                        item.chartAutoVal = false;
                    }
                    return item;
                }
            },
            setChartConfUnit(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/chartData.php",
                    data:this.$qs.stringify({
                        setChartParam:true,
                        devSn: that.ActiveDevice.dev_sn,
                        chartAuto: that.ChartConf.unit.chartAutoVal? "1": "0",
                        chartMax: that.ChartConf.unit.chartMax,
                        chartInterval: that.ChartConf.unit.chartInterval
                    }),
                    Api:"setChartParam",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.getChartConfUnit();
                    }else{
                        that.getChartConfUnit();
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },

            getChartConfTotal(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/chartData.php",
                    data:this.$qs.stringify({
                        getChartShowContent:true,
                        devSn: that.ActiveDevice.dev_sn,
                        prefix: that.ActiveDevice.prefix
                    }),
                    Api:"getChartShowContent",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.ChartConf.total = (res.data[0]);
                    }else{
                        that.ChartConf.total = {dev_sn: "8000102140", down: "Total",id: "1",lossDev: "Total",lossRcv: "Total",up: "Total"};
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },
            setChartConfTotal(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/chartData.php",
                    data:this.$qs.stringify({
                        setChartShowContent:true,
                        devSn: that.ActiveDevice.dev_sn,
                        up: that.ChartConf.total.up,
                        down: that.ChartConf.total.down,
                        lossDev: that.ChartConf.total.lossDev,
                        lossRcv: that.ChartConf.total.lossRcv
                    }),
                    Api:"setChartShowContent",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.getChartConfTotal();
                    }else{
                        that.getChartConfTotal();
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },

            setCardChartStyle(type){
                this.ChartConf.card.id = type;
            },
            getChartConfCard(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/index/chartData.php",
                    data:this.$qs.stringify({
                        getCardChartShowContent:true,
                        devSn: that.ActiveDevice.dev_sn
                    }),
                    Api:"getCardChartShowContent",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.ChartConf.card = formatUnit(res.data[0]);
                    }else{
                        that.ChartConf.card = {dev_sn: "8000102140",eth0: "up,down,lossDev",eth0Val:["up","down","lossDev"],id: "1"};
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
                function formatUnit(item){
                    item.eth0Val = item.eth0.split(",");
                    item.sim1Val = item.sim1.split(",");
                    item.sim2Val = item.sim2.split(",");
                    item.sim3Val = item.sim3.split(",");
                    item.sim4Val = item.sim4.split(",");
                    item.sim5Val = item.sim5.split(",");
                    item.sim6Val = item.sim6.split(",");
                    item.wifiVal = item.wifi.split(",");
                    item.usb_5g1Val = item.usb_5g1.split(",");
                    item.usb_5g2Val = item.usb_5g2.split(",");
                    item.usb_lanVal = item.usb_lan.split(",");
                    item.usb_lan2Val = item.usb_lan2.split(",");
                    return item;
                }
            },
            setChartConfCard(){
                var that = this;
                var paramData = {
                    "eth0":that.ChartConf.card.eth0Val.join(","),
                    "wifi":that.ChartConf.card.eth0Val.join(","),
                    "sim1":that.ChartConf.card.eth0Val.join(","),
                    "sim2":that.ChartConf.card.eth0Val.join(","),
                    "sim3":that.ChartConf.card.eth0Val.join(","),
                    "sim4":that.ChartConf.card.eth0Val.join(","),
                    "sim5":that.ChartConf.card.eth0Val.join(","),
                    "sim6":that.ChartConf.card.eth0Val.join(","),
                    "usb-5g1":that.ChartConf.card.eth0Val.join(","),
                    "usb-5g2":that.ChartConf.card.eth0Val.join(","),
                    "usb-lan":that.ChartConf.card.eth0Val.join(","),
                    "usb-lan2":that.ChartConf.card.eth0Val.join(","),
                    "id":that.ChartConf.card.id
                };
                this.$axios({
                    method: 'post',
                    url:"/page/index/chartData.php",
                    data:this.$qs.stringify({
                        setCardChartShowContent:true,
                        devSn: that.ActiveDevice.dev_sn,
                        data: paramData
                    }),
                    Api:"setCardChartShowContent",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.getChartConfCard();
                    }else{
                        that.getChartConfCard();
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },

            logout(){
                clearInterval(this.DeviceTimer);
                clearInterval(this.ChartTimer);
                this.SET_TIMER_CLEAR();
                var that = this;
                this.$toast({
                    message: '操作成功'
                });
                setTimeout(function(){
                    that.SET_USER(null);
                    that.SET_NAV_STATUS(true);
                    that.SET_ACTIVE_DEVICE(null);
                    that.$router.replace("/login");
                    localStorage.removeItem('LOGIN');
                }, 1000);
            }
        }
    }
</script>

<style scoped>
    .me{
        /*background-color: #272D33;*/
        height: 100%;
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
    .logout{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .GroupItem{
        padding: .05rem .2rem;
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
        font-size: .12rem;
        color: #000000;
    }
    .GroupItemValue{
        width: 75%;
        float: left;
        text-align: left;
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
    .lan,.wan{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        font-size: .12rem;
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
    .GroupItemBtns{
        text-align: right;
    }
    .setBtn{
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        font-size: .12rem;
        border-radius: 5px;
        padding: 0 .1rem;
    }
    .mint-navbar .mint-tab-item{
        padding: .05rem 0;
    }
    .mint-navbar{
        margin-bottom: .1rem;
    }
    .mint-checklist-title{display: none;}
    .mint-checklist>>>.mint-cell-wrapper{padding-left: 0;}
    .mint-checklist>>>.mint-cell{min-height: .3rem;}
    .mint-cell:last-child{background-image: none;}
</style>
<style>
    .me .mint-cell-wrapper{background-image: none;}
    .me .mint-cell:last-child{background-image: none;}
    .me .mint-checkbox-label{font-size: .12rem;}
</style>