var DEV_MODE = [{sn: 2140,name: 'DV4000T'}, 
                {sn: 2142,name: 'DV3000T'}, 
                {sn: 2146,name: 'DV1080'}, 
                {sn: 2147,name: 'DV406'}, 
                {sn: 2148,name: 'CM-T5G 2000'}, 
                {sn: 2150,name: 'QUK100'}, 
                {sn: 2151,name: 'CM-T5G 3000'}, 
                {sn: 7189,name: 'DV1080P'}, 
                {sn: 7207,name: 'ICBT-201'}, 
                {sn: 2153,name: 'DV5000T'}, 
                {sn: 2155,name: 'CM-T5G 1000'},
                {sn: "",name: 'MH5000-31'}, //华为5G
                {sn: "",name: 'EC200T'},    //高通4G
                {sn: "",name: 'RG500QEA'}   //高通5G
              ];
var RCV_MODE = [{sn: 2141,name: 'DV4000R'}, 
                {sn: 2143,name: 'DV4001R'}, 
                {sn: 2144,name: 'DV4002R'}, 
                {sn: 2145,name: 'DV4008R'}, 
                {sn: 2147,name: 'DV4000PCIE'}, 
                {sn: 2999,name: 'DV4000RV'}, 
                {sn: 2149,name: 'CM-IR5000T'}, 
                {sn: 7188,name: 'DV4004R'},
                {sn: 7192,name: 'CM-IR5500T'}, 
                {sn: 2152,name: 'CM-IR6000T'}, 
                {sn: 2154,name: 'DV1080R'}, 
                {sn: 2156,name: 'DV1080R+'}];
window.xSplit = 300;

window.DEBUG_USER = 'debug';//debug用户
window.ADMIN = '1'; //管理员用户组
window.ADVANCE = '2'; //高级用户组
window.NORMAL = '3'; //普通用户组
window.PREFIX = '001'; //德力前缀
window.SUPER = '001-admin'; //超级管理员
window.GREEN = '#2de505';
window.RED = '#FF4D52';
window.ORANGE = '#ff9945';
window.BLUE = '#45ffe9';
window.WHITE = '#ffffff';
window.DEPTH_MAX = 4;
window.MBPS_MAX = 8;
window.MBPS_MAX2 = 80;
window.MBPS_MIN = 0.5;
window.DStreamer_BUILD = "http://www.uhdxpress.com/";//4000运营平台
window.DStreamer_SERVE = "http://111.160.79.84:8088";//测试平台
//window.DStreamer_BUILD = "http://4000.uhdxpress.com:8088/";//4000一级域名:117.131.178.104:8088
//window.DStreamer_BUILD = "http://117.131.178.104:8088/";//4000一级域名:117.131.178.104:8088
//window.DStreamer_SERVE = "http://192.168.100.110:8088/";//4000二级域名
window.HDXPRESS_BUILD = "http://www.hdxpress.cn";//1080一级域名  47.104.164.249
window.HDXPRESS_SERVE = "http://1080.hdxpress.cn:8088/";//1080二级域名，对应地址：47.104.161.61
window.UHDXPRESS_BUILD = "http://4000.uhdxpress.com";//4000一级域名
//window.UHDXPRESS_SERVE = "http://192.168.100.110:8088/";//4000二级域名
window.UHDXPRESS_SERVE = "http://139.129.91.106/";//4000二级域名
window.VIR_RCV = '2999'; //虚拟接收机
window.PRA_RCV = '2141'; //实体接收机
window.R1080_RCV = '2154'; //1080R

