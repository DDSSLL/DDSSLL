<template>
  <div>
    <div class="tableToolbar">
      <el-button-group>
        <el-button type="primary" size="mini" @click="addTask">添加</el-button>
        <el-button type="primary" size="mini" @click="clickTaskDelBtn">删除</el-button>
      </el-button-group>
      <el-button-group style="margin-left:10px">
        <el-button type="primary" size="mini" @click="">导入</el-button>
        <el-button type="primary" size="mini" @click="">导出</el-button>
      </el-button-group>
      
      <el-button type="primary" size="mini" @click="setBatBtn" style="margin-left: 10px;">批量设置</el-button>
      <div style="display: inline-block;float: right;">
        <el-select v-model="filter.selectRcv" filterable multiple collapse-tags placeholder="接收机" size="mini" style="width:180px;margin-left: 10px;">
          <el-option
            v-for="item in RCV_LIST_OPTION"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="filter.selectChannel" filterable multiple placeholder="类型" size="mini" collapse-tags  style="width:150px;">
          <el-option
            v-for="item in CHANNEL_TYPE_OPTION"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="filter.freq" placeholder="频率" size="mini" style="width:100px"></el-input>
        <el-input v-model="filter.name" placeholder="台名" size="mini" style="width:100px"></el-input>
        <el-input v-model="filter.programme" placeholder="节目" size="mini" style="width:100px"></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="GetAlarmTime">查询</el-button>
      </div>
      
    </div>
    <el-table :data="AlarmTimeData" stripe fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="Freq" label="频率"  width="180">
      </el-table-column>
      <el-table-column prop="Name" label="台名" width="180">
      </el-table-column>
      <el-table-column prop="Programme" label="节目">
      </el-table-column>
      <el-table-column prop="StartTime" label="开始时间">
      </el-table-column>
      <el-table-column prop="EndTime" label="结束时间">
      </el-table-column>
      <el-table-column prop="StartDateTime" label="开始日期">
      </el-table-column>
      <el-table-column prop="EndDateTime" label="结束日期">
      </el-table-column>
      <el-table-column prop="peroid" label="周期">
      </el-table-column>
      <el-table-column prop="channel_type" label="类型">
      </el-table-column>
      <el-table-column prop="cover_rcv" label="覆盖接收机">
      </el-table-column>
      <el-table-column prop="SaveTime" label="保存时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editTaskRow(scope.$index, AlarmTimeData)"
            type="text"
            size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加编辑运行图 -->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="addTaskDrawer"
      :direction="direction"
      :before-close="handleClose"
      ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="form" class="drawerForm" >
          <el-form-item label="频率" :label-width="formLabelWidth">
            <el-input v-model="form.Freq" autocomplete="off" size="mini"><template slot="append">kHz</template></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-select v-model="form.ChannelType" filterable placeholder="类型" size="mini" collapse-tags style="width:100%">
              <el-option
                v-for="item in CHANNEL_TYPE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="台名" :label-width="formLabelWidth" v-if="">
            <el-input v-model="form.Name" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="节目" :label-width="formLabelWidth" v-if="">
            <el-input v-model="form.Programme" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" :label-width="formLabelWidth" v-if="">
            <el-time-picker v-model="form.StartTime" size="mini" style="width:100%" arrow-control value-format="HH:mm:ss"></el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间" :label-width="formLabelWidth" v-if="">
            <el-time-picker v-model="form.EndTime" size="mini" style="width:100%" arrow-control value-format="HH:mm:ss"></el-time-picker>
          </el-form-item>
          <el-form-item label="开始日期" :label-width="formLabelWidth" v-if="">
            <el-date-picker v-model="form.StartDateTime" type="date" placeholder="选择日期" size="mini" style="width:100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" :label-width="formLabelWidth" v-if="">
            <el-date-picker v-model="form.EndDateTime" type="date" placeholder="选择日期" size="mini" style="width:100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="周期" :label-width="formLabelWidth" v-if="">
            <el-checkbox-group v-model="form.peroid" size="mini" style="text-align: left">
              <el-checkbox-button v-for="day in peroid" :label="day" :key="day">{{day}}</el-checkbox-button>
            </el-checkbox-group>
            <!-- <el-input v-model="form.DayofWeek" autocomplete="off" size="mini"></el-input> -->
          </el-form-item>
          <el-form-item label="接收机" :label-width="formLabelWidth" v-if="">
            <el-select v-model="form.Rcv" filterable multiple size="mini" style="width:100%;">
              <el-option
                v-for="item in RCV_LIST_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm" size="mini" >取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading" size="mini" >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 删除运行图 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteConfirmDialog"
      width="30%"
      :before-close="handleClose">
      <span>确定删除选中的运行图吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="DelTask" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量设置 -->
    <el-drawer
      title="批量设置"
      :visible.sync="setBatDrawer"
      :direction="direction"
      :before-close="handleSetBatClose"
      ref="setBat">
      <div class="demo-drawer__content">
        <el-form :model="setBat" class="drawerForm" >
          <el-form-item label="批量设置内容" :label-width="formLabelWidth">
            <el-select v-model="setBat.content" filterable multiple size="mini" style="width:100%" @change="changeSetBat" @remove-tag="removeSet">
              <el-option
                v-for="item in SET_BAT_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="频率" :label-width="formLabelWidth" v-if="setBatShow.Freq">
            <el-input v-model="setBat.Freq" autocomplete="off" size="mini"><template slot="append">kHz</template></el-input>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth" v-if="setBatShow.ChannelType">
            <el-select v-model="setBat.ChannelType" filterable placeholder="类型" size="mini" collapse-tags style="width:100%">
              <el-option
                v-for="item in CHANNEL_TYPE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="台名" :label-width="formLabelWidth" v-if="setBatShow.Name">
            <el-input v-model="setBat.Name" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="节目" :label-width="formLabelWidth" v-if="setBatShow.Programme">
            <el-input v-model="setBat.Programme" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" :label-width="formLabelWidth" v-if="setBatShow.StartTime">
            <el-time-picker v-model="setBat.StartTime" size="mini" style="width:100%" arrow-control value-format="HH:mm:ss"></el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间" :label-width="formLabelWidth" v-if="setBatShow.EndTime">
            <el-time-picker v-model="setBat.EndTime" size="mini" style="width:100%" arrow-control value-format="HH:mm:ss"></el-time-picker>
          </el-form-item>
          <el-form-item label="开始日期" :label-width="formLabelWidth" v-if="setBatShow.StartDateTime">
            <el-date-picker v-model="setBat.StartDateTime" type="date" placeholder="选择日期" size="mini" style="width:100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" :label-width="formLabelWidth" v-if="setBatShow.EndDateTime">
            <el-date-picker v-model="setBat.EndDateTime" type="date" placeholder="选择日期" size="mini" style="width:100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="周期" :label-width="formLabelWidth" v-if="setBatShow.peroid">
            <el-checkbox-group v-model="setBat.peroid" size="mini" style="text-align: left">
              <el-checkbox-button v-for="day in peroid" :label="day" :key="day">{{day}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="接收机" :label-width="formLabelWidth" v-if="setBatShow.CoverRcv">
            <el-select v-model="setBat.CoverRcv" filterable multiple size="mini" style="width:100%;">
              <el-option
                v-for="item in RCV_LIST_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm" size="mini" >取 消</el-button>
          <el-button type="primary" @click="$refs.setBat.closeDrawer()" :loading="loading" size="mini" >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
  
</template>

<script>
  export default {
    name: "AlarmTimeData",
    data(){
      return{
        multipleSelectionTask:"",
      	AlarmTimeData: [],
        RCV_LIST_OPTION:[],
        CHANNEL_TYPE_OPTION: [{
          value: '0',
          label: '中播'
        }, {
          value: '1',
          label: '短波'
        }, {
          value: '2',
          label: '调频'
        }],
        filter:{
          selectRcv:"",
          selectChannel:"",
          freq:"",
          name:"",
          programme:""
        },
        addTaskDrawer:false,
        direction:'rtl',
        drawerTitle:"添加运行图",
        formLabelWidth: '160px',
        loading: false,
        deleteConfirmDialog:false,
        form:{
          ID:"",
          type:'add',
          Freq:"",
          ChannelType:"",
          Name:"",
          Programme:"",
          StartTime:"",
          EndTime:"",
          StartDateTime:"",
          EndDateTime:"",
          WeeklyTime:"",
          DayTime:"",
          DayofWeek:"",
          Rcv:"",
          peroid:[],
        },
        //checkboxGroup: ['1','2','5'],
        peroid: ['1', '2', '3', '4', '5', '6', '7'],
        setBatDrawer:false,
        setBat:{
          content:"",
          Freq:"",
          ChannelType:"", 
          Name:"",
          Programme:"",
          StartTime:"",
          EndTime:"",
          StartDateTime:"",
          EndDateTime:"",
          peroid:[],          
          CoverRcv:"",
        },
        setBatShow:{
          Freq:false,
          ChannelType:false, 
          Name:false,
          Programme:false,
          StartTime:false,
          EndTime:false,
          StartDateTime:false,
          EndDateTime:false,
          peroid:false,          //标识只执行一次任务
          CoverRcv:false,
        },
        lastBatCon:[],
        SET_BAT_OPTION:[{//批量设置内容
          value: 'Freq',
          label: '频率'
        }, {
          value: 'ChannelType',
          label: '类型'
        }, {
          value: 'Name',
          label: '台名'
        }, {
          value: 'Programme',
          label: '节目'
        }, {
          value: 'StartTime',
          label: '开始时间'
        }, {
          value: 'EndTime',
          label: '结束时间'
        }, {
          value: 'StartDateTime',
          label: '开始日期'
        }, {
          value: 'EndDateTime',
          label: '结束日期'
        }, {
          value: 'peroid',
          label: '周期'
        }, {
          value: 'CoverRcv',
          label: '接收机'
        }],
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
    	console.log("page2 mounted")
    	var that = this;
      this.GetRcvSnList();
    	this.GetAlarmTime();
    	/*this.$axios.get('/testJson/test.json').then(res=>{
    		var data = that.$qs.parse(res.data)
    		if(data.code == 0){
    			this.tableData = data.data;
    		}
    	})
      return;*/
      
    },
    activated(){  //生命周期-缓存页面激活
    	console.log("page2 active")
    	/*this.$axios.get('/public/testJson/test.json').then(res=>{
    		console.log(res)
    	})*/
    },
    deactivated(){   //生命周期-缓存页面失活

    },
    methods:{
      // ...mapMutations({
          
      // }),
      handleSelectionChange(val){
        this.multipleSelectionTask = val;
      },
      GetRcvSnList(){
        var that = this;
        this.$axios({
          //method: 'GET',
          url:"/testJson/GetRcvSnList.json",
          data:this.$qs.stringify({
            GetRcvSnList: "1",
          }),
          Api:"GetAlarmTime",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          console.log(res)
          if(res.code == "0000"){
            var data = res.data;
            var option = {};
            for(var i=0; i<data.length; i++){
              option = {};
              option.label = data[i]["RcvName"];
              option.value = data[i]["RcvSn"];
              that.RCV_LIST_OPTION.push(option);
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      GetAlarmTime(){
        console.log("GetAlarmTime")
        var that = this;
        var dataJson = {
          GetAlarmTime: "1",
          FilterSN:that.filter.selectRcv,           //过滤条件，全部接收机："",某些接收机："sn,sn,sn"
          FilterCHType:that.filter.selectChannel,    //全部：""，0中波，1短波，2调频
          FilterFreq:that.filter.freq,              //全部："",某个频率Hz
          FilterName:that.filter.name,              //全部："",某个台名
          FilterProg:that.filter.programme,         //全部："",某个节目
        };
        console.log(dataJson)
        this.$axios({
          //method: 'GET',
          url:"/testJson/GetAlarmTime.json",
          data:this.$qs.stringify(dataJson),
          Api:"GetAlarmTime",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          console.log(res)
          if(res.code == "0000"){
            var data = res.data;
            for(var i=0; i<data.length; i++){
              data[i]["channel_type"] = that.CHANNEL_TYPE_OPTION.filter(item => {return item.value==data[i]["ChannelType"]})
                .map(item=> {return item.label});
              data[i]["peroid"] = data[i]["DayofWeek"].split("").join(",");
              data[i]["cover_rcv"] = data[i]["CoverRcv"].map(item => {return item.RcvName}).join(",")
            }
            that.AlarmTimeData = res.data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      addTask(){
        this.addTaskDrawer = true;
        this.drawerTitle = "添加运行图";
        this.form.type = 'add';
        this.form.Freq = "";
        this.form.ChannelType = ""; 
        this.form.Name = "";
        this.form.Programme = "";
        this.form.StartTime = "";
        this.form.EndTime = "";
        this.form.StartDateTime = "";
        this.form.EndDateTime = "";
        this.form.peroid = [];
        this.form.Rcv = "";
      },
      editTaskRow(index, datas){
        var data = datas[index];
        this.addTaskDrawer = true;
        this.drawerTitle = "编辑运行图";
        this.form.type = 'edit';
        this.form.ID = data["ID"];
        this.form.Freq = data["Freq"];
        this.form.ChannelType = data["ChannelType"];
        this.form.Name = data["Name"];
        this.form.Programme = data["Programme"];
        this.form.StartTime = data["StartTime"];
        this.form.EndTime = data["EndTime"];
        this.form.StartDateTime = data["StartDateTime"];
        this.form.EndDateTime = data["EndDateTime"];
        this.form.peroid = data["DayofWeek"].split("");
        this.form.Rcv =  data["CoverRcv"].map(item=>{return item["RcvSn"]});
      },
      clickTaskDelBtn(){
        if(this.multipleSelectionTask.length == 0){
           this.$alert('请选择要删除的运行图', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              /*this.$message({
                type: 'info',
                message: `action: ${ action }`
              });*/
            }
          });
        }else{
          this.deleteConfirmDialog = true;
        }
      },
      DelTask(){
        var that = this;
        this.deleteConfirmDialog = false;
        var DelIDs = this.multipleSelectionTask.map(item => item.ID);
        console.log(DelIDs)
        this.$axios({
          url:"/testJson/DelAlarmTimeFrep.json",
          data:{
            DelAlarmTimeFrep: "1",
            DelIDs:DelIDs, 
          },
          Api:"DelAlarmTimeFrep",
          AppId:"web",
          //UserId:that.user.id
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            that.GetAlarmTime();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      setBatBtn(){
        if(this.multipleSelectionTask.length == 0){
           this.$alert('请选择要批量设置的条目', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              /*this.$message({
                type: 'info',
                message: `action: ${ action }`
              });*/
            }
          });
        }else{
          this.setBatDrawer = true;
        }
      },
      changeSetBat(a){//修改批量设置的内容
        var addSet = "";
        var delSet = "";
        var newCon = this.setBat.content;
        var oldCon = this.lastBatCon;
        if(newCon.length > oldCon.length){
          for(var i=0; i<newCon.length; i++){
            if(oldCon.indexOf(newCon[i]) == -1){
              addSet = newCon[i];
              break;
            }
          }
        }else{
          for(var i=0; i<oldCon.length; i++){
            if(newCon.indexOf(oldCon[i]) == -1){
              delSet = oldCon[i];
              break;
            }
          }
        }
        this.lastBatCon = newCon;
        if(addSet != ""){
          this.setBatShow[addSet] = true;
        }else if(delSet != ""){
          this.setBatShow[delSet] = false;
        }
      },
      removeSet(removeTag){
        this.setBatShow[removeTag] = false;
      },
      handleClose(done) {
        var that = this;
        if (this.loading) {
          return;
        }
        this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.AddAlarmTimeFrep(function(){
            that.GetAlarmTime();
            that.loading = true;
            that.timer = setTimeout(() => {
              done();
              // 动画关闭需要一定的时间
              setTimeout(() => {
                that.loading = false;
              }, 400);
            }, 2000);
          });
                
        })
        .catch(_ => {});
      },
      handleSetBatClose(done){
        var that = this;
        if (this.loading) {
          return;
        }
        this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.EditMultyAlarmTimeFrep(function(){
            that.GetAlarmTime();
            that.loading = true;
            that.timer = setTimeout(() => {
              done();
              // 动画关闭需要一定的时间
              setTimeout(() => {
                that.loading = false;
              }, 400);
            }, 2000);
          });
                
        })
        .catch(_ => {});
      },
      EditMultyAlarmTimeFrep(cb){
        var that = this;
        var IDList = this.multipleSelectionTask.map(item => {return item.ID})
        var showContent = this.setBat.content;
        var ParamCol = [];
        var ParamValue = [];
        for(var i=0; i<showContent.length; i++){
          if(showContent[i] == "CoverRcv"){
            ParamValue.push(this.setBat[showContent[i]].join(","));
            ParamCol.push(showContent[i]);
          }else if(showContent[i] == "peroid"){
            ParamCol.push("WeeklyTime","DayTime","DayofWeek");
            if(this.setBat[showContent[i]].length == 0){
              ParamValue.push("0","1","");
            }else{
              ParamValue.push("1","0",this.setBat[showContent[i]].join(""));
            }
          }else{
            ParamValue.push(this.setBat[showContent[i]]); 
            ParamCol.push(showContent[i]);
          }
        }
        var jsonData = {
          EditMultyAlarmTimeFrep: "1",
          IDList:IDList,       
          ParamCol:ParamCol,       
          ParamValue:ParamValue,      //要修改的数值
        }
        console.log("jsonData")
        console.log(jsonData)
        this.$axios({
          url:"/testJson/EditMultyAlarmTimeFrep.json",
          data:this.$qs.stringify(jsonData),
          Api:"EditMultyAlarmTimeFrep",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          console.log(res)
          if(res.code == "0000"){
             cb();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      AddAlarmTimeFrep(cb){
        var that = this;
        if(this.form.peroid.length == 0){
          this.form.WeeklyTime = '0';
          this.form.DayTime = '1';
        }else{
          this.form.WeeklyTime = '1';
          this.form.DayTime = '0';
          this.form.DayofWeek = this.form.peroid;
        }
        var jsonData = {
          AddAlarmTimeFrep: "1",
          AlarmTime:[{
            Freq:that.form.Freq,
            ChannelType:that.form.ChannelType, 
            Name:that.form.Name,
            Programme:that.form.Programme,
            StartTime:that.form.StartTime,
            EndTime:that.form.EndTime,
            StartDateTime:that.form.StartDateTime,
            EndDateTime:that.form.EndDateTime,
            MonthTime:"",        //标识每月有效任务
            WeeklyTime:that.form.WeeklyTime,       //标识每周有效任务
            DayTime:that.form.DayTime,          //标识只执行一次任务
            Month:"",          //每月执行任务中标识哪个月,//1-12表示1月到12月,//ALL代表每个月
            Day:"",              //每月执行任务中标识月的具体某天//范围等同每月的天数
            DayofWeek:that.form.DayofWeek,        //1~7表示周一至周日 0表示每天
            CoverRcv:that.form.Rcv.join(","),
          }]
        }
        if(this.form.type == "edit"){
          jsonData.AlarmTime[0]["ID"] = this.form.ID;
        }
        this.$axios({
          //method: 'GET',
          url:"/testJson/AddAlarmTimeFrep.json",
          data:this.$qs.stringify(jsonData),
          Api:"GetAlarmTime",
          AppId:"android",
          //UserId:that.user.id
        })
        .then(function (response) {
          console.log(response)
          let res = response.data;
          console.log(res)
          if(res.code == "0000"){
             cb();
            
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      cancelForm() {
        this.loading = false;
        this.addTaskDrawer = false;
        clearTimeout(this.timer);
      },

    }
  }
</script>

<style scoped>
  
</style>