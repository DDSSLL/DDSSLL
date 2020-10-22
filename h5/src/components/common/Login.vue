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
                <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'DV4000' ? 'deviceLoginActive': '']" @click="ChoseDevice('DV4000')">DV4000</mt-button>
                <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'DV1080' ? 'deviceLoginActive': '']" @click="ChoseDevice('DV1080')">DV1080</mt-button>
                <mt-button class="deviceLogin" :class="[ActiveDeviceType == 'OTHER' ? 'deviceLoginActive': '']" @click="ChoseDevice('OTHER')">其他</mt-button>
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
                },
              ActiveDeviceType:'DV1080'
            }
        },
        computed: {
            ...mapState(['navHide'])
        },
        mounted(){
            if(localStorage.getItem("LOGIN")){
                this.user.login_name = localStorage.getItem("USERNAME");
                this.user.password = localStorage.getItem("PASSWORD");
                this.ActiveDeviceType = localStorage.getItem("DEVICE");
                this.login();
            }
        },
        methods:{
            ...mapMutations({
                SET_USER,
                SET_NAV_STATUS
            }),

            back(){
                this.$router.go(-1)
            },
            login(){
                var that = this;

                this.$axios({
                    method: 'post',
                    url:"/login/login.php",
                    data:{
                      loginId: that.user.login_name,
                      pwd: that.user.password,
                      curTime: that.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                    },
                    Api:"SetLogin",
                    AppId:"android",
                    UserId:that.user.login_name
                })
                    .then(function (response) {
                        let res = response.data;
                        if(res.res.success){
                            that.$toast({
                                message: "登录成功",
                                position: 'middle',
                                duration: 2000
                            });
                            setTimeout(function(){
                                that.$router.push("/status");
                                that.SET_NAV_STATUS(false);
                                that.SET_USER(res.res.data);
                                localStorage.setItem("LOGIN",true);
                                localStorage.setItem("USERNAME",that.user.login_name);
                                localStorage.setItem("PASSWORD",that.user.password);
                                localStorage.setItem("DEVICE",that.ActiveDeviceType);
                            },800)
                        }else{
                            that.$toast({
                                message: "登录失败",
                                position: 'middle',
                                duration: 3000
                            })
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                        that.$toast({
                            message: "登录失败",
                            position: 'middle',
                            duration: 3000
                        })
                    })

                /*生成随机数*/
                function generateMixed(n) {
                  var chars = ["0","1","2","3","4","5","6","7","8","9",
                    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
                    "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
                  var res = "";
                  for (var i = 0; i < n; i++) {
                    var id = Math.ceil(Math.random() * 61);
                    res += chars[id];
                  }
                  return res;
                }
            },

            ChoseDevice(val){
                this.ActiveDeviceType = val;
            }
            // login(){
            //     var that = this;
            //     this.user.loginStatus = true;
            //     this.$toast({
            //         message: this.$t( 'tip.authSuccess' ),
            //         position: 'middle',
            //         duration: 600
            //     });
            //     setTimeout(function(){
            //         that.$router.push("/status");
            //         that.SET_NAV_STATUS(false);
            //         that.SET_USER(that.user);
            //         localStorage.setItem("LOGIN",true);
            //     },2000)
            // }
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
        width: 30%;
        height: .3rem;
    }
    .deviceLoginActive{
      background-color: rgb(90, 177, 167);
    }
</style>