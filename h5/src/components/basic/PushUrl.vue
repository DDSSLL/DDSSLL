<template>
  <div class="pushurl">
    <div class="GroupItem">
      <div class="GroupItemField" v-if="workMode==0"><!-- 推流 -->
        <div class="GroupItemTitle">推流地址</div>
        <div style="display:inline-block;line-height:.3rem;" v-if="show.showAddUrl">
          <i class="titleIcon fa fa-plus fa-large" @click="clickAddUrl"></i>
        </div>
      </div>
    </div>
    <div class="addressGroup">
      <div v-if="workMode==0"><!-- 推流 -->
        <template v-for="(item,i) in address">
          <div class="address" :key="i">
            <mt-switch v-model="item.enable" style="display: inline-block;vertical-align: middle;transform: scale(0.6);float:left" @change="changeUrlEnableFun(item)" :disabled="dis.urlEditable"></mt-switch>  
            <div class="title widthPart">
              <p :class="[item.push_url?'addressTitleLineH':'',item.remarkColor]">{{ item.remark?item.remark : "推流地址"+(i+1) }}</p>
              <p :class="[item.push_url ? 'addressTitleLineH' : '', 
              item.push_status == 'running' ? 'pushStyle' : (item.push_status == '' ? 'defaultStyle' : 'errStyle')]" class="addressUrl" v-if="item.push_url">{{ item.push_url }}</p>
            </div>
            <div class="buttons">
              <!-- <mt-switch v-model="item.enable" style="display: inline-block;vertical-align: middle;transform: scale(0.6);" @change="changeUrlEnable4000(item)"></mt-switch>   -->
              <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true" @click="showEditUrls(item,i)"></i>
              <i class="iconBtn fa fa-trash-o" aria-hidden="true" @click="clickTrash(item)" :style="{display:(show.delShow?'inline-block':'none')}"></i>
            </div>
          </div>
        </template>
      </div>
      <div v-if="workMode==1"><!-- 拉流 -->
        <template v-for="(item,i) in addressPull">
          <div class="address" :key="i">
            <mt-switch v-model="item.enable" style="display: inline-block;vertical-align: middle;transform: scale(0.6);;float:left" @change="changePullUrlEnable(item)" :disabled="dis.pullUrlEditable"></mt-switch>  
            <div class="title widthPart">
              <p :class="[item.input_url?'addressTitleLineH' : '',item.remarkColor]">{{ item.remark?item.remark : "拉流地址"+(i+1)}}</p>
              <p :class="[item.input_url ? 'addressTitleLineH' : '', 
              item.push_status == 'running' ? 'pushStyle' : (item.push_status == '' ? 'defaultStyle' : 'errStyle')]" class="addressUrl" v-if="item.input_url">{{ item.input_url }}</p>
            </div>
            <div class="buttons">
              <i class="iconBtn fa fa-pencil-square-o" aria-hidden="true" @click="showEditUrls(item,i)"></i>
              <i class="iconBtn fa fa-trash-o" aria-hidden="true" @click="delPullUrl(item)" :style="{display:(show.pullDelShow?'inline-block':'none')}"></i>
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
            <div class="formItem" v-if="workMode == 0">
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
                  <mt-field label="" placeholder="" type="textarea" rows="3" v-model="activePushObj.push_srt_url"  @change="getSrtParam(activePushObj.push_srt_url)"></mt-field>
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
            <div class="formItem" style="text-align: right;margin-bottom: 0;" v-if="show.showSubmitBtn">
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
    props:['lockState','transMode'/*,'cardId'*/],
    data(){
      return{
        SUPER:SUPER,
        ADMIN:ADMIN,
        PRA_RCV:PRA_RCV,
        VIR_RCV:VIR_RCV,
        R1080_RCV:R1080_RCV,
        workMode:"",
        URL_MAX:5,
        mode:"",
        curDevSeries:"",
        address:[],
        addressPull:[],
        rcv_board_param:"",
        dev_push_enable:"",
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
          showAddUrl:true,
          delShow:true,
          pullDelShow:true,
          showSubmitBtn:true,
        },
        dis:{
          urlEditable:false,
          
        },
        pullUrlEditable:false,
        /*common:{
          WorkMode:"",
          transMode:"",
          PushCard:"",
        },*/
        pushUrlsEditVisible:false,
        OPTIONS_URL_SOURCE: [{text: "自动",value: "0"}],
        OPTIONS_URL_SOURCE1: [{text: "源1(背包透传)",value: "1"}],
        OPTIONS_URL_SOURCE2: [{text: "源1(背包透传)",value: "1"},
                              {text: "源2(板卡转码)",value: "2"}],
        OPTIONS_ADDRESS_TYPE: [{label: "RTMP",value: "0"}, 
                              {label: "SRT",value: "1"}],
      }
    },
    computed: {
      ...mapState(['user','ActiveDevice'])
    },
    created(){  //生命周期-页面创建后
      var that = this;
    },
    activated(){
      var that = this;
      this.$global.getDevOneParam(this.ActiveDevice.dev_sn, 'WorkMode', function(data) {
        that.workMode = data.WorkMode;
        //this.mode = this.workMode;
        clearInterval(localStorage.getPushUrl)
        clearInterval(localStorage.getPullUrl)
        localStorage.removeItem('getPushUrl');
        localStorage.removeItem('getPullUrl');
        that.getURL();
      })
      
    },
    deactivated(){   //生命周期-缓存页面失活
      clearInterval(localStorage.getPushUrl);
      clearInterval(localStorage.getPullUrl);
      localStorage.removeItem('getPushUrl');
      localStorage.removeItem('getPullUrl');
      clearInterval(this.getPushUrlInterval);
    },
    watch:{
      '$store.state.ActiveDevice.dev_sn': {
        immediate: true,
        handler(val) {
          var that = this;
          this.$global.getDevOneParam(this.ActiveDevice.dev_sn, 'WorkMode', function(data) {
            that.workMode = data.WorkMode;
            clearInterval(localStorage.getPushUrl);
            clearInterval(localStorage.getPullUrl);
            localStorage.removeItem('getPushUrl');
            localStorage.removeItem('getPullUrl');
            that.curDevSeries = that.$global.getDevSeries(that.ActiveDevice.dev_sn);
            that.curRcvSeries = that.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
            that.getURL();
          })
        }
      },
      '$store.state.ActiveDevice.rcv_sn': {
        immediate: true,
        handler(val) {
          var that = this;
          that.curRcvSeries = that.$global.getRcvSeries(that.ActiveDevice.rcv_sn);
        }
      }
    },
    methods:{
      ...mapMutations({
        SET_ACTIVE_DEVICE
      }),
      clickAddUrl(){
        this.show.showAddUrl = false;
        this.getRcvParam();
      },
      //获取接收机相关数据
      getRcvParam() {
        var that = this;
        //当前选中行的接收机板卡
        var selRcvSn = that.ActiveDevice.rcv_sn;
        var selBoardId = that.ActiveDevice.board_id;
        that.$global.getRcvRights(selRcvSn, selBoardId, function(data) {
          for (var i = 0; i < data.length; i++) {
            //接收机sn_板卡id_boardListId_操作权限_查看权限
            var value = data[i].value;
            if (value.split('_')[0] == selRcvSn && value.split('_')[1] == selBoardId) {
              that.rcv_board_param = value;
              //根据权限设置控件是否禁用
              break;
            }
          }
          that.addUrl();
        });
      },
      //点击添加URL
      addUrl() {
        var that = this;
        if (that.address.length >= that.URL_MAX) {
          that.$toast({
            message: "已达添加上限!",
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var boardListId = (that.rcv_board_param?that.rcv_board_param.split("_")[2]:-1);
        var rcvSn = (that.rcv_board_param?that.rcv_board_param.split("_")[0]:-1);
        var boardId = (that.rcv_board_param?that.rcv_board_param.split("_")[1]:that.ActiveDevice.dev_sn)
        var devSn = that.ActiveDevice.dev_sn;
        var pushUrl = "";
        that.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            addUrl: devSn,
            rcvSn : rcvSn,
            boardId : boardId,
            url : pushUrl,
          }),
          Api:"addUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            
            /*that.show.showAddUrl = true;*/
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      getURL(){
        if(this.workMode == "0"){
          this.getPushUrl();
        }else{
          //this.getDevPullUrl();
          this.getPullUrl();
        }
      },
      getPushUrl(){
        var that = this;
        //that.address = [];
        that.$global.getPushUrls(that.formatPushUrls);
        if(localStorage.getPushUrl){
          clearInterval(localStorage.getPushUrl)
        }else{
          localStorage.getPushUrl = setInterval(function(){
            that.$global.getPushUrls(that.formatPushUrls);  
            that.getPushParam();
          },500)
        }
      },
      getPullUrl(){
        var that = this;
        //that.addressPull = [];
        that.getDevPullUrl();
        if(localStorage.getPullUrl){
          clearInterval(localStorage.getPullUrl)
        }else{
          localStorage.getPullUrl = setInterval(function(){
            that.getDevPullUrl();
            that.getPushParam();
          },500)
        }
      },
      formatPushUrls(data){
        var that = this;
        for(let i=0; i<data.length; i++){
          data[i].remarkColor = 'grayColor';
          if(this.dev_push_enable){
            if(data[i]['push_status'] == 'running'){
              data[i].remarkColor = 'greenColor';
            }else if(data[i].push_status == ''){
              data[i].remarkColor = 'grayColor';
            }else{
              //data[i].push_url += ('(' + data[i].push_status + ')');
              data[i].remark += ('(error:' + data[i].push_status + ')');
              data[i].remarkColor = 'redColor';
            }  
          }
          var disFlag = false;
          //if(that.curDevSeries=="1080"){
            //单卡推流
            if((that.curDevSeries=="1080") && that.transMode=="1"){
              if (data[i].oneCardEnable == 1){//设置选中
                data[i]["enable"] = true;//设置选中
              }else{
                data[i]["enable"] = false;
              }
            } else {
              //汇聚
              if (data[i].push_sel == 1){
                data[i]["enable"] = true;//设置选中
              }else{
                data[i]["enable"] = false;
              }
            }
          /*}else if(that.curDevSeries=="4000"){
            if (data[i].nEnable == 1){
              data[i]["enable"] = true;
            }else{
              data[i]["enable"] = false;
            }
          }*/
        }
        that.address = data;
        if(data.length >= this.URL_MAX){
          that.show.showAddUrl = false;
        }else{
          that.show.showAddUrl = true;
        }
      },
      //获取背包拉流地址
      getDevPullUrl(){
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
        for(var i=0; i<data.length; i++){
          if(data[i]["url_enable"] == "1"){
            data[i]["enable"] = true;
          }else{
            data[i]["enable"] = false;
          }
          if (data[i].enable == true) {
            data[i].remarkColor = 'grayColor';
            var text = data[i].remark;
            if (text == "") {
              text = "拉流地址" + (i + 1);
            }
            if (data[i].pull_status == 'running') {
              data[i].remarkColor = 'greenColor'; //绿
            } else if (data[i].pull_status == '') {
              data[i].remarkColor = 'grayColor';
            } else if(data[i].pull_status == 'Closed'){
              data[i].remarkColor = 'redColor';
            }
          } else {
            data[i].remarkColor = 'grayColor';
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
            if(that.curDevSeries == "1080"){
              if(that.lockState){
                that.show.delShow = false;
                that.show.pullDelShow = false;
                that.show.showSubmitBtn = false;
                that.dis.urlEditable = true;
                that.pullUrlEditable = true;
                that.dis.pullUrlEditable = true;
              } else{
                if(data.WorkMode == 0){//推流
                  //单卡推流 推流中不能修改推流地址
                  if(that.transMode == 1 && that.dev_push_enable){
                    that.dis.urlEditable = true;
                    that.show.delShow = false;
                    that.show.showSubmitBtn = false;
                  }else{
                    that.dis.urlEditable = false;
                    that.show.delShow = true;
                    that.show.showSubmitBtn = true;
                  }
                }else if(that.workMode == 1){//"拉流"
                  if(that.dev_push_enable){
                    that.dis.pullUrlEditable = true;
                    that.show.pullDelShow = false;
                    that.show.showSubmitBtn = false;
                  }else{
                    that.dis.pullUrlEditable = false;
                    that.show.pullDelShow = true;
                    that.show.showSubmitBtn = true;
                  }
                }
              } 
            }else if(that.curDevSeries == "4000"){
              if(that.lockState){
                that.show.delShow = false;
                that.show.showSubmitBtn = false;
              }else{
                that.show.delShow = true;
                that.show.showSubmitBtn = true;
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //URL地址nEnable
      changeUrlEnableFun(item){
        var that = this;
        //锁定或推流中
        if(this.lockState){
          this.$toast({
            message: '请先解锁！',
            position: 'middle',
            duration: 2000
          });
          that.$global.getPushUrls(that.formatPushUrls); 
          return;
        }
        //地址为空
        if (item.push_url == '') {
          this.$toast({
            message: '请先输入推流地址！',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        var checked = item.enable;
        if(checked){//check
          if(this.curDevSeries=="1080"){
            var cur_row_enable  = false;
            //单卡推流
            if(this.transMode == '1'){
              var len = this.address.length;
              for(var i=0; i<len; i++){
                if(this.address[i].oneCardEnable == 1){//表示选中此推流地址之前本身就有选中的推流地址
                  cur_row_enable  = true;
                  //this.editUrl(that.address[i].id, 'oneCardEnable', '0');
                }
              }
              if(cur_row_enable && this.dev_push_enable){
                var text = '单卡模式下仅支持1路推流地址，确认需要切换该推流地址？';
                this.$messagebox.confirm(text).then(
                  action => {
                    for(var j=0; j<len; j++){
                      if(this.address[j].oneCardEnable == 1){
                        this.editUrl(that.address[j].id, 'oneCardEnable', '0');
                      }
                    }
                    this.editUrl(item.id, 'oneCardEnable', '1');
                  }
                );
              }else{
                for(var k=0; k<len; k++){
                  if(this.address[k].oneCardEnable == 1){
                    this.editUrl(this.address[k].id, 'oneCardEnable', '0');
                  }
                }
                this.editUrl(item.id, 'oneCardEnable', '1');
              }
            } else{//多卡汇聚
              this.editUrl(item.id, 'push_sel', '1');
            }  
          }
          if(this.curRcvSeries != VIR_RCV && this.ActiveDevice.rcv_sn.substr(-4) != 2162){//实体接收机且不是公检法
            //srt只能生效一个
            var datas = this.address;
            var srt = 0;
            for (var i = 0; i < datas.length; i++) {
              if (datas[i].id == item.id) {
                continue;
              }
              if (datas[i].push_url.indexOf('srt://') != -1 && datas[i].push_sel == '1') {
                srt++;
              }
            }
            if (item.push_url.indexOf('srt://') != -1 && srt > 0) {
              that.$toast({
                message: 'srt只能生效一个！',
                position: 'middle',
                duration: 2000
              });
              setTimeout(function(){
                item.enable = false;
              },500)
              return;
            }
          }
          //开启
          this.editUrl(item.id, 'push_sel', 1);//push_sel:1
          //刷新表格
          item.push_sel = 1;
          item.push_status = '';
        }else{//uncheck
          if(this.dev_push_enable == true){
            var text = '正在推流中，确认需要取消推流地址吗？';
            this.$messagebox.confirm(text).then(
              action => {
                if(this.curDevSeries == "1080"){
                  //单卡推流
                  if(this.transMode == '1'){
                    this.editUrl(item.id, 'oneCardEnable', '0');
                  } else{
                    this.editUrl(item.id, 'push_sel', '0');
                  }  
                }else if(this.curDevSeries == "4000"){
                  //停止
                  this.editUrl(item.id, 'push_sel', '0');//push_sel:0
                }
              }
            );
          }else{
            if(this.curDevSeries == "1080"){
              //单卡推流
              if(this.transMode == "1"){
                this.editUrl(item.id, 'oneCardEnable', '0');
              } else{
                this.editUrl(item.id, 'push_sel', '0');
              }  
            }else if(this.curDevSeries == "4000"){
              //停止
              this.editUrl(item.id, 'push_sel', '0');//push_sel:0
            }
          }
        }
      },
      //单卡推流地址使能
      checkOneCardEnable(rowId, flag){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            UrlOneCardEnable: true,
            id : rowId,
            nEnable : flag,
          }),
          Api:"UrlOneCardEnable",
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
      changeUrlEnable4000(item){
        if( this.lockState || this.dev_push_enable){
          this.$toast({
            message: '请先解锁或停止推流！',
            position: 'middle',
            duration: 2000
          });
          return;
        }
      },
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
        var that= this;
        var checked = item.enable;
        if(checked){//CHECK
          //地址为空
          if (item.input_url == '') {
            this.$toast({
              message: '请先输入拉流地址！',
              position: 'middle',
              duration: 2000
            });
            setTimeout(function(){
              item.enable = false;
            },500)
            return; 
          }
          var urlData = this.addressPull;
          //只能勾选一个
          for(var i=0; i<urlData.length; i++){
            if(urlData[i]["input_url"] == item.input_url){
              continue;
            }
            if(urlData[i].enable == true){
              urlData[i].enable = false;
              that.editPullUrlFn(urlData[i].dev_sn,urlData[i].url_id,['url_enable'],['0']);
            }
          }
          that.editPullUrlFn(item.dev_sn,item.url_id,['url_enable'],['1']);  
        }else{//UNCHECK
          that.editPullUrlFn(item.dev_sn,item.url_id,['url_enable'],['0']);
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
        var urlId = this.activePushObj.id;
        if(this.activePushObj.addressType == 0){
          this.show.rtmp_url = true;
          this.show.srt_url = false;
        }else{
          this.show.rtmp_url = false;
          this.show.srt_url = true;
        }
        var rcvType = this.$global.getRcvSeries(this.ActiveDevice.rcv_sn);
        if(rcvType == this.PRA_RCV){//实体接收机 srt:源1，rtmp:自动
          if(this.activePushObj.addressType == 0){//rtmp
            this.videoSource = this.OPTIONS_URL_SOURCE;
            this.activePushObj.sourceIndex = 0;
            this.editUrl(urlId,'sourceIndex',0);
          }else{
            this.videoSource = this.OPTIONS_URL_SOURCE1;
            this.activePushObj.sourceIndex = 1;
            this.editUrl(urlId,'sourceIndex',1);
          }
        }else if(rcvType == this.R1080_RCV){//2010R--源1，源2，默认源2
          this.videoSource = this.OPTIONS_URL_SOURCE2;
          if(this.activePushObj.sourceIndex == 0){
            this.activePushObj.sourceIndex = 2;
            this.editUrl(urlId,'sourceIndex',2);
          }
        }else{//虚拟接收机或无接收机--源1
          this.videoSource = this.OPTIONS_URL_SOURCE1;
          this.activePushObj.sourceIndex = 1;
          this.editUrl(urlId,'sourceIndex',1);
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
      clickTrash(item){
         this.delUrl(item.id, item.enable);
        /*if(this.curDevSeries == "1080"){
          this.delUrl(item.id);
        }else if(this.curDevSeries == "4000"){
          if (item.enable){
            this.$toast({
              message: '请先取消勾选再进行删除！',
              position: 'middle',
              duration: 2000
            });
            return;
          }else{
            this.delUrl(item.id);
          }
        }*/
      },
      delUrl(delId, enable) {
        var that = this;
        if(this.dev_push_enable == true){
          if (enable){//直播中，正在推流的地址删除要提示
            var text = "正在推流中，确定需要删除该地址？"
            this.$messagebox.confirm(text).then(
              action => {
                this.delUrlApiFn(delId)
              }
            );
          }else{//直播中未推流的地址直接删除
            var text = "确定删除该地址？"
            this.$messagebox.confirm(text).then(
              action => {
                this.delUrlApiFn(delId)
              }
            );
          }
        }else{//未直播,可直接删除，无需提示
          var text = "确定删除该地址？"
          this.$messagebox.confirm(text).then(
            action => {
              this.delUrlApiFn(delId)
            }
          );
        }
      },
      delUrlApiFn(delId){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            delUrl:delId
          }),
          Api:"delUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.$toast({
              message: '删除成功！',
              position: 'middle',
              duration: 2000
            });
            //that.getPushUrl();
          }else{
            that.$toast({
              message: '删除失败！',
              position: 'middle',
              duration: 2000
            });
          }
        })
        .catch(function (error) {
          console.log(error)
        })
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
        var that = this;
        this.pushUrlsEditVisible = true;
        //推流还是拉流
        if(this.workMode == 0){
          /*var isSrt = obj.push_url.indexOf('srt://');
          //虚拟接收机或SRT，只支持背包透传
          if((this.ActiveDevice.board_id && this.ActiveDevice.board_id.length == 10) || isSrt>=0){    
            this.videoSource = this.OPTIONS_URL_SOURCE1;
            this.activePushObj.sourceIndex = 1;
          } else{
            this.videoSource = this.OPTIONS_URL_SOURCE;
            this.activePushObj.sourceIndex = obj.sourceIndex?obj.sourceIndex:0;
          }*/
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
          if(!this.lockState && !this.dev_push_enable){
            this.show.showSubmitBtn = true;
          }else{
            this.show.showSubmitBtn = false;
          }
        }
        else if(this.workMode==1){
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
            this.show.showSubmitBtn = true;
          }else{
            this.show.showSubmitBtn = false;
          }
        }
        this.activePushObj.addressType = obj.url_type?obj.url_type:0;
        this.activePushObj.sourceIndex = obj.sourceIndex;
        this.changeAddressType();
        this.activePushObj.url_error = "";
        if(this.workMode==1){//拉流
          this.activePushObj.remark = obj.remark==""?("拉流地址"+(index*1+1)):obj.remark;
        }else{
          this.activePushObj.remark = obj.remark==""?("推流地址"+(index*1+1)):obj.remark;
        }
        
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
        var urlAddress = '';
        var remark = this.activePushObj.remark;
        var urlType = this.activePushObj.addressType;
        var srtLtcy = this.activePushObj.srt_latency;
        var srtPass = this.activePushObj.srt_passphrase;
        var srtKeylen = this.activePushObj.pbkeylen_sel;
        var srtSid = this.activePushObj.srt_streamID;
        //推流类型
        if(urlType == 0){//RTMP
          urlAddress = this.activePushObj.push_url.trim();
        } else {//SRT
          urlAddress = this.activePushObj.push_srt_url.trim();
          //拼接地址
          var suburl = '';//地址?前的内容
          var newurl = '';//拼接后的地址
          if(urlAddress.indexOf('?') >= 0){
            suburl = urlAddress.split('?')[0];
          } else{
            suburl = urlAddress;
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
          urlAddress = newurl;
        }
        var result = this.$global.checkUrl(urlAddress);
        if (result != '') {
          that.$toast({
            message: result,
            position: 'middle',
            duration: 2000
          });
          if(this.show.srt_url){
            this.activePushObj.url_error = result;
          }
          return;
        }
        //重复判断
        var cur_row_enable  = false;
        var datas = this.address;
        if(remark == ""){
          that.$toast({
            message: '请填写推流地址备注名  ！',
            position: 'middle',
            duration: 2000
          });
          return;
        }
        for (var i = 0; i < datas.length; i++) {
          if (datas[i].remark != '' && datas[i].id != urlId && datas[i].remark == remark) {
            that.$toast({
              message: '推流地址备注重复！',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if ( datas[i].push_url == urlAddress && datas[i].id != urlId) {
            that.$toast({
              message: '推流地址重复！',
              position: 'middle',
              duration: 2000
            });
            return;
          }
          if(urlId == datas[i].id){
            if(datas[i].enable){
              cur_row_enable  = true;
            }
          }
        }
        if(remark.indexOf("error:") != -1){
          remark = remark.split("(error:")[0];
        }
        this.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'dev_push_enable', function(data) {
          if (data.dev_push_enable == '1') {//推流，互动传输开关开启
            if(cur_row_enable){//直播中正在推流的地址
              var text = '正在推流中，确定需要修改推流地址？';
              //询问
              that.$messagebox.confirm(text).then(
                action => {
                  that.editUrlRemark(urlId, rcvSn, boardID, urlAddress, remark, urlType)
                }
              );
            }else{//直播中未推流的地址
              //写数据库
              that.editUrlRemark(urlId, rcvSn, boardID, urlAddress, remark, urlType)
            }
          }else{
            //写数据库
            that.editUrlRemark(urlId, rcvSn, boardID, urlAddress, remark, urlType)
          }
        })
      },
      editUrlRemark(urlId, rcvSn, boardID, urlAddress, remark, urlType){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/indexData.php",
          data:this.$qs.stringify({
            editUrlRemark:urlId,
            rcvSn: rcvSn,
            boardId: boardID,
            url: urlAddress,
            remark: remark
          }),
          Api:"editUrl",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            that.pushUrlsEditVisible = false;
            that.editUrl(urlId, 'url_type', urlType) 
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
            //that.$global.getPushUrls(that.formatPushUrls);
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
        this.$global.getDevOneParam(that.ActiveDevice.dev_sn, 'dev_push_enable', function(data) {
          if (data.dev_push_enable == '1') {//推流，互动传输开关开启
            var text = '正在推流中，确定需要修改推流地址？';
            that.$messagebox.confirm(text).then(
              action => {
                //写数据库
                var colArr = ['input_url','remark','card_id','url_type'];
                var valArr = [url,remark,cardId,urlType];
                that.editPullUrlFn(devSn, urlId, colArr, valArr, function(res) {
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
              }
            );
          }else{
            //写数据库
            var colArr = ['input_url','remark','card_id','url_type'];
            var valArr = [url,remark,cardId,urlType];
            that.editPullUrlFn(devSn, urlId, colArr, valArr, function(res) {
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
          }
        });
      },
      saveEditUrls(){
        if(this.workMode == 0){
          this.savePushUrl();
        }else if(this.workMode == 1){
          this.savePullUrl();
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
            value : value,
          }),
          Api:"editUrlStatus",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            //that.$global.getPushUrls(that.formatPushUrls);
          }else{
            that.$toast({
              message: res.res.reason,
              position: 'middle',
              duration: 2000
            });
            //that.$global.getPushUrls(that.formatPushUrls);
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
    float: right;
    width: 17%;
    padding-right: 0;
    text-align: right;
  }
  .iconBtn{
    cursor: pointer;
    font-size: .21rem;
    margin-right: .1rem;
    margin-top: .08rem;
  }
  .widthPart{
    width:60%;
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
    .grayColor{
      color:#fff;
    }
    .greenColor{
      color:#2de505;
    }
    .redColor{
      color:#FF4D52;
    }
</style>