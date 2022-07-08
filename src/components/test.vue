<template>
  <div class="monitor">
    <div style="width:100%;height:100%">
      <!-- <canvas id="crvCanvas" class="spectrum_canvas" style="width:100%;height:50%"></canvas> 
      <canvas id="specCanvas" class="spectrum_canvas" style="width:100%;height:50%;margin-top:-50%"></canvas> -->
       
      <canvas id="spectrum" class="spectrum_canvas" style="width:100%;height:100%;"></canvas>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import {GdiFigPillar} from './common/JsGdi2.js';
  import {spectrogramLine, Crv,SpeedLine,Spectrum,GdiPoint,MARK1,MARK2,MARK3 } from './common/spectrum.js';
  export default {
    name: "test",
    data(){
      return{
        minF : 87,
        maxF : 108, //频率范围var minF = 87,maxF = 108; //频率范围
        specHandler:"",
        spectHandler:"",
        opticalHandler:"",
        dataArr:[1,2,3,4,5,6,7,8,9],

        allData:[],
        xAxisNum:"",
        xAxisData:[], 
        xAxisMin:"",
        xAxisMax:"",
      }
    },
    computed: {
    
    },
    components: {
      
    },
    mounted(){
      var that = this;
      console.log("aa")
      //this.initOptical("crvCanvas");//初始化热力图
      //this.initSpectrum();
      setInterval(function(){
        that.GetChannelNBSpect()
      },2000)
      //this.drawSpec(this.dataArr,1000)
      this.initSpectrum();
    },
    activated(){  //生命周期-缓存页面激活
      console.log("activated")
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      //频谱图初始化
      initSpectrum() {
        var that = this;
        var Handler = new Spectrum('spectrum', 1);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //光标名
        Handler.setMkrName(0,'A');
        Handler.setMkrName(1,'B');
        Handler.setMkrEnable([true,false,false,false,false,false]);
        
        //边距
        Handler.setMargin(50,10,20,20);
        //行列
        Handler.setGridRowsCols(8,10);
        //XY坐标轴
        Handler.setXYAxis(this.xAxisMin,this.xAxisMax, -120, 20);
        Handler.drawXYAxis();
        //曲线颜色
        Handler.setWaveColor(0,'#00FF00');

        GDI.removeAllFigure();
        GDI.removeAllText();
        GDI.draw();

        /*游标移动的处理*/
        var active_mark = undefined;
        // 消息处理
        Canvas.onmousedown = function (e) {
            //鼠标点击函数--e:事件；obj:点击的对象
            mouseDownFn(e);
        };
        Canvas.onmousemove = function (e) {
            mouseMoveFn(e);
        };
        Canvas.onmouseup = function (e) {
            mouseUpFn(e);
        };

        this.specHandler = Handler;

        function mouseDownFn(e){
          var obj = e.currentTarget;//当前点击的画布
          $(obj).focus();
          var jsgdi, mkr;
          jsgdi = that.specHandler.getJsGdi();
          mkr = jsgdi.getMarkerManager();
          if (e.button === 0) {
              // 左键按下
              var point;
              if (e.offsetX !== undefined && e.offsetY !== undefined) {
                  point = new GdiPoint(e.offsetX, e.offsetY);
              } else {
                  point = new GdiPoint(
                      e.pageX - this.offsetLeft,
                      e.pageY - this.offsetTop
                  );
              }
              console.log("point")
              console.log(point)
              active_mark = mkr.setActiveMkrByPoint([MARK1,MARK2,MARK3], point);
              console.log("active_mark:"+active_mark)
              if(active_mark) {
                  mkr.moveActiveMkrByPoint(active_mark["mkrGrp"], point);
                  //updateScansMaker(point,active_mark["mkrGrp"]);
                  jsgdi.draw();
                  //specHandler.redraw();
              }
          }
          return true;
        }
        function mouseMoveFn(e){
          if (active_mark) {
              var jsgdi, mkr,gdiFrm,frmRect;
              jsgdi = that.specHandler.getJsGdi();
              mkr = jsgdi.getMarkerManager();
              gdiFrm = jsgdi.getFrame();
              frmRect = gdiFrm.getBorderRect();
              var group = active_mark["mkrGrp"];
              var index = active_mark["index"];
              var point;
              if (e.offsetX !== undefined && e.offsetY !== undefined) {
                  point = new GdiPoint(e.offsetX, e.offsetY);
              } else {
                  point = new GdiPoint(
                      e.pageX - this.offsetLeft,
                      e.pageY - this.offsetTop
                  );
              }
              mkr.moveActiveMkrByPoint(group, point);
              var marker = mkr.getMarkerAt(group, 0);
              marker.setTextPos(point.x + 100 > frmRect.right ? gdiTextPos.OUTER_LEFTTOP : gdiTextPos.OUTER_RIGHTTOP);
              //updateScansMaker(point,active_mark["mkrGrp"]);
              jsgdi.draw();
              //specHandler.redraw();
          }
          return true;
        }
        function mouseUpFn(e){
          if (active_mark) {
              var jsgdi, mkr;
              jsgdi = that.specHandler.getJsGdi();
              mkr = jsgdi.getMarkerManager();
              mkr.setInactMkrByIndex(active_mark["mkrGrp"], active_mark["index"]);
              active_mark = null;
          }
        }
      },

      //瀑布图初始化
      initOptical(chartId) {
        var Handler  = new Crv(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //边距
        Handler.setMargin(50,26,20,40);
        //XY坐标轴
        Handler.drawXYAxis(87, 108, -120, 0);
        GDI.removeAllFigure();
        GDI.removeAllText();
        GDI.draw();
        this.opticalHandler = Handler;
      },
      //频谱图初始化
      initSpectrogram(chartId) {
        var Handler = new spectrogramLine(chartId);
        var Canvas = Handler.getCanvas();
        var GDI = Handler.getJsGdi();
        //边距
        Handler.setMargin(50,10,20,55);
        //画背景和坐标轴
        Handler.drawFrame();
        //XY轴标注
        //console.log("xAxisMax:"+this.xAxisMax)
        Handler.setXYAxis(this.xAxisMin,this.xAxisMax, -120, 20);
        //音量图
        Handler.drawSpectFig();
        /*GDI.removeAllFigure();
        GDI.removeAllText();*/
        GDI.draw();
        this.spectHandler = Handler;
      },
      GetChannelNBSpect(){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",
          data:this.$qs.stringify({
            GetRealtimeSpect: "1",
            DeviceSN:"5577382999",          
            BoardId:"0",         
          }),
          Api:"GetChannelNBSpect",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data = res.data;
            that.allData = data;
            that.xAxisNum = data["Points"];
            that.xAxisMin = (data["SpectStart"]/1000000).toFixed(3);
            that.xAxisMax = (data["SpectEnd"]/1000000).toFixed(3);
            //that.formatFreqCharts(data);
            /*that.initSpectrogram("specCanvas");
            that.spectHandler.updateSpectFig(data["Spect"]);//频谱图
            that.opticalHandler.drawCrv(data["Spect"]);//瀑布图*/
            that.drawSpec(data["Spect"])
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      //画频谱图

      drawSpec(data){
        this.specHandler.drawSpecFig(data);
        //specHandler.redraw();
        /*if(spectParams['sweepCtrl'] == 'auto'){
            spectParams['sweepTime'] = autoSweepTime;
        }*/
      }
      
    }
  }
</script>
<style>
</style>