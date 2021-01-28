<template>
  <div class="RcvMan">
    <div class="Group">
      <div class="GroupTitle" @click="userShow=!userShow">
        录机管理
        <i class="titleIcon fa" :class="[userShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getRecordList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addRecord" v-if="recordAddShow"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="userShow" id="userList">
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefixName.join(',')">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <template v-for="(item,i) in recordList">
            <mt-cell-swipe
              :right="[ 
              {content: '编辑',handler:() => editRecord(item)},
              {content: '删除',style:{display:recordDelShow?'':'none'}, handler:() => deleteRecord(item)}
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">录机名</span>
                <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':'']">
                  {{ item.record_name }}
                </span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">状态</span>
                <span class="cellName cellValue" style="float: right;">{{ item.online }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">MAC地址</span>
                <span class="cellName cellValue" style="float: right;">{{ item.record_mac }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">录机IP</span>
                <span class="cellName cellValue" style="float: right;">{{ item.record_ip }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">容量信息</span>
                <span class="cellName cellValue" style="float: right;">{{ item.unused_cap+" / "+item.capacity }}</span>
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
    <!-- 编辑页面 -->
    <mt-popup v-model="recordConfigVisible"  popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          录机配置
          <i class="popupCloseBtn fa fa-times" @click="recordConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="saveRecordConf">
          <div class="fGrp">
            <div class="tl">录机名称</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curRecord.record_name" required pattern="[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]{1,15}" title="仪器名(长度1~15，仅支持中文,字母,数字,+,-,@,(),和空格)">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">仪器名(长度1~15，仅支持中文,字母,数字,+,-,@,(),和空格)</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curRecord.record_sn" required pattern="[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}" title="
              请以xx:xx:xx:xx:xx:xx的形式输入（xx为16进制数字）" :readonly="curRecord.recordSnReadonly">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">
                序列号为网口MAC地址
              </p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="curRecord.prefix" :disabled="curRecord.prefixDisable">
                <template v-for="(item,i) in curRecord.prefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">路径选择</div>
            <div class="vl">
              <select class="ItemSelect" v-model="curRecord.path" @change="changePath">
                <template v-for="(item,i) in $global.OPTIONS_RECORD_PATH">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="curRecord.nsaPathShow">
            <div class="tl">路径</div>
            <div class="vl">
               <input type="text" class="ItemInput" v-model="curRecord.nas_path">
            </div>
          </div>
          <div class="fGrp" v-if="curRecord.nsaUserShow">
            <div class="tl">用户名</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curRecord.nas_user">
            </div>
          </div>
          <div class="fGrp" v-if="curRecord.nsaPwdShow">
            <div class="tl">密码</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curRecord.nas_pwd">
            </div>
          </div>
          <div class="fGrp" style="text-align: right" v-if="curRecord.btnShow">
            <button @click="recordConfigVisible = false" style="margin-right: .06rem;">取消</button>
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
        /*用户组*/
        userPrefixShow:true,//用户组过滤
        selectPrefixOptions:[],//用户组options
        selectPrefix:[],//选中的用户组
        selectPrefixName:[],//显示过滤组的名称
        prefixArr:[],//用户组下拉框数据
        userPrefixPop:false,//用户组pop的show
        /*录机列表*/
        recordList:[],
        /*添加编辑参数*/
        recordConfigVisible:false,
        curRecord:{
          recordEditType:"add",
          record_name:"",
          record_sn:"",
          recordSnReadonly:false,
          btnShow:true,
          prefix:"",
          prefixOptions:[],
          prefixDisable:false,
          path:"",
          nas_path:"",
          nas_user:"",
          nas_pwd:"",
          nsaPathShow:"",
          nsaUserShow:"",
          nsaPwdShow:"",
        },
        
        userShow:false,//用户tab
        recordAddShow:true,//添加录机按钮
        recordAddShow:true,//删除录机按钮
        userGroups:[],//用户组
        
        /*设备权限信息*/
        deviceAuthourityVisible:false,//设备权限界面显示
        deviceAuthourityTableData:[],//设备权限
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
      console.log("recordMan activated")
      this.initShowContent();
    },
    methods:{
      ...mapMutations({
          
      }),
      initShowContent(){
        var that = this;
        if(that.user.userGroup == that.ADMIN){
          that.recordAddShow = true;
          that.recordDelShow = true;
        }else{
          that.recordAddShow = false;
          that.recordDelShow = false;
        }
        if(this.user.id == this.SUPER){//"001-admin"
          that.userPrefixShow = true;
          that.$global.getUserPrefixArr(function(data) {
            var data = that.$global.initPrefixData(data);
            that.selectPrefixOptions = data.selectPrefixOptions;
            that.selectPrefix = data.selectPrefix;
            that.selectPrefixName = data.selectPrefixName;
            that.getRecordList()
          })
        }else{
          that.userPrefixShow = false;
          that.getRecordList()
        }
      },
      getRecordList(){
        var that = this;
        var selectPrefix = that.$global.formatUserSelect(that.userPrefixShow, that.selectPrefix);
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getRecord : true,
            selectByPrefix : selectPrefix,
          }),
          Api:"getRecord",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            that.recordList = data
          }else{
            that.recordList = [];
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
        that.getRecordList();
      },
      changePath(){
        var that = this;
        var pathSel = that.curRecord.path;
        if(pathSel == '1'){
          that.curRecord.nsaPathShow = true;
          that.curRecord.nsaUserShow = true;
          that.curRecord.nsaPwdShow = true;
        } else{
          that.curRecord.nsaPathShow = false;
          that.curRecord.nsaUserShow = false;
          that.curRecord.nsaPwdShow = false;
        }
      },
      addRecord(){
        var that = this;
        that.recordConfigVisible = true;
        that.curRecord.recordEditType = "add";
        that.curRecord.record_name = "";
        that.curRecord.record_sn = "";
        that.curRecord.recordSnReadonly = false;
        that.curRecord.btnShow = true;
        that.curRecord.prefixDisable = false;
        that.$global.getUserPrefixArr(function(data) {
          var options = [];
          options = data.map(function(item){
            return {
              text: item.prefix_name,
              value: item.prefix
            }
          });
          that.curRecord.prefixOptions = options;
          that.curRecord.prefix = options[0]["value"];
        });
        //路径选择
        that.curRecord.path = 0;
        that.curRecord.nas_path = "";
        that.curRecord.nas_user = "";
        that.curRecord.nas_pwd = "";
        that.curRecord.nsaPathShow = false;
        that.curRecord.nsaUserShow = false;
        that.curRecord.nsaPwdShow = false;
      },
      //编辑接收机
      editRecord(item){
        var that = this;
        that.recordConfigVisible = true;
        that.curRecord.recordEditType = "edit";
        that.curRecord.record_name = item.record_name;
        that.curRecord.record_sn = item.record_sn;
        that.curRecord.recordSnReadonly = true;
        //普通用户不能编辑
        if(that.user.userGroup == that.NORMAL){
          that.curRecord.btnShow = false;
        }else{
          that.curRecord.btnShow = true;
        }
        that.$global.getUserPrefixArr(function(data) {
          var options = [];
          options = data.map(function(item){
            return {
              text: item.prefix_name,
              value: item.prefix
            }
          });
          that.curRecord.prefixOptions = options;
          if (that.user.id == that.SUPER) {
          } else {
            that.curRecord.prefix = that.user.prefix;
          }
        });
        that.curRecord.prefix = item.prefix;
        that.curRecord.prefixDisable = true;
        //路径选择
        that.curRecord.path = item.path_sel
        that.curRecord.nas_path = item.nas_path;
        that.curRecord.nas_user = item.nas_user;
        that.curRecord.nas_pwd = item.nas_pwd;
        if(item.path_sel === '1'){
          that.curRecord.nsaPathShow = true;
          that.curRecord.nsaUserShow = true;
          that.curRecord.nsaPwdShow = true;
        } else{
          that.curRecord.nsaPathShow = false;
          that.curRecord.nsaUserShow = false;
          that.curRecord.nsaPwdShow = false;
        }
      },
      //保存接收机配置
      saveRecordConf() {
        var that = this;
        var type = that.curRecord.recordEditType;
        var name = that.curRecord.record_name;
        var sn = that.curRecord.record_sn;
        sn = sn.toLocaleLowerCase();
        var prefix = that.curRecord.prefix;
        if(prefix == null){
          prefix = '';
        }
        var pathSel = that.curRecord.path;
        var nasPath = that.curRecord.nas_path;
        var nasuser = that.curRecord.nas_user;
        var nasPwd = that.curRecord.nas_pwd;
        //sn 重复(新添加录机时校验，编辑的时候不用校验)
        if (type == "add") {
          var data = that.recordList;
          for (var i = 0; i < data.length; i++) {
            if (data[i].record_sn == sn) {
              that.$toast({
                message: "该录机已添加",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        //NAS验证
        if(pathSel === '1'){
          if(nasPath === ''){
            that.$toast({
              message: "请输入NAS路径",
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if(nasuser === ''){
            that.$toast({
              message: "请输入NAS用户名",
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if(nasPwd === ''){
            that.$toast({
              message: "请输入NAS密码",
              position: 'middle',
              duration: 2000
            });
            return;
          }
        }
        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:that.$qs.stringify({
            editRecord :sn,
            recordName : name,
            type : type,
            prefix : prefix,
            pathSel : pathSel,
            nasPath : nasPath,
            nasuser : nasuser,
            nasPwd : nasPwd,
          }),
          Api:"editRecord",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.getRecordList();
            that.recordConfigVisible = false;
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
      deleteRecord(item){
        var that = this;
        var SNs = item.record_sn;
        var text = '确认删除选中设备?';      
        //询问
        that.$messagebox.confirm(text).then(
          action => {
            that.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delRecordSns:SNs
              }),
              Api:"delRecord",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.getRecordList();
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
    height: auto;
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