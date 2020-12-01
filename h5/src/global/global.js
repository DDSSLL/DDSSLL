//项目公共方法或常量
//代码中使用 this.$global.xxx 来访问方法或常量
function getCurrentTime() {
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
}
//数组合并去重
function MergeArray(arr1, arr2) {
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
}
//获取设备类型
function getDevMode(sn) {
    var res = false;
    for (var i = 0; i < DEV_MODE.length; i++) {
        if (sn == DEV_MODE[i].sn) {
            res = DEV_MODE[i].name;
            break;
        }
    }
    return res;
}
function getRcvMode(sn){
    var res = false;
    for (var i = 0; i < RCV_MODE.length; i++) {
        if (sn == RCV_MODE[i].sn) {
            res = RCV_MODE[i].name;
            break;
        }
    }
    return res;
}
//获取接收机列表
function getRcvList(content, row, cb) {
  var that = this;
  content.$axios({
    method: 'post',
    url:"/page/index/indexData.php",
    data:content.$qs.stringify({
      getAllRcvName:'rcv',
      userId:content.user.id,
      userGroup:1,
      prefix:content.user.id
    }),
    Api:"getAllRcvName",
    AppId:"android",
    UserId:content.user.id
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
//判断是否是有效邮箱
function isValidMail(address) {
    if (address != "") {
        var regInvalid = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/;
        var regValid = /^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/;
        return (!regInvalid.test(address) && regValid.test(address));
    } else {
        return true;
    }
}

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
window.xSplit = 300;
window.ADMIN = '1'; //管理员用户组
window.ADVANCE = '2'; //高级用户组
window.NORMAL = '3'; //普通用户组
window.PREFIX = '001'; //德力前缀
window.SUPER = '001-admin'; //超级管理员
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
    "USB-5G1↑":'USB-5G1Up',  "USB-5G1↓":'USB-5G1Down',  "USB-5G1传输丢包":'USB-5G1LossDev',  "USB-5G1业务丢包":'USB-5G1LossRcv',
    "USB-5G2↑":'USB-5G2Up',  "USB-5G2↓":'USB-5G2Down',  "USB-5G2传输丢包":'USB-5G2LossDev',  "USB-5G2业务丢包":'USB-5G2LossRcv',
    "USB-LAN↑":'USB-LANUp',  "USB-LAN↓":'USB-LANDown',  "USB-LAN传输丢包":'USB-LANLossDev',  "USB-LAN业务丢包":'USB-LANLossRcv',
    "USB-LAN2↑":'USB-LAN2Up',"USB-LAN2↓":'USB-LAN2Down',"USB-LAN2传输丢包":'USB-LAN2LossDev',"USB-LAN2业务丢包":'USB-LAN2LossRcv'
};
export default {
    getCurrentTime, MergeArray, getDevMode, getRcvList, getRcvMode, isValidMail
}