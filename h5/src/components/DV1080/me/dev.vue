<template>
  <div class="DevMan">
    <div class="Group">
      <div class="GroupTitle" @click="DeviceShow=!DeviceShow">
        背包信息
        <i class="titleIcon fa" :class="[DeviceShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getDeviceList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addDevice" v-if="devAddShow"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="DeviceShow" id="devList">
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefixName.join(',')">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <template v-for="(item,i) in deviceList">
            <mt-cell-swipe
              :right="[ 
              {content: '网卡',handler:() => showDeviceCard(item)},
              {content: '编辑',handler:() => editDevice(item)},
              {content: '删除',style:{display:devDelShow?'':'none'},handler:() => deleteDevice(item)}
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">背包名称</span>
                <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.dev_name }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">状态</span>
                <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.online }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">序列号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.dev_sn }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">上线时间</span>
                <span class="cellName cellValue" style="float: right;">{{ item.datetime }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用戶組</span>
                <span class="cellName cellValue" style="float: right;">{{ item.prefix }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">型号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.dev_model }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">MAC</span>
                <span class="cellName cellValue" style="float: right;">{{ item.dev_mac }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">软件版本</span>
                <span class="cellName cellValue" style="float: right;">{{ item.softVer?item.softVer.split('-')[0]:"-" }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">硬件版本</span>
                <span class="cellName cellValue" style="float: right;">{{ item.hardVer }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">背包实时位置</span>
                <span class="cellName cellValue" style="float: right;padding-left:20px">{{ item.addr }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">绑定板卡</span>
                <span class="cellName cellValue" style="float: right;">{{ item.match_board }}</span>
              </div>
            </mt-cell-swipe>
          </template>
        </div>
      </transition>
    </div>    
    <!-- 网卡信息 -->
    <mt-popup v-model="deviceCardVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          网卡信息
          <i class="popupCloseBtn fa fa-times" @click="deviceCardVisible = false"></i>
        </div>
        <template v-for="(item,i) in deviceCardList">
          <div class="deviceCardItem">
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">网卡</span>
              <span class="cellName cellValue" style="float: right;" :class="[(item.online=='1'&&(devOnline == '在线' || devOnline == '直播'))?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.card_name }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">状态</span>
              <span class="cellName cellValue" style="float: right;">{{ item.used=="0"?"禁用":"启用" }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">IP</span>
              <span class="cellName cellValue" style="float: right;">{{ item.card_ip }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">MAC</span>
              <span class="cellName cellValue" style="float: right;">{{ item.card_mac }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">信号强度</span>
              <span class="cellName cellValue" style="float: right;">{{ item.rssi }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">运营商</span>
              <span class="cellName cellValue" style="float: right;">{{ item.operator }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">网络制式</span>
              <span class="cellName cellValue" style="float: right;">{{ item.sim_mode }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">模块型号</span>
              <span class="cellName cellValue" style="float: right;">{{ item.module_type }}</span>
            </div>
          </div>
        </template>
      </div>
    </mt-popup>
    <!-- 背包配置 -->
    <mt-popup v-model="deviceConfigVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          背包配置
          <i class="popupCloseBtn fa fa-times" @click="deviceConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitDeviceConfig">
          <div class="fGrp">
            <div class="tl">背包名称</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.devName" required pattern="[A-z0-9+-@() ]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,(),空格" :disabled="deviceConfigType == 'edit'">
              <p v-if="deviceConfigType=='add'" style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">仪器名(长度1-15,仅支持中文,字母,数字,+,-,@,()和空格)</p>
              <p v-else style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">修改名称请前往参数->别名</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.devSn" required pattern="[0-9]{10}" title="10位数字序列号" :disabled="deviceConfigType == 'edit'"> 
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.prefix" :disabled="deviceConfigType == 'edit' && user.userGroup != ADMIN" @change="changePrefixFun">
                <template v-for="(item,i) in deviceConfigPrefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.devUser" :disabled="deviceConfigType == 'edit' && user.userGroup != ADMIN">
                <template v-for="(item,i) in deviceConfigUserOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="deviceConfigType == 'edit'">
            <div class="tl">汇聚服务器</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.server" style="margin-bottom: 5px;" @change="editMatchChange = true">
                <template v-for="(item,i) in deviceConfigServerOptions">
                  <option :value="item.value" :style="'color:'+item.color+''">{{ item.text }}</option>
                </template>
              </select>
              <button @click.prevent="editMatchRow" style="border:1px solid #666;">保存绑定</button>
              <button @click.prevent="deleteMatchRow" style="border:1px solid #666;">解除绑定</button>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button class="modalBtn" @click="deviceConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>

    <!-- 用户组 -->
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
</template>
<script>
  import { mapState, mapMutations } from 'vuex';
  import { } from '../../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "DevMan",
    data(){
      return{
        SUPER : SUPER,
        ADMIN : ADMIN,
        DeviceShow:false,
        devAddShow:true,
        devDelShow:true,
        deviceList:[],
        deviceCardVisible:false,
        deviceCardList:[],
        devOnline:"",
        deviceConfigVisible:false,
        deviceConfigType:'add',
        options:{
          devName:"",
          editDev:"",
          prefix:"",
          devUser:"",
          server:"",
          board:"",
        },
        deviceConfigPrefixOptions:[],
        deviceConfigUserOptions:[],
        deviceConfigServerOptions:[],
        editMatchChange: false,
        userPrefixShow:true,//显示筛选表格的用户组下拉列表
        selectPrefixOptions:[],//用户组options
        selectPrefix:[],//选中的用户组
        selectPrefixName:[],//显示过滤组的名称
        DV4000RV:false,
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
          this.getDeviceList();
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
      /*...mapMutations({
          
      }),*/
      initShowContent(){
        var that = this;
        if(that.user.userGroup == that.ADMIN){
          that.devAddShow = true;
          that.devDelShow = true;
          that.userPrefixShow = true;
          that.$global.getUserPrefixArr(function(data) {
            var data = that.$global.initPrefixData(data);
            that.selectPrefixOptions = data.selectPrefixOptions;
            that.selectPrefix = data.selectPrefix;
            that.selectPrefixName = data.selectPrefixName;
            //背包列表
            that.getDeviceList();
          })
        }else{
          that.devAddShow = false;
          that.devDelShow = false;
          that.userPrefixShow = false;
          that.getDeviceList();
        }
      },
      formatUserSelect(){
        var that = this;
        var select = "";
        if(that.userPrefixShow){
          if(that.selectPrefix){
            select =  that.selectPrefix.map(function(item){
              return "'" + item + "'"
            }).join(",");
          }else{
            select = "'/'";
          }
        }else{
           select = "'"+that.user.prefix+"'";
        }
        return select;
      },
      getDeviceList(){
        var that = this;
        var selectPrefix = that.formatUserSelect();
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getDevices:true,
            userId: that.user.id,
            userGroup: that.user.userGroup,
            selectByPrefix:selectPrefix,
            logPrefix:that.user.prefix
          }),
          Api:"getDevices",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            var mapArr = {"直播":1,"在线":2,"离线":3}
            that.deviceList = data.sort(function(a, b){
              return (mapArr[a.online] - mapArr[b.online])
            });
          }else{
            that.deviceList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      changePrefixSelect(){
        var that = this;
        var selectPrefix = that.selectPrefix;
        var data = that.$global.getPrefixShow(that.selectPrefix, that.selectPrefixOptions);
        that.selectPrefix = data["selectPrefix"];  
        that.selectPrefixName = data["selectPrefixName"];
        that.getDeviceList();
      },
      showDeviceCard(item){
        var that = this;
        this.deviceCardList = [];
        this.deviceCardVisible = true;
        this.devOnline = item.online;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getCardByDevSn:true,
            devSN: item.dev_sn
          }),
          Api:"getCardByDevSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.deviceCardList = res.data;
          }else{
            that.deviceCardList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      /*getUserList(cb){
       var that = this;
        if(this.user.id == SUPER){
          this.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:this.$qs.stringify({
              getPrefixs:true
            }),
            Api:"getPrefixs",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              var userList = res.data;
              that.deviceConfigUserOptions = userList;
            }else{
              that.deviceConfigUserOptions = [];
            }
            if(cb){
              cb();
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        }else{
          var option = [{
            text: this.user.id,
            value: this.user.id
          }];
          that.deviceConfigUserOptions = option;
          that.options.devUser = option[0].value;
        }
      },*/
      getRcvSelectAndVal(row, cb){
        var that = this;
        this.$global.getRcvList(row,function(data){
          that.formatRcvList(data);
          if(cb) {
            cb();
          }
        });
      },
      formatRcvList(list){
        this.deviceConfigServerOptions = list;
      },
      deleteDevice(item){
        var that = this;
        this.$messagebox.confirm("确定删除此背包?").then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delDevSns:item.dev_sn,
                userId:that.user.id
              }),
              Api:"delDev",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.$toast({
                  message: '操作成功'
                });
              }else{
                that.$toast({
                  message: res.res.reason,
                  position: 'middle',
                  duration: 2000
                });
              }
              that.getDeviceList();
              var chartKey = JSON.parse(localStorage.chartKey);
              var allChartData = JSON.parse(localStorage.allChartData);
              var newChartKey = [];
              var newAllChartData = [];
              for(var i=0; i<chartKey.length; i++){
                if(chartKey[i].split("/")[0] != item.dev_sn){
                  newChartKey.push(chartKey[i]);
                  newAllChartData[chartKey[i]] = allChartData[chartKey[i]];
                }
              }
              localStorage.chartKey = JSON.stringify(newChartKey);
              localStorage.allChartData = JSON.stringify(newAllChartData);
            })
            .catch(function (error) {
              console.log(error)
            })
        });
      },
      editMatchRow(){
        var that = this;
        //未修改
        if (!this.editMatchChange) {
          return;
        }
        //是否是虚拟接收机
        var rcv = that.options.server;
        var sub = rcv.substr(-4);
        if (sub == '2999') {
          that.DV4000RV = true;
          that.options.board = that.options.devSn;
        } else {
          //无可用板卡
          if (that.options.board == '' || that.options.board == '-1' && !that.DV4000RV) {
            return;
          }
          that.options.board = (+that.options.board) - 1;
        }
        var text = '是否切换配对关系？';
        this.getDevPushStatus(this.options.devSn, function(data) {
          if (data == 'norcv') {
            that.editMatch();
          } else {
            if (data == '1') {
              text = '是否需要先停止推流再切换配对关系？'
            }
            //询问
            that.$messagebox.confirm(text).then(
              action => {
                that.editMatch();
            }).catch();
          }
        });
      },
      //获取背包的推流状态
      getDevPushStatus(devSn, callback) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevPushStatus:devSn
          }),
          Api:"getDevPushStatus",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            callback(res.data);
          }else{
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      editMatch() {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editMatchByDevSn:true,
            dev_sn:that.options.devSn,
            devName:that.options.devName,
            new_rcv_sn:that.options.server,
            new_board_id:that.options.devSn,
            prefix:that.options.prefix,
            user_id:that.options.devUser
          }),
          Api:"editMatchByDevSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            //虚拟
            if (that.DV4000RV) {
              that.addBoard();
            }
            that.$toast({
              message: "綁定成功!",
              position: 'middle',
              duration: 2000
            });
            that.getDeviceList();
          }else{
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      addBoard(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            addBoard:true,
            dev_sn:that.options.devSn,
            rcvSn:that.options.server,
          }),
          Api:"addBoard",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
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
      },
      deleteMatchRow(){
        var that = this;
        var text = '是否解除配对关系？';
        this.getDevPushStatus(this.options.devSn, function(data) {
          if (data == '1') {
            text = '是否需要先停止推流再解除配对关系？'
          }
          that.$messagebox.confirm(text).then(
            action => {
              that.$axios({
                method: 'post',
                url:"/page/index/indexData.php",
                data:that.$qs.stringify({
                  delMatch:true,
                  dev_sn:that.options.devSn
                }),
                Api:"delMatch",
                AppId:"android",
                UserId:that.user.id
              })
              .then(function (response) {
                let res = response.data;
                if(res.res.success){
                  that.getDeviceList();
                  that.deviceConfigServerOptions.unshift({"value":"","text":""});
                  that.options.server = "";
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
          }).catch(() => {
             console.log("cancel");
          });
        });
      },
      addDevice(){
        this.deviceConfigVisible = true;
        this.deviceConfigType = "add";
        this.getDevPrefixList();
        this.clearDevPopup();
      },
      editDevice(item){
        var that = this;
        this.deviceConfigVisible = true;
        this.deviceConfigType = "edit";
        this.getDevPrefixList(item);
        this.getRcvSelectAndVal(item, function(){
          that.options.server = item.rcv_sn;
        });
        this.options = {
            devName:item.dev_name,
            devSn:item.dev_sn,
            /*devUser:item.prefix,
            server:item.rcv_sn*/
        }
      }, 
      changePrefixFun(){
        var that = this;
        that.$global.getNewUserListByPrefix(that.options.prefix, function(userList){
          that.deviceConfigUserOptions = userList;
          that.options.devUser = userList[0]["value"];
        })
      },
      getDevPrefixList(item){
        var that = this;
        that.$global.getNewPrefixList(function(data){
          that.deviceConfigPrefixOptions = data;
          if(that.deviceConfigType == "add"){
            that.options.prefix = data[0]["value"];
          }else{
            that.options.prefix = item.prefix;
          }
          that.$global.getNewUserListByPrefix(that.options.prefix, function(userList){
            that.deviceConfigUserOptions = userList;
            if(that.deviceConfigType == "add"){
              that.options.devUser = userList[0]["value"];
            }else{
              that.options.devUser = item.user_id;
            }
          })
        });
      },
      clearDevPopup(){
        this.options.devName = "";
        this.options.devSn = "";
        this.options.editDev = "";
        this.options.devUser = "";
        this.options.server = "";
      },
      submitDeviceConfig(){
        if(this.deviceConfigType == "add"){
          var that = this;
          var devSn = this.options.devSn;
          var mode = this.$global.getDevMode(devSn.substr(-4));
          if (!mode) {
            that.$toast({
              message: "背包型号不支持!",
              position: 'middle',
              duration: 2000
            });
            return;
          }
          this.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:this.$qs.stringify({
              addDev:true,
              devName:that.options.devName,
              devSn:that.options.devSn,
              devModel:mode,
              prefix: that.options.prefix,
              logUser: that.user.id,
              user_id:that.options.devUser
            }),
            Api:"addDev",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getDeviceList();
              that.deviceConfigVisible = false;
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
        }else if(this.deviceConfigType == "edit"){
          var that = this;
          //用户校验
          /*var strValue = '';
          var selectVal = that.options.devUser;
          if (selectVal && selectVal.length != 0) {
            for (var i = 0; i < selectVal.length; i++) {
              var id = selectVal[i];
              //前缀
              if (that.user.id != SUPER) {
                id = that.user.prefix + '-' + selectVal[i];
              }
              if (strValue == '') {
                strValue = id;
              } else {
                strValue += ',' + id;
              }
            }
          }*/
          this.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:this.$qs.stringify({
              editDev:that.options.devSn,
              devName:that.options.devName,
              devUser:"",
              logUser:that.user.id,
              prefix:that.options.prefix,
              user_id:that.options.devUser
            }),
            Api:"editDev",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getDeviceList();
              that.deviceConfigVisible = false;
            }else{
              that.getDeviceList();
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
    }
  }
</script>
<style scoped>
    .me{
        background-color: #212227;
        height: calc(100% - 54px);
        overflow:auto;
    }
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
        /*border-radius: 5px;*/
        font-size: .15rem;
        font-weight:500;
        color: #B7B7B7;
    }
    .logout{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .GroupItem{
        padding: .05rem .08rem;
    }
    .GroupItem0{
        padding: .05rem 0rem;
    }
    .GroupItemField{
        overflow: hidden;
        /*margin-bottom: .1rem;*/
    }
    .GroupItemTitle{
        width: 30%;
        float: left;
        line-height: .3rem;
        text-align: left;
        font-size: .14rem;
        color: #EEEEEE;
    }
    .GroupItemValue{
        width: 70%;
        float: left;
        text-align: left;
    }
    .GroupItemTitle1{
        width: 20%;
    }
    .GroupItemValue1{
        width: 80%;
    }
    .ItemInput{
        /*width: 1.75rem;*/
        width:100%;
        height: .22rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
    }
    .ItemSelect{
        /*width: 1.8rem;*/
        width:100%;
        height: .26rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
        background-color: #FFFFFF;
    }
    .lan,.wan{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        font-size: .12rem;
        background-color: #EEE;
        color: #000;
    }
    .lan{
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .wan{
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .btnSelect{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .GroupItemBtns{
        text-align: right;
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
    .mint-navbar .mint-tab-item{
        padding: .05rem 0;
    }
    .mint-navbar{
        margin-bottom: .1rem;
    }
    .mint-checklist-title{display: none;}
    .mint-checklist>>>.mint-cell-wrapper{padding-left: 0;}
    .mint-checklist>>>.mint-cell{min-height: .3rem;display:inline-block;}
    .mint-cell:last-child{background-image: none;}
    .mint-switch{
        margin-left: -.34rem;
    }
    .mint-checkbox-core{
      width:15px;
      height:15px;
    }
    .titleIcon{
        width: .2rem;
        height: .2rem;
        display: inline-block;
        color:#B7B7B7;
        vertical-align: text-top;
        margin-top: 2px;
    }
    .cellItem{overflow:hidden}
    .cellItem .cellName{float: left;text-align: left;}
    .cellItem .cellNameR{float: right;text-align: right;}
    .cellItem .cellAddr{color:#888;font-size:13px;}
    .cellItem .cellCard{color:#444}
    .slide-fade-enter-active {transition: all 1s ease;}
    .slide-fade-leave-active {transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-to{transform: translateY(5px);opacity: 0;}

    .addBtn{
        float: right;
        width: .3rem;
        text-align: center;
    }
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
      padding:2px 20px;
    }
    .deviceCardItem:last-child,.deviceItem:last-child{
      border-bottom: 0;
    }
    .deviceCardItem .cellItem,
    .deviceItem .cellItem{
      margin-top:3px;
    }
    .popupContainer{padding-bottom:15px;}
    .popupContainer .fGrp{overflow: hidden;padding: .1rem;}
    .popupContainer .fGrp .tl{width: 25%;float: left;  text-align: right;padding-top:0.07rem;margin-right: 5%;}
    .popupContainer .fGrp .vl{width: 62%;float: left; text-align: right}
    .popupContainer .fGrp button{padding: .02rem .1rem;width: .8rem;outline: none;border-radius: 4px;box-shadow:none;margin-top: .02rem;margin-right: .05rem;}
    .modalBtn{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        margin-right: .05rem;
    }
    .popupContainer input,.popupContainer select{
      color:#000;
    }
    .popupContainer .modalBtn{
      border: 1px solid rgb(61, 129, 241);
    }
    .userPrefixPop.mint-popup{
      background-color: #212227;
      width: 100%;
      height: 100%;
    }
    /*.deviceConfItem{overflow: hidden;padding: .1rem;}
    .deviceConfItemTitle{width: 40%;float: left;  text-align: left;padding-top:0.07rem;}
    .deviceConfItemValue{width: 60%;float: left; text-align: right}
    .deviceConfItem button{padding: .02rem .1rem;}*/

</style>
<style>
    .me .mint-cell-wrapper{background-image: none;color: #EEEEEE;}
    .me .mint-cell:last-child{background-image: none;}
    .me .mint-cell-swipe{border-bottom:4px solid #212227;}
    .me .mint-cell-swipe:last-child{border-bottom: 0;}
    .me .mint-checkbox-label{font-size: .12rem;margin-left:0;}
    .me .mint-checklist-label{padding:0;}
    .me .mint-checkbox-core{width:15px;height:15px;}
    .GroupItemValue1 .mint-checklist-title{display:none;}
    .me .mint-cell-value{
      display: block;
      color: #EEEEEE;
      padding: .1rem 0;
      width:100%;
      font-size:.16rem;
    }
    .me .mint-cell-swipe-buttongroup{
      border-radius:4px;
      display:table;
    }
    .me .mint-cell-swipe-button{
      height:100%;
      display:table-cell;
      vertical-align:middle;
      color:#000;
    }
    .mint-cell-right .mint-cell-swipe-button:first-child{
      background-color:#bae7ff;
      border-top-left-radius:4px;
      border-bottom-left-radius:4px;
    }
    .mint-cell-right .mint-cell-swipe-buttongroup .mint-cell-swipe-button:nth-child(2){
      background-color:#91d5ff;
    }
    .mint-cell-right .mint-cell-swipe-button:last-child{
      background-color:#69c0ff;
      border-top-right-radius:4px;
      border-bottom-right-radius:4px;
    }
    .mint-popup{border-radius: 6px;background-color: #EEE;}
    .me .mint-popup{width: 90%;overflow-y: auto;border-radius: 4px;}
    .me .popupContainer .mint-cell-title{width:40%;text-align: left;}
    .me .popupContainer .mint-cell-value{width:60%;text-align: right;padding:0;}
    .me .popupContainer .mint-cell{min-height:24px;}
    .onlineStyle{
      color:#00ff00;
    }
    .onBoardStyle{
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
    /*.mint-toast{
      z-index:2002;
    }*/
    .me .mint-navbar{background-color: #222;}
    .me .mint-cell{background-color: #35363a;}
    .me .mint-checklist .mint-cell-value{display: none;}
    .devRightsTable{
      width:100%; 
      padding:5px 10px;
    }
    .devRightsTable table{
      width:100%;
    }
    .devRightsTable table td,.devRightsTable table th{
      padding:5px;
    }
    #systemInfo .mint-cell-value{
      flex:1
    }
</style>