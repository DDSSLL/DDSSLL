<template>
    <div v-if="AdShow" class="adClass">
        <span class="skip" @click="passAd">{{ secInt }}</span>
    </div>
</template>

<script>
export default {
  name: "Ad",
  data(){
    return {
      hideTabbar: true,
      secInt: 0,
      countdown: null,
      counting: true,
      timer: null,  
      AdShow:true//加广告时改成默认显示
    }
  },
  mounted(){
    this.$emit('hideTabbarFn',this.hideTabbar);
    this.showAds();
  },
  methods: {
    showAds() {
      const that = this;
      let sec = -1;
      that.countdown = function() {
        if(sec < 0){
          that.skipAd();
          that.AdShow = false;
        }else{
          sec -= 500;
          that.secInt = parseInt(sec/1000)+1;
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
      this.$router.push('/Login')
    },
    passAd(){
      this.$emit('hideTabbarFn',false);
    }
  }
}
</script>

<style scoped>
  .adClass{
    background-color:#000;
    width:100%;
    height:100%;
  }
  .skip{
    position: fixed;
    top: .15rem;
    right: .15rem;
    width: .25rem;
    height: .25rem;
    font-size: .11rem;
    line-height: .25rem;
    /*background-color: #555666;*/
    border-radius: .05rem;
    color:#FFFFFF;
    z-index: 99;
  }
</style>