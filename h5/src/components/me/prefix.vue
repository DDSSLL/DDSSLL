<template>
  <div class="PrefixMan">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="changePrefixListShow">
        用户组信息
        <i class="titleIcon fa chevronStyle size2" :class="[prefixListShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
      </div>
      <mt-popup v-model="prefixListShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div class="GroupItem" v-if="prefixListShow" style="height:100%">
          <div class="popTitle">
            <div class="back">
              <div  @click="prefixListShow=false" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">用户组信息</span>
                <i class="titleIcon addBtn fa fa-refresh" @click.stop="getPrefixList(formatPrefixData)"></i>
                <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addPrefix" v-if="show.addPrefixBtn"></i>
                <input type="text" v-model="searchPrefix" @click.stop="" @keyup.stop="searchPrefixByFilter" class="searchInput">
              </div>
            </div>
          </div>
          <div class="popContentStyle" v-if="temp">
            <template v-for="(item,i) in prefixShowList">
              <mt-cell-swipe
                :right="[ 
                {content: '编辑',handler:() => editPrefix(item)},
                {content: '删除',style:{display:(item.prefix==user.prefix)?'none':''}, handler:() => delPrefix(item)}
                ]">
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">id</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.prefix }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">名称</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.prefix_name }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">组深度</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.depth }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">父组</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.parent_name?item.parent_name.split("/")[1]:"" }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">标题</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.showTitle }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">管理员</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.level1 }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">高级用户</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.level2 }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">普通用户</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.level3 }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">背包</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.dev }}</span>
                </div>
                <div class="cellItem">
                  <span class="cellName cellLabel" style="float: left;">接收机</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.rcv }}</span>
                </div>
              </mt-cell-swipe>
            </template>
          </div>
        </div>
      </mt-popup>
      <!-- </transition> -->
    </div>
    <mt-popup v-model="prefixConfigVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          用户组管理
          <i class="popupCloseBtn fa fa-times" @click="prefixConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitPrefixConfig">
          <input type="password" style="display:none" id="loginPassword1"/>
          <input type="text" style="display:none" id="loginUserName1"/>
          <div class="fGrp">
            <div class="tl">用户组ID<span class="redText">*</span></div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.prefix" required :disabled="disable.prefix">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1-20，仅支持字母数字</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户组名称<span class="redText">*</span></div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.prefix_name" required>
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1~20，仅支持中文,字母,数字,+,_,@,()</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">父组<span class="redText">*</span></div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.parentPrefix" :disabled="disable.parentPrefix">
                <template v-for="item in options.parentGroupOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
              <span v-if="show.pGrpStr">(没有子组的用户组可进行修改)</span>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">标题名称<span class="redText">*</span></div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.showTitle" required pattern="[A-Za-z0-9\u4e00-\u9fa5]{1,20}" title="长度1~20，仅支持中文,字母,数字">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1~20，仅支持中文,字母,数字</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">管理员</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.level1_name" placeholder="用户名(长1-15)" />
              <input type="password" class="ItemInput pwdStyle" autocomplete="false" v-model="options.level1_pwd" placeholder="密码(长6-16)" />
              <input type="password" class="ItemInput pwdStyle" autocomplete="false" v-model="options.level1_pwd2" placeholder="密码(长6-16)" />
              <div class="addBtnStyle" @click.stop="addLevel(1)" v-if="show.addLevel1Btn"><span>+</span></div>
            </div>
          </div>
          <div class="fGrp" style="padding-top:0px;">
            <div class="tl"></div>
            <div class="vl">
              <template v-for="(item,i) in options.level1List">
                <a class="userListStyle" size="small" @click="removeUser(item, 1)">
                  {{item}}
                  <span style="color:red">x</span></a>
              </template>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">高级用户</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.level2_name" placeholder="用户名(长1-15)"/>
              <input type="password" class="ItemInput pwdStyle" autocomplete="false" v-model="options.level2_pwd" placeholder="密码(长6-16)" />
              <input type="password" class="ItemInput pwdStyle" autocomplete="false" v-model="options.level2_pwd2" placeholder="密码(长6-16)" />
              <div class="addBtnStyle" @click="addLevel(2)" v-if="show.addLevel2Btn">+</div>
            </div>
          </div>
          <div class="fGrp" style="padding-top:0px;">
            <div class="tl"></div>
            <div class="vl">
              <template v-for="(item,i) in options.level2List">
                <a class="userListStyle" size="small" @click="removeUser(item, 2)">
                  {{item}}
                  <span style="color:red">x</span></a>
              </template>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">普通用户</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.level3_name" placeholder="用户名(长1-15)" />
              <input type="password" class="ItemInput pwdStyle" autocomplete="false" v-model="options.level3_pwd" placeholder="密码(长6-16)" />
              <input type="password" class="ItemInput pwdStyle" autocomplete="false" v-model="options.level3_pwd2" placeholder="密码(长6-16)" />
              <div class="addBtnStyle" @click="addLevel(3)" v-if="show.addLevel3Btn">+</div>
            </div>
          </div>
          <div class="fGrp" style="padding-top:0px;">
            <div class="tl"></div>
            <div class="vl">
              <template v-for="(item,i) in options.level3List">
                <a class="userListStyle" size="small" @click="removeUser(item, 3)">
                  {{item}}
                  <span style="color:red">x</span>
                </a>
              </template>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button type="button" @click="prefixConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>
    <mt-popup v-model="prefixDelVisible" popup-transition="popup-fade" class="delGrpDiv">
      <div class="popupContainer">
        <div class="popupTitle">
          {{"删除用户组'"+delOptions.prefix_name+"'的相关选项"}}
          <i class="popupCloseBtn fa fa-times" @click="prefixDelVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitPrefixDel">
          <div class="fGrp">
            <div class="tl">删除当前组</div>
            <div class="vl">
              <mt-checklist v-model="delOptions.delGrp" :options="[{label: ' ', value: 'delGrp', disabled: true}]">
              </mt-checklist>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">删除当前组的子组</div>
            <div class="vl">
              <mt-checklist v-model="delOptions.delChildGrp" :options="[{label: ' ', value: 'delChildGrp'}]" @change="delChildGrpEvent">
              </mt-checklist>
            </div>
          </div>
          <div class="fGrp" v-show="delShow.curChildGrpNew">
            <div class="tl">指定子组的新父组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="delOptions.curChildGrpNew">
                <template v-for="item in delOptions.curChildGrpNewOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">删除当前组的组内用户</div>
            <div class="vl">
              <mt-checklist  v-model="delOptions.delGrpUser" :options="[{label: ' ', value: 'delGrpUser'}]" @change="delGrpUserEvent">
              </mt-checklist>
            </div>
          </div>
          <div class="fGrp" v-show="delShow.curUserGrpNew">
            <div class="tl">指定当前组组内用户所属的新组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="delOptions.curUserGrpNew">
                <template v-for="item in delOptions.curUserGrpNewOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">删除组内设备</div>
            <div class="vl">
              <mt-checklist v-model="delOptions.delGrpDev" :options="[{label: ' ', value: 'delGrpDev'}]" @change="delGrpDevEvent">
              </mt-checklist> 
            </div>
          </div>
          <div class="fGrp" v-show="delShow.curDevGrpNew">
            <div class="tl">指定当前组组内设备所属的新组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="delOptions.curDevGrpNew" @change="curDevGrpNewEvent">
                <template v-for="item in delOptions.curDevGrpNewOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-show="delShow.curDevUserNew">
            <div class="tl">指定当前组组内设备所属的新用户</div>
            <div class="vl">
              <select class="ItemSelect" v-model="delOptions.curDevUserNew">
                <template v-for="item in delOptions.curDevUserNewOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">删除子组用户</div>
            <div class="vl">
              <mt-checklist v-model="delOptions.delChildGrpUser" :options="[{label: ' ', value: 'delChildGrpUser'}]" @change="delChildGrpUserEvent">
              </mt-checklist>
            </div>
          </div>
          <div class="fGrp" v-show="delShow.childUserGrpNew">
            <div class="tl">指定子组用户所属的新组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="delOptions.childUserGrpNew">
                <template v-for="item in delOptions.childUserGrpNewOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">删除子组设备</div>
            <div class="vl">
              <mt-checklist v-model="delOptions.delChildGrpDev" :options="[{label: ' ', value: 'delChildGrpDev'}]" @change="delChildGrpDevEvent">
              </mt-checklist>
            </div>
          </div> 
          <div class="fGrp" v-show="delShow.childDevGrpNew">
            <div class="tl">指定子组设备所属的新组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="delOptions.childDevGrpNew" @change="childDevGrpNewEvent">
                <template v-for="item in delOptions.childDevGrpNewOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-show="delShow.childDevUserNew">
            <div class="tl">指定子组设备所属的新用户</div>
            <div class="vl">
              <select class="ItemSelect" v-model="delOptions.childDevUserNew">
                <template v-for="item in delOptions.childDevUserNewOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button class="modalBtn" type="button" @click="prefixDelVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { } from '../../store/mutation-types';
  import { MessageBox } from 'mint-ui';
  import $ from 'jquery';
  export default {
    name: "PrefixMan",
    data(){
      return{
        SUPER : SUPER,
        ADVANCE : ADVANCE,
       	NORMAL : NORMAL,
        ADMIN : ADMIN,
        PREFIX: PREFIX,
        DEPTH_MAX: 4,
        searchPrefix:"",
        prefixListShow:false,
        prefixList : [],
        prefixShowList : [],
        delOptions:{
          prefix:"",
          prefix_name:"",
          delGrp:"delGrp",
          delChildGrp:"delChildGrp",
          curChildGrpNew:"",
          curChildGrpNewOptions:[],
          delGrpUser:"delGrpUser",
          curUserGrpNew:"",
          curUserGrpNewOptions:[],
          delGrpDev:"delGrpDev",
          curDevGrpNew:"",
          curDevGrpNewOptions:[],
          curDevUserNew:"",
          curDevUserNewOptions:[],
          delChildGrpUser:"delChildGrpUser",
          childUserGrpNew:"",
          childUserGrpNewOptions:[],
          delChildGrpDev:"delChildGrpDev",
          childDevGrpNew:"",
          childDevGrpNewOptions:[],
          childDevUserNew:"",
          childDevUserNewOptions:[],
        },
        delShow:{
          curChildGrpNew:false,
          curUserGrpNew:false,
          curDevGrpNew:false,
          curDevUserNew:false,
          childUserGrpNew:false,
          childDevGrpNew:false,
          childDevUserNew:false,
        },
        options:{//用户编辑页面
          prefixType:"add",
          prefix:"",
          prefix_name:"",
          parentPrefix:"",
          parentGroupOptions:[],
          showTitle:"HDXpress",
          editPGrp:"",
          depth:"",
          level1_name:"",
          level1_pwd:"",
          level1_pwd:"",
          level2_name:"",
          level2_pwd:"",
          level2_pwd:"",
          level3_pwd:"",
          level1List:[],
          level2List:[],
          level3List:[],
        },
        show:{
          //parentPrefix : true,
          addPrefixBtn:true,
          pGrpStr:false,
          addLevel1Btn:true,
          addLevel2Btn:true,
          addLevel3Btn:true,
        },
        disable:{
          prefix : false,
          parentPrefix:false,
        },
        prefixConfigVisible:false,
        prefixDelVisible:false,
        temp:false,
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          //this.ActiveDevice = val;
          //this.SET_ACTIVE_DEVICE(val);
        }
      }
    },
    created(){  //生命周期-页面创建后
      var that = this;
      this.getPrefixList(that.formatPrefixData);
      this.initAddBtn();
    },
    /*activated(){
      console.log("prefix activated")
      var that = this;
      this.getPrefixList(that.formatPrefixData);
      this.initAddBtn();
    },*/
    methods:{
      ...mapMutations({
          
      }),
      changePrefixListShow(){
        console.log("changePrefixListShow");
        var that = this;
        this.prefixListShow = !this.prefixListShow;
        if(this.prefixListShow){
          this.getPrefixList(that.formatPrefixData);
        }
      },
      initAddBtn(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/userPrefix/userPrefix.php",
          data:this.$qs.stringify({
            getDepthByPrefix : true,
            prefix: that.user.prefix,
          }),
          Api:"getDepthByPrefix",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            if(data[0].depth == that.DEPTH_MAX){
              that.show.addPrefixBtn = false;
            }else{
              that.show.addPrefixBtn = true;
            }
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
      searchPrefixByFilter(){
        var that = this;
        var prefixList = that.prefixList;
        var filterPrefixList = [];
        var filter = that.searchPrefix;
        if(filter && filter != ""){
          var len = prefixList.length;
          for(var i=0; i<len; i++){
            for(var key in prefixList[i]){
              if(prefixList[i][key]){
                if(prefixList[i][key].toString().indexOf(filter) != -1){
                  filterPrefixList.push(prefixList[i]);
                  break;
                }
              }
            }
          }
          that.prefixShowList = filterPrefixList;
        }else{
          that.prefixShowList = prefixList;
        }
        this.temp = false;
        this.$nextTick(function(){
          this.temp = true;
        })
      },
      getPrefixList(cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/userPrefix/userPrefix.php",
          data:this.$qs.stringify({
            getUserPrefixData : true,
            prefix: that.user.prefix,
            userId: that.user.id,
          }),
          Api:"getUserPrefixData",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            console.log("getPrefixList")
            console.log(data)
            if(cb){
              cb(data);
            }
          }else{
            that.receiverList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatPrefixData(data){
        var userPrefixDataOri = data['userPrefix'];
        var userListDataOri = data['userList'];
        var devListDataOri = data['devList'];
        var rcvListDataOri = data['rcvList'];
        var prefixIdName = data['prefixIdName'];
        var parentData = {};
        var userPrefixData = [];
        for(let i=0; i<prefixIdName.length; i++){
          parentData[prefixIdName[i]["id"]] = {};
          parentData[prefixIdName[i]["id"]]["prefix"] = prefixIdName[i]["prefix"]+"/"+prefixIdName[i]["prefix_name"];
          parentData[prefixIdName[i]["id"]]["depth"] = prefixIdName[i]["depth"];
        }
        for(let i=0; i<userPrefixDataOri.length; i++){
          var data = userPrefixDataOri[i];
          if(data["parent"] != ""){
            data["parent_name"] = parentData[data["parent"]]["prefix"];  
          }else{
            data["parent_name"] = "";
          }
          
          //管理员
          data["level1"] = $.map(userListDataOri, function(item, i){
            if(item["prefix"] == data["prefix"] && item["userGroup"] == 1){
              return item["id"];
            }else{
              return ""
            }
          }).filter(function(item){if(item)return true;}).join(", ");
          //高级用户
          data["level2"] = $.map(userListDataOri, function(item, i){
            if(item["prefix"] == data["prefix"] && item["userGroup"] == 2){
              return item["id"];
            }else{
              return ""
            }
          }).filter(function(item){if(item)return true;}).join(", ");
          //普通用户
          data["level3"] = $.map(userListDataOri, function(item, i){
            if(item["prefix"] == data["prefix"] && item["userGroup"] == 3){
              return item["id"];
            }else{
              return ""
            }
          }).filter(function(item){if(item)return true;}).join(", ");
          //背包
          data["dev"] = $.map(devListDataOri, function(item, i){
            if(item["prefix"] == data["prefix"]){
              return item["dev_name"];
            }else{
              return ""
            }
          }).filter(function(item){if(item)return true;}).join(", ");
          //接收机
          data["rcv"] = $.map(rcvListDataOri, function(item, i){
            if(item["prefix"] == data["prefix"]){
              return item["rcv_name"];
            }else{
              return ""
            }
          }).filter(function(item){if(item)return true;}).join(", ");
          userPrefixData[i] = data;
        }
        this.prefixList = userPrefixData;
        this.searchPrefixByFilter();
      },
      addPrefix(){
        var that = this;
        this.prefixConfigVisible = true;
        this.options.prefixType = "add";
        this.disable.prefix = false;
        this.options.prefix = "";
        this.options.prefix_name = "";
        //this.show.parentPrefix = true;
        this.disable.parentPrefix = false;
        this.show.pGrpStr = false;
        //this.initParentPrefix(3);
        //可修改的父组范围
        this.initParentPrefix('','',function(data){
          that.options.parentGroupOptions = data;
          that.options.parentPrefix = data[0].value;
          /*for(var i=0; i<data.length; i++){
            if(data[i].prefix == that.user.prefix){
              that.options.parentPrefix = data[i].id;
              break;
            }
          }*/
        });
        this.options.parentPrefix = "";
        this.options.showTitle = "HDXpress";

        this.options.level1_name = "";
        this.options.level1_pwd = "";
        this.options.level1_pwd2 = "";
        this.options.level1List = [];
        
        this.options.level2_name = "";
        this.options.level2_pwd = "";
        this.options.level2_pwd2 = "";
        this.options.level2List = [];

        this.options.level3_name = "";
        this.options.level3_pwd = "";
        this.options.level3_pwd2 = "";
        this.options.level3List = [];

        this.checkAdminCount();
      },
      editPrefix(item){
        var that = this;
        that.options.prefixType = "edit";
        that.prefixConfigVisible = true;
        that.disable.prefix = true;
        that.options.prefix = item.prefix;
        that.options.prefix_name = item.prefix_name;
        that.show.pGrpStr = true;
        //001组、有子组：不显示父组 不支持父组修改
        that.$global.getChildGrpArr(item.prefix,function(data){
          if(item.prefix == PREFIX || data.length>1){
            //that.show.parentPrefix = false;
            that.disable.parentPrefix = true;
            //that.options.parentPrefix = item.parent;
          } else{
            //that.show.parentPrefix = true;
            //可修改的父组范围
            that.disable.parentPrefix = false;
          }
          that.initParentPrefix(item.prefix,item.parent,function(data){
            that.options.parentGroupOptions = data;
            that.options.parentPrefix = item.parent;
          });
        });
        that.options.showTitle = item.showTitle;
        that.options.editPGrp = item.parent;
        that.options.depth = item.depth;

        var g1 = item.level1;
        var g2 = item.level2;
        var g3 = item.level3;
        var g1Arr = g1.split(", ");
        var g2Arr = g2.split(", ");
        var g3Arr = g3.split(", ");
        that.options.level1List = [];
        that.options.level2List = [];
        that.options.level3List = [];
        var level1List = [], level2List = [], level3List = [];
        if (g1 != "") {
          for (var i = 0; i < g1Arr.length; i++) {
            level1List.push(g1Arr[i]);
          }
        }
        if (g2 != "") {
          for (var i = 0; i < g2Arr.length; i++) {
            level2List.push(g2Arr[i]);
          }
        }
        if (g3 != "") {
          for (var i = 0; i < g3Arr.length; i++) {
            level3List.push(g3Arr[i]);
          }
        }
        that.options.level1List = level1List;
        that.options.level2List = level2List;
        that.options.level3List = level3List;
        that.checkAdminCount();
      },
      /*获取登录组及登录组的子组*/
      initParentPrefix(curPrefix,curParent,callback){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/userPrefix/userPrefix.php",
          data:that.$qs.stringify({
            getGrpsByPrefix : true,
            curprefix : curPrefix, //当前要修改的组
            logprefix : that.user.prefix, //登录用户的组
            curparent : curParent, //登录用户的组的父组
          }),
          Api:"getGrpsByPrefix",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            var arr = data.map(function(item){
              return {"text":item.prefix_name,"value":item.id}
            });
            if(typeof(callback) == 'function'){
              callback(arr);
            }
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
      addLevel(level){
        var that = this;
        if(that.options["level"+level+"_name"] == "" 
          || that.options["level"+level+"_pwd"] == ""
          || that.options["level"+level+"_pwd2"] == ""){
          return;
        }
        that.savePrefixConfig(function(){
          that.addNewUserPillbox(level,function(user,data){
            that.options["level"+level+"List"].push(user)
            if (data.length != 0) {
              that.options.prefix = data;
              that.options.prefixType = "edit";
            }
            that.disable.prefix = true;
            that.getPrefixList();
            that.options["level"+level+"_name"] = "";
            that.options["level"+level+"_pwd"] = "";
            that.options["level"+level+"_pwd2"] = "";
            that.checkAdminCount();
          }) 
        })
      },
      checkAdminCount(){
        var that = this;
        if(that.options.level1List.length == 0){
          that.show.addLevel1Btn = true;
        }else{
          that.show.addLevel1Btn = false;
        }
      },
      /*获取登录组及登录组的子组*/
      /*initParentPrefix(depth){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/userPrefix/userPrefix.php",
          data:that.$qs.stringify({
            getGrpsByPrefix : true,
            curprefix : '', //当前要修改的组
            logprefix : that.user.prefix, //登录用户的组
            curparent : '', //登录用户的组的父组
          }),
          Api:"getGrpsByPrefix",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            var arr = data.filter(function(item){
              if(item.depth != DEPTH_MAX){
                return true;
              }else{
                return false;
              }
            }).map(function(item){
              return {"text":item.prefix_name,"value":item.id+"/"+item.depth}
            })
            that.options.parentGroupOptions = arr;
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
      },*/
      //获取父组深度
      getGrpDepth(parentId, prefix, type,callback){
        var that = this;
        if(prefix == PREFIX){
          if(typeof(callback) == 'function'){
            callback(0);
          }
          return;
        }
        this.$axios({
          method: 'post',
          url:"/page/userPrefix/userPrefix.php",
          data:this.$qs.stringify({
            getGrpDepthById: true,
            grpid: parentId,
          }),
          Api:"getGrpDepthById",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var parentPrefix = res['data'][0].prefix;
            var depth = +res['data'][0].depth;
            if(prefix != parentPrefix){
              depth = depth + 1;
            }
            if(typeof(callback) == 'function'){
              callback(depth);
            }
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
      savePrefixConfig(cb){
        var that = this;
        var type = that.options.prefixType;
        var id = that.options.prefix;
        var name = that.options.prefix_name;
        var showTitle = that.options.showTitle;
        var parent = that.options.parentPrefix;
        if(type == "add"){
          /*父组校验*/
          if(!parent){
            that.$toast({
              message: '请选择父组!',
              position: 'middle',
              duration: 2000
            });
            return false;
          }
        }
        //parent为null
        if(parent == null){
          parent = '';
        }
        /*用户组id和用户组名称校验*/
        if(!that.checkName()){
          return false;
        }
        /*显示标题校验*/
        if(!that.$global.nameCheckType(showTitle,1,20,"number,en,zh")){
          that.$toast({
            message: '请按要求输入标题名称!',
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        //prefix重复
        var data = that.prefixList;
        if (type == "add") {
          for (var i = 0; i < data.length; i++) {
            if (data[i].prefix == id) {
              that.$toast({
                message: '该用户组已添加!',
                position: 'middle',
                duration: 2000
              });
              return;
            }
            if (data[i].prefix_name == name) {
              that.$toast({
                message: '该用户组名已添加!',
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        } else {
          for (var i = 0; i < data.length; i++) {
            if ((data[i].prefix_name == name) && (data[i].prefix != id)) {
              that.$toast({
                message: '该用户组名已添加!',
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }
        //var depth = that.getGrpDepth(parent) +1;
        this.getGrpDepth(parent, id, type, function(depth){
          that.$axios({
            method: 'post',
            url:"/page/userPrefix/userPrefix.php",
            data:that.$qs.stringify({
              type: type,
              id: id,
              name: name,
              showTitle: showTitle,
              parent: parent==-1?"":parent,
              depth: depth,
            }),
            Api:"addUserPrefix",
            AppId:"android",
            UserId:that.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              that.options.prefixType = "edit";
              that.options.editPGrp = parent;
              that.options.depth = depth;
              that.getPrefixList(that.formatPrefixData)
              //that.show.parentPrefix = false;
              //that.disable.parentPrefix = true;
              //that.prefixConfigVisible = false;
              if(cb){
                cb();
              }
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
        })
      },
      checkName(){
        var prefix = this.options.prefix;
        var prefixName = this.options.prefix_name;
        /*用户组id校验*/
        if(!this.$global.nameCheckType(prefix,1,20,"number,en")){
          this.$toast({
            message: '请按要求输入用户组id',
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        /*用户组名称校验*/
        if(!this.$global.nameCheckType(prefixName,1,20,"number,en,zh,@,+,_,(,),（,）")){
          this.$toast({
            message: '请按要求输入用户组名称',
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        return true;
      },
      submitPrefixConfig(cb){
        var that = this;
        this.savePrefixConfig(function(){
          that.prefixConfigVisible = false;
        })
      },
      //用户组管理-添加用户
      addNewUserPillbox(group, cb) {
        var that = this;
        var type = that.options.prefixType;
        var prefix = that.options.prefix;
        var prefixName = that.options.prefix_name;
        var name = that.options["level"+group+"_name"];
        var pwd = that.options["level"+group+"_pwd"];
        var pwd2 = that.options["level"+group+"_pwd2"];
        if(!that.$global.nameCheckType2(name)){
          that.$toast({
            message: '请按要求输入昵称!',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //prefix
        if (prefix == '' || prefix.length > 20) {
          that.$toast({
            message: '请按要求输入用户组!',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //pwd
        if (!that.$global.pwdCheckType(pwd)) {
          that.$toast({
            message: '密码长6-16位，至少包含一个数字一个字母!',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (pwd2 == '') {
          that.$toast({
            message: '请输入确认密码!',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (pwd2 != pwd) {
          that.$toast({
            message: '密码不一致!',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var loginId = name;
        this.$axios({
          method: 'post',
          url:"/page/users/users.php",
          data:this.$qs.stringify({
            addUser: name,
            name:name,
            pwd: pwd,
            group: group,
            prefix: prefix,
            loginId: loginId,
            enable: 1,
            mobilePhone: "",
            emailAddress: "",
            remark: "",
          }),
          Api:"addUser",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(cb){
              cb(name, res.data);
            }
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
      //用户组管理-删除用户
      removeUser(delItm, group) {
        var that = this;
        var text = '确认删除' + delItm + '用户及其设备?';
        MessageBox.confirm('',{
          title:'提示',
          message:text,
          confirmButtonText:'全删',
          cancelButtonText:'只删用户'
        }).then(action => {
          if (action == 'confirm') {
            console.log('全删'); 
            that.$global.deleteUserById(delItm,1,that.deleteCb,group);
          }
        }).catch(error =>{
          if(error == 'cancel'){
            console.log('只删用户');
            that.$global.deleteUserById(delItm,0,that.deleteCb,group);
          }
        });
      },
      deleteCb(flg,group){
        var that = this;
        if(flg == "success"){
          this.getPrefixList(function(data){
            that.formatPrefixData(data);
            var datas = that.prefixList;
            that.options.level1_name = "";
            that.options.level2_name = "";
            that.options.level3_name = "";
            that.options.level1_pwd = "";
            that.options.level2_pwd = "";
            that.options.level3_pwd = "";
            that.options.level1_pwd2 = "";
            that.options.level2_pwd2 = "";
            that.options.level3_pwd2 = "";
            var len = datas.length;
            for(var i=0; i<len; i++){
              if(datas[i]["prefix"] == that.options.prefix){
                var cData = datas[i];
                that.options.level1List = cData.level1==""?[]:cData.level1.split(", ");
                that.options.level2List = cData.level2==""?[]:cData.level2.split(", ");
                that.options.level3List = cData.level3==""?[]:cData.level3.split(", ");    
              }
            }
            
          });
          that.$toast({
            message: '删除用户成功!',
            position: 'middle',
            duration: 2000
          });
          this.options["level1List"]
          this.checkAdminCount();
        }
      },
      delPrefix(item){
        var that = this;
        that.prefixDelVisible = true;
        that.delOptions.prefix = item.prefix;
        that.delOptions.prefix_name = item.prefix_name;
        //默认checkbox全部勾选，select全部隐藏 ：全部删除
        that.delOptions.delGrp = "delGrp";
        that.delOptions.delChildGrp = "delChildGrp";
        that.delOptions.delGrpUser = "delGrpUser";
        that.delOptions.delGrpDev = "delGrpDev";
        that.delOptions.delChildGrpUser = "delChildGrpUser";
        that.delOptions.delChildGrpDev = "delChildGrpDev";
        that.delShow.curChildGrpNew=false;
        that.delShow.curUserGrpNew=false;
        that.delShow.curDevGrpNew=false;
        that.delShow.curDevUserNew=false;
        that.delShow.childUserGrpNew=false;
        that.delShow.childDevGrpNew=false;
        that.delShow.childDevUserNew=false;
        
        //指定子組的新父组
        that.getNewGrp3(item.prefix, function(data){
          //addSelOptions('curChildGrpNew',data);
          that.delOptions.curChildGrpNewOptions = data;
          that.delOptions.curChildGrpNew = data[0].value;
        });
         //指定子组用户所属的新组
        that.getNewGrp2(item.prefix,function(data){
          //addSelOptions('childUserGrpNew',data);
          that.delOptions.childUserGrpNewOptions = data;
          that.delOptions.childUserGrpNew = data[0].value;
        });
      },
      //获取登录用户组以下，不含删除组的所有组
      getNewGrp1(delPrefix, cb){
        var that = this;
        that.$global.getChildGrpArr(that.user.prefix,function(data) {
          var rGrp = [];
          for(var i=0; i<data.length; i++){
            if(data[i]["prefix"] != delPrefix){
              rGrp.push({"text":data[i]["prefix_name"],"value":data[i]["prefix"]})
            }
          }
          if(cb){
            cb(rGrp)
          }
        })
      },
      //获取登录用户组以下，删除组以上的所有组
      getNewGrp2(delPrefix, cb){
        var that = this;
        that.$global.getChildGrpArr(that.user.prefix,function(data) {
          that.$global.getChildGrpArr(delPrefix, function(grpChildGrp){
            var grpChildGrpArr = [];
            for(var k=0; k<grpChildGrp.length; k++){
              grpChildGrpArr.push(grpChildGrp[k]["prefix"]);
            }
            var rGrp = [];
            for(var i=0; i<data.length; i++){
              if($.inArray(data[i]["prefix"], grpChildGrpArr) == -1){
                rGrp.push({"text":data[i]["prefix_name"],"value":data[i]["prefix"]})
              }
            }
            if(cb){
              cb(rGrp);
            }
          })
        })
      },
      //获取登录用户组以下到删除组平级（去掉删除组）的所有组
      getNewGrp3(delPrefix, cb){
        var that = this;
        that.$global.getChildGrpArr(that.user.prefix,function(data) {
          that.$global.getChildGrpArr(delPrefix, function(grpChildGrp){
            var grpChildGrpArr = [];
            var delPrefixDepth = "";
            for(var k=0; k<grpChildGrp.length; k++){
              grpChildGrpArr.push(grpChildGrp[k]["prefix"]);
              if(delPrefix == grpChildGrp[k]["prefix"]){
                delPrefixDepth == grpChildGrp[k]["depth"];
              }
            }
            var rGrp = [];
            for(var i=0; i<data.length; i++){
              if($.inArray(data[i]["prefix"], grpChildGrpArr) == -1 && data[i]["depth"]>=delPrefixDepth){
                rGrp.push({"text":data[i]["prefix_name"],"value":data[i]["prefix"]})
              }
            }
            if(cb){
              cb(rGrp);
            }
          })
        })
      },
      //删除当前组的子组
      delChildGrpEvent(){
        var that = this;
        var delChildGrp = that.delOptions.delChildGrp;
        if(!delChildGrp){
          that.getNewGrp3(that.delOptions.prefix, function(data){
            //addSelOptions('curChildGrpNew',data);
            that.delOptions.curChildGrpNewOptions = data;
          });
          that.delShow.curChildGrpNew = true;
        }else{
          that.delShow.curChildGrpNew = false;
        }

        that.curUserNewGrp();//当前组用户所属新组相关显示
        that.curDevNewGrp();//当前组设备所属新组相关显示

        that.childUserNewGrp();//子组用户所属新组相关显示
        that.childDevNewGrp();//子组设备所属新组相关显示
      },
      //刪除当前组组内用户checkbox
      delGrpUserEvent(){
        var that = this;
        that.curUserNewGrp();
        that.curDevNewGrp();
      },
      //刪除当前组组内设备checkbox
      delGrpDevEvent(){
        var that = this;
        that.curDevNewGrp();
      },

      //删除子组用户checkbox
      delChildGrpUserEvent(){
        var that = this;
        that.childUserNewGrp();
        that.childDevNewGrp();
      },
      //删除子组设备checkbox
      delChildGrpDevEvent(){
        var that = this;
        that.childDevNewGrp();
      },
      //指定当前组组内设备所属的新组更改时触发
      curDevGrpNewEvent(){
        var that = this;
        that.getUsersDevsByPrefix(that.delOptions.curDevGrpNew, function(data){
          var arr = [];
          for(var i=0; i<data.length; i++){
            arr.push({"text":data[i]["id"],"value":data[i]["id"]});
          }
          that.delOptions.curDevUserNewOptions = arr;
          that.delOptions.curDevUserNew = arr[0]["value"];
        })
      },
      //子组设备所属新组change
      childDevGrpNewEvent(){
        var that = this;
        that.getUsersDevsByPrefix(that.delOptions.childDevGrpNew, function(data){
          if(data.length != 0){//组内有用户
            var arr = [];
            for(var i=0; i<data.length; i++){
              arr.push({"text":data[i]["id"],"value":data[i]["id"]})
            }
            that.delOptions.childDevUserNewOptions = arr;
            that.delOptions.childDevUserNew = arr[0]["value"];
          }else{//组内无用户
            that.delOptions.childDevUserNewOptions = [];
            that.delOptions.childDevUserNew = "";
          }
          
        })
      },
      
      //获取组内用户和设备
      getUsersDevsByPrefix(prefix,cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/userPrefix/userPrefix.php",
          data:this.$qs.stringify({
            getUsersDevsByPrefix: true,
            prefix: prefix,
          }),
          Api:"getUsersDevsByPrefix",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var users = res.data.users;
            var devs = res.data.devs;
            var rcvs = res.data.rcvs;
            var userListArr = [];
            var devListArr = [], devNameListArr = [];
            var rcvListArr = [], rcvNameListArr = [];
            for(let i=0; i<users.length; i++){
              userListArr.push(users[i]["id"])
            }
            for(let i=0; i<devs.length; i++){
              devNameListArr.push(devs[i]["dev_name"])
              devListArr.push(devs[i]["id"]);
            }
            for(let i=0; i<rcvs.length; i++){
              rcvNameListArr.push(rcvs[i]["rcv_name"])
              rcvListArr.push(rcvs[i]["id"]);
            }
            if(cb){
              cb(users)
            }
          }else{
            that.receiverList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //当前组用户所属新组相关显示
      curUserNewGrp(){
        var that = this;
        var delChildGrp = that.delOptions.delChildGrp;
        var delGrpUser = that.delOptions.delGrpUser;
        if(!delGrpUser){//不删除当前组用户,显示当前组用户所属新组
          that.formatGrpSelect(that.delOptions.prefix,'curUserGrpNew')
          that.delShow.curUserGrpNew = true;
        }else{//删除当前组用户，不显示当前组所属新组
          that.delShow.curUserGrpNew = false;
        }
      },
      //当前组设备所属新组相关显示
      curDevNewGrp(){
        var that = this;
        var delGrpUser = that.delOptions.delGrpUser;
        var delGrpDev = that.delOptions.delGrpDev;
        if(delGrpUser && !delGrpDev){//删除组内用户且不删除组内设备
          that.formatGrpSelect(that.delOptions.prefix,'curDevGrpNew',function(){
            that.curDevGrpNewEvent();
          })
          that.delShow.curDevGrpNew = true;
          that.delShow.curDevUserNew = true;
        }else{//不删除组内设备
          that.delShow.curDevGrpNew = false;
          that.delShow.curDevUserNew = false;
        }
      },
      //子组用户所属新组相关显示
      childUserNewGrp(){
        var that = this;
        var delChildGrp = that.delOptions.delChildGrp;
        var delChildGrpUser = that.delOptions.delChildGrpUser;
        if(delChildGrp && !delChildGrpUser){
          that.formatGrpSelect(that.delOptions.prefix,'childUserGrpNew')
          that.delShow.childUserGrpNew = true;
        }else{
          that.delShow.childUserGrpNew = false;
        }
      },
      //子组设备所属新组新用户相关显示
      childDevNewGrp(){
        var that = this;
        var delChildGrpUser = that.delOptions.delChildGrpUser;//子组用户checkbox
        var delChildGrpDev = that.delOptions.delChildGrpDev;//子组设备checkbox
        //子组设备相关select
        if(delChildGrpUser && !delChildGrpDev){
          that.formatGrpSelect(that.delOptions.prefix,'childDevGrpNew',function(){
            that.childDevGrpNewEvent();
          })
          that.delShow.childDevGrpNew = true;
          that.delShow.childDevUserNew = true;
        }else{
          that.delShow.childDevGrpNew = false;
          that.delShow.childDevUserNew = false;
        } 
      },
      //删除子组的勾选变化所影响的下拉列表的options的变化
      //获取用户新组，无回调
      //获取设备新组，有回调
      formatGrpSelect(delPrefix,selectId,cb){
        var that = this;
        var delChildGrp = that.delOptions.delChildGrp;
        if(delChildGrp){//勾选删除子组，新组范围为登录组以下，当前组以上
          that.getNewGrp2(delPrefix, function(data){
            that.delOptions[selectId+"Options"] = data;
            that.delOptions[selectId] = data[0]["value"];
            if(cb){
              cb()
            }
          })
        }else{//不勾选删除子组，新组樊伟伟登录组以下，不含当前组
          that.getNewGrp1(delPrefix, function(data){
            that.delOptions[selectId+"Options"] = data;
            that.delOptions[selectId] = data[0]["value"];
            if(cb){
              cb()
            }
          })
        }
      },
      submitPrefixDel(){
        var that = this;
        var curGrp = that.delOptions.prefix;
        var delCurGrpUser = that.delOptions.delGrpUser?true:false;//删除本组用户
        var delCurGrpDev = that.delOptions.delGrpDev?true:false;//删除本组设备
        var delChildGrp = that.delOptions.delChildGrp?true:false;//删除子组
        var delChildGrpUser = that.delOptions.delChildGrpUser?true:false;//删除子组用户
        var delChildGrpDev = that.delOptions.delChildGrpDev?true:false;//删除子组设备
        var curUserGrpNew = that.delOptions.curUserGrpNew;//指定当前组组内用户所属的新组
        var curDevGrpNew = that.delOptions.curDevGrpNew;//指定当前组组内设备所属的新组
        var curDevUserNew = that.delOptions.curDevUserNew;//指定当前组组内设备所属的新组
        var childUserGrpNew = that.delOptions.childUserGrpNew;//指定子组用户所属的新组
        var childDevGrpNew = that.delOptions.childDevGrpNew;//指定子组设备所属的新组
        var childDevUserNew = that.delOptions.childDevUserNew;//指定子组用设备所属的新用户
        var curChildGrpNew = that.delOptions.curChildGrpNew;//指定子组的新父组
        //不删除子组，必须指定子组的新父组
        if(!delChildGrp){
          if(!curChildGrpNew){
            that.$toast({
              message: '请指定子组的新父组!',
              position: 'middle',
              duration: 2000
            });
            return false;
          }
        }
        //不删除当前组用户,当前组用户所属新组必填
        if(!delCurGrpUser){
          if(!curUserGrpNew){
            that.$toast({
              message: '请指定当前组组内用户所属的新组!',
              position: 'middle',
              duration: 2000
            });
            return false;
          }
        }
        //删除组内用户且不删除组内设备
        if(delCurGrpUser && !delCurGrpDev){
          if(!curDevGrpNew){
            that.$toast({
              message: '请指定当前组组内设备所属的新组!',
              position: 'middle',
              duration: 2000
            });
            return false; 
          }
          if(!curDevUserNew){
            that.$toast({
              message: '请指定当前组组内设备所属的新用户!',
              position: 'middle',
              duration: 2000
            });
            return false; 
          }
        }
        //删除子组，不删除子组用户，子组用户的新组必填
        if(delChildGrp && !delChildGrpUser){
          if(!childUserGrpNew){
            that.$toast({
              message: '请指定子组用户所属的新组!',
              position: 'middle',
              duration: 2000
            });
            return false;
          }
        }
        //删除组内用户且不删除组内设备
        if(delChildGrpUser && !delChildGrpDev){
          if(!childDevGrpNew){
            that.$toast({
              message: '请指定子组设备所属的新组!',
              position: 'middle',
              duration: 2000
            });
            return false; 
          }
          if(!childDevUserNew){
            that.$toast({
              message: '请指定子组设备所属的新用户!',
              position: 'middle',
              duration: 2000
            });
            return false; 
          }
        }
        //询问
        MessageBox.confirm('',{
          title:'提示',
          message:'确定删除勾选内容?',
          confirmButtonText:'删除',
          cancelButtonText:'取消'
        }).then(action => {
          if (action == 'confirm') {
            that.$axios({
              method: 'post',
              url:"/page/userPrefix/userPrefix.php",
              data:this.$qs.stringify({
                delUserPrefix:true,
                curGrp:curGrp,//用户组
                delCurGrpUser:delCurGrpUser,//删除本组用户
                delCurGrpDev:delCurGrpDev,//删除本组设备
                delChildGrp:delChildGrp,//删除子组
                delChildGrpUser:delChildGrpUser,//删除子组用户
                delChildGrpDev:delChildGrpDev,//删除子组设备
                curUserGrpNew:curUserGrpNew,//指定当前组组内用户所属的新组
                curDevGrpNew:curDevGrpNew,//指定当前组组内设备所属的新组
                curDevUserNew:curDevUserNew,//指定当前组组内设备所属的新组
                childUserGrpNew:childUserGrpNew,//指定子组用户所属的新组
                childDevGrpNew:childDevGrpNew,//指定子组设备所属的新组
                childDevUserNew:childDevUserNew,//指定子组用设备所属的新用户
                curChildGrpNew:curChildGrpNew,//指定子组的新父组
              }),
              Api:"delUserPrefix",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.prefixDelVisible = false;
                that.getPrefixList(that.formatPrefixData)
              }
            })
            .catch(function (error) {
              console.log(error)
            })
          }
        }).catch(error =>{
          console.log(error)
        });

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
  .PrefixMan .cellLabel{
    width:30%;
  }
  .PrefixMan .cellValue{
    width:70%;
    text-align:right !important;
  }
  .PrefixMan .cellItem{
    margin-top:1px;
  }
  .PrefixMan .addColor{
    color:green;
    text-decoration: underline;
  }
  .PrefixMan .editColor{
    color:#fff;
    text-decoration:underline;
  }
  .PrefixMan .pwdStyle{
    width:40%;
    margin-top:1px;
    float:left;
  }
  .PrefixMan .addBtnStyle{
    font-weight: 700;
    font-size: 30px;
    line-height: 25px;
    color: #3d81f1;
    outline: none!important;
    border: 0!important;
    width: auto !important;
    padding: 0 4px !important;
    margin-right: 0px !important;
  }
  .PrefixMan input::placeholder {
    text-indent:0px;  
  }
  .PrefixMan .userListStyle{
    padding: 5px;
    border: 1px solid #3d81f1;
    border-radius: 4px;
    float: left;
    margin-right: 5px;
    margin-bottom:2px;
  }
  .delGrpDiv .mint-cell{
    background-color:transparent !important;
  }
  .PrefixMan .mint-checkbox-label {
    font-size: .14rem !important;
    color: #000;
  }
  .delGrpDiv .fGrp{
    padding:2px .1rem !important;
  }
  .delGrpDiv .fGrp .tl{
    width:45% !important;
  }
  .delGrpDiv .fGrp .vl{
    width:45% !important;
  }
  .delGrpDiv .fGrp .mint-checklist-title{
    margin:3px  0;
  }
  .popContentStyle{
    height:calc(100% - .5rem) !important;
    overflow-y:auto;
  }
  /*.mint-toast{
    z-index:2010 !important;
  }*/
</style>