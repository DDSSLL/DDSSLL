<template>
    <div class="page">
        <!--<mt-header fixed v-bind:title="title">-->
            <!--<mt-button slot="left" @click.native="back"> < </mt-button>-->
        <!--</mt-header>-->
        <div id="body">
            <mt-cell title="用户名">
                <input type="text" v-model="user.login_name">
            </mt-cell>
            <mt-cell title="密码">
                <input type="password" v-model="user.password">
            </mt-cell>
            <mt-button size="large" plain="plain" @click.native="login">{{ $t( 'basic.login' ) }}</mt-button>
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
        background-color: #2c3e50;
        color: #6FAAA3;
        padding-top: 2rem;
        padding-left: .2rem;
        padding-right: .2rem;
    }
    .mint-cell{
        background-color: #212227;
        color: #6FAAA3;
    }
    .mint-button{
        margin-top: .3rem;
        color: #6FAAA3;
    }
</style>