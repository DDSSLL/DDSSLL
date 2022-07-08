<template>
  <div class="home" id="home" style="height:100%">
    <el-row>
      <!-- left part 1 -->
      <el-col :span="8" class="leftDiv">
        <div class="contentDiv">
          <el-row>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">累计采集(次)</span>
              <span class="statisticsData">100000</span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">当前播音(个)</span>
              <span class="statisticsData">300  </span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">新频数量(个)</span>
              <span class="statisticsData">10</span>
            </el-col>
          </el-row>
        </div>
        <!-- left part 2 -->
        <div class="contentDiv">
          <el-row>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">接收机: 
                <span class="colorGreen">正常</span>
              </span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">数据库: 
                <span class="colorGreen">正常</span>
              </span>
            </el-col>
            <el-col :span="8" class="statisticsStyle">
              <span class="statisticsTitle">指挥报警: 
                <span class="colorGreen">正常</span>
              </span>
            </el-col>
          </el-row>
        </div>
        
      </el-col>

      

      <el-col :span="16" class="rightDiv">
        <div id="mapChart" style="width: 100%; height:500px" :style="{'height':contentHeight+'px'}" ></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import $ from 'jquery';
  import * as echarts from 'echarts'
  //import chinaMapJson from './china.json'
  //各省地图包
  import china from "./map/json/china.json";
  import anhui from "./map/json/province/anhui.json";
  import aomen from "./map/json/province/aomen.json";
  import beijing from "./map/json/province/beijing.json";
  import chongqing from "./map/json/province/chongqing.json";
  import fujian from "./map/json/province/fujian.json";
  import gansu from "./map/json/province/gansu.json";
  import guangdong from "./map/json/province/guangdong.json";
  import guangxi from "./map/json/province/guangxi.json";
  import guizhou from "./map/json/province/guizhou.json";
  import hainan from "./map/json/province/hainan.json";
  import hebei from "./map/json/province/hebei.json";
  import heilongjiang from "./map/json/province/heilongjiang.json";
  import henan from "./map/json/province/henan.json";
  import hubei from "./map/json/province/hubei.json";
  import hunan from "./map/json/province/hunan.json";
  import jiangsu from "./map/json/province/jiangsu.json";
  import jiangxi from "./map/json/province/jiangxi.json";
  import jilin from "./map/json/province/jilin.json";
  import liaoning from "./map/json/province/liaoning.json";
  import neimenggu from "./map/json/province/neimenggu.json";
  import ningxia from "./map/json/province/ningxia.json";
  import qinghai from "./map/json/province/qinghai.json";
  import shandong from "./map/json/province/shandong.json";
  import shanghai from "./map/json/province/shanghai.json";
  import shanxi from "./map/json/province/shanxi.json";
  import shanxi1 from "./map/json/province/shanxi1.json";
  import sichuan from "./map/json/province/sichuan.json";
  import taiwan from "./map/json/province/taiwan.json";
  import tianjin from "./map/json/province/tianjin.json";
  import xianggang from "./map/json/province/xianggang.json";
  import xinjiang from "./map/json/province/xinjiang.json";
  import xizang from "./map/json/province/xizang.json";
  import yunnan from "./map/json/province/yunnan.json";
  import zhejiang from "./map/json/province/zhejiang.json";
  export default {
    name: "home",
    data(){
      return{
        contentHeight:"",
        
      }
    },
    computed: {
     
    },
    components: {
      
    },
    /*watch:{   //监听当前设备值变化
      '$store.state.ActiveDevice': {
        immediate: true,
        handler(val) {
          this.ActiveDevice = val;
        }
      }
    },*/
    mounted(){
      var that = this;
      this.contentHeight = document.getElementById("home").offsetHeight;
      setTimeout(function(){that.initMapChart();},300)
      
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      // ...mapMutations({
          
      // }),
      getNetworkIp() {
        
        let needHost = ''; // 打开的host
        try {
        // 获得网络接口列表
          let network = os.networkInterfaces();
        // console.log("network",network)
          for (let dev in network) {

            let iface = network[dev];
            for (let i = 0; i < iface.length; i++) {
              let alias = iface[i];
              if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                needHost = alias.address;
              // console.log("alias.address",alias.address)
              }
            // console.log("alias",alias)
            }
          }
        } catch (e) {
          needHost = 'localhost';
        }
        return needHost;
      },
      initMapChart(){
        var myChart = echarts.init(document.getElementById('mapChart'));
        echarts.registerMap('china',china)
        var cityMap = {
          //'中国': china,
          '上海': shanghai,
          '河北': hebei,
          '山西': shanxi,
          '内蒙古': neimenggu,
          '辽宁': liaoning,
          '吉林': jilin,
          '黑龙江': heilongjiang,
          '江苏': jiangsu,
          '浙江': zhejiang,
          '安徽': anhui,
          '福建': fujian,
          '江西': jiangxi,
          '山东': shandong,
          '河南': henan,
          '湖北': hubei,
          '湖南': hunan,
          '广东': guangdong,
          '广西': guangxi,
          '海南': hainan,
          '四川': sichuan,
          '贵州': guizhou,
          '云南': yunnan,
          '西藏': xizang,
          '陕西': shanxi1,
          '甘肃': gansu,
          '青海': qinghai,
          '宁夏': ningxia,
          '新疆': xinjiang,
          '北京': beijing,
          '天津': tianjin,
          '重庆': chongqing,
          '香港': xianggang,
          '澳门': aomen,
          '台湾': taiwan
        };
        var cityToPinyin = {
          '中国': 'china',
          '上海': 'shanghai',
          '河北': 'hebei',
          '山西': 'shanxi',
          '内蒙古': 'neimenggu',
          '辽宁': 'liaoning',
          '吉林': 'jilin',
          '黑龙江': 'heilongjiang',
          '江苏': 'jiangsu',
          '浙江': 'zhejiang',
          '安徽': 'anhui',
          '福建': 'fujian',
          '江西': 'jiangxi',
          '山东': 'shandong',
          '河南': 'henan',
          '湖北': 'hubei',
          '湖南': 'hunan',
          '广东': 'guangdong',
          '广西': 'guangxi',
          '海南': 'hainan',
          '四川': 'sichuan',
          '贵州': 'guizhou',
          '云南': 'yunnan',
          '西藏': 'xizang',
          '陕西': 'shanxi',
          '甘肃': 'gansu',
          '青海': 'qinghai',
          '宁夏': 'ningxia',
          '新疆': 'xinjiang',
          '北京': 'beijing',
          '天津': 'tianjin',
          '重庆': 'chongqing',
          '香港': 'xianggang',
          '澳门': 'aomen',
          '台湾': 'taiwan'
        };
         // 层级索引
        var name = ['china'];//[opt.mapName];
        var idx = 0;
        var pos = {
          leftPlus: 115,
          leftCur: 0,//150,
          left: 50,//198,
          top: 50
        };
        var line = [
          [0, 0],
          [8, 11],
          [0, 22]
        ];
        var style = {
          font: '18px "Microsoft YaHei", sans-serif',
          textColor: '#2c2c2c',
          lineColor: 'rgba(44,70,141,.8)'//'rgba(147, 235, 248, .8)'
        };

        var data = [
          { name: '广州', value: 38 },
          { name: '呼和浩特', value: 58 },
          { name: '天津', value: 105 },
        ];
        var opt = {
          mapName: 'china', // 地图展示
          goDown: true, // 是否下钻
          bgColor: '#404a59', // 画布背景色
          activeArea: [], // 区域高亮,同echarts配置项
          data: [],
          // 下钻回调(点击的地图名、实例对象option、实例对象)
          callback: function(name, option, instance) {}
        };
        var geoCoordMap = {
          海门: [121.15, 31.89],
          鄂尔多斯: [109.781327, 39.608266],
          招远: [120.38, 37.35],
          舟山: [122.207216, 29.985295],
          齐齐哈尔: [123.97, 47.33],
          盐城: [120.13, 33.38],
          赤峰: [118.87, 42.28],
          青岛: [120.33, 36.07],
          乳山: [121.52, 36.89],
          金昌: [102.188043, 38.520089],
          泉州: [118.58, 24.93],
          莱西: [120.53, 36.86],
          日照: [119.46, 35.42],
          胶南: [119.97, 35.88],
          南通: [121.05, 32.08],
          拉萨: [91.11, 29.97],
          云浮: [112.02, 22.93],
          梅州: [116.1, 24.55],
          文登: [122.05, 37.2],
          上海: [121.48, 31.22],
          攀枝花: [101.718637, 26.582347],
          威海: [122.1, 37.5],
          承德: [117.93, 40.97],
          厦门: [118.1, 24.46],
          汕尾: [115.375279, 22.786211],
          潮州: [116.63, 23.68],
          丹东: [124.37, 40.13],
          太仓: [121.1, 31.45],
          曲靖: [103.79, 25.51],
          烟台: [121.39, 37.52],
          福州: [119.3, 26.08],
          瓦房店: [121.979603, 39.627114],
          即墨: [120.45, 36.38],
          抚顺: [123.97, 41.97],
          玉溪: [102.52, 24.35],
          张家口: [114.87, 40.82],
          阳泉: [113.57, 37.85],
          莱州: [119.942327, 37.177017],
          湖州: [120.1, 30.86],
          汕头: [116.69, 23.39],
          昆山: [120.95, 31.39],
          宁波: [121.56, 29.86],
          湛江: [110.359377, 21.270708],
          揭阳: [116.35, 23.55],
          荣成: [122.41, 37.16],
          连云港: [119.16, 34.59],
          葫芦岛: [120.836932, 40.711052],
          常熟: [120.74, 31.64],
          东莞: [113.75, 23.04],
          河源: [114.68, 23.73],
          淮安: [119.15, 33.5],
          泰州: [119.9, 32.49],
          南宁: [108.33, 22.84],
          营口: [122.18, 40.65],
          惠州: [114.4, 23.09],
          江阴: [120.26, 31.91],
          蓬莱: [120.75, 37.8],
          韶关: [113.62, 24.84],
          嘉峪关: [98.289152, 39.77313],
          广州: [113.23, 23.16],
          延安: [109.47, 36.6],
          太原: [112.53, 37.87],
          清远: [113.01, 23.7],
          中山: [113.38, 22.52],
          昆明: [102.73, 25.04],
          寿光: [118.73, 36.86],
          盘锦: [122.070714, 41.119997],
          长治: [113.08, 36.18],
          深圳: [114.07, 22.62],
          珠海: [113.52, 22.3],
          宿迁: [118.3, 33.96],
          咸阳: [108.72, 34.36],
          铜川: [109.11, 35.09],
          平度: [119.97, 36.77],
          佛山: [113.11, 23.05],
          海口: [110.35, 20.02],
          江门: [113.06, 22.61],
          章丘: [117.53, 36.72],
          肇庆: [112.44, 23.05],
          大连: [121.62, 38.92],
          临汾: [111.5, 36.08],
          吴江: [120.63, 31.16],
          石嘴山: [106.39, 39.04],
          沈阳: [123.38, 41.8],
          苏州: [120.62, 31.32],
          茂名: [110.88, 21.68],
          嘉兴: [120.76, 30.77],
          长春: [125.35, 43.88],
          胶州: [120.03336, 36.264622],
          银川: [106.27, 38.47],
          张家港: [120.555821, 31.875428],
          三门峡: [111.19, 34.76],
          锦州: [121.15, 41.13],
          南昌: [115.89, 28.68],
          柳州: [109.4, 24.33],
          三亚: [109.511909, 18.252847],
          自贡: [104.778442, 29.33903],
          吉林: [126.57, 43.87],
          阳江: [111.95, 21.85],
          泸州: [105.39, 28.91],
          西宁: [101.74, 36.56],
          宜宾: [104.56, 29.77],
          呼和浩特: [111.65, 40.82],
          成都: [104.06, 30.67],
          大同: [113.3, 40.12],
          镇江: [119.44, 32.2],
          桂林: [110.28, 25.29],
          张家界: [110.479191, 29.117096],
          宜兴: [119.82, 31.36],
          北海: [109.12, 21.49],
          西安: [108.95, 34.27],
          金坛: [119.56, 31.74],
          东营: [118.49, 37.46],
          牡丹江: [129.58, 44.6],
          遵义: [106.9, 27.7],
          绍兴: [120.58, 30.01],
          扬州: [119.42, 32.39],
          常州: [119.95, 31.79],
          潍坊: [119.1, 36.62],
          重庆: [106.54, 29.59],
          台州: [121.420757, 28.656386],
          南京: [118.78, 32.04],
          滨州: [118.03, 37.36],
          贵阳: [106.71, 26.57],
          无锡: [120.29, 31.59],
          本溪: [123.73, 41.3],
          克拉玛依: [84.77, 45.59],
          渭南: [109.5, 34.52],
          马鞍山: [118.48, 31.56],
          宝鸡: [107.15, 34.38],
          焦作: [113.21, 35.24],
          句容: [119.16, 31.95],
          北京: [116.46, 39.92],
          徐州: [117.2, 34.26],
          衡水: [115.72, 37.72],
          包头: [110, 40.58],
          绵阳: [104.73, 31.48],
          乌鲁木齐: [87.68, 43.77],
          枣庄: [117.57, 34.86],
          杭州: [120.19, 30.26],
          淄博: [118.05, 36.78],
          鞍山: [122.85, 41.12],
          溧阳: [119.48, 31.43],
          库尔勒: [86.06, 41.68],
          安阳: [114.35, 36.1],
          开封: [114.35, 34.79],
          济南: [117, 36.65],
          德阳: [104.37, 31.13],
          温州: [120.65, 28.01],
          九江: [115.97, 29.71],
          邯郸: [114.47, 36.6],
          临安: [119.72, 30.23],
          兰州: [103.73, 36.03],
          沧州: [116.83, 38.33],
          临沂: [118.35, 35.05],
          南充: [106.110698, 30.837793],
          天津: [117.2, 39.13],
          富阳: [119.95, 30.07],
          泰安: [117.13, 36.18],
          诸暨: [120.23, 29.71],
          郑州: [113.65, 34.76],
          哈尔滨: [126.63, 45.75],
          聊城: [115.97, 36.45],
          芜湖: [118.38, 31.33],
          唐山: [118.02, 39.63],
          平顶山: [113.29, 33.75],
          邢台: [114.48, 37.05],
          德州: [116.29, 37.45],
          济宁: [116.59, 35.38],
          荆州: [112.239741, 30.335165],
          宜昌: [111.3, 30.7],
          义乌: [120.06, 29.32],
          丽水: [119.92, 28.45],
          洛阳: [112.44, 34.7],
          秦皇岛: [119.57, 39.95],
          株洲: [113.16, 27.83],
          石家庄: [114.48, 38.03],
          莱芜: [117.67, 36.19],
          常德: [111.69, 29.05],
          保定: [115.48, 38.85],
          湘潭: [112.91, 27.87],
          金华: [119.64, 29.12],
          岳阳: [113.09, 29.37],
          长沙: [113, 28.21],
          衢州: [118.88, 28.97],
          廊坊: [116.7, 39.53],
          菏泽: [115.480656, 35.23375],
          合肥: [117.27, 31.86],
          武汉: [114.31, 30.52],
          大庆: [125.03, 46.58]
        };
        var convertData = function (data) {
          var res = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
              });
            }
          }
          return res;
        };
        function renderItem(params, api) {
          var coords = [
            [116.7, 39.53],
            [103.73, 36.03],
            [112.91, 27.87],
            [120.65, 28.01],
            [119.57, 39.95]
          ];
          var points = [];
          for (var i = 0; i < coords.length; i++) {
            points.push(api.coord(coords[i]));
          }
          var color = api.visual('color');
          return {
            type: 'polygon',
            shape: {
              points: echarts.graphic.clipPointsByRect(points, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
              })
            },
            style: api.style({
              fill: color,
              stroke: echarts.color.lift(color)
            })
          };
        }
        var mapData = {
          num: [10,15],// 每次出现球的个数范围： 最小6 最大10
          symbolSize: [15, 30], // 球大小控制：最小20 最大30
          title:'地图标题',     
          mapColor:'#2C468D',//'#5c9ac1',   //地图填充颜色
          /*borderColor:'#2C468D',//'#5278a7',//地图边框颜色
          shadowColor: '#2C468D',//'#5174a4', //阴影颜色*/
          shadowBlur: 1, //地图阴影
          setIntervalTime:3000,  //默认刷新时间3秒
        } 
        var handleEvents = {
          /**
           * i 实例对象
           * o option
           * n 地图名
           **/
          resetOption: function(i, o, n) {
            var breadcrumb = this.createBreadcrumb(n);
            var j = name.indexOf(n);
            var l = o.graphic.length;
            if (j < 0) { //各省
              o.graphic.push(breadcrumb);
              o.graphic[0].children[0].shape.x2 = 145;
              o.graphic[0].children[1].shape.x2 = 145;
              if (o.graphic.length > 2) {
                var cityData = [];
                var cityJson;
                for (var x = 0; x < opt.data.length; x++) {
                  if(n === opt.data[x].city){
                    $([opt.data[x]]).each(function(index,data){
                      cityJson = {city:data.city,name:data.name,value:data.value,crew:data.crew,company:data.company,position:data.position,region:data.region};
                      cityData.push(cityJson)
                    })
                  }
                }
                if(cityData != null){
                    //o.series[4].data = [];
                    //o.series[0].data = handleEvents.initSeriesData(cityData);
                }else{
                  o.series[0].data = [];
                }
              }
              name.push(n);
              idx++;
            }
            else { //全国
              o.graphic.splice(j + 2, l);
              if (o.graphic.length <= 2) {
                  o.graphic[0].children[0].shape.x2 = 60;
                  o.graphic[0].children[1].shape.x2 = 60;
                  //o.series[4].data = convertLineData('天津');
              }
              name.splice(j + 1, l);
              idx = j;
              pos.leftCur -= pos.leftPlus * (l - j - 1);
            }

            o.geo.map = n;
            o.geo.zoom = 1;
            i.clear();
            i.setOption(o);
            //this.zoomAnimation();
            opt.callback(n, o, i);
          },

          /**
           * name 地图名
           **/
          createBreadcrumb: function(name) {
            var breadcrumb = {
              type: 'group',
              id: name,
              left: pos.leftCur + pos.leftPlus,
              top: pos.top + 3,
              children: [{
                type: 'polyline',
                left: -90,
                top: -5,
                shape: {
                  points: line
                },
                style: {
                  stroke: '#fff',
                  key: name
                },
                onclick: function() {
                  var name = this.style.key;
                  handleEvents.resetOption(myChart, option, name);
                }
              }, {
                type: 'text',
                left: -68,
                top: 'middle',
                style: {
                  text: name,
                  textAlign: 'center',
                  fill: style.textColor,
                  font: style.font
                },
                onclick: function() {
                  var name = this.style.text;
                  handleEvents.resetOption(myChart, option, name);
                }
              }, {
                type: 'text',
                left: -68,
                top: 10,
                style: {
                  name: name,
                  text: cityToPinyin[name] ? cityToPinyin[name].toUpperCase() : '',
                  textAlign: 'center',
                  fill: style.textColor,
                  font: '12px "Microsoft YaHei", sans-serif'
                },
                onclick: function() {
                  var name = this.style.name;
                  handleEvents.resetOption(myChart, option, name);
                }
              }]
            };

            pos.leftCur += pos.leftPlus;

            return breadcrumb;
          },

          // 设置effectscatter
          initSeriesData: function(data) {
            var res = [];
            //状态良好
            for (var i = 0; i < data.length; i++) {
              var geoCoord = geoCoordMap[data[i].name];
              if (geoCoord) {
                res.push({
                  name: data[i].name,
                  value: geoCoord.concat(data[i].value)
                });
              }
            }
            return res;
          },
          zoomAnimation: function() {
            var count = null;
            var zoom = function(per) {
              if (!count) count = per;
              count = count + per;
              myChart.setOption({
                geo: {
                  zoom: count
                }
              });
              if (count < 1) window.requestAnimationFrame(function() {
                zoom(0.2);
              });
            };
            window.requestAnimationFrame(function() {
              zoom(0.2);
            });
          }
        };
        
        var option = {
          graphic: [{
            type: 'group',
            left: pos.left,
            top: pos.top - 4,
            children: [{
              type: 'line',
              left: 0,
              top: -20,
              shape: {x1: 0, y1: 0, x2: 60, y2: 0},
              style: {
                stroke: style.lineColor
              }
            }, {
              type: 'line',
              left: 0,
              top: 20,
              shape: {x1: 0, y1: 0, x2: 60, y2: 0 },
              style: {
                stroke: style.lineColor
              }
            }]
          },{
            id: name[idx],
            type: 'group',
            left: pos.left + 2,
            top: pos.top,
            children: [{
              type: 'polyline',
              left: 90,
              top: -12,
              shape: {
                points: line
              },
              style: {
                stroke: 'transparent',
                key: name[0]
              },
              onclick: function() {
                var name = this.style.key;
                handleEvents.resetOption(myChart, option, name);
              }
            }, {
              type: 'text',
              left: 0,
              top: 'middle',
              style: {
                text: '中国',
                textAlign: 'center',
                fill: style.textColor,
                font: style.font
              },
              onclick: function() {
                handleEvents.resetOption(myChart, option, 'china');
              }
            }, {
              type: 'text',
              left: 0,
              top: 10,
              style: {
                text: 'CHINA',
                textAlign: 'center',
                fill: style.textColor,
                font: '12px "Microsoft YaHei", sans-serif'
              },
              onclick: function() {
                handleEvents.resetOption(myChart, option, 'china');
              }
            }]
          }],
          geo: {
            /*map: 'china',
            label: {
              show:false,
              emphasis: {
                show: true,
                color:'#fff'
              }
            },
            roam: false,
            itemStyle: {
              normal: {
                areaColor: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(44,70,141,0)'//'rgba(147, 235, 248, 0)' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color:  'rgba(44,70,141,0.2)'//'rgba(147, 235, 248, .2)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                },
                borderColor: 'rgba(44,70,141,1)',//'rgba(147, 235, 248, 1)',
                shadowColor: 'rgba(44,70,141,1)',//'rgba(128, 217, 248, 1)',
                shadowBlur: 10
              },
              emphasis: {
                areaColor: mapData.mapColor,
              }
            }*/
            map: 'china',
            roam: true,
            zoom: 1,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              },
              emphasis: {
                textStyle: {
                  color: '#fff'
                },
                show: true
              }
            },
            itemStyle: {
              normal: {
                areaColor: 'rgba(43, 68, 137, 0.86)',
                borderColor: '#0090FF'
              },
              emphasis: {
                areaColor: '#0090FF'
              }
            },
            regions: opt.activeArea.map(function(item) {
              if (typeof item !== 'string') {
                return {
                  name: item.name,
                  itemStyle: {
                    normal: {
                      areaColor: item.areaColor || '#389BB7'
                    }
                  },
                  label: {
                    normal: {
                      show: item.showLabel,
                      textStyle: {
                        color: '#fff'
                      }
                    }
                  }
                }
              } else {
                return {
                  name: item,
                  itemStyle: {
                    normal: {
                      borderColor: '#91e6ff',
                      areaColor: '#389BB7'
                    }
                  }
                }
              }
            })
          },
          series: [{
            name: '设备',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: '10',/*,function (val) {
              return val[2] / 2;
            },*/
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
              },
              emphasis: {
                show: true,
              },
            },
            itemStyle: {
              normal: {
                color: '#ddb926',
              },
            },
          },
          {
            name: 'Top 10',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(
              data
              .sort(function (a, b) {
                return b.value - a.value;
              })
              .slice(0, 10)
            ),
            symbolSize: '10',/*function (val) {
              return val[2] / 3;
            },*/
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
            },
             hoverAnimation: true,
             label: {
                normal: {
                   formatter: '{b}',
                   position: 'right',
                   show: true,
                },
             },
             itemStyle: {
                normal: {
                   color: '#f4e925',
                   shadowBlur: 10,
                   shadowColor: '#333',
                },
             },
             zlevel: 1,
          }],
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // 添加事件
        myChart.on('click', function(params) {
          console.log(params)
          var _self = this;
          if (opt.goDown && params.name !== name[idx]) {
            if (cityMap[params.name]) {
                var url = cityMap[params.name];
                console.log(url)
                echarts.registerMap(params.name, url);
                handleEvents.resetOption(_self, option, params.name);
                /*$.get(url, function(response) {
                    curGeoJson = response;
                    echarts.registerMap(params.name, response);
                    handleEvents.resetOption(_self, option, params.name);
                });*/
            }
          }
        });
      },
    }
  }
</script>

<style scoped>
.monitor{
  height: 100%;
}
.monitor>.el-row {
  height: 100%;
}
.monitor>.el-row>.el-col{
  height: 100%;
  /*border:1px solid red;*/
}
.contentDiv{
  border:1px solid #1F2C62;
  border-radius: 4px;
  box-shadow: 1px 2px 2px 1px #1F2C62;
  margin-bottom: 10px;
}
.statisticsStyle{
  /*outline: 1px solid yellow;*/
  text-align: left;
  padding: 10px;
}
.statisticsTitle{
  font-size: 16px;
  display: block;
  text-align: left;
}
.statisticsData{
  font-size: 24px;
  display: block;
  text-align: left;
}

/*.monitor .el-row>.el-col .leftDiv{
  height: 100%;
  border:1px solid red;
}
.monitor .el-row>.el-col .rightDiv{
  height: 100%;
  border:1px solid red;
}*/
   

</style>