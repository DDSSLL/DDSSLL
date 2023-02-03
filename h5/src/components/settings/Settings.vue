<template>
  <div class="settings mainPage">
    <Device page='dev'></Device>
    <div class="Group" v-if="dev1080Show">
      <div class="GroupItem" style="padding: .1rem;border-bottom:0;text-indent:.1rem">
        <div class="GroupItemField">
          <div class="GroupItemTitle">背包模式</div>
          <div class="GroupItemValue">
            <span style="font-size: .14rem;vertical-align: baseline;line-height: .3rem;color:#fff;">{{options.WorkMode}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="Group"><!-- 传输控制 -->
      <div class="GroupTitle" @click="transConfigShow=!transConfigShow">
        传输控制
        <i class="titleIcon fa" :class="[transConfigShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        <span style="float:right">
          序列号:
          <span>{{ options.curDevSn }}</span>
        </span>
      </div>
      <transition name="slide-fade">
        <div v-show="transConfigShow">
          <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 传输IP -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">传输IP</div>
              <div class="GroupItemValue">
                <mt-radio
                  title=""
                  v-model="options.dev_push_ip"
                  :options="RADIO_TRANS_IP"
                  @change="$global.setDeviceParam('dev_push_ip',options.dev_push_ip=='1'?'1':'')">
                </mt-radio>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="options.WorkMode != '拉流'"><!-- 录制开关、拉流模式录制不能使用 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">录制开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.record" @change="changeRecord" :disabled="dis.record">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="dev1080Show && options.WorkMode != '拉流'"><!-- 录制存储 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">录制存储</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.StorageDev" @change="$global.setDeviceParam('StorageDev', options.StorageDev)" :disabled="dis.StorageDev">
                  <template v-for="item in OPTIONS_STORAGE_DEV_1080">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 重传开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">重传开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.ResendMode" @change="$global.setDeviceParam('ResendMode',options.ResendMode?'1':'0')" :disabled="dis.ResendMode">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="this.user.id==this.SUPER"><!-- 纠错开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">纠错开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.OpenfecMode" @change="changeOpenfecMode" :disabled="dis.OpenfecMode">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="show.OpenfecLevel"><!-- 纠错能力 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">纠错能力</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.OpenfecLevel" @change="$global.setDeviceParam('OpenfecLevel', options.OpenfecLevel)"  :disabled="dis.OpenfecLevel">
                  <template v-for="item in OPTIONS_FEC_LEVEL">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- ETH0 IP -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">ETH0 IP</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options['Eth0Type']" @change="changeEth0"  :disabled="dis.Eth0Type">
                  <template v-for="item in OPTIONS_ETH0_TYPE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- WiFi/热点 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">WiFi/热点</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.WiFiSwitch" @change="$global.setDeviceParam('WiFiSwitch', options['WiFiSwitch']?1:0)" :disabled="dis.WiFiSwitch">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 显示别名 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">显示别名</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.DevAliasSwitch" @change="$global.setDeviceParam('DevAliasSwitch',options.DevAliasSwitch?'1':'0')" :disabled="dis.DevAliasSwitch">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 别名 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">别名</div>
              <div class="GroupItemValue">
                <input class="ItemInput" v-model="options.DevAlias" type="text" @change="changeAliasName" pattern="^[A-z0-9\u4e00-\u9fa5+-@()（） ]{1,10}$" :disabled="dis.DevAlias">
              </div>
            </div>
          </div>    
        </div>  
      </transition>
    </div>
    <div class="Group"><!-- 输入编码 -->
      <div class="GroupTitle" @click="inputEncodeShow=!inputEncodeShow">
        输入编码
        <i class="titleIcon fa" :class="[inputEncodeShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="inputEncodeShow">
          <div v-if="dev1080Show">
            <div class="GroupItem"><!-- SEI -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">SEI</div>
                <div class="GroupItemValue">
                  <mt-switch v-model="options.SEI" @change="$global.setDeviceParam('SEI',options.SEI?'1':'0')" :disabled="dis.SEI">
                  </mt-switch>
                </div>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="show.vAutoOption"><!-- 输入自动 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">输入自动</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.vAutoOption" @change="changeVideoAuto" :disabled="dis.video_auto">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 视频输入 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">视频输入</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.video_input" @change="changeVideoInput"  :disabled="dis.video_input">
                  <template v-for="item in OPTIONS_VIDEOINPUT">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 音频输入 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音频输入</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.audio_input" @change="changeAudioInput"  :disabled="dis.audio_input">
                  <template v-for="item in OPTIONS_AUDIOINPUT">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 视频编码 只有H.264-->
            <div class="GroupItemField">
              <div class="GroupItemTitle">视频编码</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.video_encode" @change="changeVideoEncode" :disabled="dis.video_encode">
                  <template v-for="item in OPTIONS_VIDEOENCODE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="audioEncShow"><!-- 音频编码 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音频编码</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.AudioEnc" @change="$global.setDeviceParam('AudioEnc',options.AudioEnc)" :disabled="dis.AudioEnc">
                  <template v-for="item in OPTIONS_AUDIO_ENCODE">
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
                <select class="ItemSelect" v-model="options.AudioBitrate" @change="$global.setDeviceParam('AudioBitrate',options.AudioBitrate)" :disabled="dis.AudioBitrate">
                  <template v-for="item in OPTIONS_AUDIO_BR">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 码率控制 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">码率控制</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.bitrate_mode" @change="changeBitrateMode" :disabled="dis.bitrate_mode">
                  <template v-for="item in OPTIONS_BITRATEMODE">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div v-if="dev4000Show">
            <div class="GroupItem" v-if="hdrShow"><!-- HDR设置 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">HDR设置</div>
                <div class="GroupItemValue">
                  <select class="ItemSelect" v-model="options.hdr" @change="changeDevParam('hdr')" :disabled="dis.hdr">
                    <template v-for="item in OPTIONS_HDR">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div class="GroupItem" v-show="latencyShow"><!-- 时延模式 -->
              <div class="GroupItemField">
                <div class="GroupItemTitle">时延模式</div>
                <div class="GroupItemValue">
                  <select class="ItemSelect" v-model="options.latency" @change="changeLatency" :disabled="dis.latency">
                    <template v-for="item in OPTIONS_LATENCY">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 编码分辨率 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">编码分辨率</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.HdmiTransFormat" @change="changeHdmiTransFormat" :disabled="dis.HdmiTransFormat">
                  <template v-for="item in OPTIONS_HDMI_FORMAT">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-show="hdmiOutPushShow"><!-- 音视频输出 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音视频输出</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.PushHdmiOut" @change="changePushHdmiOut" :disabled="dis.PushHdmiOut">
                  <template v-for="item in OPTIONS_HDMI_OUT_PUSH">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-show="hdmiOutActShow"><!-- 音视频输出 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">音视频输出</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.ActHdmiOut" @change="" :disabled="dis.ActHdmiOut">
                  <template v-for="item in OPTIONS_HDMI_OUT_ACT">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group matchConfig"><!-- 配对设置 -->
      <div class="GroupTitle" @click="matchConfigShow=!matchConfigShow">
        配对设置
        <i class="titleIcon fa" :class="[matchConfigShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="matchConfigShow">
          <div class="GroupItem"><!-- 背包 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">背包</div>
              <div class="GroupItemValue">
                <input type="text" class="" v-model="ActiveDevice.dev_name+'_'+ActiveDevice.dev_sn" style="width: 100%;border: none;background: transparent;margin-top: 0.06rem;text-indent:0" readonly>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 类型 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">类型</div>
              <div class="GroupItemValue">
                <mt-radio
                  title=""
                  v-model="options.rcvType"
                  :options="$global.OPTIONS_RCV_TYPE"
                  @change="changeRcvType">
                </mt-radio>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 虚拟服务器/实体接收机 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">{{options.serveName}}</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.matchRcv" @change="changeMatchRcv">
                  <template v-for="item in options.RcvList">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="boardShow"><!-- 板卡 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">板卡</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.matchBoard" @change="">
                  <template v-for="item in options.boardList">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="user.userGroup != NORMAL"><!-- 按钮 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle"></div>
              <div class="GroupItemValue" style="float:right">
                <mt-button class="ItemBtn" type="primary" @click="saveMatch">绑定</mt-button>
                <mt-button class="ItemBtn" style="margin-left:10px;" @click="unbindMatch" v-if="unbindBtnShow">解绑</mt-button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group" v-if="show.act4000"><!-- 4000的互动 -->
      <div class="GroupTitle" @click="show.act4000Show=!show.act4000Show">
        互动
        <i class="titleIcon fa" :class="[show.act4000Show == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="show.act4000Show">
          <div class="GroupItem" v-show="false"><!-- 互动模式 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">互动模式</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.InteractiveMode" @change="changeInteractiveMode" :disabled="!pageLock?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 互动开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">互动开关</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.SrtSwitch" @change="changeSrtSwitch" :disabled="dis.SrtSwitch">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 切换 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">切换</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.SrtAudioIdx" @change="changeSrtAudioIdx" :disabled="dis.SrtAudioIdx">
                  <template v-for="item in OPTIONS_SRT_AUDIO_SWITCH_4000">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 全屏 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">全屏</div>
              <div class="GroupItemValue">
                <mt-switch v-model="options.SrtFullSwitch" @change="changeSrtFullSwitch" :disabled="dis.SrtFullSwitch">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 传输通道 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">传输通道</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.SrtTransIf" @change="$global.setDeviceParam('SrtTransIf',options.SrtTransIf)"  :disabled="dis.SrtTransIf"  @click="getSrtTransPortList">
                  <template v-for="item in OPTIONS_SRT_TRANSPORT_PARAMS">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem"><!-- 耳机音频选择 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">耳机音频选择</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.AudioMode" @change="changeAudioMode" :disabled="dis.AudioMode">
                  <template v-for="item in OPTIONS_ACT_AUDIOOUT_1080">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group" v-if="dev4000Show"><!-- 4000推流地址 -->
      <div class="GroupTitle" @click="liveUrlShow=!liveUrlShow">
        推流地址
        <i class="titleIcon fa" :class="[liveUrlShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="liveUrlShow">
          <div class="addressGroup" style="padding:0">
            <PushUrl  v-bind:lockState="pageLock" v-bind:workMode="workMode"></PushUrl><!-- @childFn="parentFn" -->
          </div>      
        </div>
      </transition>
    </div>
    <div class="Group" v-if="dev1080Show"><!-- 1080 -->
      <div v-if="options.WorkMode=='拉流'"><!-- 拉流地址 -->
        <div class="GroupTitle" @click="pullUrlShow=!pullUrlShow">
          拉流地址
          <i class="titleIcon fa" :class="[pullUrlShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        </div>
        <transition name="slide-fade">
          <div v-show="pullUrlShow">
            <div class="addressGroup" style="padding:0">
              <PullUrl v-bind:lockState="pageLock" :workMode="'拉流'" v-bind:transMode="PushTsType"></PullUrl>
            </div>      
          </div>
        </transition>
      </div>
      <div v-else-if="options.WorkMode=='推流'"><!-- 推流地址-->
        <div class="GroupTitle" @click="pushUrlShow=!pushUrlShow">
          推流地址
          <i class="titleIcon fa" :class="[pushUrlShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
        </div>
        <transition name="slide-fade">
          <div v-show="pushUrlShow">
            <div class="addressGroup" style="padding:0">
              <PushUrl v-bind:lockState="pageLock" :workMode="'推流'" v-bind:transMode="PushTsType"></PushUrl>
            </div>      
          </div>
        </transition>
      </div>
    </div>
    <div class="Group"  v-if="this.user.id==this.SUPER"><!-- 日志记录 -->
      <div class="GroupTitle"  @click="logShow=!logShow">
        日志记录
        <i class="titleIcon fa" :class="[logShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="logShow">
          <div class="GroupItem"><!-- 日志记录 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">日志记录</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.ArmSenderLogLevel" @change="$global.setDeviceParam('ArmSenderLogLevel',options.ArmSenderLogLevel)"  :disabled="!pageLock?false:true">
                  <template v-for="item in OPTIONS_LOG_LEVEL">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="Group" v-if="dev4000Show&&devFileShow"><!-- 文件 -->
      <div class="GroupTitle" @click="clickFileBtn">
        {{options.fileTitle}}
        <i class="titleIcon fa" :class="[fileShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <transition name="slide-fade">
        <div v-show="fileShow">
          <div class="GroupItem"><!-- 回传开关 -->
            <div class="GroupItemField">
              <div class="GroupItemTitle">回传</div>
              <div class="GroupItemValue" style="width:auto" v-if="show.offLinePush">
                <mt-switch v-model="options.OffLinePushEnable" @change="changeBackEnable" :disabled="!pageLock?false:true">
                </mt-switch>
              </div>
            </div>
          </div>
          <div class="GroupItem">
            <div class="GroupItemField">
              <div class="GroupItemTitle">回传方式</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.back" @change="changeBackSel"  :disabled="!pageLock?false:true">
                  <template v-for="item in OPTIONS_BACK">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem" v-if="show.recordIp">
            <div class="GroupItemField">
              <div class="GroupItemTitle">选择录机</div>
              <div class="GroupItemValue">
                <select class="ItemSelect" v-model="options.recordIp" @change="changeBackSel"  :disabled="!pageLock?false:true">
                  <template v-for="item in OPTIONS_RECORD_IP">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="GroupItem">
            <div class="GroupItemField">
              <div class="GroupItemTitle">文件列表</div>
              <i class="titleIcon addBtn fa fa-refresh" @click.stop="clickFileRefreshIcon" style="float:right" v-if="show.refreshFileList"></i>
              <!-- <div class="GroupItemValue" @click="changeFileShow">
                <i class="titleIcon fa chevronStyle fa-chevron-right" style="height:.3rem; line-height:.3rem"></i>
              </div> -->
            </div>
            <div class="GroupItemField">
              <mt-radio
                title=""
                v-model="options.filePos"
                :options="OPTIONS_FILE_POS"
                @change="changeFilePos">
              </mt-radio>
            </div>
            <div class="GroupItemField" style="color:#fff">
              <template v-for="(item,i) in fileList">
                <div class="cellItem" style="font-size:.16rem;padding:5px 0px;">
                  <input :name="item.fileName" type="checkbox" :disabled="item.FileTotalStatus == 1?true:false" v-model="item.fileSel == '1'?true:false" />
                  <span class="cellName cellLabel">{{item.fileName}}</span>
                  <span class="cellName cellLabel" style="float: right;">{{item.fileSize+"  "+(item.fileSel=='1'?item.fileProgress+"%":"")}}</span>
                </div>
              </template>
            </div>
          </div>
          <div class="GroupItem">
            <div class="GroupItemField">
              <div class="GroupItemTitle">录制中的文件</div>
              <!-- <div class="GroupItemValue" @click="changeRecordingFileShow">
                <i class="titleIcon fa chevronStyle fa-chevron-right" style="height:.3rem; line-height:.3rem"></i>
              </div> -->
            </div>
            <div class="GroupItemField" style="color:#fff">
              <template v-for="(item,i) in recordFileList">
                <div class="cellItem" style="font-size:.16rem;padding:5px 0px;">
                  <span class="cellName cellLabel">{{item.RecordName}}</span>
                  <span class="cellName cellLabel" style="float: right;">{{item.RecordSize}}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- <mt-popup v-model="show.fileListPop" position="right" popup-transition="popup-slide" class="wholePagePop">
      <div class="GroupItem" style="height:100%">
        <div class="popTitle">
          <div class="back">
            <div @click="show.fileListPop=false" class="popTitleBack">
              <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
              <span style="color:#fff">文件列表</span>
            </div>            
            <i class="titleIcon addBtn fa fa-refresh" @click.stop="clickFileRefreshIcon" style="float:right" v-if="show.refreshFileList"></i>
          </div>
        </div>
        <div class="popContentStyle">
          <template v-for="(item,i) in fileList">
            <div class="cellItem" style="font-size:.16rem;padding:5px 0px;">
              <input :name="item.fileName" type="checkbox" value="" :disabled="item.FileTotalStatus == 1?true:false" :checked="item.fileSel == '1'?true:false" />
              <span class="cellName cellLabel">{{item.fileName}}</span>
              <span class="cellName cellLabel" style="float: right;">{{item.fileSize+"/"+item.fileProgress+"%"}}</span>
            </div>
          </template>
        </div>
      </div>
    </mt-popup> -->
    <!-- <mt-popup v-model="show.recordingFileListPop" position="right" popup-transition="popup-slide" class="wholePagePop">
      <div class="GroupItem" style="height:100%">
        <div class="popTitle">
          <div class="back">
            <div @click="hideRecordFilePop" class="popTitleBack">
              <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
              <span style="color:#fff">录制中的文件</span>
            </div>            
          </div>
        </div>
        <div class="popContentStyle">
          <template v-for="(item,i) in recordFileList">
            <div class="cellItem" style="font-size:.16rem;padding:5px 0px;">
              <span class="cellName cellLabel">{{item.RecordName}}</span>
              <span class="cellName cellLabel" style="float: right;">{{item.RecordSize}}</span>
            </div>
          </template>
        </div>
      </div>
    </mt-popup> -->
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_USER,SET_NAV_STATUS } from '../../store/mutation-types';
  import PushUrl from '../basic/PushUrl';
  import PullUrl from '../basic/PushUrl';
  import Device from '../basic/Device';
  import $ from 'jquery';
  export default {
    name: "Settings",
    data(){
      return{
        ADMIN:ADMIN,
        NORMAL:NORMAL,
        VIR_RCV:VIR_RCV,
        workMode:"推流",
        //pullWorkMode:"拉流",
        WorkMode:"",
        PushTsType:"",
        curDevSeries:"",
        curRcvSeries:"",
        dev1080Show:false,
        dev4000Show:false,
        devFileShow:false,
        transConfigShow:true,
        inputEncodeShow:false,
        matchConfigShow:false,
        liveUrlShow:false,
        pullUrlShow:false,//拉流地址
        pushUrlShow:false,//拉流地址
        fileShow:false,
        showAddUrl:false,
        logShow:false,
        pageLock:false,
        URL_MAX:5,
        getPushUrl:"",
        SUPER : SUPER,
        RADIO_TRANS_IP : [],
        audioEncShow:true,
        hdrShow : true,
        latencyShow : true,
        feclevel_show : false,
        show_5g:false,
        hdmiOutPushShow:false,
        hdmiOutActShow:false,
        OPTIONS_VIDEOINPUT:[],//视频输入
        OPTIONS_AUDIOINPUT:[],//音频输入
        OPTIONS_VIDEOENCODE:[],//视频编码
        OPTIONS_AUDIO_ENCODE:[],//音频编码
        OPTIONS_AUDIO_ENCODE_ORI:[],//音频编码
        OPTIONS_BITRATEMODE:[],//码率控制
        OPTIONS_AUDIO_BR:[],//音频比特率
        OPTIONS_HDR:[],//HDR设置
        //OPTIONS_HDR_ORI:[],//HDR设置
        OPTIONS_LATENCY:[],//时延模式
        OPTIONS_HDMI_FORMAT:[],//编码分辨率
        OPTIONS_HDMI_OUT_PUSH:[],
        OPTIONS_HDMI_OUT_ACT:[],
        OPTIONS_FEC_LEVEL : [{text: "低",value: "0"}, 
                              {text: "中",value: "1"}, 
                              {text: "高",value: "2"}],
        OPTIONS_LOG_LEVEL : [{text: "OFF",value: "0"}, 
                            {text: "ERROR",value: "1"}, 
                            {text: "INFO",value: "2"},
                            {text: "DEBUG",value: "3"}],
        OPTIONS_NETMODE_PARAMS : [{text: "NSA",value: "0"}, 
                                  {text: "SA",value: "1"}, 
                                  {text: "LTE ONLY",value: "2"}],
        OPTIONS_STORAGE_DEV_1080 : [{text: "本地",value: "0"}, 
                                    {text: "SD",value: "1"}],
        OPTIONS_ETH0_TYPE : [{text: "固定IP地址", value: "0"}, 
                            {text: "自动获取IP地址", value: "1"}],
        OPTIONS_BACK : [{text: "实时流", value: "1"}, 
                            {text: "FTP", value: "2"}],
        //4000互动  切换
        OPTIONS_SRT_AUDIO_SWITCH_4000: [],
        /*OPTIONS_SRT_AUDIO_MODE_SWITCH_4000: [{text: "跟随",value: "0"}, 
                                            {text: "混音",value: "1"}],*/
        OPTIONS_ACT_AUDIOOUT_1080: [],
        OPTIONS_SRT_TRANSPORT_PARAMS:[],//传输通道
        OPTIONS_FILE_POS:[{label: "本地", value: "0"}, 
                          {label: "USB", value: "1"}],
        options_old_264:{
          audio_input : "",
          AudioEnc : "",
          AudioBitrate : "",
          bitrate_mode : "",
          hdr : "",
          HdmiTransFormat : "",
          latency:"",
        },
        options_old_265:{
          audio_input : "",
          AudioEnc : "",
          AudioBitrate : "",
          bitrate_mode : "",
          hdr : "",
          HdmiTransFormat : "",
          latency:"",
        },
        options:{
          workModeVal:"",
          WorkMode:"",//传输模式
          dev_push_enable:"",//推流开关
          curDevSn:"",//序列号
          dev_push_ip:'0',//传输IP
          //PushTsType:'0',//传输模式
          //PushCard : "",//单卡选择
          record:false,//录制开关
          StorageDev:0,//录制存储
          ResendMode:false,//重传开关
          OpenfecMode:false,//纠错开关
          OpenfecLevel:0,//纠错能力
          Mode5G:"",//5G模式
          Eth0Type:"",//ETH0 IP
          WiFiSwitch:"",//WIFI热点
          SSHSwitch:"",//SSH反向
          DevAliasSwitch:"",//显示别名
          DevAlias:"",//别名
          SEI:false,//SEI
          video_input:'0',//视频输入
          video_input_old:"",
          audio_input:'1',//音频输入
          video_encode:'0',//视频编码
          video_encode_old:"",
          AudioEnc:'0',//音频编码
          AudioBitrate:'256',//音频比特率
          bitrate_mode:'0',//码率控制
          bitrate_mode_old:"",
          hdr:'',//HDR设置
          latency:'',//时延
          latency_old:"",
          HdmiTransFormat:'1',//编码分辨率
          pushHDMIFormat:"",
          ArmSenderLogLevel:'0',//日志记录
          PushTsType:"",//传输模式
          PushHdmiOut:"",
          ActHdmiOut:"",
          //配对设置
          devNameSn:"",
          RcvList:[],
          matchRcv:"",
          matchRcvBak:"",
          boardList:[],
          matchBoard:"",
          matchBoardBak:"",
          rcvType:"0",
          rcv_board_param:"",
          address:"",
          //文件
          fileTitle:"文件",
          OffLinePushEnable:false,
          back:"",
          online:"",
          dev_push_status:"",
          devFileUpFlag:0,
          filePos:0,
          //4000互动

          InteractiveMode:"",//互动模式
          SrtSwitch:"",//互动开关
          SrtAudioIdx:"",//切换
          SrtFullSwitch:"",//全屏
          SrtTransIf:"",//传输通道
          AudioMode:"",//音频模式
          vAuto:false,//输入自动
        },
        show:{
          OpenfecLevel:false,//纠错能力
          //4000互动
          act4000:false,
          act4000Show:false,
          //文件
          recordIp:false,//选择录机
          fileListPop:false,//文件列表pop
          recordingFileListPop:false,//录制中的文件Pop
          refreshFileList:false,//刷新图标
          offLinePush:true,//离线回传
          vAutoOption:false,//输入自动
        },
        dis:{
          SEI:false,//SEI
          video_input:false,//视频输入
          video_auto:false,//输入自动
          audio_input:false,//音频输入
          video_encode:false,//视频编码
          AudioEnc:false,//音频编码
          AudioBitrate:false,//音频比特率
          bitrate_mode:false,//码率控制
          hdr:false,//HDR设置
          latency:false,//时延模式
          HdmiTransFormat:false,//编码分辨率
          record:false,//录制开关
          StorageDev:false,//录制存储
          ResendMode:false,//重传开关
          OpenfecMode:false,//纠错开关
          OpenfecLevel:false,//纠错能力
          Eth0Type:false,//ETH0 IP
          WiFiSwitch:false,//WiFi/热点
          DevAliasSwitch:false,//显示别名
          DevAlias:false,//别名
          SrtSwitch:false,//互动开关
          SrtAudioIdx:false,//切换
          SrtFullSwitch:false,//全屏
          SrtTransIf:false,//传输通道
          AudioMode:false,//耳机音频选择
        },
        fileList:[],//文件列表
        recordFileList:[],//录制中的文件
        boardShow:false,//板卡显示
        unbindBtnShow:false,
        bUpdateParam:"",
      }
    },
    components: {
        Device,PushUrl,PullUrl
    },
    computed: {
        ...mapState(['user','navHide','paramLockAck','lockUserId','ActiveDevice'])//"ActiveDeviceType",
    },
    watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/settings"){
            this.ActiveDevice = val;
            this.updateDevFileAll();
            this.getLockStates();
          }
        }
      },
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/settings"){
            var that = this;
            this.options.devFileUpFlag = 0;//文件列表
            //1080-4000显示初始化
            this.selectShow();//判断设备类型显示不同内容1080 or 4000
            //this.getSelectOptions();
            this.$global.getDeviceParam(that.formatData);
            this.initDevMatch();//背包配对的接收机
            //this.showDevSrt(this.ActiveDevice.dev_sn); //根据配对接收机判断是否显示互动功能(4000的互动)
            this.$global.getRcvList(that.formatRcvListData);
            if(this.fileShow){
              this.changeFileShow();
              this.changeRecordingFileShow();
            }
          }
        }
      },
      '$store.state.ActiveDevice.rcv_sn': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/settings"){
            var that=this;
            this.$global.getRcvList(that.formatRcvListData);
            this.showDevSrt();
            this.curRcvSeries = this.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
          }
        }
      },
      '$store.state.ActiveDevice.rcv_online': {
        immediate: true,
        handler(val) {
          if(this.$route.fullPath == "/settings"){
            var that=this;
            this.$global.getRcvList(that.formatRcvListData);
          }
        }
      },
      '$store.state.paramLockAck':{
        immediate: true,
        handler(val) {
          this.getLockStates();
        }
      }
    },
    activated(){  //生命周期-缓存页面激活
      var that = this;
      this.curRcvSeries = this.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
      this.getLockStates();
      //1080-4000显示初始化
      this.selectShow();//判断设备类型显示不同内容1080 or 4000
      //this.getSelectOptions();
      this.$global.getDeviceParam(that.formatData);
      this.initDevMatch();//背包配对的接收机
      this.showDevSrt(this.ActiveDevice.dev_sn); //根据配对接收机判断是否显示互动功能(4000的互动)
      this.$global.getRcvList(that.formatRcvListData);
      this.options.curDevSn = this.ActiveDevice.dev_sn;
      localStorage.getSettingParam1080 = setInterval(function(){
        if(that.pageLock){//加锁
          that.$global.getDeviceParam(that.formatData)
        }
      },1000)
      //录机
      this.getRecordIpList();
      //获取列表
      setTimeout(function() {
        //that.updateRecordFileList();
        that.getDevFileParam();
      }, 500);
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getSettingParam1080);
      clearInterval(this.getPushUrl);
    },
    methods:{
      ...mapMutations({
        SET_USER,
        SET_NAV_STATUS
      }),
      clickFileBtn(){
        this.fileShow=!this.fileShow;
        if(this.fileShow){
          this.changeFileShow();
          this.changeRecordingFileShow();
        }
      },
      changeLatency(){
        var that = this;
        this.changeDevParam('latency');
        if(this.curDevSeries == "4000"){
          if(this.options.latency == 1){//超低时延，无AVBR
            this.OPTIONS_BITRATEMODE = this.$global.OPTIONS_BITRATEMODE2;
            this.options.bitrate_mode = 0;
            this.$global.setDeviceParam('bitrate_mode',0)
          }else{//4000选标准时延时，码率控制为CBR,AVBR
            this.OPTIONS_BITRATEMODE = this.$global.OPTIONS_BITRATEMODE;
            /*var options = this.$global.getDevParamRange(that.ActiveDevice.dev_sn, that.user.prefix, 'bitrate_mode');
            this.OPTIONS_BITRATEMODE = options;*/
          }  
        }
      },
      //HDMI编码分辨率
      changeHdmiTransFormat(){
        var that = this;
        //264编码，推流中不让改
        var pushStatus = this.options.dev_push_enable;
        var selText = this.OPTIONS_VIDEOENCODE.filter(item => {
          if(item.value == that.options.video_encode){
            return item;
          }
        }).map(item => {
          return item.text;
        })
        var videoEncode = selText;
        if(pushStatus == 1 && videoEncode == 'H.264'){
          that.$toast({
            message: '推流中,H.264编码下，不支持修改',
            position: 'middle',
            duration: 2000
          });
          that.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'HdmiTransFormat', function(data) {
              that.options.HdmiTransFormat = data.HdmiTransFormat;
            }
          )
        } else {
          that.$global.setDeviceParam('HdmiTransFormat',that.options.HdmiTransFormat)
          if(that.options.workModeVal != 2){
            that.options.pushHDMIFormat = that.options.HdmiTransFormat;
          }
        }
      },
      //推流-HDMI输出
      changePushHdmiOut(){
        //推流中不能改
        var pushStatus = this.options.dev_push_enable;
        if(pushStatus == 1 ){
          this.$toast({
            message: '推流中，不支持修改',
            position: 'middle',
            duration: 2000
          });
          this.$global.getDevOneParam(this.ActiveDevice.dev_sn, 'PushMHdmiOut',function(data){
            this.options.PushHdmiOut = data.PushMHdmiOut;
          });
        }else{
          var HDMIOut = this.options.PushHdmiOut;
          this.$global.setDeviceParam('PushMHdmiOut',HDMIOut);
        }
      },
      latencyChange(DV4000RV){
        //时延模式
        var that = this;
        var options = [];
        options = this.$global.getDevParamRange(that.ActiveDevice.dev_sn, that.ActiveDevice.rcv_sn, 'latency', DV4000RV);//4000T和虚拟接收机配对时无超低时延
        that.OPTIONS_LATENCY = options;
        if(DV4000RV){//4000T切换配对时，从实体配对的超低时延(1)切换到虚拟接收机时，只有标准时延，背包参数latency要从1(超低时延)变更为0(标准时延)、1080T默认为0标准时延
          that.$global.setDeviceParam('latency', 0);
        }
      },
      clickEth0(){
        if (this.options.dev_push_enable == '1') {//推流
          this.$toast({
            message: '请先停止推流再进行ETH0 IP切换!',
            position: 'middle',
            duration: 2000
          });
        }
      },
      changeEth0(){
        var that = this;
        /*this.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'dev_push_enable', function(data){
          
        });*/
        if (this.options.dev_push_enable == '1') {//推流
          that.$toast({
            message: '请先停止推流再进行ETH0 IP切换!',
            position: 'middle',
            duration: 2000
          });
          that.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'Eth0Type', function(data) {
            that.options.Eth0Type = data.Eth0Type;
          })
          return;
        }else{
          that.$global.setDeviceParam('Eth0Type', that.options['Eth0Type'])
        }
      },
      changeMatchRcv(){
        var that = this;
        var rcvSn = that.options.matchRcv;
        var rcvType = that.$global.getRcvSeries(rcvSn);
        if (rcvType == PRA_RCV || rcvType === R1080_RCV) {
          that.$global.getUnusedBoard(rcvSn, "", that.formatUnusedBoard);
        }
      },
      changeRcvType(){
        var that = this;
        if(this.options.rcvType == 0){
          this.showRcvOrVirRcv(0);
        }else{
          this.showRcvOrVirRcv(1);
        }
        this.$global.getRcvList(that.formatRcvListData);
      },
      formatRcvListData(data){
        var that = this;
        //判断是否有当前配对的接收机的权限
        var bFind = false;
        var result = [];
        var curRcvSn = that.ActiveDevice.rcv_sn;
        var curRcvName = that.ActiveDevice.rcv_name;
        if (data.length == 0) {
          that.options.RcvList = [{value: curRcvSn,text:curRcvName}];
          that.options.matchRcv = curRcvSn;
        } else {
          for (var k = 0; k < data.length; k++) {
            if (data[k].rcv_sn == curRcvSn) {
              bFind = true;
              break;
            }
          }
          if (!bFind && 
            ((that.$global.getRcvSeries(curRcvSn) == VIR_RCV && that.options.rcvType == "0")
           || (that.$global.getRcvSeries(curRcvSn) == PRA_RCV && that.options.rcvType == "1"))) {
            result.push({
              value: curRcvSn?curRcvSn:"",
              text: curRcvName?curRcvName:""
            });
          }
          $.each(data, function(key, value) {
            var rcvType = that.$global.getRcvSeries(value.rcv_sn);
            //虚拟还是实体接收机
            if(that.options.rcvType == '0' && rcvType == VIR_RCV){
              //虚拟接收机
              result.push({
                value: value.rcv_sn,
                text: (value.color == "#2de505" ? "在线: ":"离线: ")+value.rcv_name
              });
            }else if(that.options.rcvType == '1' && (rcvType === PRA_RCV||rcvType === R1080_RCV)){
              //实体接收机
              result.push({
                value: value.rcv_sn,
                text: (value.color == "#2de505" ? "在线: ":"离线: ")+value.rcv_name,
              });
            }
          });
          that.options.RcvList = result;
        }

        //获取当前所选的接收机的板卡
        if(curRcvSn == ""){
          that.options.matchRcv = "";
          that.options.matchBoard = "";
        }else{
          bFind = false;
          for (var i = 0; i < result.length; i++) {
            if (result[i]['value'] == curRcvSn) {
              that.options.matchRcv = result[i]['value'];
              //that.options.matchRcvBak = result[i]['value'];
              //$('#edit_rcv_sel').selectpicker('val', result[i]['value']);
              //$('#edit_rcv_sel').attr("oVal", result[i]['value']);
              that.$global.getUnusedBoard(result[i]['value'],"",that.formatUnusedBoard);
              bFind = true;
              break;
            }
          }
          if (!bFind && result.length != 0) {
            that.$global.getUnusedBoard(result[0]['value'],"",that.formatUnusedBoard);
          }
        }
        if(that.options.matchRcv != ""){
          that.unbindBtnShow = true;
        }else{
          that.unbindBtnShow = false;
        }
      },
      formatUnusedBoard(rcvSn,curBoard,data){
        var that = this;
        var result = [ ];
        var showBoardId = +that.ActiveDevice.board_id*1+1;
        //无可用板卡
        if (data.length == 0) {
          if (that.ActiveDevice.rcv_sn == "") {
            result.push({
              value: -1,
              text: '无可用板卡'
            });
          } else {
            if (rcvSn == that.ActiveDevice.rcv_sn) {
              result.push({
                value: that.ActiveDevice.board_id,
                text: '板卡' + showBoardId
              });
            } else if (that.ActiveDevice.rcv_sn == "" && selectBoardId != "" && selectBoardId != undefined) {
              result.push({
                value: selectBoardId,
                text: '板卡' + selectBoardId
              });
            } else {
              result.push({
                value: -1,
                text: '无可用板卡'
              });
            }
          }
        } else {
          if (rcvSn == that.ActiveDevice.rcv_sn) {
            result.push({
              value: that.ActiveDevice.board_id,
              text: '板卡' + showBoardId
            });
          }
          $.each(data, function(key, value) {
            result.push({
              value: value,
              text: '板卡' + (+value+1)
            });
          });
        }
        that.options.boardList = result;
        that.options.matchBoard = result[0]["value"];
        if (that.ActiveDevice.board_id != "" && that.ActiveDevice.board_id != undefined) {
          for (var i = 0; i < result.length; i++) {
            if (result[i]['value'] == that.ActiveDevice.board_id) {
              that.options.matchBoard = result[i]['value'];
              that.options.matchBoardBak = result[i]['value'];
              break;
            }
          }
        }
      },
      //根据背包配对的接收机序列号来区分汇聚和接收机
      initDevMatch(rcvSn) {
        var that = this;
        var rcvType = this.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
        if(rcvType === VIR_RCV){
          this.options.rcvType = 0;
          this.showRcvOrVirRcv(0);
        }else{
          this.options.rcvType = 1;
          this.showRcvOrVirRcv(1);
        }
      },
      //汇聚和接收机的显示切换
      showRcvOrVirRcv(type){
        type = +type;
        if(type === 0){
          //汇聚
          this.boardShow = false;
          this.options.serveName = "虚拟服务器";
        }
        else{
          //接收机
          this.boardShow = true;
          this.options.serveName = "实体接收机";
        }
      },
      getSelectOptions(formatData){
        var that = this;
        var dev_sn = that.ActiveDevice.dev_sn;
        var userPrefix = that.user.prefix;
        if(this.curDevSeries == "1080"){
          that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_1080;//视频输入
          that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_1080;//音频输入
          that.OPTIONS_VIDEOENCODE = that.$global.OPTIONS_VIDEOENCODE_1080;//视频编码
          that.OPTIONS_AUDIO_ENCODE = that.$global.OPTIONS_AUDIO_ENCODE_1080;//音频编码
          that.OPTIONS_AUDIO_BR = that.$global.OPTIONS_AUDIO_BR;//音频比特率
          that.OPTIONS_BITRATEMODE = that.$global.getDevParamRange(dev_sn, '', 'bitrate_mode',that.options.PushTsType);//码率控制that.$global.OPTIONS_BITRATEMODE;
          that.OPTIONS_HDMI_FORMAT = that.$global.getDevParamRange(dev_sn, '', 'HdmiTransFormat',that.options.workModeVal);;//编码分辨率
          
        }else if(this.curDevSeries == "4000"){
          //视频输入 判断是否是PCIE版本
          that.$global.getDevListOneParam('hardVer',function(data){
            if(data.hardVer != '' && data.hardVer != null){
              var hardVer = parseFloat(data.hardVer.split("-")[0]);
              if(hardVer >= 1.3){//PCIE
                that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_PCIE_4000;
              }else{
                that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_4000;
              }
            }else{
              that.OPTIONS_VIDEOINPUT = that.$global.OPTIONS_VIDEOINPUT_4000;
            }
            if (formatData['InteractiveMode'] == '1') {
              //互动模式不支持HDMI H.264
              var options = that.OPTIONS_VIDEOINPUT;//视频输入
              options = options.filter(function(item){
                return item.value!=4;
              })
              that.OPTIONS_VIDEOINPUT = options;
            }
          })
          that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_4000;//音频输入
          /*that.OPTIONS_VIDEOENCODE = that.$global.OPTIONS_VIDEOENCODE_4000;//视频编码*/
          that.OPTIONS_AUDIO_ENCODE = that.$global.OPTIONS_AUDIO_ENCODE_4000;//音频编码
          that.OPTIONS_AUDIO_ENCODE_ORI = that.$global.getDevParamRange(dev_sn, '', 'audio_encode');
          that.OPTIONS_AUDIO_BR = that.$global.OPTIONS_AUDIO_BR;//音频比特率
          that.OPTIONS_BITRATEMODE = that.$global.getDevParamRange(dev_sn,  '', 'bitrate_mode');//that.$global.OPTIONS_BITRATEMODE;//码率控制
          that.OPTIONS_AUDIO_BR = that.$global.OPTIONS_AUDIO_BR;//音频比特率
          that.OPTIONS_HDR = that.$global.getDevParamRange(dev_sn, '',"hdr");//HDR设置
          //that.OPTIONS_HDR_ORI = that.$global.getDevParamRange(dev_sn,userPrefix,"hdr");//HDR设置
          //that.OPTIONS_LATENCY = that.$global.getDevParamRange(dev_sn,userPrefix,"latency");//时延模式
          that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_4000;//编码分辨率
          that.initLatency();
        }
      },
      //判断设备类型显示不同内容1080 or 4000
      selectShow(){
        var that = this;
        this.curDevSeries = this.$global.getDevSeries(that.ActiveDevice?that.ActiveDevice.dev_sn:"");
        this.curRcvSeries = this.$global.getRcvSeries(that.ActiveDevice?that.ActiveDevice.rcv_sn:"");
        if(this.curDevSeries == "1080"){
          this.dev1080Show = true;
          this.dev4000Show = false;
        }else if(this.curDevSeries == "4000"){
          this.dev1080Show = false;
          this.dev4000Show = true;
          if(this.curRcvSeries == R1080_RCV){//2010R
            this.devFileShow = false;
          }else{
            this.devFileShow = true;
          }
        }else{
          this.dev1080Show = false;
          this.dev4000Show = false;
        }
      },
      changeBitrateMode(){
        if(this.curDevSeries == "4000"){
          this.$global.setDeviceParam('bitrate_mode',this.options.bitrate_mode)
        }else if(this.curDevSeries == "1080"){
          if(this.options.PushTsType == 1){//单卡推流
            //单卡推流不支持AVBR
            if(this.options.bitrate_mode == 1){
              this.options.bitrate_mode = 0;
              this.$toast({
                message: '单卡推流不支持AVBR',
                position: 'middle',
                duration: 2000
              });
              return;
            }else{
              this.$global.setDeviceParam('bitrate_mode',this.options.bitrate_mode)
            }
          }else{
            this.$global.setDeviceParam('bitrate_mode',this.options.bitrate_mode)
          }
        }
      },
      getLockStates(){
        var that = this;
        if(that.paramLockAck == "1"){
          if(that.lockUserId == that.user.id || that.lockUserId == ""){
            that.pageLock = false;
          }else{
            that.pageLock = true;
          }
        }else{
          that.pageLock = true;
        }
        that.RADIO_TRANS_IP = [{
          label: '内网',
          value: '1',
          disabled: this.pageLock?true:false
        },{
          label: '公网',
          value: '0',
          disabled: this.pageLock?true:false
        }]
        this.setElementDisable(that.pageLock);
      },
      setElementDisable(dis){
        if(this.curDevSeries.indexOf('1080') >= 0){
          
        }else if(this.curDevSeries == "4000"){
          //*4000的互动接收机
          this.dis.SrtSwitch = dis;//互动开关
          this.dis.SrtAudioIdx = dis;///切换
          this.dis.SrtFullSwitch = dis;///全屏
          this.dis.SrtTransIf = dis;///传输通道
          this.dis.AudioMode = dis;///耳机音频选择
          //*文件
          /*$('#back_enable').bootstrapSwitch('disabled', disabled);//回传按钮
          setSelectDisabled('#back_sel', disabled);//回传方式  
          $('#updateFileIcon').attr('disabled', disabled);//刷新文件列表按钮*/
        }
        this.dis.record = dis;//录制开关
        if(this.options.record == true){//录制开关打开
          this.dis.StorageDev = true;
        }else{
          this.dis.StorageDev = dis;//录制存储  
        }
        this.dis.ResendMode = dis;//重传开关
        this.dis.OpenfecMode = dis;//纠错开关
        this.dis.OpenfecLevel = dis;//纠错能力
        if(this.options.dev_push_enable == 1){
          this.dis.Eth0Type = true;//ETH0 IP
          this.dis.WiFiSwitch = true;//WiFi/热点 
        }else{
          this.dis.Eth0Type = dis;//ETH0 IP
          this.dis.WiFiSwitch = dis;//WiFi/热点
        }
        this.dis.DevAliasSwitch = dis;//显示别名
        this.dis.DevAlias = dis;//别名

        //视频输入
        //console.log("this.options.workModeVal:"+this.options.workModeVal)
        
        //console.log("this.dis.video_input:"+this.dis.video_input)
        //文件回传中，输入编码下的参数不能编辑
        if (this.options.OffLinePushEnable){
          this.setEncodeParamDisabled(true);
        }/*else if(this.curDevSeries == "1080" && that.options.dev_push_status == '1'){
          //传输中，传输模式和单卡不能编辑
          setTransParamDisabled(true);
          transModeDisabled = true;
        }*/else{
          this.setEncodeParamDisabled(dis);
        }
      },
      //输入编码下的参数按钮置disabled
      setEncodeParamDisabled(disabled){
        var devSN = this.ActiveDevice.dev_sn;
        var sn = devSN.substr(-4);
        var devMode = this.$global.getDevMode(sn);
        if(devMode != 'DV5000T'){//4000,1080不包含5000
          if((this.options.workModeVal == 2 && this.options.dev_push_enable == 1) || this.options.vAutoOption == "1"){
            this.dis.video_input = true;
          }else{
            this.dis.video_input = disabled;
          }
          this.dis.video_auto = disabled;
          //this.dis.video_input = disabled;//视频输入
          this.dis.audio_input = disabled;//音频输入
          this.dis.video_encode = disabled;//视频编码
          this.dis.AudioEnc = disabled;//音频编码
          this.dis.AudioBitrate = disabled;//音频比特率
          this.dis.bitrate_mode = disabled;//码率控制
          this.dis.HdmiTransFormat = disabled;//编码分辨率
          this.dis.PushHdmiOut = disabled;//推流-HDMI输出
          if(this.curDevSeries == "1080"){
            this.dis.SEI = disabled;//SEI
          }else{
            this.dis.hdr = disabled;//HDR设置
            this.dis.latency = disabled;//时延模式
          }
        }else if(devMode == 'DV5000T'){//DV5000输入编码相关控制参数
          /*setSelectDisabled('.enc_type', disabled);//单路、多路编码
          setSelectDisabled('#dev_sdi_switch0', disabled);//通道1
          setSelectDisabled('#dev_sdi_switch1', disabled);//通道2
          setSelectDisabled('#dev_sdi_switch2', disabled);//通道3
          setSelectDisabled('#dev_sdi_switch3', disabled);//通道4
          setSelectDisabled('#video_enc_sel', disabled);//视频编码
          setSelectDisabled('#audio_enc_sel', disabled);//音频编码
          setSelectDisabled('#latency_mode_sel', disabled);//时延模式
          setSelectDisabled('#video_input_sel', disabled);//输入接口
          setSelectDisabled('#bitrate_mode_sel', disabled);//码率控制
          setSelectDisabled('#audio_bitrate_sel', disabled);//音频码率
          setSelectDisabled('#audio_channel_sel', disabled);//音频通道
          setSelectDisabled('#iframeOnly_sel', disabled);//全I帧编码
          setSelectDisabled('#chroma_sel', disabled);//色彩格式
          setSelectDisabled('#bit_depth_sel', disabled);//比特位深
          setSelectDisabled('#hdr_5000_sel', disabled);//HDR*/
        }
      },
      formatData(data){
        console.log("formatData")
        console.log(data)
        var that = this;
        if(data.length == 0){
          return;
        }
        var options = [];
        var devSN = this.ActiveDevice.dev_sn;
        var devMode = this.$global.getDevMode(devSN.substr(-4));
        this.showDevSrt(data["InteractOption"]);//根据配对接收机判断是否显示互动功能(4000的互动)
        //判断权限
        var hasRights = that.$global.judgeUserHasDevRights();
        //背包自动输入是否是自动
        var vAuto = data['video_auto_input'];
        if(that.pageLock){//背包锁定
          //需要判断视频输入是否是自动,自动且选项变化，更新全部参数
          if(vAuto === 1){
            var vInputOld = that.options.video_input;
            that.setVInputOption(data['video_input']);
            that.dis.video_input = true;
            if(vInputOld != data['video_input']){
              that.bUpdateParam = 'update';
            }
          }
          if (data['param_lock'] == '1') {
            if(that.curDevSeries == "4000"){
              that.getSrtTransPortParam(devSN);//传输通道
            }
          }
        }

        that.options.workModeVal = data["WorkMode"];
        /*//传输模式
        that.options.PushTsType = data['PushTsType'];*/
        //初始化下拉列表值
        this.getSelectOptions(data);
        that.options.online = data["online"];
        that.options.dev_push_status = data["dev_push_status"];
        //序列号
        that.options.curDevSn = devSN;
        //传输开关
        that.options.dev_push_enable = data["dev_push_enable"];
        var devTypeArr = ["推流","拉流","互动"];
        that.options.WorkMode = devTypeArr[data["WorkMode"]];
        that.WorkMode = devTypeArr[data["WorkMode"]];
        //传输模式
        that.PushTsType = data['PushTsType'];
        
        /*------------------------传输控制------------------------*/
        //传输IP
        that.options.dev_push_ip = data['dev_push_ip']=="1"?"1":"0";
        //录制存储
        that.options.StorageDev = data['StorageDev'];
        //录制开关
        if(data['record'] == '1'){
          that.options.record = true;
        }else{
          that.options.record = false;
        }
        //重传开关
        that.options.ResendMode = (data['ResendMode'] == '1' ? true : false);
        //纠错开关
        if(data['OpenfecMode'] == '1'){
          that.options.OpenfecMode = true;
        }else{
          that.options.OpenfecMode = false;
        }
        //纠错能力
        that.options.OpenfecLevel = data['OpenfecLevel'];
        //ETH0 IP
        that.options.Eth0Type = data['Eth0Type'];
        //wifi/热点
        that.options.WiFiSwitch = data['WiFiSwitch']=='1'?true:false;
        //显示别名开关
        that.options.DevAliasSwitch = (data['DevAliasSwitch'] == '1')?true:false;
        //别名
        that.options.DevAlias = data['dev_name'];
        //日志等级
        that.options.ArmSenderLogLevel = data['ArmSenderLogLevel'];
        /************************************************************
        *输入编码部分的参数控制，不同系列背包的输入编码参数不同 && 视频比特率
        ************************************************************/


        if(this.curDevSeries == "1080"){
          /*//拉流-HDMI输出
          $("#PullMHdmiOut_sel").selectpicker('val', res.data[0]['PullMHdmiOut']);
          //拉流-HDMI音频输出
          $("#hdmiPull_sel").selectpicker('val', res.data[0]['PullMHdmiAS']);
          //拉流-网卡选择
          $cardPull_sel.selectpicker('val', cardEnum2Id(res.data[0]['PullTransIf']));
          //拉流-传输开关
          var pullOpen_state = "";
          if (res.data[0]['dev_push_enable'] == '0') {
            pullOpen_state = false;
            $('#urlPull_table').bootstrapTable('showColumn', 'delBtn');
          } else {
            pullOpen_state = true;
            $('#urlPull_table').bootstrapTable('hideColumn', 'delBtn');
          }
          $pullOpen.bootstrapSwitch('disabled', false).bootstrapSwitch('state', pullOpen_state, true).bootstrapSwitch('disabled', disabled);
          
          if(res.data[0]['ActDev'] == ""){
            $actDevSn.text('');//当前背包对应的互动背包的值
          }else{
            $actDevSn.text(res.data[0]['ActDev']);//当前背包对应的互动背包的值
          }
          $actDisplay_sel.selectpicker('val', res.data[0]['ActDisplay']);//切换显示
          $actHdmiOut_sel.selectpicker('val', res.data[0]['ActHdmiOut']);//互动HDMI输出
          $actMHdmiOut_sel.selectpicker('val', res.data[0]['ActHdmiOut']);//2010T互动音视频输出
          actAudioOut_sel.selectpicker('val', res.data[0]['ActMAudioOut']);//互动HDMI输出
          $srtTransport_sel.selectpicker('val', cardEnum2Id(res.data[0]['SrtTransIf']));//传输通道
          //网络模式
          var cardId = cardEnum2Id(res.data[0]['SrtTransIf']);
          if(cardId.indexOf("lte") != -1){
            $("#act_net_mode").show();
            getActNetModeParam(cardId);//网络模式
          }else{
            $("#act_net_mode").hide();
          }
          //拉流
          var cardIdPull = cardEnum2Id(res.data[0]['PullTransIf']);
          console.log("cardId:"+cardIdPull)
          if(cardIdPull.indexOf("lte") != -1){
            $("#pull_net_mode").show();
            getActNetModeParam(cardIdPull);//网络模式
          }else{
            $("#pull_net_mode").hide();
          }

          if($("#srtTransport_sel option[value="+$("#srtTransport_sel").val()+"]").css('color') == 'rgb(255, 255, 255)'){
            $('#dev_srt').bootstrapSwitch('disabled', true);//互动的传输开关
            $("#devSrtErr").text($.i18n.prop("mlang--101361"))//"没有可用的网卡"
          }
          getActAddr(res.data[0]['ActPushAddr'],res.data[0]['ActPullAddr']);
          $actAddrPull.val(res.data[0]['ActPullAddr']);//互动拉流地址
          $actAddrPush.val(res.data[0]['ActPushAddr']);//互动推流地址*/
        }
        else if(that.curDevSeries == "4000"){
          //4000的互动接收机
          //互动模式
          var dev_interactive_mode_switch_state = "";
          if (data['InteractOption'] == '1') {
            dev_interactive_mode_switch_state = true;
          } else {
            dev_interactive_mode_switch_state = false;
          }
          that.options.InteractiveMode = dev_interactive_mode_switch_state;
          //互动开关
          var dev_srt_switch_state = "";
          if (data['SrtSwitch'] == '1') {
              dev_srt_switch_state = true;
          } else {
              dev_srt_switch_state = false;
          }
          that.options.SrtSwitch = dev_srt_switch_state;
          //切换
          that.OPTIONS_SRT_AUDIO_SWITCH_4000 = that.$global.OPTIONS_SRT_AUDIO_SWITCH_4000;
          that.options.SrtAudioIdx = data['SrtAudioIdx'];
          //全屏
          var dev_srt_full_switch_state = "";
          if (data['SrtFullSwitch'] == '1') {
              dev_srt_full_switch_state = true;
          } else {
              dev_srt_full_switch_state = false;
          }
          that.options.SrtFullSwitch = dev_srt_full_switch_state;
          //传输通道
          if(that.OPTIONS_SRT_TRANSPORT_PARAMS.length == 0){
            that.getSrtTransPortList();
          }
          //耳机音频选择
          that.OPTIONS_ACT_AUDIOOUT_1080 = that.$global.OPTIONS_ACT_AUDIOOUT_1080;
          that.options.AudioMode = data['AudioMode']
          //文件回传
          var back_enable_state = "";
          if (data['OffLinePushEnable'] == '1') {
            //回传开启中
            back_enable_state = true;
            //回传开启，显示传输状态
            /*devFileUpFlag = 1;
            $updateFileIcon.addClass('disabledIcon');*/
          } else {
            //回传停止
            back_enable_state = false;
            /*devFileUpFlag = 0;
            $updateFileIcon.removeClass('disabledIcon');*/
          }
          that.options.OffLinePushEnable = back_enable_state;
          //回传方式
          that.options.back = data['transtype'];
        }
        else if(that.curDevSeries === "1080_gjf"){
          /*$("#delayShow").show();
          //互动开关
          var dev_srt_switch_state = "";
          if (res.data[0]['SrtSwitch'] == '1') {
            dev_srt_switch_state = true;
          } else {
            dev_srt_switch_state = false;
          }
          $switch_srt_gjf.bootstrapSwitch('state', dev_srt_switch_state, true).bootstrapSwitch('disabled', disabled);
          //视频输出
          $gjfHdmiOut_sel.selectpicker('val', res.data[0]['ActHdmiOut']);*/
        }




        if(devMode != 'DV5000T'){//4000,1080系列背包但不包括5000
          if(that.curDevSeries.indexOf('1080') >= 0){
            //SEI
            that.options.SEI = (data['SEI'] == '1' ? true : false);
          }
          //输入自动
          if(data["vAutoOption"] == 1){
            that.show.vAutoOption = true;
          }else{
            that.show.vAutoOption = false;
          }
          that.options.vAutoOption = data["video_auto_input"];
          //视频输入
          that.setVInputOption(data['video_input']);
          that.options.video_input_old = data['video_input'];
          //音频输入
          if(that.curDevSeries.indexOf('1080') >= 0){
            that.OPTIONS_AUDIOINPUT = that.$global.getDevParamRange(devSN, '', 'audio_input', data['video_input'],data['video_encode']);
          }else if(that.curDevSeries == "4000"){
            if (data['video_input'] == '4') { //视频接口是HDMI
              that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264_4000;
            } else { //不是HDMI
              that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_4000;
            }
            if(that.options.video_encode == '4'){ //视频编码是H.264
              that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264_4000;
            }
          }
          that.options.audio_input = data['audio_input'];
          //视频编码
          options = that.$global.getDevParamRange(devSN, '', 'video_encode');
          if(that.curDevSeries.indexOf('1080') >= 0){
            that.OPTIONS_VIDEOENCODE = options;
            that.options.video_encode = data['video_encode'];
            that.options.video_encode_old = data['video_encode'];
          }else if(that.curDevSeries == "4000"){
            var videoEncodeShowOption = [];
            if (data['video_input'] == '4') { //视频接口是HDMI
              for (var i = 0; i < options.length; i++) {
                if (options[i].value == '4') {
                  videoEncodeShowOption.push(options[i]);
                  that.OPTIONS_VIDEOENCODE = videoEncodeShowOption;
                  that.options.video_encode = 4;
                }
              }
              data['video_encode'] = '4';
              //HDR，时延，音频编码隐藏
              that.hdrShow = false;
              that.latencyShow = false;
              that.audioEncShow = false;
            } else {
              for (var i = 0; i < options.length; i++) {
                videoEncodeShowOption.push(options[i]);
                that.OPTIONS_VIDEOENCODE = videoEncodeShowOption;
                that.options.video_encode = data['video_encode'];
              }
              //HDR，时延，音频编码显示
              that.hdrShow = true;
              that.latencyShow = true;
              that.audioEncShow = true;
            }
            that.options.video_encode_old = data['video_encode'];
          }
          //音频编码
          options = that.$global.getDevParamRange(devSN, '', 'audio_encode');
          that.OPTIONS_AUDIO_ENCODE = options;
          that.options.AudioEnc = data['AudioEnc'];
          //音频比特率
          that.OPTIONS_AUDIO_BR = that.OPTIONS_AUDIO_BR;
          that.options.AudioBitrate = data['AudioBitrate'];
          //码率控制
          options = that.$global.getDevParamRange(devSN, '', 'bitrate_mode');
          that.OPTIONS_BITRATEMODE = options;
          that.options.bitrate_mode = data['bitrate_mode'];
          if(that.curDevSeries == "4000"){
            //HDR
            options = that.$global.getDevParamRange(devSN, '', 'hdr', data['video_encode']);
            that.OPTIONS_HDR = options;
            that.options.hdr = data['hdr'];
            //时延模式
            options = that.$global.getDevParamRange(devSN, '', 'latency');
            var latencyVal = data['latency'];
            if(that.options.video_encode == '4' && options.length > 1){ //视频编码是H.264
              that.OPTIONS_LATENCY = that.$global.OPTIONS_LATENCY2_4000;
              if(data['latency'] == '1'){
                latencyVal = '0';
                that.$global.setDeviceParam('latency',latencyVal)
              }
            }else{
              that.OPTIONS_LATENCY = options;
            }
            that.options.latency = latencyVal;
            that.options.latency_old = latencyVal;
          }
          //编码分辨率
          if(that.curDevSeries.indexOf('1080') >= 0){
            options = that.$global.getDevParamRange(devSN, '', 'HdmiTransFormat', '', data['WorkMode']);
            that.OPTIONS_HDMI_FORMAT = options;
            that.options.HdmiTransFormat = data['WorkMode']=="2"?3:data['HdmiTransFormat']
            if(data['WorkMode'] != 2){//记录 推流 拉流 模式的编码分辨率值
              that.options.pushHDMIFormat = data['HdmiTransFormat'];
            }
          }else{
            options = that.$global.getDevParamRange(devSN, '', 'HdmiTransFormat', '', data['video_encode']);
            that.OPTIONS_HDMI_FORMAT = options;
            that.options.HdmiTransFormat = data['HdmiTransFormat'];
          }
          //推流-HDMI输出,仅2010T显示
          that.OPTIONS_HDMI_OUT_PUSH = that.$global.OPTIONS_PUSH_MHDMIOUT;
          that.options.PushHdmiOut = data['PushMHdmiOut'];
          let isDV2010T = that.$global.sameToDV2010T(devSN);
          if(isDV2010T){
            if(data['WorkMode'] === 2){
              that.hdmiOutPushShow = false;
              that.hdmiOutActShow = true;
            } else{
              that.hdmiOutPushShow = true;//输入编码参数里的
              that.hdmiOutActShow = false; //输入编码参数里的
            }
            that.hdmiOutActShow = false; //互动参数里的
          } else{
            that.hdmiOutPushShow = false;
            that.hdmiOutActShow = false;                  
            //$('#actHdmiOut_div').show();
          }
        }else if(devMode == 'DV5000T'){
          /*var enc_type = data['5000_EncType'];
          var enc_curch = data['5000_CurCh'];//表示多路通道index
          var $dev_sdi = $("#dev_sdi"+enc_curch);
          var dev_sdi_state = "";
          if (data['nEnable'] == 1) {
              dev_sdi_state = true;
          } else {
              dev_sdi_state = false;
          }
          $dev_sdi.bootstrapSwitch('state', dev_sdi_state, true).bootstrapSwitch('disabled', disabled);//通道
          //参数显示
          addSelOptions('encParamSwitch_sel', OPTIONS_ENC_PARAM_SHOW_5000);
          $('#encParamSwitch_sel').selectpicker('val', res.data[0]['5000_EncParamSwitch']);
          dv5000EncodeParam(enc_type,enc_curch);//公共部分的db参数和5000输入编码参数有重合，重新获取*/
        }
        
        //音频输入
        /*that.options.audio_input = data['audio_input'];
        //音频编码
        that.options.AudioEnc = data['AudioEnc'];
        //音频比特率
        that.options.AudioBitrate = data['AudioBitrate'];
        //码率控制
        if(that.options.PushTsType == 1){//单卡推流
          that.options.bitrate_mode = 0;
          that.$global.setDeviceParam('bitrate_mode',0)
        }else{
          that.options.bitrate_mode = data['bitrate_mode'];
        }
        //编码分辨率
        that.options.HdmiTransFormat = data['HdmiTransFormat'];
        
       
        //that.initLatency();//视频输入和视频编码的值，影响时延模式的选项
        if(that.curDevSeries == "4000"){
          //that.changeVideoInput(data);
          //hdr设置
          that.options.hdr = data['hdr'];
          //时延模式
          that.options.latency = data['latency'];
          if(that.options.latency == 1){//超低时延，无AVBR
            that.OPTIONS_BITRATEMODE = that.$global.OPTIONS_BITRATEMODE2;
          }
          if(that.options.video_encode == '4'){
            //视频输入
            that.options_old_264.audio_input = data['audio_input'];
            //音频编码
            that.options_old_264.AudioEnc = data['AudioEnc'];
            //音频比特率
            that.options_old_264.AudioBitrate = data['AudioBitrate'];
            //码率控制
            that.options_old_264.bitrate_mode = data['bitrate_mode'];
            //hdr设置
            that.options_old_264.hdr = data['hdr'];
            //编码分辨率
            that.options_old_264.HdmiTransFormat = data['HdmiTransFormat'];

            //切换视频编码时做的初始化工作
            //视频输入
            that.options_old_265.audio_input = that.OPTIONS_AUDIOINPUT[0].value;
            //音频编码
            that.options_old_265.AudioEnc = that.OPTIONS_AUDIO_ENCODE[0].value;
            //音频比特率
            that.options_old_265.AudioBitrate = that.OPTIONS_AUDIO_BR[0].value;
            //码率控制
            that.options_old_265.bitrate_mode = that.OPTIONS_BITRATEMODE[0].value;
            //hdr设置
            that.options_old_265.hdr = that.OPTIONS_HDR[0].value;
            //编码分辨率
            that.options_old_265.HdmiTransFormat = that.OPTIONS_HDMI_FORMAT[0].value;
            //时延
            that.options_old_265.latency = that.OPTIONS_LATENCY[0].value;
          }else{
            //视频输入
            that.options_old_265.audio_input = data['audio_input'];
            //音频编码
            that.options_old_265.AudioEnc = data['AudioEnc'];
            //音频比特率
            that.options_old_265.AudioBitrate = data['AudioBitrate'];
            //码率控制
            that.options_old_265.bitrate_mode = data['bitrate_mode'];
            //hdr设置
            that.options_old_265.hdr = data['hdr'];
            //编码分辨率
            that.options_old_265.HdmiTransFormat = data['HdmiTransFormat'];
            //时延
            that.options_old_265.latency = data['latency'];
            //切换视频编码时做的初始化工作
            //视频输入
            that.options_old_264.audio_input = that.OPTIONS_AUDIOINPUT[1].value;
            //音频编码
            that.options_old_264.AudioEnc = that.OPTIONS_AUDIO_ENCODE[0].value;
            //音频比特率
            that.options_old_264.AudioBitrate = that.OPTIONS_AUDIO_BR[0].value;
            //码率控制
            that.options_old_264.bitrate_mode = that.OPTIONS_BITRATEMODE[0].value;
            //hdr设置
            that.options_old_264.hdr = that.OPTIONS_HDR[0].value;
            //编码分辨率
            that.options_old_264.HdmiTransFormat = that.OPTIONS_HDMI_FORMAT[0].value;
            //时延
            that.options_old_265.latency = that.OPTIONS_LATENCY[0].value;
          }
          //4000的互动接收机
          //互动模式
          var dev_interactive_mode_switch_state = "";
          if (data['InteractiveMode'] == '1') {
            that.options.InteractiveMode = true;
          } else {
            that.options.InteractiveMode = false;
          }
          //互动开关
          var dev_srt_switch_state = "";
          if (data['SrtSwitch'] == '1') {
            that.options.SrtSwitch = true;
          } else {
            that.options.SrtSwitch = false;
          }
          //切换
          that.options.SrtAudioIdx = data['SrtAudioIdx'];
          //全屏
          if (data['SrtFullSwitch'] == '1') {
            that.options.SrtFullSwitch = true;
          } else {
            that.options.SrtFullSwitch = false;
          }
          //传输通道
          if(that.OPTIONS_SRT_TRANSPORT_PARAMS.length == 0){
            that.getSrtTransPortList();
          }
          //音频模式
          that.options.AudioMode = data['AudioMode'];
          
          //文件回传
          if(data['OffLinePushEnable']=='1'){
            that.options.OffLinePushEnable = true;
            that.options.devFileUpFlag = 1;//回传开启，显示传输状态
            that.show.refreshFileList = false;
          } else {//回传停止
            that.options.OffLinePushEnable = false;
            that.options.devFileUpFlag = 0;
            that.show.refreshFileList = true;
          }
          
        }else if(that.curDevSeries == "1080"){
          //SEI
          //var sei_state = "";
          that.options.SEI = (data['SEI'] == '1' ? true : false);
          //视频编码
          that.options.video_encode = data['video_encode'];
        }*/
        return data;
      },
      //更新视频输入选项
      setVInputOption(videoOption){
        var that = this;
        var options = [];
        var devSN = this.ActiveDevice.dev_sn;
        if(this.curDevSeries == "4000"){
          //判断是否是PCIE版本
          that.$global.getDevListOneParam('hardVer',function(data){
            var hardVer = 0;
            if(data.hardVer != '' && data.hardVer != null){
              hardVer = parseFloat(data.hardVer.split("-")[0]);
            }
            options = that.$global.getDevParamRange(devSN, '', 'video_input', hardVer);
            that.OPTIONS_VIDEOINPUT = options;
            that.options.video_input = videoOption;
          })
        }else{
          options = that.$global.getDevParamRange(devSN, '', 'video_input');
          that.OPTIONS_VIDEOINPUT = options;
          that.options.video_input = videoOption;
        }
      },
      //视频输入
      changeVideoInput(data){
        console.log("changeVideoInput")
        console.log(data)
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;
        let isDV2010T = this.$global.sameToDV2010T(devSN);
        if(isDV2010T){
          var videoInput = this.options.video_input;
          var paramArr = [],valueArr = [];
          paramArr.push('video_input');
          valueArr.push(videoInput);
          if(videoInput === '1'){
            //HDMI不支持4声道
            this.options.audio_input = 1;
            paramArr.push('audio_input');
            valueArr.push('1');
          }
          that.$global.setDevParamList(paramArr,valueArr);
        }else if(this.curDevSeries.indexOf("1080") >= 0){
          this.$global.setDeviceParam('video_input', that.options.video_input);
          //this.audioEncShow = true;//1080显示音频编码
        }else if(this.curDevSeries == "4000"){
          var paramArr = [],valueArr = [];
          var options =  that.$global.getDevParamRange(devSN, '','video_encode');
          var oldVal = that.options.video_encode;
          if(that.options.video_input == '4'){//视频输入为HDMI 视频编码只支持H.264
            //设置视频输入
            paramArr.push('video_input');
            valueArr.push(that.options.video_input);
            //存视频输入变成HDMI之前的视频编码和时延模式
            that.options.video_encode_old = oldVal;
            that.options.latency_old = that.options.latency;
            that.options.video_input_old = 4;
            //HDMI
            that.OPTIONS_VIDEOENCODE = options.filter(function(item){
              return (item.value == '4');
            })
            if(that.OPTIONS_VIDEOENCODE.length == 0){
              that.OPTIONS_VIDEOENCODE = [{value: "4",text: "H.264"}];
            }
            that.options.video_encode = '4';
            paramArr.push('video_encode');
            valueArr.push('4');
            //HDR 时延隐藏
            that.hdrShow = false;//HDMI隐藏HDR
            that.latencyShow = false;//HDMI隐藏时延
            //时延置成标准模式
            that.options.latency = 0;//时延设置成标准模式
            paramArr.push('latency');
            valueArr.push('0');
            //========
            //音频通道
            that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264;
            that.options.audio_input = 1;
            paramArr.push('audio_input');
            valueArr.push('1');
            
            //音频编码隐藏
            that.audioEncShow = false; 
            
            //编码分辨率
            if (oldVal != '4') {
              //视频编码从H.265->H.264 编码分辨率选项放开
              that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_4000;
            }
            that.$global.setDevParamList(paramArr,valueArr);
          }else{
            //从HDMI切换到其他选项,还原之前的视频编码和时延模式
            if(that.options.video_input_old == 4){
              oldVal = that.options.video_encode_old;
              that.options.latency = that.options.latency_old;
              that.options.video_input_old = 0;
              paramArr.push('video_input');
              valueArr.push(that.options.video_input);
              paramArr.push('video_encode');
              valueArr.push(oldVal);
              paramArr.push('latency');
              valueArr.push(that.options.latency_old);
              //编码分辨率 视频编码 H.265
              if(oldVal != '4'){
                that.OPTIONS_HDMI_FORMAT = [that.$global.OPTIONS_HDMI_FORMAT_4000[0]]
                paramArr.push('HdmiTransFormat');
                valueArr.push('0');
              }
              //音频输入
              if(oldVal != '4'){//视频编码 H.265
                that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_4000;
                that.options.audio_input = 1;
              }
              if(oldVal != '4'){
                //视频比特率
                /*paramArr.push('dev_sr');
                valueArr.push(speedInputH265Old * 1000);*/
              }
              that.$global.setDevParamList(paramArr,valueArr);
            }else{
              //设置视频输入
              that.$global.setDeviceParam('video_input', that.options.video_input);
              //音频输入
              if (oldVal == '4'){ //视频编码 H.264
                that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264_4000;
              }
            }
            //不是HDMI
            that.OPTIONS_VIDEOENCODE = options;
            //保持视频编码不变
            that.options.video_encode = oldVal;
            //HDR 时延显示
            that.hdrShow = true;
            that.latencyShow = true;
            //时延
            if (oldVal == '4'){ //视频编码 H.264
              that.OPTIONS_LATENCY = that.$global.OPTIONS_LATENCY2;
            }
            //音频编码显示
            that.audioEncShow = true;
          }
        }
      },
      //音频输入
      changeAudioInput(data){
        var audioInput = this.options.audio_input;
        var workMode = this.options.workModeVal;
        var videoInput =this.options.video_input;
        //2010T，推流模式+SDI输入，才支持4声道
        var devSN = this.ActiveDevice.dev_sn;
        let isDV2010T = this.$global.sameToDV2010T(devSN);
        if(isDV2010T){
          if(audioInput === '2' && (workMode !== '0' || videoInput !== '0')){
            audioInput = '1';
            this.$toast({
              message: '推流模式下，SDI输入才支持4声道',
              position: 'middle',
              duration: 2000
            }); 
            this.options.audio_input = 1;
          }
        }
        $global.setDeviceParam('audio_input',this.options.audio_input)
      },
      //输入自动
      changeVideoAuto(data){
        console.log("changeVideoAuto")
        console.log(data)
        if (this.options.vAutoOption) {
          this.$global.setDeviceParam('video_input', 32);
        } else {
          this.$global.setDeviceParam('video_input', this.options.video_input);
        }
      },
      initLatency(){
        var that = this;
        if(this.curDevSeries == "1080"){
          this.latencyShow = false;//1080：时延模式hide
        }else if(this.curDevSeries == "4000"){
          if(this.options.video_input == 4){//视频输入为HDMI，时延模式hide
            this.latencyShow = false;
          }else{//视频输入非HDMI，时延模式show
            this.latencyShow = true;
          }
          
          //this.curRcvSeries = this.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
          if( !this.curRcvSeries ){//非法接收机序列号，当前接收机类型设为虚拟接收机
            this.curRcvSeries = VIR_RCV;
          }
          if(this.curRcvSeries == VIR_RCV || this.curRcvSeries == R1080_RCV){//配对接收机为虚拟接收机或2010R。时延模式只有“标准延时”
            this.OPTIONS_LATENCY = this.$global.OPTIONS_LATENCY2;
          }else{//实体接收机
            if(this.options.video_encode == "4"){//视频编码为264,时延模式只有“标准延时”
              this.OPTIONS_LATENCY = this.$global.OPTIONS_LATENCY2;
            }else{
              this.OPTIONS_LATENCY = this.$global.OPTIONS_LATENCY;
            }
          }
        }
      },
      changeVideoEncode(){
        var that = this;
        /*that.initLatency();//视频编码的修改影响时延模式的选项
        if(that.options.video_encode == '4'){
          that.formatVideoEncode264();
        }else{
          that.formatVideoEncode265();
        }
        that.$global.setDeviceParam('video_encode',that.options.video_encode);*/
        if(that.curDevSeries.indexOf('1080') >= 0){
          that.$global.setDeviceParam('video_encode', that.optiosn.video_encode);
        }else if(that.curDevSeries == "4000"){
          var paramArr = [], valueArr = [];
          paramArr.push('video_encode');
          valueArr.push(that.options.video_encode);
          var devSN = that.ActiveDevice.dev_sn;
          var rcvSn = that.ActiveDevice.rcv_sn;
          /*var speed_inputVal = +$('#speed_input_push').val();
          var delay_inputVal = +$('#delay_input').val();*/
          if (that.options.video_encode == '4') {
            //存视频编码不是H.264时的时延模式
            that.options.latency_old = that.options.latency;
            that.options.bitrate_mode_old = that.options.bitrate_mode;
            that.video_encode_old = 4;
            //H.264 编码分辨率选项放开
            that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_4000;
            //音频输入 不支持 0-CH 4-CH

            var audioInputVal = that.options.audio_input;
            if(audioInputVal != '1'){
              audioInputVal = 1;
            }
            that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264;
            that.options.audio_input = audioInputVal;
            paramArr.push('audio_input');
            valueArr.push(audioInputVal);
            //时延模式 不支持 超低时延
            that.OPTIONS_LATENCY = that.$global.OPTIONS_LATENCY2;
            that.options.latency = 0;
            paramArr.push('latency');
            valueArr.push(0);
            //4000选标准时延时，码率控制为CBR,AVBR
            that.OPTIONS_BITRATEMODE = this.$global.OPTIONS_BITRATEMODE;
            //HDR设置 不支持HLG
            that.OPTIONS_HDR = that.$global.OPTIONS_HDR_1080;
            that.options.hdr = 0; 
            paramArr.push('hdr');
            valueArr.push(0);
          } else {
            //H.265 编码分辨率选项只有自动
            that.OPTIONS_HDMI_FORMAT = [that.$global.OPTIONS_HDMI_FORMAT_4000[0]];
            that.options.HdmiTransFormat = 0;
            paramArr.push('HdmiTransFormat');
            valueArr.push(0);
            //音频输入 支持 0-CH
            audioInputVal = that.options.audio_input;
            that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_4000;
            that.options.audio_input = audioInputVal;
            //时延模式 支持 超低时延
            var latencyVal = that.options.latency;
            that.OPTIONS_LATENCY = that.$global.OPTIONS_LATENCY;
            that.options.latency = latencyVal;
            //HDR
            var hdrVal = that.options.hdr;
            var hdrOptions = that.$global.getDevParamRange(that.ActiveDevice.dev_sn, '', 'hdr');
            that.OPTIONS_HDR = hdrOptions;
            that.options.hdr = hdrVal;
            //从H.264切换成其他的，时延模式恢复
            if(that.options.video_encode_old == 4){
              paramArr.push('latency');
              valueArr.push(that.options.latency_old);
              that.options.latency = that.options.latency_old;
              that.options.video_encode_old = 0;
            }else{
              
            }
          }
          //视频编码做切换后，记忆显示对应速率和延时的同时要对数据库做对应变更
          that.$global.setDevParamList(paramArr,valueArr);
        }
      },
      formatVideoEncode264(){
        var that = this;
        //音频输入  只支持2-CH
        that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_HDMI264;
        //时延模式  隐藏，设置成标准时延
        //that.latencyShow = false;
        that.options.latency = 0;
        //编码分辨率 显示全部选项
        that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_4000
        //HDR
        that.OPTIONS_HDR = that.$global.OPTIONS_HDR_1080;//h.264只显示SDR
        if(that.options.hdr == 1){
          that.options.hdr = 0;
          that.$global.setDeviceParam('hdr',that.options.hdr);
        }
        //赋值上次对应参数
        //视频输入
        /*that.options.audio_input = that.options_old_264.audio_input;
        //音频编码
        that.options.AudioEnc = that.options_old_264.AudioEnc;
        //音频比特率
        that.options.AudioBitrate = that.options_old_264.AudioBitrate;
        //码率控制
        //that.OPTIONS_BITRATEMODE = that.$global.OPTIONS_BITRATEMODE;
        that.options.bitrate_mode = that.options_old_264.bitrate_mode;
        //hdr设置
        that.options.hdr = that.options_old_264.hdr;
        //编码分辨率
        that.options.HdmiTransFormat = that.options_old_264.HdmiTransFormat;*/
        //码率控制
        //DV4000的背包  是所有的SDI入(包括12G-SDI 3G-SDI 4*3-2SI 4*3 SQ)这四个的H.264  都不支持AVBR
        /*if(that.options.video_input == "4"){//HDMI h.264
          that.OPTIONS_BITRATEMODE = that.$global.OPTIONS_BITRATEMODE;
        }else{
          that.OPTIONS_BITRATEMODE = that.$global.OPTIONS_BITRATEMODE2;
        }*/
        
        //that.options.bitrate_mode = 0;
      },
      formatVideoEncode265(){
        var that = this;
        //音频输入  0 2 4
        that.OPTIONS_AUDIOINPUT = that.$global.OPTIONS_AUDIOINPUT_4000;
        //音频编码  AAC LPCM MPRG1L2(对用户组还有区分)
        that.OPTIONS_AUDIO_ENCODE = that.OPTIONS_AUDIO_ENCODE_ORI;
        //时延模式  标准时延 超低时延
        //that.latencyShow = true;
        //编码分辨率 只支持自动
        that.OPTIONS_HDMI_FORMAT = that.$global.OPTIONS_HDMI_FORMAT_4000.filter(function(item){
          return (item.value == 0)
        });
        if(that.options.HdmiTransFormat != 0){
          that.options.HdmiTransFormat = 0;
          that.$global.setDeviceParam('HdmiTransFormat',0);
        }

        that.OPTIONS_HDR = that.$global.getDevParamRange(that.ActiveDevice.dev_sn, '',"hdr");//HDR设置
        //码率控制
        //that.OPTIONS_BITRATEMODE = that.$global.OPTIONS_BITRATEMODE;
        //赋值上次对应参数
        //视频输入
        /*that.options.audio_input = that.options_old_265.audio_input;
        //音频编码
        that.options.AudioEnc = that.options_old_265.AudioEnc;
        //音频比特率
        that.options.AudioBitrate = that.options_old_265.AudioBitrate;
        //码率控制
        that.options.bitrate_mode = that.options_old_265.bitrate_mode;
        //hdr设置
        that.options.hdr = that.options_old_265.hdr;
        //编码分辨率
        that.options.HdmiTransFormat = that.options_old_265.HdmiTransFormat;
        //时延模式
        that.options.latency = that.options_old_265.latency;*/
      },
      changeRecord(){
        var that = this;
        if(this.options.record == true){
          //回传中要询问
          var text = '';
          if (this.options.OffLinePushEnable) {//文件离线回传中
            text = '是否停止背包文件回传？';
            //询问
            that.$messagebox.confirm(text).then(
              action => {
                //停止文件回传
                that.clickBackStopBtn();
                //$('#back_enable').bootstrapSwitch('state', false, true);
                that.options.OffLinePushEnable = false;
                that.options.record = false;
                //$("#dev_record").bootstrapSwitch('state', false, true);
              },
              action => {
                that.options.record = false;
              } 
            );
          }else if(this.options.WorkMode == '拉流'){//拉流模式不支持录制
            this.$toast({
              message: '当前模式不支持录制功能！',
              position: 'middle',
              duration: 2000
            }); 
            setTimeout(function(){
              this.options.record = false;
            },500)
          } else {
            that.$global.setDeviceParam('record','1')
            this.dis.StorageDev = true;//开始录制以后,存储设备不能修改
          }
        } else {
          //setDevParam('record', 0, switchId);
          that.$global.setDeviceParam('record','0', function(){
            //关录制刷新文件列表
            setTimeout(function(){
              that.clickFileRefreshIcon()
            },1000)
          })
          this.dis.StorageDev = false;//开始录制以后,存储设备不能修改
        }
        /*this.$global.setDeviceParam('record',this.options.record?'1':'0')
        if(this.options.record == 1){
          this.dis.StorageDev = true;
        }else{
          this.dis.StorageDev = false;
        }*/
      },
      //修改别名
      changeAliasName(){
        var that = this;
        /*var aliasNameId = '#dev_alias_name_switch';
        var aliasValue = $('#dev_alias_name').val();*/
        var len = that.$global.Substr(that.options.DevAlias, 0);
        if(len > 10){
          that.$toast({
            message: '别名长度不超过10',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        //别名名称校验
        if (!that.nameDevAliasCheckType(that.options.DevAlias)) {
          that.$toast({
            message: '长度1~10，仅支持中文,字母,数字,+,-,@,(),和空格',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        that.$global.setDeviceParam('DevAlias',that.options.DevAlias)
        that.setDevNameParam('dev_name', that.options.DevAlias);
      },
      changeDevParam(paramType){
        var that = this;
        that.$global.setDeviceParam(paramType,that.options[paramType]);
        if(that.options.video_encode == "4"){//264
          that.options_old_264[paramType] = that.options[paramType];
        }else{
          that.options_old_265[paramType] = that.options[paramType];
        }
      },
      //设置背包名称dev_name参数(跟别名保持一致)
      setDevNameParam(param, value) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            devSN: that.ActiveDevice.dev_sn,
            devNameCol: param,
            value : value+"",
          }),
          Api:"SetDevNameParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            
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
      nameDevAliasCheckType(name) {
        var pattern = /^[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]{1,10}$/gi;
        return pattern.test(name);
      },
      getDevCardParam(cb){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevCardParam:true,
            devSN: that.ActiveDevice.dev_sn
          }),
          Api:"getDevCardParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(cb){
              cb(res.data[0]);
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
      /*setDeviceParam(key,val){
        var that = this;
        var devParamCol = key;
        var value = val;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            devSN: that.ActiveDevice.dev_sn,
            devParamCol: devParamCol,
            value: value
          }),
          Api:"SetDevParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$global.getDeviceParam(that.formatData);
          }else{
            console.log(res.reason)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },*/
      saveMatch(){
        var that = this;
        var dev_sn = that.ActiveDevice.dev_sn;
        var rcv = that.options.matchRcv;
        var board = that.options.matchBoard;
        var sub = rcv.substr(-4);
        //未修改
        if(that.ActiveDevice.rcv_sn == that.options.matchRcv 
          && that.ActiveDevice.board_id == that.options.matchBoard){
          return;
        }
        
        //是否是虚拟接收机
        var DV4000RV = false;
        var rcvSeries = this.$global.getRcvSeries(rcv);
        if (sub == VIR_RCV) {//虚拟接收机
          DV4000RV = true;
          board = that.ActiveDevice.dev_sn;
        } else if(rcvSeries == R1080_RCV){//2010R
          DV4000RV = true;
        }else {//实体接收机
          //无可用板卡
          if (board == '' || board == '-1' && !DV4000RV) {
            return;
          }
          board = (+board);
        }
        
        var text = '是否切换配对关系？';
        that.$global.getPushAndPrefixMatch(dev_sn,rcv,function(data){//判断背包和虚拟接收机是否跨组配对以及背包推流开关
          if (data == 'norcv_push_samePrefix') {//无配对，背包、接收机在同一个组
            that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name, -1, -1, function(){
              that.unbindBtnShow = true;
              that.latencyChange(DV4000RV);
              that.changeFileFlgShow(rcv);
              that.$global.getDeviceParam(that.formatData);
              that.ActiveDevice.rcv_sn = rcv;
              that.ActiveDevice.board_id = board;
            });
          }else if(data == 'norcv_push_difPrefix'){//无配对，背包、接收机要跨组配对
            text = '是否进行背包和接收机跨组配对？';
            that.$messagebox.confirm(text).then(
              action => {
                that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name, -1, -1, function(){
                  that.unbindBtnShow = true;
                  that.latencyChange(DV4000RV);
                  that.changeFileFlgShow(rcv);
                  that.$global.getDeviceParam(that.formatData);
                  that.ActiveDevice.rcv_sn = rcv;
                  that.ActiveDevice.board_id = board;
                });
              } 
            );
          } else {
            /*if (data == 'push_samePrefix') {
              text = '是否需要先停止推流再切换配对关系？'
            }else if(data == 'push_difPrefix'){
              text = '是否需要停止推流并且进行跨组配对？'
            }else */if(data == 'nopush_difPrefix'){
              text = '是否进行背包和接收机跨组配对切换？'
            }
            that.$messagebox.confirm(text).then(
              action => {
                that.$global.editMatch(rcv,board,that.ActiveDevice.dev_sn, that.ActiveDevice.dev_name, -1, -1, function(){
                  that.unbindBtnShow = true;
                  that.latencyChange(DV4000RV);
                  that.changeFileFlgShow(rcv);
                  that.$global.getDeviceParam(that.formatData);
                  that.ActiveDevice.rcv_sn = rcv;
                  that.ActiveDevice.board_id = board;
                });
              } 
            );
          }
        });
      },
      unbindMatch(){
        var that = this;
        var text = '是否解除配对关系？';
        var dev_sn = that.ActiveDevice.dev_sn;
        var rcv_sn = that.ActiveDevice.rcv_sn;
        var board_id = that.ActiveDevice.board_id;
        var bindChart = dev_sn + "/" +rcv_sn + "/" + board_id;
        that.$global.getDevPushStatus(dev_sn, function(data) {
          if (data == '1') {
            text = '是否需要先停止推流再解除配对关系？'
          }
          //询问
          that.$messagebox.confirm(text).then(
            action => {
              //that.$global.clickRecordBtn('0');
              
              that.$axios({
                method: 'post',
                url:"/page/index/indexData.php",
                data:that.$qs.stringify({
                  delMatch:true,
                  dev_sn: dev_sn
                }),
                Api:"delMatch",
                AppId:"android",
                UserId:that.user.id
              })
              .then(function (response) {
                let res = response.data;
                if(res.res.success){
                  //推流开关关上，回传开关关上 实时监测界面
                  /*$("#dev_push_enable").bootstrapSwitch('state', false, true);
                  if($("#back_enable").bootstrapSwitch('state') == true){
                    $("#back_enable").bootstrapSwitch('state', false, true);
                    clickBackStopBtn();
                  }*/
                  //chars数据删除--start
                  that.$global.initChartSessionData(bindChart, "del");
                  //chars数据删除--end  
                  that.ActiveDevice.rcv_sn = "";
                  that.ActiveDevice.rcv_name = "";
                  that.ActiveDevice.board_id = "";
                  that.$global.getRcvList4000(that.formatRcvListData);
                  that.options.matchBoard = "";
                  that.options.matchRcv = "";
                  that.bindBtnShow = false;
                }else{
                  that.$toast({
                    message: res.res.reason,
                    position: 'middle',
                    duration: 2000
                  }); 
                }
                that.$global.getDeviceParam(that.formatData);
              })
              .catch(function (error) {
                console.log(error)
              })
            }).catch();
        });
      },
      changeFileFlgShow(rcv){
        var curRcvSeries = this.$global.getRcvSeries(rcv?rcv:"");
        if(curRcvSeries == R1080_RCV){//2010R
          this.devFileShow = false;
        }else{
          this.devFileShow = true;
        }
      },
      changeBackEnable(){
        var that = this;
        var state = this.options.OffLinePushEnable;
        if (state) {
          var workStr = "";
          if(this.options.online == '1'){
            workStr = '待机';
            if(this.options.OffLinePushEnable == false){
              workStr = '文件离线回传中';
            }else{
              if(this.options.dev_push_status == '1'){
                workStr = '直播中';
                if(this.options.record){
                  workStr += ' 录制中';
                }
              }else if(this.options.record){
                workStr = '录制中';
              }
            }
          }else{
            workStr = '离线';
          }
          /*var dev_push_enable = this.options.dev_push_enable;
          var dev_record_enable = this.options.record;*/
          //推流中和录制中要询问
          var text = '';
          if (workStr == '直播中') {
            text = '是否停止推流？';
          }else if (workStr == '录制中') {
            text = '是否停止录制？';
          }else if (workStr == '直播中 录制中') {
            text = '是否停止推流和录制？';
          }
          if (text != '') {
            //询问
            that.$messagebox.confirm(text).then(
              action => {
                that.options.record = false;
                that.options.dev_push_status = false;
                that.$global.setDevParamList(['dev_push_enable','record'],[0,0],'')
                that.options.OffLinePushEnable = false;
              },
              action => {
                that.options.OffLinePushEnable = false;
              } 
            );
          }else{
            this.clickBackStartBtn();
          }
        }else{
          this.clickBackStopBtn();
          this.show.offLinePush = false;
        }
      },
      //点击回传按钮
      clickBackStartBtn() {
        var that = this;
        //是否在传输中
        if (this.options.devFileUpFlag == 1) {
          return;
        }
        var type = this.options.back;//回传方式
        var usbFlg = false;
        if(this.options.filePos == 1){
          usbFlg = true;
        }
        if(usbFlg && type!=3){//usb只有在 文件传输模式 下可以选择
          this.$toast({
            message: 'usb中的文件只能选择文件传输!',
            position: 'middle',
            duration: 2000
          }); 
          this.options.OffLinePushEnable = false;
          return;
        }

        //选择文件个数
        var selFile = [];
        for(var i=0; i<this.fileList.length; i++){
          if(document.getElementsByName(this.fileList[i]["fileName"])[0].checked){
            selFile.push(this.fileList[i]["fileName"]);
          }
        }
        if (selFile.length < 1) {
          this.$toast({
            message: '请选择一个文件!',
            position: 'middle',
            duration: 2000
          }); 
          setTimeout(function(){
            that.options.OffLinePushEnable = false;  
          },500)
          return;
        }
        if(type == 3 && selFile.length>1){//文件传输，只支持一个文件
          this.$toast({
            message: '文件传输，只支持一个文件!',
            position: 'middle',
            duration: 2000
          }); 
          setTimeout(function(){
            that.options.OffLinePushEnable = false;  
          },500)
          return;
        }
        if (selFile.length > 5) {
          this.$toast({
            message: '最多选择5个!',
            position: 'middle',
            duration: 2000
          }); 
          setTimeout(function(){
            that.options.OffLinePushEnable = false;  
          },500)
          return;
        }
        //判断所有文件是否都是一个速率的
        var fileBr = selFile[0].split('_')[1];
        for(var k=1; k<selFile.length; k++){
          var fileBrTemp = selFile[k].split('_')[1];
          if(fileBr != fileBrTemp){
            this.$toast({
              message: '请选择速率相同的文件！!',
              position: 'middle',
              duration: 2000
            }); 
            setTimeout(function(){
              that.options.OffLinePushEnable = false;  
            },500)
            return;
          }
        }
        //devSn
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          this.$toast({
            message: '未选择背包!',
            position: 'middle',
            duration: 2000
          }); 
          setTimeout(function(){
            that.options.OffLinePushEnable = false;  
          },500)
          return;
        }
        //回传方式
        var type = this.options.back;
        if (+type < 1) {
          this.$toast({
            message: '未选择回传类型!',
            position: 'middle',
            duration: 2000
          }); 
          setTimeout(function(){
            that.options.OffLinePushEnable = false;  
          },500)
          return;
        }
        //recordIp
        var recordIp = '';
        if (type == '2') {
          recordIp = this.options.recordIp;
          if (recordIp == '-1') {
            this.$toast({
              message: '无可用录机!',
              position: 'middle',
              duration: 2000
            }); 
            setTimeout(function(){
              that.options.OffLinePushEnable = false;  
            },500)
            return;
          }
        }
        //回传文件数组
        var dataJson = {};
        dataJson.fileList = [];
        for (var i = 0; i < selFile.length; i++) {
          dataJson.fileList.push({
            dev_sn: devSN,
            fileName: selFile[i],
            transType: type,
            record_ip: recordIp
          });
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            setDevFileParam:JSON.stringify(dataJson),
          }),
          Api:"setDevFileParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.options.devFileUpFlag = 1;//文件列表
          }
        })
        .catch(function (error) {
          console.log(error)
        })
        //关闭参数里的传输开关 录制开关
        that.$global.setDevParamList(['dev_push_enable','record','FileCtrlFlag'],[0,0,1],'');
        //回传开启，显示传输状态
        //$('#updateFileIcon').addClass('disabledIcon');
      },
      //点击停止回传按钮
      clickBackStopBtn() {
        var that = this;
        //回传停止，隐藏传输状态
        this.options.fileTitle = '文件';
        this.show.refreshFileList = true;
        this.$global.setDeviceParam('FileCtrlFlag', 1, '');
        //devSn
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          this.$toast({
            message: '未选择背包!',
            position: 'middle',
            duration: 2000
          }); 
          return;
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            setDevFileStop: devSN,
          }),
          Api:"setDevFileStop",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.options.devFileUpFlag = 0;
            //刷新文件列表
            that.clickFileRefreshIcon();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //回传类型改变
      changeBackSel(){
        if (this.options.back == '1') {
          this.show.recordIp = false;
          //$('#devfile').css('height', 'calc(100% - 2.25em)');
        } else {
          this.show.recordIp = true;
          //$('#devfile').css('height', 'calc(100% - 3.4em)');
          this.getRecordIpList();
        }
      },
      //文件位置
      changeFilePos(){
        this.clickFileRefreshIcon();
      },
      //获取录机IP列表
      getRecordIpList(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getRecordIpList: true,
          }),
          Api:"getRecordIpList",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var options = [];
            for (var i = 0; i < res.data.length; i++) {
              options.push({
                value: res.data[i].record_ip,
                text: res.data[i].record_ip
              });
            }
            if (res.data.length == 0) {
              options.push({
                value: -1,
                text: '无录机'
              });
            }
            that.OPTIONS_RECORD_IP = options;
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
      //获取背包文件传输参数
      getDevFileParam() {
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          return;
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevFileParam: true,
            devSn: devSN,
          }),
          Api:"getDevFileParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if (res.data.length > 0) {
              if(res.data[0].transType == '0'){
                res.data[0].transType = 1;
              }
              that.options.back = res.data[0].transType;
              if (res.data[0].record_ip != '') {
                that.options.recordIp = res.data[0].record_ip; 
              }
              if (res.data[0].transType == '2') {
                that.show.recordIp = true;
              } else {
                that.show.recordIp = false;
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
      changeFileShow(){
        var that = this;
        /*this.show.fileListPop = true;*/
        this.fileList = [];
        this.getFileList();
        setTimeout(function() {
          if(!that.options.OffLinePushEnable){
            that.clickFileRefreshIcon();
          }
        }, 500);
        //录制中文件定时刷新
        if (localStorage.timer_devFile == "undefined") {
          localStorage.timer_devFile = setInterval(function() {
            that.updateDevFileAll();
          }, 1000);
        }
      },
      changeRecordingFileShow(){
        var that = this;
        /*this.show.recordingFileListPop = true;*/
        this.recordFileList = [];
        /*this.getRecordFileList();*/
        //录制中文件定时刷新
        localStorage.timer_recordDevFile = setInterval(function() {
          that.updateDevFileAll();
        }, 1000);
      },
      hideRecordFilePop(){
        this.show.recordingFileListPop=false;
        clearInterval(localStorage.timer_recordDevFile)
      },
      getFileList(){
        var that = this;
        var flagTimer = setInterval(function() {
          that.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'FileUpFlag', function(data) {
            if (data.FileUpFlag == '0' && flagTimer != undefined) {
              clearInterval(flagTimer);
              flagTimer = undefined;
              //更新文件列表
              that.getDevFileList(function(data) {
                that.fileList = data;
                if (!that.options.devFileUpFlag) {
                  that.show.refreshFileList = true;
                }
                that.show.offLinePush = true;
              });
            }else if(data.FileUpFlag == "1"){
              that.fileList = [];
            }
          });
        }, 500);
      },
      getDevFileList(callback){
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          if (typeof(callback) == 'function') {
            callback([]);
            return;
          }
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevFile: true,
            devSn: devSN,
          }),
          Api:"getDevFile",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = [];
            var type = that.options.filePos;
            if(type == 0){
              data = res.data.filter(function(item){
                return item.fileName.indexOf("/")==-1
              })  
            }else if(type == 1){
              data = res.data.filter(function(item){
                return item.fileName.indexOf("/")!=-1
              }).map(function(item){
                var arr = item.fileName.split("/");
                item.fileName = arr[arr.length-1];
                return item;
              })
            }
            if (typeof(callback) == 'function') {
              callback(data);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //更新全部背包文件，包括录制完成的和录制中的
      updateDevFileAll(){
        if (this.options.record) {//更新录制中的文件列表
          this.updateRecordFileList();
        } else {
          this.recordFileList = [];
        }
        if (this.options.devFileUpFlag == 1) {//更新正在回传的背包文件
          this.updateDevFileUpState();
        } else {
          this.options.fileTitle = '文件';
        }
      },
      //更新录制中的背包文件
      updateRecordFileList() {
        var that = this;
        this.getRecordingFileList(function(data) {
          that.recordFileList = data;
        });
      },
      //读取录制中的文件列表
      getRecordingFileList(callback) {
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          if (typeof(callback) == 'function') {
            callback([]);
            return;
          }
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            getDevFileRecording:true,
            devSn: devSN,
          }),
          Api:"getDevFileRecording",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if (typeof(callback) == 'function') {
              callback(res.data);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //更新背包回传文件状态
      updateDevFileUpState() {
        var that = this;
        this.getDevFileUpList(function(data) {
          if (data.length == 0) {
            return;
          }
          that.fileList = data;
          //总进度
          if (that.options.OffLinePushEnable) {
            that.options.fileTitle = '文件(' + data[0].FileTotalProgress + '%)';
          }
          //回传完成
          if (data[0].OffLinePushEnable == '0') {
            that.options.OffLinePushEnable = false;
            that.options.fileTitle = '文件'; 
            that.options.devFileUpFlag = 0;
            //刷新文件列表
            that.show.refreshFileList = true;
            that.clickFileRefreshIcon();
          }else{
            that.show.refreshFileList = false;//回传中不显示刷新按钮
          }
        });
      },
      //读取回传中的文件列表
      getDevFileUpList(callback) {
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          if (typeof(callback) == 'function') {
            callback([]);
            return;
          }
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:that.$qs.stringify({
            getDevFileBack:true,
            devSn: devSN,
          }),
          Api:"getDevFileBack",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if (typeof(callback) == 'function') {
              callback(res.data);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //点击背包文件刷新图标
      clickFileRefreshIcon() {
        if (this.show.refreshFileList==true) {
          this.$global.setDeviceParam('FileUpFlag', 1, '');
          this.show.refreshFileList = false;
          this.fileList = [];
          this.getFileList();
        }
      },
      //获取录制文件
      getRecordFileList(){
        var that = this;
        var devSN = this.ActiveDevice.dev_sn;
        if (!devSN || !this.$global.isValidSn(devSN)) {
          return;
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevFileRecording: true,
            devSn: devSN,
          }),
          Api:"getDevFileRecording",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.recordFileList = res.data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //纠错开关
      changeOpenfecMode(){
        var that = this;
        this.$global.setDeviceParam('OpenfecMode',that.options.OpenfecMode?'1':'0');
        if(that.options.OpenfecMode){
          this.show.OpenfecLevel = false;
        }else{
          this.show.OpenfecLevel = false;
        }
      },
      //4000的互动
      showDevSrt(showInteract){
        var bShow = false;
        var rcvSn = this.ActiveDevice.rcv_sn;
        var rcvMode =this.$global.getRcvMode(rcvSn.substr(-4));
        if(rcvMode == 'DV4004R' || rcvMode == 'CM-IR6000T' || rcvMode == 'DV4013R'){
          bShow = true;
        }
        if(bShow){
          if(showInteract==1){
            this.show.act4000 = true;
            this.getSrtTransPortList();
          }else{
            this.show.act4000 = false;
          }
        } else {
          this.show.act4000 = false;
        }
      },
      //互动模式
      changeInteractiveMode(){
        var that = this;
        var text = '切换模式时背包需要重启，确认切换?';
        this.$messagebox.confirm(text).then(
          action => {
            if(that.options.InteractiveMode){
              that.$global.setDeviceParam('InteractiveMode', 1);  
              that.devFileShow = false;
            }else{
              that.$global.setDeviceParam('InteractiveMode', 0);  
              that.devFileShow = true;
            }
          },
          action => {
            if(that.options.InteractiveMode){
              that.options.InteractiveMode = false;
            }else{
              that.options.InteractiveMode = true;
            }
            if(that.options.InteractiveMode){
              that.$global.setDeviceParam('InteractiveMode', 1);  
              that.devFileShow = false;
            }else{
              that.$global.setDeviceParam('InteractiveMode', 0);  
              that.devFileShow = true;
            }
          },
        );
      },
      //互动开关
      changeSrtSwitch(){
        if (this.options.SrtSwitch) {
          this.$global.setDeviceParam('SrtSwitch', 1);
        } else {
          this.$global.setDeviceParam('SrtSwitch', 0);
        }
      },
      //音频切换
      changeSrtAudioIdx(){
        var that = this;
        this.$global.setDeviceParam('SrtAudioIdx',that.options.SrtAudioIdx)
      },
      //全屏
      changeSrtFullSwitch(){
        if (this.options.SrtFullSwitch) {
          /*this.show.OpenfecLevel = false;*/
          this.$global.setDeviceParam('SrtFullSwitch', 1);
        } else {
          /*this.show.OpenfecLevel = false;*/
          this.$global.setDeviceParam('SrtFullSwitch', 0);
        }
      },
      //获取在线网卡
      getSrtTransPortList(){
        var devSN = this.ActiveDevice.dev_sn;
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevCardParam: true,
            devSN: devSN,
          }),
          Api:"getSrtTransPortParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data[0];
            var G5Flag = false;
            //传输通道
            var jIndex = 0;
            var options = [];
            for (var i = 0; i < data.length; i++) {//传输通道，定时刷新获取在线的网卡
              options[jIndex]={};
              if(data[i]["card_id"].indexOf("lte")!=-1 || data[i]["card_id"]=="eth0"){
                if(data[i]["online"] != "0"){
                  options[jIndex]['text'] = "在线:"+data[i]["card_name"];    
                }else{
                  options[jIndex]['text'] = data[i]["card_name"];    
                }
                var transportValue = "";
                switch (data[i]["card_id"]){
                  case "eth0":
                    transportValue = 0;
                    break;
                  case "lte1":
                    transportValue = 2;
                    break;
                  case "lte2":
                    transportValue = 3;
                    break;
                  case "lte3":
                    transportValue = 4;
                    break;
                  case "lte4":
                    transportValue = 5;
                    break;
                  case "lte5":
                    transportValue = 6;
                    break;
                  case "lte6":
                    transportValue = 7;
                    break;
                  default:
                    transportValue = '';
                    break;
                }
                options[jIndex]['value'] = transportValue;
                jIndex++;
              }
            }
            that.OPTIONS_SRT_TRANSPORT_PARAMS = options;
            that.getSrtTransPortParam(devSN);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //获取传输通道参数
      getSrtTransPortParam(devSN){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevParam: true,
            devSN: devSN,
          }),
          Api:"getDevSrtTransPort",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.options.SrtTransIf = res.data[0]['SrtTransIf'];   //传输通道    
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //音频模式
      changeAudioMode(){
        var that = this;
        this.$global.setDeviceParam('AudioMode', that.options.AudioMode);
      }, 
    }
  }
