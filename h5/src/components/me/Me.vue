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
            <div class="GroupTitle">系统</div>
            <div class="GroupItem">
                <mt-button size="large" type="primary" @click="logout">登出</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { SET_USER,SET_NAV_STATUS,SET_ACTIVE_DEVICE } from '../../store/mutation-types';
    export default {
        name: "Me",
        data(){
            return{

            }
        },
        computed: {
            ...mapState(['navHide'])
        },
        methods:{
            ...mapMutations({
                SET_USER,
                SET_NAV_STATUS,
                SET_ACTIVE_DEVICE
            }),

            logout(){
                var that = this;
                this.$toast({
                    message: '操作成功',
                    iconClass: 'icon icon-success'
                });
                setTimeout(() => {
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
        background-color: #272D33;
        height: 100%;
    }
    .Group{
        margin-top: 0px;
    }
    .GroupTitle{
        border: 1px solid #272D33;
        text-align: left;
        text-indent: .1rem;
        padding: .1rem .08rem;
        background-color: #212227;
        border-radius: 5px;
        font-size: .16rem;
        color: #59B1A5;
    }
    .GroupItem{
        padding: .1rem .2rem;
    }
</style>