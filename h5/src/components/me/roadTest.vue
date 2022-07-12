<template>
  <div class="roadTest">
    <div class="Group" style="height:100%">
      <div class="GroupTitle popListTitle" @click="changeRoadTestShow">
        路测
        <i class="titleIcon fa chevronStyle" :class="[RoadTestShow == true ? 'fa-chevron-left': 'fa-chevron-right']"></i>
      </div>
      <mt-popup v-model="RoadTestShow" position="right" popup-transition="popup-fade" class="rightPop">
        <div class="GroupItem" v-if="RoadTestShow"  style="height:100%;background-color:#000;padding: 0px;border: 0px;">
          <div class="popTitle">
            <div class="back">
              <div @click="quitRoadTest" class="popTitleBack">
                <i class="fa fa-chevron-left chevronWidth chevronColor" aria-hidden="true"></i>
                <span style="color:#fff">设置路测参数</span>
              </div>
            </div>
          </div>
          <div class="Group roadTestConfig">
            <transition name="slide-fade">
              <div class="GroupItem" v-show="RoadTestShow" style="border:none">
                <div class="GroupItem">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">类型</div>
                    <div class="GroupItemValue width70">
                      <mt-radio
                        v-model="roadTestType"
                        :options="ROAD_TEST_TYPE"
                        @change="changeRoadTestType">
                      </mt-radio>
                    </div>
                  </div>
                </div>
                <div class="GroupItem" v-if="show.devName">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">背包名称</div>
                    <div class="GroupItemValue width70" @click.stop="roadTestDevList = true" >
                      <span style="color:#fff">{{ roadTestDevText }}</span>
                      <span style="float:right;color:#fff">
                        <i class="fa fa-chevron-down"></i>
                      </span>
                      <!-- <select class="ItemSelect" v-model="roadTestDev" @change="changeDev">
                        <template v-for="(item,i) in roadTestDevOptions">
                          <option :value="item.value">{{ item.text }}</option>
                        </template>
                      </select> -->
                    </div>
                  </div>
                </div>
                <div class="GroupItem" v-if="show.importDate">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">选择路测日期</div>
                    <div class="GroupItemValue width70">
                      <select class="ItemSelect" v-model="importTestDate" @change="changeImportDate">
                        <template v-for="(item,i) in importTestDateOptions">
                          <option :value="item.value">{{ item.text }}</option>
                        </template>
                      </select>
                    </div>
                  </div> 
                </div>
                <div class="GroupItem" v-if="show.importFile">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">选择路测文件</div>
                    <div class="GroupItemValue width70">
                      <select class="ItemSelect" v-model="importTestFile" @change="changeImportTestFile">
                        <template v-for="(item,i) in importTestFileOptions">
                          <option :value="item.value">{{ item.text }}</option>
                        </template>
                      </select>
                    </div>
                  </div> 
                </div>
                <div class="GroupItem" v-if="show.importBtn">
                  <div class="GroupItemField">
                    <div class="GroupItemValue width70" style="margin-left:30%">
                      <button @click="importTestData">导入路测文件</button>
                    </div>
                  </div> 
                </div>
                <div class="GroupItem" v-if="show.dataType">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">数据类型</div>
                    <div class="GroupItemValue width70">
                      <select class="ItemSelect" v-model="dataType" @change="changeDataType">
                        <template v-for="(item,i) in dateTypeOptions">
                          <option :value="item.value" v-if="item.value==1||item.value==2||((item.value==3||item.value==4)&&roadTestType == 1)">{{ item.text }}</option>
                        </template>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="GroupItem" v-if="show.bitRateRange">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">码率范围</div>
                    <div class="GroupItemValue width70" style="color:#fff">
                      <span class="dot dot1"></span>
                      <span class="level_show">0</span>
                      <span> ~</span>&nbsp;
                      <input type="text" class="levelInput" v-model="bitRange.bit_level1"> 
                      <br />
                      <span class="dot dot2"></span>
                      <span class="level_show">{{ bitRange.bit_level1 }}</span>
                      <span> ~</span>&nbsp;
                      <input type="text" class="levelInput" v-model="bitRange.bit_level2"> 
                      <br />                      
                      <span class="dot dot3"></span>
                      <span class="level_show">{{ bitRange.bit_level2 }}</span>
                      <span> ~</span>&nbsp;
                      <input type="text" class="levelInput" v-model="bitRange.bit_level3"> 
                      <br />
                      <span class="dot dot4"></span>
                      <span class="level_show">{{ bitRange.bit_level3 }}</span>
                      <span> ~</span>&nbsp;
                      <input type="text" class="levelInput" v-model="bitRange.bit_level4"> 
                      <br />
                      <span class="dot dot5"></span>
                      <span class="level_show">{{ bitRange.bit_level4 }}</span>
                      <span> ~</span>&nbsp;
                      <span>{{ bitRange.bit_level5 }}</span>
                    </div>
                  </div>
                </div>
                <div class="GroupItem" v-if="show.speedRateRange">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">速率范围</div>
                    <div class="GroupItemValue width70" style="color:#fff">
                      <span class="dot dot1s"></span>
                      <span class="level_show">0%</span>
                      <span> ~</span>&nbsp;
                      <input type="text" class="levelInput" v-model="speedRange.speed_level1">%
                      <br />
                      <span class="dot dot2s"></span>
                      <span class="level_show">{{ speedRange.speed_level1 }}%</span>
                      <span> ~</span>&nbsp;
                      <input type="text" class="levelInput" v-model="speedRange.speed_level2">% 
                      <br />                      
                      <span class="dot dot3s"></span>
                      <span class="level_show">{{ speedRange.speed_level2 }}%</span>
                      <span> ~</span>&nbsp;
                      <input type="text" class="levelInput" v-model="speedRange.speed_level3">%
                      <br />                    
                      <span class="dot dot4s"></span>
                      <span class="level_show">{{ speedRange.speed_level3 }}%</span>
                      <span> ~</span>&nbsp;
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                <div class="GroupItem" v-if="show.card5G">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">5G覆盖网卡</div>
                    <div class="GroupItemValue width70"  @click.stop="card5GList = true" >
                      <span style="color:#fff">{{ card5GText }}</span>
                      <span style="float:right;color:#fff">
                        <i class="fa fa-chevron-down"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="GroupItem" v-if="show.dotsCount">
                  <div class="GroupItemField">
                    <div class="GroupItemTitle width30">显示点数</div>
                    <div class="GroupItemValue width70">
                      <select class="ItemSelect" v-model="showPoint">
                        <template v-for="(item,i) in showPointOptions">
                          <option :value="item.value">{{ item.text }}</option>
                        </template>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="GroupItem" v-if="show.mapShowBtn">
                  <div class="GroupItemField">
                    <div class="GroupItemValue width70" style="margin-left:30%">
                      <mt-button size="small" type="primary" :disable="dis.startTestDis" @click="startRoadTest" v-if="roadTestType == 0 && !testing">开始路测</mt-button>
                      <mt-button size="small" type="primary" :disable="dis.startTestDis" @click="roadTestMapVisible = true" v-if="roadTestType == 0 && testing">查看路测</mt-button>
                      <mt-button size="small" type="primary" :disable="dis.startTestDis" @click="importRoadTest" v-if="roadTestType == 1">查看导入路测信息</mt-button>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </mt-popup>
    </div>
    <!-- 5G网卡 -->
    <mt-popup v-model="card5GList" position="bottom" popup-transition="popup-slide" class="userPrefixPop">
      <span class="chevronDown"  @click.stop="card5GList=false">
        <i class="fa fa-chevron-down"></i>
      </span>
      <mt-checklist
        v-model="card5GArr"
        :options="OPTION_CARD_5G"
        @change="changeCard5G">
      </mt-checklist>
    </mt-popup>
    <!-- 路测地图 -->
    <mt-popup v-model="roadTestMapVisible" position="right" popup-transition="popup-slide" class="wholePagePop devAuthority" style="height:100%">
      <div class="page-navbar">
        <div class="page-title" :style="{height:titleHeight-20}"><!-- style="height:70px" --> 
          <i class="fa fa-arrow-left" aria-hidden="true" @click="backToRoadConfig" style="position:absolute"></i>
          <div style="display:block">
            <div class="markIfo">
              <span style="display:inline-block;text-align:right;width:100%">
                <span v-if="dataType == 1"><!-- 丢包率 -->
                  <span style="color:#00ff00">无丢包 </span>
                  <!-- <i class="fa fa-circle" aria-hidden="true" style="color:#00ff00"></i> -->
                </span>
                <span style="color:#C5C5C5">离线 </span>
                <span style="color:#722ed1">NO INPUT </span>
                <!-- <i class="fa fa-circle" aria-hidden="true" style="color:#C5C5C5"></i> -->
                <span style="color:#1890ff">停止推流 </span>
                <!-- <i class="fa fa-circle" aria-hidden="true" style="color:#FFA900"></i> -->
                <span style="color:#FF0000">丢包</span>
                <!-- <i class="fa fa-circle" aria-hidden="true" style="color:#FF0000"></i> -->
              </span>
              <span style="display:inline-block;text-align:right;width:100%;margin-top:5px">
                <span v-if="dataType == 2" style="display:inline-block;float:right"><!-- 丢包率+编码码率 -->
                  <span class="green1Point">0~{{bitRange.bit_level1}}</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle green1Point" aria-hidden="true"></i> -->
                  <span class="green2Point">{{bitRange.bit_level1}}~{{bitRange.bit_level2}}</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle green2Point" aria-hidden="true"></i> -->
                  <span class="green3Point">{{bitRange.bit_level2}}~{{bitRange.bit_level3}}</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle green3Point" aria-hidden="true"></i> -->
                  <span class="green4Point">{{bitRange.bit_level3}}~{{bitRange.bit_level4}}</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle green4Point" aria-hidden="true"></i> -->
                  <span class="green5Point">{{bitRange.bit_level4}}~{{bitRange.bit_level5}}</span>
                  <!-- <i class="fa fa-circle green5Point" aria-hidden="true"></i> -->
                </span>
                <span v-else-if="dataType == 3" style="display:inline-block;float:right"><!-- 上传速率 -->
                  <span class="redPoint">0%~{{speedRange.speed_level1}}%</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle redPoint" aria-hidden="true"></i> -->
                  <span class="orangePoint">{{speedRange.speed_level1}}%~{{speedRange.speed_level2}}%</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle orangePoint" aria-hidden="true"></i> -->
                  <span class="yellowPoint">{{speedRange.speed_level2}}%~{{speedRange.speed_level3}}%</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle yellowPoint" aria-hidden="true"></i> -->
                  <span class="greenPoint">{{speedRange.speed_level3}}%~100%</span>
                  <!-- <i class="fa fa-circle greenPoint" aria-hidden="true"></i> -->
                </span>
                <span v-else-if="dataType == 4" style="display:inline-block;float:right"><!-- 5G覆盖 -->
                  <span class="redPoint">全不覆盖</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle redPoint" aria-hidden="true"></i> -->
                  <span class="yellowPointDark">覆盖卡数小于{{card5GArr.length}}</span>&nbsp;&nbsp;/&nbsp;&nbsp;
                  <!-- <i class="fa fa-circle yellowPoint" aria-hidden="true"></i> -->
                  <span class="greenPoint">全覆盖</span>
                  <!-- <i class="fa fa-circle greenPoint" aria-hidden="true"></i> -->
                </span>
              </span>
            </div>
          </div>
          <div style="display:inline-block;margin-top: 5px;width: 100%;text-align:right" v-if="roadTestType==0 && active==1">
            <select class="ItemSelectBlack" v-model="followDev" style="width:35%;display:inline-block" @change="followDevChange">
              <template v-for="(item,i) in followDevOptions">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
            <select class="ItemSelectBlack" v-model="zoomDev" style="width:35%;display:inline-block;margin-left:10px;" @change="zoomDevChange">
              <template v-for="(item,i) in zoomDevOptions">
                <option :value="item.value">{{ item.text }}</option>
              </template>
            </select>
            <button @click="stopRoadTest" v-if="active==1" style="margin-left:10px;">停止路测</button>  
          </div>
        </div>
        <div style="position: relative;" :style="{height:baiduMapHeight}"><!-- style="height:clac(100% - 90)" --> <!--   -->
          <div style="width: 100%; min-height:400px;" id="test_map"  :style="{'height': baiduMapHeight + 'px','margin-top':marginTop+'px'}"></div>
          <div class="gpsInfo" v-if="show.gpsInfo">{{gpsInfo}}
          </div>
        </div>
      </div>
    </mt-popup>

     <!-- 设备列表 -->
    <mt-popup v-model="roadTestDevList" position="bottom" popup-transition="popup-slide" class="roadTestPop">
      <span class="chevronDown"  @click.stop="roadTestDevList=false">
        <i class="fa fa-chevron-down"></i>
      </span>
      <mt-checklist
        v-model="roadTestDevSel"
        :options="roadTestDevOptions"
        @change="changeDev">
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
        titleHeight:90,
        marginTop:0,
        devSeries:"",
        DStreamer_BUILD:DStreamer_BUILD,
        card5GList:false,
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
        roadTestDevList:false,
        roadTestMapVisible:false,//路测地图
        roadTestParamVisible:false,//路测参数设置页面
        active:"1",
        testMap:"",
        startTestDrawFlg:true,
        roadTestDev:[],
        roadTestDevSel:[],
        roadTestDevText:"",
        roadTestDevOptions:[],
        importTestDate:"",
        importTestDateOptions:[],
        importTestFile:"",
        importTestFileOptions:[],
        //importTestData:[],
        followDev:[],
        followDevOptions:[],
        zoomDev:[],
        zoomDevOptions:[],
        devFocus:"",
        devFocusOptions:[],
        devZoom:"",
        devZoomOptions:[],
        showPoint:200,
        dataType:1,
        show:{
          devName:false,
          importDate:false,
          importFile:false,
          importBtn:false,
          dataType:false,
          bitRateRange:false,
          speedRateRange:false,
          dotsCount:false,
          mapShowBtn:false,
          gpsInfo:false,
        },
        dis:{
          roadTestDevDis:false,
          startTestDis:false,
          deleteTest:false,//删除路测
          importTest:false,
        },
        ROAD_TEST_TYPE:[{label:"实时路测",value:"0"},{label:"导入路测文件",value:"1"}],
        dateTypeOptions:[{text:"丢包率",value:"1"},
                        {text:"丢包率+编码码率",value:"2"},
                        {text:"上传速率",value:"3"},
                        {text:"5G覆盖",value:"4"}],
        showPointOptions:[{text:"200",value:"200"},
                          {text:"400",value:"400"},
                          {text:"600",value:"600"},
                          {text:"1000",value:"1000"}],
        roadTestType:0,
        mapHeight:"",
        baiduMapHeight:"",
        ISReload:false,
        bitRange:{
          bit_level1:" ",
          bit_level2:" ",
          bit_level3:" ",
          bit_level4:" ",
          bit_level5:" ",
        },
        speedRange:{
          speed_level1:" ",
          speed_level2:" ",
          speed_level3:" ",
        },
        OPTION_CARD_5G:"",
        card5GArr:[],
        card5GText:"",
        card5GTextArr:[],
        card5G: [{label: "SIM1",value: "1"},
                  {label: "SIM2",value: "2"},
                  {label: "SIM3",value: "3"},
                  {label: "SIM4",value: "4"},
                  {label: "SIM5",value: "5"},
                  {label: "SIM6",value: "6"}],
        downloadData:"",
        mapHeight:"",
        restPos:false,
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
      this.initRoadTestMap();
      //this.initOnlineDev(that.formatDevSelect);
      //this.initImportDate();
      this.roadTestType = 0;
      this.initConfigParamShow();
    },
    activated(){
      console.log("roadTest activated");
    },
    mounted(){ 
      console.log("roadTest mounted");
    },
    methods:{
      ...mapMutations({
          
      }),
      backToRoadConfig(){
        var that = this;
        console.log("backToRoadConfig")
        if(this.importEvent){//导入后返回
          this.importEvent = false;
          this.show.dataType = false;
          this.show.bitRateRange = false;
          this.show.speedRateRange = false;
          this.show.card5G = false;
          this.show.dotsCount = false;
          this.show.mapShowBtn = false;
          this.roadTestMapVisible = false;
        }else if(this.testEvent){//正在测试中返回
          var text = '返回将终止路测，确认返回？';
          //询问
          this.$messagebox.confirm(text).then(
            action => {
              that.stopRoadTest();
              that.roadTestMapVisible = false;
            },
            action => {
              that.roadTestMapVisible = true;
            } 
          );
          this.show.mapShowBtn = true;
        }else{//测试结束后返回
          this.roadTestDevText = "";
          this.roadTestDevSel = [];
          this.show.dataType = false;
          this.show.dotsCount = false;
          this.show.mapShowBtn = false;
          this.roadTestMapVisible = false;
        }
      },
      changeRoadTestShow(){//显示路测参数页面
        var that = this;
        this.RoadTestShow = !this.RoadTestShow;
        this.roadTestType = 0;//默认选择实时路测
        this.downloadData = "";//待解析的导入数据
        this.changeRoadTestType();
        //this.initOnlineDev(that.formatDevSelect);
        //this.initImportDate();
      },
      changeRoadTestType(){//修改类型 实时路测or导入路测
        this.initConfigParamShow(); 
      },
      initConfigParamShow(){
        var that = this;
        if(this.roadTestType == 0){//实时路测
          this.initOnlineDev(that.formatDevSelect);//请求路测背包
          this.show.devName = true;//背包名称
          //this.roadTestDev = "";
          this.show.dataType = false;
          this.show.importDate = false;//选择路测日期
          this.show.importFile = false;//选择路测文件
          this.show.importBtn = false;//导入路测文件
          this.show.card5G = false;//5g覆盖
          this.changeDev();
          this.titleHeight = 70;
          this.marginTop = 0;
        }else{  //导入路测
          this.show.devName = false;//背包名称
          this.initImportDate();//请求路测文件日期
          this.show.importDate = true;//选择路测日期
          this.show.importFile = true;//选择路测文件
          this.show.importBtn = true;//导入路测文件
          this.titleHeight = 70;
          this.marginTop = 50;
          if(!this.importEvent){
            this.show.dataType = false;
            this.show.bitRateRange = false;
            this.show.speedRateRange = false;
            this.show.card5G = false;
            this.show.dotsCount = false;
            this.show.mapShowBtn = false;
          }
        }     
      },
      changeDev(){//实时路测 修改背包名称
        var that = this;
        this.roadTestDevText = this.roadTestDevOptions.filter(function(item){
          if(that.roadTestDevSel.indexOf(item.value) != -1){
            return item;
          }
        }).map(function(item){
          return item.label;
        }).join(",")
        if(this.roadTestDevText){
          this.show.dataType = true;//数据类型
          this.dataType = 1;
          this.show.bitRateRange = false;//码率范围
          this.show.speedRateRange = false;//速率范围
          this.show.dotsCount = false;//显示点数 实时路测不能选点数，默认200
          this.showPoint = 200;
          this.show.mapShowBtn = true;//btn
          this.getBitRateRange(that.roadTestDevSel[0]);
        }else{
          this.show.dataType = false;
          this.show.bitRateRange = false;//码率范围
          this.show.speedRateRange = false;//速率范围
          this.show.dotsCount = false;
          this.show.mapShowBtn = false;
        }
        this.changeStartDisable()
      },
      getBitRateRange(roadTestDev){
        var that = this;
        this.$global.getDevOneParam(roadTestDev, 'dev_sr', function(data){
          var maxSr = (data["dev_sr"]/1000).toFixed(1);
          that.bitRange.bit_level5 = maxSr;
          var intervalSr = parseFloat(maxSr/5);
          that.bitRange.bit_level1 = intervalSr.toFixed(1);
          that.bitRange.bit_level2 = (intervalSr*2).toFixed(1);
          that.bitRange.bit_level3 = (intervalSr*3).toFixed(1);
          that.bitRange.bit_level4 = (intervalSr*4).toFixed(1);
        }) 
      },
      initImportDate(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/roadTest.php",
          data:this.$qs.stringify({
            getImportFolder: true,
          }),
          Api:"getImportFolder",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            that.importTestDateOptions = [];
            for(var i=0; i<data.length; i++){
              that.importTestDateOptions.unshift({text:data[i],value:data[i]})
            }
            if(data.length != 0){
              that.importTestDate = that.importTestDateOptions[0]["value"]; 
              that.changeImportDate();
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
      changeImportDate(){
        var that = this;
        this.$axios({
          method: 'post',
          url:"/page/index/roadTest.php",
          data:this.$qs.stringify({
            getImportFileName: true,
            importFolderName:that.importTestDate
          }),
          Api:"getImportFileName",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var data = res.data;
            that.importTestFileOptions = [];
            for(var i=0; i<data.length; i++){
              that.importTestFileOptions.push({text:data[i],value:data[i]})
            }
            if(data.length != 0){
              that.importTestFile = data[0];
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
      changeImportTestFile(){
        if(this.importTestFile){
          this.show.importBtn = true;//导入路测文件
        }else{
          this.show.importBtn = false;//导入路测文件
          this.show.dataType = false;//数据类型
          this.show.bitRateRange = false;//码率范围
          this.show.speedRateRange = false;//速率范围
          this.show.dotsCount = false;//显示点数
          this.show.mapShowBtn = false;//btn
        }
      },
      //改变数据类型
      changeDataType(){
        if(this.dataType == 2){
          this.show.bitRateRange = true;
          this.show.speedRateRange = false;
          this.show.card5G = false;
        }else if(this.dataType == 3){
          this.show.bitRateRange = false;
          this.show.speedRateRange = true;
          this.show.card5G = false;
        }else if(this.dataType == 4){
          this.show.bitRateRange = false;
          this.show.speedRateRange = false;
          this.show.card5G = true;
        }else{
          this.show.bitRateRange = false;
          this.show.speedRateRange = false;
          this.show.card5G = false;
        }
      },
      //5G网卡选择
      changeCard5G(){
        var that = this;
        this.card5GTextArr = this.card5G.filter(function(item){
          return (that.card5GArr.indexOf(item.value) != -1)
        }).map(function(item){
          return item.label;
        })
        this.card5GText = this.card5GTextArr.join(",");
        return;
      },
      //导入路测文件  按钮
      importTestData(){
        this.show.dataType = true;
        this.changeDataType();
        this.show.card5G = false;
        this.show.bitRateRange = false;
        this.show.speedRateRange = false;
        this.show.dotsCount = true;
        this.show.mapShowBtn = true;
        this.dataType = 1;
        this.card5GArr = [];
        this.card5GText = "";
        this.showPoint = 200;
        /*this.importTestDataTest();
        return;*/
        var that = this;
        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fs) {
              //that.DStreamer_BUILD = "D:/SYNCOR/Web/1080_4000";
              let url = that.$axios.defaults.baseURL+'/data/driveTest/'+that.importTestDate+"/"+that.importTestFile;
              fs.root.getFile('roadTest.csv', { create: true, exclusive: false },
                function(fileEntry) {
                  download(fileEntry, url)
                },
                function(){
                  console.log("onErrorCreateFile")
                }
              )
            },
            function(){
              console.log("onErrorLoadFs")
            }
          )
        }
        function download(fileEntry, uri) {
          var fileTransfer = new FileTransfer();
          var fileURL = fileEntry.toURL();
          fileTransfer.download(
            uri, 
            fileURL,//window.cordova.file.externalRootDirectory + 'test.apk',//
            function (fileEntry) {
              fileEntry.file(function (file) {
                var reader = new FileReader();
                reader.onloadend = function() {
                  var fileStr = this.result;
                  that.downloadData = fileStr.split("\r\n");
                  if(that.downloadData){
                    that.show.dataType = true;//数据类型
                    that.dataType = 1;
                    that.show.bitRateRange = false;//码率范围
                    that.show.speedRateRange = false;//速率范围
                    that.show.dotsCount = true;//显示点数
                    that.show.mapShowBtn = true;//btn
                  }else{
                    that.show.importBtn = false;//导入路测文件
                    that.show.dataType = false;//数据类型
                    that.show.bitRateRange = false;//码率范围
                    that.show.speedRateRange = false;//速率范围
                    that.show.dotsCount = false;//显示点数
                    that.show.mapShowBtn = false;//btn
                  }
                  var formatData = that.formatImportData(that.downloadData);
                  that.initImportRangeParam(formatData)
                };
                reader.readAsText(file);
              }, function (error) {
                console.log(error)
              });
            },
            function (error) {
              console.log("download error source " + error.source);
              console.log("download error target " + error.target);
              console.log("download error code" + error.code);
              console.log(error)
            },
            null, // or, pass false
            {
              //headers: {
              //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
              //}
            }
          );
        }
      },
      importTestDataTest(){
        var that = this;

        that.downloadData = ["DevSn,1002012146,,,,",
                            "DevName,西安,,,,",
                            "RcvSn,1001282141,,,,",
                            "Board,板卡板卡1,",
                            "No., Time, GPS Status(0：失锁 1：正在搜索：2：已连接), Longitude, Latitude, BD Longitude, BD Latitude, Loss Rate(%), Push BR(Mbps), AVBRGPS(Mbps), bitrate mode(1:AVBR 0:CBR), GPS Speed(km/h), video bitrate(Mbps), delay, SIM1, SIM2, SIM3, SIM4, SIM5, SIM6, Online, Push Enable",
                            "1,13:36:48,2,108.089688,34.256267,108.101087,34.261079,0,5653/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -59dBm,电信 | NSA | -57dBm,移动 | SA | -81dBm,联通 | NSA | -55dBm,1,0,",
                            "2,13:36:49,2,108.089788,34.256267,108.101187,34.261179,0,5723/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -59dBm,电信 | NSA | -57dBm,移动 | SA | -84dBm,联通 | NSA | -55dBm,1,0,",
                            "3,13:36:50,2,108.089888,34.256267,108.101287,34.261279,0,5723/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -59dBm,电信 | NSA | -57dBm,移动 | SA | -84dBm,联通 | NSA | -55dBm,1,1,",
                            "4,13:36:51,2,108.089988,34.256267,108.101387,34.261379,0,6336/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -84dBm,联通 | NSA | -55dBm,1,1,",
                            "5,13:36:52,2,108.089188,34.256267,108.101487,34.261479,0,5669/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -84dBm,联通 | NSA | -55dBm,1,1,",
                            "6,13:36:53,2,108.089288,34.256267,108.101587,34.261579,0,5669/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -84dBm,联通 | NSA | -55dBm,1,1,",
                            "7,13:36:54,2,108.089388,34.256267,108.101687,34.261679,0,5617/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -74dBm,联通 | NSA | -55dBm,1,1,",
                            "8,13:36:55,2,108.089488,34.256267,108.101787,34.261779,0,5572/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -63dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -83dBm,联通 | NSA | -55dBm,1,1,",
                            "9,13:36:56,2,108.089588,34.256267,108.101887,34.261879,0,5572/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -63dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -83dBm,联通 | NSA | -55dBm,1,1,",
                            "10,13:36:57,2,108.086688,34.256267,108.101987,34.261979,0,5415/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -63dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -83dBm,联通 | NSA | -55dBm,1,0,",
                            "11,13:36:58,2,108.089688,34.256267,108.101087,34.261079,0,5627/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -63dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -78dBm,联通 | NSA | -55dBm,1,1,",
                            "12,13:36:59,2,108.089688,34.256267,108.101087,34.261079,0,5627/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -63dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -78dBm,联通 | NSA | -55dBm,1,1,",
                            "13,13:37:00,2,108.089688,34.256267,108.101087,34.261079,0,5686/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -63dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -78dBm,联通 | NSA | -55dBm,1,1,",
                            "14,13:37:01,2,108.089688,34.256267,108.101087,34.261079,0,5612/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -82dBm,联通 | NSA | -55dBm,1,1,",
                            "15,13:37:02,2,108.089688,34.256267,108.101087,34.261079,0,5658/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -82dBm,联通 | NSA | -55dBm,1,1,",
                            "16,13:37:03,2,108.089688,34.256267,108.101087,34.261079,0,5658/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -82dBm,联通 | NSA | -55dBm,1,1,",
                            "17,13:37:04,2,108.089688,34.256267,108.101087,34.261079,0,6307/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -82dBm,联通 | NSA | -55dBm,1,1,",
                            "18,13:37:05,2,108.089688,34.256267,108.101087,34.261079,0,5691/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -83dBm,联通 | NSA | -55dBm,1,1,",
                            "19,13:37:06,2,108.089688,34.256267,108.101087,34.261079,0,5691/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -83dBm,联通 | NSA | -55dBm,1,1,",
                            "20,13:37:07,2,108.089688,34.256267,108.101087,34.261079,0,5654/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -65dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -81dBm,联通 | NSA | -55dBm,1,1,",
                            "21,13:37:08,2,108.089688,34.256267,108.101087,34.261079,0,5613/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -61dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -81dBm,联通 | NSA | -55dBm,1,1,",
                            "22,13:37:09,2,108.089688,34.256267,108.101087,34.261079,0,5613/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -61dBm,联通 | LTE | -61dBm,电信 | NSA | -57dBm,移动 | SA | -81dBm,联通 | NSA | -55dBm,1,1,",
                            "23,13:37:10,2,108.089688,34.256267,108.101087,34.261079,0,5663/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -61dBm,--,电信 | NSA | -57dBm,移动 | SA | -82dBm,联通 | NSA | -55dBm,1,1,",
                            "24,13:37:11,2,108.099688,34.256267,108.111087,34.271079,0,5663/100%,5000/100%,1,0.000,5000,2000,电信 | LTE | -57dBm,移动 | LTE | -61dBm,--,电信 | NSA | -57dBm,移动 | SA | -82dBm,联通 | NSA | -55dBm,1,1,"];
        if(that.downloadData){
          that.show.dataType = true;//数据类型
          that.changeDataType();
          that.show.dotsCount = true;//显示点数
          that.show.mapShowBtn = true;//btn
        }else{
          that.show.importBtn = false;//导入路测文件
          that.show.dataType = false;//数据类型
          that.show.bitRateRange = false;//码率范围
          that.show.speedRateRange = false;//速率范围
          that.show.dotsCount = false;//显示点数
          that.show.mapShowBtn = false;//btn
        }
        var formatData = that.formatImportData(that.downloadData);
        that.initImportRangeParam(formatData)
      },
      initImportRangeParam(formatData){
        var list = formatData.list;
        /*var devSn = formatData.roadTestDev;   
        var devSeries = this.$global.getDevSeries(devSn[0]);*/
        /*5G网卡 -- start*/
        var newCard = [];
        if(this.devSeries == "4000"){
          this.OPTION_CARD_5G = this.card5G;
        }else if(this.devSeries == "1080"){
          for(var i=0; i<this.card5G.length; i++){
            if(i<3){
              newCard.push(this.card5G[i]);
            }
          }
          this.OPTION_CARD_5G = newCard;
        }
        /*5G网卡 -- end*/
        var maxDevSr = 0;
        for(var key in list){
          var devSrArr = list[key]["dev_sr"];
          for(var i=0; i<devSrArr.length; i++){
            var speed = devSrArr[i].split("/")[0] ;
            maxDevSr = speed>maxDevSr?speed:maxDevSr;
          }
        }
        var maxSr = (maxDevSr/1000).toFixed(1);
        var intervalSr = parseFloat(maxSr/5);
        this.bitRange.bit_level5 = maxSr;
        this.bitRange.bit_level1 = intervalSr.toFixed(1);
        this.bitRange.bit_level2 = (intervalSr*2).toFixed(1);
        this.bitRange.bit_level3 = (intervalSr*3).toFixed(1);
        this.bitRange.bit_level4 = (intervalSr*4).toFixed(1);
        this.speedRange.speed_level1 = 25;
        this.speedRange.speed_level2 = 50;
        this.speedRange.speed_level3 = 75;
      },
      checkImportParam(){
        if(this.show.bitRateRange){
          if(this.bitRange.bit_level1*1 > 0 
            && this.bitRange.bit_level1*1 < this.bitRange.bit_level2*1
            && this.bitRange.bit_level2*1 < this.bitRange.bit_level3*1
            && this.bitRange.bit_level3*1 < this.bitRange.bit_level4*1
            && this.bitRange.bit_level4*1 < this.bitRange.bit_level5*1){
            return true;
          }else{
            return false;
          }
        }else if(this.show.speedRateRange){
          if(this.speedRange.speed_level1*1 <this.speedRange.speed_level2*1
            && this.speedRange.speed_level2*1 < this.speedRange.speed_level3*1){
            return true;
          }else{
            return false;
          }
        }else if(this.show.card5G){
          if(this.card5GText != ""){
            return true;
          }else{
            return false;
          }
        }else{
          return true;
        }
      },
      //导入路测信息
      importTestMap(){
        var that = this;
        if(!this.checkImportParam()){
          this.$toast({
            message: "请检查参数",
            position: 'middle',
            duration: 2000
          });
          return ;
        }
        that.dis.deleteTest = false;
        that.roadTestMapVisible = true;
        setTimeout(function(){
          that.initRoadTestMap();
          that.testMap.clearOverlays();//清空覆盖物
          //将导入的描点数据格式化
          var formatData = that.formatImportData(that.downloadData);
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
        },500)
      },
      stopRoadTest(){
        var that = this;
        that.testing = false;
        that.testEvent = false;
        clearInterval(that.roadTestInterval);
        that.roadTestDev = [];
        //app路测结束后文件从服务器获取，不存到本地
        var roadTest = JSON.parse(localStorage.roadTest);
        /*for(var key in roadTest){
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
        }*/
        localStorage.removeItem("roadTest");
        localStorage.removeItem("roadTestDev");
        localStorage.removeItem("followPoint");
        localStorage.removeItem("mapZoom");
        localStorage.removeItem("roadTestDotSum");
        that.lastPonit = {};
        this.$toast({
          message: "路测已停止",
          position: 'middle',
          duration: 2000
        });
      },
      startRoadTest(){
        this.roadTestMapVisible = true;
        this.mapHeight = window.innerHeight;
        this.baiduMapHeight = this.mapHeight - 90;
        this.startTest();
        this.testing = true;
        //this.initRoadTestMap();
      },
      startTest(){
        console.log("startTest")
        var that = this;
        if(!this.checkImportParam()){
          this.$toast({
            message: "请检查参数",
            position: 'middle',
            duration: 2000
          });
          return ;
        }
        that.importEvent = false;
        that.testEvent = true;
        localStorage.mapCenter = "";
        that.getAllDev();//获取所有要测试的设备：sessionStorage中存的值和下拉列表新选择的值
        //if(localStorage.btnState != "start"){//上一个动作是导入，删除，或停止
        setTimeout(function(){
          that.initRoadTestMap();
          if(that.testMap){
            that.testMap.clearOverlays();//清空覆盖物
            that.show.gpsInfo = false;
            that.gpsInfo = "";
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
          //localStorage.mapZoom = localStorage.mapZoom?localStorage.mapZoom:15;
          localStorage.mapZoom = 15;

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
        },500)
      },
      getRoadTestData(testInfo){
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
          that.gpsInfo = "";
          for(var i=0; i<data.length; i++){
            //0是没有设备，1是锁定中，2是锁定
            if (data[i]["GpsStates"] == 0 ) {//背包失锁
              that.show.gpsInfo = true;
              that.gpsInfo += "背包"+data[i]["dev_name"]+' GPS失锁';
            }else if (data[i]["GpsStates"] == 1 ) {//背包失锁
              that.show.gpsInfo = true;
              that.gpsInfo += "背包"+data[i]["dev_name"]+' 的GPS模块正在搜索';
            }else{
              if(that.gpsInfo == ""){
                that.show.gpsInfo = false;
              }
            }
            vData.push(data[i]);
          }
          that.saveTestData(vData);//所有请求数据均画图
        })
        .catch(function (error) {
           console.log(error);
        })
      },
      //开始路测：过滤拖拽或缩放后在页面显示范围内的200个点
      refreshTestMapList(followPoint){
        var that = this;
        if(!followPoint){
          localStorage.mapCenter = JSON.stringify(that.testMap.getBounds().getCenter());
        }
        that.ajaxTestData(function(res){ //获取之前所有记录的点
          var data1 = res.data;
          that.formatCsvData(data1, function(oData){
            var showList = that.getMapShowData(oData,true);//过滤掉在显示范围外的点
            var newList = "";
            var newLen = 0;
            for(var key in showList){
              newLen += showList[key]["RealLongitude"].length;
            }
            if(newLen > that.SHOWPOINT){//显示范围内的点数超过百度地图显示点的承受范围
              newList = that.getHalfList(showList,that.SHOWPOINT/2);//从所有点中抽 SHOWPOINT/2 进行显示
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
              || list[key1]["resolution"][i] == 'NO INPUT' //orange
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
        var that = this;
        var GPSCurrentObj = {};
        var sObj = {};
        var sArr = [];
        var obj = {};
        for(var i=0; i<data.length; i++){
          var devSeries = this.$global.getDevSeries(data[i]["dev_sn"]);
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
          GPSCurrentObj[data[i]["dev_sn"]]["dev_push_br"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["dev_push_br"].push(data[i]["dev_push_br"]?data[i]["dev_push_br"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["dev_push_br_percent"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["dev_push_br_percent"].push(data[i]["dev_push_br"]?((data[i]["dev_push_br"]*100/data[i]["dev_sr"])>100?100:parseInt(data[i]["dev_push_br"]*100/data[i]["dev_sr"])):0);
          GPSCurrentObj[data[i]["dev_sn"]]["AvbrKbps"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["AvbrKbps"].push(data[i]["AvbrKbps"]?data[i]["AvbrKbps"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["AvbrPercent"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["AvbrPercent"].push(data[i]["AvbrKbps"]?((data[i]["AvbrKbps"]*100/data[i]["dev_sr"])>100?100:parseInt(data[i]["AvbrKbps"]*100/data[i]["dev_sr"])):0);

          GPSCurrentObj[data[i]["dev_sn"]]["dev_delay"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["dev_delay"].push(data[i]["dev_delay"]?data[i]["dev_delay"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["bitrate_mode"] = [];//编码模式
          GPSCurrentObj[data[i]["dev_sn"]]["bitrate_mode"].push(data[i]["bitrate_mode"]?data[i]["bitrate_mode"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["resolution"] = [];//输出
          GPSCurrentObj[data[i]["dev_sn"]]["resolution"].push(data[i]["resolution_str"]?data[i]["resolution_str"]:"");
          GPSCurrentObj[data[i]["dev_sn"]]["SIM1"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM1"].push(data[i]["SIM1"]?data[i]["SIM1"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM2"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM2"].push(data[i]["SIM2"]?data[i]["SIM2"]:0);
          GPSCurrentObj[data[i]["dev_sn"]]["SIM3"] = [];
          GPSCurrentObj[data[i]["dev_sn"]]["SIM3"].push(data[i]["SIM3"]?data[i]["SIM3"]:0);
          if(devSeries == "4000"){
            GPSCurrentObj[data[i]["dev_sn"]]["SIM4"] = [];
            GPSCurrentObj[data[i]["dev_sn"]]["SIM4"].push(data[i]["SIM4"]?data[i]["SIM4"]:0);
            GPSCurrentObj[data[i]["dev_sn"]]["SIM5"] = [];
            GPSCurrentObj[data[i]["dev_sn"]]["SIM5"].push(data[i]["SIM5"]?data[i]["SIM5"]:0);
            GPSCurrentObj[data[i]["dev_sn"]]["SIM6"] = [];
            GPSCurrentObj[data[i]["dev_sn"]]["SIM6"].push(data[i]["SIM6"]?data[i]["SIM6"]:0);  
          }
        }
        if(Object.keys(GPSCurrentObj).length != 0){
          if(localStorage.roadTestDotSum){
            that.roadTestDotSum = parseInt(JSON.parse(localStorage.roadTestDotSum));
          }else{
            that.roadTestDotSum = 0;
          }
          that.roadTestDotSum += 1;//当前页面画点的个数
          if(that.roadTestDotSum > that.SHOWPOINT){//画的点数超出百度地图的承受范围
            that.ajaxTestData(function(res){ //获取之前所有记录的点
              var data1 = res.data;
              that.formatCsvData(data1, function(oData){
                var showList = that.getMapShowData(oData,true);//过滤掉在显示范围外的点
                var newList = "";
                var newLen = 0;
                for(var key in showList){
                  newLen += showList[key]["RealLongitude"].length;
                }
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
              onlineArr = [], devPushStatusArr = [], lossArr = [], bitrateModeArr = [],
              devPushBrArr = [],avbrKbpsArr = [],devPushBrPercentArr = [],avbrPercentArr = [], 
              gpsSpeedArr = [], devSrArr = [], devDelayArr = [],resolutionArr = [],
              sim1Arr = [], sim2Arr = [], sim3Arr = [], sim4Arr = [], sim5Arr = [], sim6Arr = [];
          var devSeries = this.$global.getDevSeries(objSn);
          for(var j=5; j<datas.length-1; j++){
            timeArr.push(datas[j][1]);
            gpsStatusArr.push(datas[j][2]);
            longitudeArr.push(datas[j][3]);
            latitudeArr.push(datas[j][4]);
            bdLongitudeArr.push(datas[j][5]);
            bdLatitudeArr.push(datas[j][6]);
            lossArr.push(datas[j][7]);
            devPushBrArr.push(datas[j][8].split("/")[0]);
            devPushBrPercentArr.push(datas[j][8].split("/")[1].split("%")[0]);
            avbrKbpsArr.push(datas[j][9].split("/")[0]);
            avbrPercentArr.push(datas[j][9].split("/")[1].split("%")[0]);
            bitrateModeArr.push(datas[j][10]);
            gpsSpeedArr.push(datas[j][11]);
            devSrArr.push(datas[j][12]);
            devDelayArr.push(datas[j][13]);
            sim1Arr.push(datas[j][14]);
            sim2Arr.push(datas[j][15]);
            sim3Arr.push(datas[j][16]);
            if(devSeries == "1080"){
              onlineArr.push(datas[j][17]);
              devPushStatusArr.push(datas[j][18]);
              resolutionArr.push(datas[j][19]?datas[j][19]:"");
            }else if(devSeries == "4000"){
              sim4Arr.push(datas[j][17]);
              sim5Arr.push(datas[j][18]);
              sim6Arr.push(datas[j][19]);
              onlineArr.push(datas[j][20]);
              devPushStatusArr.push(datas[j][21]);
              resolutionArr.push(datas[j][22]?datas[j][22]:"");
            }
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
          testData[objSn]["dev_push_br"] = devPushBrArr;
          testData[objSn]["dev_push_br_percent"] = devPushBrPercentArr;
          testData[objSn]["AvbrKbps"] = avbrKbpsArr;
          testData[objSn]["AvbrPercent"] = avbrPercentArr;
          testData[objSn]["bitrate_mode"] = bitrateModeArr;
          testData[objSn]["dev_delay"] = devDelayArr;
          testData[objSn]["resolution"] = resolutionArr;
          testData[objSn]["SIM1"] = sim1Arr;
          testData[objSn]["SIM2"] = sim2Arr;
          testData[objSn]["SIM3"] = sim3Arr;
          if(devSeries == "4000"){
            testData[objSn]["SIM4"] = sim4Arr;
            testData[objSn]["SIM5"] = sim5Arr;
            testData[objSn]["SIM6"] = sim6Arr;
          }
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
        var that = this;
        var newDev = that.roadTestDevSel;
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
          var oldDev = JSON.parse(localStorage.roadTestDev);
          var newSel = that.roadTestDev;
          if(oldDev.indexOf(newSel) == -1){
            oldDev += ","+newSel;
          }
          /*for(var i=0; i<newSel.length; i++){
            if($.inArray(newSel[i],oldDev) == -1){
              oldDev = oldDev.split(",");
              oldDev.push(newSel[i]);
            }
          }*/
          localStorage.roadTestDev = JSON.stringify(oldDev);
        }else{
          localStorage.roadTestDev = JSON.stringify(that.roadTestDev);  
        }
      },
      importRoadTest(){
        this.mapHeight = window.innerHeight;
        this.baiduMapHeight = this.mapHeight - 70;
        this.show.gpsInfo = false;
        this.importTestMap();
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
          url:"/page/dev/devData.php",
          data:that.$qs.stringify({
            getDevices: true,
            userId: that.user.id,
            userGroup:that.user.userGroup,
            selectByPrefix:"all",
            logPrefix:that.user.prefix,
          }),
          Api:"getDevices",
          AppId:"android",
          UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.res.success){
            var newArr = [];
            var data = res.data;
            var len = data.length;
            for(var i=0; i<len; i++){
              if(data[i]["online"] != "离线"){
                newArr.push({
                  label: data[i].dev_name,
                  value: data[i].dev_sn
                })
              }
            }
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
      /*changeRoadTestDev(){
        var that = this;
        that.changeStartDisable();
      },*/
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
        this.restPos = true;
      },
      //显示全路径下拉列表内容更改时，调用页面缩放方法
      zoomDevChange(){
        this.setMapNewZoom();
      },
      //重新设置地图缩放
      setMapNewZoom(){
        var that = this;
        //var showDev = that.zoomDev;
        var showDev = [];
        showDev.push(that.zoomDev);
        if(!showDev || (showDev.length == 1 && showDev[0]=="")){
          localStorage.wholeRoad = "";
          return;
        }
        //console.log(showDev)
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
          var mapBorder = that.getMapBorder(that.testMap,true);
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
        //console.log("initRoadTestMap")
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
        //console.log("initTestMap")
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
          /*var bmaplibInterval = setInterval(function(){
            if(BMapLib){
              //checkRefreshPage();//刷新页面//zanzhu
              clearInterval(bmaplibInterval);
            }
          },200)*/

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
        var devSn = data[0].split(",")[1];
        var devName = data[1].split(",")[1];
        var rcvSn = data[2].split(",")[1];
        var board = data[3].split(",")[1];
        this.devSeries = this.$global.getDevSeries(devSn);
        var recordStartLine = 5;
        var allLine = data.length;
        var list = {};
        var roadTestDev = [];
        var allLine = data.length;
        if(!list[devSn]){
          list[devSn] = {};
          list[devSn]["dev_name"] = devName;
          list[devSn]["time"] = [];
          list[devSn]["gpsState"] = [];
          list[devSn]["gpsSpeed"] = [];
          list[devSn]["dev_sr"] = [];
          list[devSn]["dev_push_br"] = [];
          list[devSn]["AvbrKbps"] = [];
          list[devSn]["dev_push_br_percent"] = [];
          list[devSn]["AvbrPercent"] = [];
          list[devSn]["bitrate_mode"] = [];
          list[devSn]["dev_delay"] = [];
          list[devSn]["RealLongitude-old"] = [];
          list[devSn]["RealLatitude-old"] = [];
          list[devSn]["RealLongitude"] = [];
          list[devSn]["RealLatitude"] = [];
          list[devSn]["TotalLossRate"] = [];
          list[devSn]["SIM1"] = [];
          list[devSn]["SIM2"] = [];
          list[devSn]["SIM3"] = [];
          if(this.devSeries == "4000"){
            list[devSn]["SIM4"] = [];
            list[devSn]["SIM5"] = [];
            list[devSn]["SIM6"] = [];
          }
          list[devSn]["online"] = [];
          list[devSn]["devPushStatus"] = [];
          list[devSn]["resolution"] = [];
          roadTestDev.push(devSn);
        }
        for(var j=recordStartLine; j<allLine-1; j++){
          var recordRow = data[j].split(",");
          list[devSn]["time"].push(recordRow[1]);
          list[devSn]["gpsState"].push(recordRow[2]);
          list[devSn]["RealLongitude-old"].push(recordRow[3]);
          list[devSn]["RealLatitude-old"].push(recordRow[4]);
          list[devSn]["RealLongitude"].push(recordRow[5]);
          list[devSn]["RealLatitude"].push(recordRow[6]);
          list[devSn]["TotalLossRate"].push(recordRow[7]);
          list[devSn]["dev_push_br"].push(recordRow[8].split("/")[0]);
          list[devSn]["AvbrKbps"].push(recordRow[9].split("/")[0]);
          list[devSn]["dev_push_br_percent"].push(recordRow[8].split("/")[1].split("%")[0]);
          list[devSn]["AvbrPercent"].push(recordRow[9].split("/")[1].split("%")[0]);
          list[devSn]["bitrate_mode"].push(recordRow[10]);
          list[devSn]["gpsSpeed"].push(recordRow[11]);
          list[devSn]["dev_sr"].push(recordRow[12]);
          list[devSn]["dev_delay"].push(recordRow[13]);
          list[devSn]["SIM1"].push(recordRow[14]);
          list[devSn]["SIM2"].push(recordRow[15]);
          list[devSn]["SIM3"].push(recordRow[16]);
          if(this.devSeries == "4000"){
            list[devSn]["SIM4"].push(recordRow[17]);
            list[devSn]["SIM5"].push(recordRow[18]);
            list[devSn]["SIM6"].push(recordRow[19]);
            list[devSn]["online"].push(recordRow[20]);
            list[devSn]["devPushStatus"].push(recordRow[21]); 
            list[devSn]["resolution"].push(recordRow[22]?recordRow[22]:""); 
          }else if(this.devSeries == "1080"){
            list[devSn]["online"].push(recordRow[17]);
            list[devSn]["devPushStatus"].push(recordRow[18]);   
            list[devSn]["resolution"].push(recordRow[19]?recordRow[19]:""); 
          }
          
        }
        return {"list":list, "roadTestDev":roadTestDev}
      },
      //初始化经纬度记录值
      initAllDevRange(roadTestDev){
        //allDevRange:用于记录所有点的极值范围
        //var allDevRange = localStorage.allDevRange ? JSON.parse(localStorage.allDevRange) : {};
        var allDevRange = {};
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
          that.filterDataByType(list, key1, count, newList, devPoint[key1]);
        }
        return newList;
      },
      //根据显示数据的类型和抽点的规则过滤数据
      filterDataByType(list, key1, count, newList, devShowPoint){
        var data = "";
        for(var i=0; i<count; i++){
          if(list[key1]["online"][i] == 0 //离线
            || list[key1]["devPushStatus"][i] == 0//停止推流
            || list[key1]["resolution"][i] == 'NO INPUT'//没有输入信号
            || list[key1]["TotalLossRate"][i] != 0){//有丢包的点不抽点
            this.setNewListData(list, newList, key1, i);
            continue;
          }else{
            if(i%(parseInt(count/devShowPoint)) == 0){
              this.setNewListData(list, newList, key1, i);
              continue; 
            }
          }
        }
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
        newList[key]["dev_push_br"] = [];
        newList[key]["AvbrKbps"] = [];
        newList[key]["dev_push_br_percent"] = [];
        newList[key]["AvbrPercent"] = [];
        newList[key]["bitrate_mode"] = [];
        newList[key]["gpsSpeed"] = [];
        newList[key]["gpsState"] = [];
        newList[key]["online"] = [];
        newList[key]["time"] = [];
        newList[key]["resolution"] = [];
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
        if(data["SIM4"]){
          newList[key]["SIM4"].push(data["SIM4"][i]);
          newList[key]["SIM5"].push(data["SIM5"][i]);
          newList[key]["SIM6"].push(data["SIM6"][i]);
        }
        newList[key]["TotalLossRate"].push(data["TotalLossRate"][i]);
        newList[key]["devPushStatus"].push(data["devPushStatus"][i]);
        newList[key]["dev_delay"].push(data["dev_delay"][i]);
        newList[key]["dev_sr"].push(data["dev_sr"][i]);
        newList[key]["dev_push_br"].push(data["dev_push_br"][i]);
        newList[key]["dev_push_br_percent"].push(data["dev_push_br_percent"][i]);
        newList[key]["AvbrKbps"].push(data["AvbrKbps"][i]);
        newList[key]["AvbrPercent"].push(data["AvbrPercent"][i]);
        newList[key]["bitrate_mode"].push(data["bitrate_mode"][i]);
        newList[key]["gpsSpeed"].push(data["gpsSpeed"][i]);
        newList[key]["gpsState"].push(data["gpsState"][i]);
        newList[key]["online"].push(data["online"][i]);
        newList[key]["time"].push(data["time"][i]);
        newList[key]["resolution"].push(data["resolution"][i]);
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
      drawImg(point,devSeries){
        //背包图片
        var that = this;
        var testMap = this.testMap;
        var UHD4000 = require('../../assets/img/UHD_4000.png');
        var UHD1080 = require('../../assets/img/HD_1080.png');
        var myIcon = "";
        if(devSeries == "4000"){
          myIcon = new BMap.Icon(UHD4000,  new BMap.Size(22, 36));  
        }else{
          myIcon = new BMap.Icon(UHD1080,  new BMap.Size(22, 36)); 
        }
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
        //console.log("drawDotts")
        var that = this;
        var data = GPSListObj[key];
        data["card5G"] = [];
        var RealLongitude = data["RealLongitude"];
        var RealLatitude = data["RealLatitude"];
        var total = RealLongitude.length;
        var selectCard = this.card5GText.split(",");
        var lastPonit = that.lastPonit;
        for(var i=0; i<total; i++){
          var number5G = 0;
          if(this.dataType == 4){
            for(var j=0; j<selectCard.length; j++){
              if(data[selectCard[j]][i].indexOf("LTE")==-1 && data[selectCard[j]][i] != "--"){
                number5G++;
              }
            }
          }
          data["card5G"][i] = number5G;
          if(!lastPonit[key]){//第一次描点，将当前点记录为上个点
            lastPonit[key] = {};        
            lastPonit[key]["long"] = data["RealLongitude"][i];
            lastPonit[key]["lat"] = data["RealLatitude"][i];
            lastPonit[key]["online"] = data["online"][i];
            lastPonit[key]["devPushStatus"] = data["devPushStatus"][i];
            lastPonit[key]["TotalLossRate"] = data["TotalLossRate"][i];
            lastPonit[key]["devPushBr"] = data["dev_push_br"][i];
            lastPonit[key]["AvbrKbps"] = data["AvbrKbps"][i];
            lastPonit[key]["card5G"] = data["card5G"][i];
            lastPonit[key]["noPoint"] = true;
          }
          var point = new BMap.Point(data["RealLongitude"][i], data["RealLatitude"][i]);
          //如果同一位置出现过非绿色点，则该点再变成绿色也不画绿点
          //同一位置丢包率显示最大的一个点
          if(lastPonit[key]["long"] == data["RealLongitude"][i]
            && lastPonit[key]["lat"] == data["RealLatitude"][i]){//当前点和上一个点位置相同
            if( lastPonit[key]["noPoint"] == false){//不是第一次描点
              if(data["online"][i] == 0){//离线
              }else if(data["devPushStatus"][i] == 0){//停止推流
                if(lastPonit[key]["online"] == 0){
                  continue;
                }
              }else if(data["resolution"][i] == 'NO INPUT'){//NO INPUT
                if(lastPonit[key]["online"] == 0){
                  continue;
                }
              }else{
                if(data["TotalLossRate"][i]*1>lastPonit[key]["TotalLossRate"]*1){//显示丢包率大的
                }else{
                  if(this.dataType == 1 || this.dataType == 2){
                    if(data["AvbrKbps"][i]*1 > lastPonit[key]["AvbrKbps"]*1){//显示上传速率小的
                      continue;
                    }
                  }else if(this.dataType == 3){//上传速率
                    if(data["dev_push_br"][i]*1 > lastPonit[key]["devPushBr"]*1){//显示上传速率小的
                      continue;
                    }
                  }else if(this.dataType == 4){//5G覆盖
                    if(data["card5G"][i]*1 > lastPonit[key]["card5G"]*1){//显示覆盖率低的
                      continue;
                    }
                  }
                }
              }
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
          lastPonit[key]["devPushBr"] = data["dev_push_br"][i];
          lastPonit[key]["AvbrKbps"] = data["AvbrKbps"][i];
          lastPonit[key]["card5G"] = data["card5G"][i];
          lastPonit[key]["noPoint"] = false;
        }  
        that.lastPonit = lastPonit;
      },
      //画背包圆点
      drawDott(GPSListObj, key, i, point){
        var that = this;
        var img = "";
        var IMGSIZE = 10;
        var data = GPSListObj[key];
        var testMap = this.testMap;
        if(data["online"][i]==0){//离线
          img = require("../../assets/img/gray10.png");
        }else if(data["devPushStatus"][i]==0){//停止推流
          img = require("../../assets/img/blue10.png");
        }else if(data["resolution"][i]=="NO INPUT"){//没有输入信号
          img = require("../../assets/img/noinput.png");
        }else{
          if(data["bitrate_mode"][i] == 1){//VBR
            var totalLossRate = parseFloat(data["TotalLossRate"][i]);
            if(totalLossRate != 0){
              img = require("../../assets/img/red10.png");
            }else{
              if(this.dataType == 1){//按丢包率显示
                img = require("../../assets/img/green10.png");
              }else if(this.dataType == 2){//按丢包率+编码码率显示
                var datai = data["AvbrKbps"][i]/1000;
                if(datai <= this.bitRange.bit_level1*1){
                  img = require("../../assets/img/green110.png");
                }else if(datai <= this.bitRange.bit_level2*1){
                  img = require("../../assets/img/green210.png");
                }else if(datai <= this.bitRange.bit_level3*1){
                  img = require("../../assets/img/green310.png");
                }else if(datai <= this.bitRange.bit_level4*1){
                  img = require("../../assets/img/green410.png");
                }else{
                  img = require("../../assets/img/green510.png");
                }
              }else if(this.dataType == 3){//上传速率
                var datai = data["dev_push_br_percent"][i];
                if(datai <= this.speedRange.speed_level1*1){
                  img = require("../../assets/img/loss.png");
                }else if(datai <= this.speedRange.speed_level2*1){
                  img = require("../../assets/img/orange10.png");
                }else if(datai <= this.speedRange.speed_level3*1){
                  img = require("../../assets/img/yellow10_1.png");
                }else{
                  img = require("../../assets/img/green10.png");
                }
              }else if(this.dataType == 4){//5G覆盖
                var num5g = this.card5GTextArr.length;
                var datai = data["card5G"][i];
                if(datai == num5g){
                  img = require("../../assets/img/green10.png");
                }else if(datai == 0){
                  img = require("../../assets/img/loss.png");
                }else{
                  img = require("../../assets/img/yellow10.png");
                }
              }
            }
          }else if(data["bitrate_mode"][i] == 0){//CBR
            var totalLossRate = parseInt(data["TotalLossRate"][i]);
            if(totalLossRate != 0){
              img = require("../../assets/img/red10.png");//有丢包显示红的
            }else{
              img = require("../../assets/img/green210.png");
              if(this.dataType == 1 || this.dataType == 2){//按丢包率显示
                img = require("../../assets/img/green210.png");//无丢包显示绿的
              }else if(this.dataType == 3){//上传速率
                var datai = data["dev_push_br_percent"][i];
                if(datai <= this.speedRange.speed_level1*1){
                  img = require("../../assets/img/loss.png");
                }else if(datai <= this.speedRange.speed_level2*1){
                  img = require("../../assets/img/orange10.png");
                }else if(datai <= this.speedRange.speed_level3*1){
                  img = require("../../assets/img/yellow10_1.png");
                }else{
                  img = require("../../assets/img/green10.png");
                }
              }else if(this.dataType == 4){//5G覆盖
                var num5g = this.card5GTextArr.length;
                var datai = data["card5G"][i];
                if(datai == num5g){
                  img = require("../../assets/img/green10.png");
                }else if(datai == 0){
                  img = require("../../assets/img/loss.png");
                }else{
                  img = require("../../assets/img/yellow10.png");
                }
              }
            }
          }
        }
        /*if (img.substr(img.length-6) == "10.png") {
          IMGSIZE = 10;
        }else{
          IMGSIZE = 15;
        }*/
        var myIconA = new BMap.Icon(img, new BMap.Size(IMGSIZE,IMGSIZE));
        var markerA = new BMap.Marker(point,{
          icon: myIconA, 
          offset: new BMap.Size(10, 10) //设置文本偏移量
        });  // 创建标注
        this.testMap.addOverlay(markerA);
        //标注的点击事件
        markerA.addEventListener("click", function(e){   
          var p = e.target;
          var lng = p.getPosition().lng;
          var lat = p.getPosition().lat;
          var offlineFlag = false;
          var pushSatusFlag = false;
          var noinputFlag = false;
          var showData = "";
          var TotalLossRate = "";
          for(key in GPSListObj){
            var datas = GPSListObj[key];
            var realLong= datas["RealLongitude"];
            var realLat= datas["RealLatitude"];
            var infoHeight = 220;
            var devSeries = that.$global.getDevSeries(key);
            if(devSeries == "4000"){
              infoHeight = 280;
            }
            var opts = {
              width : 200,     // 信息窗口宽度
              height: infoHeight,     // 信息窗口高度
              title : "背包:"+datas["dev_name"],//"故宫博物院" , // 信息窗口标题
              offset: new BMap.Size(10, 10)//, //设置文本偏移量
              //message:"序列号:"+key+"<br/>业务丢包:"+GPSListObj[key]["TotalLossRate"]
            }
            for(var j=realLong.length-1; j>=0; j--){
              if(realLong[j] == lng && realLat[j] == lat){
                if(data["online"][j] == 0){//离线
                  offlineFlag = true;
                  showData = j;
                }else{
                  if(offlineFlag){//如果当前点有过离线，则不显示其他点
                    continue;
                  }else{
                    if(data["devPushStatus"][j] == 0){//停止推流
                      pushSatusFlag = true;
                      showData = j;
                    }else{
                      if(pushSatusFlag){//如果当前点有过停止推流，则不显示其他点
                        continue;
                      }else{
                        if(data["resolution"][i] == 'NO INPUT'){//没有输入信号
                          showData = j;  
                        }else{
                          if(noinputFlag){//如果当前点有过没有输入信号，则不显示其他点
                            continue;
                          }else{
                            if(that.dataType == 1 || that.dataType==2){//丟包率
                              TotalLossRate = (TotalLossRate==""?datas["TotalLossRate"][j]:TotalLossRate);
                              showData = j;
                              for(var k=j-1; k>=0; k--){
                                if(realLong[k] == lng && realLat[k] == lat){
                                  if(datas["TotalLossRate"][k]!=TotalLossRate){
                                    if((datas["TotalLossRate"][k]=="--"?0:datas["TotalLossRate"][k])*1 > (TotalLossRate=='--'?0:TotalLossRate)*1){
                                      showData = k;
                                      TotalLossRate = datas["TotalLossRate"][k];
                                    }
                                  }else{
                                    continue;
                                  }
                                }else{
                                  //坐标变化后，由于在上面已经找到了丢包率最大的点，故将j直接跳到坐标不通的点处
                                  j=k+1;
                                  break;
                                }
                              }
                            }else if(that.dataType == 3){
                              var pushBr = datas["dev_push_br"][j];
                              showData = j;
                              for(var k=j-1; k>=0; k--){
                                if(realLong[k] == lng && realLat[k] == lat){
                                  if(datas["dev_push_br"][k] < pushBr){
                                    showData = k;
                                  }else{
                                    continue;
                                  }
                                }else{
                                  break;
                                }
                              }
                            }else if(that.dataType == 4){
                              var card5GNum = datas["card5G"][j];
                              showData = j;
                              for(var k=j-1; k>=0; k--){
                                if(realLong[k] == lng && realLat[k] == lat){
                                  if(datas["card5G"][k] < card5GNum){
                                    showData = k;
                                  }else{
                                    continue;
                                  }
                                }else{
                                  break;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                } 
                  
                var point = new BMap.Point(lng, lat);
                var loss = datas["TotalLossRate"][showData]=="--"?datas["TotalLossRate"][showData]:(datas["TotalLossRate"][showData]/10).toFixed(1)+"%";
                var speed = datas["gpsSpeed"][showData]=="--"?datas["gpsSpeed"][showData]:datas["gpsSpeed"][showData]+"km/h";
                var delay= datas["dev_delay"][showData]=="--"?datas["dev_delay"][showData]:datas["dev_delay"][showData]/1000+"s";
                var dev_sr= datas["dev_sr"][showData]=="--"?datas["dev_sr"][showData]:datas["dev_sr"][showData]/1000+"Mbps";
                var dev_push_br= datas["dev_push_br"][showData]=="--"?datas["dev_push_br"][showData]:datas["dev_push_br"][showData]/1000+"Mbps";
                var avbr= datas["AvbrKbps"][showData]=="--"?datas["AvbrKbps"][showData]:datas["AvbrKbps"][showData]/1000+"Mbps";
                var infoStrCom = "序列号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+key+"<br/>"+
                                "时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+ datas["time"][showData]+"<br/>"+
                                "业务丢包&nbsp;&nbsp;&nbsp;&nbsp;: "+loss+"<br/>"+
                                "视频比特率&nbsp;&nbsp;:"+dev_sr+"<br/>"+
                                "上传速率&nbsp;&nbsp;&nbsp;&nbsp;: "+dev_push_br+"<br/>"+
                                "AVBR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+avbr+"<br/>"+
                                "车速&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+speed+"<br/>"+
                                "延时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+delay+"<br/>"+
                                "SIM1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM1"][showData]+"<br/>"+
                                "SIM2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM2"][showData]+"<br/>"+
                                "SIM3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM3"][showData]+"<br/>";
                var infoStr = infoStrCom;
                if(devSeries == "4000"){
                  infoStr += "SIM4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM4"][showData]+"<br/>"+
                            "SIM5&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM5"][showData]+"<br/>"+
                            "SIM6&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: "+datas["SIM6"][showData]+"<br/>";
                }
                var infoWindow = new BMap.InfoWindow(infoStr, opts);  // 创建信息窗口对象 
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
        this.testMap.centerAndZoom(point, mapZoom);
        that.getMapBorder(testMap, true);//获取当前显示地图的边界经纬度
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
            var devSeries = this.$global.getDevSeries(key);
            that.drawImg(point,devSeries);  
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
        for(var i=0; i<that.numMarkers.length; i++){
          testMap.removeOverlay(that.numMarkers[i])//删除背包图片  
        }
        
        that.numMarkers = [];

        var mapZoom = localStorage.mapZoom;
        // 判断是否为第一次画点
        if(that.startTestDrawFlg){
          //以第一个有效点作为自动定位
          for(var key in GPSListObj){
            var data = GPSListObj[key];
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
        that.getMapBorder(testMap, true);//获取当前显示地图的边界经纬度
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
            var point = "";
            if(mapSize[followPoint]['lng']['max'] > mapBorder['lng']['max']){
              point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,true);
              mapSize[key]['lng']['min'] = mapBorder.lng.min;
            }else if(mapSize[followPoint]['lng']['min'] < mapBorder['lng']['min']){
              point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,true);
              mapSize[key]['lng']['max'] = mapBorder.lng.max;
            }else if(mapSize[followPoint]['lat']['max'] > mapBorder['lat']['max']){
              point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,true);
              mapSize[key]['lat']['min'] = mapBorder.lat.min;
            }else if(mapSize[followPoint]['lat']['min'] < mapBorder['lat']['min']){
              point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
              testMap.centerAndZoom(point, mapZoom);
              mapBorder = that.getMapBorder(testMap,true);
              mapSize[key]['lat']['max'] = mapBorder.lat.max;
            }
            localStorage.mapSize = JSON.stringify(mapSize);  
            localStorage.mapBorder = JSON.stringify(mapBorder);  
            if(this.restPos){
              localStorage.mapCenter = JSON.stringify({"lng":point.lng,"lat":point.lat});
              this.refreshTestMapList(true);//当跟踪开启时，参数为true
              this.restPos = false;  
            }
            
          }
          if(localStorage.wholeRoad != ""){
            that.setMapNewZoom();
          }
         

          var point = new BMap.Point(RealLongitude[0], RealLatitude[0]);
          //画背包图片
          var devSeries = that.$global.getDevSeries(key);
          that.drawImg(point,devSeries);
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
      quitRoadTest(){
        this.RoadTestShow=false;
        this.roadTestDevSel = [];

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
  .width30{
    width:30%;
  }
  .width70{
    width:70%;
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
    left: 10px;
    position: absolute;
    top: 0px;
    padding: 10px;
    border: 2px solid red;
  }
  .mint-popup.roadTestParamPopup{
    border-radius: 6px;
    background-color: #EEE;
    width: 90% !important;
    overflow-y: auto;
    border-radius: 4px;
  }
  .roadTestConfig .GroupItemValue{
    line-height:.3rem;
  }
  .roadTestConfig .mint-cell{
    background-color:transparent !important;
    vertical-align:text-bottom;
  }
  .roadTestConfig .mint-cell-value{
    width:auto !important;
  }
  .roadTestConfig .ItemSelect{
    font-size: .12rem;
    background: #2b2e33;
    border: 1px solid #4b5056;
    color: #fff;
    text-indent: 10px;
  }
  .roadTestConfig .select:disabled {
    border: 1px solid #333!important;
  }
  .levelInput{
    width: 30%;
    text-align: left;
    text-indent: 0px !important;
  }
  .dot{
      width: 10px;
      height: 10px;
      border-radius: 10px;
      display: inline-block;
      margin-right:10px;
  }
  .dot1{
      background-color: #afffa3;
  }
  .dot2{
      background-color: #88ff7a;
  }
  .dot3{
      background-color: #5dff52;
  }
  .dot4{
      background-color: #00ff00;
  }
  .dot5{
      background-color: #00d907;
  }
  .dot1s{
      background-color: #f5222d;
  }
  .dot2s{
      background-color: #fa8c16;
  }
  .dot3s{
      background-color: #d4b106;
  }
  .dot4s{
      background-color: #52c41a;
  }
  .level_show{
    width: 20%;
    display: inline-block;
    text-align: right;
  }
  .greyPoint{
    color: #C5C5C5;
  }
  .redPoint{
    /*color: #ff0000;*/
    color: #ff5a4b;
  }
  .orangePoint{
    color: #fa8c16;
  }
  .greenPoint{
    color: #00ff00;
  }
  .green5Point{
    color: #00d907;   
  }
  .green4Point{
    color: #00ff00;   
  }
  .green3Point{
    color: #5dff52;   
  }
  .green2Point{
    color: #88ff7a;   
  }
  .green1Point{
    color: #afffa3;   
  }
  .yellowPoint{
    color: #fadb14;
  }
  .yellowPointDark{
    color: #D48806;
  }
  .bluePoint{
    color: #1890ff;
  }
</style>