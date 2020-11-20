<template>
    <div class="me">
        <div class="Group">
            <div class="GroupTitle" @click="DeviceShow=!DeviceShow">
                背包信息
                <i class="titleIcon fa" :class="[DeviceShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
                <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addDevice"></i>
            </div>
            <transition name="slide-fade">
                <div class="GroupItem" v-show="DeviceShow">
                    <template v-for="(item,i) in deviceList" :key="item.id">
                        <mt-cell-swipe
                                :right="[
                                {content: '网卡',style: { background: 'rgb(43,162,69)', color: '#fff' },handler:() => showDeviceCard(item)},
                                {content: '编辑',style: { background: 'lightblue', color: '#fff' },handler:() => editDevice(item)},
                                {content: '删除',style: { background: 'red', color: '#fff' },handler:() => deleteDevice(item)},
                                ]">
                            <div class="cellItem">
                                <span class="cellName" style="font-weight: 600;">{{ item.dev_name }}</span>
                                <span class="cellNameR">{{ item.dev_sn }}</span>
                            </div>
                            <div class="cellItem">
                                <span class="cellName" style="width: 40%;">{{ item.dev_model }}</span>
                                <span class="cellNameR" style="width: 30%;">{{ item.hardVer }}</span>
                                <span class="cellNameR" style="width: 30%;text-align: center;">{{ item.softVer.split('-')[0] }}</span>
                            </div>
                            <div class="cellItem">
                                <p class="cellCard">{{ item.datetime }}</p>
                            </div>
                            <div class="cellItem">
                                <p class="cellCard">{{ item.match_board }}</p>
                            </div>
                            <div class="cellItem">
                                <p class="cellAddr">{{ item.addr }}</p>
                            </div>
                        </mt-cell-swipe>
                    </template>
                </div>
            </transition>
        </div>
        <div class="Group" @click="ReceiverShow=!ReceiverShow">
            <div class="GroupTitle">
                接收机信息
                <i class="titleIcon fa" :class="[ReceiverShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
            </div>
            <transition name="slide-fade">
                <div class="GroupItem" v-show="ReceiverShow">

                </div>
            </transition>
        </div>
        <div class="Group" @click="AccountShow=!AccountShow">
            <div class="GroupTitle">
                账号信息
                <i class="titleIcon fa" :class="[AccountShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
            </div>
            <transition name="slide-fade">
                <div class="GroupItem" v-show="AccountShow">

                </div>
            </transition>
        </div>
        <!-- <div class="Group">
            <div class="GroupTitle">权限信息</div>
            <div class="GroupItem">

            </div>
        </div> -->
        <div class="Group">
          <div class="GroupTitle" @click="ChartConfShow=!ChartConfShow">
              图表配置
              <i class="titleIcon fa" :class="[ChartConfShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
          </div>
            <transition name="slide-fade">
                <div class="GroupItem" v-show="ChartConfShow">
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
                                        <mt-switch v-model="ChartConf.unit.chartAutoVal"></mt-switch>
                                    </div>
                                </div>
                            </div>
                            <div class="GroupItem" v-show="!ChartConf.unit.chartAutoVal">
                                <div class="GroupItemField">
                                    <div class="GroupItemTitle">速率最大值</div>
                                    <div class="GroupItemValue">
                                        <input type="text" class="" v-model.number="ChartConf.unit.chartMax">
                                    </div>
                                </div>
                            </div>
                            <div class="GroupItem" v-show="!ChartConf.unit.chartAutoVal">
                                <div class="GroupItemField">
                                    <div class="GroupItemTitle">Mbps/每格</div>
                                    <div class="GroupItemValue">
                                        <input type="text" class="" v-model.number="ChartConf.unit.chartInterval">
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
            </transition>
        </div>
        <div class="Group">
            <div class="GroupTitle" @click="SystemShow=!SystemShow">
                系统
                <i class="titleIcon fa" :class="[SystemShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
            </div>
            <transition name="slide-fade">
                <div class="GroupItem" v-show="SystemShow">
                    <mt-button size="large" class="logout" @click="logout">登出</mt-button>
                </div>
            </transition>
        </div>
        <mt-popup
                v-model="deviceCardVisible"
                popup-transition="popup-fade">
            <div class="deviceCardContainer">
                <div class="deviceCardTitle">
                    网卡信息
                    <i class="popupCloseBtn fa fa-times" @click="deviceCardVisible = false"></i>
                </div>
                <template v-for="(item,i) in deviceCardList" :key="i">
                    <div class="deviceCardItem">
                        <mt-cell title="网卡" :value="item.card_name"></mt-cell>
                        <mt-cell title="状态" :value="item.online == '1'?'在线':'离线'"></mt-cell>
                        <mt-cell title="IP" :value="item.card_ip"></mt-cell>
                        <mt-cell title="MAC" :value="item.card_mac"></mt-cell>
                    </div>
                </template>
            </div>
        </mt-popup>
        <mt-popup
                v-model="deviceConfigVisible"
                popup-transition="popup-fade">
            <div class="deviceCardContainer">
                <div class="deviceCardTitle">
                    背包配置
                    <i class="popupCloseBtn fa fa-times" @click="deviceConfigVisible = false"></i>
                </div>
                <form action="" @submit.prevent="submitDeviceConfig">
                <div class="deviceConfItem">
                    <div class="deviceConfItemTitle">背包名称</div>
                    <div class="deviceConfItemValue">
                        <input type="text" class="ItemInput" v-model="deviceConfigForm.devName" required pattern="[A-z0-9+-@()]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,(),空格">
                        <p style="font-size: 12px;color: #666;text-align: left;">仪器名(长度1-15,仅支持中文,字母,数字,+,-,@,()和空格)</p>
                    </div>
                </div>
                <div class="deviceConfItem">
                    <div class="deviceConfItemTitle">序列号</div>
                    <div class="deviceConfItemValue">
                        <input type="text" class="ItemInput" v-model="deviceConfigForm.editDev" required>
                    </div>
                </div>
                <div class="deviceConfItem">
                    <div class="deviceConfItemTitle">用户</div>
                    <div class="deviceConfItemValue">
                        <select class="ItemSelect" v-model="deviceConfigForm.devUser">
                            <template v-for="(item,i) in deviceConfigUserOptions" :key="i">
                                <option :value="item.value">{{ item.label }}</option>
                            </template>
                        </select>
                    </div>
                </div>
                <div class="deviceConfItem" v-if="deviceConfigType == 'edit'">
                    <div class="deviceConfItemTitle">汇聚服务器</div>
                    <div class="deviceConfItemValue">
                        <select class="ItemSelect" v-model="deviceConfigForm.server" style="margin-bottom: 5px;">
                            <template v-for="(item,i) in deviceConfigServerOptions" :key="i">
                                <option :value="item.value">{{ item.label }}</option>
                            </template>
                        </select>
                        <button>保存绑定</button>
                        <button>解除绑定</button>
                    </div>
                </div>
                <div class="deviceConfItem" style="text-align: right">
                    <button @click="deviceConfigVisible = false" style="margin-right: .06rem;">取消</button>
                    <button type="submit">确定</button>
                </div>
                </form>
            </div>
        </mt-popup>
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
                },
                ChartConfShow:true,
                DeviceShow:true,
                ReceiverShow:true,
                AccountShow:true,
                SystemShow:true,
                deviceList:[

                ],
                deviceCardVisible:false,
                deviceCardList:[
                    {
                        "id": "715",
                        "card_id": "lte3",
                        "card_name": "LTE3",
                        "card_mac": "02:0C:29:A3:9B:6D",
                        "card_ip": "192.168.45.100",
                        "used": "1",
                        "online": "1",
                        "rssi": "-51dBm",
                        "operator": "CHN-UNICOM",
                        "sim_mode": "LTE",
                        "module_type": "EC200T"
                    },
                    {
                        "id": "711",
                        "card_id": "eth0",
                        "card_name": "ETH0",
                        "card_mac": "94:F7:20:04:7D:1B",
                        "card_ip": "192.168.1.1",
                        "used": "1",
                        "online": "0",
                        "rssi": "",
                        "operator": "",
                        "sim_mode": "",
                        "module_type": ""
                    },
                ],
                deviceConfigVisible:false,
                deviceConfigType:'add',
                deviceConfigForm:{
                    devName:"",
                    editDev:"",
                    devUser:"1080test",
                    server:"1"
                },
                deviceConfigUserOptions:[{label:'1080test',value:'1080test'}],
                deviceConfigServerOptions:[{label:'dv1080-Vir',value:'1'}]
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
                    this.getDeviceList();
                }
            }
        },
        activated(){  //生命周期-缓存页面激活
            this.getChartConfUnit();
            this.getChartConfTotal();
            this.getChartConfCard();
            this.getDeviceList();
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
                        devSN: that.ActiveDevice.dev_sn
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
                        devSN: that.ActiveDevice.dev_sn,
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
                      that.$toast({
                        message: "操作成功",
                        position: 'middle',
                        duration: 2000
                      });
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

            getDeviceList(){
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/dev/devData.php",
                    data:this.$qs.stringify({
                        getDevices:true,
                        userId: that.user.id
                    }),
                    Api:"getDevices",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.deviceList = res.data;
                    }else{
                        that.deviceList = [];
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },
            showDeviceCard(item){
                this.deviceCardList = [];
                this.deviceCardVisible = true;
                var that = this;
                this.$axios({
                    method: 'post',
                    url:"/page/dev/devData.php",
                    data:this.$qs.stringify({
                        getCardByDevSn:true,
                        devSn: item.dev_sn
                    }),
                    Api:"getCardByDevSn",
                    AppId:"android",
                    UserId:that.user.id
                })
                .then(function (response) {
                    let res = response.data;
                    if(res.res.success){
                        that.deviceCardList = res.data;
                    }else{
                        that.deviceCardList = [];
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
            },
            deleteDevice(item){
                var that = this;
                this.$messagebox.confirm("确定删除此背包?").then(action => {
                    this.$axios({
                        method: 'post',
                        url:"/page/dev/devData.php",
                        data:this.$qs.stringify({
                            delDev:true,
                            delDevSns:item.dev_sn,
                            userId:that.user.id
                        }),
                        Api:"delDev",
                        AppId:"android",
                        UserId:that.user.id
                    })
                    .then(function (response) {
                        let res = response.data;
                        if(res.res.success){
                            that.$toast({
                                message: '操作成功'
                            });
                            that.getDeviceList();
                        }else{
                            that.$toast({
                                message: '操作失败'
                            });
                            that.getDeviceList();
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                });
            },
            editDevice(item){
                console.log(item)
                this.deviceConfigVisible = true;
                this.deviceConfigType = "edit";
                this.deviceConfigForm = {
                    devName:item.dev_name,
                    editDev:item.dev_sn,
                    devUser:item.prefix,
                    server:"1"
                }
            },
            addDevice(){
                this.deviceConfigVisible = true;
                this.deviceConfigType = "add";
                this.deviceConfigForm = {
                    devName:"",
                    editDev:"",
                    devUser:"",
                    server:"1"
                }
            },
            submitDeviceConfig(){
                console.log(this.deviceConfigType)
                console.log(this.deviceConfigForm)
                if(this.deviceConfigType == "add"){
                    var that = this;
                    this.$axios({
                        method: 'post',
                        url:"/page/dev/devData.php",
                        data:this.$qs.stringify({
                            addDev:true,
                            devName:that.deviceConfigForm.devName,
                            devSn:that.deviceConfigForm.editDev,
                            devModel:"DV1080"
                        }),
                        Api:"addDev",
                        AppId:"android",
                        UserId:that.user.id
                    })
                    .then(function (response) {
                        let res = response.data;
                        if(res.res.success){
                            that.getDeviceList();
                        }else{
                            that.getDeviceList();
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                }else if(this.deviceConfigType == "edit"){
                    var that = this;
                    this.$axios({
                        method: 'post',
                        url:"/page/dev/devData.php",
                        data:this.$qs.stringify({
                            editDev:true,
                            devName:that.deviceConfigForm.devName,
                            devSn:that.deviceConfigForm.editDev,
                            devUser:that.deviceConfigForm.devUser
                        }),
                        Api:"editDev",
                        AppId:"android",
                        UserId:that.user.id
                    })
                    .then(function (response) {
                        let res = response.data;
                        if(res.res.success){
                            that.getDeviceList();
                        }else{
                            that.getDeviceList();
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                }
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
        width: 35%;
        float: left;
        line-height: .3rem;
        text-align: left;
        font-size: .12rem;
        color: #000000;
    }
    .GroupItemValue{
        width: 65%;
        float: left;
        text-align: left;
    }
    .ItemInput{
        width: 1.75rem;
        height: .22rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
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
    .mint-switch{
        margin-left: -.34rem;
    }

    .titleIcon{
        width: .2rem;
        height: .2rem;
        display: inline-block;
        color:#000;
        vertical-align: text-top;
        margin-top: 2px;
    }
    .cellItem{overflow:hidden}
    .cellItem .cellName{float: left;text-align: left;}
    .cellItem .cellNameR{float: right;text-align: right;}
    .cellItem .cellAddr{color:#888;font-size:13px;}
    .cellItem .cellCard{color:#444}
    .slide-fade-enter-active {transition: all 1s ease;}
    .slide-fade-leave-active {transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-to{transform: translateY(5px);opacity: 0;}

    .addBtn{
        float: right;
        width: .3rem;
        text-align: center;
    }
    .deviceCardTitle{
        padding: .1rem;
        font-size: .14rem;
        background-color: #DDDEEE;
    }
    .popupCloseBtn{
        float: right;
        width: .24rem;
        height: .24rem;
        color: #B00;
        font-size: .16rem;
        margin-top: -2px;
    }
    .deviceCardItem{border-bottom: 2px solid #AAA;}
    .deviceCardItem:last-child{border-bottom: 0;}

    .deviceConfItem{overflow: hidden;padding: .1rem;}
    .deviceConfItemTitle{width: 35%;float: left;  text-align: left;}
    .deviceConfItemValue{width: 65%;float: left; text-align: right}
    .deviceConfItem button{padding: .02rem .1rem;}
</style>
<style>
    .me .mint-cell-wrapper{background-image: none;}
    .me .mint-cell:last-child{background-image: none;}
    .me .mint-cell-swipe{border-bottom:1px solid #ddd;}
    .me .mint-cell-swipe:last-child{border-bottom: 0;}
    .me .mint-checkbox-label{font-size: .12rem;}
    .me .mint-cell-value{display: block;color: #000;padding: .1rem 0;width:100%;}
    .me .mint-cell-swipe-button{line-height: .9rem}
    .me .mint-popup{width: 90%;max-height: 90%;overflow-y: auto;}
    .me .deviceCardContainer .mint-cell-title{width:40%;text-align: left;}
    .me .deviceCardContainer .mint-cell-value{width:60%;text-align: right;padding:0;}
    .me .deviceCardContainer .mint-cell{min-height:24px;}
</style>