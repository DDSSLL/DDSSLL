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
                        <span class="cellName cellValue" style="float: right;">{{ item.DecSoftVer }}</span>
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
              <input type="text" class="ItemInput" v-model="options.rcvName" required title="长度1-15,中文,字母,数字,+,-,@,(),空格">
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
          <div class="fGrp" v-if="ipConfigShow">
            <div class="tl linkTitle" @click="ipSettingShow = !ipSettingShow">IP设置</div>
            <div class="vl">
            </div>
          </div>
          <div v-if="ipSettingShow">
            <div class="fGrp">
              <div class="tl">DHCP</div>
              <div class="vl">
                <mt-switch v-model="ipSetting.enableDhcpState" @change=""></mt-switch>
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">本地IP</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="ipSetting.localIp" placeholder="本地IP">
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">映射IP</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="ipSetting.mapIp" placeholder="映射IP">
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">子网掩码</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="ipSetting.netmask" placeholder="子网掩码">
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">网关</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="ipSetting.gateway" placeholder="网关">
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">DNS</div>
              <div class="vl">
                <input type="text" class="ItemInput" v-model="ipSetting.dns" placeholder="DNS">
              </div>
            </div>
            <div class="fGrp">
              <div class="tl">代理</div>
              <div class="vl">
                <mt-switch v-model="ipSetting.enableVpnState" @change=""></mt-switch>
              </div>
            </div>
            <div class="fGrp">
              <div class="tl linkTitle" @click="proxySettingShow = !proxySettingShow">Proxy设置</div>
              <div class="vl">
              </div>
            </div>
            <div v-if="proxySettingShow">
              <div class="fGrp">
                <div class="tl">TunNet</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="ipSetting.tun_net" placeholder="TunNet">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">VPNServer</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="ipSetting.vpn_server" placeholder="VPNServer">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">VPNPort</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="ipSetting.vpn_port" placeholder="VPNPort">
                </div>
              </div>
              <div class="fGrp">
                <div class="tl">VPNDns</div>
                <div class="vl">
                  <input type="text" class="ItemInput" v-model="ipSetting.vpn_dns" placeholder="VPNDns">
                </div>
              </div>
            </div>
            <div class="fGrp" v-if="decodeContentShow">
              <div class="tl linkTitle" @click="decodeSettingShow = !decodeSettingShow">解码卡设置</div>
              <div v-if="decodeSettingShow">
                <div class="fGrp">
                  <div class="tl" style="width:100%;text-align:left;line-height:normal">端口有效范围：1024-65535，不同板卡端口设置应避免重合，否则会有冲突</div>
                </div>
                <div v-if="ipSetting.decboard0Show">
                  <div class="fGrp">
                    <div class="tl">板卡1 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput " v-model="ipSetting.TcpPort0">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart0">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop0">
                    </div>
                  </div>
                </div>
                <div v-if="ipSetting.decboard1Show">
                  <div class="fGrp">
                    <div class="tl">板卡2 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.TcpPort1">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart1">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop1">
                    </div>
                  </div>
                </div>
                <div v-if="ipSetting.decboard2Show">
                  <div class="fGrp">
                    <div class="tl">板卡3 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.TcpPort2">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart2">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop2">
                    </div>
                  </div>
                </div>
                <div v-if="ipSetting.decboard3Show">
                  <div class="fGrp">
                    <div class="tl">板卡4 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.TcpPort3">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart3">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop3">
                    </div>
                  </div>
                </div>
                <div v-if="ipSetting.decboard4Show">
                  <div class="fGrp">
                    <div class="tl">板卡5 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.TcpPort4">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart4">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop4">
                    </div>
                  </div>
                </div>
                <div v-if="ipSetting.decboard5Show">
                  <div class="fGrp">
                    <div class="tl">板卡6 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.TcpPort5">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart5">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop5">
                    </div>
                  </div>
                </div>
                <div v-if="ipSetting.decboard6Show">
                  <div class="fGrp">
                    <div class="tl">板卡7 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.TcpPort6">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart6">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop6">
                    </div>
                  </div>
                </div>
                <div v-if="ipSetting.decboard7Show">
                  <div class="fGrp">
                    <div class="tl">板卡8 TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.TcpPort7">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStart7">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.UdpPortStop7">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="fGrp" v-if="encodeContentShow">
              <div class="tl linkTitle" @click="encodeSettingShow = !encodeSettingShow">编码卡设置</div>
              <div v-if="encodeSettingShow">
                <div class="fGrp">
                  <div class="tl" style="width:100%;text-align:left;line-height:normal">端口有效范围：1024-65535，不同板卡端口设置应避免重合，否则会有冲突</div>
                </div>
                <div>
                  <div class="fGrp">
                    <div class="tl">板卡 SRT</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput " v-model="ipSetting.encSrtPort">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">TCP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput " v-model="ipSetting.encTcpPort">
                    </div>
                  </div>
                  <div class="fGrp">
                    <div class="tl">UDP</div>
                    <div class="vl leftvl">
                      <input type="text" class="ItemInput" v-model="ipSetting.EncUdpPortStart">
                      -
                      <input type="text" class="ItemInput" v-model="ipSetting.EncUdpPortStop">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="fGrp">
              <div class="tl" style="color: #ffb37f;">修改IP参数请点击<i class="fa fa-hand-o-right" aria-hidden="true"></i></div>
              <div class="vl">
                <button type="button" @click="rcvIpEffect" :disable="ipEffectDis">{{ipEffectText}}</button>
                <button type="button" @click="rcvEffectStopIp">停止</button><!--停止生效-->
              </div>
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
        ipConfigShow:false,//IP设置
        ipSettingShow:false,//IP设置
        proxySettingShow:false,//代理
        decodeContentShow:false,
        decodeSettingShow:false,//解码卡设置
        encodeContentShow:false,//编码卡设置
        encodeSettingShow:false,
        ipEffectText:"立即生效",
        ipEffectDis:false,
        ipTimer:"",
        ipSetting:{
          enableVpnState:"",
          enableDhcpState:"",
          startDate:"",
          endDate:"",
          tun_net:"",
          vpn_server:"",
          vpn_port:"",
          vpn_dns:"",
          localIp:"",
          mapIp:"",
          netmask:"",
          gateway:"",
          dns:"",
          boardDecIdArr:[],
          decboard0Show:false,
          TcpPort0:"",
          UdpPortStart0:"",
          UdpPortStop0:"",
          decboard1Show:true,
          TcpPort1:"",
          UdpPortStart1:"",
          UdpPortStop1:"",
          decboard2Show:true,
          TcpPort2:"",
          UdpPortStart2:"",
          UdpPortStop2:"",
          decboard3Show:true,
          TcpPort3:"",
          UdpPortStart3:"",
          UdpPortStop3:"",
          decboard4Show:true,
          TcpPort4:"",
          UdpPortStart4:"",
          UdpPortStop4:"",
          decboard5Show:true,
          TcpPort5:"",
          UdpPortStart5:"",
          UdpPortStop5:"",
          decboard6Show:true,
          TcpPort6:"",
          UdpPortStart6:"",
          UdpPortStop6:"",
          decboard7Show:true,
          TcpPort7:"",
          UdpPortStart7:"",
          UdpPortStop7:"",
          encSrtPort:"",
          encTcpPort:"",
          EncUdpPortStart:"",
          EncUdpPortStop:"",
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
        }
        if(item.online == "在线"){//在线才可以进行IP设置
          this.ipConfigShow = true;
          this.rcvIpData(item.rcv_sn, function(data){
            var vpnData = data;
            if(vpnData['vpnEnable'] == 1){
              that.ipSetting.enableVpnState = true;
            }else if(vpnData['vpnEnable'] == 0){
              that.ipSetting.enableVpnState = false;
            }
            if(vpnData['dhcp'] == 1){
              that.ipSetting.enableDhcpState = true;
            }else if(vpnData['dhcp'] == 0){
              that.ipSetting.enableDhcpState = false;
            }
            that.ipSetting.startDate = vpnData['vpnStartTime'];
            that.ipSetting.endDate = vpnData['vpnEndTime'];
            that.ipSetting.tun_net = vpnData['tunNet'];
            that.ipSetting.vpn_server = vpnData['vpsIp'];
            that.ipSetting.vpn_port = vpnData['vpsPort'];
            that.ipSetting.vpn_dns = vpnData['vpnDns'];
            that.ipSetting.localIp = vpnData['localIp'];
            that.ipSetting.mapIp = vpnData['mapIp'];
            that.ipSetting.netmask = vpnData['netmask'];
            that.ipSetting.gateway = vpnData['gateway'];
            that.ipSetting.dns = vpnData['dns'];
            /*getRcvEditData(row,"entity");
            $("#rcvManDiv").modal('show');*/
            that.showDecBoard(vpnData);
            that.showEncBoard(vpnData);
          })
        }else{
          this.ipConfigShow = false;
        }
        //升级
        /*if (item['newestVer'] != ''){
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
        }*/
      },
      //查询实体接收机对应的VPN参数
      rcvIpData(rcv_sn,callback){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            selectRcvIp: true,
            rcv_sn: rcv_sn
          }),
          Api:"selectRcvIp",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if (typeof(callback) == 'function') {
              callback(res.data[0]);
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
      //解码卡是否显示并获取显示数据
      showDecBoard(rcvData){
        var that = this;
        var rcv_sn = rcvData['rcv_sn'];
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getboardByRcvSn: true,
            rcvSN: rcv_sn
          }),
          Api:"getboardByRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var boardDatas = res.data;
            if(boardDatas.length == 0){
              that.decodeContentShow = false;//解码卡设置hide
            }else{
              that.decodeContentShow = true;//解码卡设置show
              var jArr = [1,2,3,4,5,6,7,8];
              var difArr = [];
              for (var i = 0; i < boardDatas.length; i++) {
                var board_id = boardDatas[i]["board_id"];
                that.ipSetting.boardDecIdArr.push(board_id);
              }
              difArr = that.$global.array_diff(jArr, that.ipSetting.boardDecIdArr);
              //动态判断显示哪些解码卡
              if(difArr.length ==0){
                for(var i = 0; i < that.ipSetting.boardDecIdArr.length; i++){
                  var boardId = that.ipSetting.boardDecIdArr[i] - 1;
                  that.ipSetting["decboard"+boardId+"Show"] = true;
                }
              }else{
                for(var i = 0; i < difArr.length; i++){
                  var boardId = difArr[i] - 1;
                  that.ipSetting["decboard"+boardId+"Show"] = false;
                }
                for(var i = 0; i < that.ipSetting.boardDecIdArr.length; i++){
                  var boardId = that.ipSetting.boardDecIdArr[i] - 1;
                  that.ipSetting["decboard"+boardId+"Show"] = true;
                }
              }
              //显示的解码卡获取数据
              for(var i = 0; i < that.ipSetting.boardDecIdArr.length; i++){
                var boardId = that.ipSetting.boardDecIdArr[i] - 1;
                var tcp = "tcp"+ boardId;
                var udpS = "udpS"+ boardId;
                var udpE = "udpE"+ boardId;
                that.ipSetting["TcpPort"+boardId] = rcvData[tcp];
                that.ipSetting["UdpPortStart"+boardId] = rcvData[udpS];
                that.ipSetting["UdpPortStop"+boardId] = rcvData[udpE];
              }
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
      //编码卡是否显示并获取显示数据(编码卡只有1个)
      showEncBoard(rcvData){
        var that = this;
        var rcv_sn = rcvData['rcv_sn'];
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getEncBoardByRcvSn: true,
            rcvSN: rcv_sn
          }),
          Api:"getEncBoardByRcvSn",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var boardDatas = res.data;
            if(boardDatas.length == 0){
              that.encodeContentShow = false;//编码卡设置hide
            }else{
              that.encodeContentShow = true;//编码卡设置show
              that.ipSetting.encSrtPort
              that.ipSetting.encSrtPort = rcvData['encSrcPort'];
              that.ipSetting.encTcpPort = rcvData['encTcp'];
              that.ipSetting.EncUdpPortStart = rcvData['encUdpS'];
              that.ipSetting.EncUdpPortStop = rcvData['encUdpE'];
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
      //实体接收机IP设置立即生效
      rcvIpEffect(){
        var that = this;
        //IP设置参数有效性
        var rcv_sn = this.options.rcvSn;
        var localIp = this.ipSetting.localIp;
        var mapIp = this.ipSetting.mapIp;
        var netmask = this.ipSetting.netmask;
        var gateway = this.ipSetting.gateway;
        var dns = this.ipSetting.dns;
        var state = this.ipSetting.enableDhcpState;
        var dhcp = '0';
        if(state){
         dhcp = '1';
        }
        var dataJson = {
          rcv_sn: rcv_sn,
          localIp: localIp,
          mapIp:mapIp,
          netmask:netmask,
          gateway:gateway,
          dns:dns,
          dhcp:dhcp
        };
        if(!this.checkIpValid(dataJson)){//校验参数合法性
          return;
        }
        //代理
        var vpnEnable = this.ipSetting.enableVpnState;
        if(vpnEnable){
          dataJson.vpnEnable = '1';
        } else {
          dataJson.vpnEnable = '0';
        }
        //是否设置vpn参数
        dataJson.setVpn = '0';
        //vpn参数
        if(this.proxySettingShow || dataJson.vpnEnable === '1'){
          dataJson.setVpn = '1';
          var startDate = this.ipSetting.startDate;
          var endDate = this.ipSetting.endDate;
          var tun_net = this.ipSetting.tun_net;
          var vpn_server = this.ipSetting.vpn_server;
          var vpn_port = this.ipSetting.vpn_port;
          var vpn_dns = this.ipSetting.vpn_dns;

          dataJson.startDate = startDate;
          dataJson.endDate = endDate;
          dataJson.tun_net = tun_net;
          dataJson.vpn_server = vpn_server;
          dataJson.vpn_port = vpn_port;
          dataJson.vpn_dns = vpn_dns;

          var paramValid = true;
          if(!this.checkVpnValid(dataJson)){//校验参数合法性
            paramValid = false;
          }
          if(this.validDate(startDate,endDate)){//参数合法且当前系统时间在有效期内,vpnValid置1
            dataJson.vpnValid = '1';
          } else{
            dataJson.vpnValid = '0';
            paramValid = false;
          }
          //参数不合法
          if(!paramValid){
            if(dataJson.vpnEnable === '1'){
              this.ipSetting.enableVpnState = false;
              this.$toast({
                message: "请联系技术支持配置代理参数!",
                position: 'middle',
                duration: 2000
              });
            }
            return;
          }
          else{
            //参数合法，且打开代理，映射IP需要等于vpn服务器ip
            if(dataJson.vpnEnable === '1'){
              dataJson.mapIp = dataJson.vpn_server;
              this.ipSetting.mapIp = dataJson.mapIp;
            }
          }
        }
        //解码卡参数
        dataJson.decFlag = '0';
        if(this.decodeContentShow){
          if (!this.checkInput("dec",that.ipSetting.boardDecIdArr)) {
            return;
          }
          for(var i = 0; i < this.ipSetting.boardDecIdArr.length; i++){
            dataJson.decFlag = '1';//表示存在解码卡显示的标志
            var boardId = this.ipSetting.boardDecIdArr[i] - 1;
            if(this.ipSetting["decboard"+boardId+"Show"]){
              var tcp = "tcp"+ boardId;
              var udpS = "udpS"+ boardId;
              var udpE = "udpE"+ boardId;
              dataJson[tcp] = this.ipSetting["TcpPort"+boardId];
              dataJson[udpS] = this.ipSetting["UdpPortStart"+boardId];
              dataJson[udpE] = this.ipSetting["UdpPortStop"+boardId];
            }
          }
        }
        //编码卡参数
        dataJson.encFlag = '0';
        if(this.encodeContentShow){
          if (!this.checkInput("enc",[])) {
            return;
          }
          dataJson.encFlag = '1';//表示存在解码卡显示的标志
          dataJson['encSrcPort'] = this.ipSetting["encSrtPort"];
          dataJson['encTcp'] = this.ipSetting["encTcpPort"];
          dataJson['encUdpS'] = this.ipSetting["EncUdpPortStart"];
          dataJson['encUdpE'] = this.ipSetting["EncUdpPortStop"];
        }
        //存数据，立即生效
        dataJson.rst = '1';

        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            saveRcvIpSet: true,
            setIpParam: dataJson
          }),
          Api:"saveRcvIpSet",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.ipEffectText = "生效中";
            that.ipEffectDis = true;
            that.ipTimer = setInterval(function() {//检测rst值
              that.getEffect(rcv_sn,function(data) {
                if(data == 'finish'){
                  clearInterval(that.ipTimer);
                  that.ipEffectText = "立即生效";
                  that.ipEffectDis = false;
                  that.$toast({
                    message: '已生效',
                    position: 'middle',
                    duration: 2000
                  });
                }
              });
            }, 1000);
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
      rcvEffectStopIp(){
        this.rcvEffectStop('ip')
      },
      //停止接收机立即生效
      rcvEffectStop(type){
        if(type == 'vpn'){
          clearInterval(vpnTimer);
        }else if(type == 'ip'){
          clearInterval(this.ipTimer);
        }
        this.setRcvOneParam('rst', 0);
        this.ipEffectText = "立即生效";
        this.ipEffectDis = false;
      },
      //设置接收机VPN某个参数
      setRcvOneParam(param, value) {
        var that = this;
        var rcv_sn = this.options.rcv_sn;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            rcvSN : rcv_sn,
            rcvParamCol : param,
            value : value+"",
          }),
          Api:"SetRcvParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            showLayer('设置成功', btn_id);
            that.$toast({
              message: "设置成功",
              position: 'middle',
              duration: 2000
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
      },
      checkIpValid(dataJson){
        if(!this.$global.isValidIP(dataJson.localIp)){
          this.$toast({
            message: "请输入正确格式的本地IP!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidIP(dataJson.mapIp)){
          this.$toast({
            message: "请输入正确格式的映射IP!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidIP(dataJson.netmask)){
          this.$toast({
            message: "请输入正确格式的子网掩码!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidIP(dataJson.gateway)){
          this.$toast({
            message: "请输入正确格式的网关!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidIP(dataJson.dns)){
          this.$toast({
            message: "请输入正确格式的DNS!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        return true;
      },
      checkVpnValid(dataJson){
        if(dataJson.startDate == ''){
          this.$toast({
            message: "请输入有效期范围!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(dataJson.endDate == ''){
          this.$toast({
            message: "请输入有效期范围!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidIP(dataJson.tun_net)){
          this.$toast({
            message: "请输入正确格式的TunNet!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidIP(dataJson.vpn_server)){
          this.$toast({
            message: "请输入正确格式的VPNServer!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidPort(dataJson.vpn_port)){
          this.$toast({
            message: "请输入正确格式的VPNPort!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        if(!this.$global.isValidIP(dataJson.vpn_dns)){
          this.$toast({
            message: "请输入正确格式的VPNDns!",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        return true;
      },
      //判断当前系统时间是否在有效期内
      validDate(d1,d2){
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateBegin = new Date(d1);//将-转化为/，使用new Date
        var dateEnd = new Date(d2);//将-转化为/，使用new Date
        var dateNow = new Date();//获取当前时间
        var beginDiff = dateNow.getTime() - dateBegin.getTime();//时间差的毫秒数
        var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数
        var endDiff = dateEnd.getTime() - dateNow.getTime();//时间差的毫秒数
        var endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));//计算出相差天数
        if (endDayDiff < 0) {//已过期，已失效
          return false;
        }
        if (beginDayDiff < 0) {//没到开始时间,未来有效
          return false;
        }
        return true;
      },
      //获取编码器复位成功标志
      getEffect(rcv_sn,callback) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/dev/devData.php",
          data:this.$qs.stringify({
            getEffect: true,
            rcv_sn: rcv_sn
          }),
          Api:"getEffect",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if (typeof(callback) == 'function') {
              callback(res.data);
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
        var name = this.options.rcvName;
        var sn = this.options.rcvSn;
        var upgrade = 0;
        //接收机名称校验
        var len = this.$global.SubstrFitCn(name, 0);//匹配中文，中文按一个字符处理
        if(len > 15){
          this.$toast({
            message: "接收机名称长度不超过15!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!this.$global.nameCheckType4(name)) {//未匹配中文长度(中文按一个字符处理)
          this.$toast({
            message: "请按要求输入接收机名称!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        //接收机sn校验
        var sub = sn.substr(-4);
        if(sub == "2999"){//实体接收机(包括4000)只支持添加实体接收机(!=2999)
          this.$toast({
            message: "该序列号不支持添加!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        if (!this.$global.isValidRcvSn(sn)) {
          this.$toast({
            message: "请输入10位数字序列号!",
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
        this.ipConfigShow = false;
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
      },
      //检查输入框是否合法
      checkInput(type,boardIdArr) {
        var that = this;
        var res = true;
        var errStr = '输入不合法！';
        var id = '';
        if(type == 'dec'){//解码卡参数
          //板卡
          for (var i = 0; i < boardIdArr.length; i++) {
            var boardId = boardIdArr[i] - 1;
            //TCP
            var tcp = this.ipSetting["TcpPort"+boardId];
            if (!that.isValidBoardPort(tcp)) {
              res = false;
              //id = '#TcpPort' + boardId;
              break;
            }
            //TCP端口查重
            for (var k = 0; k < boardIdArr.length; k++) {
              if (i == k) {
                continue;
              }
              var index = boardIdArr[k] - 1;
              if (tcp == this.ipSetting["TcpPort"+index]) {
                res = false;
                //id = '#TcpPort' + boardId;
                errStr = (boardId+1)+' 与 板卡' + (index + 1) + ' 的TCP端口冲突！';
                break;
              }
            }
            //UDP
            var udpStart = this.ipSetting["UdpPortStart"+boardId];
            var udpStop = this.ipSetting["UdpPortStop"+boardId];
            if (!this.isValidBoardPort(udpStart)) {
              res = false;
              //id = '#UdpPortStart' + boardId;
              break;
            }
            if (!this.isValidBoardPort(udpStop)) {
              res = false;
              //id = '#UdpPortStop' + boardId;
              break;
            }
            //UDP起止范围大于0，不超过10
            if ((+udpStop) - (+udpStart) >= 10) {
              res = false;
              //id = '#UdpPortStop' + boardId;
              errStr = "板卡"+(boardId+1)+'端口号相距不超过10！';
              break;
            }
            if ((+udpStop) - (+udpStart) <= 0) {
              res = false;
              //id = '#UdpPortStop' + boardId;
              errStr = "板卡"+(boardId+1)+'起始端口号不能超过终止端口号！';
              break;
            }
            //UDP端口查重
            for (var m = 0; m < boardIdArr.length; m++) {
              if (i == m) {
                continue;
              }
              var indexM = boardIdArr[m] - 1;
              var otherStart = this.ipSetting["UdpPortStart"+indexM];
              var otherStop = this.ipSetting["UdpPortStop"+indexM];
              if (udpStart >= otherStart && udpStart <= otherStop) {
                res = false;
                //id = '#UdpPortStart' + boardId;
                errStr = "板卡"+(boardId+1)+' 与 板卡' + (indexM + 1) + ' 的UDP端口范围冲突！';
                break;
              }
              if (udpStop >= otherStart && udpStop <= otherStop) {
                res = false;
                //id = '#UdpPortStop' + boardId;
                errStr = "板卡"+(boardId+1)+' 与 板卡' + (indexM + 1) + ' 的UDP端口范围冲突！';
                break;
              }
            }
            if (!res) {
              break;
            }
          }
        }else if(type == 'enc'){//编码卡参数
          //SRT
          var srt = this.ipSetting["encSrtPort"];
          if (!this.isValidBoardPort(srt)) {
            res = false;
            //id = '#encSrtPort';
          }
          //TCP
          var tcp = this.ipSetting["encTcpPort"];
          if (!this.isValidBoardPort(tcp)) {
            res = false;
            //id = '#encTcpPort';
          }
          //UDP
          var udpStart = this.ipSetting["EncUdpPortStart"];
          var udpStop = this.ipSetting["EncUdpPortStop"];
          if (!this.isValidBoardPort(udpStart)) {
            res = false;
            //id = '#EncUdpPortStart';
          }
          if (!this.isValidBoardPort(udpStop)) {
            res = false;
            //id = '#EncUdpPortStop';
          }
          //UDP起止范围大于0，不超过10
          if ((+udpStop) - (+udpStart) >= 10) {
            res = false;
            //id = '#EncUdpPortStop';
            errStr = '编码卡UDP端口号相距不超过10！';
          }
          if ((+udpStop) - (+udpStart) <= 0) {
            res = false;
            //id = '#EncUdpPortStop';
            errStr = '编码卡UDP起始端口号不能超过终止端口号！';
          }
        }
        if (!res) {
          this.$toast({
            message: errStr,
            position: 'middle',
            duration: 5000
          });
        }
        return res;
      },
      // 判断是否是有效端口  在1024到65535之间
      isValidBoardPort(port){
        if(+port < 1024){
          return false;
        }
        var re =  /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
        return re.test(port);
      },
    },
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
  .linkTitle{
    color:#5AB1A7;
  }
  .leftvl{
    text-align:left !important;
  }
  .leftvl input{
    width:30% !important;
  }
</style>