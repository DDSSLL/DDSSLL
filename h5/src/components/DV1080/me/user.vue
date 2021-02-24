<template>
  <div class="RcvMan">
    <div class="Group">
      <div class="GroupTitle" @click="AccountShow=!AccountShow">
        用户信息
        <i class="titleIcon fa" :class="[AccountShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getAccountList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addUser" v-if="user.id==SUPER"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="AccountShow">
          <template v-for="(item,i) in accountList">
            <mt-cell-swipe
              :right="[ 
              {content: '设备权限',handler:() => showDevAuthority(item)},
              {content: '编辑',handler:() => editUser(item)},
              {content: '删除',style:{display:(user.id!=SUPER || item.id==SUPER)?'none':''}, handler:() => deleteUser(item)}
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户名称</span>
                <span class="cellName cellValue" style="float: right;">
                  <span v-show="[item.id==user.id]">
                    <i class="fa fa-user" style="color: #23b7e5"></i>
                  </span>
                  {{ item.name }}
                  </span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">登录账号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.id }}</span>
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
            <div class="tl">用户名</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="userConfigForm.name" required pattern="[A-Za-z0-9\u4e00-\u9fa5@+_()（）]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,()">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1-15,仅支持中文,字母,数字,+,-,@,()</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">登录密码</div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="userConfigForm.pwd" required pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9_@]{6,16}$" title="6~16位字母,数字,下划线和@组合,至少包含一个数字一个字母"/> 
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;"><!-- pattern="^[A-Za-z0-9_@]{6,16}$" -->
                6~16位字母,数字,下划线和@组合
              </p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">确认密码</div>
            <div class="vl">
              <input type="password" class="ItemInput" v-model="userConfigForm.pwd2" required pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9_@]{6,16}$" title="6~16位字母,数字,下划线和@组合,至少包含一个数字一个字母" clearable autocomplete="off" />
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">手机号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="userConfigForm.mobilePhone" pattern="^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$" title="请输入正确手机号" >
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">邮箱</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="userConfigForm.emailAddress">
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">备注</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="userConfigForm.remark">
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button @click="userConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>
    <mt-popup v-model="devRightsVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          设备权限
          <i class="popupCloseBtn fa fa-times" @click="devRightsVisible = false"></i>
        </div>
        <!-- <template v-for="(item,i) in devRightsList">
          <div class="devRightsItem">
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">设备</span>
              <span class="cellName cellValue" style="float: right;">{{ item.dev_name }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">序列号</span>
              <span class="cellName cellValue" style="float: right;">{{ item.dev_sn}}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">状态</span>
              <span class="cellName cellValue" style="float: right;">{{ item.online }}</span>
            </div>
            <div class="cellItem">
              <span class="cellName cellLabel" style="float: left;">型号</span>
              <span class="cellName cellValue" style="float: right;">{{ item.dev_model }}</span>
            </div>
          </div>
        </template> -->
        <div class="devRightsTable">
          <table>
            <thead>
              <tr>
                <th>设备</th>
                <th>序列号</th>
                <th>状态</th>
                <th>型号</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(item,i) in devRightsList">
                <tr>
                  <td>{{ item.dev_name }}</td>
                  <td>{{ item.dev_sn }}</td>
                  <td>{{ item.online }}</td>
                  <td>{{ item.dev_model }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
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
        AccountShow:false,
        accountList:[],
        userConfigVisible:false,
        userConfigType:"add",
        userConfigForm:{
          id:"",
          name:"",
          pwd:"",
          pwd2:"",
          mobilePhone:"",
          emailAddress:"",
          remark:""
        },
        devRightsVisible:false,
        devRightsList:[]
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
      this.getAccountList();
    },
    activated(){
      console.log("devMan activated")
      this.getAccountList();
    },
    methods:{
      ...mapMutations({
          
      }),
      getAccountList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getUsers:true,
            userId: that.user.id
          }),
          Api:"getUsers",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
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
        this.userConfigVisible = true;
        this.userConfigType = "add";
        this.clearUserPopup();
      },
      clearUserPopup(){
        this.userConfigForm.name = "";
        this.userConfigForm.pwd = "";
        this.userConfigForm.mobilePhone = "";
        this.userConfigForm.emailAddress = "";
        this.userConfigForm.remark = "";
      },
      submitUserConfig(){
        var that = this;
        var name = this.userConfigForm.name;
        var mobilePhone = this.userConfigForm.mobilePhone;
        var emailAddress = this.userConfigForm.emailAddress;
        var remark = this.userConfigForm.remark;
        var pwd = this.userConfigForm.pwd;
        if (this.userConfigForm.pwd != this.userConfigForm.pwd2) {
          that.$toast({
            message: "密码不一致!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (this.userConfigType == "add") {
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

        if (this.userConfigType == "add") {//只有001-admin可以添加
          this.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:this.$qs.stringify({
              addUser: name,
              pwd: pwd,
              group: 1,
              prefix: name,
              prefixName: name,
              addPrefix: 1,
              loginId: name,
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
          console.log(this.userConfigForm)
          var oldName = this.userConfigForm.id;
          this.$axios({
            method: 'post',
            url:"/page/users/users.php",
            data:this.$qs.stringify({
              addUser: name,
              oldUser: oldName,
              pwd: pwd,
              group: 1,
              prefix: name,
              loginId: oldName,
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
        }
      },
      showDevAuthority(item){
        var that = this;
        this.devRightsList = [];
        this.devRightsVisible = true;
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            getDevList: true,
            userId: item.name,
            userGroup: 1,
            prefix: item.name,
            logId: item.name,
            logGroup: 1
          }),
          Api:"getDevList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.devRightsList = res.data;
          }else{
            that.devRightsList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      editUser(item){
        this.userConfigVisible = true;
        this.userConfigType = "edit";
        this.userConfigForm = {
            id:item.id,
            name: item.name,
            pwd: item.pwd,
            pwd2: item.pwd,
            mobilePhone: item.mobilePhone,
            emailAddress: item.emailAddress,
            remark: item.remark
        }
      },
      deleteUser(item){
        var that = this;
        this.$messagebox.confirm("确定删除此用户?").then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/users/users.php",
              data:this.$qs.stringify({
                delUserIds:"'"+item.id+"'"
              }),
              Api:"delUser",
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
                  message: '操作失败'
                });
              }
              that.getAccountList();
            })
            .catch(function (error) {
              console.log(error)
            })
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