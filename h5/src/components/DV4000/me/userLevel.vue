<template>
  <div class="RcvMan">
    <div class="Group">
      <div class="GroupTitle" @click="userLevelShow=!userLevelShow">
        用户等级
        <i class="titleIcon fa" :class="[userLevelShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getUserLevelList"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="userLevelShow">
          <template v-for="(item,i) in userLevelList">
            <mt-cell-swipe
              :right="[ 
              {content: '编辑', style:{display:(user.userGroup == ADMIN && item.group_name != '管理员')?'':'none'}, handler:() => editUserLevel(item)},
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">用户等级</span>
                <span class="cellName cellValue" style="float: right;">{{ item.group_name }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">成员</span>
                <span class="cellName cellValue" style="float: right;">{{ item.member }}</span>
              </div>
            </mt-cell-swipe>
          </template>
        </div>
      </transition>
    </div> 
    <!-- 编辑页面 -->
    <mt-popup v-model="userLevelConfigVisible"  popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          {{curUserLevel.group_name+"成员"}}
          <i class="popupCloseBtn fa fa-times" @click="userLevelConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="saveUserLevelConf">
          <div class="fGrp">
            <div class="tl" style="width: 80%;text-align: left;">{{"成员:"+curUserLevel.userLevel.join(',')}}</div>
            <div class="vl" style="width: 10%;padding-top: .07rem;">
              <i class="fa fa-chevron-down" @click.stop="userLevelMemberPop = true" ></i>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button @click="userLevelConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>
    <!-- 成员列表 -->
    <mt-popup v-model="userLevelMemberPop" position="bottom" popup-transition="popup-slide" class="userPrefixPop">
      <span class="chevronDown">
        <i class="fa fa-chevron-down" @click.stop="userLevelMemberPop=false"></i>
      </span>
      <mt-checklist
        v-model="curUserLevel.userLevel"
        :options="curUserLevel.userLevelMember"
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
        ADVANCE : ADVANCE,
       	NORMAL : NORMAL,
        ADMIN : ADMIN,
        userLevelShow:false,//用户等级tab
        userLevelMemberPop:false,
        userLevelList:[],//用户权限列表
       	curUserLevel:{
          group_name:"",
          oldMember:"",
          groupId:"",
          userLevel:[],
          userLevelMember:[],
        },
        userLevelConfigVisible:false,
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
      this.getUserLevelList();
    },
    activated(){
      console.log("devMan activated")
      this.getUserLevelList();
    },
    methods:{
      ...mapMutations({
          
      }),
      getUserLevelList(){
      	var that = this;
      	that.$axios({
          method: 'post',
          url:"/page/userGroups/userGroups.php",
          data:that.$qs.stringify({
      			getUserGroup : true,
			      prefix : that.user.prefix,
			      userId : that.user.id
          }),
          Api:"getUserGroup",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
          	console.log("getUserLevelList")
          	var data = res.data;
          	console.log(data)
            for(var i=0; i<data.length; i++){
              data[i]["memberName"] = that.formatMember(data[i]["member"]);
            }
          	that.userLevelList = data
          }else{
            that.userList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatMember(member){
        var that = this;
        var memberArr = member.split(",");
        var group = [];
        var groupObj = {};
        if(that.user.id == that.SUPER){
          for(var i=0; i<memberArr.length; i++){
            var groupName = memberArr[i].split("-")[0];
            if($.inArray(groupName,group) == -1){
              group.push(groupName);
              groupObj[groupName] = [];
            }
            groupObj[groupName].push(memberArr[i]);
          }
          var showMem = "";
          for(var key in groupObj){
            showMem += groupObj[key].join(", ")+"<br>";
          }
        }else{
          showMem = member.replace(/,/g, ", ");
        }
        return showMem;
      },
			editUserLevel(item){
				var that = this;
        that.userLevelConfigVisible = true;
        that.curUserLevel.group_name = item.group_name;
        that.curUserLevel.oldMember = item.member;
        that.curUserLevel.groupId = item.id;
        that.$axios({
          method: 'post',
          url:"/page/userGroups/userGroups.php",
          data:that.$qs.stringify({
            getGroupMember:1,
            prefix:that.user.prefix,
            userId:that.user.id,
          }),
          Api:"getGroupMember",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var result = []
            var data = res.data;
            for (var i = 0; i < data.length; i++) {
              //除去登录用户自己
              if (data[i]['id'] == that.user.id) {
                continue;
              }
              if (that.user.id == that.SUPER) {
                result.push({
                  value: data[i]['id'],
                  label: data[i]['id']
                });
              } else {
                result.push({
                  value: data[i]['name'],
                  label: data[i]['name']
                });
              }
            }
            that.curUserLevel.userLevelMember = result;
            that.curUserLevel.userLevel = item.member.split(",");
          }
        })
        .catch(function (error) {
          console.log(error)
        })
			},
			saveUserLevelConf() {
				var that = this;
        var member = that.curUserLevel.userLevel;
        var strMember = "";
        if(member){
          if (that.user.id != that.SUPER) {
            for (var i = 0; i < member.length; i++) {
              if (strMember == '') {
                strMember = that.user.prefix + '-' + member[i];
              } else {
                strMember += ',' + that.user.prefix + '-' + member[i];
              }
            }
          }else{
            strMember = member.join(",");      
          }  
        }
        that.$axios({
          method: 'post',
          url:"/page/userGroups/userGroups.php",
          data:that.$qs.stringify({
            editMember: true,
            strMember: strMember,
            group: that.curUserLevel.groupId,
          }),
          Api:"editMember",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getUserLevelList();
            that.userLevelConfigVisible = false;
          }else{
            that.$toast({
              message: res.res.reason
            });
          }
        })
        .catch(function (error) {
          console.log(error)
        })
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
  .mint-toast{
    z-index:2010 !important;
  }
</style>