window.cardIdArr = ['eth0', 'lte1', 'lte2', 'lte3', 'lte4', 'lte5',
    'lte6', 'usb-lan', 'usb-5g1', 'usb-5g2', 'wifi'
];
var DEV_MODE = [{sn: 2146,name: 'DV1080'},
                {sn: 2150,name: 'QUK100'}];
var RCV_MODE = [{sn: 2141,name: 'DV4000R'}, 
                {sn: 2143,name: 'DV4001R'}, 
                {sn: 2144,name: 'DV4002R'}, 
                {sn: 2145,name: 'DV4008R'}, 
                {sn: 2147,name: 'DV4000PCIE'},
                {sn: 2999,name: 'DV4000RV'}];
var DEV_MODE_4000 = [{sn: 2140,name: 'DV4000T'}, 
                {sn: 2142,name: 'DV3000T'}, 
                {sn: 2144,name: 'DV1080old'}, 
                {sn: 2146,name: 'DV1080'}, 
                {sn: 2147,name: 'DV406'}, 
                {sn: 2148,name: 'CM-T5G 2000'}, 
                {sn: "",name: 'MH5000-31'}, //华为5G
                {sn: "",name: 'EC200T'},    //高通4G
                {sn: "",name: 'RG500QEA'}   //高通5G
              ];
var RCV_MODE_4000 = [{sn: 2141,name: 'DV4000R'}, 
                {sn: 2143,name: 'DV4001R'}, 
                {sn: 2144,name: 'DV4002R'}, 
                {sn: 2145,name: 'DV4008R'}, 
                {sn: 2147,name: 'DV4000PCIE'}, 
                {sn: 2999,name: 'DV4000RV'}, 
                {sn: 2149,name: 'CM-IR5000T'}, 
                {sn: 7188,name: 'DV4004R'}];
