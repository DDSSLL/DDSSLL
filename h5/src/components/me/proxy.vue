<template>
  <div class="ProxyMan">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="changeProxyShow">
        代理服务器
        <i class="titleIcon fa chevronStyle" :class="[proxyShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
      </div>
      <mt-popup v-model="proxyShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div class="GroupItem" v-if="proxyShow" style="height:100%">
          <div class="popTitle">
            <div class="back">
              <div  @click="proxyShow=false" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">代理服务器</span>
              </div>            
              <i class="titleIcon addBtn fa fa-refresh" @click.stop="getProxyList"></i>
              <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addProxy" v-if="proxyAddShow"></i>
              <input type="text" v-model="options.searchProxy" @click.stop="" @keyup.stop="searchProxyByFilter" class="searchInput">
            </div>
          </div>
          <div class="popContentStyle">
            <template v-for="(item,i) in proxyShowList">
              <mt-cell-swipe
                :right="[ 
                {content: '状态',handler:() => showStatus(item)},
                {content: '设备',handler:() => showDevice(item)},
                {content: '编辑',style:{}, handler:() => editProxy(item)},
                {content: '删除',style:{display:proxyDelShow?'':'none'}, handler:() => deleteProxy(item)}
                ]">
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">序列号</span>
                  <span class="cellName cellValue" style="float: right;" :class="[item.online=='1'?'onlineStyle':'']">{{ item.proxy_sn }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">别名</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.proxy_name }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">软件版本</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.softVer }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">内网IP</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.proxyIP }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">公网IP</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.mapIP }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">代理版本</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.proxyVer }}</span>
                </div>
              </mt-cell-swipe>
            </template>
          </div>
        </div>
      </mt-popup>
      <!-- 状态信息 -->
      <mt-popup v-model="proxyStatusVisible" popup-transition="popup-fade">
        <div class="popupContainer">
          <div class="popupTitle">
            状态
            <i class="popupCloseBtn fa fa-times" @click="proxyStatusVisible = false"></i>
          </div>
          <template v-for="(item,i) in proxyStatusPopupList">
            <div class="deviceItem">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">CPU占用率</span>
                <span class="cellName cellValue" style="float: right;">{{ item.cpu }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">内存占用</span>
                <span class="cellName cellValue" style="float: right;">{{ item.ddr_used+" / "+item.ddr_total }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">硬盘占用</span>
                <span class="cellName cellValue" style="float: right;">{{ item.hdd_used+" / "+item.hdd_total }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">输出占用总带宽</span>
                <span class="cellName cellValue" style="float: right;">{{ item.oBwUsed+" / "+(item.oBwTotal?item.oBwTotal:"") }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">输入占用总带宽</span>
                <span class="cellName cellValue" style="float: right;">{{ item.iBwUsed+" / "+item.iBwTotal }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">当前设备总数</span>
                <span class="cellName cellValue" style="float: right;">{{ item.DevSum }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">剩余代理端口总数</span>
                <span class="cellName cellValue" style="float: right;">{{ item.ProxyPortIdleSum }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">剩余业务端口总数</span>
                <span class="cellName cellValue" style="float: right;">{{ item.StreamPortIdleSum }}</span>
              </div>
            </div>
          </template>
        </div>
      </mt-popup>
      <!-- 设备信息 -->
      <mt-popup v-model="proxyDevVisible" popup-transition="popup-fade">
        <div class="popupContainer">
          <div class="popupTitle">
            设备
            <i class="popupCloseBtn fa fa-times" @click="proxyDevVisible = false"></i>
          </div>
          <template v-for="(item,i) in proxyDevPopupList">
            <div class="deviceItem">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">序列号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_sn }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">设备名</span>
                <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播')?'broadStyle':'']">{{ item.rcv_name }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">启动</span>
                <span class="cellName cellValue" style="float: right;">{{ item.vpnEnableStr }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">状态</span>
                <span class="cellName cellValue" style="float: right;">{{ item.inst_status }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">TunNet</span>
                <span class="cellName cellValue" style="float: right;">{{ item.tunNet }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">TunSerIp</span>
                <span class="cellName cellValue" style="float: right;">{{ item.tunSerIp }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">代理服务器IP</span>
                <span class="cellName cellValue" style="float: right;">{{ item.vpsIp }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">代理服务器DNS</span>
                <span class="cellName cellValue" style="float: right;">{{ item.vpsDns }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">代理服务器端口</span>
                <span class="cellName cellValue" style="float: right;">{{ item.vpsPort }}</span>
              </div>
            </div>
          </template>
        </div>
      </mt-popup>
      <!-- 代理服务器配置 -->
      <mt-popup v-model="proxyEditVisible" popup-transition="popup-fade">
        <div class="popupContainer">
          <div class="popupTitle">
            代理服务器配置
            <i class="popupCloseBtn fa fa-times" @click="proxyEditVisible = false"></i>
          </div>
          <form action="" @submit.prevent="saveProxyConf">
            <div class="fGrp">
              <div class="tl">序列号</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="options.proxy_sn" required :disabled="options.proxy_type=='edit'">
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">别名</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="options.proxy_name" required>
                <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">名称(长度1~15，仅支持中文,字母,数字,+,-,@,(),和空格)</p>
              </div>
            </div>
            <div v-show="options.proxy_type=='edit'">
              <div class="fGrp">
                <div class="tl">最大支持设备数量</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="options.DevSumMax" placeholder="1-100" :disabled="options.proxy_type=='edit'">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">代理起始端口</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="options.ProxyPortStart" placeholder="0-65535" :disabled="options.proxy_type=='edit'">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">代理终止端口</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="options.ProxyPortStop" placeholder="0-65535" :disabled="options.proxy_type=='edit'">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">业务起始端口</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="options.StreamPortStart" placeholder="0-65535" :disabled="options.proxy_type=='edit'">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">业务终止端口</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="options.StreamPortStop" placeholder="0-65535" :disabled="options.proxy_type=='edit'">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">输入网络带宽</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="options.InBwkbps" :disabled="options.proxy_type=='edit'">
                  <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">Mbps</p>
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">输出网络带宽</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="options.OutBwkbps" :disabled="options.proxy_type=='edit'">
                  <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">Mbps</p>
                </div>
              </div>
            </div>
            <div class="fGrp" style="text-align: right">
              <button @click="proxyEditVisible = false" style="margin-right: .06rem;">取消</button>
              <button type="submit">确定</button>
            </div>
          </form>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { } from '../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "ProxyMan",
    data(){
      return{
        selected: '1',
        DEBUG_USER: DEBUG_USER,
        SUPER : SUPER,
        ADVANCE : ADVANCE,
        NORMAL : NORMAL,
        ADMIN : ADMIN,
        proxyShow:false,
        proxyAddShow:false,
        proxyDelShow:false,
        proxyShowList:[],
        proxyList:[],
        options:{
          searchProxy:"",
          proxy_type:"add",
          proxy_sn:"",
          proxy_name:"",
          DevSumMax:"",
          ProxyPortStart:"",
          ProxyPortStop:"",
          StreamPortStart:"",
          StreamPortStop:"",
          InBwkbps:"",
          OutBwkbps:"",
        },
        proxyStatusVisible:false,//状态
        proxyStatusPopupList:[],//状态信息
        proxyDevVisible:false,//设备
        proxyDevPopupList:[],//设备信息
        proxyEditVisible:false,//代理服务器设置
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.getProxyList();
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
      changeProxyShow(){
        this.proxyShow = !this.proxyShow;
        this.initShowContent();
      },
      initShowContent(){
        var that = this;
        if(that.user.userGroup == that.ADMIN){
          that.proxyAddShow = true;
          that.proxyDelShow = true;
        }else{
          that.proxyAddShow = false;
          that.proxyDelShow = false;
        }
        that.getProxyList();
      },
      getProxyList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getProxy:true,
          }),
          Api:"getProxy",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            if(data.length == 0){
              that.proxyList = [];  
            }else{
              that.proxyList = data;  
            }
            that.searchProxyByFilter();
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      searchProxyByFilter(){
        var that = this;
        var proxyList = that.proxyList;
        var filterProxyList = [];
        var filter = that.options.searchProxy;
        if(filter && filter != ""){
          var len = proxyList.length;
          for(var i=0; i<len; i++){
            for(var key in proxyList[i]){
              if(proxyList[i][key]){
                if(proxyList[i][key].toString().indexOf(filter) != -1){
                  filterProxyList.push(proxyList[i]);
                  break;
                }
              }
            }
          }
          that.proxyShowList = filterProxyList;
        }else{
          that.proxyShowList = proxyList;
        }
      },      
      showStatus(item){
        var that = this;
        this.proxyStatusVisible = true;
        this.proxyStatusPopupList = [];
        this.proxyStatusPopupList.push(item)
      },
      showDevice(item){
        this.getProxyDeviceBySn(item);
      },
      getProxyDeviceBySn(item){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getProxyDeviceBySn:true,
            proxySn: item.proxy_sn,
          }),
          Api:"getProxyDeviceBySn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            if(data.length == 0){
              that.proxyDevPopupList = [];  
            }else{
              that.proxyDevPopupList = data;  
            }
            that.proxyDevVisible = true;
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 3000
            });
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      addProxy(){
        this.proxyEditVisible = true;
        this.options.proxy_type = "add";
        this.options.proxy_sn = "";
        this.options.proxy_name = "";
      },
      editProxy(item){
        var that = this;
        this.proxyEditVisible = true;
        this.options.proxy_type = "edit";
        this.options.proxy_sn = item.proxy_sn;
        this.options.proxy_name = item.proxy_name;
        that.getProxyParamData(item.proxy_sn, function(data){
          that.options.DevSumMax = data.DevSumMax;
          that.options.ProxyPortStart = data.ProxyPortStart;
          that.options.ProxyPortStop = data.ProxyPortStop;
          that.options.StreamPortStart = data.StreamPortStart;
          that.options.StreamPortStop = data.StreamPortStop;
          that.options.InBwkbps = data.InBwkbps/1000;
          that.options.OutBwkbps = data.OutBwkbps/1000;  
        })
      },
      getProxyParamData(proxySn, callback){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getProxyParamData:true,
            proxySn:proxySn
          }),
          Api:"getProxyParamData",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(typeof(callback) == 'function'){
              callback(res.data[0]);
            }
          }
        })
        .catch(function (error) {
            console.log(error)
        })
      },
      saveProxyConf(){
        var that = this;
        var name = this.options.proxy_name;
        var sn = this.options.proxy_sn;
        var type = this.options.proxy_type;
        //代理服务器sn校验
        var sub = sn.substr(-4);
        if(sub != "2998"){
          that.$toast({
            message: '该序列号不支持添加',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!this.$global.isValidRcvSn(sn)) {
          that.$toast({
            message: '请输入10位数字或字母的序列号',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //代理服务器名称校验
        var len = this.$global.SubstrFitCn(name, 0);//匹配中文，中文按一个字符处理
        if(len > 15){
          that.$toast({
            message: '服务器名称长度不超过15',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!this.$global.nameCheckType4(name)) {//未匹配中文长度(中文按一个字符处理)
          that.$toast({
            message: '请按要求输入代理服务器名称',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //sn 重复(新添加代理服务器时校验，编辑的时候不用校验)
        if (type == "add") {
          var data = this.proxyList;
          for (var i = 0; i < data.length; i++) {
            if (data[i].proxy_sn == sn) {
              that.$toast({
                message: '该代理服务器已添加',
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
          this.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:this.$qs.stringify({
              saveProxy:true,
              proxyName:name,
              proxySn:sn,
            }),
            Api:"saveProxy",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getProxyList();
              that.proxyEditVisible = false;
            }
          })
          .catch(function (error) {
              console.log(error)
          })
        }else if(type == "edit"){
          if(this.$global.checkInteger(this.options.DevSumMax) 
            || (this.options.DevSumMax<1 || this.options.DevSumMax>100)){
            that.$toast({
              message: '请按要求输入最大支持设备数量',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if(!this.$global.isValidPort(this.options.ProxyPortStart)){
            that.$toast({
              message: '请按要求输入代理起始端口',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if(!this.$global.isValidPort(this.options.ProxyPortStop)){
            that.$toast({
              message: '请按要求输入代理终止端口',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if(!this.$global.isValidPort(this.options.StreamPortStart)){
            that.$toast({
              message: '请按要求输入业务起始端口',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if(!this.$global.isValidPort(this.options.StreamPortStop)){
            that.$toast({
              message: '请按要求输入业务终止端口',
              position: 'middle',
              duration: 2000
            });
            return;
          }

          this.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:this.$qs.stringify({
              editProxy : true,
              proxySn : sn,
              DevSumMax : that.options.DevSumMax,
              ProxyPortStart : that.options.ProxyPortStart,
              ProxyPortStop : that.options.ProxyPortStop,
              StreamPortStart : that.options.StreamPortStart,
              StreamPortStop : that.options.StreamPortStop,
              InBwkbps : that.options.InBwkbps*1000,
              OutBwkbps : that.options.OutBwkbps*1000,
            }),
            Api:"editProxy",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getProxyList();
              that.proxyEditVisible = false;
            }
          })
          .catch(function (error) {
              console.log(error)
          })
        }
      },
      deleteProxy(item){
        var that = this;
        var text = '确认删除选中代理服务器?';
        this.$messagebox.confirm(text).then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delProxySns: item.proxy_sn,
              }),
              Api:"delProxy",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.getProxyList();
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