<template>
  <div class="RcvMan">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="ReceiverShow=!ReceiverShow">
        实体接收机
        <i class="titleIcon fa chevronStyle" :class="[ReceiverShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
      </div>
      <mt-popup v-model="ReceiverShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div class="GroupItem" v-if="ReceiverShow" id="rcvList" style="height:100%">
          <div class="popTitle">
            <div class="back">
              <div  @click="ReceiverShow=false" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">实体接收机</span>
              </div>            
              <i class="titleIcon addBtn fa fa-refresh" @click.stop="getReceiverList"></i>
              <i class="titleIcon addBtn fa fa-plus-circle" @click.stop="addReceiver" v-if="rcvAddShow"></i>	      
              <input type="text" v-model="options.searchRcv" @click.stop="" @keyup.stop="searchRcvByFilter" class="searchInput">
            </div>
          </div>
          <div class="userPrefix" v-if="userPrefixShow"><!-- 用户组 -->
            <mt-cell :title="'用户组:'+selectPrefixName.join(',')">
              <i class="fa fa-chevron-down" @click.stop="userPrefixPop = true" ></i>
            </mt-cell>
          </div>
          <div class="popContentStyle">
            <template v-for="(item,i) in receiverShowList">
              <mt-cell-swipe
                :right="[ 
                {content: '板卡',handler:() => showBoardInfo(item)},
                {content: '编辑',handler:() => editReceiver(item)},
                {content: '删除',style:{display:rcvDelShow?'':'none'}, handler:() => deleteReceiver(item)}
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
                  <span class="cellName cellLabel" style="float: left;">用户ID</span>
                  <span class="cellName cellValue" style="float: right;">{{ item.user_id }}</span>
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
                  <span class="cellName cellValue" style="float: right;">{{  item.rcv_mac}}</span>
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
          <mt-tab-item id="2" v-show="encodeTabShow">编码卡</mt-tab-item>
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
    <!-- 实体接收机配置 -->
    <mt-popup v-model="receiverConfigVisible" popup-transition="popup-fade">
      <div class="popupContainer">
        <div class="popupTitle">
          实体接收机配置
          <i class="popupCloseBtn fa fa-times" @click="receiverConfigVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitReceiverConfig">
          <div class="fGrp">
            <div class="tl">名称</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.rcvName" required pattern="[A-z0-9+-@() ]{1,15}" title="长度1-15,中文,字母,数字,+,-,@,(),空格">
              <p style="font-size: 12px;color: #666;text-align: left;margin-top:5px;">长度1-15,仅支持中文,字母,数字,+,-,@,()和空格</p>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.rcvSn" required pattern="[A-z0-9]{10}" title="10位数字或字母序列号" :disabled="receiverConfigType == 'edit'"> 
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.prefix" @change="changePrefixFun">
                <template v-for="(item,i) in receiverConfigPrefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.rcvUser">
                <template v-for="(item,i) in receiverConfigUserOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button @click="receiverConfigVisible = false" style="margin-right: .06rem;">取消</button>
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
    name: "RcvMan",
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
          searchRcv:"",
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
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          //this.SET_ACTIVE_DEVICE(val);
          //this.ActiveDevice = val;
          this.getReceiverList();
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
      ...mapMutations({
          
      }),
      changeRcvShowStatus(){
        if(this.ReceiverShow == true){
          $(".RcvMan").css("height",'auto');
        }else{
          $(".RcvMan").css("height",'100%');
        }
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
          data:that.$qs.stringify({
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
      searchRcvByFilter(){
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
          that.$global.getUserPrefixArr(function(data) {
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
            type: "entity",
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
            var mapArr = {"直播":1,"在线":2,"离线":3};
            that.receiverList = data.sort(function(a, b){
              return (mapArr[a.online] - mapArr[b.online])
            });
            that.searchRcvByFilter();
          }else{
            that.receiverList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      showDevice(item){
        var that = this;
        this.devicePopupList = [];
        this.deviceVisible = true;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getboardByVirRcvSn:true,
            rcvSN: item.rcv_sn,
            user_Id:that.user.id
          }),
          Api:"getboardByVirRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.devicePopupList = res.data;
          }else{
            that.devicePopupList = [];
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      editReceiver(item){
        this.receiverConfigVisible = true;
        this.receiverConfigType = "edit";
        this.getDevPrefixList(item);
        this.options = {
          userId:item.user_id,
          rcvName:item.rcv_name,
          rcvSn:item.rcv_sn,
          rcv_online:item.online,
          rcv_autoUpgrade:item.autoUpgrade,
        }
        //升级
        if (item['newestVer'] != ''){
          this.noNewVer = false;
          //已是最新版本
          if(item['newestVer'] == item['softVer']){
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
        var rcvSn = this.options.rcvSn;
        var mode = this.$global.getRcvMode(rcvSn.substr(-4));
        var upgrade = 0;
        if (!mode) {
          that.$toast({
            message: "接收机型号不支持!",
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
        this.getDevPrefixList();
        this.clearRcvPopup();
      },
      changePrefixFun(){
        var that = this;
        that.$global.getNewUserListByPrefix(that.options.prefix, function(userList){
          that.receiverConfigUserOptions = userList;
          that.options.rcvUser = userList[0]["value"];
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
  .me .mint-popup.rightPop{
    width:100%;
    height:100%;
    background-color: #000;
  }
  .rightPop>.GroupItem{
    padding:0px;
  }
  /*.mint-toast{
    z-index:2010 !important;
  }*/
</style>