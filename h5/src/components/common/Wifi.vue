<template>
    <div class="wifi">
        <mt-header title="连接本机Wifi">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="setForm">
            <div class="form-item">
                <input type="text" autocomplete="false" class="loginIpt" v-model="wifiUrl" placeholder="Wifi地址">
            </div>
            <div class="form-item" style="overflow: hidden;">
                <mt-button class="loginBtn" size="large" @click.native="setWifi">设置</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Wifi",
        data(){
            return {
                wifiUrl:""
            }
        },
        mounted(){

        },
        methods: {
            goBack(){
                this.$router.back(-1);
            },
            setWifi(){

            }
        }
    }
</script>

<style scoped>
    .wifi{
        height: 100%;
        background-color: #212227;
    }
    .mint-header{
        background-color: #212227;
        font-size: .16rem;
        height: .6rem;
        font-weight: 600;
    }
    .mint-header .mintui{
        font-size: 20px;
    }
    .setForm{
        padding-top: 2rem;
        padding-left: .3rem;
        padding-right: .3rem;
    }
    .form-item{
        margin-bottom: 5px;
    }
    .loginIpt{
        padding-left: 0;
        padding-right: 0;
        display: block;
        width: 100%;
        height: .34rem;
        line-height: .34rem;
        font-size: .15rem;
    }
    .loginBtn{
        background-color: #3d81f1;
        color: #FFFFFF;
        box-shadow: none;
        margin-top: .1rem;
    }
</style>