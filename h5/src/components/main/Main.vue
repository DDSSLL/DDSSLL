<template>
  <div class="main">
    <mt-header fixed>
      <mt-button slot="left">UHDXpress</mt-button>
      <mt-button slot="right">实时监测</mt-button>
    </mt-header>
    <div class="channels">
        <div class="activeChannel" @click="showChannelList">
          <div class="status">
            <span class="statusCircle" :class="[activeChannel.status == 0 ? 'gray': '',activeChannel.status == 1 ? 'green': '',activeChannel.status == 2 ? 'red': '']"></span>
          </div>
          <div class="rate">
            <span class="us">{{ activeChannel.us }}</span>
            <span class="ds">{{ activeChannel.ds }}</span>
          </div>
          <div class="info">
            <span class="T">
              <span class="TCircle" :class="[activeChannel.TStatus == 0 ? 'gray': '',activeChannel.TStatus == 1 ? 'green': '',activeChannel.TStatus == 2 ? 'red': '']"></span>
              T: {{ activeChannel.T }}
            </span>
            <span class="R">
              <span class="RCircle" :class="[activeChannel.RStatus == 0 ? 'gray': '',activeChannel.RStatus == 1 ? 'green': '',activeChannel.RStatus == 2 ? 'red': '']"></span>
              R: {{ activeChannel.R }}
            </span>
            <span class="B" v-if="activeChannel.B">
              <span class="BCircle" :class="[activeChannel.BStatus == 0 ? 'gray': '',activeChannel.BStatus == 1 ? 'green': '',activeChannel.BStatus == 2 ? 'red': '']"></span>
              B: {{ activeChannel.B }}
            </span>
          </div>
        </div>
    </div>
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
    <mt-popup
      v-model="popupVisible"
      position="right"
      popup-transition="popup-slide">
      <div class="channelList">
        <template v-for="(item,i) in channelList">
          <div class="listChannel" @click="changeChannelList(item)">
            <div class="status">
              <span class="statusCircle" :class="[item.status == 0 ? 'gray': '',item.status == 1 ? 'green': '',item.status == 2 ? 'red': '']"></span>
            </div>
            <div class="rate">
              <span class="us">{{ item.us }}</span>
              <span class="ds">{{ item.ds }}</span>
            </div>
            <div class="info">
            <span class="T">
              <span class="TCircle" :class="[item.TStatus == 0 ? 'gray': '',item.TStatus == 1 ? 'green': '',item.TStatus == 2 ? 'red': '']"></span>
              T: {{ item.T }}
            </span>
              <span class="R">
              <span class="RCircle" :class="[item.RStatus == 0 ? 'gray': '',item.RStatus == 1 ? 'green': '',item.RStatus == 2 ? 'red': '']"></span>
              R: {{ item.R }}
            </span>
              <span class="B" v-if="item.B">
              <span class="BCircle" :class="[item.BStatus == 0 ? 'gray': '',item.BStatus == 1 ? 'green': '',item.BStatus == 2 ? 'red': '']"></span>
              B: {{ item.B }}
            </span>
            </div>
          </div>
        </template>
      </div>
    </mt-popup>
  </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data(){
        return{
            popupVisible:false,
            activeChannel:{
                status:2,   //0:灰色 1:绿色 2:红色
                us:2.931,
                ds:2.649,
                T:100028,
                TStatus:0,
                R:"R6",
                RStatus:1,
                B:2,
                BStatus:2
            },
            channelList:[
                {status:0,us:'2.931',ds:'2.649',T:"100028",R:"R6",B:"2",TStatus:2,RStatus:1,BStatus:2},
                {status:0,us:'-',ds:'-',T:"100034(宋世杰)",R:"Vir-Huawei",TStatus:0,RStatus:1},
                {status:0,us:'-',ds:'-',T:"100035(移动香港)",R:"Vir-Huawei",TStatus:0,RStatus:1}
            ]
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
    background-color: #2c3e50;
  }
  /*当前频点*/
  .channels{
    margin-top: 40px;
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
