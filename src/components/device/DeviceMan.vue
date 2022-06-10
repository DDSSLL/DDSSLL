<template>
  <div id="devicePage" style="height:100%">
    <div class="tableToolbar">
      <el-button type="primary" size="mini" @click="showAddForm">添加</el-button>
      <el-button type="primary" size="mini" @click="clickDelBtn">删除</el-button>
    </div>
    <el-table ref="multipleTable" :data="rcvListData" :row-key="getRowKeys" stripe fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :height="tableHeight">
      <el-table-column type="selection" :reserve-selection="true">
      </el-table-column>
      <el-table-column label="接收机名" sortable>
        <template slot-scope="scope">
          <span :class="scope.row.onlineStyle">{{ scope.row.RcvName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在线" sortable>
        <template slot-scope="scope">
          <span :class="scope.row.onlineStyle">{{ scope.row.online }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="RcvSn" label="序列号" sortable>
      </el-table-column>
      <el-table-column  prop="OnlineTime" label="上线时间" sortable>
      </el-table-column>
      <el-table-column  prop="CreateTime" label="创建时间" sortable>
      </el-table-column>
      <el-table-column prop="MapIp" label="公网IP" sortable>
      </el-table-column>
      <el-table-column prop="LocalIp" label="内网IP" sortable>
      </el-table-column>
      <el-table-column prop="RcvModel" label="型号" sortable>
      </el-table-column>
      <el-table-column prop="SoftVer" label="软件版本" sortable>
      </el-table-column>
      <el-table-column prop="HardVer" label="硬件版本" sortable>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editBoardRow(scope.$index, rcvListData)"
            type="text"
            size="small">
            板卡
          </el-button>
          <el-button
            @click.native.prevent="editRcvRow(scope.$index, rcvListData)"
            type="text"
            size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="添加接收机"
      :visible.sync="dialogAddDeviceShow"
      width="30%"
      >
      <el-form :model="form" class="drawerForm" :rules="rules" ref="form">
        <el-form-item label="接收机名称" :label-width="formLabelWidth" prop="RcvName">
          <el-input v-model="form.RcvName" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="接收机序列号" :label-width="formLabelWidth" prop="RcvSn">
          <el-input v-model="form.RcvSn" autocomplete="off" size="mini" :disabled="dis.RcvSn"></el-input>
        </el-form-item>
        <el-form-item label="内网IP" :label-width="formLabelWidth" v-if="show.LocalIp" prop="LocalIp">
          <el-input v-model="form.LocalIp" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="公网IP" :label-width="formLabelWidth" v-if="show.MapIp" prop="MapIp">
          <el-input v-model="form.MapIp" autocomplete="off" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth" v-if="show.Port" prop="Port">
          <el-input v-model="form.Port" autocomplete="off" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddDevice('form')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitDevice('form')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定删除选中的接收机吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="DelRcv" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="板卡信息"
      :visible.sync="dialogBoardShow"
      width="55%"
      :before-close="handleClose"
      >
      <el-table :data="boardData" stripe fit highlight-current-row style="width: 100%">
        <el-table-column label="板卡">
          <template slot-scope="scope">
            <span :class="scope.row.onlineStyle">{{ scope.row.BoardIdStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="在线">
          <template slot-scope="scope">
            <span :class="scope.row.onlineStyle">{{ scope.row.online }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="SoftVer" label="软件版本">
        </el-table-column>
        <el-table-column  prop="HardVer" label="硬件版本">
        </el-table-column>
        <el-table-column prop="FPGAVer" label="FPGA版本">
        </el-table-column>
        <el-table-column prop="WorkMode" label="工作模式">
        </el-table-column>
        <el-table-column prop="Channels" label="通道数">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editBoardParamRow(scope.$index, boardData)"
              type="text"
              size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogBoardShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogBoardShow = false">确 定</el-button>
      </span>
      <el-dialog
        width="35%"
        :title="'板卡'+(boardParamform.BoardIdStr)+'参数设置'"
        :visible.sync="dialogBoardParamShow"
        append-to-body
        :before-close="handleCloseBoardParam">
        <el-form :model="boardParamform" class="dialogForm" :rules="rules" ref="boardParamform">
          <el-form-item label="工作模式" :label-width="formLabelWidth" prop="WorkMode">
            <el-select class="" v-model="boardParamform.WorkMode" size="mini">
              <el-option
                v-for="item in RCV_MODE_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 任务模式下 -->
          <div v-if="boardParamform.WorkMode==0">
            <el-form-item label="放大器" :label-width="formLabelWidth" prop="AMP" >
              <el-select class="" v-model="boardParamform.AMP" size="mini">
                <el-option
                  v-for="item in AMP_OPTION"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="衰减器" :label-width="formLabelWidth" prop="ATT" >
              <el-input v-model="boardParamform.ATT" autocomplete="off" size="mini" :placeholder="range_ATT.min+'-'+range_ATT.max">
                <template slot="append">dB</template>
              </el-input>
            </el-form-item>  
          </div>
          <!-- 实时模式下 -->
          <div v-if="boardParamform.WorkMode==1">
            <el-form-item label="放大器" :label-width="formLabelWidth" prop="RealAMP">
              <el-select class="" v-model="boardParamform.RealAMP" size="mini">
                <el-option
                  v-for="item in AMP_OPTION"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="衰减器" :label-width="formLabelWidth" prop="RealATT">
              <el-input v-model="boardParamform.RealATT" autocomplete="off" size="mini" :placeholder="range_ATT.min+'-'+range_ATT.max">
                <template slot="append">dB</template>
              </el-input>
            </el-form-item>  
          </div>
          <el-form-item label="采样率" :label-width="formLabelWidth" prop="SampRate">
            <el-select class="" v-model="boardParamform.SampRate" size="mini">
              <el-option
                v-for="item in SAMPLE_RATE_OPTION"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="全带频谱采样间隔" :label-width="formLabelWidth" prop="FBInterval">
            <el-input v-model="boardParamform.FBInterval" autocomplete="off" size="mini" :placeholder="range_SampInterval.min+'-'+range_SampInterval.max">
              <template slot="append">ms</template>
            </el-input>
          </el-form-item>
          <el-form-item label="全带频谱FFT" :label-width="formLabelWidth" prop="FBFFT">
            <el-select class="" v-model="boardParamform.FBFFT" size="mini">
              <el-option
                v-for="item in FBFFT_OPTION"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="窄带频谱开关" :label-width="formLabelWidth" prop="NBStart">
            <el-select class="" v-model="boardParamform.NBStart" size="mini">
              <el-option
                v-for="item in STATUS_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="窄带频谱采样间隔" :label-width="formLabelWidth" prop="NBInterval">
            <el-input v-model="boardParamform.NBInterval" autocomplete="off" size="mini" :placeholder="range_SampInterval.min+'-'+range_SampInterval.max">
              <template slot="append">ms</template>
            </el-input>
          </el-form-item>
          <el-form-item label="窄带频谱FFT" :label-width="formLabelWidth" prop="NBFFT">
            <el-select class="" v-model="boardParamform.NBFFT" size="mini">
              <el-option
                v-for="item in FBFFT_OPTION"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeBoardParam('boardParamform')">取 消</el-button>
          <el-button size="mini" type="primary" @click="submitBoardParam('boardParamform')">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState,mapMutations } from 'vuex';
  export default {
    name: "RcvMan",
    data(){
      var validateName = (rule, value, callback) => {
        if(!this.$common.nameCheckType1(value)){
          callback(new Error('请输入合法名称'));
        }
        callback();
      };
      var validateSn = (rule, value, callback) => {
        if(!this.$common.isValidSn(value)){
          callback(new Error('请输入合法序列号'));
        }
        callback();
      };
      var validateIp = (rule, value, callback) => {
        if(this.form.type == "edit" && !this.$common.isValidIP(value)){
          callback(new Error('请输入合法IP'));
        }
        callback();
      };
      var validatePort = (rule, value, callback) => {
        if(this.form.type == "edit" && !this.$common.isValidPort(value)){
          callback(new Error('请输入合法端口'));
        }
        callback();
      };
      var validateNum = (rule, value, callback) => {
        if(isNaN(value)){
          callback(new Error('请输入合法参数'));
        }
        switch(rule.field){
          case "ATT":
          case "RealATT":
            if(value < this.range_ATT.min || value > this.range_ATT.max){
              callback(new Error('请按要求输入'));
            }
            break;
          /*case "RefreshInterval":
            if(value < 1 || value > 5){
              console.log("aaaa")
              callback(new Error('请按要求输入'));
            }
            break;*/
          case "FBInterval":
          case "NBInterval":
            if(value < this.range_SampInterval.min || value > this.range_SampInterval.max){
              callback(new Error('请按要求输入'));
            }
            break;
        }
        callback();
      };
      return{
        contentHeight:"",
        tableHeight:"600px",
        refreshInterval:"",
        rcvListData: [],
        boardData:[],
        dialogAddDeviceShow: false,
        dialogVisible:false,
        dialogBoardShow:false,
        dialogBoardParamShow:false,
        multipleSelection:[],
        direction: 'rtl',
        form: {
          type:"add",
          RcvName:"",
          RcvSn:"",
          LocalIp:"",
          MapIp:"",
          Port:"",
        },
        RCV_MODE_OPTION:[{
          value: '0',
          label: '实时模式'
        }, {
          value: '1',
          label: '任务模式'
        }],
        AMP_OPTION:[],
        STATUS_OPTION:[{
          value: '0',
          label: '关'
        }, {
          value: '1',
          label: '开'
        }],
        SAMPLE_RATE_OPTION:[],
        FBFFT_OPTION:[],
        LISTEN_LOOP_TYPE_OPTION:[{
          value: '0',
          label: '按运行图'
        }, {
          value: '1',
          label: '按频率范围'
        }],
        boardParamform:{
          RcvSn:"",              //序列号
          BoardId:"0",           //板卡号， "-1"代表无效
          BoardIdStr:"",
          WorkMode:0,           //工作模式，0任务，1实时
          AMP:0,                 //放大器,dB, 任务模式生效
          ATT:0,                  //衰减器,dB, 任务模式生效
          RealAMP:0,             //放大器,dB, 实时模式生效
          RealATT:0,              //衰减器,dB, 实时模式生效
          SampRate: 65000000,  //采样率
          FBFFT:8192,            //全带频谱FFT
          NBStart:0,             //窄带频谱开关，0关 1开
          NBInterval:200,        //窄带频谱采样间隔ms10-3600000
          NBFFT:8192,           //窄带频谱FFT
        },
        boardsParam:[
        ],
        show:{
          LocalIp:"",
          MapIp:"",
          Port:"",
        },
        dis:{
          RcvSn:false,
        },
        rules: {
          RcvName: [
            { required: true, message: '请输入接收机名称', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          RcvSn: [
            { required: true, message: '请输入接收机序列号', trigger: 'blur' },
            { validator: validateSn, trigger: 'blur' }
          ],
          LocalIp: [
            { required: true, message: '请输入内网IP', trigger: 'blur' },
            { validator: validateIp, trigger: 'blur' }
          ],
          MapIp: [
            { required: true, message: '请输入公网IP', trigger: 'blur' },
            { validator: validateIp, trigger: 'blur' }
          ],
          Port: [
            { required: true, message: '请输入端口号', trigger: 'blur' },
            { validator: validatePort, trigger: 'blur' }
          ],
          /*板卡参数*/
          WorkMode: [
            { required: true, message: '请选择工作模式', trigger: 'blur' },
          ],
          AMP: [
            { required: true, message: '请选择放大器', trigger: 'blur' },
          ],
          ATT: [
            { required: true, message: '请输入衰减器', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ],
          RealAMP: [
            { required: true, message: '请选择放大器', trigger: 'blur' },
          ],
          RealATT: [
            { required: true, message: '请输入衰减器', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ],
          RefreshInterval: [
            { validator: validateNum, trigger: 'blur' }
          ],
          SampRate: [
            { required: true, message: '请选择采样率', trigger: 'blur' }
          ],
          FBInterval: [
            { required: true, message: '请输入全带频谱采样间隔', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ],
          FBFFT: [
            { required: true, message: '请选择全带频谱FFT', trigger: 'blur' }
          ],
          FBZoom: [
            { validator: validateNum, trigger: 'blur' }
          ],
          NBStart: [
            { required: true, message: '请选择窄带频谱开关', trigger: 'blur' }
          ],
          NBInterval: [
            { required: true, message: '请输入窄带频谱采样间隔', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
          ],
          NBFFT: [
            { required: true, message: '请选择窄带频谱FFT', trigger: 'blur' }
          ],
          NBZoom: [
            { validator: validateNum, trigger: 'blur' }
          ],
        },
        loading: false,
        formLabelWidth: '160px',
        timer: null,
      }
    },
    computed: {
      ...mapState(['range_ATT','range_AMP','range_SampInterval','range_SampRate','range_FFT'])
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
      this.contentHeight = document.getElementById("devicePage").offsetHeight;
      this.initRangeParam();
      this.GetRcvList();  
      if(this.refreshInterval){
        clearInterval(that.refreshInterval)
      }else{
        this.refreshInterval = setInterval(function(){
          if(that.$route.fullPath == "/deviceMan"){
            that.GetRcvList();  
          }else{
            clearInterval(that.refreshInterval)
          }
        },3000)  
      }
    },
    created(){
      this.contentHeight = document.getElementById("devicePage").offsetHeight;
      this.tableHeight = (this.contentHeight-50)+"px";  
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活
    },
    methods:{
      // ...mapMutations({
          
      // }),
      initRangeParam(){
        this.AMP_OPTION = this.range_AMP;
        this.SAMPLE_RATE_OPTION = this.range_SampRate;
        this.FBFFT_OPTION = this.range_FFT;
      },
      getRowKeys(row){
        return row.id;
      },
      GetRcvList(){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetRcvList.json",
          data:{
            GetRcvList: "1"
          },
          Api:"GetRcvList",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data= res.data;
            for(var i=0; i<data.length; i++){
              if(data[i]["Online"] == 1){
                data[i]["online"] = "在线"
                data[i]["onlineStyle"] = "colorGreen"
              }else{
                data[i]["online"] = "离线"
                data[i]["onlineStyle"] = "colorGray"
              }
            }
            that.rcvListData = data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      showAddForm(){
        this.form.type = "add";
        this.form.RcvName = "";
        this.form.RcvSn = "";
        this.dis.RcvSn = false;
        this.show.LocalIp = false;
        this.show.MapIp = false;
        this.show.Port = false;
        this.dialogAddDeviceShow = true;
      },
      editRcvRow(index, data){
        this.form.type = "edit";
        this.show.LocalIp = true;
        this.show.MapIp = true;
        this.show.Port = true;
        this.dialogAddDeviceShow = true;
        var formData = data[index];
        this.form.RcvSn = formData["RcvSn"];
        this.dis.RcvSn = true;
        this.form.RcvName = formData["RcvName"];
        this.form.LocalIp = formData["LocalIp"]?formData["LocalIp"]:"";
        this.form.MapIp = formData["MapIp"]?formData["MapIp"]:"";
        this.form.Port = formData["Port"]?formData["Port"]:"";
      },
      clickDelBtn(){
        if(this.multipleSelection.length == 0){
           this.$alert('请选择要删除的接收机', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              /*this.$message({
                type: 'info',
                message: `action: ${ action }`
              });*/
            }
          });
        }else{
          this.dialogVisible = true;
        }
      },
      DelRcv(){
        var that = this;
        this.dialogVisible = false;
        var delSns = this.multipleSelection.map(item => {return item.RcvSn});
        this.$axios({
          url:"/protocol/index.php",//"/testJson/DelRcv.json",
          data:{
            DelRcv: "1",
            RcvSns:delSns, 
          },
          Api:"DelRcv",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            that.GetRcvList();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      submitDevice(formName){
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.type == "add"){
              this.AddRcv(function(){
                that.GetRcvList();
                that.dialogAddDeviceShow = false;
              });
            }else{
              this.EditRcv(function(){
                that.GetRcvList();
                that.dialogAddDeviceShow = false;
              });
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      closeAddDevice(formName){
        this.dialogAddDeviceShow = false;
        this.$refs[formName].resetFields();
      },
      AddRcv(cb){
        var that = this;
        this.$axios({
          url:"protocol/index.php",//"/testJson/AddRcv.json",
          data:{
            AddRcv: "1",
            RcvSn:that.form.RcvSn,              //10位序列号
            RcvName:that.form.RcvName,           //接收机名字
          },
          Api:"AddRcv",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            cb();
          }else{
            that.$message.error(res.msg);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      EditRcv(cb){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/EditRcv.json",
          data:{
            EditRcv: "1",
            RcvSn:that.form.RcvSn,             //10位序列号
            RcvName:that.form.RcvName,          //接收机名字
            LocalIp:that.form.LocalIp,             //内网IP
            MapIp:that.form.MapIp,             //公网IP
            Port:that.form.Port,               //端口
          },
          Api:"EditRcv",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            cb();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      editBoardRow(index, data){
        this.dialogBoardShow = true;
        var that = this;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetRcvList.json",
          data:{
            GetBoardList: "1",
            DeviceSN:data[index]["RcvSn"],
          },
          Api:"GetBoardList",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data= res.data;
            for(var i=0; i<data.length; i++){
              if(data[i]["Online"] == 1){
                data[i]["online"] = "在线"
                data[i]["onlineStyle"] = "colorGreen"
              }else{
                data[i]["online"] = "离线"
                data[i]["onlineStyle"] = "colorGray"
              }
            }
            that.boardData = data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      editBoardParamRow(index, data){
        var that = this;
        var rcvSn = data[index]["RcvSn"];
        var BoardId = data[index]["BoardId"];
        this.dialogBoardParamShow = true;
        this.GetBoardParam(rcvSn, BoardId);
      },
      GetBoardParam(rcvSn, BoardId, cb){
        var that = this;
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetBoardParam.json",
          data:{
            GetBoardParam: 1,
            DeviceSN:rcvSn,
            BoardId:BoardId,
          },
          Api:"GetBoardParam",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var dataParam= res.data;
            that.boardsParam = dataParam;
            that.formatCurrentBoardParam(dataParam[0]);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      formatCurrentBoardParam(data){
        var that = this;
        data["AMP"] = data["AMP"]*1;
        data["RealAMP"] = data["RealAMP"]*1;
        data["SampRate"] = data["SampRate"]*1;
        this.boardParamform = data;
      },
      submitBoardParam(formName){
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.SetBoardParams(function(){
              that.dialogBoardParamShow = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      SetBoardParams(){
        var that = this;
        var data = {};
        data.SetBoardParams = "1";
        data.DeviceSN = this.boardParamform.RcvSn;
        data.BoardId = this.boardParamform.BoardId;
        data.ParamCol = ["WorkMode",        //0:实时模式 1:任务模式
                        "AMP",              //任务模式放大器,0-20dB
                        "ATT",              //任务模式衰减器,0-50dB
                        "RealAMP",         //实时模式放大器
                        "RealATT",         //实时模式衰减器
                        "SampRate",      //采样率
                        "FBInterval",      //全带频谱采样间隔ms
                        "FBFFT",          //全带频谱FFT
                        "NBStart",        //窄带频谱开关，0关 1开
                        "NBInterval",      //窄带频谱采样间隔ms
                        "NBFFT",          //窄带频谱FFT
                        ];
        data.ParamValue =[this.boardParamform.WorkMode,//0:实时模式 1:任务模式
                          this.boardParamform.AMP,     //任务模式放大器,0-20dB
                          this.boardParamform.ATT,     //任务模式衰减器,0-50dB
                          this.boardParamform.RealAMP, //实时模式放大器
                          this.boardParamform.RealATT, //实时模式衰减器
                          this.boardParamform.SampRate,  //采样率
                          this.boardParamform.FBInterval,//全带频谱采样间隔ms
                          this.boardParamform.FBFFT,     //全带频谱FFT
                          this.boardParamform.NBStart,   //窄带频谱开关，0关 1开
                          this.boardParamform.NBInterval,//窄带频谱采样间隔ms
                          this.boardParamform.NBFFT,    //窄带频谱FFT
                        ];
        this.$axios({
          url:"/protocol/index.php",//"/testJson/GetBoardParam.json",
          data:data,
          Api:"SetBoardParams",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data= res.data;
            that.dialogBoardParamShow = false;
          }else{
            that.$message.error(res.msg);
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      closeBoardParam(formName){
        this.dialogBoardParamShow = false;
        this.$refs[formName].resetFields();
      },
      handleClose(){
        this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogBoardShow = false;
        })
        .catch(_ => {});
      },
      handleCloseBoardParam(){
        this.$confirm('确认关闭？')
        .then(_ => {
          this.dialogBoardParamShow = false;
        })
        .catch(_ => {});
      },
    }
  }
</script>

<style scoped>

</style>