<template>
  <div class="GatewayMan">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="changeGatewayShow">
        网关
        <i class="titleIcon fa chevronStyle" :class="[gatewayShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
      </div>
      <mt-popup v-model="gatewayShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div class="GroupItem" v-if="gatewayShow" style="height:100%">
          <div class="popTitle">
            <div class="back">
              <div  @click="gatewayShow=false" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">网关</span>
              </div>            
              <i class="titleIcon addBtn fa fa-refresh" @click.stop="getGatewayList"></i>
              <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addGateway" v-if="gatewayAddShow"></i>
              <input type="text" v-model="options.searchGateway" @click.stop="" @keyup.stop="searchGatewayByFilter" class="searchInput">
            </div>
          </div>
          <div class="userPrefix"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefixName.join(',')" class="breakAll">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <div class="popContentStyle">
            <template v-for="(item,i) in gatewayShowList">
              <mt-cell-swipe
                :right="[ 
                {content: '编辑',style:{}, handler:() => editGateway(item)},
                {content: '删除',style:{}, handler:() => deleteGateway(item)}
                ]">
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">网关名称</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.name }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">IP</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.ip }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">端口</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.port }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">用户</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.userName }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">用户组</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.prefixName }}</span>
                </div>
              </mt-cell-swipe>
            </template>
          </div>
        </div>
      </mt-popup>
      <!-- 代理服务器配置 -->
      <mt-popup v-model="gatewayEditVisible" popup-transition="popup-fade">
        <div class="popupContainer">
          <div class="popupTitle">
            网关配置
            <i class="popupCloseBtn fa fa-times" @click="gatewayEditVisible = false"></i>
          </div>
          <form action="" @submit.prevent="saveGatewayConf">
            <div class="fGrp">
              <div class="tl">网关名称</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="options.name">
                <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">名称(长度1~15，仅支持中文,字母,数字,+,-,@,(),和空格)</p>
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">IP</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="options.ip">
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">端口</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="options.port">
              </div>
            </div>
            <div class="fGrp" style="text-align: right">
              <button @click="gatewayEditVisible = false" style="margin-right: .06rem;">取消</button>
              <button type="submit">确定</button>
            </div>
          </form>
        </div>
      </mt-popup>
      <!-- 用户组过滤 -->
      <mt-popup v-model="userPrefixPop" position="bottom" popup-transition="popup-slide" class="userPrefixPop">
        <span class="chevronDown">
          <i class="fa fa-chevron-down" @click.stop="userPrefixPop=false"></i>
        </span>
        <mt-checklist
          v-model="selectPrefix"
          :options="selectPrefixOptions"
          @change="changePrefixSelect">
        </mt-checklist>
      </mt-popup>

    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { } from '../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "GatewayMan",
    data(){
      return{
        selected: '1',
        DEBUG_USER: DEBUG_USER,
        SUPER : SUPER,
        ADVANCE : ADVANCE,
        NORMAL : NORMAL,
        ADMIN : ADMIN,
        gatewayShow:false,
        gatewayAddShow:false,
        gatewayDelShow:false,
        gatewayShowList:[],
        gatewayList:[],
        options:{
          type: "add",
          id: "",
          name: "",
          ip: "",
          port: "",
        },
        userPrefixPop:false,//用户组
        selectPrefixOptions:[],
        selectPrefix:"",
        selectPrefixName:"",
        gatewayEditVisible:false,//编辑网关
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.getGatewayList();
        }
      }
    },
    created(){  //生命周期-页面创建后
      var that = this;
      this.initShowContent();
    },
    activated(){
      this.initShowContent();
    },
    methods:{
      ...mapMutations({
          
      }),
      changePrefixSelect(){
        var that = this;
        var selectPrefix = that.selectPrefix;
        var data = that.$global.getPrefixShow(that.selectPrefix, that.selectPrefixOptions);
        that.selectPrefix = data["selectPrefix"];  
        that.selectPrefixName = data["selectPrefixName"];
        that.getGatewayList();
      },
      changeGatewayShow(){
        this.gatewayShow = !this.gatewayShow;
        this.initShowContent();
      },
      initShowContent(){
        var that = this;
        that.gatewayAddShow = true;
        that.gatewayDelShow = true;
        that.$global.getChildGrpArr(that.user.prefix, function(data) {
          var data = that.$global.initPrefixData(data);
          that.selectPrefixOptions = data.selectPrefixOptions;
          that.selectPrefix = data.selectPrefix;
          that.selectPrefixName = data.selectPrefixName;
          that.getGatewayList();
        })
      },
      getGatewayList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getGateway:true,
            selectByPrefix:that.selectPrefix,
            logPrefix:that.user.prefix,
          }),
          Api:"getGateway",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            if(data.length == 0){
              that.gatewayList = [];  
            }else{
              that.gatewayList = data;  
            }
            that.searchGatewayByFilter();
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      searchGatewayByFilter(){
        var that = this;
        var gatewayList = that.gatewayList;
        var filterGatewayList = [];
        var filter = that.options.searchGateway;
        if(filter && filter != ""){
          var len = gatewayList.length;
          for(var i=0; i<len; i++){
            for(var key in gatewayList[i]){
              if(gatewayList[i][key]){
                if(gatewayList[i][key].toString().indexOf(filter) != -1){
                  filterGatewayList.push(gatewayList[i]);
                  break;
                }
              }
            }
          }
          that.gatewayShowList = filterGatewayList;
        }else{
          that.gatewayShowList = gatewayList;
        }
      }, 
      addGateway(){
        this.gatewayEditVisible = true;
        this.options.type = "add";
        this.options.id = "";
        this.options.name = "";
        this.options.ip = "";
        this.options.port = "";
      },
      editGateway(item){
        var that = this;
        this.gatewayEditVisible = true;
        this.options.type = "edit";
        this.options.id = item.id;
        this.options.name = item.name;
        this.options.ip = item.ip;
        this.options.port = item.port;
      },
      saveGatewayConf(){
        var that = this;
        var type = this.options.type;
        var id = this.options.id;
        var name = this.options.name;
        var ip = this.options.ip;
        var port = this.options.port;
        var user = this.user.id;
        var prefix = this.user.prefix;
        
        if (!this.$global.isValidIP(ip)) {
          that.$toast({
            message: '请输入有效IP地址',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!this.$global.isValidPort(port)) {
          that.$toast({
            message: '请输入有效端口',
            position: 'middle',
            duration: 2000
          });
          return;
        }  
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            saveGateway : true,
            type : type,
            id : id,
            gatewayName : name,
            gatewayIp : ip,
            gatewayPort : port,
            user : user,
            prefix : prefix,
          }),
          Api:"saveGateway",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getGatewayList();
            that.gatewayEditVisible = false;
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      deleteGateway(item){
        var that = this;
        var text = '确认删除选中网关?';
        this.$messagebox.confirm(text).then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delGateway: true,
                delGatewayIds:item.id,
              }),
              Api:"delGateway",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.getGatewayList();
              }else{
                that.$toast({
                  message: res.res.reason,
                  position: 'middle',
                  duration: 2000
                });
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        }).catch(()=>{
          console.log("cancel");
        });
      },
    },
  }
