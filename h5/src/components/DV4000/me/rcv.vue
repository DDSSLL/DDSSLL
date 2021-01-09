<template>
  <div class="RcvMan">
    <div class="Group">
      <div class="GroupTitle" @click="ReceiverShow=!ReceiverShow">
        接收机
        <i class="titleIcon fa" :class="[ReceiverShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <i class="titleIcon addBtn fa fa-refresh" @click.stop="getReceiverList"></i>
        <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addReceiver" v-if="rcvAddShow"></i>
      </div>
      <transition name="slide-fade">
        <div class="GroupItem" v-if="ReceiverShow" id="rcvList">
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefix.join(',')">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <template v-for="(item,i) in rcvList">
            <mt-cell-swipe
              :right="[ 
              {content: '板卡',handler:() => showBoardInfo(item)},
              {content: '编辑',handler:() => editReceiver(item)},
              {content: '删除',style:{display:user.id!=SUPER?'none':''}, handler:() => deleteReceiver(item)}
              ]">
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">接收机名称</span>
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
                <span class="cellName cellLabel" style="float: left;">映射IP</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_ip }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">接收机IP</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_ownIP }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">型号</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_model }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">软件版本</span>
                <span class="cellName cellValue" style="float: right;">{{ item.softVer }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">硬件版本</span>
                <span class="cellName cellValue" style="float: right;">{{ item.hardVer }}</span>
              </div>
              <div class="cellItem">
                <span class="cellName cellLabel" style="float: left;">MAC</span>
                <span class="cellName cellValue" style="float: right;">{{ item.rcv_mac }}</span>
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
        :options="prefixArr"
        @change="changePrefixSelect">
      </mt-checklist>
    </mt-popup>
    <!-- 板卡信息 -->
    <mt-popup v-model="boardInfoVisible" position="right" popup-transition="popup-slide" class="wholePagePop">
      <div class="page-navbar">
      <div class="page-title">
        <i class="fa fa-arrow-left" aria-hidden="true" @click="boardInfoVisible = false" style="position:absolute"></i>
        <span class='navTitle'>板卡信息</span>
      </div>
      <!-- navbar -->
      <mt-navbar class="page-part" v-model="selected">
        <mt-tab-item id="1">状态</mt-tab-item>
        <mt-tab-item id="2" v-if="encodeTabShow">编码卡</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="1"><!-- 状态 -->
          <div class="Group">
            <div class="GroupTitle" @click="decodeBoardShow=!decodeBoardShow">
              解码卡
              <i class="titleIcon fa" :class="[decodeBoardShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
            </div>
            <transition name="slide-fade">
              <div class="GroupItem" v-if="decodeBoardShow">
                <template v-for="(item,i) in decodeBoardData">
                  <div class="deviceCardItem">
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">板卡</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.board_id }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">状态</span>
                      <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.online }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">TCP端口</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.tcpPort }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">UDP端口</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.udpPort }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">配对背包</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.used_dev }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">软件版本</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.softVer }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">硬件版本</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.HardVersion }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">SDI</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.SdiVersion }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">解码</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.DecVer }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">汇聚</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.UdpVer }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </transition>
          </div>
          <div class="Group" v-if="encodeTableShow">
            <div class="GroupTitle" @click="encodeBoardShow=!encodeBoardShow">
              编码卡
              <i class="titleIcon fa" :class="[encodeBoardShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
            </div>
            <transition name="slide-fade">
              <div class="GroupItem" v-if="encodeBoardShow">
                <template v-for="(item,i) in encodeBoardData">
                  <div class="deviceCardItem">
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">板卡</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.BoardNum*1+1 }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">状态</span>
                      <span class="cellName cellValue" style="float: right;" :class="[item.online=='在线'?'onlineStyle':(item.online=='直播'?'onBoardStyle':'')]">{{ item.online }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">TCP端口</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.tcpPort }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">UDP端口</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.udpPort }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">支持</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.support }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">软件版本</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.SysVersion }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">硬件版本</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.HardVersion }}</span>
                    </div>
                    <div class="cellItem">
                      <span class="cellName cellLabel" style="float: left;">汇聚</span>
                      <span class="cellName cellValue" style="float: right;">{{ item.UdpVer }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </transition>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2"><!-- 编码卡 -->
          <div style="padding:10px 20px">
            <div class="GroupItem"><!-- 板卡号 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">板卡号</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.BoardNum" @change="changeBoardNum">
                    <template v-for="item in boradNumArr">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 编码开关 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">编码开关</div>
                <div class="GroupItemValue">
                  <mt-switch v-model="curBoard.start" @change="">
                  </mt-switch>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 工作模式 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">工作模式</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.transmode" @change="changeTransMode">
                    <template v-for="item in $global.OPTION_TRANSMODE">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div v-if="sendSRT">
              <div class="GroupItem"><!-- SRT推流地址 -->
                <div class="GroupItemField">
                  <div class="GroupItemTitle">SRT推流地址</div>
                  <div class="GroupItemValue">
                    <input type="text" class="ItemIpt" v-model="curBoard.srt_send_pushUrl">
                  </div>
                </div>
              </div>
              <div class="GroupItem"><!-- SRT拉流地址 -->
                <div class="GroupItemField">
                  <div class="GroupItemTitle">SRT拉流地址</div>
                  <div class="GroupItemValue">
                    <input type="text" class="ItemIpt" v-model="curBoard.srt_send_pullUrl">
                  </div>
                </div>
              </div>
            </div>  
            <div v-if="serverSRT">
              <div class="GroupItem"><!-- SRT推流地址 -->
                <div class="GroupItemField">
                  <div class="GroupItemTitle">SRT推流地址</div>
                  <div class="GroupItemValue">
                    <input type="text" class="ItemIpt" v-model="curBoard.srt_pushUrl" readonly>
                  </div>
                </div>
              </div>
              <div class="GroupItem"><!-- SRT拉流地址 -->
                <div class="GroupItemField">
                  <div class="GroupItemTitle">SRT拉流地址</div>
                  <div class="GroupItemValue">
                    <input type="text" class="ItemIpt" v-model="curBoard.srt_pullUrl" readonly>
                  </div>
                </div>
              </div>
            </div>
             <div class="GroupItem"><!-- 视频输入 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">视频输入</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.EncInput">
                    <template v-for="item in $global.OPTION_ENCINPUT">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>  
            <div class="GroupItem"><!-- 视频编码 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">视频编码</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.EncVCodec">
                    <template v-for="item in $global.OPTION_ENCVCODEC">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 分辨率 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">分辨率</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.EncFormat" @change="">
                    <template v-for="item in $global.OPTION_ENCFORMAT">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 视频比特率 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">视频比特率</div>
                <div class="GroupItemValue">
                  <input type="text" class="ItemIpt" v-model.number="curBoard.Encvbr">
                  <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">
                    Mbps(0.5-20Mbps)
                  </p>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 音频编码 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">音频编码</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.EncACodec">
                    <template v-for="item in $global.OPTION_ENCACODEC">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 音频通道 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">音频通道</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.EncAChs">
                    <template v-for="item in $global.OPTION_ENCACHS">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 音频比特率 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">音频比特率</div>
                <div class="GroupItemValue">
                  <select class="ItemSelectBlack" v-model="curBoard.EncAbr">
                    <template v-for="item in $global.OPTION_ENCABR">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
             <div class="GroupItem"><!-- 延时 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">延时</div>
                <div class="GroupItemValue">
                  <input type="text" class="ItemIpt" v-model.number="curBoard.transDelay">
                  <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">
                    s(0.01-20s)
                  </p>
                </div>
              </div>
            </div>
            <div class="GroupItem"><!-- 保存 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle"> </div>
                <div class="GroupItemValue" style="float:right">
                  <button @click.prevent="saveSRT" style="border:1px solid #666;">保存</button>
                </div>
              </div>
            </div>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    </mt-popup>
    <!-- 接收机配置 -->
    <mt-popup v-model="receiverConfigVisible"  popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          接收机配置
          <i class="popupCloseBtn fa fa-times" @click="receiverConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="saveRcvConf">
          <div class="fGrp">
            <div class="tl">接收机名称</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curRcv.rcv_name" required pattern="[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]{1,15}" title="长度1~15，仅支持中文,字母,数字,+,-,@,(),和空格" :readonly="curRcv.rcvNameReadonly">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">
                仪器名(长度1~15，仅支持中文,字母,数字,+,-,@,(),和空格)
              </p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="curRcv.rcv_sn" required pattern="[A-z0-9]{10}" title="10位数字或字母序列号" :disabled="curRcv.rcvSnReadonly"> 
            </div>
          </div>
          <div class="fGrp" v-if="show.devPrefix==true">
            <div class="tl">用户组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="curRcv.prefix" :disabled="curRcv.prefixDisable">
                <template v-for="(item,i) in curRcv.prefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="curRcv.rcvUserShow==true">
            <div class="tl">使用者</div>
            <div class="vl">
              <input class="ItemInput" :disabled="curRcv.rcvUserDisable" @click="rcvUserListPop = true" v-model="curRcv.rcvUser">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">
                仅显示非管理员用户
              </p>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button class="modalBtn" @click="deviceConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div>
        </form>
      </div>
    </mt-popup>

    <mt-popup v-model="rcvUserListPop" position="bottom" popup-transition="popup-slide" class="userPrefixPop">
      <span class="chevronDown">
        <i class="fa fa-chevron-down" @click.stop="rcvUserListPop=false"></i>
      </span>
      <mt-checklist
        v-model="curRcv.rcvUser"
        :options="curRcv.userOptions"
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
        selected: '1',
        SUPER : SUPER,
        ADVANCE : ADVANCE,
         NORMAL : NORMAL,
        ADMIN : ADMIN,
        ReceiverShow:false,
        rcvAddShow:true,//添加按钮
        /*用户组*/
        userPrefixShow:true,//用户组过滤
        selectPrefix:[],//选中的用户组
        prefixArr:[],//用户组下拉框数据
        userPrefixPop:false,//用户组pop的show
        /*板卡信息*/
        boardInfoVisible:false,//板卡信息界面显示
        decodeBoardShow:true,//解码卡TAB切换
        encodeBoardShow:false,//编码卡TAB切换
        encodeTabShow:true,//编码卡tab页显示
        encodeTableShow:false,//编码卡显示与否
        decodeBoardData:[],//编码卡数据
        encodeBoardData:[],//解码卡数据
        boardEncodeParamList:{},//所有板卡的信息
        boradNumArr:[],//板卡号下拉列表
        curBoard:{//当前板卡参数
          rcvSn:"",
          BoardNum:"",//板卡号
          start:0,//编码开关
          transmode:"",//工作模式
          srt_send_pushUrl:"",//推流地址
          srt_send_pullUrl:"",//拉流地址
          srt_pushUrl:"",
          srt_pullUrl:"",
          EncInput:"",//视频输入
          EncVCodec:"",//视频编码
          EncFormat:"",//分辨率
          Encvbr:"",//视频比特率
          EncACodec:"",//音频编码
          EncAChs:"",//音频通道
          EncAbr:"",//音频比特率
          transDelay:"",//延时
        },
        serverSRT:false,//serve
        sendSRT:false,//send
        srtInterval:"",

        rcvList:[],//接收机列表
        curRcv:{//接收机编辑页面
          rcvType:"add",
          rcv_name:"",
          rcvNameReadonly:false,//接收机名只读
          rcv_sn:"",
          rcvSnReadonly:false,//序列号只读
          prefixOptions:[],//用户组
          prefix:"",
          prefixDisable:"",
          
          rcvUserShow:false,//使用者
          userOptions:[],//用户
          rcvUser:"",
          rcvUserDisable:false,
          
rcvUserId:"",
          
          
        },
        rcvUserListPop:false,
        boardShow:false,
        
        disable:{
          dev_name:false,
          devUser:false,
        },
        show:{
          devPrefix:true,
          devUser:true,
        },
        
        receiverList:[],
        receiverConfigVisible:false,
        receiverConfigType:'add',
        receiverConfigForm:{
          rcvName:"",
          rcvSn:""
        },
        
        devicePopupList:[],
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
      //this.getReceiverList();
    },
    activated(){
      console.log("devMan activated")
      this.initShowContent();
      //this.getReceiverList();
    },
    methods:{
      ...mapMutations({
          
      }),
      initShowContent(){
        console.log("initShowContent")
        var that = this;
        if(this.user.id == this.SUPER){//"001-admin"
          that.userPrefixShow = true;
          that.rcvAddShow = true;
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
            that.getReceiverList();
          })
        }else{
          that.userPrefixShow = false;
          that.rcvAddShow = false;
        }
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
            userGroup : that.user.userGroup,
            selectByPrefix : selectPrefix,
          }),
          Api:"getRcv",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            console.log("getReceiverList")
            var data = res.data;
            var mapArr = {"直播":1,"在线":2,"离线":3}
            that.rcvList = data.sort(function(a, b){
              return (mapArr[a.online] - mapArr[b.online])
            });

          }else{
            that.rcvList = [];
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
      showBoardInfo(item){
        var that = this;
        this.boardInfoVisible = true;
        this.getDecodeTableData(item);//状态 - 解码卡
        this.getEncodeTableData(item);//状态 - 编码卡
        this.getEncodeParam(item.rcv_sn);//编码板板卡信息
      },
      //获取解码卡数据
      getDecodeTableData(item){
        var that = this;
        var snStr = item.rcv_sn.substr(-4);
        var data = "";
        if (snStr == "2999"){
          data = {getboardByVirRcvSn: true,rcvSN: item.rcv_sn};
        }else{
          data = {getboardByRcvSn: true,rcvSN: item.rcv_sn};  
        }
        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify(data),
          Api:"getboardByVirRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.decodeBoardData = res.data;
          }else{
            that.decodeBoardData = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获取编码卡数据
      getEncodeTableData(item){
        var that = this;
        var snStr = item.rcv_sn.substr(-4);
        if (snStr == "2999"){
          return;
        }
        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getEncBoardByRcvSn: true,
            rcvSN: item.rcv_sn
          }),
          Api:"getEncBoardByRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.encodeBoardData = res.data.map(item => {
              item.support = item.support.replace(/<br>/,' / ');
              return item;
            });
            if(res.data.length > 0){
              that.encodeTableShow = true;
            } else{
              that.encodeTableShow = false;
            }
          }else{
            that.enodeBoardData = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //编码板板卡信息
      getEncodeParam(rcv_sn){
        //$("#rcv_sn").val(rcv_sn);
        var that= this;
        that.curBoard.rcvSn = rcv_sn;
        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getEncodeParam: true,
            rcvSn: rcv_sn
          }),
          Api:"getEncodeParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
             var data = res.data;
              that.boardEncodeParamList = {};
              if(data.length != 0){
                for(let i=0; i<data.length; i++){
                  that.boardEncodeParamList[data[i]["BoardNum"]] = {};
                  that.boardEncodeParamList[data[i]["BoardNum"]]["EncAChs"] = data[i]["EncAChs"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["EncACodec"] = data[i]["EncACodec"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["EncAbr"] = data[i]["EncAbr"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["EncFormat"] = data[i]["EncFormat"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["EncInput"] = data[i]["EncInput"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["EncVCodec"] = data[i]["EncVCodec"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["Encvbr"] = data[i]["Encvbr"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["start"] = data[i]["start"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["transDelay"] = data[i]["transDelay"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["transmode"] = data[i]["transmode"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["srt_pushUrl"] = data[i]["srt_pushUrl"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["srt_pullUrl"] = data[i]["srt_pullUrl"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["srt_send_pushUrl"] = data[i]["srt_send_pushUrl"];
                  that.boardEncodeParamList[data[i]["BoardNum"]]["srt_send_pullUrl"] = data[i]["srt_send_pullUrl"];
                }  
              }
              that.formatEncodeParam(data.length);
          }else{
            that.enodeBoardData = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatEncodeParam(showFlg){
        var that = this;
        if(showFlg == 0){
          that.encodeTabShow = false;
        }else{
          that.encodeTabShow = true;
          var boardNums = Object.keys(that.boardEncodeParamList); 
          var boradNumObj = {};
          that.boradNumArr = [];
          for(let i=0; i<boardNums.length; i++){
            if(boardNums[i].length != 10){
              boradNumObj.text = boardNums[i]*1+1;
            }else{
              boradNumObj.text = boardNums[i];
            }
            boradNumObj.value = boardNums[i];
            that.boradNumArr.push(boradNumObj);
            boradNumObj = {}
          }
          that.curBoard.BoardNum = boardNums[0];
          that.changeBoardNum();
        }
      },
      //改变板卡号change时间
      changeBoardNum(){
        var that = this;
        var selectBoard = that.curBoard.BoardNum;
        var param = that.boardEncodeParamList[selectBoard];
        console.log("param")
        console.log(param);
        that.curBoard.start = param['start'];//编码开关
        that.curBoard.transmode = param["transmode"];//工作模式
        that.changeTransMode();
        that.curBoard.EncInput = param["EncInput"];//视频输入
        that.curBoard.EncVCodec = param["EncVCodec"];//视频编码
        that.curBoard.EncFormat = param["EncFormat"];//分辨率
        that.curBoard.Encvbr = (param["Encvbr"]/1000).toFixed(1);//视频比特率
        that.curBoard.EncACodec = param["EncACodec"];//音频编码
        that.curBoard.EncAChs = param["EncAChs"];//音频通道
        that.curBoard.EncAbr = param["EncAbr"];//延时
        that.curBoard.transDelay = (param["transDelay"]/1000).toFixed(2)
      },
      changeTransMode(){
        console.log("changeTransMode")
        var that = this;
        var param = that.boardEncodeParamList[that.curBoard.BoardNum];
        console.log(param);
        if(that.curBoard.transmode == "SRT SEND"){
          console.log("SRT SEND")
          that.sendSRT = true;
          that.serverSRT = false;
          that.srt_send_pushUrl = param['srt_send_pushUrl']
          that.srt_send_pullUrl = param['srt_send_pullUrl']
          clearInterval(that.srtInterval);
        }else if(that.curBoard.transmode == "SRT SERVER"){
          console.log("SRT SERVER")
          that.sendSRT = false;
          that.serverSRT = true;
          //定时轮询取值
          that.srtInterval = setInterval(function(){
            that.getSeverSrt();
          },1000)
         }else{
             that.sendSRT = false;
            that.serverSRT = false;
            clearInterval(that.srtInterval);
          }
      },
      getSeverSrt(){
        var that = this;
        var rcvSn = that.curBoard.rcvSn;
        var BoardNum = that.curBoard.BoardNum;
        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getSeverSrt: true,
            rcvSn: rcvSn,
            BoardNum:BoardNum,
          }),
          Api:"getSeverSrt",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data[0]
            that.curBoard.srt_pushUrl = data['srt_pushUrl'];
            that.curBoard.srt_pullUrl = data['srt_pullUrl'];
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
      //保存
      saveSRT(){
        var that = this;
        var rcvSn = that.curBoard.rcvSn;
        var BoardNum = that.curBoard.BoardNum;
        var start = that.curBoard.start?"1":"0";
        var transmode = that.curBoard.transmode;
        var EncInput = that.curBoard.EncInput;
        var EncVCodec = that.curBoard.EncVCodec;
        var EncFormat = that.curBoard.EncFormat;
        var Encvbr = that.curBoard.Encvbr*1000;
        var EncACodec = that.curBoard.EncACodec;
        var EncAChs = that.curBoard.EncAChs;
        var EncAbr = that.curBoard.EncAbr;
        var transDelay = that.curBoard.transDelay*1000;

        var srt_pushUrl = that.curBoard.srt_send_pushUrl;
        var srt_pullUrl = that.curBoard.srt_send_pullUrl;
        var srt_send_pushUrl = that.curBoard.srt_send_pushUrl;
        var srt_send_pullUrl = that.curBoard.srt_send_pullUrl;
        
        if(typeof Encvbr === 'number' && !isNaN(Encvbr)){
          if(Encvbr <500 || Encvbr> 20000){
            that.$toast({
              message: "请按要求输入视频比特率",
              position: 'middle',
              duration: 2000
            });  
            return;
          }
        }else{
          that.$toast({
            message: "请按要求输入视频比特率",
            position: 'middle',
            duration: 2000
          });  
          return;
        }
        if(typeof transDelay === 'number' && !isNaN(transDelay)){
          if(transDelay <10 || transDelay> 20000){
            that.$toast({
              message: "请按要求输入延时",
              position: 'middle',
              duration: 2000
            });  
            return;
          }
        }else{
          that.$toast({
            message: "请按要求输入延时",
            position: 'middle',
            duration: 2000
          });  
          return;
        }
        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:that.$qs.stringify({
            setEncodeParam : true,
            rcvSn : rcvSn,
            BoardNum : BoardNum,
            start : start,
            transmode : transmode,
            EncInput : EncInput?EncInput:"",
            EncVCodec : EncVCodec?EncVCodec:"",
            EncFormat : EncFormat?EncFormat:"",
            Encvbr : Encvbr?Encvbr:"",
            EncACodec : EncACodec?EncACodec:"",
            EncAChs : EncAChs?EncAChs:"",
            EncAbr : EncAbr?EncAbr:"",
            transDelay : transDelay?transDelay:"",
            srt_pushUrl : srt_pushUrl?srt_pushUrl:"",
            srt_pullUrl : srt_pullUrl?srt_pullUrl:"",
            srt_send_pushUrl : srt_send_pushUrl?srt_send_pushUrl:"",
            srt_send_pullUrl : srt_send_pullUrl?srt_send_pullUrl:"",
          }),
          Api:"setEncodeParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$toast({
               message: "参数修改成功",
              position: 'middle',
              duration: 2000
            });
            that.boardEncodeParamList[BoardNum] = {};
            that.boardEncodeParamList[BoardNum]["start"] = start;
            that.boardEncodeParamList[BoardNum]["transmode"] = transmode;
            that.boardEncodeParamList[BoardNum]["EncInput"] = EncInput;
            that.boardEncodeParamList[BoardNum]["EncVCodec"] = EncVCodec;
            that.boardEncodeParamList[BoardNum]["EncFormat"] = EncFormat;
            that.boardEncodeParamList[BoardNum]["Encvbr"] = Encvbr;
            that.boardEncodeParamList[BoardNum]["EncACodec"] = EncACodec;
            that.boardEncodeParamList[BoardNum]["EncAChs"] = EncAChs;
            that.boardEncodeParamList[BoardNum]["EncAbr"] = EncAbr;
            that.boardEncodeParamList[BoardNum]["transDelay"] = transDelay;
            that.boardEncodeParamList[BoardNum]["srt_pushUrl"] = srt_pushUrl;
            that.boardEncodeParamList[BoardNum]["srt_pullUrl"] = srt_pullUrl;
            that.boardEncodeParamList[BoardNum]["srt_send_pushUrl"] = srt_send_pushUrl;
            that.boardEncodeParamList[BoardNum]["srt_send_pullUrl"] = srt_send_pullUrl;
            clearInterval(that.srtInterval);
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
        var that = this;
        that.curRcv.rcvType = "add";
        that.curRcv.rcv_name = "";
        that.curRcv.rcv_sn = "";
  
        that.receiverConfigVisible = true;
        that.curRcv.rcvUserShow = false;
        that.curRcv.rcvNameReadonly = false;
        that.curRcv.rcvSnReadonly=false;
        that.curRcv.prefixDisable=false;
        that.curRcv.rcvUserDisable=false;
        //初始化用户组
        that.initPrefix(function(){
          that.curRcv.prefix = "";
        })        
      },
      //编辑接收机
      editReceiver(item){
        var that = this;
        that.curRcv.rcvType = "edit";
        that.receiverConfigVisible = true;
        that.curRcv.rcv_name = item.rcv_name;
        if (item.user_id != that.user.id) {
          that.curRcv.rcvNameReadonly = true;
        }
        that.curRcv.rcv_sn = item.rcv_sn;
        that.curRcv.rcvSnReadonly = true;

        //初始化用户组
        that.initPrefix(function(){
          that.curRcv.prefix = item.prefix;
          var prefix = that.curRcv.prefix;
          that.$global.initUserListByPrefix(prefix, function(data) {
            that.curRcv.userOptions = data.userArr.map(function(item){
              return {"label":item.text,"value":item.value}
            });
            that.$global.getUsersByDevSn(item.rcv_sn,function(data){
              var users = data.devUser;
              that.curRcv.rcvUser = data.devUser;
              var hasRights = "";
              hasRights = that.$global.judgeUserHasDevRights();
              if (hasRights) {
                that.rcvUserDisable = false;
              } else {
                that.rcvUserDisable = true;
              }
            });
          });
        })

        that.curRcv.rcvUserShow = true;

        that.curRcv.rcvUserId = item.user_id;
        that.curRcv.rcv_ip = item.rcv_ip;
        that.curRcv.oldRcvName = item.rcv_name;
        that.curRcv.oldRcvUserGroup = item.prefix;
        that.curRcv.edit_rcv_name = item.rcv_name + "_" + item.rcv_sn;
        
        that.curRcv.prefixDisable = true;
        
        var hasRights = that.judgeUserHasRcvRights(item.rcv_sn);
        if (!hasRights) {
          that.curRcv.rcvNameReadonly = true;
        }
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
              that.curRcv.prefixOptions = res.data
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
          that.curRcv.prefixOptions = option;
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
        var all_row = that.rcvList;
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
      saveRcvConf() {
        var that = this;
        var type = that.curRcv.rcvType;
        var name = that.curRcv.rcv_name;
        var sn = that.curRcv.rcv_sn;
        var prefix = that.curRcv.prefix;
        var selectVal = that.curRcv.rcvUser;
        var sub = sn.substr(-4);
        //接收机sn校验
        if (!that.$global.isValidRcvSn(sn)) {
          if (sub == "2999") {
            that.$toast({
              message: "请输入10位数字或字母的序列号!",
              position: 'middle',
              duration: 2000
            }); 
          } else {
            that.$toast({
              message: "请输入10位数字序列号!",
              position: 'middle',
              duration: 2000
            }); 
          }
          return;
        }
        var mode = that.$global.getRcvMode(sub);
        if (mode == false) {
          that.$toast({
            message: "接收机型号不支持!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //sn 重复(新添加接收机时校验，编辑的时候不用校验)
        if (type == "add") {
          var data = that.rcvList;
          for (var i = 0; i < data.length; i++) {
            if (data[i].rcv_sn == sn) {
              that.$toast({
                message: "该接收机已添加!",
                position: 'middle',
                duration: 2000
              });
              return;
            }
          }
        }

        //用户校验
        var strValue = '';
        if(type == 'edit'){
          if (selectVal && selectVal.length != 0) {
            for (var i = 0; i < selectVal.length; i++) {
              var id = selectVal[i];
              //前缀
              if (that.user.id != that.SUPER) {
                id = logPrefix + '-' + selectVal[i];
              }
              if (strValue == '') {
                strValue = id;
              } else {
                strValue += ',' + id;
              }
            }
          }
        }

        that.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:that.$qs.stringify({
            rcvName : name,
            rcvSn : sn,
            rcvModel : mode,
            userId : that.user.id,
            prefix : prefix,
            rcvUser : strValue,
            type : type,
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
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      deleteReceiver(item){
        var that = this;
        if(item.online == "直播"){
          that.$toast({
            message: "当前设备正在直播",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        that.$messagebox.confirm("确认删除选中设备?").then(
          action => {
            that.$axios({
              method: 'post',
              url:"/page/dev/devData.php",
              data:this.$qs.stringify({
                delRcvSns:item.rcv_sn,
                userGroup:that.user.userGroup
              }),
              Api:"delRcv",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.$toast({
                  message: '删除成功！'
                });
                that.getReceiverList();
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
        );
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