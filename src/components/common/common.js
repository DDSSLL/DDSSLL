/*window.RUN_SERVER_URL = "http://139.129.91.106:8060";
window.RUN_BUILD_URL = "http://139.129.91.106:8060";*/
import axios from './axios.init'
import qs from 'qs';
import CryptoJS from 'crypto-js'
export default {
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
  GetRcvBoardList(callback){
    var that = this;
    axios({
      url:"/protocol/index.php",//"/testJson/GetRcvBoardList.json",
      data:qs.stringify({
        GetRcvBoardList: "1",
      }),
      Api:"GetRcvBoardList",
      AppId:"web",
      //UserId:that.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.code == "0000"){
        if(typeof(callback) == 'function'){
          var data = res.data;
          callback(data)
        }
        /*var data = res.data;
        var option = {};
        for(var i=0; i<data.length; i++){
        option = {};
        option.label = data[i]["RcvName"];
        option.value = data[i]["RcvSn"];
        that.RCV_LIST_OPTION.push(option);*/
      }
    })
    .catch(function (error) {
    console.log(error)
    })
  },
  GetRcvSnList(callback){
    var that = this;
    axios({
      url:"/protocol/index.php",//"/testJson/GetRcvSnList.json",
      data:qs.stringify({
        GetRcvSnList: "1",
      }),
      Api:"GetRcvSnList",
      AppId:"web",
      //UserId:that.user.id
    })
    .then(function (response) {
      let res = response.data;
      if(res.code == "0000"){
        if(typeof(callback) == 'function'){
          var data = res.data;
          callback(data)
        }
      }
    })
    .catch(function (error) {
      console.log(error)
    })
  },
  //加密md5处理后的密码
  encrypPwd(md5_pwd){
    let key = CryptoJS.enc.Utf8.parse("8NONwyJtHesysWpM");
    let encryptedData = CryptoJS.AES.encrypt(md5_pwd, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    encryptedData = encryptedData.ciphertext.toString();
    let wordArray = CryptoJS.enc.Hex.parse(encryptedData);
    return CryptoJS.enc.Base64.stringify(wordArray);
  },
  /*校验*/
  //判断是否是有效序列号
  isValidSn(sn) {
    console.log("isValidSn")
    var res = false;
    if (sn.length != 10) {
        return false;
    }
    if (/^[0-9]+$/.test(sn)) {
        res = true;
    } else {
        res = false;
    }
    console.log("res:"+res)
    return res;
  },
  nameCheckType1(name) {
    var pattern = /^[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)（）]{1,15}$/gi;
    return pattern.test(name);
  },  // 判断是否是有效IP
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
}