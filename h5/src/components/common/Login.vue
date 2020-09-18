<template>
    <div>
        <mt-header fixed v-bind:title="title">
            <!--<mt-button slot="left" @click.native="back"> < </mt-button>-->
        </mt-header>
        <div id="body">
            <mt-cell title="User">
                <input type="text" v-model="user.login_name">
            </mt-cell>
            <mt-cell title="Password">
                <input type="password" v-model="user.password">
            </mt-cell>
            <mt-button type="primary" size="large" plain="plain" @click.native="login">{{ $t( 'basic.login' ) }}</mt-button>
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

</style>