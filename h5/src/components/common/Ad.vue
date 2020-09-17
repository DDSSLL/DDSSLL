<template>
    <div>
        <span class="skip" @click="passAd">{{ secInt }}</span>
    </div>
</template>

<script>
    export default {
        name: "Ad",
        data(){
            return {
                hideTabbar: true,
                secInt: 5,
                countdown: null,
                counting: true,
                timer: null
            }
        },
        mounted(){
            this.$emit('hideTabbarFn',this.hideTabbar);
            this.showAds();
        },
        methods: {
            showAds() {
                const that = this;
                let sec = 6000;
                that.countdown = function() {
                    if(sec < 0){
                        that.skipAd();
                    }else{
                        sec -= 500;
                        that.secInt = parseInt(sec/1000);
                        if(that.counting){
                            that.timer = setTimeout(that.countdown,500);
                        }
                    }
                }
                that.countdown();
            },
            skipAd() {
                clearTimeout(this.timer);
                this.counting = false;
                this.hideTabbar = false;
                this.$emit('hideTabbarFn',false);
                this.$router.push('/main')
            },
            passAd(){
                this.$emit('hideTabbarFn',false);
            }
        }
    }
</script>

<style scoped>
    .skip{
        position: fixed;
        top: .15rem;
        right: .15rem;
        width: .6rem;
        height: .25rem;
        font-size: .11rem;
        line-height: .25rem;
        background-color: #555666;
        border-radius: .05rem;
        color:#FFFFFF;
        z-index: 99;
    }
</style>