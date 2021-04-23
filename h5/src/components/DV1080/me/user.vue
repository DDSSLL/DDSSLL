<template>
  <div class="RcvMan">
    <div class="Group">
      <div class="GroupTitle" @click="AccountShow=!AccountShow">
        用户信息
        <i class="titleIcon fa" :class="[AccountShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getAccountList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addUser" v-if="user.userGroup==ADMIN"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="AccountShow">
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefixName.join(',')">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <template v-for="(item,i) in accountList">
            <mt-cell-swipe
              :right="[ 
              {content: '设备权限',handler:() => showDevAuthority(item)},
              {content: '编辑',handler:() => editUser(item)},
              {content: '删除',style:{display:(user.id!=SUPER || item.id==SUPER)?'none':''}, handler:() => deleteUser(item)}
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户ID</span>
                <span class="cellName cellValue" style="float: right;">
                  <span v-show="[item.id==user.id]">
                    <i class="fa fa-user" style="color: #23b7e5"></i>
                  </span>
                  {{ item.id }}
                </span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户名</span>
                <span class="cellName cellValue" style="float: right;">
                  {{ item.name }}
                </span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户组</span>
                <span class="cellName cellValue" style="float: right;">{{ item.prefix }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户等级</span>
                <span class="cellName cellValue" style="float: right;">{{ item.userGroupName }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">最近登录时间</span>
                <span class="cellName cellValue" style="float: right;">{{ item.loginTime }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">手机号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.mobilePhone }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">邮箱</span>
                <span class="cellName cellValue" style="float: right;">{{ item.emailAddress }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">备注</span>
                <span class="cellName cellValue" style="float: right;">{{ item.remark }}</span>
              </div>
            </mt-cell-swipe>
          </template>
        </div>
      </transition>
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
    <mt-popup v-model="userConfigVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          用户管理
          <i class="popupCloseBtn fa fa-times" @click="userConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitUserConfig">
          <input type="password" style="display:none" id="loginPassword"/>
          <input type="text" style="display:none" id="loginUserName"/>
          <div class="fGrp">
            <div class="tl">用户ID<span class="redText">*</span></div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curUser.id" required pattern="[A-Za-z0-9\u4e00-\u9fa5@+_()（）]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,()" :disabled="curUser.idDisable">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1-15,仅支持中文,字母,数字,+,-,@,()</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户名<span class="redText">*</span></div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curUser.name" required>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户组名<span class="redText">*</span></div>
            <div class="vl">
              <select class="ItemSelect" v-model="curUser.prefix" :disabled="curUser.prefixDisable">
                <template v-for="(item,i) in curUser.prefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="curUser.userEditType == 'add'">
            <div class="tl">登录密码<span class="redText">*</span></div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="curUser.pwd" required pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9_@]{6,16}$" title="6~16位字母,数字,下划线和@组合,至少包含一个数字一个字母"/> 
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;"><!-- pattern="^[A-Za-z0-9_@]{6,16}$" -->
                6~16位字母,数字,下划线和@组合
              </p>
            </div>
          </div>
          <div class="fGrp" v-if="curUser.userEditType == 'add'">
            <div class="tl">确认密码<span class="redText">*</span></div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="curUser.pwd2" required pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9_@]{6,16}$" title="6~16位字母,数字,下划线和@组合,至少包含一个数字一个字母" clearable autocomplete="off" />
            </div>
          </div>
          <div class="fGrp" v-if="curUser.userEditType == 'edit'">
            <div class="tl">重置密码</div>
            <div class="vl">
              <mt-checklist v-model="curUser.pwdReset" :options="[{label: ' ', value: '1'}]">
              </mt-checklist>
            </div>
          </div>
          <div class="fGrp" v-if="curUser.pwdReset == '1'">
            <div class="tl">新密码<span class="redText">*</span></div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="curUser.newPwd" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9_@]{6,16}$" title="6~16位字母,数字,下划线和@组合,至少包含一个数字一个字母"/> 
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;"><!-- pattern="^[A-Za-z0-9_@]{6,16}$" -->
                6~16位字母,数字,下划线和@组合
              </p>
            </div>
          </div>
          <div class="fGrp" v-if="curUser.pwdReset == '1'">
            <div class="tl">确认密码<span class="redText">*</span></div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="curUser.newPwd2" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9_@]{6,16}$" title="6~16位字母,数字,下划线和@组合,至少包含一个数字一个字母" clearable autocomplete="off" />
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户等级</div>
            <div class="vl">
              <select class="ItemSelect" v-model="curUser.userGroup" :disabled="curUser.userGroupDisable">
                <template v-for="(item,i) in curUser.userGroupOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">手机号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curUser.mobilePhone" pattern="^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$" title="请输入正确手机号" >
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">邮箱</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curUser.emailAddress">
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">备注</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curUser.remark">
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button @click="userConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>
    <!-- 设备权限 -->
    <mt-popup v-model="deviceAuthourityVisible" position="right" popup-transition="popup-slide" class="wholePagePop devAuthority">
      <div class="page-navbar">
        <div class="page-title">
          <i class="fa fa-arrow-left" aria-hidden="true" @click="deviceAuthourityVisible = false" style="position:absolute"></i>
          <span class='navTitle'>{{ "用户"+deviceAuthourityName+"设备权限" }}</span>
        </div>
        <mt-navbar v-model="active">
          <mt-tab-item id="1">背包</mt-tab-item>
          <mt-tab-item id="2">汇聚</mt-tab-item>
        </mt-navbar>
        <!-- tab-container -->
        <mt-tab-container v-model="active" style="padding:2px 5px;">
          <mt-tab-container-item id="1" style="overflow-x:auto">
            <table>
              <template v-for="(item,i) in devRightsList">
                <tr>
                  <td :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.dev_name }}</td>
                  <td>{{ item.dev_sn }}</td>
                  <td>{{ item.user_id }}</td>
                  <td>{{ item.prefix }}</td>
                  <td>{{ item.dev_model }}</td>
                </tr>
              </template>
            </table>
          </mt-tab-container-item>
          <mt-tab-container-item id="2" style="overflow-x:auto">
            <table>
              <template v-for="(item,i) in rcvRightsList">
                <tr>
                  <td :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.rcv_name }}</td>
                  <td>{{ item.rcv_sn }}</td>
                  <td>{{ item.user_id }}</td>
                  <td>{{ item.prefix }}</td>
                  <td>{{ item.rcv_model }}</td>
                </tr>
              </template>
            </table>
            <!-- <div class="GroupItem">
              <div class="tableHead">
                <div>汇聚</div>
                <div>序列号</div>
                <div>用户</div>
                <div>组</div>
                <div>型号</div>
              </div>
              <template v-for="(item,i) in devRightsList">
                <div class="tableBody">
                  <div :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.rcv_name }}</div>
                  <div>{{ item.rcv_sn }}</div>
                  <div>{{ item.user_id }}</div>
                  <div>{{ item.prefix }}</div>
                  <div>{{ item.rcv_model }}</div>
                </div>
              </template>
            </div> -->
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
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
        active:"1",
        SUPER : SUPER,
        ADVANCE : ADVANCE,
       	NORMAL : NORMAL,
        ADMIN : ADMIN,
        userGroups:[],//用户组
        AccountShow:false,
        accountList:[],
        userConfigVisible:false,
        deviceAuthourityName:"",
        curUser:{//用户编辑页面
          userEditType:"add",
          nameReadonly:false,
          id:"",
          idDisable:false,
          name:"",//用户名
          oldName:"",
          prefix:"",//用户组名
          prefixOptions:[],//用户组下拉列表
          prefixDisable:false,//用户组disabale
          pwd:"",
          pwd2:"",
          pwdReset:"0",
          newPwd:"",
          newPwd2:"",
          pwdReadonly:false,
          pwd2Readonly:false,
          userGroup:"",//用户等级
          userGroupDisable:false,
          userGroupOptionsOri:[],
          userGroupOptions:[],
          nEnable:"",//启用
          userEnableShow:"",//显示启用
          mobilePhone:"",
          emailAddress:"",
          remark:"",
        },

        deviceAuthourityVisible:false,
        devRightsList:[],
        rcvRightsList:[],
        /*用户组*/
        userPrefixShow:true,//用户组过滤
        selectPrefixOptions:[],//用户组options
        selectPrefix:[],//选中的用户组
        selectPrefixName:[],//显示过滤组的名称
        userPrefixPop:false,//用户组pop的show
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
        }
      }
    },
    created(){  //生命周期-页面创建后
      //this.getAccountList();
      this.initShowContent();
    },
    activated(){
      console.log("devMan activated")
      //this.getAccountList();
      this.initShowContent();
    },
    methods:{
      ...mapMutations({
          
      }),
      initShowContent(){
        var that = this;
        that.getUserGroup(function(groupData){
          that.formatUserGroup(groupData);
          for (var i = 0; i < groupData.length; i++) {
            if (groupData[i].value != that.ADMIN) {
              that.userGroups.push(groupData[i])
            }
          }
          //用户组列表
          that.$global.getChildGrpArr(that.user.prefix,function(data) {
            //添加编辑页面的用户组
            /*for(var i=0; i<data.length; i++){
              that.curUser.prefixOptions.push({text:data[i].prefix_name, value:data[i].prefix});
            }*/
            //列表页面的用户组过滤
            if (that.user.userGroup == ADMIN) {
              that.userPrefixShow = true;//显示用户组过滤
              var data = that.$global.initPrefixData(data);
              that.selectPrefixOptions = data.selectPrefixOptions;
              that.selectPrefix = data.selectPrefix;
              that.selectPrefixName = data.selectPrefixName;
              that.getAccountList();
            } else {
              that.userPrefixShow = false;//隐藏用户组过滤
              that.getAccountList();
            }
          });
        })
      },
      getUserGroup(cb){
        var that = this;
        that.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:that.$qs.stringify({
            getUserGroup : that.user.id,
          }),
          Api:"getUserGroup",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(cb){
              cb(res.data);
            }
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
        that.getAccountList();
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
      getAccountList(){
        console.log("getAccountList")
        var that = this;
        var selectPrefix = that.formatUserSelect();
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getUsers:true,
            userId: that.user.id,
            showPrefix : selectPrefix,
          }),
          Api:"getUsers",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            for(var i=0; i<data.length; i++){
              if (data[i].userGroup == that.ADMIN) {
                data[i]['userGroupName'] = '管理员';
              } else {
                for (var j = 0; j < that.userGroups.length; j++) {
                  if (that.userGroups[j].value == data[i].userGroup) {
                    data[i]['userGroupName'] = that.userGroups[j].text;
                  }
                }  
              }
            }
            that.accountList = res.data;
          }else{
            that.receiverList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      addUser(){
        var that = this;
        that.userConfigVisible = true;
        that.curUser.userEditType = "add";
        that.initUserGroup(function(){
          that.curUser.userGroup = that.curUser.userGroupOptions[0]["value"];
        });
        that.initPrefix(function(){
          that.curUser.prefix = that.curUser.prefixOptions[0]["value"];
        })
        that.clearUserPopup();
      },
      initUserGroup(cb){
        console.log("initUserGroup")
        var that = this;
        that.getUserGroup(function(groupData){
          that.curUser.userGroupOptions = groupData;
          if(cb){
            cb()
          }
        })
      },
      formatUserGroup(data){
        var that = this;
        that.curUser.userGroupOptions = data;
      },
      initPrefix(cb){
        var that = this;
        that.$global.getChildGrpArr(that.user.prefix,function(data) {
          for(var i=0; i<data.length; i++){
            that.curUser.prefixOptions.push({text:data[i].prefix_name, value:data[i].prefix});
          }
          if(cb){
            cb()
          }
        })
      },
      submitUserConfig(){
        var that = this;
        var id = this.curUser.id;
        var name = this.curUser.name;
        var mobilePhone = this.curUser.mobilePhone;
        var emailAddress = this.curUser.emailAddress;
        var remark = this.curUser.remark;
        var pwd = this.curUser.pwd;
        var newPwd = this.curUser.newPwd;
        var type = this.curUser.userEditType;
        if( type == "add"){
          if (this.curUser.pwd != this.curUser.pwd2) {
            that.$toast({
              message: "密码不一致!",
              position: 'middle',
              duration: 2000
            });
            return;
          }  
        }else{
          pwd = this.curUser.newPwd;
          if (this.curUser.newPwd != this.curUser.newPwd2) {
            that.$toast({
              message: "密码不一致!",
              position: 'middle',
              duration: 2000
            });
            return;
          }
        }
        
        if (this.curUser.userEditType == "add") {
          for (var i = 0; i < this.accountList.length; i++) {
            if (this.accountList[i].id == name) {
              that.$toast({
                message: "该用户已添加!",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        if (!this.$global.isValidMail(emailAddress)) {
          that.$toast({
            message: "请输入合法邮箱!",
            position: 'middle',
            duration: 2000
          });
          return;
        }

        if (this.curUser.userEditType == "add") {//只有001-admin可以添加
          this.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:this.$qs.stringify({
              addUser: id,
              name:name,
              pwd: pwd,
              group: that.curUser.userGroup,
              prefix: that.curUser.prefix,
              loginId: id,
              enable: 1,
              mobilePhone: mobilePhone,
              emailAddress: emailAddress,
              remark: remark
            }),
            Api:"addUser",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getAccountList();
              that.userConfigVisible = false;
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
        } else {
          console.log(this.curUser)
          var oldName = this.curUser.id;
          this.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:this.$qs.stringify({
              editUser: id,
              name:name,
              pwd: pwd,
              group: that.curUser.userGroup,
              prefix: that.curUser.prefix,
              loginId: id,
              enable: 1,
              mobilePhone: mobilePhone,
              emailAddress: emailAddress,
              remark: remark
            }),
            Api:"editUser",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getAccountList();
              that.userConfigVisible = false;
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
      },
      showDevAuthority(item){
        var that = this;
        this.devRightsList = [];
        this.rcvRightsList = [];
        this.active = "1";
        this.deviceAuthourityVisible = true;
        this.deviceAuthourityName = item.id;
        this.getDevAuthourData(item.id);
        this.getRcvAuthourData(item.id);
      },
      getDevAuthourData(userId){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getUserDevList: true,
            userId: userId,
          }),
          Api:"getUserDevList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.devRightsList.push({"dev_name": "背包",
                                  "dev_sn": "序列号",
                                  "user_id": "用户",
                                  "prefix": "组",
                                  "dev_model": "型号"}) 
            that.devRightsList = that.devRightsList.concat(res.data);
          }else{
            that.devRightsList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      getRcvAuthourData(userId){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getUserRcvList: true,
            userId: userId,
          }),
          Api:"getUserRcvList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            //that.rcvRightsList = res.data;
            that.rcvRightsList.push({"rcv_name": "汇聚",
                                  "rcv_sn": "序列号",
                                  "user_id": "用户",
                                  "prefix": "组",
                                  "rcv_model": "型号"}) 
            that.rcvRightsList = that.rcvRightsList.concat(res.data);
          }else{
            that.rcvRightsList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      clearUserPopup(){
        this.curUser.id = "";
        this.curUser.idDisable = false;
        this.curUser.name = "";
        this.curUser.pwd = "";
        this.curUser.pwd2 = "";
        this.curUser.mobilePhone = "";
        this.curUser.emailAddress = "";
        this.curUser.remark = "";
      },
      editUser(item){
        var that = this;
        that.userConfigVisible = true;
        that.curUser.userEditType = "edit";
        that.initUserGroup(function(){
          that.curUser.userGroup = that.curUser.userGroupOptions[0]["value"];
          var userGroup = that.user.userGroup;
          that.curUser.userGroup = item.userGroup;
          //用户等级
          if(userGroup == ADMIN){//管理员
            if(item.id != that.user.id){//非自己
              that.curUser.userGroupDisable = false;
            }else{
              that.curUser.userGroupDisable = true;
            }
          }else if(userGroup == ADVANCE || userGroup == NORMAL){//高级用户或普通用户
            that.curUser.userGroupDisable = true;
          }
        });
        that.initPrefix(function(){
          that.curUser.prefix = item.prefix;
        })
        that.curUser.id = item.id;
        that.curUser.idDisable = true;
        that.curUser.name = item.name;
        that.curUser.pwd = item.pwd;
        that.curUser.pwd2 = item.pwd;
        that.curUser.pwdReset = '';
        that.curUser.newPwd = '';
        that.curUser.newPwd2 = '';
        that.curUser.mobilePhone = item.mobilePhone;
        that.curUser.emailAddress = item.emailAddress;
        that.curUser.remark = item.remark; 
      },
      deleteUser(item){
        var that = this;
        //询问
        that.$messagebox.confirm('',{
          title:'提示',
          message:'是否删除用户及其名下设备?',
          confirmButtonText:'全删',
          cancelButtonText:'只删用户'
        }).then(action => {
          if (action == 'confirm') {
            that.$global.deleteUserById(item.id,1,function(){
              that.getAccountList();
            });
          }
        }).catch(error =>{
          that.$global.deleteUserById(item.id,0,function(){
              that.getAccountList();
            });
        });
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
	.tableHead, .tableBody{
		display: flex;
    font-size: .14rem;
    padding: 5px 10px;
    text-align:center;
	}
	.tableHead>div, .tableBody>div{
		flex:1
	}
	.tableHead>div:nth-child(1),
	.tableBody>div:nth-child(1){
		text-align:left;
	}
	.tableHead>div:nth-child(4),
	.tableBody>div:nth-child(4){
		text-align:right;
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
  .devAuthority td{
    padding:4px 2px;
    border:1px solid #333;
    font-size:.14rem;
  }
  .mint-checklist a{
    background-color:transparent !important;
  }
  .mint-checklist-title{
    margin:0px;
  }
  /*.mint-toast{
    z-index:2010 !important;
  }*/
</style>