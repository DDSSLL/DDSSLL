<template>
  <div class="pushurl">
    <div class="addressGroup">
      <div v-if="workMode=='推流'">
        <template v-for="(item,i) in address">
          <div class="address" :key="i">
            <div class="title widthPart">
              <p :class="[item.push_url ? 'addressTitleLineH' : '']">{{ item.remark?item.remark : "推流地址"+(i+1) }}</p>
              <p :class="[item.push_url ? 'addressTitleLineH' : '', 
              item.push_status == 'running' ? 'pushStyle' : (item.push_status == '' ? 'defaultStyle' : 'errStyle')]" class="addressUrl" v-if="item.push_url">{{ item.push_url }}</p>
            </div>
            <div class="buttons">
              <mt-switch v-model="item.enable" style="display: inline-block;vertical-align: middle;transform: scale(0.6);" @change="changeUrlEnable(item)"  :disabled="lockState || dev_push_enable"></mt-switch>  
              <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true" @click="showEditUrls(item,i)"></i>
              <i class="iconBtn fa fa-trash-o" aria-hidden="true" @click="delUrl(item)" :style="{display:(lockState||dev_push_enable)?'none':'inline-block'}"></i>
            </div>
          </div>
        </template>
      </div>
      <div v-if="workMode=='拉流'">
        <template v-for="(item,i) in addressPull">
          <div class="address" :key="i">
            <div class="title widthPart">
              <p :class="[item.push_url ? 'addressTitleLineH' : '']">{{ item.remark?item.remark : "拉流地址"+(i+1) }}</p>
              <p :class="[item.push_url ? 'addressTitleLineH' : '', 
              item.push_status == 'running' ? 'pushStyle' : (item.push_status == '' ? 'defaultStyle' : 'errStyle')]" class="addressUrl" v-if="item.push_url">{{ item.input_url }}</p>
            </div>
            <div class="buttons">
              <mt-switch v-model="item.enable" style="display: inline-block;vertical-align: middle;transform: scale(0.6);" @change="changePullUrlEnable(item)"  :disabled="lockState"></mt-switch>  
              <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true" @click="showEditUrls(item,i)"></i>
              <i class="iconBtn fa fa-trash-o" aria-hidden="true" @click="delPullUrl(item)" :style="{display:(lockState||dev_push_enable)?'none':'inline-block'}"></i>
            </div>
          </div>
        </template>
      </div>
      <mt-popup v-model="pushUrlsEditVisible" popup-transition="popup-fade">
        <div class="pushEditModal">
          <div class="modalTitle">
            视频流地址
            <i class="closeBtn fa fa-close" @click="hideEditUrls"></i>
          </div>
          <div class="formContainer">
            <div class="formItem">
              <div class="formItemTitle">备注名</div>
              <div class="formItemVal formItemTextArea">
                <mt-field label="" placeholder="" type="textarea" rows="3" v-model="activePushObj.remark"></mt-field>
              </div>
            </div>
            <div class="formItem" v-if="workMode == '推流'">
              <div class="formItemTitle">视频源</div>
              <div class="formItemVal">
                <select class="ItemSelect2" v-model="activePushObj.sourceIndex" @change="changeVideoSource">
                  <template v-for="item in videoSource">
                    <option :value="item.value">{{ item.text }}</option>
                  </template>
                </select>
              </div>
            </div>
            <div class="formItem">
              <div class="formItemTitle">地址类型</div>
              <div class="formItemVal">
                <mt-radio v-model="activePushObj.addressType" :options="OPTIONS_ADDRESS_TYPE" @change="changeAddressType">
                </mt-radio>
              </div>
            </div>
            <div class="formItem" v-if="show.rtmp_url">
              <div class="formItemTitle">{{activePushObj.urlType}}</div>
              <div class="formItemVal">
                <mt-field label="" placeholder="" type="textarea" rows="3" v-model="activePushObj.push_url"></mt-field>
                <p class="rtmpTip">支持 RTMP+H.264</p>
              </div>
            </div>
            <div v-if="show.srt_url">
              <div class="formItem">
                <div class="formItemTitle">{{activePushObj.urlType}}</div>
                <div class="formItemVal">
                  <mt-field label="" placeholder="" type="textarea" rows="3" v-model="activePushObj.push_srt_url"></mt-field>
                  <p class="rtmpTip"><span>{{activePushObj.url_error}}</span></p>
                </div>
              </div>
              <div class="formItem">
                <div class="formItemTitle">延时(ms)</div>
                <div class="formItemVal">
                  <input type="text" v-model="activePushObj.srt_latency">
                </div>
              </div>
              <div class="formItem">
                <div class="formItemTitle">密码</div>
                <div class="formItemVal">
                  <input type="text" v-model="activePushObj.srt_passphrase">
                </div>
              </div>
              <div class="formItem">
                <div class="formItemTitle">键长</div>
                <div class="formItemVal">
                  <select class="ItemSelect2" v-model="activePushObj.pbkeylen_sel" @change="changeVideoSource">
                    <template v-for="item in $global.OPTIONS_PBKEYLEN">
                      <option :value="item.value">{{ item.text }}</option>
                    </template>
                  </select>
                </div>
              </div>
              <div class="formItem">
                <div class="formItemTitle">流ID</div>
                <div class="formItemVal">
                  <input type="text" v-model="activePushObj.srt_streamID">
                </div>
              </div>
            </div>
            <div class="formItem" style="text-align: right;margin-bottom: 0;" v-if="!lockState && !dev_push_enable">
              <button class="modalBtn" @click="hideEditUrls">取消</button>
              <button class="modalBtn" @click="saveEditUrls" style="background-color: #3d81f1;color:#fff;">确定</button>
            </div>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { SET_ACTIVE_DEVICE } from '../../store/mutation-types';
  import $ from 'jquery';
  export default {
    name: "PushUrl",
    props:['lockState','workMode','transMode','cardId'],
    data(){
      return{
        SUPER:SUPER,
        ADMIN:ADMIN,
        address:[],
        addressPull:[],
        dev_push_enable:"",
        showSubmitBtn:false,
        activePushObj:{
          urlId:"",
          rcvSn:"",
          boardID:"",
          pull_urlId:"",
          pull_devSn:"",
          url_error:"",
          urlType:"",
          remark:"",//备注名
          sourceIndex:"0",//视频源
          addressType:"0",//地址类型
          srt_latency:"",
          srt_passphrase:"",
          pbkeylen_sel:"",
          srt_streamID:"",
        },
        show:{
          rtmp_url:true,
          srt_url:false,
        },
        pushUrlsEditVisible:false,
        OPTIONS_URL_SOURCE: [{text: "自动",value: "0"}, 
                            {text: "源1(背包透传)",value: "1"}, 
                            {text: "源2(板卡转码)",value: "2"}],
        OPTIONS_URL_SOURCE1: [{text: "源1(背包透传)",value: "1"}],
        OPTIONS_ADDRESS_TYPE: [{label: "RTMP",value: "0"}, 
                              {label: "SRT",value: "1"}],
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    created(){  //生命周期-页面创建后
      var that = this;
      //this.getPushUrl();
      this.getURL();
    },
    activated(){
      //this.getPushUrl();
      this.getURL();
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getPushUrl1080);
    },
    watch:{
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          clearInterval(localStorage.getPushUrl1080);
          //this.getPushUrl();
          this.getURL();
        }
      }
    },
    methods:{
      ...mapMutations({
        SET_ACTIVE_DEVICE
      }),
      getURL(){
        if(this.workMode == "推流"){
          this.getPushUrl();
        }else{
          this.getDevPullUrl();
        }
      },
      getPushUrl(){
        var that = this;
        that.address = [];
        that.$global.getPushUrls(that.formatPushUrls);
        that.getPushParam();
        localStorage.getPushUrl1080 = setInterval(function(){
          if(that.dev_push_enable){
            that.$global.getPushUrls(that.formatPushUrls);  
          }
          that.getPushParam();
        },500)
      },
      formatPushUrls(data){
        var that = this;
        var devSeries = this.$global.getDevSeries(this.ActiveDevice.dev_sn);
        for(let i=0; i<data.length; i++){
          if (data[i].push_status != 'running' && data[i].push_status != '') {
            data[i].push_url += ('(' + data[i].push_status + ')');
          } 
          var disFlag = false;
          if(devSeries=="1080"){
            //单卡推流
            if((devSeries=="1080") && !that.transMode){
              if (data[i].oneCardEnable == 1){//设置选中
                data[i]["enable"] = true;
              }else{
                data[i]["enable"] = false;
              }
            } else {
              //汇聚
              if (data[i].nEnable == 1){
                data[i]["enable"] = true;
              }else{
                data[i]["enable"] = false;
              }
            }
          }else if(devSeries=="4000"){
            if (data[i].nEnable == 1){
              data[i]["enable"] = true;
            }else{
              data[i]["enable"] = false;
            }
          }
        }
        that.address = data;
      },
      //获取背包拉流地址
      getDevPullUrl(){
        console.log("getDevPullUrl")
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getPullUrl:true,
            devSn: that.ActiveDevice.dev_sn
          }),
          Api:"getPullUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          if(res.res.success){
            that.formatPullUrls(res.data);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatPullUrls(data){
        console.log("formatPullUrls")
        console.log(data)
        for(var i=0; i<data.length; i++){
          if(data[i]["url_enable"] == "1"){
            data[i]["enable"] = true;
          }else{
            data[i]["enable"] = false;
          }
        }
        this.addressPull = data;
      },
      //获取推流开关参数
      getPushParam(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            getDevParam:true,
            devSN: that.ActiveDevice.dev_sn
          }),
          Api:"getDevParam",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data[0];
            if(data.dev_push_enable == '0' && data.dev_push_status == '0'){  //推流开关
              that.dev_push_enable = false;
            }else if(data.dev_push_enable == '1'){
              that.dev_push_enable = true;
            }else{
              that.dev_push_enable = false;
            }
            that.$emit('childFn',{"dev_push_enable":that.dev_push_enable})
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //URL地址nEnable
      changeUrlEnable(item){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            UrlcheckEnable: true,
            id: item.id,
            nEnable: item.enable?1:0,

          }),
          Api:"UrlcheckEnable",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //拉流地址enable
      changePullUrlEnable(item){
        console.log("changePullUrlEnable")
        var that= this;
        var urlData = this.addressPull;
        console.log(urlData)
        for(var i=0; i<urlData.length; i++){
          if(urlData[i].url_enable == '1'){
            urlData[i].enable = false;
            that.editPullUrlFn(urlData[i].dev_sn,urlData[i].url_id,['url_enable'],['0']);
          }
        }
        if(item.enable == true){
          this.editPullUrlFn(item.dev_sn,item.url_id,['url_enable'],['1'],function(){
            that.getDevPullUrl();
          });   
        }
      },
      //编辑拉流地址参数，多个 colArr:['',''] valueArr:['','']
      editPullUrlFn(devSn,urlId,colArr,valueArr,callback){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editPullUrl : true,
            devSn : devSn,
            urlId : urlId,
            colArr : colArr,
            valueArr : valueArr,
          }),
          Api:"editPullUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            if(typeof(callback) == 'function'){
              callback(res);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //修改视频源
      changeVideoSource(){
        var urlId = this.activePushObj.id;
        var sourceIndex = this.activePushObj.videoSource;
        this.editUrl(urlId,'sourceIndex',sourceIndex);
      },
      //修改地址类型
      changeAddressType(){
        if(this.activePushObj.addressType == 0){
          this.show.rtmp_url = true;
          this.show.srt_url = false;
        }else{
          this.show.rtmp_url = false;
          this.show.srt_url = true;
        }
      },
      //数据库编辑url
      editUrl(id, col, value) {
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editUrl : id,
            col : col,
            value : value
          }),
          Api:"editUrlStatus",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      delUrl(item) {
        var that = this;
        this.$messagebox.confirm("确定删除该推流地址?").then(
          action => {
            this.$axios({
              method: 'post',
              url:"/page/index/indexData.php",
              data:this.$qs.stringify({
                delUrl:item.id
              }),
              Api:"delUrl",
              AppId:"android",
              UserId:that.user.id
            })
            .then(function (response) {
              let res = response.data;
              if(res.res.success){
                that.$toast({
                  message: '操作成功'
                });
                that.getPushUrl();
              }else{
                that.$toast({
                  message: '操作失败'
                });
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        });
      },
      delPullUrl(item){
        var that = this;
        this.$messagebox.confirm("确定删除该拉流地址?").then(
          action => {
            that.editPullUrlFn(item.dev_sn,item.url_id,['input_url'],[''],function(res){
            that.$toast({
              message: '删除成功！',
              position: 'middle',
              duration: 2000
            }); 
            that.getDevPullUrl();
          });
        });
      },
      showEditUrls(obj, index){
        console.log("showEditUrls")
        console.log(this.workMode)
        var that = this;
        this.pushUrlsEditVisible = true;
        //推流还是拉流
        if(this.workMode=="推流"){
          var isSrt = obj.push_url.indexOf('srt://');
          //虚拟接收机或SRT，只支持背包透传
          if((this.ActiveDevice.board_id && this.ActiveDevice.board_id.length == 10) || isSrt>=0){    
            this.videoSource = this.OPTIONS_URL_SOURCE1;
            this.activePushObj.sourceIndex = 1;
          } else{
            this.videoSource = this.OPTIONS_URL_SOURCE;
            this.activePushObj.sourceIndex = obj.sourceIndex;
          }
          //推流
          this.activePushObj.urlId = obj.id;
          this.activePushObj.rcvSn = obj.rcv_sn;
          this.activePushObj.boardID = obj.board_id;
          this.activePushObj.urlType = "推流地址";
          if(obj.url_type == 1){
            //提取srt地址参数
            this.getSrtParam(obj.push_url);
            this.activePushObj.push_srt_url = obj.push_url;
            this.activePushObj.push_url = "";
          } else{
            this.activePushObj.push_srt_url = "";
            this.activePushObj.push_url = obj.push_url;
          }
          if(!lockState && !dev_push_enable){
            this.showSubmitBtn = true;
          }else{
            this.showSubmitBtn = false;
          }
        }
        else if(this.workMode=="拉流"){
          console.log("laliu")
          console.log(obj)
          //拉流
          this.activePushObj.pull_urlId = obj.url_id;
          this.activePushObj.pull_devSn = obj.dev_sn;
          this.activePushObj.urlType = "拉流地址";
        
          if(obj.url_type == 1){
            //提取srt地址参数
            this.getSrtParam(obj.input_url);
            this.activePushObj.push_srt_url = obj.input_url;
            this.activePushObj.push_url = "";
          }
          else {
            this.activePushObj.push_srt_url = "";
            this.activePushObj.push_url = obj.input_url;
          }
          if(!this.lockState){
            this.showSubmitBtn = true;
          }else{
            this.showSubmitBtn = false;
          }
        }
        this.activePushObj.addressType = obj.url_type?obj.url_type:0;
        this.changeAddressType();
        this.activePushObj.url_error = "";
        this.activePushObj.remark = obj.remark==""?("推流地址"+(index*1+1)):obj.remark;
      },
      //提取SRT拉流地址参数
      getSrtParam(url){
        var latency = 200;
        var passphrase = '';
        var pbkeylen = 32;
        var streamid = '';
        if(url.indexOf('?') >= 0){
          //处理多个问号
          var nIndex = url.indexOf('?');
          var urlParam = url.substring(nIndex+1,url.length);
          var paramArr = [];
          if(urlParam.indexOf('&') >= 0){
            paramArr = urlParam.split('&');
          }
          else {
            paramArr.push(urlParam);
          }
          for(var i=0; i<paramArr.length; i++){
            //延时
            if(paramArr[i].indexOf('latency') >= 0){
              latency = paramArr[i].split('=')[1];
            }
            //密码
            if(paramArr[i].indexOf('passphrase') >= 0){
              passphrase = paramArr[i].split('=')[1];
            }
            //键长
            if(paramArr[i].indexOf('pbkeylen') >= 0){
              pbkeylen = paramArr[i].split('=')[1];
            }
            //流ID
            if(paramArr[i].indexOf('streamid') >= 0){
              nIndex = paramArr[i].indexOf('=');
              streamid = paramArr[i].substring(nIndex+1,paramArr[i].length);
            }
          }
        }
        this.activePushObj.srt_latency = latency;
        this.activePushObj.srt_passphrase = passphrase;
        this.activePushObj.pbkeylen_sel = pbkeylen;
        this.activePushObj.srt_streamID = streamid;
        
      },
      hideEditUrls(){
        this.pushUrlsEditVisible = false;
        this.activePushObj = {};
      },
      savePushUrl(){
        var that = this;
        var urlId = this.activePushObj.urlId;
        var rcvSn = this.activePushObj.rcvSn;
        var boardID = this.activePushObj.boardID;
        var url = '';
        var remark = this.activePushObj.remark;
        var urlType = this.activePushObj.addressType;
        var srtLtcy = this.activePushObj.srt_latency;
        var srtPass = this.activePushObj.srt_passphrase;
        var srtKeylen = this.activePushObj.pbkeylen_sel;
        var srtSid = this.activePushObj.srt_streamID;
        //推流类型
        if(urlType == 0){//RTMP
          url = this.activePushObj.push_url;
        } else {//SRT
          url = this.activePushObj.push_srt_url;
          //拼接地址
          var suburl = '';//地址?前的内容
          var newurl = '';//拼接后的地址
          if(url.indexOf('?') >= 0){
            suburl = url.split('?')[0];
          } else{
            suburl = url;
          }
          newurl += suburl + '?';
          //延时
          if(srtLtcy != '' && srtLtcy != '200'){
            if(!this.$global.isValidActLatency(srtLtcy)){
              that.$toast({
                message: '延时50-3000ms',
                position: 'middle',
                duration: 2000
              });
              return;
            }
            newurl += 'latency='+srtLtcy+'&';
          }
          //密码 键长
          if(srtPass != ''){
            newurl += 'passphrase='+srtPass + '&pbkeylen='+srtKeylen+'&';
          }
          //流id
          if(srtSid != ''){
            newurl += 'streamid='+srtSid;
          }
          //去掉末尾的 & ?
          if(newurl.substr(newurl.length-1,1) == '&'){
            newurl = newurl.substr(0,newurl.length-1);
          }
          if(newurl.substr(newurl.length-1,1) == '?'){
            newurl = newurl.substr(0,newurl.length-1);
          }
          url = newurl;
        }
        var result = this.$global.checkUrl(url);
        if (result != '') {
          this.activePushObj.url_error = result;
          return;
        }
        //重复判断
        var datas = this.address;
        for (var i = 0; i < datas.length; i++) {
          if ( datas[i].push_url == url && datas[i].id != urlId) {
            that.$toast({
              message: '推流地址重复！',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if (datas[i].remark != '' && datas[i].id != urlId && datas[i].remark == remark) {
            that.$toast({
              message: '推流地址备注重复！',
              position: 'middle',
              duration: 2000
            });
            return;
          }
        }
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editUrlRemark:urlId,
            rcvSn: rcvSn,
            boardId: boardID,
            url: url,
            remark: remark
          }),
          Api:"editUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$global.getPushUrls(that.formatPushUrls);
            that.pushUrlsEditVisible = false;
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
            that.$global.getPushUrls(that.formatPushUrls);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      savePullUrl(){
        var that = this;
        var urlId = this.activePushObj.pull_urlId;
        var devSn = this.activePushObj.pull_devSn;
        var url = '';
        var remark = this.activePushObj.remark;
        var cardId = this.$global.cardEnum2Id(this.cardId);
        var urlType = this.activePushObj.addressType;
        var srtLtcy = this.activePushObj.srt_latency;
        var srtPass = this.activePushObj.srt_passphrase;
        var srtKeylen = this.activePushObj.pbkeylen_sel;
        var srtSid = this.activePushObj.srt_streamID;
        //拉流类型
        if(urlType == 0){//RTMP
          url = this.activePushObj.push_url;
        }else { //SRT
          url = this.activePushObj.push_srt_url;
          //拼接地址
          var suburl = '';//地址?前的内容
          var newurl = '';//拼接后的地址
          if(url.indexOf('?') >= 0){
            suburl = url.split('?')[0];
          } else{
            suburl = url;
          }
          newurl += suburl + '?';
          //延时
          if(srtLtcy != '' && srtLtcy != '200'){
            if(!this.$global.isValidActLatency(srtLtcy)){
              that.$toast({
                message: '延时50-3000ms',
                position: 'middle',
                duration: 2000
              });
              return;
            }
            newurl += 'latency='+srtLtcy+'&';
          }
          //密码 键长
          if(srtPass != ''){
            newurl += 'passphrase='+srtPass + '&pbkeylen='+srtKeylen+'&';
          }
          //流id
          if(srtSid != ''){
            newurl += 'streamid='+srtSid;
          }
          //去掉末尾的 & ?
          if(newurl.substr(newurl.length-1,1) == '&'){
            newurl = newurl.substr(0,newurl.length-1);
          }
          if(newurl.substr(newurl.length-1,1) == '?'){
            newurl = newurl.substr(0,newurl.length-1);
          }

          url = newurl;
        }

        var result = this.$global.checkUrl(url);
        if (result != '') {
          this.activePushObj.url_error = result;
          return;
        }

        //重复判断
        var datas = this.addressPull;
        for (var i = 0; i < datas.length; i++) {
          if ( datas[i].input_url == url && url != '' && datas[i].url_id != urlId) {
            layer.tips('拉流地址重复！', '#url_ok');
            that.$toast({
              message: '拉流地址重复！',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if (datas[i].remark != '' && datas[i].remark == remark && datas[i].url_id != urlId) {
            that.$toast({
              message: '拉流地址备注重复！',
              position: 'middle',
              duration: 2000
            });
            return;
          }
        }
        //写数据库
        var colArr = ['input_url','remark','card_id','url_type'];
        var valArr = [url,remark,cardId,urlType];
        this.editPullUrlFn(devSn, urlId, colArr, valArr, function(res) {
          if (res.res.success) {
            that.pushUrlsEditVisible = false;
            that.getDevPullUrl();
          } else {
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
          }
        });
      },
      saveEditUrls(){
        if(this.workMode == "推流"){
          this.savePushUrl();
        }else if(this.workMode == "拉流"){
          this.savePullUrl();
        }
      },
    }
  }
  
</script>

<style scoped>
   
</style>
<style>
  .addressGroup{
    /* border-top: 2px solid #DDDDDD; */
    margin: 0;
    padding: .05rem .1rem;
    margin-bottom: .2rem;
  }
  .address{
    color: #EEEEEE;
    line-height: .4rem;
    overflow: hidden;
    border-bottom: 1px solid #333;
    padding: 0.06rem 0;
  }
  .address:last-child{border-bottom: none;}
  .address .title{
    float: left;
    word-break: break-all;
    /*width: 60%;*/
  }
  .address .title p{
    font-size: .16rem;
    text-indent: .2rem;
    font-weight: 500;
  }
  .addressTitleLineH{
    line-height: .22rem;
  }
  .address .title .addressUrl{
    font-size: .14rem;
    font-weight: 300;
  }
  .address .buttons{
    float: left;
    width: 32%;
    padding-right: 2%;
    text-align: right;
  }
  .iconBtn{
    cursor: pointer;
    font-size: .21rem;
    margin-right: .1rem;
    margin-top: .08rem;
  }
  .widthPart{
    width:65%;
  }
  .pushurl .mint-popup{
    width:90%;
  }
  .pushurl .modalTitle{
    padding: .1rem;
    font-size: .13rem;
    font-weight: 500;
    line-height: .14rem;
  }
  .pushurl .closeBtn{
    float: right;
    margin-right: 0;
    display: inline-block;
    margin-top: -2px;
    color: #F33;
  }
  .formContainer{
        padding: .1rem;

    }
    .formItem{
        overflow: hidden;
        margin-bottom: .1rem;
    }
    .formItemTitle{
        float:left;
        width: 25%;
        color: #333;
        line-height: .28rem;
        font-size: .13rem;
        text-align: right;
        margin-right: 5%;
    }
    .formItemVal{
        float: left;
        width: 70%;
    }
    .formItemVal input[type=text]{
        display: inline-block;
        width: 93%;
        background: #FFFFFF;
        border: 1px solid #ccc;
        color: #333333;
        height: .24rem;
        line-height: .24rem;
        font-size: .13rem;
        outline:none;
        border-radius: 4px;
    }
    .modalBtn{
        width: .6rem;
        border: none;
        outline: none;
        box-shadow: none;
        height: .26rem;
        margin-top: .02rem;
        margin-right: .05rem;
    }
    .ItemSelect2{
      width: 100%;
      height: .26rem;
      border: 1px solid #3d81f1;
      outline: none;
      box-shadow: none;
      border-radius: 5px;
      font-size: .12rem;
      background-color: #fff;
      color: #000;
    }
    .pushEditModal .mint-radiolist .mint-radio-label{
      color:#000;
    }
</style>