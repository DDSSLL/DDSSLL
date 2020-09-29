<template>
  <div class="main">
    <!--<mt-header fixed>-->
      <!--<mt-button slot="left">UHDXpress</mt-button>-->
      <!--<mt-button slot="right">实时监测</mt-button>-->
    <!--</mt-header>-->
    <Device></Device>
    <div class="chartArea">
      <div class="mainChart">
        <div class="chartTitle">概览</div>
        <div id="mainChart" class="chart"></div>
      </div>
      <div class="lteChart">
        <div class="chartTitle">LTE1</div>
        <div id="lteChart1" class="chart"></div>
      </div>
      <div class="lteChart">
        <div class="chartTitle">LTE2</div>
        <div id="lteChart2" class="chart"></div>
      </div>
      <div class="lteChart">
        <div class="chartTitle">LTE3</div>
        <div id="lteChart3" class="chart"></div>
      </div>
      <div class="lteChart">
        <div class="chartTitle">LTE4</div>
        <div id="lteChart4" class="chart"></div>
      </div>
      <div class="lteChart">
        <div class="chartTitle">LTE5</div>
        <div id="lteChart5" class="chart"></div>
      </div>
      <div class="lteChart">
        <div class="chartTitle">LTE6</div>
        <div id="lteChart6" class="chart"></div>
      </div>
    </div>
    <!--<mt-palette-button content="+" @expanded="main_log('expanded')" @collapse="main_log('collapse')"-->
                       <!--direction="lt" class="pb" :radius="80" ref="target_1" mainButtonStyle="color:#fff;background-color:#26a2ff;"-->
                       <!--style="position: fixed;right: 20px;bottom: 100px;">-->
      <!--<div class="my-icon-button indexicon icon-popup" @touchstart="sub_log(1)"></div>-->
      <!--<div class="my-icon-button indexicon icon-popup" @touchstart="sub_log(2)"></div>-->
      <!--<div class="my-icon-button indexicon icon-popup" @touchstart="sub_log(3)"></div>-->
    <!--</mt-palette-button>-->
  </div>
</template>

<script>
import Device from '../basic/Device';
export default {
    name: 'Status',
    data(){
        return{

        }
    },
    components: {
        Device
    },
    watch:{   //监听当前设备值变化
        '$store.state.ActiveDevice': {
            immediate: true,
            handler(val) {
                console.warn(val)
            }
        }
    },
    methods:{
        testMint(){
            this.$toast({
                message: '操作成功',
                iconClass: 'icon icon-success'
            });
        },

        showChannelList(){
            this.popupVisible = true;
        },
        changeChannelList(item){
          this.activeChannel = item;
          this.popupVisible = false;
        },

        main_log(val) {
            console.log('main_log', val);
        },
        sub_log(val) {
            console.log('sub_log', val);
            this.$refs.target_1.collapse();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main{
    height: 92%;
    overflow-y: auto;
  }
  .mint-header{
    background-color: #212227;
  }
  /*当前频点*/
  .channels{
    margin-top: 0px;
  }
  .activeChannel{
    overflow: hidden;
    height: .5rem;
    background-color: #212227;
    padding: .05rem 0;
  }
  .listChannel{
    border-bottom: 1px solid #474B50;
    overflow: hidden;
    height: .5rem;
    background-color: #212227;
    padding: .05rem 0;
  }
  .status,.rate,.info{
    float: left;
    height: 100%;
  }
  .status{
    width: 20%;
    line-height: .5rem;
    text-align: center;
  }
  .statusCircle{
    display: inline-block;
    width: .12rem;
    height: .12rem;
    border-radius: 50%;
  }
  .rate{
    box-sizing: border-box;
    width: 24%;
    padding-top: .08rem;
  }
  .us{
    display: block;
    color: #FEFD37;
    font-size: .15rem;
    text-align: left;
  }
  .ds{
    display: block;
    color: #2DABDB;
    font-size: .15rem;
    text-align: left;
  }
  .info{
    width: 40%;
    color: #FFFFFF;
    font-size: .15rem;
    box-sizing: border-box;
    padding-top: .02rem;
  }
  .T,.R,.B{
    display: block;
  }
  .B{
    margin-left: .08rem;
  }
  .TCircle,.RCircle,.BCircle{
    display: inline-block;
    width: .08rem;
    height: .08rem;
    border-radius: 50%;
  }
  .gray{background-color: #B7B7B7;}
  .green{background-color: #28FC2E;}
  .red{background-color: #FC0E1B;}
  /*右侧弹出窗口(频点列表)*/
  .mint-popup{
    background-color: #212227;
    width: 100%;
    height: 100%;
  }
  .channelList{
    height: 100%;
    overflow-y: auto;
  }
  /*图表*/
  .chartArea{
    overflow: hidden;
    margin-top: 60px;
  }
  .mainChart{
    float: left;
    width: 100%;
  }
  .lteChart{
    float: left;
    width: 50%;
  }
  .chartTitle{
    border: 1px solid #BBBBBB;
    color: #000;
    text-align: left;
    text-indent: .1rem;
    padding: .1rem .08rem;
    background-color: #EEEEEE;
    border-radius: 5px;
    font-size: .12rem;
  }
  .chart{
    height: 1.6rem;
  }
</style>
