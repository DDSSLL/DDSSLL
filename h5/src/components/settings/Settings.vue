<template>
    <div class="page">
        <Device></Device>
        <div class="Group" style="margin-top: 60px;">
            <div class="GroupTitle">本机网络</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">DHCP</div>
                    <div class="GroupItemValue">
                        <mt-switch v-model="local.DHCP"></mt-switch>
                    </div>
                </div>
                <div class="GroupItemField">
                    <div class="GroupItemTitle">公网IP</div>
                    <div class="GroupItemValue">
                        <input type="text" class="ItemIpt" v-model="local.publicIP">
                    </div>
                </div>
                <div class="GroupItemField">
                    <div class="GroupItemTitle">内网IP</div>
                    <div class="GroupItemValue">
                        <input type="text" class="ItemIpt" v-model="local.innerIP">
                    </div>
                </div>
                <div class="GroupItemField">
                    <div class="GroupItemTitle">子网掩码</div>
                    <div class="GroupItemValue">
                        <input type="text" class="ItemIpt" v-model="local.mask">
                    </div>
                </div>
                <div class="GroupItemField">
                    <div class="GroupItemTitle">默认网关</div>
                    <div class="GroupItemValue">
                        <input type="text" class="ItemIpt" v-model="local.gate">
                    </div>
                </div>
                <div class="GroupItemField">
                    <div class="GroupItemTitle">DNS</div>
                    <div class="GroupItemValue">
                        <input type="text" class="ItemIpt" v-model="local.dns">
                    </div>
                </div>
            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">服务器网络</div>
            <div class="GroupItem">
                <div class="GroupItemField">
                    <div class="GroupItemTitle">服务器IP</div>
                    <div class="GroupItemValue">
                        <input type="text" class="ItemIpt" v-model="server.ip">
                    </div>
                </div>
                <div class="GroupItemField">
                    <div class="GroupItemTitle">服务器端口</div>
                    <div class="GroupItemValue">
                        <input type="text" class="ItemIpt" v-model="server.port">
                    </div>
                </div>
            </div>
        </div>
        <div class="Group">
            <div class="GroupTitle">板卡信息</div>
            <p class="tips">
                端口有效范围: 1024-65535,不同板卡端口设置应避免重合,否则会有冲突
            </p>
            <div class="GroupItem">
                <template v-for="(item,i) in card">
                    <div class="GroupItemField">
                        <div class="GroupItemTitle">{{ item.name }}</div>
                        <div class="GroupItemValue">
                            <p>TCP端口  <input type="text" class="ItemIpt" style="width: 60%;margin-left: 2px;" v-model="server.port"></p>
                            <p>UDP端口  <input type="text" class="ItemIpt" style="width: 25%" v-model="server.port"> -- <input type="text" class="ItemIpt" style="width: 25%" v-model="server.port"></p>
                        </div>
                    </div>
                </template>
            </div>
            <div class="GroupBtns">
                <mt-button type="default" size="small" @click.native="refresh">刷新</mt-button>
                <mt-button type="default" size="small" @click.native="save">保存</mt-button>
                <mt-button type="primary" size="small" @click.native="apply">立即生效</mt-button>
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
                title:"设置",
                local:{
                    DHCP:true,
                    publicIP:"111.30.35.146",
                    innerIP:"192.168.100.140",
                    mask:"255.255.255.0",
                    gate:"192.168.100.140",
                    dns:""
                },
                server:{
                    ip:"192.168.100.140",
                    port:"8188"
                },
                card:[
                    {
                        name:"板卡1",
                        tcpPort:"20000",
                        udpPort_s:"10000",
                        udpPort_e:"20000"
                    },
                    {
                        name:"板卡2",
                        tcpPort:"20000",
                        udpPort_s:"10000",
                        udpPort_e:"20000"
                    },
                    {
                        name:"板卡3",
                        tcpPort:"20000",
                        udpPort_s:"10000",
                        udpPort_e:"20000"
                    },
                    {
                        name:"板卡4",
                        tcpPort:"20000",
                        udpPort_s:"10000",
                        udpPort_e:"20000"
                    }
                ]
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

            refresh(){},

            save(){},

            apply(){}
        }
    }
</script>

<style scoped>
    .page{
        height: 92%;
        overflow-y: auto;
    }
    .Group{
        margin-top: 0px;
    }
    .GroupTitle{
        border: 1px solid #BBBBBB;
        color: #000;
        text-align: left;
        text-indent: .1rem;
        padding: .1rem .08rem;
        background-color: #EEEEEE;
        border-radius: 5px;
        font-size: .16rem;
    }
    .GroupItem{
        padding: .1rem .2rem;
    }
    .GroupItemTitle{
        width: 25%;
        float: left;
        line-height: .3rem;
        text-align: left;
        font-size: .16rem;
    }
    .GroupItemValue{
        width: 75%;
        float: left;
        text-align: left;
    }
    .ItemIpt{
        width: 85%;
        height: .28rem;
        line-height: .28rem;
        outline: none;
        border:1px solid #b8bbbf;
        border-radius: 5px;
        font-size: .16rem;
    }
    .GroupItemField{
        overflow: hidden;
        margin-bottom: .1rem;
    }
    .tips{
        color: #707274;
        font-size: .14rem;
        padding: .05rem .18rem;
        text-align: left;
    }
    .GroupBtns{
        margin-bottom: .1rem;
        text-align: center;
    }
    .GroupBtns .mint-button{
        margin: 0 .2rem;
    }
    .GroupBtns .mint-button--default{
        color: #000000;
    }

    .mint-switch-core{
        z-index: 1;
    }
</style>