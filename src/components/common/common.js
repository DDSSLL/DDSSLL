import axios from './axios.init'
import qs from 'qs';
export default {
  GetRcvSnList(callback){
    var that = this;
    axios({
      url:"/testJson/GetRcvSnList.json",
      data:qs.stringify({
        GetRcvSnList: "1",
      }),
      Api:"GetRcvSnList",
      AppId:"android",
      //UserId:that.user.id
    })
    .then(function (response) {
      console.log(response)
      let res = response.data;
      console.log(res)
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
}