</script>

<style scoped>
  .Group{
    margin-top: 0px;
  }
  .GroupTitle{
    border-top: 1px solid #222;
    border-bottom: 1px solid #222;
    text-align: left;
    text-indent: .1rem;
    padding: .1rem .08rem;
    background: linear-gradient(270deg,#111 0,#333 50%);
    font-size: .15rem;
    font-weight:500;
    color: #B7B7B7;
  }
  .GroupItem{
      padding: .05rem .08rem;
  }
  .GroupItemField{
      overflow: hidden;
  }
  .GroupItemTitle{
    width: 35%;
    float: left;
    line-height: .3rem;
    text-align: left;
    font-size: .14rem;
    color: #EEEEEE;
  }
  .GroupItemValue{
    width: 65%;
    float: left;
    text-align: left;
  }
  .ItemSelect{
    width:100%;
    height: .26rem;
    border: 1px solid #3d81f1;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
    font-size: .12rem;
    background-color: #FFFFFF;
    color:#000;
  }
  .ItemSelectBlack{
    background-color: #000;
    color:#fff;
    width: 1.8rem;
    height: .26rem;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
    font-size: .12rem;
  }
  .setBtn{
    border: none;
    outline: none;
    box-shadow: none;
    height: .26rem;
    margin-top: .02rem;
    font-size: .12rem;
    border-radius: 5px;
    padding: 0 .1rem;
  }
  .titleIcon{
    width: .2rem;
    height: .2rem;
    display: inline-block;
    color:#B7B7B7;
    vertical-align: text-top;
    margin-top: 2px;
  }
  .ItemBtn{
    width: 40%;
    height: .3rem;
    display: inline-block;
    background-color: #3d81f1;
    color: #FFFFFF;
    border: none;
    outline: none;
    border-radius: 5px;
    box-shadow: none;
    font-size: .12rem;
  }
  .ItemInput{
    width:100%;
    height: .22rem;
    border: 1px solid #3d81f1;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
    font-size: .12rem;
    background-color: #FFFFFF;
    color:#000;
  }
  .ItemInputBlack{
    background-color:#000;
    color:#fff;
    border:1px solid #4b5056;
  }
  .addBtn{
    float: right;
    width: .3rem;
    text-align: center;
  }
  .userPrefixPop.mint-popup{
    background-color: #212227;
    width: 100%;
    height: 100%;
  }
  .chevronDown{
    width: 100%;
    background-color: #3f4551!important;
    color: #fff;
    border: 1px;
    display: block;
    text-align: center;
    padding: 5px;
    font-size: .16rem;
  }
  .cellItem{overflow:hidden}
  .cellItem .cellName{float: left;text-align: left;}
  .cellItem .cellNameR{float: right;text-align: right;}
  .cellItem .cellAddr{color:#888;font-size:13px;}
  .cellItem .cellCard{color:#444}
  .popupTitle{
    padding: .1rem;
    font-size: .14rem;
  }
  .popupCloseBtn{
    float: right;
    width: .24rem;
    height: .24rem;
    color: #B00;
    font-size: .16rem;
    margin-top: -2px;
    text-align: right;
  }
  .deviceCardItem,.deviceItem,.devRightsItem{
    border-bottom: 2px solid #AAA;
    padding:2px 10px;
  }
  .deviceCardItem:last-child,.deviceItem:last-child{
    border-bottom: 0;
  }
  .deviceCardItem .cellItem,
    .deviceItem .cellItem{
    margin-top:3px;
  }
  .navTitle{
    text-align:center;
    display:inline-block;
    width:100%;
  }
  .wholePagePop{
    background-color:#212227;
    font-size:.14rem;
    color:#fff;
    width: 100% !important;
    height: 100%;
    max-height: 100% !important;
  }
  .wholePagePop .page-title{
    font-size:.16rem;
    color:#fff;
    padding:10px;
  }
  .mint-switch{
    transform: scale(.7);
    transform-origin: left;
  }
</style>
<style>
  .DevMan .mint-checkbox-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.14rem !important;
  }
  .userPrefix .mint-cell-title{
    flex:auto;
    font-size:.14rem;
  }
  .userPrefix .mint-cell-value{
    width:auto !important;
  }
  .userPrefix .mint-cell-wrapper{
    background-color:#000;
  }
  
  .cardInfoPop.mint-popup{
    width: 90% !important;
    max-height: 90% !important;
    overflow-y: auto !important;
    border-radius: 4px !important;
    background-color: #EEE !important;
  }
  .cardInfoPop .popupContainer{
    font-size:.14rem;
  }
  .popupContainer .mint-cell-title{width:40%;text-align: left;}
  .popupContainer .mint-cell-value{width:60%;text-align: right;padding:0;}
  .popupContainer .mint-cell{min-height:24px;}
  .popupContainer .fGrp{overflow: hidden;padding: .1rem;}
  .ProxyMan .popupContainer .fGrp .tl{width: 40%;float: left;  text-align: right;padding-top:0.07rem;margin-right: 5%;}
  .ProxyMan .popupContainer .fGrp .vl{width: 40%;float: left; text-align: right}
  .popupContainer .fGrp button{padding: .02rem .1rem;width: .8rem;outline: none;border-radius: 4px;box-shadow:none;margin-top: .02rem;margin-right: .05rem;}
  .onlineStyle{
    color:#00ff00;
  }
  .broadStyle{
    color:#ff0000;
  }
  #devList .mint-cell-value>.cellItem{
    display:flex;
  }
  #devList .mint-cell-value>.cellItem span:first-child{
    flex-shrink:0;
    flex-grow:1;  
  }
  #devList .mint-cell-value>.cellItem span:last-child{
    flex-shrink:1;
    text-align:right;
  }

  .channelList .mint-loadmore-text{color: #FFF;}
  .DevMan .mint-cell-wrapper{
    background-image:linear-gradient(180deg,#000,#000 50%,transparent 0) !important;
  }
  .DevMan .mint-cell-wrapper{
    padding:0 10px !important;
    padding-left:10px !important;
  }
  .DevMan .mint-cell{
    background-color:#3f4551 !important;
    color:#fff !important; 
    min-height: 48px !important;
    display: block !important;
  }
  .DevMan .mint-radio-label {
    vertical-align: middle !important;
    margin-left: 6px !important;
    font-size:.16rem !important;
  }
  .DevMan .mint-radiolist-label {
    display: block !important;
    padding: 0 10px !important;
  }
  .userPrefixPop .mint-radiolist-title,
  .userPrefixPop .mint-checklist-title{
    margin: 0px;
  }
  .nowrap{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:100%;
    display:inline-block;
  }
  .nowrapText{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width:90%;
    display:inline-block; 
    vertical-align: middle;
    padding-left:5px;
  }
  .me .mint-popup.rightPop{
    width:100%;
    height:100%;
    background-color: #000;
  }
  .rightPop>.GroupItem{
    padding:0px;
  }
  /*.mint-toast{
    z-index:2010 !important;
  }*/
  .linkTitle{
    color:#5AB1A7;
  }
  .leftvl{
    text-align:left !important;
  }
  .leftvl input{
    width:30% !important;
  }
  textarea{
    font-size: .14rem !importantmportant;
    padding: 0;
    background-color: #353535;
    color: #fff;
  }
</style>