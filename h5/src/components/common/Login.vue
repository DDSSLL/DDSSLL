<template>
    <div class="page">
        <!--<mt-header fixed v-bind:title="title">-->
            <!--<mt-button slot="left" @click.native="back"> < </mt-button>-->
        <!--</mt-header>-->
        <div id="body">
            <h1 class="title">UHDXpress</h1>
            <div class="form-item">
                <input type="text" class="loginIpt" v-model="user.login_name" placeholder="登录账号">
            </div>
            <div class="form-item">
                <input type="password" class="loginIpt" v-model="user.password" placeholder="登录密码">
            </div>

            <mt-button class="loginBtn" size="large" @click.native="login">{{ $t( 'basic.login' ) }}</mt-button>
            <div class="loginGroup">
                <mt-button class="deviceLogin">设备1</mt-button>
                <mt-button class="deviceLogin">设备2</mt-button>
            </div>
            <div class="loginBottom">
                <div class="copyright">
                    <span>版权所有：</span>
                    <span>天津德力仪器设备有限公司 本网站所有下载资料仅供参考  </span>
                </div>
                <div class="address">
                    <span>地址：</span>
                    <span>天津市西青区高新技术产业园区 (外环) 海泰创新三路8号 </span>
                    <span><a style="color: #5AB1A7;" href="https://beian.miit.gov.cn" target="_blank">津ICP备16000820号</a></span>
                </div>
                <div class="tel">
                    <span>总机：022-27645003</span>
                    <span>传真：022-27645002</span>
                    <span>E-mail：market@deviser.com.cn</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { SET_USER,SET_NAV_STATUS } from '../../store/mutation-types';
    export default {
        name: "Login",
        data(){
            return {
                title : this.$t( 'basic.login' ),
                user:{
                    login_name:'',
                    password:'',
                    loginStatus:false
                }
            }
        },
        computed: {
            ...mapState(['navHide'])
        },
        methods:{
            ...mapMutations({
                SET_USER,
                SET_NAV_STATUS
            }),

            back(){
                this.$router.go(-1)
            },
            // login(){
            //     var that = this;
            //     this.$axios({
            //         method: 'post',
            //         url:this.$Config.SERVER + this.$Config.LOGIN,
            //         data:this.$qs.stringify({
            //             login_name: that.user.login_name,
            //             password: that.$md5(that.user.password)
            //         })
            //     })
            //         .then(function (response) {
            //             let res = response.data;
            //             if(res.header.opCode && res.body.data === 'auth success'){
            //                 that.$toast({
            //                     message: that.$t( 'tip.authSuccess' ),
            //                     position: 'middle',
            //                     duration: 2000
            //                 })
            //                 that.$root.loginStatus = 1;
            //                 that.$Storage.saveStorage('login',{
            //                     status:1,
            //                     login_name:that.user.login_name,
            //                     password:that.$md5(that.user.password)
            //                 });
            //                 that.getProfile();
            //                 setTimeout(function(){
            //                     that.$router.push( '/me' );
            //                 },2000)
            //             }else if(res.body.data === 'password error'){
            //                 that.$toast({
            //                     message: that.$t( 'tip.passwordError' ),
            //                     position: 'middle',
            //                     duration: 3000
            //                 })
            //             }else if(res.body.data === 'need register'){
            //                 that.$toast({
            //                     message: that.$t( 'tip.needRegister' ),
            //                     position: 'middle',
            //                     duration: 3000
            //                 })
            //             }
            //         })
            //         .catch(function (error) {
            //             console.log(error)
            //             that.$toast({
            //                 message: that.$t( 'tip.serverError' ),
            //                 position: 'middle',
            //                 duration: 3000
            //             })
            //         })
            // },
            login(){
                var that = this;
                this.user.loginStatus = true;
                this.$toast({
                    message: this.$t( 'tip.authSuccess' ),
                    position: 'middle',
                    duration: 600
                })
                setTimeout(function(){
                    that.$router.push("/main");
                    that.SET_NAV_STATUS(false);
                    that.SET_USER(that.user);
                },2000)
            }
        }
    }
</script>

<style scoped>
    .page{
        height: 100%;
        overflow: hidden;
    }
    #body{
        height: 100%;
        box-sizing: border-box;
        background-color: #212227;
        color: #FFFFFF;
        padding-top: 1.8rem;
        padding-left: .3rem;
        padding-right: .3rem;
    }
    .title{
        font-size: .36rem;
        text-align: center;
        font-weight: 500;
        color: #FFFFFF;
        font-family: inherit;
        margin-bottom: .4rem;
    }
    .form-item{
        margin-bottom: 5px;
    }
    .loginIpt{
        background: #2B2E33;
        border: .1em solid #4B5056;
        color: #fff;
        text-indent: 10px;
        padding-left: 0;
        padding-right: 0;
        display: block;
        width: 100%;
        height: .34rem;
        line-height: .34rem;
        font-size: .15rem;
    }
    .loginBtn{
        background-color: #484D57;
        color: #FFFFFF;
        box-shadow: none;
        margin-top: .3rem;
    }
    .loginBottom{
        position: absolute;
        bottom: 10px;
        width: 100%;
        left: .1rem;
        font-size: .13rem;
        font-weight: 500;
    }
    .loginBottom span{
        display: block;
        line-height: .16rem;
    }
    .loginGroup{
        margin-top: .16rem;
        display: flex;
        justify-content: space-between;
    }
    .deviceLogin{
        background-color: #484D57;
        color: #FFFFFF;
        box-shadow: none;
        font-size: .14rem;
        width: 45%;
        height: .3rem;
    }
</style>