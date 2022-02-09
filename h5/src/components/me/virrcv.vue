<template>
  <div class="VirRcvMan">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="changeVirRcvShow">
        虚拟服务器
        <i class="titleIcon fa chevronStyle" :class="[ReceiverShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
      </div>
      <mt-popup v-model="ReceiverShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div class="GroupItem" v-if="ReceiverShow" id="rcvList" style="height:100%">
          <div class="popTitle">
            <div class="back">
              <div  @click="ReceiverShow=false" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">虚拟服务器</span>
              </div>
              <i class="titleIcon addBtn fa fa-refresh" @click.stop="getReceiverList"></i>
              <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addReceiver" v-if="rcvAddShow"></i>
              <input type="text" v-model="options.searchRcv" @click.stop="" @keyup.stop="searchVirRcvByFilter" class="searchInput">
            </div>
          </div>
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefixName.join(',')" class="breakAll">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <div class="popContentStyle">
            <template v-for="(item,i) in receiverShowList">
              <mt-cell-swipe
                :right="[ 
                {content: '背包',handler:() => showDevice(item)},
                {content: '编辑',style:{}, handler:() => editReceiver(item)},
                {content: '删除',style:{display:rcvDelShow?'':'none'}, handler:() => deleteReceiver(item)}
                ]">
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">服务器名称</span>
                  <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.rcv_name }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">状态</span>
                  <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.online }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">序列号</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.rcv_sn }}</span>
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
                  <span class="cellName cellLabel" style="float: left;">用户昵称</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.user_name }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">映射IP</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.rcv_ip }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">本地IP</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.rcv_ownIP }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">型号</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.rcv_model }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">系统配置</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.infoStr }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">软件版本</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.softVer }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">MAC</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.rcv_mac }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">可用更新</span>
                  <span class="cellName cellValue" style="float: right;" :style="{color:item.upgradeColor}">{{ item.upgradeState }}</span>
                </div>
              </mt-cell-swipe>
            </template>
          </div>
        </div>
      </mt-popup>
      <!-- </transition> -->
    </div>
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
    <!-- 背包信息 -->
    <mt-popup v-model="deviceVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          背包
          <i class="popupCloseBtn fa fa-times" @click="deviceVisible = false"></i>
        </div>
        <template v-for="(item,i) in devicePopupList">
          <div class="deviceItem">
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">背包序列号</span>
              <span class="cellName cellValue" style="float: right;">{{ item.board_id }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">状态</span>
              <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.online }}</span>
            </div>
          </div>
        </template>
      </div>
    </mt-popup>
    <!-- 虚拟服务器配置 -->
    <mt-popup v-model="receiverConfigVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          虚拟服务器配置
          <i class="popupCloseBtn fa fa-times" @click="receiverConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitReceiverConfig">
          <div class="fGrp">
            <div class="tl">名称</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.rcvName" required :disabled="disable.rcvName">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">名称(长度1~15，仅支持中文,字母,数字,+,-,@,(),和空格)</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.rcvSn" required :disabled="disable.rcvSn"> 
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.prefix" @change="changePrefixFun" :disabled="disable.prefix">
                <template v-for="(item,i) in receiverConfigPrefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户昵称</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.rcvUser" :disabled="disable.rcvUser">
                <template v-for="(item,i) in receiverConfigUserOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="receiverConfigType=='edit'">
            <div class="tl">系统配置</div>
            <div class="vl">
               <mt-field type="textarea" rows="3" v-model="options.infoStr" readonly="readonly" style="word-break: break-all;"></mt-field>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">立即更新</div>
            <div style="margin-top:5px;">
              <div v-if="upgradeDiv">
                <span style="color: #ff9945;">有新版本!</span>
                <button type="button" id="upgradeBtn" @click="upgradeVirRcv('upgrade')" v-if="user.userGroup == ADMIN">更新</button>
                <span> -> </span>
                <span style="color: #ff9945">{{ newVerStr }}</span>
              </div>
              <div v-if="rollbackDiv">
                <span style="color: #2de505;">已是最新版本!</span>
                <div v-if="rollbackBtnDiv">
                  <button type="button" @click="upgradeVirRcv('rollback')" v-if="user.userGroup == ADMIN">回退</button>
                  <span> -> </span>
                  <span>{{ oldVerStr }}</span>
                </div>
              </div>
              <div v-if="noNewVer">
                <span>无可用升级包!</span>
              </div>
            </div>
          </div>
          <div class="fGrp" style="text-align: right" v-if="show.editBtn">
            <button type="button" @click="receiverConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button type="submit">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { } from '../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "VirRcvMan",
    data(){
      return{
        selected: '1',
        SUPER : SUPER,
        ADVANCE : ADVANCE,
        NORMAL : NORMAL,
        ADMIN : ADMIN,
        ReceiverShow:false,
        rcvAddShow:true,//添加按钮
        rcvDelShow:true,//删除按钮
        receiverList:[],
        receiverShowList:[],
        receiverConfigVisible:false,
        receiverConfigType:'add',
        options:{
          searchVirRcv:"",
          userId:"",
          rcvName:"",
          rcvSn:"",
          prefix:"",
          rcvUser:"",
          rcv_online:"",
          rcv_autoUpgrade:"",
        },
        noNewVer:false,
        rollbackDiv:false,
        rollbackBtnDiv:false,
        upgradeDiv:false,
        newVerStr:"",
        oldVerStr:"",
        deviceVisible:false,
        devicePopupList:[],
        receiverConfigPrefixOptions:[],
        receiverConfigUserOptions:[],
        /*用户组*/
        userPrefixShow:true,//用户组过滤
        selectPrefixOptions:[],//用户组options
        selectPrefix:[],//选中的用户组
        selectPrefixName:[],//显示过滤组的名称
        prefixArr:[],//用户组下拉框数据
        userPrefixPop:false,//用户组pop的show,
        disable:{
          rcvName : false,
          rcvSn : false,
          prefix : false,
          rcvUser : false,
        },
        show:{
          editBtn:true,
        }
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.getReceiverList();
        }
      }
    },
    created(){  //生命周期-页面创建后
      var that = this;
      this.initShowContent();
    },
    activated(){
      console.log("devMan activated")
      this.initShowContent();
    },
    methods:{
      ...mapMutations({
          
      }),
      changeVirRcvShow(){
        this.ReceiverShow = !this.ReceiverShow;
        this.initShowContent();
      },
      /*changeVirRcvShowStatus(){
        if(this.ReceiverShow == true){
          $(".VirRcvMan").css("height",'auto');
        }else{
          $(".VirRcvMan").css("height",'100%');
        }
      },*/
      searchVirRcvByFilter(){
        var that = this;
        var receiverList = that.receiverList;
        var filterRcvList = [];
        var filter = that.options.searchRcv;
        if(filter && filter != ""){
          var len = receiverList.length;
          for(var i=0; i<len; i++){
            for(var key in receiverList[i]){
              if(receiverList[i][key]){
                if(receiverList[i][key].toString().indexOf(filter) != -1){
                  filterRcvList.push(receiverList[i]);
                  break;
                }
              }
            }
          }
          that.receiverShowList = filterRcvList;
        }else{
          that.receiverShowList = receiverList;
        }
      },
      initShowContent(){
        var that = this;
        if(that.user.userGroup == that.ADMIN){
          that.rcvAddShow = true;
          that.rcvDelShow = true;
          that.userPrefixShow = true;
          that.$global.getChildGrpArr(that.user.prefix, function(data) {
            var data = that.$global.initPrefixData(data);
            that.selectPrefixOptions = data.selectPrefixOptions;
            that.selectPrefix = data.selectPrefix;
            that.selectPrefixName = data.selectPrefixName;
            //背包列表
            that.getReceiverList();
          })
        }else{
          that.rcvAddShow = false;
          that.rcvDelShow = false;
          that.userPrefixShow = false;
          that.getReceiverList();
        }
      },
      changePrefixSelect(){
        var that = this;
        var selectPrefix = that.selectPrefix;
        var data = that.$global.getPrefixShow(that.selectPrefix, that.selectPrefixOptions);
        that.selectPrefix = data["selectPrefix"];  
        that.selectPrefixName = data["selectPrefixName"];
        that.getReceiverList();
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
      getReceiverList(){
        var that = this;
        var selectPrefix = that.formatUserSelect();
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getRcv:true,
            userId: that.user.id,
            userGroup: that.user.userGroup,
            selectByPrefix: selectPrefix,
            logPrefix: that.user.prefix,
            type: "virtual",
          }),
          Api:"getRcv",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            var color = '#ffffff';
            var str = '无';
            for(var i=0; i<data.length; i++){
              var row = data[i];
              //不在更新中
              if(row['autoUpgrade'] == 0){
                if(row['newestVer'] != ''){
                  var newVer = row['newestVer'].replace(/[^0-9]/ig,"");
                  var softVer = row['softVer'].replace(/[^0-9]/ig,"");
                  if(newVer == softVer){
                    str = '已是最新';
                    color = GREEN;
                  }/*else if(newVer > softVer){
                    str = '有更新('+row['newestVer']+')';
                    color = ORANGE;
                  }*/else{
                    str = '有更新('+row['newestVer']+')';
                    color = ORANGE;
                  }
                }
              }else{
                if(row['autoUpgrade'] == 1){
                  str = '更新中 '+row['upgradeProc'] +'%';
                }else{
                  str = '回退中';
                }
                color = BLUE;
              }
              data[i]["upgradeState"] = str;
              data[i]["upgradeColor"] = color;
            }
            var mapArr = {"直播":1,"在线":2,"离线":3};
            that.receiverList = data.sort(function(a, b){
              return (mapArr[a.online] - mapArr[b.online])
            });
            that.searchVirRcvByFilter();
          }else{
            that.receiverList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      showDevice(item){
        console.log("showDevice")
        var that = this;
        this.devicePopupList = [];
        this.deviceVisible = true;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getboardByVirRcvSn:true,
            rcvSN: item.rcv_sn,
            user_Id:that.user.id,
            logGroup: that.user.userGroup,
            logPrefix: that.user.prefix,
          }),
          Api:"getboardByVirRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          console.log(res)
          if(res.res.success){
            that.devicePopupList = res.data;
          }else{
            that.devicePopupList = [];
          }
          console.log("that.devicePopupList")
          console.log(that.devicePopupList)
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      editReceiver(item){
        var that = this;
        this.receiverConfigVisible = true;
        this.receiverConfigType = "edit";
        this.getDevPrefixList(item);
        this.options = {
          userId:item.user_id,
          rcvName:item.rcv_name,
          rcvSn:item.rcv_sn,
          rcv_online:item.online,
          rcv_autoUpgrade:item.autoUpgrade,
          infoStr:item.infoStr
        }
        var hasRights = that.$global.judgeUserHasRcvRights(item.rcv_sn, that.receiverShowList);
        if (!hasRights) {
          that.disable.rcvName = true;
        }
        that.disable.rcvSn = true;
        //普通用户只能看不能编辑(高级用户可编辑名称，管理员可编辑名称和选择用户、用户组)
        if(that.user.userGroup == ADMIN){//管理员组编辑接收机时，可进行用户组，用户切换操作
          that.disable.rcvName = false;
          that.disable.prefix = false;
          that.disable.rcvUser = false;
          that.show.editBtn = true;
        }else if(that.user.userGroup == ADVANCE){//高级用户组编辑接收机时，只可编辑名称，用户组，用户只显示不可操作
          that.disable.rcvName = false;
          that.disable.prefix = true;
          that.disable.rcvUser = true;
          that.show.editBtn = true;
        }else if(that.user.userGroup == NORMAL){//高级用户组不可编辑接收机，只可显示
          that.disable.rcvName = true;
          that.disable.prefix = true;
          that.disable.rcvUser = true;
          that.show.editBtn = false;
        }
        //升级
        if (item['newestVer'] != ''){
          this.noNewVer = false;
          //已是最新版本
          var newVer = item['newestVer'].replace(/[^0-9]/ig,"");
          var softVer = item['softVer'].replace(/[^0-9]/ig,"");
          if(newVer == softVer){
            this.rollbackDiv = true;
            this.upgradeDiv = false;
            //回退按钮是否显示
            if(item['oldVer'] != ''){
              this.rollbackBtnDiv = true;
              this.oldVerStr = item['oldVer'];
            } else {
              this.rollbackBtnDiv = false;
            }
          } else {
            //有新版本
            this.upgradeDiv = true;
            this.rollbackDiv = false;
            this.newVerStr = item['newestVer'];
          }
        } else {
          //无可用升级包
          this.upgradeDiv = false;
          this.rollbackDiv = false;
          this.noNewVer = true;
        }
      },
      deleteReceiver(item){
        var that = this;
        var delBroad = false;
        if(item.online == "直播"){
          delBroad = true;
          that.$toast({
            message: "当前设备正在直播!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var rcvSn = item.rcv_sn;
        var text = '确认删除选中设备?';
        this.$messagebox.confirm(text).then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delRcvSns: rcvSn,
                userId: that.user.id
              }),
              Api:"delRcv",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.getReceiverList();
                that.receiverConfigVisible = false;
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
      submitReceiverConfig(){
        var that = this;
        var rcvName = this.options.rcvName;
        var rcvSn = this.options.rcvSn;
        var sub = rcvSn.substr(-4);
        var mode = this.$global.getRcvMode(rcvSn.substr(-4));
        var upgrade = 0;
          //接收机名称校验
        var len = this.$global.SubstrFitCn(rcvName, 0);//匹配中文，中文按一个字符处理
        if(len > 15){
          that.$toast({
            message: "接收机名称长度不超过15!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!this.$global.nameCheckType4(rcvName)) {//未匹配中文长度(中文按一个字符处理)
          that.$toast({
            message: "请按要求输入接收机名称!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(sub != "2999"){//1080只支持添加虚拟接收机(2999)
          that.$toast({
            message: "该序列号不支持添加!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!this.$global.isValidRcvSn(rcvSn)) {
          that.$toast({
            message: "请输入10位数字或字母的序列号!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!mode) {
          that.$toast({
            message: "接收机型号不支持!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(!this.options.rcvUser){
          that.$toast({
            message: "请选择虚拟服务器所属用户!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if(that.receiverConfigType == "add"){
          for(var i=0; i<this.receiverList.length; i++){
            if (this.receiverList[i].rcv_sn == rcvSn) {
              that.$toast({
                message: "该接收机已添加!",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            saveRcv:true,
            rcvName: that.options.rcvName,
            rcvSn: that.options.rcvSn,
            rcvModel: mode,
            userId: that.user.id,
            prefix: that.options.prefix,
            rcvUser: '',
            upgrade:0,
            type: that.receiverConfigType,
            user_id:that.options.rcvUser
          }),
          Api:"saveRcv",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getReceiverList();
            that.receiverConfigVisible = false;
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
      addReceiver(){
        this.receiverConfigVisible = true;
        this.receiverConfigType = "add";
        this.options.rcv_online = "离线";
        this.options.rcv_autoUpgrade = "0";
        this.disable.rcvSn = false;
        this.getDevPrefixList();
        this.clearRcvPopup();
      },
      changePrefixFun(){
        var that = this;
        that.$global.getNewUserListByPrefix(that.options.prefix, function(userList){
          if(userList.length != 0){
            that.receiverConfigUserOptions = userList;
            that.options.rcvUser = userList[0]["value"];
          }else{
            that.receiverConfigUserOptions = [];
            that.options.rcvUser = "";
          }
        })
      },
      getDevPrefixList(item){
        var that = this;
        that.$global.getNewPrefixList(function(data){
          that.receiverConfigPrefixOptions = data;
          if(that.receiverConfigType == "add"){
            that.options.prefix = data[0]["value"];
          }else{
            that.options.prefix = item.prefix;
          }
          that.$global.getNewUserListByPrefix(that.options.prefix, function(userList){
            that.receiverConfigUserOptions = userList;
            if(that.receiverConfigType == "add"){
              that.options.rcvUser = userList[0]["value"];
            }else{
              that.options.rcvUser = item.user_id;
            }
          })
        });
      },
      clearRcvPopup(){
        this.options.rcvName = "";
        this.options.rcvSn = "";
        //升级
        this.noNewVer = true;
        this.rollbackDiv = false;
        this.upgradeDiv = false;
      },
      upgradeVirRcv(type){
        var that = this;
        var rcvSn = this.options.rcvSn;
        if(!that.$global.isValidRcvSn((rcvSn))){
          return;
        }
        //获取汇聚的在线状态
        var online = that.options.rcv_online;
        if(online != '在线'){
          that.$toast({
            message: "离线或直播中不支持此操作!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //正在更新中或回退中
        var autoUpgrade = this.options.rcv_autoUpgrade;
        if( autoUpgrade != 0){
          that.$toast({
            message: "请稍后再操作!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var upgrade = 0;
        if(type == 'upgrade') {
          upgrade = 1;
        } else if(type == 'rollback') {
          upgrade = 2;
        }
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            upgradeVirRcv: true,
            rcvSn : rcvSn,
            autoUpgrade : upgrade,
          }),
          Api:"upgradeVirRcv",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getReceiverList();
            that.receiverConfigVisible = false;
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
      }
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
  /*.GroupItem{
      padding: .05rem .08rem;
  }*/
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
  .popupContainer .mint-cell{min-height:24px;background-color:#fff !important;}
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
  /*.mint-toast{
    z-index:2010 !important;
  }*/
</style>