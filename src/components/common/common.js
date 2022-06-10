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
    var pattern = /^[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\(\)]{1,15}$/gi;
    return pattern.test(name);
  },  
  isValidUserID(id) {
    var pattern = /^[A-Za-z0-9-_@+()]{1,20}$/gi;
    return pattern.test(id);
  },
  //用户名校验,长度1~20，仅支持中文,字母,数字,+,-,_,@,()和空格
  isValidName20(name) {
    var pattern = /^[A-Za-z0-9\u4e00-\u9fa5 \@\+\-\_\(\)]{1,20}$/gi;
    return pattern.test(name);
  },
  //密码校验 6-16位字母数字，至少包含一个字母一个数字
  pwdCheckType(pwd,required){
    var password = pwd;
    var numberCount,//数字字符数目
        letterCount,//字母字符数目
        numberRegExp = /[0-9]/,//数字正则
        letterRegExp = /[a-z]/i,//字母正则,不区分大小写
        length = (password = password || '').length;
    if(!required){//不必填的情况下，为空返回true
      if(pwd.trim() == ""){
        return true;
      }  
    }
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
}