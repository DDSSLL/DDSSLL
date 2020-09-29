<template>
    <div class="me">
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
    import { SET_USER,SET_NAV_STATUS } from '../../store/mutation-types';
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
                SET_NAV_STATUS
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
                    that.$router.replace("/login");
                    localStorage.removeItem('LOGIN');
                }, 1000);
            }
        }
    }
</script>

<style scoped>
    .me{

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
</style>