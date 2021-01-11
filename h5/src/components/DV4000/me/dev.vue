<template>
  <div class="DevMan">
    <div class="Group">
      <div class="GroupTitle" @click="DeviceShow=!DeviceShow">
        背包
        <i class="titleIcon fa" :class="[DeviceShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getDeviceList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addDevice" v-if="devAddShow"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="DeviceShow" id="devList">
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefix.join(',')">
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
                <span class="cellName cellLabel" style="float: left;">用户组</span>
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
    <!-- 用户组 -->
    <mt-popup v-model="userPrefixPop" position="bottom" popup-transition="popup-slide" class="userPrefixPop">
      <span class="chevronDown">
        <i class="fa fa-chevron-down" @click.stop="userPrefixPop=false"></i>
      </span>
      <mt-checklist
        v-model="selectPrefix"
        :options="prefixArr"
        @change="changePrefixSelect">
      </mt-checklist>
    </mt-popup>
    <!-- 网卡信息 -->
    <mt-popup class="cardInfoPop" v-model="deviceCardVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          网卡信息
          <i class="popupCloseBtn fa fa-times" @click="deviceCardVisible = false"></i>
        </div>
        <template v-for="(item,i) in deviceCardList">
          <div class="deviceCardItem">
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">网卡</span>
              <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.card_name }}</span>
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
              <input type="text" class="ItemInput" v-model="options.dev_name" required pattern="[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,(),空格" :disabled="disable.dev_name">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">仪器名(长度1-15,仅支持中文,字母,数字,+,-,@,()和空格)</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.dev_sn" required pattern="[0-9]{10}" title="10位数字序列号" :disabled="deviceConfigType == 'edit'"> 
            </div>
          </div>
          <div class="fGrp" v-if="show.devPrefix==true">
            <div class="tl">用户组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.prefix" :disabled="deviceConfigType == 'edit'">
                <template v-for="(item,i) in deviceConfigPrefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="deviceConfigType == 'edit' && show.devUser==true">
            <div class="tl">使用者</div>
            <div class="vl">
              <input class="ItemInput" :disabled="disable.devUser" @click="userListPop = true" v-model="options.devUser.join(',')">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">
                仅显示非管理员用户
              </p>
            </div>
          </div>
          <div class="fGrp" v-if="deviceConfigType == 'edit'">
            <div class="tl">接收机</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.matchRcv" style="margin-bottom: 5px;" @change="changeMatchRcv">
                <template v-for="(item,i) in deviceConfigServerOptions">
                  <option :value="item.value" :style="'color:'+item.color+''">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="deviceConfigType == 'edit' && boardShow">
            <div class="tl">板卡</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.matchBoard">
                <template v-for="(item,i) in deviceConfigBoardOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="deviceConfigType == 'edit'">
            <div class="tl"></div>
            <div class="vl">
              <button @click.prevent="saveMatch" style="border:1px solid #666;">保存绑定</button>
              <button @click.prevent="unbindMatch" style="border:1px solid #666;">解除绑定</button>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button class="modalBtn" @click="deviceConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>

    <mt-popup v-model="userListPop" position="bottom" popup-transition="popup-slide" class="userPrefixPop">
      <span class="chevronDown">
        <i class="fa fa-chevron-down" @click.stop="userListPop=false"></i>
      </span>
      <mt-checklist
        v-model="options.devUser"
        :options="deviceConfigUserOptions"
        @change="">
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
        userPrefixPop:false,
        userListPop:false,
        boardShow:false,
        deviceList:[],
        disable:{
          dev_name:false,
          devUser:false,
        },
        show:{
          devPrefix:true,
          devUser:true,
        },
        options:{
          dev_name:"",//背包名称
          dev_sn:"",//序列号
          prefix:"",//用户组
          devUser:[''],//使用者
          matchRcv:"",
          matchBoard :"",
          matchRcv_old:"",
          matchBoard_old :"",
          rcv_sn:"",
          rcv_name:"",
          board_id:"",
          user_id:"",
        },
        userPrefixShow:true,
        devAddShow:true,
        devDelShow:true,
        selectPrefix:['all'],
        prefixArr:[],
        deviceCardList : [],
        deviceCardVisible :false,
        deviceConfigPrefixOptions:[],
        deviceConfigUserOptions:[],
        deviceConfigServerOptions:[],
        deviceConfigBoardOptions:[],
        deviceConfigType:'add',
        deviceConfigVisible:false,
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
          //this.getDeviceList();
        }
      }
    },
    created(){  //生命周期-页面创建后
      this.initShowContent();
      //this.getDeviceList();
    },
    activated(){
      console.log("devMan activated")
      this.initShowContent();
      //this.getDeviceList();
    },
    methods:{
      ...mapMutations({
          
      }),
      initShowContent(){
        var that = this;
        if(that.user.userGroup == that.ADMIN){
          that.devAddShow = true;
          that.devDelShow = true;
        }else{
          that.devAddShow = false;
          that.devDelShow = false;
        }
        if(this.user.userGroup == this.SUPER){//"001-admin"
          that.userPrefixShow = true;
          that.$global.getUserPrefixArr(function(data) {
            var options = [],prefixIdArr = [];
            options.push({label:"全部", value:"all"});
            for(var i=0; i<data.length; i++){
              options.push({label:data[i].prefix_name, value:data[i].prefix});
            }
            options.push({label:"无", value:""})
            
            that.prefixArr = options;
            that.selectPrefix = ['all'];
            //背包列表
            that.getDeviceList();
          })
        }else{
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
        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:that.$qs.stringify({
            getDevices:true,
            userId: that.user.id,
            userGroup : that.user.userGroup,
            selectByPrefix : selectPrefix,
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
        if(selectPrefix[selectPrefix.length-1] == "all"){//当前选中all
          that.selectPrefix = ["all"];  
        }else{
          if(selectPrefix.length > 1){
            if($.inArray("all",selectPrefix) != -1){
              selectPrefix.splice(selectPrefix.indexOf("all"),1); 
            }
          }
          that.selectPrefix = selectPrefix;  
        } 
        that.getDeviceList();
      },
      showDeviceCard(item){
        var that = this;
        this.deviceCardList = [];
        this.deviceCardVisible = true;
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
      deleteDevice(item){
        var that = this;
        this.$messagebox.confirm("确定删除此背包?").then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delDevSns:item.dev_sn,
                userGroup:that.user.userGroup
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
                  message: res.res.reason
                });
              }
              that.getDeviceList();
            })
            .catch(function (error) {
              console.log(error)
            })
        });
      },
      addDevice(){
        this.getDevPrefixList();
        this.deviceConfigVisible = true;
        this.deviceConfigType = "add";
        this.clearDevPopup();
      },
      editDevice(item){
        console.log("编辑页面")
        console.log(item)
        var that = this;
        that.deviceConfigType = "edit";
        that.options.user_id = item.user_id;
        that.options.dev_name = item.dev_name;
        that.options.dev_sn = item.dev_sn;
        that.options.rcv_name = item.rcv_name?item.rcv_name:"";
        that.options.rcv_sn = item.rcv_sn?item.rcv_sn:"";
        that.options.matchBoard = item.board_id?item.board_id:"";
        that.options.matchBoard_old = item.board_id?item.board_id:"";
        that.options.board_id = item.board_id?item.board_id:"";

        var hasRights = that.$global.judgeUserHasDevRights();
        if (!hasRights) {//没有权限不能编辑背包名称
          that.disable.devName = true;
        }
        that.getDevPrefixList(function(){//获取用户组下拉列表options
          that.options.prefix = item.prefix; //赋值当前设备所属用户组
          that.$global.initUserListByPrefix(item.prefix, function(data) {//获取用户下拉列表options
            that.deviceConfigUserOptions = data.userArr.map(function(item){
              return {"label":item.text,"value":item.value}
            });
            that.$global.getUsersByDevSn(item.dev_sn,function(data){
              var users = data.devUser;
              that.options.devUser = data.devUser;
              var hasRights = "";
              hasRights = that.$global.judgeUserHasDevRights();
              if (hasRights) {
                that.disable.devUser = false;
              } else {
                that.disable.devUser = true;
              }
            });//获取当前设备的用户
          });
        });
        
        //初始化接收机下拉列表
        that.getRcvSelectAndVal(item);
        that.deviceConfigVisible = true;
      },
      getDevPrefixList(cb){
        var that = this;
        if(that.user.id == that.SUPER){
          that.$global.getUserList(function(data){
            that.deviceConfigPrefixOptions = data;
            if(cb){
              cb()
            }
          })
        }else{
          var option = [{
            text: that.user.id,
            value: that.user.id
          }];
          that.deviceConfigPrefixOptions = option;
          that.options.prefix = option[0].value;
        }
      },
      getRcvSelectAndVal(row){
        var that = this;
        this.$global.getRcvList4000(function(data){
          that.formatRcvList(data) 
        });
      },
      formatRcvList(data){
        console.log("formatRcvList")
        var that = this;
        console.log(that.options)
        var result = [];
        //判断是否有当前配对的接收机的权限
        var bFind = false;
        if (data.length == 0) {//无可用接收机，显示空值
          console.log("无可用接收机，显示空值")
          result.push({
            value: that.options.rcv_sn,
            text: that.options.rcv_name
          });
          that.deviceConfigServerOptions = result;
        } else {//有可用接收机，赋值接收机列表和当前配对的接收机
          console.log("有可用接收机，赋值接收机列表和当前配对的接收机")
          for (let k = 0; k < data.length; k++) {
            if (data[k].rcv_sn == that.options.rcv_sn) {
              bFind = true;
              break;
            }
          }
          console.log("bFind:"+bFind);
          if (!bFind) {
            result.push({
              value: that.options.rcv_sn?that.options.rcv_sn:"",
              text: that.options.rcv_name?that.options.rcv_name:""
            });
          }
          $.each(data, function(key, value) {
            var add = "";
            if(value.online == "1"){
              add = "在线 : ";
            }else{
              add = "离线 : ";
            }
            result.push({
              value: value.rcv_sn,
              text: add+value.rcv_name
            });
          });
          that.deviceConfigServerOptions = result;
          console.log("result:")
          console.log(result)
          that.options.matchRcv = that.options.rcv_sn;
          that.options.matchRcv_old = that.options.rcv_sn;
        }
        if(!that.options.rcv_sn){//当前配对的接收机为空，则板卡列表显示为空
          that.deviceConfigBoardOptions = [];
          that.options.matchBoard = "";
          that.options.matchBoard_old = "";
        }else{//当前配对的接收机不为空，获取当前接收机对应的可用板卡
          that.$global.getUnusedBoard(that.options.rcv_sn, function(data){
           that.formatBoardList(data) 
          });
        }
      
        /*//获取当前所选的接收机的板卡
        bFind = false;
        for (var i = 0; i < result.length; i++) {
          if (result[i]['value'] == that.ActiveDevice.rcv_sn) {
            $('#edit_rcv_sel').selectpicker('val', result[i]['value']);
            $('#edit_rcv_sel').attr("oVal", result[i]['value']);
            getUnusedBoard(result[i]['value'], curEditMatchRow, row.board_id, cb);
            bFind = true;
            break;
          }
        }
        if (!bFind) {
          getUnusedBoard(result[0]['value'], curEditMatchRow, row.board_id, cb);
        }*/
        if(that.options.rcv_sn != "" && that.options.rcv_sn != null){
          var rcvMode = that.$global.getRcvMode(that.options.rcv_sn.substr(-4));
          if (rcvMode == 'DV4000RV') {
            that.boardShow = false;
          } else {
            that.boardShow = true;
          }
        }else{
          that.boardShow = true;
        }
      },
      formatBoardList(data){
        console.log("formatBoardList")
        console.log(data);

        var result = [];
        var that = this;
        console.log(that.options);
        //无可用板卡
        if (data.length == 0) {
          if (that.options == undefined) {
            result.push({
              value: -1,
              text: '无可用板卡'
            });
            that.setBoardListAndValue(result, -1);
          } else {
            if((that.options.matchRcv == that.options.rcv_sn) && that.options.matchRcv!=""){
              result.push({
                value: that.options.board_id,
                text: '板卡' + that.options.board_id
              });
              that.setBoardListAndValue(result, that.options.board_id);
            }else{
              result.push({
                value: -1,
                text: '无可用板卡'
              });
              that.setBoardListAndValue(result, -1);
            }
          }
        } else {
          if (that.options && that.options.rcv_sn == that.options.matchRcv) {
            result.push({
              value: that.options.board_id,
              text: '板卡' + that.options.board_id
            });
          }
          $.each(data, function(key, value) {
            result.push({
              value: value,
              text: '板卡' + value
            });
          });
          if(that.options.board_id){
            that.setBoardListAndValue(result, that.options.board_id);
          }else{
            that.setBoardListAndValue(result, result[0]["value"]);
          }
        }
      },
      setBoardListAndValue(result,value){
        var that = this;
        that.deviceConfigBoardOptions = result;
        that.options.matchBoard = value;
        that.options.matchBoard_old = value;
      },
      //保存绑定
      saveMatch(){
        console.log("dd saveMatch");
        var that = this;
        var dev_sn = that.options.dev_sn;
        var dev_name = that.options.dev_name;
        var rcv = that.options.matchRcv;
        var board = that.options.matchBoard;
        console.log("dev_sn:"+dev_sn);
        console.log("dev_name:"+dev_name);
        var sub = rcv.substr(-4);
        //未修改
        if(that.options.matchRcv_old == rcv
          && that.options.matchBoard_old  == board){
          return;
        }
        
        //是否是虚拟接收机
        var DV4000RV = false;
        if (sub == '2999') {//虚拟接收机
          DV4000RV = true;
          board = dev_sn;
        } else {//实体接收机
          //无可用板卡
          if (board == '' || board == '-1' && !DV4000RV) {
            return;
          }
          board = (+board) - 1;
        }

        var text = '是否切换配对关系？';
        that.$global.getDevPushStatus(dev_sn, function(data) {
          if (data == 'norcv') {
            console.log("norcv")
            that.$global.editMatch(rcv,board,dev_sn,dev_name);
          } else {
            if (data == '1') {
              text = '是否需要先停止推流再切换配对关系？'
            }
            that.$messagebox.confirm(text).then(
              action => {
                that.$global.editMatch(rcv,board,dev_sn,dev_name);
            }).catch();
          }
        });
      },
      //解除绑定
      unbindMatch(){
        var that = this;
        var text = '是否解除配对关系？';
        var dev_sn = that.options.dev_sn;
        var rcv_sn = that.options.matchRcv;
        var board_id = that.options.matchBoard;
        var bindChart = dev_sn + "/" +rcv_sn + "/" + board_id;
        that.$global.getDevPushStatus(dev_sn, function(data) {
          if (data == '1') {
            text = '是否需要先停止推流再解除配对关系？'
          }
          //询问
          that.$messagebox.confirm(text).then(
            action => {
              //that.$global.clickRecordBtn('0');
              
              that.$axios({
                method: 'post',
                url:"/page/index/indexData.php",
                data:that.$qs.stringify({
                  delMatch:true,
                  dev_sn: dev_sn
                }),
                Api:"delMatch",
                AppId:"android",
                UserId:that.user.id
              })
              .then(function (response) {
                let res = response.data;
                if(res.res.success){
                 //chars数据删除--start
                  that.$global.initChartSessionData(bindChart, "del");
                  //chars数据删除--end  
                  that.options.matchBoard = "";
                  that.options.matchRcv = "";
                  that.options.rcv_sn = "";
                  that.options.rcv_name = "";
                  that.options.board_id = "";
                  that.$global.getRcvList4000(function(data){
                    that.formatRcvList(data) 
                  });
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
            }).catch();
        });
      },
      changeMatchRcv(){
        //接收机下拉框切换
        var that = this;
        var rcvSn = that.options.matchRcv;
        //虚拟接收机
        var rcvMode = that.$global.getRcvMode(rcvSn.substr(-4));
        if (rcvMode == 'DV4000RV') {
          that.boardShow = false;
        } else {
          that.boardShow = true;
          that.$global.getUnusedBoard(rcvSn, that.formatBoardList);
        }
      },
      clearDevPopup(){
        this.options.devName = "";
        this.options.devSn = "";
        this.options.prefix = "";
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
          for (var i = 0; i < deviceList.length; i++) {
            if (deviceList[i].dev_sn == devSn) {
              that.$toast({
                message: "该背包已添加!",
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
              addDev:true,
              devName:that.options.devName,
              devSn:that.options.devSn,
              devModel:mode,
              prefix: that.options.prefix,
              logUser: that.user.id
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
          var strValue = '';
          var devUser = that.options.devUser;
          if (devUser && devUser.length != 0) {
            for (var i = 0; i < devUser.length; i++) {
              var id = devUser[i];
              //前缀
              if (that.user.id != that.SUPER) {
                id = that.user.prefix + '-' + devUser[i];
              }
              if (strValue == '') {
                strValue = id;
              } else {
                strValue += ',' + id;
              }
            }
          }
          this.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:this.$qs.stringify({
              editDev:that.options.dev_sn,
              devName:that.options.dev_name,
              devUser:strValue,
              logUser:that.user.id,
              prefix:that.user.prefix
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
  .ItemSelect{
    width:100%;
    height: .26rem;
    border: 1px solid #3d81f1;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
    font-size: .12rem;
    background-color: #FFFFFF;
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
  .addBtn{
    float: right;
    width: .3rem;
    text-align: center;
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
  .userPrefixPop.mint-popup{
    background-color: #212227;
    width: 100%;
    height: auto;
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
    padding:2px 20px;
  }
  .deviceCardItem:last-child,.deviceItem:last-child{
    border-bottom: 0;
  }
  .deviceCardItem .cellItem,
    .deviceItem .cellItem{
    margin-top:3px;
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
  .popupContainer .fGrp .tl{width: 25%;float: left;  text-align: right;padding-top:0.07rem;margin-right: 5%;}
  .popupContainer .fGrp .vl{width: 62%;float: left; text-align: right}
  .popupContainer .fGrp button{padding: .02rem .1rem;width: .8rem;outline: none;border-radius: 4px;box-shadow:none;margin-top: .02rem;margin-right: .05rem;}
  .onlineStyle{
    color:#00ff00;
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
  .mint-toast{
    z-index:2010 !important;
  }
</style>