window.xSplit = 300;
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
window.HDXPRESS_BUILD = "http://www.hdxpress.cn";//1080一级域名
window.HDXPRESS_SERVE = "http://1080.hdxpress.cn:8088/";//1080二级域名，对应地址：47.104.161.61
window.UHDXPRESS_BUILD = "http://4000.uhdxpress.com";//4000一级域名
window.UHDXPRESS_SERVE = "http://192.168.100.110:8088/";//4000二级域名
window.colorGV = {
    '上传速率':'#FFFF00',
    '下载速率': '#22aadd',
    '传输丢包': '#f1a1ff',
    '业务丢包': '#f5222d',

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
    "上传速率":'totalUp', "下载速率":'totalDown', "传输丢包":'TotalLossDev', "业务丢包":'TotalLossRcv',
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
import { Toast } from 'mint-ui'
import qs from 'qs';
import store from '../store'
import axios from '../api/axios.init'
import $ from 'jquery';
//import { mapState, mapMutations } from 'vuex';
export default {
  //项目公共方法或常量
  //代码中使用 this.$global.xxx 来访问方法或常量
  //DV4000 参数---start
  OPTIONS_VIDEOENCODE : [{value: "0",text: "H.265 Main(4:2:0/8bit)"}, 
                        {value: "1",text: "H.265 Main(4:2:0/10bit)"}, 
                        {value: "2",text: "H.265 Main(4:2:2/8bit)"}, 
                        {value: "3",text: "H.265 Main(4:2:2/10bit)"}, 
                        {value: "4",text: "H.264"}],
  OPTIONS_VIDEOENCODE2 : [{value: "0",text: "H.265 Main(4:2:0/8bit)"}, 
                          {value: "1",text: "H.265 Main(4:2:0/10bit)"}, 
                          {value: "4",text: "H.264"}],
  OPTIONS_VIDEOENCODE3 : [{value: "0",text: "H.265 Main(4:2:0/8bit)"}, 
                          {value: "1",text: "H.265 Main(4:2:0/10bit)"}, 
                          {value: "2",text: "H.265 Main(4:2:2/8bit)"}, 
                          {value: "3",text: "H.265 Main(4:2:2/10bit)"}],
  OPTIONS_BITRATEMODE : [{value: "0",text: "CBR"}, 
                        {value: "1",text: "VBR"}],
  OPTIONS_BITRATEMODE2 : [{value: "0",text: "CBR"}],
  OPTIONS_HDR : [{text: "SDR",value: "0"}, 
                {text: "HLG",value: "1"}],
  OPTIONS_HDR2 : [{text: "SDR",value: "0"}],
  OPTIONS_LATENCY : [{text: "标准时延",value: "0"}, 
                    {text: "超低时延",value: "1"}],
  OPTIONS_LATENCY2 : [{text: "标准时延",value: "0"}],
  OPTIONS_VIDEOINPUT : [{value: "0",text: "12G-SDI"}, 
                        {value: "1",text: "4x3G SQ"}, 
                        {value: "2",text: "4x3G 2SI"}, 
                        {value: "3",text: "3G-SDI[1]"}, 
                        {value: "4",text: "HDMI"}],
  OPTIONS_VIDEOINPUT2 : [{value: "3",text: "3G-SDI[1]"}, 
                        {value: "4",text: "HDMI"}],
  OPTIONS_VIDEOINPUT406 : [{value: "0",text: "SDI"}],
  OPTIONS_AUDIO_ENCODE : [{text: "AAC",value: "0"}, 
                          {text: "LPCM",value: "1"}, 
                          {text: "MPEG1L2",value: "2"}],
  OPTIONS_AUDIO_ENCODE2 : [{text: "AAC",value: "0"}],
  OPTIONS_AUDIOINPUT : [{value: "0",text: "0-CH"}, 
                        {value: "1",text: "2-CH"}, 
                        {value: "2",text: "4-CH"}],
  OPTIONS_AUDIOINPUT_HDMI264 : [{value: "1",text: "2-CH"}],
  OPTIONS_HDMI_FORMAT : [{text: "自动",value: "0"}, 
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
  OPTIONS_AUDIO_BR : [{text: "256kbps",value: "256"}, 
                      {text: "128kbps",value: "128"},
                      {text: "64kbps",value: "64"}],
  //接收机
  OPTIONS_PUSH_RESULUTION : [{text: "1080p",value: "1080"}, 
                            {text: "720p",value: "720"}, 
                            {text: "576i",value: "576"}],
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
  //接收机板卡相关参数--end
  /*录机路径*/
  OPTIONS_RECORD_PATH : [{text: "USB",value: "0"}, 
                        {text: "NAS",value: "1"}],
  //DV4000 参数---end
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
    var dev_mode = DEV_MODE;
    if(store.state.activedevicetype == "DV4000"){
      dev_mode = DEV_MODE_4000;
    }
    var res = false;
    for (var i = 0; i < dev_mode.length; i++) {
      if (sn == dev_mode[i].sn) {
        res = dev_mode[i].name;
        break;
      }
    }
    return res;
  },
  getRcvMode(sn){
    var rcv_mode = RCV_MODE;
    if(store.state.activedevicetype == "DV4000"){
      rcv_mode = RCV_MODE_4000;
    }
    var res = false;
    for (var i = 0; i < rcv_mode.length; i++) {
      if (sn == rcv_mode[i].sn) {
        res = rcv_mode[i].name;
        break;
      }
    }
    return res;
  },
  //获取接收机列表
  getRcvList(row, cb) {
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
  },
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
  getUnusedBoard(rcvSn,cb) {
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
      console.log("getUnusedBoard success")
      console.log(res)
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
      console.log("getDevPushStatus success")
      console.log(res)
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
  editMatch(rcv, board, dev_sn, dev_name) {
    var that = this;
    axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:qs.stringify({
        editMatchByDevSn:true,
        dev_sn: dev_sn,
        devName: dev_name,
        new_rcv_sn: rcv,
        new_board_id: board
      }),
      Api:"editMatchByDevSn",
      AppId:"android",
      UserId:store.state.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.res.success){
        //虚拟
        if(rcv.substr(-4) == "2999"){
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
        Toast({
          message: "绑定成功",
          position: 'middle',
          duration: 2000
        });
        //chars数据删除--start
        var bindChart = "";
        if (rcv.substr(-4) == "2999") {
          bindChart = dev_sn + "/" + rcv + "/" + dev_sn;
        } else {
          bindChart = dev_sn + "/" + rcv + "/" + board;
        }
        that.initChartSessionData(bindChart, "save");
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
  getPushUrls(content,cb){
    var that = this;
    content.$axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:content.$qs.stringify({
        getBoardUrl:true,
        rcvSn: content.ActiveDevice.rcv_sn,
        boardId: content.ActiveDevice.board_id
      }),
      Api:"getBoardUrl",
      AppId:"android",
      UserId:content.user.id
    })
    .then(function (response) {
      let res = response.data
      if(res.res.success){
        if(cb){
          console.log("getPushUrls success")
          cb(res.data);
        }
      }else{
        that.address = [];
      }
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
  getDevParamRange(devSn, prefix, param) {
    var that = this;
    var sn = devSn.substr(-4);
    var devMode = that.getDevMode(sn);
    var res = [];
    if (param == 'video_encode') {//视频编码
      if (devMode == 'DV3000T') {
        res = that.OPTIONS_VIDEOENCODE2;
      }else if(devMode == 'DV406'){
        res = that.OPTIONS_VIDEOENCODE3;
      }else{
        if(prefix == PREFIX){
          res = that.OPTIONS_VIDEOENCODE;
        }else{
          res = that.OPTIONS_VIDEOENCODE3;
        }
      }
    }else if (param == 'bitrate_mode') {
      if (prefix != PREFIX) {
        res = that.OPTIONS_BITRATEMODE2;
      } else {
        res = that.OPTIONS_BITRATEMODE;
      }
    }else if (param == 'hdr') {
      if (devMode == 'DV3000T') {
        res = that.OPTIONS_HDR2;
      } else {
        res = that.OPTIONS_HDR;
      }
    }else if (param == 'latency') {
      if (devMode == 'DV3000T') {
        res = that.OPTIONS_LATENCY2;
      } else {
        res = that.OPTIONS_LATENCY;
      }
    }else if (param == 'video_input') {
      if (devMode == 'DV3000T') {
        res = that.OPTIONS_VIDEOINPUT2;
      }else if(devMode == 'DV406'){
        res = that.OPTIONS_VIDEOINPUT406;
      }else {
        res = that.OPTIONS_VIDEOINPUT;
      }
    }else if (param == 'audio_encode'){
      if(prefix == PREFIX){
        res = that.OPTIONS_AUDIO_ENCODE;
      }else{
        res = that.OPTIONS_AUDIO_ENCODE2;
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
  //设置背包参数
  setDeviceParam(key,val){
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
  setDevParamList(devSN, content, paramArr, valueArr) {
    if (!devSN || !this.isValidSn(devSN)) {
      return;
    }
    var that = this;
    content.$axios({
      method: 'post',
      url:"/page/index/indexData.php",
      data:content.$qs.stringify({
        devParamList:"true",
        devSN: devSN,
        ParamList: paramArr,
        valueList: valueArr
      }),
      Api:"devParamList",
      AppId:"android",
      UserId:content.user.id
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
  //判断是否是有效端口  在0到65535之间
  isValidPort(port) {
    var re = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    return re.test(port);
  },
  //获取登录用户所在组的所有子组
  getChildGrpArr(cb) {
    axios({
      method: 'post',
      url:"/page/userPrefix/userPrefix.php",
      data:qs.stringify({
        getChildGrpArr:true,
        logPrefix:store.state.user.prefix
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
}