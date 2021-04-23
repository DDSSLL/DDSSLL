<template>
  <div class="UserMan">
    <div class="Group">
      <div class="GroupTitle" @click="userShow=!userShow">
        用户
        <i class="titleIcon fa" :class="[userShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getUserList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addUser" v-if="userAddShow"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="userShow" id="userList">
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefixName.join(',')">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <template v-for="(item,i) in userList">
            <mt-cell-swipe
              :right="[ 
              {content: '设备权限',handler:() => showDevAuthority(item)},
              {content: '编辑',handler:() => editUser(item)},
              {content: '删除',style:{display:(item.userGroup == ADMIN)?((user.id == SUPER && item.id!=user.id)?'':'none'):(item.id == user.id ? 'none':'')}, handler:() => deleteUser(item)}
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户名称</span>
                <span class="cellName cellValue" style="float: right;">
                  <span v-if="item.id==user.id">
                    <i class="fa fa-user" style="color: #23b7e5"></i>
                  </span>
                  {{ item.name }}
                </span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户组</span>
                <span class="cellName cellValue" style="float: right;">{{ item.prefix }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">登录账号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.id }}</span>
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
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">启用</span>
                <span class="cellName cellValue" style="float: right;" v-if="item.nEnable == '1' || user.id == SUPER">
                  <i class="fa fa-check" style="color: #00ff00"></i>
                </span>
                <span v-else>
                  <i class="fa fa-ban" style="color: #ff0000"></i>
                </span>
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
    <!-- 设备权限 -->
    <mt-popup v-model="deviceAuthourityVisible" position="right" popup-transition="popup-slide" class="wholePagePop">
      <div class="page-navbar">
      <div class="page-title">
        <i class="fa fa-arrow-left" aria-hidden="true" @click="deviceAuthourityVisible = false" style="position:absolute"></i>
        <span class='navTitle'>{{ "用户"+deviceAuthourityName+"设备权限" }}</span>
      </div>
      <div class="GroupItem">
        <div class="tableHead">
          <div>设备</div>
          <div>序列号</div>
          <div>状态</div>
          <div>型号</div>
        </div>
        <template v-for="(item,i) in deviceAuthourityTableData">
          <div class="tableBody">
            <div>{{ item.dev_name }}</div>
            <div>{{ item.dev_sn }}</div>
            <div>{{ item.online }}</div>
            <div>{{ item.dev_model }}</div>
          </div>
        </template>
      </div>
    </div>
    </mt-popup>
    <!-- 编辑页面 -->
    <mt-popup v-model="userConfigVisible"  popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          用户管理
          <i class="popupCloseBtn fa fa-times" @click="userConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="saveUserConf">
          <input type="password" style="display:none" id="loginPassword"/>
          <input type="text" style="display:none" id="loginUserName"/>
          <div class="fGrp">
            <div class="tl">用户名<span class="redText">*</span></div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curUser.name" required pattern="[A-Za-z0-9\u4e00-\u9fa5@+\-()（）]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,()" :readonly="curUser.nameReadonly">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1-15,仅支持中文,字母,数字,+,-,@,()</p>
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
          <div class="fGrp">
            <div class="tl">登录密码<span class="redText">*</span></div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="curUser.pwd" required pattern="^[A-Za-z0-9_@]{6,16}$" title="6~16位字母,数字,下划线和@组合" :readonly="curUser.pwdReadonly" /> 
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">
                6~16位字母,数字,下划线和@组合
              </p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">确认密码<span class="redText">*</span></div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="curUser.pwd2" required pattern="[A-Za-z0-9_@]{6,16}" title="6~16位字母,数字,下划线和@组合" clearable autocomplete="off" :readonly="curUser.pwd2Readonly"/>
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
              <input type="text" class="ItemInput" v-model="curUser.mobilePhone" pattern="^1[3|4|5|8][0-9]\d{8}$" title="请输入正确手机号" >
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
          <div class="fGrp" v-if="curUser.userEnableShow"><!--  v-show="user.id != SUPER" -->
            <div class="tl">启用</div>
            <div class="vl">
              <mt-switch v-model="curUser.nEnable"></mt-switch>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button @click="userConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
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
        SUPER : SUPER,
        ADVANCE : ADVANCE,
        NORMAL : NORMAL,
        ADMIN : ADMIN,
        userShow:false,//用户tab
        userAddShow:true,//添加用户按钮
        userDelShow:true,//删除用户按钮
        userGroups:[],//用户组
        /*用户组*/
        userPrefixShow:true,//用户组过滤
        selectPrefixOptions:[],//用户组options
        selectPrefix:[],//选中的用户组
        selectPrefixName:[],//显示过滤组的名称
        //prefixArr:[],//用户组下拉框数据
        userPrefixPop:false,//用户组pop的show
        /*设备权限信息*/
        deviceAuthourityVisible:false,//设备权限界面显示
        deviceAuthourityTableData:[],//设备权限
        
        userList:[],//用户列表
        curUser:{//用户编辑页面
          userEditType:"add",
          nameReadonly:false,
          name:"",//用户名
          oldName:"",
          prefix:"",//用户组名
          prefixOptions:[],//用户组下拉列表
          prefixDisable:false,//用户组disabale
          pwd:"",
          pwd2:"",
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
        userConfigVisible:false,
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
      this.initShowContent();
    },
    activated(){
      console.log("devMan activated")
      this.initShowContent();
    },
    methods:{
      ...mapMutations({
          
      }),
      initShowContent(){
        var that = this;
        if(this.user.id == this.SUPER){//"001-admin"
          that.userPrefixShow = true;
          that.$global.getUserPrefixArr(function(data) {
            var data = that.$global.initPrefixData(data);
            that.selectPrefixOptions = data.selectPrefixOptions;
            that.selectPrefix = data.selectPrefix;
            that.selectPrefixName = data.selectPrefixName;
            //获取用户等级
            that.getUserGroup(that.getUserList);
          })
        }else{
          that.userPrefixShow = false;
          that.getUserGroup(that.getUserList);
        }
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
            that.curUser.userGroupOptionsOri = res.data;
            that.curUser.userGroupOptions = res.data;
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].value != that.ADMIN) {
                that.userGroups.push(res.data[i])
              }
            }
            if(cb){
              cb();
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      getUserList(){
        var that = this;
        var selectPrefix = that.formatUserSelect();
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getUsers : true,
            prefix : that.user.prefix,
            userId : that.user.id,
            userGroup : that.user.userGroup,
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
            that.userList = data;
          }else{
            that.userList = [];
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
        that.getUserList();
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
      //显示设备权限页面
      showDevAuthority(item){
        var that = this;
        this.deviceAuthourityVisible = true;
        this.deviceAuthourityName = item.name;
        this.getdeviceAuthourityTableData(item);
      },
      //获取解码卡数据
      getdeviceAuthourityTableData(item){
        var that = this;
        that.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getDevList : true,
            userId : item.id,
            userGroup : item.userGroup,
            prefix : item.prefix,
            logId : that.user.id,
            logGroup : that.user.userGroup,
          }),
          Api:"getDevList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.deviceAuthourityTableData = res.data;
          }else{
            that.deviceAuthourityTableData = [];
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
        that.curUser.name = "";
        that.curUser.oldName = "";
        that.curUser.nameReadonly = false;
        that.$global.getUserPrefixArr(function(data) {
          var options = [];
          options = data.map(function(item){
            return {
              text: item.prefix_name,
              value: item.prefix
            }
          });
          that.curUser.prefixOptions = options;
          if (that.user.id == that.SUPER) {
            that.curUser.prefixDisable = false;
          } else {
            that.curUser.prefix = that.user.prefix;
            that.curUser.prefixDisable = true;
          }
        });
        that.curUser.pwd = "";
        that.curUser.pwd2 = "";
        that.curUser.pwdReadonly = false;
        that.curUser.pwd2Readonly = false;
        if (that.user.id == that.SUPER) {//001-admin登录，能够配置“管理员”
          if(that.curUser.userGroupOptionsOri[0].value != 1){
            var arr = [{"text":"管理员","value":1}]
            that.user.userGroupOptions = arr.concat(that.user.userGroupOptionsOri);
          }
          that.curUser.userGroup = 1;  
        }else{//非001-admin用户，不能添加管理员
          if(that.curUser.userGroupOptionsOri[0].value == 1){
            that.curUser.userGroupOptions = that.curUser.userGroupOptionsOri.filter(function(item){
              return (item.value != 1)
            })
          }    
          that.curUser.userGroup = 2;
        }
        that.curUser.userGroupDisable = false;
        that.curUser.nEnable = true;//启用
        that.curUser.userEnableShow = true;//显示启用
        that.curUser.mobilePhone = "";
        that.curUser.emailAddress = "";
        that.curUser.remark = "";
      },
      //编辑接收机
      editUser(item){
        var that = this;
        that.userConfigVisible = true;
        that.curUser.userEditType = "edit";
        that.curUser.name = item.name;
        that.curUser.oldName = item.name;
        if (item.id == that.SUPER) {//超级用户不可编辑
          that.curUser.nameReadonly = true;
        }
        if (((item.id == that.user.id) || (that.user.id == that.SUPER) || (that.user.userGroup == that.ADMIN && item.userGroup != that.ADMIN)) && (item.id != that.SUPER)) {//当前登录用户可编辑   //超级用户可编辑其他人   //管理员可编辑其他人
          that.curUser.nameReadonly = false;
        } else {
          that.curUser.nameReadonly = true;
        }
        that.$global.getUserPrefixArr(function(data) {
          var options = [];
          options = data.map(function(item){
            return {
              text: item.prefix_name,
              value: item.prefix
            }
          });
          that.curUser.prefixOptions = options;
          that.curUser.prefix = item.prefix;
          that.curUser.prefixDisable = true;
        });
        that.curUser.pwd = item.pwd;
        that.curUser.pwd2 = item.pwd;
        if ((item.id == that.user.id) || (that.user.id == that.SUPER) || (that.user.userGroup == that.ADMIN && item.userGroup != that.ADMIN)) {
          that.curUser.pwdReadonly = false;
          that.curUser.pwd2Readonly = false;
        } else {
          that.curUser.pwdReadonly = true;
          that.curUser.pwd2Readonly = true;
        }
        if(that.curUser.userGroupOptionsOri[0].value != 1){
          var arr = [{"text":"管理员","value":1}]
          that.user.userGroupOptions = arr.concat(that.user.userGroupOptionsOri);
        }
        if(that.user.id == that.SUPER){//超级管理员登录 不能修改自己的用户等级，其他可改
          if (item.id == that.user.id){//用户自己不能修改自己的用户等级
            that.disableGroupSel();
          } else {
            that.enableGroupSel();
          }
        } else {
          if(that.user.userGroup == that.ADMIN){//管理员
            if(item.prefix == that.user.prefix && item.userGroup != 1 && item.id != that.user.id){//同组 非管理员 非自己
              that.user.userGroupOptions = that.curUser.userGroupOptionsOri.filter(function(item){
                return (item.value != 1)
              })
              that.enableGroupSel();
            }else{
              that.disableGroupSel();
            }
          }else if(that.user.userGroup == that.ADVANCE || that.user.userGroup == that.NORMAL){//高级用户或普通用户
            that.disableGroupSel();
          }
        }
        that.curUser.userGroup = item.userGroup;
        that.curUser.nEnable = (item.nEnable == 1)?true:false;
        if (item.id == that.SUPER) {
          that.curUser.userEnableShow = false;
        } else if (that.user.id == that.SUPER) {
          that.curUser.userEnableShow = true;
        } else if (that.user.userGroup == that.ADMIN && item.userGroup != that.ADMIN) {
          that.curUser.userEnableShow = true;
        } else {
          that.curUser.userEnableShow = false;
        }
        that.curUser.mobilePhone = item.mobilePhone == "无" ? "" : item.mobilePhone;
        that.curUser.emailAddress = item.emailAddress == "无" ? "" : item.emailAddress
        that.curUser.remark = item.remark == "无" ? "" : item.remark
      },
      enableGroupSel(){
        var that = this;
        that.curUser.userGroupDisable = false;
      },
      disableGroupSel(){
        var that = this;
        that.curUser.userGroupDisable = true;
        //that.curUser.userGroup = item.userGroup;
      },
      //初始化设备添加界面的用户组
      initPrefix(cb) {
        var that = this;
        if (that.user.id == that.SUPER) {
          that.$axios({
            method: 'post',
            url:"/page/dev/devData.php",
            data:that.$qs.stringify({
              getPrefixs:true
            }),
            Api:"getPrefixs",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.curUser.prefixOptions = res.data
            }
            if(cb){
              cb()
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        } else {
          var option = [{
            label: that.user.prefix,
            value: that.user.prefix
          }];
          that.curUser.prefixOptions = option;
          if(cb){
            cb()
          }
        }
      },
      judgeUserHasRcvRights(rcvSn) {
        var that = this;
        var userId = that.user.id;
        if (that.user.userGroup == that.NORMAL) { //普通用户
          return false;
        }
        var all_row = that.userList;
        for (var k = 0; k < all_row.length; k++) {
          if (all_row[k].rcv_sn == rcvSn) { //用户相同接收机id相同返回true
            if (all_row[k].user_id == userId) {
              return true;
            }
            break;
          }
        }
        return false;
      },
      //保存接收机配置
      saveUserConf() {
        var that = this;
        var type = that.curUser.userEditType;
        var oldName = that.curUser.name;
        var name = that.curUser.name;
        var prefix = that.curUser.prefix;
        var pwd = that.curUser.pwd;
        var pwd2 = that.curUser.pwd2;
        var group = that.curUser.userGroup;
        var mobilePhone = that.curUser.mobilePhone;
        var emailAddress = that.curUser.emailAddress;
        var remark = that.curUser.remark;
        var loginId = prefix + '-' + oldName;
        var enable = that.curUser.nEnable?"1":"0";
        //prefix
        if (prefix == '' || prefix.length > 10) {
          that.$toast({
            message: "请按要求输入前缀ID",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //pwd != pwd2
        if (pwd2 != pwd) {
          that.$toast({
            message: "密码不一致",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var data = that.userList;
        //name重复
        if (type == "add") {
          for (var i = 0; i < data.length; i++) {
            if (data[i].id == prefix + '-' + name) {
              that.$toast({
                message: "该用户已添加",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        if (mobilePhone != "" && !that.$global.isValidPhone(mobilePhone)) {
          that.$toast({
            message: "请输入有效手机号",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!that.$global.isValidMail(emailAddress)) {
          that.$toast({
            message: "请输入合法邮箱",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //prefix新增
        var addPrefix = '0'; //0:编辑，1:添加
        /*if (that.user.id == that.SUPER) {
          addPrefix = '1';
          for (i = 0; i < data.length; i++) {
            if (data[i].prefix == prefix) {
              addPrefix = '0';
            }
          }
        }*/
        
        if(that.user.id == that.SUPER){
          enable = 1;
        }
        if (type == "add") {
          that.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:that.$qs.stringify({
              addUser: name,
              pwd: pwd,
              group: group,
              prefix: prefix,
              prefixName: prefix,
              addPrefix: addPrefix,
              loginId: loginId,
              enable: enable,
              mobilePhone: mobilePhone,
              emailAddress: emailAddress,
              remark: remark,
            }),
            Api:"delRcv",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getUserList();
              that.userConfigVisible = false;
            }else{
              that.$toast({
                message: res.res.reason,
                position: 'middle',
                duration: 20000
              });
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        } else {
          that.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:that.$qs.stringify({
              addUser: name,
              oldUser: that.curUser.oldName,
              pwd: pwd,
              group: group,
              prefix: prefix,
              loginId: prefix + '-' + that.curUser.oldName,
              enable: enable,
              mobilePhone: mobilePhone,
              emailAddress: emailAddress,
              remark: remark,
            }),
            Api:"addUser",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.getUserList();
              that.userConfigVisible = false;
            }else{
              that.$toast({
                message: res.res.reason
              });
            }
          })
          .catch(function (error) {
            console.log(error)
          })
        }
      },
      deleteUser(item){
        var that = this;
        var delName = ""
        if (that.user.id == that.SUPER) {
          delName = item.id;
        } else {
          delName = item.name;
        };
        var ids = item.id;
        var param = "'" + ids + "'";
        var text = '确认删除' + delName + '用户?';
        //询问
        that.$messagebox.confirm(text).then(
          action => {
            that.$axios({
              method: 'post',
              url:"/page/users/users.php",
              data:this.$qs.stringify({
                delUserIds:param
              }),
              Api:"delUser",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.getUserList();
              }else{
                that.$toast({
                  message: res.res.reason
                });
              }
            })
            .catch(function (error) {
              console.log(error)
            })
          }
        )
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

  .userPrefixPop.mint-popup{
    background-color: #212227;
    width: 100%;
    height: 100%;
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
    text-align:left;
  }
  .tableHead>div, .tableBody>div{
    flex:1
  }
  .tableHead>div:nth-child(1),.tableHead>div:nth-child(2),
  .tableBody>div:nth-child(1),.tableBody>div:nth-child(2){
    flex:2
  }
  /*.tableHead>div:nth-child(3),.tableHead>div:nth-child(4),
  .tableBody>div:nth-child(3),.tableBody>div:nth-child(4){
    text-align:right;
  }*/
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
  /*.mint-toast{
    z-index:2010 !important;
  }*/
</style>