window.colorGV = {
    '发送速率':'#FFFF00',
    '接收速率': '#22aadd',
    '可变码率': '#73d13d',
    '传输丢包': '#f1a1ff',
    '业务丢包': '#f5222d',
    '信号输入': '#f5a122',
    'SRT拉流': '#68F55F',

    'SIM1↑':'#fa8c16',
    'SIM1↓':'#ffc069',
    'SIM1传输丢包':'#ffe7ba',
    'SIM1业务丢包':'#ffa940',

    'SIM2↑':'#a0d911',
    'SIM2↓':'#7cb305',
    'SIM2传输丢包':'#f4ffb8',
    'SIM2业务丢包':'#bae637',

    'SIM3↑':'#1890ff',
    'SIM3↓':'#096dd9',
    'SIM3传输丢包':'#bae7ff',
    'SIM3业务丢包':'#40a9ff',

    'SIM4↑':'#eb2f96',
    'SIM4↓':'#c41d7f',
    'SIM4传输丢包':'#ffd6e7',
    'SIM4业务丢包':'#f759ab',

    'SIM5↑':'#fa541c',
    'SIM5↓':'#d4380d',
    'SIM5传输丢包':'#ffd8bf',
    'SIM5业务丢包':'#ff7a45',

    'SIM6↑':'#fadb14',
    'SIM6↓':'#d4b106',
    'SIM6传输丢包':'#ffffb8',
    'SIM6业务丢包':'#ffec3d',

    'ETH0↑':'#13c2c2',
    'ETH0↓':'#08979c',
    'ETH0传输丢包':'#b5f5ec',
    'ETH0业务丢包':'#36cfc9',

    'USB-5G1↑':'#722ed1',
    'USB-5G1↓':'#531dab',
    'USB-5G1传输丢包':'#efdbff',
    'USB-5G1业务丢包':'#9254de',

    'USB-5G2↑':'#f5222d',
    'USB-5G2↓':'#cf1322',
    'USB-5G2传输丢包':'#ffccc7',
    'USB-5G2业务丢包':'#ff4d4f',

    'USB-LAN↑':'#faad14',
    'USB-LAN↓':'#d48806',
    'USB-LAN传输丢包':'#fff1b8',
    'USB-LAN业务丢包':'#ffc53d',

    'USB-LAN2↑':'#52c41a',
    'USB-LAN2↓':'#389e0d',
    'USB-LAN2传输丢包':'#d9f7be',
    'USB-LAN2业务丢包':'#73d13d',

    'WIFI↑':'#2f54eb',
    'WIFI↓':'#1d39c4',
    'WIFI传输丢包':'#d6e4ff',
    'WIFI业务丢包':'#597ef7'
};
window.colorObj = {
    "发送速率":'totalUp', "接收速率":'totalDown',"可变码率":'totalAVBR',
    "传输丢包":'TotalLossDev', "业务丢包":'TotalLossRcv',"SRT拉流":'TotalSRT',
    "SIM1↑":'SIM1Up',"SIM1↓":'SIM1Down',"SIM1传输丢包":'SIM1LossDev',"SIM1业务丢包":'SIM1LossRcv',
    "SIM2↑":'SIM2Up',"SIM2↓":'SIM2Down',"SIM2传输丢包":'SIM2LossDev',"SIM2业务丢包":'SIM2LossRcv',
    "SIM3↑":'SIM3Up',"SIM3↓":'SIM3Down',"SIM3传输丢包":'SIM3LossDev',"SIM3业务丢包":'SIM3LossRcv',
    "SIM4↑":'SIM4Up',"SIM4↓":'SIM4Down',"SIM4传输丢包":'SIM4LossDev',"SIM4业务丢包":'SIM4LossRcv',
    "SIM5↑":'SIM5Up',"SIM5↓":'SIM5Down',"SIM5传输丢包":'SIM5LossDev',"SIM5业务丢包":'SIM5LossRcv',
    "SIM6↑":'SIM6Up',"SIM6↓":'SIM6Down',"SIM6传输丢包":'SIM6LossDev',"SIM6业务丢包":'SIM6LossRcv',
    "ETH0↑":'ETH0Up',"ETH0↓":'ETH0Down',"ETH0传输丢包":'ETH0LossDev',"ETH0业务丢包":'ETH0LossRcv',
    "WIFI↑":'WIFIUp',"WIFI↓":'WIFIDown',"WIFI传输丢包":'WIFILossDev',"WIFI业务丢包":'WIFILossRcv',
    "USB-5G1↑":'USB5G1Up',  "USB-5G1↓":'USB5G1Down',  "USB-5G1传输丢包":'USB5G1LossDev',  "USB-5G1业务丢包":'USB5G1LossRcv',
    "USB-5G2↑":'USB5G2Up',  "USB-5G2↓":'USB5G2Down',  "USB-5G2传输丢包":'USB5G2LossDev',  "USB-5G2业务丢包":'USB5G2LossRcv',
    "USB-LAN↑":'USBLANUp',  "USB-LAN↓":'USBLANDown',  "USB-LAN传输丢包":'USBLANLossDev',  "USB-LAN业务丢包":'USBLANLossRcv',
    "USB-LAN2↑":'USBLAN2Up',"USB-LAN2↓":'USBLAN2Down',"USB-LAN2传输丢包":'USBLAN2LossDev',"USB-LAN2业务丢包":'USBLAN2LossRcv'
};
import { Toast } from 'mint-ui';
import { MessageBox } from 'mint-ui';
import qs from 'qs';
import store from '../store'
import axios from '../api/axios.init'
import $ from 'jquery';
//import { mapState, mapMutations } from 'vuex';
export default {
  //项目公共方法或常量
  //代码中使用 this.$global.xxx 来访问方法或常量
  OPTIONS_HIS_CHART_4000 : [{text: "概览",value: "total"},
                            {text: "SIM1",value: "lte1"},
                            {text: "SIM2",value: "lte2"},
                            {text: "SIM3",value: "lte3"},
                            {text: "SIM4",value: "lte4"},
                            {text: "SIM5",value: "lte5"},
                            {text: "SIM6",value: "lte6"}],
  OPTIONS_HIS_CHART_1080 : [{text: "概览",value: "total"},
                            {text: "SIM1",value: "lte1"},
                            {text: "SIM2",value: "lte2"},
                            {text: "SIM3",value: "lte3"}],
  //DV4000 参数---start
  OPTIONS_VIDEOENCODE_4000 : [{value: "0",text: "H.265 Main(4:2:0/8bit)"}, 
                              {value: "1",text: "H.265 Main(4:2:0/10bit)"}, 
                              {value: "2",text: "H.265 Main(4:2:2/8bit)"}, 
                              {value: "3",text: "H.265 Main(4:2:2/10bit)"}, 
                              {value: "4",text: "H.264"}],
  OPTIONS_VIDEOENCODE_1080 : [{value: "0",text: "H.264"}],
  OPTIONS_VIDEOENCODE_5000 : [{value: "0",text: "HEVC"}, 
                              {value: "1",text: "AVC"}, 
                              {value: "2",text: "MPEG"}],
  OPTIONS_VIDEOENCODE_3000 : [{value: "0",text: "H.265 Main(4:2:0/8bit)"},
                              {value: "1",text: "H.265 Main(4:2:0/10bit)"},
                              {value: "4",text: "H.264"}],                 
  OPTIONS_BITRATEMODE : [{value: "0",text: "CBR"}, 
                          {value: "1",text: "AVBR"}],
  OPTIONS_BITRATEMODE_1080 : [{value: "0",text: "固定码率"}, 
                              {value: "1",text: "可变码率"}],
  OPTIONS_BITRATEMODE2 : [{value: "0",text: "CBR"}],
  OPTIONS_HDR_4000 : [{text: "SDR",value: "0"}, 
                {text: "HLG",value: "1"}],
  OPTIONS_HDR_1080 : [{text: "SDR",value: "0"}],
  OPTIONS_LATENCY : [{text: "标准时延",value: "0"}, 
                    {text: "超低时延",value: "1"}],
  OPTIONS_LATENCY2 : [{text: "标准时延",value: "0"}],
  OPTIONS_LATENCY_5000 :[{text: "高画质",value: "0"},
                        {text: "低延时",value: "1"}, 
                        {text: "超低延时",value: "2"}],
  OPTIONS_LATENCY2_5000 : [{text: "低时延",value: "1"}],
  OPTIONS_VIDEOINPUT : [{value: "0",text: "12G-SDI"}, 
                        {value: "1",text: "4x3G SQ"}, 
                        {value: "2",text: "4x3G 2SI"}, 
                        {value: "3",text: "3G-SDI[1]"}, 
                        {value: "4",text: "HDMI"}],
  OPTIONS_VIDEOINPUT_PCIE_4000 : [{value: "0",text: "12G-SDI"}, 
                                  {value: "1",text: "4x3G SQ"}, 
                                  {value: "2",text: "4x3G 2SI"}, 
                                  {value: "4",text: "HDMI"}],
  OPTIONS_VIDEOINPUT_4000 : [{value: "0",text: "12G-SDI"}, 
                            {value: "1",text: "4x3G SQ"}, 
                            {value: "2",text: "4x3G 2SI"}, 
                            {value: "3",text: "3G-SDI[1]"}, 
                            {value: "4",text: "HDMI"}],
  OPTIONS_VIDEOINPUT_3000 : [{value: "3",text: "3G-SDI[1]"}, 
                        {value: "4",text: "HDMI"}],
  OPTIONS_VIDEOINPUT_1080 : [{value: "0",text: "3G-SDI"}, 
                            {value: "1",text: "HDMI"}],
  OPTIONS_VIDEOINPUT_406 : [{value: "0",text: "SDI"}],
  //5000单路编码视频输入接口
  OPTIONS_S_VIDEOINPUT_5000 : [{value: "0",text: "12G-SDI"}, 
                              {value: "1",text: "4x3G SQ"}, 
                              {value: "2",text: "4x3G 2SI"}, 
                              {value: "3",text: "HDMI"}],
  //5000多路编码视频输入接口CH1
  OPTIONS_M_VIDEOINPUT_5000_CH1 : [{value: "0",text: " SDI1"},
                                  {value: "4",text: "HDMI"}],
  //5000多路编码视频输入接口CH2
  OPTIONS_M_VIDEOINPUT_5000_CH2 : [{value: "1",text: " SDI2"}],
  //5000多路编码视频输入接口CH3
  OPTIONS_M_VIDEOINPUT_5000_CH3 : [{value: "2",text: "SDI3"}],
  //5000多路编码视频输入接口CH4
  OPTIONS_M_VIDEOINPUT_5000_CH4 : [{value: "3",text: "SDI4"}],
  OPTIONS_AUDIO_ENCODE_1080 : [{text: "AAC",value: "0"}],
  OPTIONS_AUDIO_ENCODE_4000 : [{text: "AAC",value: "0"}],
  OPTIONS_AUDIO_ENCODE2_4000 : [{text: "AAC",value: "0"}],
  OPTIONS_AUDIO_ENCODE_5000 : [{text: "BYPASS",value: "0"}, 
                              {text: "LPCM",value: "1"}, 
                              {text: "AAC",value: "2"}, 
                              {text: "MPEG1L2",value: "3"}],
  OPTIONS_AUDIOINPUT_1080 : [{value: "1",text: "2-CH"}],
  OPTIONS_AUDIOINPUT_4000 : [{value: "0",text: "0-CH"}, 
                        {value: "1",text: "2-CH"}, 
                        {value: "2",text: "4-CH"}],
  OPTIONS_AUDIOINPUT_HDMI264 : [{value: "1",text: "2-CH"}],
  OPTIONS_HDMI_FORMAT_4000 : [{text: "自动",value: "0"}, 
                              {text: "1920x1080p29.97",value: "1"}, 
                              {text: "1920x1080p59.94",value: "2"}, 
                              {text: "1920x1080p50",value: "3"}, 
                              {text: "1920x1080p25",value: "4"}, 
                              {text: "1920x1080i59.94",value: "5"}, 
                              {text: "1920x1080i50",value: "6"}, 
                              {text: "1280x720p59.94",value: "7"}, 
                              {text: "1280x720p50",value: "8"}, 
                              {text: "720x576p50",value: "11"}, 
                              {text: "720x480p59.94",value: "12"}],

  OPTIONS_HDMI_FORMAT_1080 : [{text: "1920x1080p30",value: "1"},
                              {text: "1920x1080p60",value: "2"}, 
                              {text: "1920x1080p50",value: "3"}, 
                              {text: "1920x1080p25",value: "4"}, 
                              {text: "1920x1080i60",value: "5"}, 
                              {text: "1920x1080i50",value: "6"}, 
                              {text: "1280x720p60",value: "7"}, 
                              {text: "1280x720p50",value: "8"}, 
                              {text: "1280x720p30",value: "9"}, 
                              {text: "1280x720p25",value: "10"}, 
                              {text: "720x576p50",value: "11"}, 
                              {text: "720x480p60",value: "12"}],                              
  OPTIONS_AUDIO_BR : [{text: "256kbps",value: "256"}, 
                      {text: "128kbps",value: "128"},
                      {text: "64kbps",value: "64"}],
  //接收机
  OPTIONS_PUSH_RESULUTION : [{text: "1080p50",value: "1080"}, 
                            {text: "720p50",value: "720"}, 
                            {text: "576p50",value: "576"}, 
                            {text: "1080p60",value: "0"}, 
                            {text: "1080p30",value: "1"}, 
                            {text: "1080p25",value: "2"}, 
                            {text: "720p60", value: "3"}],
  OPTIONS_SDI_RESULUTION : [{text: "2160p-2SI",value: "0"}, 
                            {text: "2160p-SQ",value: "1"}, 
                            {text: "12G",value: "5"}, 
                            {text: "1080p",value: "2"}, 
                            {text: "1080i",value: "3"}, 
                            {text: "720p",value: "4"}],
  OPTIONS_FRAMERATE_6 : [{text: "60",value: "0"}, 
                        {text: "59.94",value: "1"}, 
                        {text: "50",value: "2"}, 
                        {text: "30",value: "3"}, 
                        {text: "29.97",value: "4"}, 
                        {text: "25",value: "5"}],
  OPTIONS_HDMI_RESULUTION : [{text: "2160p",value: "1"}, 
                            {text: "1080p",value: "0"}, 
                            {text: "1080i",value: "2"}, 
                            {text: "720p",value: "3"}],
  //接收机板卡相关参数--start
  OPTION_TRANSMODE:[{text: "SRT (Caller)",value: "SRT SEND"},
                    {text: "SRT (Listener)",value: "SRT SERVER"},
                    {text: "UDPLIVE",value: "UDPLIVE"}],
  OPTION_ENCINPUT : [{text: "SDI",value: "SDI"},
                    {text: "HDMI",value: "HDMI"}],
  OPTION_ENCVCODEC : [{text: "H.264",value: "H.264"}],
  OPTION_ENCFORMAT : [{text: "1920x1080p60",value: "1920x1080p60"},
                      {text: "1920x1080p50",value: "1920x1080p50"},
                      {text: "1920x1080p30",value: "1920x1080p30"},
                      {text: "1920x1080p25",value: "1920x1080p25"},
                      {text: "1280x720p50",value: "1280x720p50"},
                      {text: "1280x720p30",value: "1280x720p30"},
                      {text: "1280x720p25",value: "1280x720p25"},
                      {text: "720x576p50",value: "720x576p50"},
                      {text: "720x480p60",value: "720x480p60"}],
  OPTION_ENCACODEC : [{text: "AAC",value: "AAC"}],
  OPTION_ENCACHS : [{text: "2",value: "2"}],
  OPTION_ENCABR : [{text: "256kbps",value: "256kbps"},
                  {text: "128kbps",value: "128kbps"},
                  {text: "64kbps",value: "64kbps"}],
  OPTIONS_URL_V_ENC : [{text: "H.264",value: "0"}],
  OPTIONS_URL_A_ENC : [{text: "AAC",value: "0"}],
  //接收机板卡相关参数--end
  /*录机路径*/
  OPTIONS_RECORD_PATH : [{text: "USB",value: "0"}, 
                        {text: "NAS",value: "1"}],
  //DV4000 参数---end
  OPTIONS_PBKEYLEN : [{text: "32",value: "32"}, 
                      {text: "16",value: "16"}],
  OPTIONS_RCV_TYPE:[{label: "虚拟服务器", value: "0"}, 
                    {label: "实体接收机", value: "1"}],
  //网卡id转枚举类型
  SRT_TRANS_IF : {"eth0":0, "wifi":1, "lte1":2, "lte2":3, "lte3":4, "lte4":5, 
                  "lte5":6, "lte6":7, "usb-lan":8, "usb-5g1":9, "usb-5g2":10},
  SRT_TRANS_IF2 : ["eth0","wifi","lte1","lte2","lte3","lte4",
                    "lte5","lte6","usb-lan","usb-5g1","usb-5g2"],
  ACT_LATENCY_MIN : 50,
  ACT_LATENCY_MAX : 3000,
  cardIdArr_1080 : ['eth0', 'lte1', 'lte2', 'lte3', 'usb-lan', 'usb-5g1', 'usb-5g2', 'wifi'],
  cardIdArr_4000 : ['eth0', 'lte1', 'lte2', 'lte3', 'lte4', 'lte5', 'lte6', 'usb-lan', 'usb-5g1', 'usb-5g2', 'wifi'],
  BITRATE_MIN_1080 : 0.5, //Mbps   数据库里的dev_sr
  BITRATE_MAX_1080 : 20,
  BITRATE_MIN_4000 : 0.5, //Mbps   数据库里的dev_sr
  BITRATE_MIN2_4000 : 8, //Mbps   超级时延，视频
  BITRATE_MAX_4000 : 100,
  BITRATE_MAX2_4000 : 40,
  BITRATE_MAX3_4000 : 20,
  BITRATE_MIN_5000 : 0.1, //Mbps   数据库里的video_bitrate
  BITRATE_MAX_5000 : 200,//单路0.1-200
  BITRATE_MAX2_5000 : 20,//多路编码视频比特率0.1-20
  DELAY_MIN_4000 : 0.1, //s
  DELAY_MIN_1080 : 0.5, //s
  DELAY_MAX1 : 20,  //视频比特率<=40M
  DELAY_MAX2 : 10, //视频比特率>40M
  getCurrentTime() {
    var date = new Date();
    var year = '' + date.getFullYear();
    var month = '' + (date.getMonth() + 1);
    var day = '' + date.getDate();
    var hours = '' + date.getHours();
    var minutes = '' + date.getMinutes();
    var seconds = date.getSeconds();
    if (month.length === 1) {
        month = '0' + month;
    }
    if (day.length === 1) {
        day = '0' + day;
    }
    if (hours.length === 1) {
        hours = '0' + hours;
    }
    if (minutes.length === 1) {
        minutes = '0' + minutes;
    }
    if (seconds.length === 1) {
        seconds = '0' + seconds;
    }
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
  },
  //数组合并去重
  MergeArray(arr1, arr2) {
    var _arr = new Array();
    for (var i = 0; i < arr1.length; i++) {
      _arr.push(arr1[i]);
    }
    for (var i = 0; i < arr2.length; i++) {
      var flag = true;
      for (var j = 0; j < arr1.length; j++) {
        if (arr2[i] == arr1[j]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        _arr.push(arr2[i]);
      }
    }
    return _arr;
  },
  //获取设备类型
  getDevMode(sn) {
    var res = false;
    for (var i = 0; i < DEV_MODE.length; i++) {
      if (sn == DEV_MODE[i].sn) {
        res = DEV_MODE[i].name;
        break;
      }
    }
    return res;
  },
  getRcvMode(sn){
    var res = false;
    for (var i = 0; i < RCV_MODE.length; i++) {
      if (sn == RCV_MODE[i].sn) {
        res = RCV_MODE[i].name;
        break;
      }
    }
    return res;
  },
  //获取接收机列表
  getRcvList(cb) {
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getAllRcvName:'rcv',
        userId:store.state.user.id,
        userGroup:store.state.user.userGroup,
        prefix:store.state.user.prefix
      }),
      Api:"getAllRcvName",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        var data = res.data;
        if(data){
          cb(data);
        }
      }else{
        Toast({
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
  /*getRcvList(row, cb) {
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getAllRcvName:'rcv',
        userId:store.state.user.id,
        userGroup:store.state.user.userGroup,
        prefix:store.state.user.prefix
      }),
      Api:"getAllRcvName",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        var data = res.data;
        var result = [];
        if (data.length == 0) {
          result.push({
            value: row.rcv_sn,
            text: row.rcv_name
          });
        }else{
          var bFind = false;
          for (var k = 0; k < data.length; k++) {
            if (data[k].rcv_sn == row.rcv_sn) {
              bFind = true;
              break;
            }
          }
          if (!bFind) {
            result.push({
              value: row.rcv_sn?row.rcv_sn:"",
              text: row.rcv_name?row.rcv_name:""
            });
          }
          for(var key in data){
            result.push({
              value: data[key].rcv_sn,
              text: data[key].rcv_name,
              color: data[key].color=="#ffffff"?"#000000":data[key].color
            });
          }
        }
        cb(result);
      }else{
        Toast({
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
  //获取接收机列表--4000
  getRcvList4000(cb) {
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getAllRcvName:'rcv',
        userId:store.state.user.id,
        userGroup:store.state.user.userGroup,
        prefix:store.state.user.prefix
      }),
      Api:"getAllRcvName",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb(res.data);
        }
      }else{
        Toast({
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
  //根据接收机sn查找空闲板卡
  getUnusedBoard(rcvSn,curBoard,cb) {
    //获取可用板卡列表
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getUnusedBoard:true,
        rcv_sn:rcvSn,
        userId:store.state.user.id,
        userGroup:store.state.user.userGroup
      }),
      Api:"getUnusedBoard",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        var data = res.data;
        var result = [];
        if(cb){
          cb(rcvSn,curBoard,data);
        }
      }else{
        Toast({
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
  //获取背包的推流状态
  getDevPushStatus(devSn, cb) {
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getDevPushStatus:devSn
      }),
      Api:"getDevPushStatus",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        var data = res.data;
        var result = [];
        if(cb){
          cb(data);
        }
      }else{
        Toast({
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
  //切换绑定
  editMatch(rcv, board, dev_sn, dev_name, prefix, user_id, cb) {
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        editMatchByDevSn:true,
        dev_sn: dev_sn,
        devName: dev_name,
        new_rcv_sn: rcv,
        new_board_id: board,
        prefix : prefix,
        user_id : user_id,
      }),
      Api:"editMatchByDevSn",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        //虚拟
        if(rcv.substr(-4) == VIR_RCV){
          //添加板卡
          axios({
            method: 'post',
            url:"/page/index/indexData.php",
            data:qs.stringify({
              addBoard:true,
              dev_sn:dev_sn,
              rcvSn:rcv
            }),
            Api:"addBoard",
            AppId:"android",
            UserId:store.state.user.id
          })
          .then(function (response) {
            let res = response.data;
            if(res.res.success){
              Toast({
                message: "绑定成功",
                position: 'middle',
                duration: 2000
              });
            }else{
              Toast({
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
        //that.setDevParamList(['param_lock','dev_push_enable'],[1,0],'');//切换配对时关闭推流开关
        Toast({
          message: "绑定成功",
          position: 'middle',
          duration: 2000
        });
        //chars数据删除--start
        var bindChart = "";
        if (rcv.substr(-4) == VIR_RCV) {
          bindChart = dev_sn + "/" + rcv + "/" + dev_sn;
        } else {
          bindChart = dev_sn + "/" + rcv + "/" + board;
        }
        that.initChartSessionData(bindChart, "save");
        if(cb){
          cb();
        }
        //chars数据删除--end
      }else{
        Toast({
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
  initChartSessionData(bindChart, editType) {
    //先把相同devsn的数据删除掉，然后新增
    var devSn = bindChart.split("/")[0];
    var allData = JSON.parse(localStorage.getItem("allChartData"));
    var keyArr = JSON.parse(localStorage.getItem("chartKey"));
    for (let key in allData) {
      if (key.indexOf(devSn) != -1) {
        delete allData[key];
        keyArr.splice(keyArr.indexOf(key), 1);
        break;
      }
    }
    if (editType == "del") {
      localStorage.curChart = devSn + "//";
    } else {
      localStorage.curChart = bindChart;
    }
    localStorage.removeItem('allChartData');
    localStorage.removeItem('chartKey');
    localStorage.setItem('allChartData',JSON.stringify(allData)); 
    localStorage.setItem('chartKey',JSON.stringify(keyArr)); 
    localStorage.autoYaxis = "true";
    localStorage.maxYaxis = "";
    localStorage.intervalYaxis = "";
  },
  //判断是否是有效邮箱
  isValidMail(address) {
    if (address != "") {
      var regInvalid = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
      var regValid = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;
      return (!regInvalid.test(address) && regValid.test(address));
    } else {
      return true;
    }
  },
  //获取推流地址相关信息
  getPushUrls(cb){
    var rcvSn = store.state.ActiveDevice.rcv_sn;
    var devSN = store.state.ActiveDevice.dev_sn;
    var boardId = store.state.ActiveDevice.board_id+"";
    if(!this.isValidRcvSn(rcvSn) && this.isValidSn(devSN)){ //背包无配对
      rcvSn = -1;
      boardId = devSN;
    }
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getBoardUrl:true,
        rcvSn: store.state.ActiveDevice.rcv_sn,
        boardId: boardId,
        devSN: store.state.ActiveDevice.dev_sn
      }),
      Api:"getBoardUrl",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data
      if(res.res.success){
        if(cb){
          cb(res.data);
        }
      }/*else{
        that.address = [];
      }*/
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //获取所有的前缀
  getUserPrefixArr(cb) {
    var that = this;
    axios({
      method: 'post',
      url:"/page/userPrefix/userPrefix.php",
      data:qs.stringify({
        allPrefixs:true
      }),
      Api:"allPrefixs",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data
      if(res.res.success){
        var data = res.data;
        if (cb) {
          cb(data);
        }
      }else{
        Toast({
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
  //获取背包参数范围
  getDevParamRange(devSn, prefix, param, extraParam) {
    var that = this;
    var sn = devSn.substr(-4);
    var devMode = that.getDevMode(sn);
    var devSeries = this.getDevSeries(devSn);
    var res = [];
    if(devMode === 'CM-T5G 1000'){
      devMode = 'DV3000T';
    }
    if (param == 'video_encode') {//视频编码
      if (devMode === 'DV5000T') {
        res = that.OPTIONS_VIDEOENCODE_5000;
      }else if(devMode === 'DV3000T'){
        res = that.OPTIONS_VIDEOENCODE_3000;
      }else{
        res = (devSeries=="1080")?that.OPTIONS_VIDEOENCODE_1080:that.OPTIONS_VIDEOENCODE_4000;
      }
    }
    else if (param === 'bitrate_mode') {
      if(devSeries === "1080"){
        res = that.OPTIONS_BITRATEMODE_1080;  
      }else{
        res = that.OPTIONS_BITRATEMODE;
      }
    }
    else if (param == 'hdr') {
      if (devMode == 'DV3000T') {
        res = that.OPTIONS_HDR_1080;
      } else {
        res = that.OPTIONS_HDR_4000;
      }
    }
    else if (param == 'latency') {
      if (devMode === 'DV5000T') {
        res = that.OPTIONS_LATENCY_5000;
      }else{
        //接收机类型
        if(extraParam){//虚拟接收机
          res = that.OPTIONS_LATENCY2;
        }else{
          res = that.OPTIONS_LATENCY;
        }
      }
    }
    else if (param == 'video_input') {
      if (devMode == 'DV3000T') {
        res = that.OPTIONS_VIDEOINPUT_3000;
      }else if(devMode == 'DV406'){
        res = that.OPTIONS_VIDEOINPUT_406;
      }else if(devMode === 'DV5000T'){
        res = that.OPTIONS_S_VIDEOINPUT_5000;
      }else if(devSeries === '1080'){
        res = that.OPTIONS_VIDEOINPUT_1080;
      }else if(devSeries === '4000'){
        res = that.OPTIONS_VIDEOINPUT_4000;
      }
    }
    else if (param == 'audio_encode'){
      if(prefix == PREFIX){
        res = that.OPTIONS_AUDIO_ENCODE_4000;
      }else{
        res = that.OPTIONS_AUDIO_ENCODE2_4000;
      }
    }
    return res;
  },
  //判断是否是有效序列号
  isValidSn(sn) {
    var res = false;
    if (sn.length != 10) {
        return false;
    }
    if (/^[0-9]+$/.test(sn)) {
        res = true;
    } else {
        res = false;
    }
    return res;
  },
  //判断是否是合法互动推拉流延时
  isValidActLatency(latency) {
    var res = false;
    if (+latency >= this.ACT_LATENCY_MIN && +latency <= this.ACT_LATENCY_MAX) {
        res = true;
    }
    return res;
  },
  //获取背包参数
  getDeviceParam(cb){
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getDevParam:true,
        devSN: store.state.ActiveDevice.dev_sn
      }),
      Api:"getDevParam",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb(res.data[0])
        }
      }else{
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  }, 
  //获取dev_list某个参数
  getDevListOneParam(param, callback) {
    var devSN = store.state.ActiveDevice.dev_sn;
    if (!devSN || !this.isValidSn(devSN)) {
      if (typeof(callback) == 'function') {
        callback([]);
      }
      return;
    }
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getDevListOneParam:devSN,
        devParamCol: param
      }),
      Api:"getDevListOneParam",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if (typeof(callback) == 'function') {
          callback(res.data[0]);
        }
      }else{
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //设置背包参数
  setDeviceParam(key,val,cb){
    var devParamCol = key;
    var value = val;
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        devSN: store.state.ActiveDevice.dev_sn,
        devParamCol: devParamCol,
        value: value
      }),
      Api:"SetDevParam",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb()
        }
        /*Toast({
          message: '设置成功',
          position: 'middle',
          duration: 2000
        });*/
      }else{
        Toast({
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
  //设置多个背包参数
  setDevParamList(paramArr, valueArr,setDevSn) {
    var devSN = store.state.ActiveDevice.dev_sn
    if(setDevSn){
      devSN = setDevSn 
    }
    if (!devSN || !this.isValidSn(devSN)) {
      return;
    }
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        devParamList:"true",
        devSN: devSN,
        ParamList: paramArr,
        valueList: valueArr
      }),
      Api:"devParamList",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data
      if(res.res.success){
        Toast({
          message: '设置成功',
          position: 'middle',
          duration: 2000
        });
      }else{
        Toast({
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
  //点击板卡录制按钮!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  clickRecordBtn(on) {
    /*var error = '';
    var record = $('#record_sel').selectpicker('val');
    if (on == 1 && record == -1) {
      error = '无可用的录机';
    }
    var ip = $('#record_ip').val();
    var port = $('#record_port').val();
    var name = $('#record_name').val();
    var maxsize = $('#record_maxsize').val();
    
    if (port == '' || !isValidPort(port)) {
      error = '端口不合法';
    }
    if (maxsize < 1) {
      maxsize = 1;
      $('#record_maxsize').val(1);
    } else if (maxsize > 500) {
      maxsize = 500;
      $('#record_maxsize').val(500);
    }
    if (name.length > 10) {
      error = '文件名长度要<10';
    }
    if (error != '') {
      showLayer(error, '#rcv_record_switch');
      $("#rcv_record").bootstrapSwitch("state", false, true);
      return;
    }
    var rcvSn = getSelRcvBoard('rcvSn');
    var boardId = getSelRcvBoard('boardId');
    var devSN = $('#edit_dev_name').val();
    devSN = devSN.split('_')[1];
    setRecordParam(record, ip, port, name, maxsize, on, rcvSn, boardId, devSN);
    editBoardListParam(rcvSn, boardId, 'value1', on);
    editBoardListParam(rcvSn, boardId, 'value12', ip);
    editBoardListParam(rcvSn, boardId, 'value13', port);
    if (on == '1') {
      setRecordParamDisabled(true);
      $(".recordOnShow").removeClass("thread-none");
      getRecordCapacity(record, devSN, rcvSn, boardId);
    } else {
      setRecordParamDisabled(false);
      $(".recordOnShow").addClass("thread-none");
      clearInterval(localStorage.getRecordCapacityInterval);
    }*/
  },
  //判断接收机序列号是否有效
  isValidRcvSn(rcvSn) {
    var res = false;
    if (rcvSn.length != 10) {
      return false;
    }
    var snStr = rcvSn.substr(-4); //序列号10位，如果后4位是2999，则前6位可以输入字母，表示虚拟接收机，若后4位不是2999，则前6位必须输入数字，表示实体接收机
    if (snStr != "2999") { //实体接收机，10位必须都是数字
      if (/^[0-9]+$/.test(rcvSn)) {
        res = true;
      } else {
        res = false;
      }
    } else { //虚拟接收机，前6位可以输入字母或者数字，后4位是2999
      if (/^[0-9a-zA-Z]+$/.test(rcvSn)) {
        res = true;
      } else {
        res = false;
      }
    }
    return res;
  },
  // 判断是否是有效IP
  isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        sectionArray = null,
        i = 0;

    if ("string" !== typeof ip) {
      return false;
    }

    sectionArray = ip.split(".");

    if (4 !== sectionArray.length) {
      return false;
    }

    for (i = 0; i < sectionArray.length; i += 1) {
      if (sectionArray[i].length > 1 && "0" === sectionArray[i].charAt(0)) {
        return false;
      }
    }

    return reg.test(ip);
  },
  //判断是否是有效端口  在0到65535之间
  isValidPort(port) {
    var re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    return re.test(port);
  },
  getNewPrefixList(cb){
    axios({
      method: 'post',
      url:"/page/dev/devData.php",
      data:qs.stringify({
        getCurAndChildPrefixs:true,
        prefix:store.state.user.prefix
      }),
      Api:"getCurAndChildPrefixs",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb(res.data)
        }
      }else{
        Toast({
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
  getNewUserListByPrefix(prefix,cb){
    axios({
      method: 'post',
      url:"/page/dev/devData.php",
      data:qs.stringify({
        getUserByPrefix:true,
        prefix:prefix
      }),
      Api:"getUserByPrefix",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb(res.data)
        }
      }else{
        Toast({
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
  getUserList(cb){
    axios({
      method: 'post',
      url:"/page/dev/devData.php",
      data:qs.stringify({
        getPrefixs:true
      }),
      Api:"getPrefixs",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb(res.data)
        }
        /*var userList = res.data;
        that.deviceConfigUserOptions = userList;*/
      }else{
        Toast({
          message: res.res.reason,
          position: 'middle',
          duration: 2000
        });
        //that.deviceConfigUserOptions = [];
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //判断当前设备用户是否有权限
  judgeUserHasDevRights() {
    if (store.state.user.userGroup == NORMAL) { //普通用户
      return false;
    }
    return true;
  },
  //初始化用户组对应的用户下拉列表
  initUserListByPrefix(prefix,cb) {
    //获取设备的使用者和全部非管理员用户列表
    axios({
      method: 'post',
      url:"/page/dev/devData.php",
      data:qs.stringify({
        getDevUser: true,
        logUser: store.state.user.id,
        prefix: prefix,
      }),
      Api:"getDevUser",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if (cb) {
          cb(res.data);
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //获取当前设备的所有用户
  getUsersByDevSn(devSn,cb) {
    //获取设备的使用者和全部用户列表
    axios({
      method: 'post',
      url:"/page/dev/devData.php",
      data:qs.stringify({
        getDevUser : true,
        devSn : devSn,
        logUser: store.state.user.id,
        prefix : store.state.user.prefix,
      }),
      Api:"getDevUser",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb(res.data)
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //判断是否是有效手机号
  isValidPhone(number) {
    var res = false;
    if (number.length != 11) {
      return false;
    } else {
      if (/^[0-9]+$/.test(number)) {
        res = true;
      } else {
        res = false;
      }
    }
    return res;
  },
  //格式化用户组选中值
  formatUserSelect(userPrefixShow,selectPrefix){
    var that = this;
    var select = "";
    if(userPrefixShow){
      if(selectPrefix){
        select = selectPrefix.map(function(item){
          return "'" + item + "'"
        }).join(",");
      }else{
        select = "'/'";
      }
    }else{
       select = "'"+store.state.user.prefix+"'";
    }
    return select;
  },
  //用户组过滤值改变时调用
  getPrefixShow(selectPrefix,options){
    var prefixShow = [], prefixNameShow = [];
    if(selectPrefix[selectPrefix.length-1] == "all"){//当前选中all
      prefixShow = ["all"];  
      prefixNameShow = ["全部"];  
    }else{
      if(selectPrefix.length > 1){
        if($.inArray("all",selectPrefix) != -1){
          selectPrefix.splice(selectPrefix.indexOf("all"),1); 
        }
      }
      prefixShow = selectPrefix;  
      for(var i=0; i<options.length; i++){
        if($.inArray(options[i]["value"], prefixShow) != -1){
          prefixNameShow.push(options[i]["label"]);      
        }
      }
    }
    return {"selectPrefix":prefixShow,"selectPrefixName":prefixNameShow} ;
  },
  initPrefixData(data){
    var selectPrefixOptions = [];
    var selectPrefix = [];
    var selectPrefixName = [];
    selectPrefixOptions.push({label:"全部", value:"all"});
    for(var i=0; i<data.length; i++){
      selectPrefixOptions.push({label:data[i].prefix_name, value:data[i].prefix});
    }
    selectPrefixOptions.push({label:"无", value:" "})
    selectPrefix.push(selectPrefixOptions[0]["value"])
    selectPrefixName.push(selectPrefixOptions[0]["label"])              
    return {
      "selectPrefixOptions":selectPrefixOptions, 
      "selectPrefix":selectPrefix,
      "selectPrefixName":selectPrefixName
    }
  },
  //获取字符串长度，包括中文，中文也按一个字符处理
  Substr(str, start){
    var len = 0;
    var tmpStr = '';
    for (var i = start; i < str.length; i++) { // 遍历字符串
      if (/[\u4e00-\u9fa5]/.test(str[i])) { // 中文 长度也默认是1字节
        len += 1;
      } else {
        len += 1;
      }
    }
    return len;
  },
  //删除用户
  deleteUserById(userIds,deldevflag,cb,group){
    axios({
      method: 'post',
      url:"/page/users/users.php",
      data:qs.stringify({
        delUserIds: userIds,
        delDevFlag: deldevflag,
        logId: store.state.user.id,
      }),
      Api:"delUser",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
         if(cb){
          cb("success",group);
        }
      }else{
        Toast({
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
  //获取登录用户所在组的所有子组
  getChildGrpArr(logPrefix,callback) {
    axios({
      method: 'post',
      url:"/page/userPrefix/userPrefix.php",
      data:qs.stringify({
        getChildGrpArr: true,
        logPrefix:logPrefix
      }),
      Api:"getChildGrpArr",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        var data = res.data;
        if (callback) {
          callback(data);
        }
      }else{
        Toast({
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
  //深拷贝对象
  copy(obj) {
    var newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
      return;
    }
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? this.copy(obj[i]) : obj[i];
    }
    return newobj
  },
  cardId2Enum(cardid){
    var res = 0;
    res = this.SRT_TRANS_IF[cardid];
    return res;
  },
  cardEnum2Id(cardenum) {
    if(cardenum == '' || cardenum == null){
      cardenum = 0;
    }
    cardenum = +cardenum;
    return this.SRT_TRANS_IF2[cardenum];
  },
  //获取直播速率范围
  getMbps() {
    var prefix = store.state.user.prefix;
    var res = {
      min: MBPS_MIN,
      max: MBPS_MAX2
    };
    if (prefix != PREFIX) {
      if (prefix == 'xs') {
        res.max = MBPS_MAX2; //80M
      } else {
        res.max = MBPS_MAX; //12M
      }
    }
    return res;
  },
  //获取视频比特率的范围
  getVideoBr(devSn) {
    var devSeries = this.getDevSeries(devSn);
    var sn = devSn.substr(-4);
    var devMode = this.getDevMode(sn);
    var prefix = store.state.user.prefix;
    var res = {};
    if(devMode === 'CM-T5G 1000'){
      devMode = 'DV3000T';
    }
    if (devMode === 'DV5000T') {
      res = {
        min: this.BITRATE_MIN_5000,
        max: this.BITRATE_MAX_5000
      };
    }else if(devSeries == "1080"){
      res = {
        min: this.BITRATE_MIN_1080,
        max: this.BITRATE_MAX_1080
      };
    }else if(devSeries == "4000"){
      res = {
        min: this.BITRATE_MIN_4000,
        max: this.BITRATE_MAX_4000
      };
      if (devMode == 'DV3000T') {
        res.max = this.BITRATE_MAX3_4000; //20M
      }
      else {
        res.max = this.BITRATE_MAX_4000; //100M
      }
    }
    return res;
  },
  //获取某个参数
  getDevOneParam(devSn, param, callback) {
    var devSN = "";
    if(devSn != ""){
      devSN = devSn;
    }else{
      devSN = store.state.ActiveDevice.dev_sn;
      if (!devSN || !this.isValidSn(devSN)) {
        if (typeof(callback) == 'function') {
          callback([]);
        }
        return;
      }
    }
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getDevOneParam:devSN ,
        devParamCol:param
      }),
      Api:"getDevOneParam",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if (typeof(callback) == 'function') {
          callback(res.data[0]);
        }
      }else{
        Toast({
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
  getNetBoard(cb){
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getDevCardParam:true, 
        devSN: store.state.ActiveDevice.dev_sn
      }),
      Api:"getDevCardParam",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if(cb){
          cb(res.data[0])
        }
        /*that.netBoard = that.formatSwitch(res.data[0]);
        that.updateCardSelOptioins(res.data[0]);//更新单卡选择select*/
      }else{
        if(cb){
          cb([]);
        }
        //that.netBoard = [];
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //名称校验 支持中文/字母/数字/+/-/@/(/) /长度：15
  nameCheckType(name, min, max, sc) {
    var scArr = sc.split(",");
    var reg = "";
    for(var i=0; i<scArr.length; i++){
        if(scArr[i] == "number"){
            reg += "0-9";    
        }else if(scArr[i] == "en"){
            reg += "A-Za-z";    
        }else if(scArr[i] == "zh"){
            reg += "\\u4e00-\\u9fa5";
        }else{
            reg += "\\"+scArr[i];
        }
    }
    var pattern =new RegExp("^["+reg+"]{"+min+","+max+"}$","gim"); 
    return pattern.test(name);
  },
  nameCheckType1(name) {
    var pattern = /^[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]{1,15}$/gi;
    return pattern.test(name);
  },
  //名称校验 支持中文/字母/数字/+/_/@/(/) /长度：15
  nameCheckType2(name) {
    var pattern = /^[A-Za-z0-9\u4e00-\u9fa5\@\+\_\(\)（）]{1,15}$/gi;
    if(name == SUPER){
        return true;
    }
    return pattern.test(name);
  },
  //名称校验 支持字母/数字/+/_/@/(/) /长度：15
  nameCheckType3(name) {
    var pattern = /^[A-Za-z0-9\@\+\_\(\)（）]{1,15}$/gi;
    if(name == SUPER){
        return true;
    }
    return pattern.test(name);
  },
  //密码校验 6-16位字母数字，至少包含一个字母一个数字
  pwdCheckType(pwd){
    var password = pwd;
    var numberCount,//数字字符数目
        letterCount,//字母字符数目
        numberRegExp = /[0-9]/,//数字正则
        letterRegExp = /[a-z]/i,//字母正则,不区分大小写
        length = (password = password || '').length;
    if(length < 6 || length > 16){
      return false;
    }
    numberCount = letterCount = 0;
    for(var i = 0, char; i < length; i++){
      char = password.charAt(i);//取得每个字符
      if(numberRegExp.test(char)){
        numberCount += 1;//数字字符数目加1
      }else if(letterRegExp.test(char)){
        letterCount += 1;//字母字符数目加1
      }else{
      }
    }
    //全是数字、全是字母、全是特殊符号：返回false
    return !(numberCount == length || letterCount == length || (numberCount==0&&letterCount==0));
  },
  //数字+小数点+一位小数
  checkNumber1(value, cb) {
    var curValue = value;
    curValue = curValue.replace(/[^\d\.]/g, ''); //清除“数字”和“.”以外的字符
    curValue = curValue.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    curValue = curValue.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3'); //只能输入1个小数
    if (curValue == '.') { //首位不能是小数点
      curValue = '';
    }
    if (curValue.indexOf(".") < 0 && curValue != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02
      curValue = parseFloat(curValue);
    }
    if (value != curValue) {
      value = curValue;
    }
    if(cb){
      cb(value)
    }
  },
  /*************************
  *描述：获取背包属于哪个系列
  * 输入：背包序列号
  * 输出：‘4000’ ‘1080’
  ************************/
  getDevSeries(devSn){
    if(!this.isValidSn(devSn)){
      return false;
    }
    var sn_4 = devSn.substr(-4);
    sn_4 = +sn_4;
    //DV4000T,DV3000T,DV406,CM-T5G 2000
    if(sn_4 == 2140 || sn_4 == 2142 || sn_4 == 2147 || sn_4 == 2148 || sn_4 === 2153 || sn_4 === 2155){
      return '4000';
    }
    //DV1080,QUK100,DV1080P,ICBT-201
    else if(sn_4 == 2146 || sn_4 == 2150 || sn_4 == 7189 || sn_4 == 7207){
      return '1080';
    }
    else{
      return false;
    }
  },
  /*************************
  *描述：获取接收机属于虚拟的还是实体的
  * 输入：接收机序列号
  * 输出：‘2999’ ‘2141’
  ************************/
  getRcvSeries(sn){
    if(!this.isValidRcvSn(sn)){
      return false;
    }
    var sn_4 = sn.substr(-4);
    sn_4 = +sn_4;
    if(sn_4 === 2999){
      return VIR_RCV;
    }
    else if(sn_4 === 2154 || sn_4 === 2156){
      return R1080_RCV;
    }
    else {
      return PRA_RCV;
    }

  },
  //判断URL合法性
  checkUrl(url) {
    var result = '';
    if (url == '') {
      return result;
    }
    if (url.indexOf('rtmp://') != 0 && url.indexOf('rtsp://') != 0 && url.indexOf('udp://') != 0 &&
      url.indexOf('rtp://') != 0 && url.indexOf('srt://')) {
      result = "仅支持 'rtmp://'、'rtsp://'、'udp://'、'rtp://'、'srt://'";
    }
    if(url.indexOf(' ') >= 0){
      result = "不能有空格！";
    }
    return result;
  },
  //判断背包和虚拟接收机是否跨组配对以及背包推流开关
  getPushAndPrefixMatch(devSn,rcvSn,callback){
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getPushAndPrefixMatch : true,
        devSn : devSn,
        rcvSn : rcvSn,
      }),
      Api:"getPushAndPrefixMatch",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if (typeof(callback) == 'function') {
          callback(res.data);
        }
      }else{
        Toast({
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
  //获取接收板卡权限
  getRcvRights(rcvSn, boardId, cb) {
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getRcvRights : true,
        userId : store.state.user.id,
        userGroup : store.state.user.userGroup,
        prefix : store.state.user.prefix,
        rcvSn : rcvSn,
        boardId : boardId,
      }),
      Api:"getRcvRights",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if (typeof(cb) == 'function') {
          cb(res.data);
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //获取背包支持开启的选件
  getDevOptions(devSN,cb) {
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        getDevOptions : true,
        devSN : devSN,
      }),
      Api:"getDevOptions",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        if (typeof(cb) == 'function') {
          cb(res.data);
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //获取2个数组中无重复的数据
  array_diff(arr1,arr2){
    var temp = []; //临时数组1
    var temparray = [];//临时数组2
    for (var i = 0; i < arr2.length; i++) {
      temp[arr2[i]] = true;//把数组B的值当成临时数组1的键并赋值为真
    }
    for (var i = 0; i < arr1.length; i++) {
      if (!temp[arr1[i]]) {
        temparray.push(arr1[i]);//同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组
      }
    };
    return temparray;
  },
  //获取字符串长度，包括中文，中文也按一个字符处理
  SubstrFitCn(str, start){
    var len = 0;
    var tmpStr = '';
    for (var i = start; i < str.length; i++) { // 遍历字符串
      if (/[\u4e00-\u9fa5]/.test(str[i])) { // 中文 长度也默认是1字节
        len += 1;
      } else {
        len += 1;
      }
    }
    return len;
  },
  nameCheckType4(name) {
    var pattern = /^[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]/;
    return pattern.test(name);
  },
  initChartSessionData(bindChart, editType) {
    //先把相同devsn的数据删除掉，然后新增
    var devSn = bindChart.split("/")[0];
    var allData = JSON.parse(localStorage.getItem("allChartData"));
    var keyArr = JSON.parse(localStorage.getItem("chartKey"));
    for (var key in allData) {
      if (key.indexOf(devSn) != -1) {
        delete allData[key];
        keyArr.splice(keyArr.indexOf(key), 1);
        break;
      }
    }
    if (editType == "del") {
      localStorage.curChart = devSn + "//";
    } else {
      localStorage.curChart = bindChart;
    }
    localStorage.removeItem('allChartData');
    localStorage.removeItem('chartKey');
    localStorage.setItem('allChartData',JSON.stringify(allData)); 
    localStorage.setItem('chartKey',JSON.stringify(keyArr)); 
    localStorage.autoYaxis = "true";
    localStorage.maxYaxis = "";
    localStorage.intervalYaxis = "";
  }
}