</script>

<style scoped>
    .settings{
        margin-top: 60px;
        background-color: #212227;
        height: 84%;
        padding-bottom: 62px;
        overflow-y: auto;
    }
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
        /*border-radius: 5px;*/
        font-size: .15rem;
        font-weight:500;
        color: #B7B7B7;
    }
    .Group .GroupItem:last-child{
        border-bottom: 0;
    }
    .GroupItem{
        padding: .05rem .2rem;
        border-bottom: 1px solid #333;
    }
    .GroupItemField{
        overflow: hidden;
        /*margin-bottom: .1rem;*/
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
    .lan,.wan{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        background-color: #EEE;
        color: #000;
    }
    .lan{
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .wan{
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }
    .btnSelect{
        background-color: #3d81f1;
        color: #FFFFFF;
    }
    .ItemSelect{
        width: 1.8rem;
        height: .26rem;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        font-size: .12rem;
    }
    .ItemInput{
      width: 1.8rem;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .13rem;
      padding: 0px;
      background-color:#2b2e33;
      color:#fff;
    }
    .x2Ipt{
        width: 1.2rem;
        height: .24rem;
        border-radius: 5px;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        font-size: .12rem;
    }
    .x1Ipt{
        width: .6rem;
        height: .24rem;
        border-radius: 5px;
        margin-left: .1rem;
        border: 1px solid #3d81f1;
        outline: none;
        box-shadow: none;
        font-size: .12rem;
    }
    .x2Btn{
        width: 1.25rem;
        height: .24rem;
        border-radius: 5px;
        border: none;
        outline: none;
        box-shadow: none;
        background-color: #3d81f1;
        color: #FFFFFF;
        font-size: .14rem;
    }
    .x1Btn{
        width: .64rem;
        height: .24rem;
        border-radius: 5px;
        margin-left: .08rem;
        border: none;
        outline: none;
        box-shadow: none;
        background-color: #3d81f1;
        color: #FFFFFF;
        font-size: .14rem;
    }
    .Group:nth-last-of-type(1){
        margin-bottom: .2rem;
    }
    .mint-switch{
        transform: scale(.7);
        transform-origin:left;
    }
    .ItemBtn{
      width:auto;
      height: .26rem;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .12rem; 
    }
</style>
<style>
    .settings .mint-cell{
        background-color: transparent;
        background-image: none !important;
        display: inline-block;
        min-height: auto;
    }
    .settings .mint-cell-wrapper{
        background-image: none;
        color: #EEEEEE;
        padding-left:0px;
    }
    .settings .mint-radiolist-title{
        margin:0px;
    }
    .settings .mint-radio-label{
        font-size:.12rem;
    }
    .settings .mint-radiolist-label{
        padding-left:0px;
    }
    .mint-field.is-textarea{
      width:100%;
    }
    .wholePagePop{
      background-color:#000 !important;
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
</style>