<template>
  <div class="roadTest">
    <div class="Group">
      <div class="GroupTitle" @click="RoadTestShow=!RoadTestShow;">
        路测
        <i class="titleIcon fa" :class="[RoadTestShow == true ? 'fa-chevron-up': 'fa-chevron-down']"></i>
      </div>
      <mt-button size="small" type="primary" @click="showRoadTestParam" style="margin: 5px  auto;display: inherit;">设置路测参数</mt-button>
      <!-- <transition name="slide-fade">
        <div class="GroupItem" v-if="RoadTestShow">
          <mt-navbar v-model="active">
            <mt-tab-item id="1">实时路测</mt-tab-item>
            <mt-tab-item id="2">导入路测</mt-tab-item>
          </mt-navbar>
          <mt-tab-container v-model="active" style="padding:2px 5px;">
            <mt-tab-container-item id="1">
              <div class="Group">
                <div class="GroupItem">
                  <mt-button size="small" type="primary" @click="testFileTransfer">下载</mt-button>
                  <div class="roadTestDevShow">
                    <mt-cell :title="'背包:'+roadTestDev.join(',')">
                      <i class="fa fa-chevron-down" @click.stop="testing?'':(roadTestPop = true)"></i>
                    </mt-cell>
                    <mt-button size="small" type="primary" @click="fileDownLoad">downLoad</mt-button>
                    <mt-cell style="width:35%;display:inline-block" v-if="roadTestDev.length != 0">
                      <mt-button size="small" type="primary" :disable="dis.startTestDis" @click="startRoadTest" v-if="!testing">开始路测</mt-button>
                      <mt-button size="small" type="primary" :disable="dis.startTestDis" @click="roadTestMapVisible = true" v-if="testing">查看路测</mt-button>
                    </mt-cell>
                  </div>
                </div>
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
              <div class="Group">
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle" style="width:65%">
                      <input type="file" name="myfiles[]" id="testCsv" multiple="multiple" size="100" accept=".csv" class="form-control textStyle" style="width:95%;text-indent:0px;">
                    </div>
                    <div class="GroupItemValue" style="width:35%" v-if="!testing">
                      <button style="font-size:.14rem" @click="importRoadTest" :disabled="dis.importTest">导入路测信息</button>
                    </div>
                  </div>
                </div>
              </div>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </transition> -->
    </div>
    <!-- 路测参数设置 -->
    <mt-popup v-model="roadTestParamVisible" popup-transition="popup-fade" class="roadTestParamPopup">
      <div class="popupContainer">
        <div class="popupTitle">
          路测参数设置
          <i class="popupCloseBtn fa fa-times" @click="roadTestParamVisible = false"></i>
        </div>
        <form action="" @submit.prevent="submitDeviceConfig">
          <div class="fGrp">
            <div class="tl">类型</div>
            <div class="vl">
              <select class="ItemSelect" v-model="roadTestType" @change="changeRroadTestType">
                <template v-for="(item,i) in ROAD_TEST_TYPE">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="roadTestType == 0">
            <div class="tl">背包</div>
            <div class="vl">
              <select class="ItemSelect" v-model="roadTestDev" @change="">
                <template v-for="(item,i) in roadTestDevOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="roadTestType == 0">
            <div class="tl">数据类型</div>
            <div class="vl">
              <select class="ItemSelect" v-model="roadTestDev" @change="">
                <template v-for="(item,i) in dateTypeOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="roadTestType == 0">
            <div class="tl">显示点数</div>
            <div class="vl">
              <select class="ItemSelect" v-model="roadTestDev" @change="">
                <template v-for="(item,i) in roadTestDevOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <!-- <div class="fGrp">
            <div class="tl">序列号</div>
            <div class="vl">
              <input type="text" class="ItemInput" v-model="options.devSn" required pattern="[0-9]{10}" title="10位数字序列号" :disabled="deviceConfigType == 'edit'"> 
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户组</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.prefix" :disabled="deviceConfigType == 'edit' && user.userGroup != ADMIN" @change="changePrefixFun">
                <template v-for="(item,i) in deviceConfigPrefixOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp">
            <div class="tl">用户</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.devUser" :disabled="deviceConfigType == 'edit' && user.userGroup != ADMIN">
                <template v-for="(item,i) in deviceConfigUserOptions">
                  <option :value="item.value">{{ item.text }}</option>
                </template>
              </select>
            </div>
          </div>
          <div class="fGrp" v-if="deviceConfigType == 'edit'">
            <div class="tl">汇聚服务器</div>
            <div class="vl">
              <select class="ItemSelect" v-model="options.server" style="margin-bottom: 5px;" @change="editMatchChange = true">
                <template v-for="(item,i) in deviceConfigServerOptions">
                  <option :value="item.value" :style="'color:'+item.color+''">{{ item.text }}</option>
                </template>
              </select>
              <button @click.prevent="editMatchRow" style="border:1px solid #666;">保存绑定</button>
              <button @click.prevent="deleteMatchRow" style="border:1px solid #666;">解除绑定</button>
            </div>
          </div>
          <div class="fGrp" style="text-align: right">
            <button class="modalBtn" @click="deviceConfigVisible = false" style="margin-right: .06rem;">取消</button>
            <button class="modalBtn" type="submit" style="background-color: #3d81f1;color:#fff;">确定</button>
          </div> -->
        </form>
      </div>
    </mt-popup>
    <!-- 路测地图 -->
    <mt-popup v-model="roadTestMapVisible" position="right" popup-transition="popup-slide" class="wholePagePop devAuthority">
      <div class="page-navbar">
        <div class="page-title">
          <i class="fa fa-arrow-left" aria-hidden="true" @click="roadTestMapVisible = false" style="position:absolute"></i>
          <div style="display:block">
            <div class="markIfo">
              <i class="fa fa-circle" aria-hidden="true" style="color:#00FF00"></i><span>正常</span>
              <i class="fa fa-circle" aria-hidden="true" style="color:#C5C5C5"></i><span>离线</span>
              <i class="fa fa-circle" aria-hidden="true" style="color:#FFA900"></i><span>停止推流</span>
              <i class="fa fa-circle" aria-hidden="true" style="color:#FF0000"></i><span>丢包</span>
            </div>
            <button @click="stopRoadTest" style="float: right;margin-top: -4px;" v-if="active==1">停止路測</button>  
          </div>
          
          <div style="position: absolute;top: 35px;z-index: 100;width: 100%;" v-if="active==1">
            <select class="ItemSelect2" v-model="followDev" style="width:35%;display:inline-block" @change="followDevChange">
              <template v-for="(item,i) in followDevOptions">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
            <select class="ItemSelect2" v-model="zoomDev" style="width:35%;display:inline-block;margin-left:10px;" @change="zoomDevChange">
              <template v-for="(item,i) in zoomDevOptions">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
          </div>
        </div>
        <div style="position: relative;"> 
          <div style="width: 100%; min-height:400px;" id="test_map"  :style="{'height': mapHeight - 35 + 'px'}"></div>
          <div class="gpsInfo" id="gpsInfo">
          </div>
        </div>
      </div>
    </mt-popup>

     <!-- 设备列表 -->
    <mt-popup v-model="roadTestPop" position="bottom" popup-transition="popup-slide" class="roadTestPop">
      <span class="chevronDown">
        <i class="fa fa-chevron-down" @click.stop="roadTestPop=false"></i>
      </span>
      <mt-checklist
        v-model="roadTestDev"
        :options="roadTestDevOptions"
        @change="changeRoadTestDev">
      </mt-checklist>
    </mt-popup>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import { } from '../../store/mutation-types';
  import $ from 'jquery';
  import { Indicator } from 'mint-ui';
  export default {
    name: "DevMan",
    data(){
      return{
        testing:false,//正在路测的标记位
        roadTestInterval:null,
        workerRoadTest:null,
        roadTestDotSum:0,
        IMPORTMAX:30,
        SHOWPOINT: 200,
        numMarkers:[],
        lastPonit:{},
        importEvent:false,
        testEvent:false,
        RoadTestShow:false,
        roadTestPop:false,
        roadTestMapVisible:false,//路测地图
        roadTestParamVisible:false,//路测参数设置页面
        active:"1",
        testMap:"",
        startTestDrawFlg:true,
        roadTestDev:[],
        roadTestDevOptions:[],
        followDev:[],
        followDevOptions:[],
        zoomDev:[],
        zoomDevOptions:[],
        devFocus:"",
        devFocusOptions:[],
        devZoom:"",
        devZoomOptions:[],
        dis:{
          roadTestDevDis:false,
          startTestDis:false,
          deleteTest:false,//删除路测
          importTest:false,
        },
        ROAD_TEST_TYPE:[{text:"实时路测",value:"0"},{text:"导入路测文件",value:"1"}],
        dateTypeOptions:[{text:"丢包率",value:"0"},{text:"丢包率+可变码率",value:"1"}],
        showPointOptions:[{text:"200",value:"200"},
                          {text:"400",value:"400"},
                          {text:"600",value:"600"},
                          {text:"1000",value:"1000"}],
        roadTestType:0,
        mapHeight:"",
        ISReload:false,
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
        }
      }
    },
    created(){  //生命周期-页面创建后
      console.log("roadTest created");
      var that = this;
      this.initOnlineDev(that.formatDevSelect);
      //this.initRoadTestMap();

      document.addEventListener("deviceready", function(){
        console.log("document click")
      });
    },
    activated(){
      console.log("roadTest activated");
      var that = this;
      this.initOnlineDev(that.formatDevSelect);
      //this.initRoadTestMap();

    },
    mounted(){
      console.log("roadTestDev mounted")
      //this.testFileTransfer();
      var that = this;
      document.addEventListener('deviceready', that.testFileTransfer, false);
       //延时100毫秒后进行重加载
      setTimeout(function() {
        if (!that.ISReload) {
            that.testFileTransfer();//重加载
        }
      },100)
    },
    methods:{
      ...mapMutations({
          
      }),
      changeRroadTestType(){

      },
      showRoadTestParam(){
        this.roadTestParamVisible = true;

      },
      testFileTransfer(){
        console.log("testFileTransfer")
        this.ISReload = true;
          console.log(FileTransfer)
          var file = new FileTransfer();
          console.log(file)

      },
      /*fileDownLoad(){
        var that = this;
        window.webkitRequestFileSystem(window.PERSISTENT, 0, function (fs) {
          alert('打开的文件系统: ' + fs.name);
          var url = 'http://www.hangge.com/blog/images/logo.png';
          fs.root.getFile('hangge.png', { create: true, exclusive: false },
            function (fileEntry) {
            that.download(fileEntry, url);
          }, that.onErrorCreateFile);
        }, that.onErrorLoadFs);
      },
      //下载文件
      download(fileEntry, uri) {
        var fileTransfer = new FileTransfer();
        var fileURL = fileEntry.toURL();
        fileTransfer.download(
          uri,
          fileURL,
          function (entry) {
            alert("下载成功！");
            alert("文件保存位置: " + entry.toURL());
          },
          function (error) {
            alert("下载失败！");
            alert("error source " + error.source);
            alert("error target " + error.target);
            alert("error code" + error.code);
          },
          null
        );
      },
      onErrorCreateFile(error){
        console.log("文件创建失败！")
        var msg = 'An error occured: ';
        console.log(error)
        switch (error.code) {
          case FileError.NOT_FOUND_ERR:
            msg += 'File or directory not found';
            break;

          case FileError.NOT_READABLE_ERR:
            msg += 'File or directory not readable';
            break;

          case FileError.PATH_EXISTS_ERR:
            msg += 'File or directory already exists';
            break;

          case FileError.TYPE_MISMATCH_ERR:
            msg += 'Invalid filetype';
            break;

          default:
            msg += 'Unknown Error';
            break;
        };

        alert(msg);
      },
      onErrorLoadFs(error){
        alert("文件系统加载失败！")
      },*/
      getRoadTestCSV(){
        console.log("getRoadTestCSV")
        var _this = this;
        _this.downLoadImg();
        /*window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        window.requestFileSystem(window.PERSISTENT, 0, function(fs) {
          fs.root.getFile("downloadedImage.png", { create: true, exclusive: false }, function (fileEntry) {
              console.log(fileEntry);
              //调用fileTransfer插件，下载图片
              _this.downLoadImg(fileEntry.nativeURL);
              
          }, function(err) {
             console.log(err);
          });
       }, function(error) {
          console.log(error);
       });*/
      },
      downLoadImg: function(fileURL) {
        var _this = this;
        // 初始化FileTransfer对象
        console.log("downloadImage")
        console.log(window);
        var fileTransfer = new FileTransfer();
        // 服务器下载地址
        var uri = encodeURI("http://avatar.csdn.net/7/E/0/1_michael_ouyang.jpg");
        var fileURL = cordova.file.externalDataDirectory+'text.csv';
        // 调用download方法
        fileTransfer.download(
          uri,         //uri网络下载路径
          fileURL,      //url本地存储路径
          function(entry) {
            console.log("download complete: " + entry.toURL());
            _this.$$('myImage').src = entry.toURL();
          },
          function(error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
          }
        );
      },
      stopRoadTest(){
        console.log("stopRoadTest")
        var that = this;
        that.testing = false;
        that.testEvent = false;
        clearInterval(that.roadTestInterval);
        that.roadTestDev = [];
        //clickStopBtnState();
        var roadTest = JSON.parse(localStorage.roadTest);
        for(var key in roadTest){
          var fileName = roadTest[key]['fileName'];
          var startTime = roadTest[key]['startTime'];
          var date = startTime.substr(0, 8);
          var time = startTime.substr(8, 6);
          var devSn = fileName.split("_")[1];
          var filePath = that.$axios.defaults.baseURL+"/data/driveTest/"+date;
          var fileName = that.user.id+"_"+devSn+"_"+time+".csv";
          console.log("停止路测文件名:"+fileName);
          var aLink = document.createElement('a');
          aLink.download = fileName;
          aLink.href = filePath+"/"+fileName;
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          //that.$cordovaPlugins.downloadFileHH(filePath, fileName) ;

          /*window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
            console.log('file system open: ' + fs.name); 
            // Make sure you add the domain name to the Content-Security-Policy <meta> element.
            var url = 'http://cordova.apache.org/static/img/cordova_bot.png';
            // Parameters passed to getFile create a new file or return the file if it already exists.
            fs.root.getFile('downloaded-image.png', { create: true, exclusive: false }, function (fileEntry) {
                download(fileEntry, url, true);
         
            }, onErrorCreateFile);
         
          }, onErrorLoadFs);


          var fileTransfer = new FileTransfer();
          var uri = encodeURI(filePath+fileName);
          fileTransfer.download(
            uri,
            fileURL,
            function(entry) {
                console.log("download complete: " + entry.toURL());
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );*/
            // 此处写需要做的文件操作
            /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
              console.log('打开的文件系统: ' + fs.name);
              fs.root.getFile("hangge.txt", { create: true, exclusive: false },
              function (fileEntry) {
                console.log("是否是个文件？" + fileEntry.isFile.toString());
                //文件内容
                var dataObj = new Blob(['欢迎访问hangge.com'], { type: 'text/plain' });
                //写入文件
                that.writeFile(fileEntry, null);
              }, that.onErrorCreateFile);
            }, that.onErrorLoadFs);*/
          


          
        }
        localStorage.removeItem("roadTest");
        localStorage.removeItem("roadTestDev");
        localStorage.removeItem("followPoint");
        localStorage.removeItem("mapZoom");
        localStorage.removeItem("roadTestDotSum");
        that.lastPonit = {};
      },
      startRoadTest(){
        this.roadTestMapVisible = true;
        this.mapHeight = window.innerHeight;
        this.startTest();
        this.testing = true;
        //this.initRoadTestMap();
      },
      startTest(){
        console.log("startTest")
        var that = this;
        that.importEvent = false;
        that.testEvent = true;
        localStorage.mapCenter = "";
        that.getAllDev();//获取所有要测试的设备：sessionStorage中存的值和下拉列表新选择的值
        //if(localStorage.btnState != "start"){//上一个动作是导入，删除，或停止
        if(that.testMap){
          that.testMap.clearOverlays();//清空覆盖物
        }
        //}
        that.lastPonit = {};
        //路测过程中修改路测设备后对路测设备进行重新记录
        if(!that.formatTestDev()){
          return ;
        }
        //初始化地图描点经纬度的最大最小值
        var roadTest = JSON.parse(localStorage.roadTest);
        var roadTestDev = Object.keys(roadTest);
        that.initAllDevRange(roadTestDev);//sessionStorage.allDevRange初始化所有设备的整体经纬度范围
        that.initMapSize(roadTestDev);//sessionStorage.mapSize记录每个设备的经纬度范围
        
        that.startTestDrawFlg = true;//第一次画图
        var testInfoArr = [], testInfo = "";
        for(var key in roadTest){
          testInfoArr.push(roadTest[key]["fileName"]+"/"+roadTest[key]["startTime"]);
        }
        testInfo = testInfoArr.join(",");
        that.createRoadTestFile(testInfo);//创建路测文件

        //单独线程，请求路测数据并绘图
        /*if(that.workerRoadTest){
          that.workerRoadTest.terminate();  
        }
        var workerUrl = require('./roadTestWorker.js');
        that.workerRoadTest = new Worker(workerUrl);
        that.workerRoadTestInit(testInfo);*/
        that.getRoadTestData(testInfo);
        that.roadTestInterval = setInterval(function(){
          that.getRoadTestData(testInfo);
        },1000)
        //修改点击路侧后，各按键的状态
        that.roadTestDev = JSON.parse(localStorage.roadTestDev)
        /*setTimeout(function(){
          clickStartBtnState();
        },500)*/ 
        that.formatDevFocus();////初始化设备追踪下拉列表,显示的内容为正在进行路测的设备
        localStorage.mapZoom = localStorage.mapZoom?localStorage.mapZoom:15;

        that.testMap.addEventListener("zoomend", function(evt){
          if(that.testEvent){
            that.refreshTestMapList();
          }
        });
        that.testMap.addEventListener("dragend", function(){
          if(that.testEvent){
            that.refreshTestMapList();
          }
        });
      },
      getRoadTestData(testInfo){
        console.log("getRoadTestData")
        var that = this;
        that.$axios({
          method: 'post',
          url:"/page/index/roadTest.php",
          data:that.$qs.stringify({
            getDevOnRoad: true,
            testInfo: testInfo,
            logUser:that.user.id
          }),
          Api:"getDevOnRoad",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          var data = response.data.data;
          var vData = [];
          var validDev = true;
          $("#gpsInfo").empty();
          for(var i=0; i<data.length; i++){
            //0是没有设备，1是锁定中，2是锁定
            if (data[i]["GpsStates"] == 0 ) {//背包失锁
              $("#gpsInfo").append("<p>"+"背包"+data[i]["dev_name"]+' GPS失锁'+"</p>");
            }
            if (data[i]["GpsStates"] == 1 ) {//背包失锁
              $("#gpsInfo").append("<p>"+"背包"+data[i]["dev_name"]+' 的GPS模块正在搜索'+"</p>");
            }
            vData.push(data[i]);
          }
          if($("#gpsInfo p").length > 0){
            $("#gpsInfo").css({"padding":'10px','border':"2px solid red"});
          }else{
            $("#gpsInfo").css({"padding":'0px','border':"none"});
          }
          if(validDev){
            that.saveTestData(vData);//所有请求数据均画图
          }
        })
        .catch(function (error) {
           console.log(error);
        })
      },
      //开始路测：过滤拖拽或缩放后在页面显示范围内的200个点
      refreshTestMapList(){
        var that = this;
        localStorage.mapCenter = JSON.stringify(that.testMap.getBounds().getCenter());
        that.ajaxTestData(function(res){ //获取之前所有记录的点
          var data1 = res.data;
          that.formatCsvData(data1, function(oData){
            var showList = that.getMapShowData(oData);//过滤掉在显示范围外的点
            var newList = "";
            var newLen = 0;
            for(var key in showList){
              newLen += showList[key]["RealLongitude"].length;
            }
            if(newLen > that.SHOWPOINT){//显示范围内的点数超过百度地图显示点的承受范围
              newList = that.getHalfList(showList,SHOWPOINT/2);//从所有点中抽 SHOWPOINT/2 进行显示
            }else{
              newList = showList;
            }
            that.lastPonit = {};
            that.drawAllData(newList,true, true);
            var newListLen = 0;
            for(var key in newList){
              newListLen += newList[key]["RealLongitude"].length;
            }
            localStorage.roadTestDotSum = JSON.stringify(newListLen);
          });//绘制原有数据
        });
      },
      //抽稀， 显示当前点一半的数据//在路测过程中会调用
      getHalfList(list,showPoint){
        var that = this;
        var newList = [];
        var devPoint = {};
        var totalPoint = 0;
        for(var key in list){
          var count = list[key]["RealLatitude"].length;
          totalPoint += count;
        }
        for(var key1 in list){
          //确定每个设备抽取的点数
          var count = list[key1]["RealLatitude"].length;
          devPoint[key1] = parseInt(count*showPoint/totalPoint)==0?1:count*showPoint/totalPoint;  
          that.initListData(list, newList, key1);
          //抽取点
          for(var i=0; i<count; i++){
            if(list[key1]["online"][i] == 0 //gray
              || list[key1]["devPushStatus"][i] == 0 //orange
              || list[key1]["TotalLossRate"][i] != 0){ //red
              that.setNewListData(list, newList, key1, i);
              continue;
            }
            if(i%(parseInt(count/devPoint[key1])) == 0){
              that.setNewListData(list, newList, key1, i);
              continue; 
            }
          }
        }
        return newList;
      },
      //将收到的数据保存到session中，作为路测数据
      saveTestData(data){
        console.log("saveTestData")
        var that = this;
        var GPSCurrentObj = {};
        var sObj = {};
        var sArr = [];
        var obj = {};
        for(var i=0; i<data.length; i++){
          GPSCurrentObj[data[i]["dev_sn"]] = {};
          GPSCurrentObj[data[i]["dev_sn"]]["dev_name"] = data[i]["dev_name"];
          GPSCurrentObj[data[i]["dev_sn"]]["RealLongitude-old"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["RealLongitude-old"].push(data[i]["RealLongitude-old"]);
          GPSCurrentObj[data[i]["dev_sn"]]["RealLatitude-old"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["RealLatitude-old"].push(data[i]["RealLatitude-old"]);
          GPSCurrentObj[data[i]["dev_sn"]]["RealLongitude"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["RealLongitude"].push(data[i]["RealLongitude"]);
          GPSCurrentObj[data[i]["dev_sn"]]["RealLatitude"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["RealLatitude"].push(data[i]["RealLatitude"]);
          GPSCurrentObj[data[i]["dev_sn"]]["TotalLossRate"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["TotalLossRate"].push(data[i]["TotalLossRate"]?data[i]["TotalLossRate"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["devPushStatus"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["devPushStatus"].push(data[i]["dev_push_status"]?data[i]["dev_push_status"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["online"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["online"].push(data[i]["online"]?data[i]["online"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["time"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["time"].push(data[i]["time"]);
          GPSCurrentObj[data[i]["dev_sn"]]["gpsState"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["gpsState"].push(data[i]["GpsStates"]?data[i]["GpsStates"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["gpsSpeed"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["gpsSpeed"].push(data[i]["GpsSpeed"]?data[i]["GpsSpeed"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["dev_sr"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["dev_sr"].push(data[i]["dev_sr"]?data[i]["dev_sr"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["dev_delay"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["dev_delay"].push(data[i]["dev_delay"]?data[i]["dev_delay"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM1"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM1"].push(data[i]["SIM1"]?data[i]["SIM1"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM2"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM2"].push(data[i]["SIM2"]?data[i]["SIM2"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM3"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM3"].push(data[i]["SIM3"]?data[i]["SIM3"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM4"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM4"].push(data[i]["SIM4"]?data[i]["SIM4"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM5"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM5"].push(data[i]["SIM5"]?data[i]["SIM5"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM6"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM6"].push(data[i]["SIM6"]?data[i]["SIM6"]:0);
        }
        if(Object.keys(GPSCurrentObj).length != 0){
          if(localStorage.roadTestDotSum){
            that.roadTestDotSum = parseInt(JSON.parse(localStorage.roadTestDotSum));
          }else{
            that.roadTestDotSum = 0;
          }
          that.roadTestDotSum += 1;//当前页面画点的个数
          if(that.roadTestDotSum > that.SHOWPOINT){//画的点数超出百度地图的承受范围
            //console.log("dq already draw dot:"+roadTestDotSum);
            that.ajaxTestData(function(res){ //获取之前所有记录的点
              console.log("dq get all test data")
              var data1 = res.data;
              that.formatCsvData(data1, function(oData){
                var showList = that.getMapShowData(oData);//过滤掉在显示范围外的点
                var newList = "";
                var newLen = 0;
                for(var key in showList){
                  newLen += showList[key]["RealLongitude"].length;
                }
                console.log("dq num of record in range:"+newLen);//显示范围内的实际点数
                if(newLen > that.SHOWPOINT){//显示范围内的点数超过百度地图显示点的承受范围
                  newList = that.getHalfList(showList,that.SHOWPOINT/2);//从所有点中抽 SHOWPOINT/2 进行显示
                }else{
                  newList = showList;
                }
                that.lastPonit = {};
                that.drawAllData(newList,true);//不画img
                that.drawOneData(GPSCurrentObj);
                var newListLen = 0;
                for(var key in newList){
                  newListLen += newList[key]["RealLongitude"].length;
                }
                console.log("dq num of dot in web:"+newListLen);
                localStorage.roadTestDotSum = JSON.stringify(newListLen);
              });//绘制原有数据
            });
          }else{
            that.drawOneData(GPSCurrentObj);
            localStorage.roadTestDotSum = JSON.stringify(that.roadTestDotSum);
          }
        }
      },
      //将从csv读取的文件转换成可以画图的数据
      formatCsvData(data, cb){
        var testData = {};
        var sObj = {};
        var sArr = [];
        var obj = {};
        for(var i=0; i<data.length; i++){
          var objSn = data[i][0][1];
          var datas = data[i];
          testData[objSn] = {};
          testData[objSn]["dev_name"] = datas[1][1];
          var timeArr = [], gpsStatusArr=[], bdLongitudeArr = [], bdLatitudeArr = [], longitudeArr = [], latitudeArr = [], 
              onlineArr = [], devPushStatusArr = [], lossArr = [], gpsSpeedArr = [], devSrArr = [], devDelayArr = [],
              sim1Arr = [], sim2Arr = [], sim3Arr = [], sim4Arr = [], sim5Arr = [], sim6Arr = [];
          for(var j=5; j<datas.length-1; j++){
            timeArr.push(datas[j][1]);
            gpsStatusArr.push(datas[j][2]);
            longitudeArr.push(datas[j][3]);
            latitudeArr.push(datas[j][4]);
            bdLongitudeArr.push(datas[j][5]);
            bdLatitudeArr.push(datas[j][6]);
            lossArr.push(datas[j][7]);
            gpsSpeedArr.push(datas[j][8]);
            devSrArr.push(datas[j][9]);
            devDelayArr.push(datas[j][10]);
            sim1Arr.push(datas[j][11]);
            sim2Arr.push(datas[j][12]);
            sim3Arr.push(datas[j][13]);
            sim4Arr.push(datas[j][14]);
            sim5Arr.push(datas[j][15]);
            sim6Arr.push(datas[j][16]);
            onlineArr.push(datas[j][17]);
            devPushStatusArr.push(datas[j][18]);
          }
          testData[objSn]["RealLongitude-old"] = longitudeArr;
          testData[objSn]["RealLatitude-old"] = latitudeArr;
          testData[objSn]["RealLongitude"] = bdLongitudeArr;
          testData[objSn]["RealLatitude"] = bdLatitudeArr;
          testData[objSn]["TotalLossRate"] = lossArr;
          testData[objSn]["devPushStatus"] = devPushStatusArr;
          testData[objSn]["online"] = onlineArr;
          testData[objSn]["time"] = timeArr;
          testData[objSn]["gpsState"] = gpsStatusArr;
          testData[objSn]["gpsSpeed"] = gpsSpeedArr;
          testData[objSn]["dev_sr"] = devSrArr;
          testData[objSn]["dev_delay"] = devDelayArr;
          testData[objSn]["SIM1"] = sim1Arr;
          testData[objSn]["SIM2"] = sim2Arr;
          testData[objSn]["SIM3"] = sim3Arr;
          testData[objSn]["SIM4"] = sim4Arr;
          testData[objSn]["SIM5"] = sim5Arr;
          testData[objSn]["SIM6"] = sim6Arr;
        }
        if(cb){
          cb(testData)
        }
      },
      ajaxTestData(cb){
        var that = this;
        var roadTest = JSON.parse(localStorage.roadTest);
        var testInfoArr = [], testInfo = "";
        for(var key in roadTest){
          testInfoArr.push(roadTest[key]["fileName"]+"/"+roadTest[key]["startTime"]);
        }
        testInfo = testInfoArr.join(",");
        that.$axios({
          method: 'post',
          url:"/page/index/roadTest.php",
          data:that.$qs.stringify({
            getCsvData: true,
            testInfo:testInfo,
          }),
          Api:"getCsvData",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          console.log("ajaxTestData")
          console.log(response)
          var res = response.data;
          if(cb){
            cb(res)
          }
        })
        .catch(function (error) {
           console.log(error);
        })
      },
      //创建路测文件
      createRoadTestFile(testInfo){
        var that = this;
        that.$axios({
          method: 'post',
          url:"/page/index/roadTest.php",
          data:that.$qs.stringify({
            createRoadTestFile: true,
            logUser: that.user.id,
            testInfo:testInfo,
          }),
          Api:"createRoadTestFile",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
        })
        .catch(function (error) {
          that.$toast({
            message: error,
            position: 'middle',
            duration: 2000
          });
        })
      },
      initMapSize(roadTestDev){
        //mapSize:用于记录追踪过程中的边界
        var mapSize = localStorage.mapSize ? JSON.parse(localStorage.mapSize) : {};
        //背包经纬度初始化
        for(var i=0; i<roadTestDev.length; i++){
          if(mapSize[roadTestDev[i]]){
            continue;
          }else{
            mapSize[roadTestDev[i]] = {};  
            mapSize[roadTestDev[i]]['lng'] = {'max':0,'min':0};
            mapSize[roadTestDev[i]]['lat'] = {'max':0,'min':0};
          }
        }
        localStorage.mapSize = JSON.stringify(mapSize);
      },
      //路测过程中修改路测设备后对路测设备进行重新记录
      formatTestDev(){
        console.log("formatTestDev")
        var that = this;
        var newDev = that.roadTestDev;
        var newDevNum = newDev?newDev.length:0;
        var addDev = [];//本次测试新增加的设备
        var oldDev = [];//正在测试的设备
        var oldDevNum = 0;
        var roadTest = {};
        //获取正在测试的设备
        if(localStorage.roadTest){
          roadTest = JSON.parse(localStorage.roadTest);
          oldDev = Object.keys(roadTest);
          oldDevNum = oldDev.length;
        }
        //过滤掉已经在测试的设备
        for(var i=0; i<newDev.length; i++){
          if($.inArray(newDev[i], oldDev) == -1){
             addDev.push(newDev[i]);
          }
        }
        //路测设备数量校验
        if(!newDevNum){
          that.$toast({
            message: "请选择待测设备",
            position: 'middle',
            duration: 2000
          });
          return false;
        }else if(addDev.length + oldDevNum > 10){//从session里面
          that.$toast({
            message: "最多支持10台背包的同时测试",
            position: 'middle',
            duration: 2000
          });
          return false;
        }
        for(var j=0; j<addDev.length; j++){
          roadTest[addDev[j]] = {};
        };
        //点击路测后，重新获取在线设备，防止最新选中的路测设备已经离线
        that.initOnlineDev(that.formatDevSelect);
        var arr = $.map(that.roadTestDevOptions, function(item){
          return item.value;
        });
        console.log("arr")
        console.log(arr);
        console.log("addDev")
        console.log(addDev)
        for(let m=0; m<addDev.length; m++){
          if(arr.indexOf(addDev[m]) == -1){
            that.$toast({
              message: "背包"+addDev[m]+"已离线，请重新选择",
              position: 'middle',
              duration: 2000
            });
            return false;
          }
        }
        //开始绘图
        //timeFlag:点击开始绘图的时间，也作为保存csv的文件名中的时间部分
        var timeFlag = that.getTimeStr();
        var fileName  = [];//保存的文件名， 格式为：devSn_timeFlag
        for(let n=0; n<addDev.length; n++){
          roadTest[addDev[n]]["fileName"] = that.user.id+"_"+addDev[n]+"_"+timeFlag.substr(8,6)
          roadTest[addDev[n]]["startTime"] = timeFlag;
        }
        localStorage.roadTest = JSON.stringify(roadTest);
        return true;
      },
      //将时间转化为年月日 时分秒的格式
      getTimeStr(time){
        if(time){

        }else{
          var date = new Date();
          var year = date.getFullYear();
          var month = (date.getMonth()+1)>=10?(date.getMonth()+1):"0"+(date.getMonth()+1);
          var day = date.getDate()>=10?date.getDate():"0"+date.getDate();
          var hour = date.getHours()>=10?date.getHours():"0"+date.getHours();
          var minute = date.getMinutes()>=10?date.getMinutes():"0"+date.getMinutes();
          var second = date.getSeconds()>=10?date.getSeconds():"0"+date.getSeconds();
          return ""+year+month+day+hour+minute+second;
        }
      },
      //获取所有要测试的设备：sessionStorage中存的值和下拉列表新选择的值
      getAllDev(){
        var that = this;
        if(localStorage.roadTestDev){
          var oldDev = JSON.parse(localStorage.roadTestDev)
          var newSel = that.roadTestDev;
          for(var i=0; i<newSel.length; i++){
            if($.inArray(newSel[i],oldDev) == -1){
              oldDev.push(newSel[i]);
            }
          }
          localStorage.roadTestDev = JSON.stringify(oldDev);
        }else{
          localStorage.roadTestDev = JSON.stringify(that.roadTestDev);  
        }
      },
      importRoadTest(){
        console.log("importRoadTest")
        this.mapHeight = window.innerHeight;
        this.importTest();
        return;
      },
      //将内容数据写入到文件中
      writeFile(fileEntry, dataObj) {
        //创建一个写入对象
        fileEntry.createWriter(function (fileWriter) {
          //文件写入成功
          fileWriter.onwriteend = function() {
              console.log("Successful file read...");
          };
          //文件写入失败
          fileWriter.onerror = function (e) {
              console.log("Failed file read: " + e.toString());
          };
          //写入文件
          fileWriter.write(dataObj);
        });
      },
      
      //请求在线设备
      initOnlineDev(cb){
        var that = this;
        that.$axios({
          method: 'post',
          url:"/page/index/roadTest.php",
          data:that.$qs.stringify({
            getOnlineDev: true,
            logUser: that.user.id,
          }),
          Api:"getOnlineDev",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          console.log("initOnlineDev")
          console.log("success")
          let res = response.data;
          if(res.res.success){
            var newArr = that.$global.copy(res.data).map(function(item){
              return {
                text: item.dev_name,
                value: item.dev_sn
              }
            });
            console.log(newArr)
            if(cb){
              cb(newArr)
            }
          }
        })
        .catch(function (error) {
          console.log("error")
          console.log(error)
        })
      },
      //初始化设备下拉列表，赋初值
      formatDevSelect(selectArr){
        console.log("formatDevSelect")
        console.log(selectArr)
        var that = this;
        var val_old = that.roadTestDev;
        that.roadTestDevOptions = selectArr;
        that.initDevSelect(val_old);//该下拉列表赋初值
        that.changeStartDisable();//修改操作按键显示状态：disable
        that.formatDevFocus();//初始化设备追踪下拉列表,显示的内容为正在进行路测的设备
        /*$("#devListSelect").on('change', function(){
          that.changeStartDisable();
        })*/
      },
      changeRoadTestDev(){
        var that = this;
        that.changeStartDisable();
      },
      //设备下拉列表赋初值
      initDevSelect(val_old){
        var selectDev = "";
        //有正在测试的设备，则赋值正在测试的设备
        if(localStorage.roadTestDev){
          selectDev = JSON.parse(localStorage.roadTestDev);
        }else{//没有正在测试的设备，将延续上一次显示的背包名
          selectDev = val_old;
        }
        this.roadTestDev = selectDev;
      },
      //操作按钮状态修改
      changeStartDisable(){
        var that = this;
        if(!that.roadTestDev){
          that.dis.startTestDis = true;
        }else{
          that.dis.startTestDis = false;
        }
      },
      //初始化设备追踪下拉列表,显示的内容为正在进行路测的设备
      formatDevFocus(){
        var that = this;
        if(localStorage.roadTest){
          var testDevSns = Object.keys(JSON.parse(localStorage.roadTest));
          var obj= {};
          var opts = [];
          for(var i=0; i<testDevSns.length; i++){
            obj = {};
            obj.text = that.roadTestDevOptions.filter(function(item){
              return (item.value == testDevSns[i]);
            })[0].label;
            obj.value = testDevSns[i];
            opts.push(obj);
          }
          that.followDevOptions = that.$global.copy(opts);
          that.followDevOptions.unshift({"text":"请选择追踪背包","value":""})
          that.followDev = "";
          that.zoomDevOptions = that.$global.copy(opts);
          that.zoomDevOptions.unshift({"text":"请选择全览背包","value":""})
          that.zoomDev = "";
        }
      },
      followDevChange(){
        localStorage.followPoint = this.followDev;
      },
      //显示全路径下拉列表内容更改时，调用页面缩放方法
      zoomDevChange(){
        this.setMapNewZoom();
      },
      //重新设置地图缩放
      setMapNewZoom(){
        console.log("setMapNewZoom");
        var that = this;
        //var showDev = that.zoomDev;
        var showDev = [];
        showDev.push(that.zoomDev);
        if(!showDev || (showDev.length == 1 && showDev[0]=="")){
          return;
        }
        console.log(showDev)
        showDev = showDev.filter(function(item){
          return item!="";
        })
        localStorage.wholeRoad = showDev;
        var allDevRange = JSON.parse(localStorage.allDevRange);
        var realRange = allDevRange[showDev[0]];
        if(showDev.length > 1){
          for(var i=1; i<showDev.length; i++){
            if(allDevRange[showDev[i]]["lng"]["max"] > realRange["lng"]["max"]){
              realRange["lng"]["max"] = allDevRange[showDev[i]]["lng"]["max"];
            }
            if(allDevRange[showDev[i]]["lng"]["min"] < realRange["lng"]["min"]){
              realRange["lng"]["min"] = allDevRange[showDev[i]]["lng"]["min"];
            }
            if(allDevRange[showDev[i]]["lat"]["max"] > realRange["lat"]["max"]){
              realRange["lat"]["max"] = allDevRange[showDev[i]]["lat"]["max"];
            }
            if(allDevRange[showDev[i]]["lat"]["min"] < realRange["lat"]["min"]){
              realRange["lat"]["min"] = allDevRange[showDev[i]]["lat"]["min"];
            }
          }  
        }
        while(1){
          var mapBorder = that.getMapBorder(that.testMap,false);
          if(realRange["lng"]["max"] > mapBorder["lng"]["max"]
          || realRange["lng"]["min"] < mapBorder["lng"]["min"]
          || realRange["lat"]["max"] > mapBorder["lat"]["max"]
          || realRange["lat"]["min"] < mapBorder["lat"]["min"]){
            var newZoom = JSON.parse(localStorage.mapZoom)-1
            that.testMap.setZoom(newZoom);
            localStorage.mapZoom = JSON.stringify(newZoom);
          }else{
            break;
          }  
        }
      },
      //初始化地图
      initRoadTestMap(){
        console.log("initRoadTestMap")
        if (navigator.onLine) {
          this.LoadBaiduMapScript();
          return true;
        } else {
          that.$toast({
            message: "访问网络失败!",
            position: 'middle',
            duration: 2000
          });
          map = undefined;
          return false;
        }
      },
      //加载百度地图脚本
      LoadBaiduMapScript() {
        var that = this;
        console.log("初始化百度地图脚本...");
        const AK = '05c0e8c0bc349a5fe23fafb604a27d5c';
        const BMap_URL = "https://api.map.baidu.com/api?v=2.0&ak=" + AK + "&s=1&callback=onBMapCallback";
        return new Promise(function(resolve, reject) {
          // 如果已加载直接返回
          if (typeof BMap !== "undefined") {
            that.initTestMap();
            return true;
          }
          //百度地图异步加载回调处理
          window.onBMapCallback = function() {
            console.log("百度地图脚本初始化成功...");
            var scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", "//api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js");
            document.body.appendChild(scriptNode);
            var scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", "//api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js");
            document.body.appendChild(scriptNode);
            that.initTestMap();//初始化地图控件
          };
          // 插入script脚本
          var scriptNode = document.createElement("script");
          scriptNode.setAttribute("type", "text/javascript");
          scriptNode.setAttribute("src", BMap_URL);
          document.body.appendChild(scriptNode);
        });
      },
      //初始化地图控件
      initTestMap() {
        console.log("initTestMap")
        var that = this;
        var testMap = that.testMap;
        if (typeof(BMap) == 'object') {
          testMap = new BMap.Map("test_map"); // 创建Map实例
          testMap.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
          testMap.addControl(new BMap.MapTypeControl({
            mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
          }));
          var scaleCtrl = new BMap.ScaleControl();  // 添加比例尺控件
          testMap.addControl(scaleCtrl);
          testMap.setCurrentCity("北京"); // 设置地图中心显示的城市 new
          testMap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
          testMap.addEventListener("zoomend", function(e){
            localStorage.mapZoom = testMap.getZoom();
          });
          //地图脚本加载完成后，执行刷新页面的操作
          var bmaplibInterval = setInterval(function(){
            if(BMapLib){
              //checkRefreshPage();//刷新页面//zanzhu
              clearInterval(bmaplibInterval);
            }
          },200)

          //定义一个控件类(地圖縮放)
          function ZoomControl() {
            this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
            this.defaultOffset = new BMap.Size(20, 20)
          }
          //通过JavaScript的prototype属性继承于BMap.Control
          ZoomControl.prototype = new BMap.Control();

          //自定义控件必须实现自己的initialize方法，并且将控件的DOM元素返回
          //在本方法中创建个div元素作为控件的容器，并将其添加到地图容器中
          ZoomControl.prototype.initialize = function(map) {
            var div = document.createElement('div');
            var att=document.createAttribute("class");
            att.value="BMap_stdMpZoom";
            div.setAttributeNode(att);

            var divIn = document.createElement('div');
            var attIn=document.createAttribute("class");
            attIn.value="BMap_button_new BMap_stdMpZoomIn";
            divIn.setAttributeNode(attIn);
            var titleIn=document.createAttribute("title");
            titleIn.value="放大一级";
            divIn.setAttributeNode(titleIn);

            var divInImg = document.createElement('div');
            var imgIn=document.createAttribute("class");
            imgIn.value="BMap_smcbg in";
            divInImg.setAttributeNode(imgIn);
            divIn.appendChild(divInImg);
            div.appendChild(divIn);

            var divOut = document.createElement('div');
            var attOut=document.createAttribute("class");
            attOut.value="BMap_button_new BMap_stdMpZoomOut";
            divOut.setAttributeNode(attOut);
            var titleOut=document.createAttribute("title");
            titleOut.value="缩小一级";
            divOut.setAttributeNode(titleOut);

            var divOutImg = document.createElement('div');
            var imgOut=document.createAttribute("class");
            imgOut.value="BMap_smcbg out";
            divOutImg.setAttributeNode(imgOut);
            divOut.appendChild(divOutImg);
            div.appendChild(divOut);

            // 绑定事件,点击一次放大两级
            divIn.onclick = function(e){
                map.setZoom(map.getZoom() + 1);
            }
            divOut.onclick = function(e){
                map.setZoom(map.getZoom() - 1);
            }
            // 添加DOM元素到地图中
            map.getContainer().appendChild(div);
            // 将DOM元素返回
            return div;
          }
          //创建控件元素
          var myZoomCtrl = new ZoomControl();
          //添加到地图中
          testMap.addControl(myZoomCtrl);
          if(sessionStorage.roadTestDotSum){
            that.roadTestDotSum = parseInt(JSON.parse(sessionStorage.roadTestDotSum));
          }
        } else {
          that.$toast({
            message: "地图初始化失败!",
            position: 'middle',
            duration: 2000
          });
          testMap = undefined;
        }
        that.testMap = testMap;
      },
      //f5刷新页面，判断是否刷新了正在测试的页面，导入的页面不重新加载，只考虑正在进行背包路测的页面
      checkRefreshPage(){
        var that = this;
        if(localStorage.roadTest){//页面正在执行的时候，刷新了页面
          that.roadTestDev = JSON.parse(localStorage.roadTestDev);
          that.devFocus = localStorage.followPoint?JSON.parse(localStorage.followPoint):"";
          switch(localStorage.btnState){
            case "init":
              initBtnState();
              break;
            case "start":
              clickStartBtnState();
              break;
            case "stop":
              clickStopBtnState(); 
              break;
            case "import":
              clickImportBtnState();
              break;
            case "delete":
              clickDeleteBtnState();
              break;
          }
          that.startTestDrawFlg = true;//第一次画图
          var csvData = that.getCsvData();
        }
      },
      //格式化导入的路测文件数据
      formatImportData(data){
        var list = {};
        var roadTestDev = [];
        for(var i=0; i<data.length; i++){
          var allInfo = data[i];
          var infoRowArr = allInfo.split("\n");
          var devSn = infoRowArr[0].split(",")[1];
          var devName = infoRowArr[1].split(",")[1];
          var rcvSn = infoRowArr[2].split(",")[1];
          var board = infoRowArr[3].split(",")[1];
          var recordStartLine = 5;
          var allLine = infoRowArr.length;
          if(!list[devSn]){
            list[devSn] = {};
            list[devSn]["dev_name"] = devName;
            list[devSn]["time"] = [];
            list[devSn]["gpsState"] = [];
            list[devSn]["gpsSpeed"] = [];
            list[devSn]["dev_sr"] = [];
            list[devSn]["dev_delay"] = [];
            list[devSn]["RealLongitude-old"] = [];
            list[devSn]["RealLatitude-old"] = [];
            list[devSn]["RealLongitude"] = [];
            list[devSn]["RealLatitude"] = [];
            list[devSn]["TotalLossRate"] = [];
            list[devSn]["SIM1"] = [];
            list[devSn]["SIM2"] = [];
            list[devSn]["SIM3"] = [];
            list[devSn]["SIM4"] = [];
            list[devSn]["SIM5"] = [];
            list[devSn]["SIM6"] = [];
            list[devSn]["online"] = [];
            list[devSn]["devPushStatus"] = [];
            roadTestDev.push(devSn);
          }
          for(var j=recordStartLine; j<allLine-1; j++){
            var recordRow = infoRowArr[j].split(",");
            list[devSn]["time"].push(recordRow[1]);
            list[devSn]["gpsState"].push(recordRow[2]);
            list[devSn]["RealLongitude-old"].push(recordRow[3]);
            list[devSn]["RealLatitude-old"].push(recordRow[4]);
            list[devSn]["RealLongitude"].push(recordRow[5]);
            list[devSn]["RealLatitude"].push(recordRow[6]);
            list[devSn]["TotalLossRate"].push(recordRow[7]*10);
            list[devSn]["gpsSpeed"].push(recordRow[8]);
            list[devSn]["dev_sr"].push(recordRow[9]);
            list[devSn]["dev_delay"].push(recordRow[10]);
            list[devSn]["SIM1"].push(recordRow[11]);
            list[devSn]["SIM2"].push(recordRow[12]);
            list[devSn]["SIM3"].push(recordRow[13]);
            list[devSn]["SIM4"].push(recordRow[14]);
            list[devSn]["SIM5"].push(recordRow[15]);
            list[devSn]["SIM6"].push(recordRow[16]);
            list[devSn]["online"].push(recordRow[17]);
            list[devSn]["devPushStatus"].push(recordRow[18]); 
          }
        }
        return {"list":list, "roadTestDev":roadTestDev}
      },
      //初始化经纬度记录值
      initAllDevRange(roadTestDev){
        //allDevRange:用于记录所有点的极值范围
        var allDevRange = localStorage.allDevRange ? JSON.parse(localStorage.allDevRange) : {};
        //背包经纬度初始化
        for(var i=0; i<roadTestDev.length; i++){
          if(allDevRange[roadTestDev[i]]){
            continue;
          }else{
            allDevRange[roadTestDev[i]] = {};  
            allDevRange[roadTestDev[i]]['lng'] = {'max':0,'min':0};
            allDevRange[roadTestDev[i]]['lat'] = {'max':0,'min':0};
          }
        }
        localStorage.allDevRange = JSON.stringify(allDevRange);
      },
      //抽稀， 显示指定点的数据
      hinoutList(list){
        var that = this;
        var newList = [];
        var devPoint = {};
        var totalPoint = 0;
        for(var key in list){
          var count = list[key]["RealLatitude"].length;
          totalPoint += count;
        }
        for(var key1 in list){
          //确定每个设备抽取的点数
          var showPoint = 0;
          var count = list[key1]["RealLatitude"].length;
          if(totalPoint < that.SHOWPOINT){
            devPoint[key1] = count;  
          }else{
            devPoint[key1] = parseInt(count*that.SHOWPOINT/totalPoint)==0?1:parseInt(count*that.SHOWPOINT/totalPoint);  
          }
          that.initListData(list, newList, key1);
          //抽取点
          for(var i=0; i<count; i++){
            if(list[key1]["online"][i] == 0 //gray
              || list[key1]["devPushStatus"][i] == 0 //orange
              || list[key1]["TotalLossRate"][i] != 0){ //red
              that.setNewListData(list, newList, key1, i);
              continue;
            }
            if(i%(parseInt(count/devPoint[key1])) == 0){
              that.setNewListData(list, newList, key1, i);
              continue; 
            }
          }
        }
        return newList;
      },
      //初始化过滤成200点后的新数组
      initListData(list, newList, key){
        newList[key] = new Object();
        newList[key]["RealLatitude"] = [];
        newList[key]["RealLatitude-old"] = [];
        newList[key]["RealLongitude"] = [];
        newList[key]["RealLongitude-old"] = [];
        newList[key]["SIM1"] = [];
        newList[key]["SIM2"] = [];
        newList[key]["SIM3"] = [];
        newList[key]["SIM4"] = [];
        newList[key]["SIM5"] = [];
        newList[key]["SIM6"] = [];
        newList[key]["TotalLossRate"] = [];
        newList[key]["devPushStatus"] = [];
        newList[key]["dev_delay"] = [];
        newList[key]["dev_name"] = list[key]["dev_name"];
        newList[key]["dev_sr"] = [];
        newList[key]["gpsSpeed"] = [];
        newList[key]["gpsState"] = [];
        newList[key]["online"] = [];
        newList[key]["time"] = [];
      },
      //向200个点的新数组赋值
      setNewListData(list, newList, key, i){
        var data = list[key];
        newList[key]["RealLatitude"].push(data["RealLatitude"][i]);
        newList[key]["RealLatitude-old"].push(data["RealLatitude-old"][i]);
        newList[key]["RealLongitude"].push(data["RealLongitude"][i]);
        newList[key]["RealLongitude-old"].push(data["RealLongitude-old"][i]);
        newList[key]["SIM1"].push(data["SIM1"][i]);
        newList[key]["SIM2"].push(data["SIM2"][i]);
        newList[key]["SIM3"].push(data["SIM3"][i]);
        newList[key]["SIM4"].push(data["SIM4"][i]);
        newList[key]["SIM5"].push(data["SIM5"][i]);
        newList[key]["SIM6"].push(data["SIM6"][i]);
        newList[key]["TotalLossRate"].push(data["TotalLossRate"][i]);
        newList[key]["devPushStatus"].push(data["devPushStatus"][i]);
        newList[key]["dev_delay"].push(data["dev_delay"][i]);
        newList[key]["dev_sr"].push(data["dev_sr"][i]);
        newList[key]["gpsSpeed"].push(data["gpsSpeed"][i]);
        newList[key]["gpsState"].push(data["gpsState"][i]);
        newList[key]["online"].push(data["online"][i]);
        newList[key]["time"].push(data["time"][i]);
      },
      //导入记录，获取显示所有点的合适的mapzoom
      initMapZoom(list){
        var that = this;
        var lngMax = "", lngMin = "";
        var latMax = "", latMin = "";
        //遍历所有设备的数据，找出最大最小范围
        for(var key in list){
          var data = list[key];
          if(lngMax == ""){
            lngMax = data["RealLongitude"][0];
            lngMin = data["RealLongitude"][0];
            latMax = data["RealLatitude"][0]; 
            latMin = data["RealLatitude"][0];
          }
          for(var i=0; i<data["RealLongitude"].length; i++){
            lngMax = (lngMax < data["RealLongitude"][i])?data["RealLongitude"][i]:lngMax;
            latMax = (latMax < data["RealLatitude"][i])?data["RealLatitude"][i]:latMax;
            if(data["RealLongitude"][i] != 0)
              lngMin = (lngMin > data["RealLongitude"][i])?data["RealLongitude"][i]:lngMin;
            if(data["RealLatitude"][i] != 0)
              latMin = (latMin > data["RealLatitude"][i])?data["RealLatitude"][i]:latMin;
          }
        }
        var sm = new BMap.Point(lngMin, latMin);
        var lg= new BMap.Point(lngMax, latMax);

        var pointArray = new Array(sm,lg)
        var viewPort = that.testMap.getViewport(pointArray);
        //testMap.centerAndZoom(viewPort.center, viewPort.zoom);
        return viewPort;
      },
      getMapBorder(testMap,noMapBorder){
        //导入数据时，不设边界范围，路测过程中，增加边界范围
        var border = 0.01;
        if(noMapBorder){
          border = 0;
        }else{
          var zoom = testMap.getZoom();
          if (zoom < 14){
            border = 0.01;
          } else if (zoom == 14) {
            border = 0.005;
          } else if(zoom == 15 || zoom == 16 ){
            border = 0.001;
          } else if(zoom == 17 || zoom == 18 ){
            border = 0.0003;
          } else if(zoom == 19){
            border = 0.00008;
          }else{
            border = 0.01;
          }  
        }
        
        var mapBorder = {};
        mapBorder.lat = {'max':(testMap.getBounds().getNorthEast().lat-border).toFixed(6), 'min':(testMap.getBounds().getSouthWest().lat+border).toFixed(6)};
        mapBorder.lng = {'max':(testMap.getBounds().getNorthEast().lng-border).toFixed(6), 'min':(testMap.getBounds().getSouthWest().lng+border).toFixed(6)};
        localStorage.mapBorder = JSON.stringify(mapBorder);
        return mapBorder;
      },
      //画背包文字说明
      drawLabel(data, point){
        var that = this;
        var optsLabel = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(14, 6) //设置文本偏移量
        };
        var label = new BMap.Label(data["dev_name"], optsLabel); // 创建文本标注对象
        label.setStyle({
          color: 'black',
          fontSize: "14px",
          background: "transparent",
          border: '0',
          fontWeight: "bold"
        });
        that.testMap.addOverlay(label);
      },
      //画背包图片
      drawImg(point){
        //背包图片
        var that = this;
        var testMap = this.testMap;
        var UHD4000 = require('../../assets/img/UHD4000.png');
        var myIcon = new BMap.Icon(UHD4000,  new BMap.Size(22, 36));
        var marker2 = new BMap.Marker(point, {
          icon: myIcon,
          offset: new BMap.Size(26, 42) //设置文本偏移量
        });
        //testMarkers.push(marker2);
        testMap.addOverlay(marker2);
        that.numMarkers.push(marker2);
      },
      //画所有的点
      drawDotts(GPSListObj, key){
        var that = this;
        var data = GPSListObj[key];
        var RealLongitude = data["RealLongitude"];
        var RealLatitude = data["RealLatitude"];
        var total = RealLongitude.length;
        var lastPonit = that.lastPonit;
        for(var i=0; i<total; i++){
          if(!lastPonit[key]){//第一次描点，将当前点记录为上个点
            lastPonit[key] = {};        
            lastPonit[key]["long"] = data["RealLongitude"][i];
            lastPonit[key]["lat"] = data["RealLatitude"][i];
            lastPonit[key]["online"] = data["online"][i];
            lastPonit[key]["devPushStatus"] = data["devPushStatus"][i];
            lastPonit[key]["TotalLossRate"] = data["TotalLossRate"][i];
            lastPonit[key]["noPoint"] = true;
          }
          var point = new BMap.Point(data["RealLongitude"][i], data["RealLatitude"][i]);
          //如果同一位置出现过非绿色点，则该点再变成绿色也不画绿点
          //同一位置丢包率显示最大的一个点
          if(lastPonit[key]["long"] == data["RealLongitude"][i]
            && lastPonit[key]["lat"] == data["RealLatitude"][i]){//当前点和上一个点位置相同
            
            if(data["online"][i] != 0//在线
              && data["devPushStatus"][i]!=0//推流中
              && data["TotalLossRate"][i] == 0//没有丢包
              && lastPonit[key]["noPoint"] == false){//不是第一次描点
                  continue;
            }

            if(data["TotalLossRate"][i] != 0//有丢包
              && data["TotalLossRate"][i]<lastPonit[key]["TotalLossRate"]){//丢包率小于上一秒的丢包率，则不画点
              continue;
            }
          }
          
          //画背包圆点
          that.drawDott(GPSListObj, key, i, point);

          //将当前点记为上一个点，用于下次描点比较
          lastPonit[key]["long"] = data["RealLongitude"][i];
          lastPonit[key]["lat"] = data["RealLatitude"][i];
          lastPonit[key]["online"] = data["online"][i];
          lastPonit[key]["devPushStatus"] = data["devPushStatus"][i];
          lastPonit[key]["TotalLossRate"] = data["TotalLossRate"][i];
          lastPonit[key]["noPoint"] = false;
        }  
        that.lastPonit = lastPonit;
      },
      //画背包圆点
      drawDott(GPSListObj, key, i, point){
        var img = "";
        var IMGSIZE = 0;
        var data = GPSListObj[key];
        var testMap = this.testMap;
        if(data["online"][i]==0){
          img = require("../../assets/img/gray10.png");
        }else if(data["devPushStatus"][i]==0){
          img = require("../../assets/img/orange10.png");
        }else if(data["TotalLossRate"][i] != 0){
          img = require("../../assets/img/red10.png");
        }else{
          img = require("../../assets/img/green10.png");
        }
        if (img.substr(img.length-6) == "10.png") {
          IMGSIZE = 10;
        }else{
          IMGSIZE = 15;
        }
        var myIconA = new BMap.Icon(img, new BMap.Size(IMGSIZE,IMGSIZE));
        var markerA = new BMap.Marker(point,{
          icon: myIconA, 
          offset: new BMap.Size(10, 10) //设置文本偏移量
        });  // 创建标注
        testMap.addOverlay(markerA);
        //标注的点击事件
        markerA.addEventListener("click", function(e){   
          var p = e.target;
          var lng = p.getPosition().lng;
          var lat = p.getPosition().lat;
          for(key in GPSListObj){
            var datas = GPSListObj[key];
            var realLong= datas["RealLongitude"];
            var realLat= datas["RealLatitude"];
            var opts = {
              width : 200,     // 信息窗口宽度
              height: 250,     // 信息窗口高度
              title : "背包:"+datas["dev_name"],//"故宫博物院" , // 信息窗口标题
              offset: new BMap.Size(10, 10)//, //设置文本偏移量
              //message:"序列号:"+key+"<br/>业务丢包:"+GPSListObj[key]["TotalLossRate"]
            }
            for(var j=realLong.length-1; j>=0; j--){
              if(realLong[j] == lng && realLat[j] == lat){
                var TotalLossRate = datas["TotalLossRate"][j];
                var showData = j;
                for(var k=j-1; k>=0; k--){
                  if(realLong[k] == lng && realLat[k] == lat){
                    if(datas["TotalLossRate"][k]!=TotalLossRate){
                      if((datas["TotalLossRate"][k]=="--"?0:datas["TotalLossRate"][k]) > (TotalLossRate=='--'?0:TotalLossRate)){
                        showData = k;
                      }
                    }else{
                      continue;
                    }
                  }else{
                    break;
                  }
                }

                var point = new BMap.Point(lng, lat);
                var loss = datas["TotalLossRate"][showData]=="--"?datas["TotalLossRate"][showData]:datas["TotalLossRate"][showData]/10+"%";
                var speed = datas["gpsSpeed"][showData]=="--"?datas["gpsSpeed"][showData]:datas["gpsSpeed"][showData]+"km/h";
                var delay= datas["dev_delay"][showData]=="--"?datas["dev_delay"][showData]:datas["dev_delay"][showData]/1000+"s";
                var dev_sr= datas["dev_sr"][showData]=="--"?datas["dev_sr"][showData]:datas["dev_sr"][showData]/1000+"Mbps";
                var infoWindow = new BMap.InfoWindow(
                  "序列号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+key+"<br/>"+
                  "时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+ datas["time"][showData]+"<br/>"+
                  "业务丢包&nbsp;&nbsp;&nbsp;&nbsp;: "+loss+"<br/>"+
                  "车速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+speed+"<br/>"+
                  "视频比特率&nbsp;&nbsp;:"+dev_sr+"<br/>"+
                  "延时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+delay+"<br/>"+
                  "SIM1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM1"][showData]+"<br/>"+
                  "SIM2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM2"][showData]+"<br/>"+
                  "SIM3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM3"][showData]+"<br/>"+
                  "SIM4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM4"][showData]+"<br/>"+
                  "SIM5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM5"][showData]+"<br/>"+
                  "SIM6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM6"][showData]+"<br/>"
                  , opts);  // 创建信息窗口对象 
                testMap.openInfoWindow(infoWindow, point); //开启信息窗口
                break;
              }
            }
          }
        }); 
      },
      //画所有的点
      drawAllData(GPSListObj, noImgFlg, noLabelFlg){
        var that = this;
        var testMap = this.testMap;
        if (testMap == undefined) {
          return;
        }
        testMap.clearOverlays();//清空覆盖物
        var mapZoom = localStorage.mapZoom;
        var center = JSON.parse(localStorage.mapCenter);
        point = new BMap.Point(center.lng, center.lat);
        testMap.centerAndZoom(point, mapZoom);
        that.getMapBorder(testMap, false);//获取当前显示地图的边界经纬度
        //清除数组的数据
        for(var key in GPSListObj){
          var data = GPSListObj[key];
          var RealLongitude = data["RealLongitude"];
          var RealLatitude = data["RealLatitude"];
          //判斷是否有正常定位信息，沒有就continue；
          var gpsStates = GPSListObj[key]["gpsState"];
          var lastId = 0;
          var totalPoint = RealLongitude.length;
          for(var p=totalPoint-1; p>=0; p--){
            if(RealLongitude[p] > 0){
              lastId = p;
            }
          }
          if(gpsStates[lastId] != 2 || RealLongitude[lastId] == 0 || RealLatitude[lastId] == 0){
            continue;
          }
          
          var point = new BMap.Point(RealLongitude[lastId], RealLatitude[lastId]);
          //画背包图片
          if(!noImgFlg){
            that.drawImg(point);  
          }
          
          //画背包文字说明
          if(!noLabelFlg){
            that.drawLabel(GPSListObj[key], point);
          }
          //画背包点
          that.drawDotts(GPSListObj, key); 
        }
      },
      //画路测过程中的一个点
      drawOneData(GPSListObj){
        console.log("drawOneData")
        var that = this;
        var testMap = this.testMap;
        if (testMap == undefined) {
          return;
        }
        var allOverlay = testMap.getOverlays();
        for (let overlay of allOverlay) {
          if (overlay instanceof BMap.Label) {
            testMap.removeOverlay(overlay);//删除label
          }
        }
        testMap.removeOverlay(that.numMarkers[0])//删除背包图片
        that.numMarkers = [];

        var mapZoom = localStorage.mapZoom;
        // 判断是否为第一次画点
        console.log("that.startTestDrawFlg:"+that.startTestDrawFlg)
        if(that.startTestDrawFlg){
          //以第一个有效点作为自动定位
          for(var key in GPSListObj){
            var data = GPSListObj[key];
            console.log(data)
            if(data["gpsState"][0]==2 && data["RealLatitude"][0]>0){
              var point = "";
              point = new BMap.Point(data["RealLongitude"][0], data["RealLatitude"][0]);  
              testMap.centerAndZoom(point, mapZoom);
              localStorage.mapCenter = JSON.stringify({"lng":data["RealLongitude"][0],"lat":data["RealLatitude"][0]});
              that.startTestDrawFlg = false;
              break;
            }
          }
        }
        console.log("localStorage.mapCenter")
        console.log(localStorage.mapCenter)
        that.getMapBorder(testMap, false);//获取当前显示地图的边界经纬度
        that.getAllDevRange(GPSListObj);//获取所有点的经纬度范围

        //清除数组的数据
        for(key in GPSListObj){
          var data = GPSListObj[key];
          var RealLongitude = data["RealLongitude"];
          var RealLatitude = data["RealLatitude"];
          //判斷是否有正常定位信息，沒有就continue；
          var gpsStates = GPSListObj[key]["gpsState"];
          if(gpsStates[0] != 2 || RealLongitude[0] == 0 || RealLatitude[0] == 0){
            continue;
          }
          var followPoint = localStorage.followPoint;
          //开启追踪
          if(followPoint){
            var mapSize = JSON.parse(localStorage.mapSize);
            mapSize[key]['lng']['max'] = mapSize[key]['lng']['max'] > RealLongitude[0] ?  mapSize[key]['lng']['max'] : RealLongitude[0];
            mapSize[key]['lng']['min'] = (mapSize[key]['lng']['min'] < RealLongitude[0] && mapSize[key]['lng']['min'] != 0) ?  mapSize[key]['lng']['min'] : RealLongitude[0];
            mapSize[key]['lat']['max'] = mapSize[key]['lat']['max'] > RealLatitude[0] ?  mapSize[key]['lat']['max'] : RealLatitude[0];
            mapSize[key]['lat']['min'] = (mapSize[key]['lat']['min'] < RealLatitude[0] && mapSize[key]['lat']['min'] != 0) ?  mapSize[key]['lat']['min'] : RealLatitude[0];
            var mapBorder = JSON.parse(localStorage.mapBorder);
            if(mapSize[followPoint]['lng']['max'] > mapBorder['lng']['max']){
              var point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,false);
              mapSize[key]['lng']['min'] = mapBorder.lng.min;
            }else if(mapSize[followPoint]['lng']['min'] < mapBorder['lng']['min']){
              var point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,false);
              mapSize[key]['lng']['max'] = mapBorder.lng.max;
            }else if(mapSize[followPoint]['lat']['max'] > mapBorder['lat']['max']){
              var point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,false);
              mapSize[key]['lat']['min'] = mapBorder.lat.min;
            }else if(mapSize[followPoint]['lat']['min'] < mapBorder['lat']['min']){
              var point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,false);
              mapSize[key]['lat']['max'] = mapBorder.lat.max;
            }
            localStorage.mapSize = JSON.stringify(mapSize);  
            localStorage.mapBorder = JSON.stringify(mapBorder);  
          }
          /*if($("#devZoom").selectpicker('val')){
            setMapNewZoom();
          }*/
         

          var point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
          //画背包图片
          that.drawImg(point);
          //画背包文字说明
          that.drawLabel(GPSListObj[key], point);
          //画背包点
          that.drawDotts(GPSListObj, key); 
        }
      },
      //获取所有点的经纬度范围
      getAllDevRange(GPSListObj){
        for(var key in GPSListObj){
          var data = GPSListObj[key];
          var RealLongitude = data["RealLongitude"];
          var RealLatitude = data["RealLatitude"];
          var allDevRange = JSON.parse(localStorage.allDevRange);//所有设备的经纬度最大最小值
          allDevRange[key]['lng']['max'] = allDevRange[key]['lng']['max'] > RealLongitude[0] ?  allDevRange[key]['lng']['max'] : RealLongitude[0];
          allDevRange[key]['lng']['min'] = (allDevRange[key]['lng']['min'] < RealLongitude[0] && allDevRange[key]['lng']['min'] != 0) ?  allDevRange[key]['lng']['min'] : RealLongitude[0];
          allDevRange[key]['lat']['max'] = allDevRange[key]['lat']['max'] > RealLatitude[0] ?  allDevRange[key]['lat']['max'] : RealLatitude[0];
          allDevRange[key]['lat']['min'] = (allDevRange[key]['lat']['min'] < RealLatitude[0] && allDevRange[key]['lat']['min'] != 0) ?  allDevRange[key]['lat']['min'] : RealLatitude[0];
          localStorage.allDevRange = JSON.stringify(allDevRange);
        }
      },
      //导入路测信息
      importTest(){
        console.log("importTest")
        var that = this;
        that.dis.deleteTest = false;
        /*var formData = new FormData();
        if($('#testCsv')[0].files.length == 0){
          that.$toast({
            message: "请先导入路测文件",
            position: 'middle',
            duration: 2000
          });
          return;
        }else if ($('#testCsv')[0].files.length > that.IMPORTMAX) {
          that.$toast({
            message: "最多导入"+that.IMPORTMAX+"条记录",
            position: 'middle',
            duration: 2000
          });
          return;
        }*/
        /*for(var i=0; i<$('#testCsv')[0].files.length;i++){
          formData.append('file[]', $('#testCsv')[0].files[i]);
        }*/
        /*if ($('#testCsv')[0].files.length == 0) {
          return;
        }*/
        that.roadTestMapVisible = true;
        that.testMap.clearOverlays();//清空覆盖物
        that.$axios({
          method: 'post',
          url:"/page/index/roadTest.php",
          data:formData,
          async: true, //异步
          type: 'post', //post方式
          datatype: "json",
          processData: false, //不处理数据流 !important,用于对data参数进行序列化处理 这里必须false
          contentType: false, //不设置http头 !important
        })
        .then(function (msg) {
          console.log("success");
          var data = msg.data.data;
          //将导入的描点数据格式化
          var formatData = that.formatImportData(data);
          var list = formatData.list;
          var roadTestDev = formatData.roadTestDev;        
          that.initAllDevRange(roadTestDev);//sessionStorage.allDevRange记录所有设备的整体经纬度范围
          var newList = that.hinoutList(list);//按各个设备总点数的比例抽取进行显示的点
          var viewPort = that.initMapZoom(newList);//导入记录，获取显示所有点的合适的mapzoom和center
          var mapZoom = viewPort.zoom;
          var mapCenter = viewPort.center;
          localStorage.mapZoom = mapZoom;
          localStorage.mapCenter = JSON.stringify(mapCenter);
          that.startTestDrawFlg = true; 
          that.drawAllData(newList);
          document.getElementById('testCsv').value = '';
          that.importEvent = true;
          that.testEvent = false;
          that.testMap.addEventListener("zoomend", function(evt){
            if(that.importEvent){
              that.refreshMapList(list);
            }
          });
          that.testMap.addEventListener("dragend", function(){
            if(that.importEvent){
              that.refreshMapList(list);
            }
          });
        })
        .catch(function (error) {
          console.log("error")
          console.log(error)
        })
        //that.clickImportBtnState();
      },
      //导入地图：过滤拖拽或缩放后在页面显示范围内的200个点
      refreshMapList(list){
        var that = this;
        that.testMap.clearOverlays();//清空覆盖物
        //testMarkerClusterer.clearMarkers();
        that.startTestDrawFlg = true;
        var noMapBorder = true;
        var showList = that.getMapShowData(list,noMapBorder);
        var newList = that.hinoutList(showList);
        localStorage.mapCenter = JSON.stringify(that.testMap.getBounds().getCenter());
        //drawTestMap(newList);        
        that.drawAllData(newList);        
      },
      //过滤出在显示范围内的点
      getMapShowData(list,noMapBorder){
        var that = this;
        var mapBorder = that.getMapBorder(that.testMap,noMapBorder);
        var lngMax = mapBorder.lng.max;
        var lngMin = mapBorder.lng.min;
        var latMax = mapBorder.lat.max;
        var latMin = mapBorder.lat.min;
        var showList = [];
        for(var key in list){
          that.initListData(list, showList, key);
          var data = list[key];
          var count = data["RealLatitude"].length;
          var lat = data["RealLatitude"];
          var lng = data["RealLongitude"];
          for(var i=0; i<count; i++){
            if(lat[i]>latMin && lat[i]<latMax
              && lng[i]>lngMin && lng[i]<lngMax){
              that.setNewListData(list, showList, key, i);
            }
          }
        }
        return showList;
      },
    }
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
  .ItemSelect1{
    width: 1.8rem;
    height: .26rem;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
  }
  .ItemSelect2{
    display: inline-block;
    width: 40%;
    background: #fff;
    color: #000;
    border: 0px;
    height: .26rem;
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
	.tableHead, .tableBody{
		display: flex;
    font-size: .14rem;
    padding: 5px 10px;
    text-align:center;
	}
	.tableHead>div, .tableBody>div{
		flex:1
	}
	.tableHead>div:nth-child(1),
	.tableBody>div:nth-child(1){
		text-align:left;
	}
	.tableHead>div:nth-child(4),
	.tableBody>div:nth-child(4){
		text-align:right;
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
  .onBoardStyle{
    color:#ff0000; 
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
  .devAuthority td{
    padding:4px 2px;
    border:1px solid #333;
    font-size:.14rem;
  }
  .mint-checklist a{
    background-color:transparent !important;
  }
  .mint-checklist-title{
    margin:0px;
  }
  .markIfo{
    display: inline-block;
    float: right;
    margin-left: 5px;
  }
  /*百度地图*/
  .BMap_stdMpZoom{
      width: 65px;
      height: 56px;
      position: absolute;
  }
  .BMap_stdMpZoom .BMap_button_new:first-child {
      border-bottom: 1px solid #ccc;
  }
  .BMap_stdMpZoom .BMap_button_new {
      box-shadow: 1px 2px 1px rgb(0 0 0 / 15%);
      cursor: pointer;
      width: 26px;
      height: 26px;
      left: 30px;
      overflow: hidden;
      background-color: #FFF;
      z-index: 10;
      position: absolute;
  }

  .BMap_stdMpCtrl div {
      position: absolute;
  }
  .BMap_stdMpZoom .BMap_button_new .in {
      width: 10px;
      height: 10px;
      top: 8px;
      left: 8px;
      background-image: url("../../assets/img/mapZoom.png");
      background-position: 0 0;
      position: absolute;
  }
  .BMap_stdMpZoom .BMap_button_new:hover .in {
      background-position: -20px 0;
  }
  .BMap_stdMpZoomOut{
      top:27px;
  }
  .BMap_stdMpZoom .BMap_button_new .out {
      width: 10px;
      height: 10px;
      top: 8px;
      left: 8px;
      background-image: url("../../assets/img/mapZoom.png");
      background-position: -10px 0;
      position: absolute;
  }
  .BMap_stdMpZoom .BMap_button_new:hover .out {
      background-position: -30px 0;
  }
  .mint-indicator-wrapper{
    z-index:10000;
  }
  .roadTestDevShow .mint-cell{
    background:transparent !important;
    width:65%;
    display:inline-block;
  }
  .roadTestDevShow .mint-cell-value{
    width:auto !important;
  }
  .roadTestDevShow .mint-cell-text{
    font-size:.14rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    display:inline-block;
    width:100%;
  }
  .roadTest .mint-popup{
    background-color: #212227;
    width: 100% !important;
    height: auto;
  }
  .roadTestPop .mint-checkbox-label{
    font-size:.14rem !important;
  }
  .roadTestDevShow .mint-cell-wrapper{
    width:100%;
  }
  .roadTestDevShow .mint-cell-title{
    width:100%;
  }
  .gpsInfo{
    max-width: 300px;
    background-color: white;
    color:red;
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
  .mint-popup.roadTestParamPopup{
    border-radius: 6px;
    background-color: #EEE;
    width: 90% !important;
    overflow-y: auto;
    border-radius: 4px;
  }
  /*.mint-toast{
    z-index:2010 !important;
  }*/
</style>