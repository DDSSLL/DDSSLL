<template>
  <div>
    <div class="tableToolbar">
      <el-button type="primary" size="mini" @click="showAddForm">添加</el-button>
      <el-button type="primary" size="mini" @click="clickDelBtn">删除</el-button>
    </div>
    <el-table ref="multipleTable" :data="rcvListData" stripe fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
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
      <el-table-column prop="MapIp" label="公网IP">
      </el-table-column>
      <el-table-column prop="OwnIP" label="内网IP">
      </el-table-column>
      <el-table-column prop="RcvModel" label="型号">
      </el-table-column>
      <el-table-column prop="SoftVer" label="软件版本">
      </el-table-column>
      <el-table-column prop="HardVer" label="硬件版本">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editRcvRow(scope.$index, rcvListData)"
            type="text"
            size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      title="添加接收机"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      ref="drawer">
      <div class="demo-drawer__content">
        <el-form :model="form" class="drawerForm" >
          <el-form-item label="接收机名称" :label-width="formLabelWidth">
            <el-input v-model="form.RcvName" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="接收机序列号" :label-width="formLabelWidth">
            <el-input v-model="form.RcvSn" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="内网IP" :label-width="formLabelWidth" v-if="show.OwnIP">
            <el-input v-model="form.OwnIP" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="公网IP" :label-width="formLabelWidth" v-if="show.MapIp">
            <el-input v-model="form.MapIp" autocomplete="off" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="端口" :label-width="formLabelWidth" v-if="show.Port">
            <el-input v-model="form.Port" autocomplete="off" size="mini"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm" size="mini" >取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading" size="mini" >{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>确定删除选中的接收机吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="DelRcv" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //import qs from 'qs'
  export default {
    name: "RcvMan",
    data(){
      return{
        rcvListData: [],
        drawer: false,
        dialogVisible:false,
        multipleSelection:[],
        direction: 'rtl',
        form: {
          type:"add",
          RcvName:"",
          RcvSn:"",
          OwnIP:"",
          MapIp:"",
          Port:"",
        },
        show:{
          OwnIP:"",
          MapIp:"",
          Port:"",
        },
      loading: false,
      formLabelWidth: '160px',
      timer: null,
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
      console.log(this.$qs)
      this.GetRcvList();
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
      GetRcvList(){
        var that = this;
        this.$axios({
          //method: 'GET',
          url:"/testJson/GetRcvList.json",
          data:{
            GetRcvList: "1"
          },
          Api:"GetRcvList",
          AppId:"web",
          //UserId:that.user.id
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
          console.log("that.rcvListData")
          console.log(that.rcvListData)
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      handleSelectionChange(val) {
        console.log("handleSelectionChange")
        console.log(val);
        this.multipleSelection = val;
      },
      showAddForm(){
        this.form.type = "add";
        this.show.OwnIP = false;
        this.show.MapIp = false;
        this.show.Port = false;
        this.drawer = true;
      },
      editRcvRow(index, data){
        console.log("editRcvRow")
        this.form.type = "edit";
        this.show.OwnIP = true;
        this.show.MapIp = true;
        this.show.Port = true;
        this.drawer = true;
        var formData = data[index];
        this.form.RcvSn = formData["RcvSn"];
        this.form.RcvName = formData["RcvName"];
        this.form.OwnIP = formData["OwnIP"];
        this.form.MapIp = formData["MapIp"];
        this.form.Port = formData["Port"];
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
        var delSns = this.multipleSelection.map(item => item.RcvSn);
        this.$axios({
          url:"/testJson/DelRcv.json",
          data:{
            DelRcv: "1",
            RcvSns:delSns, 
          },
          Api:"DelRcv",
          AppId:"web",
          //UserId:that.user.id
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
      handleClose(done) {
        var that = this;
        if (this.loading) {
          return;
        }
        this.$confirm('确定要提交表单吗？')
        .then(_ => {
          if(this.form.type == "add"){
            this.AddRcv(function(){
              that.GetRcvList();
              that.loading = true;
              that.timer = setTimeout(() => {
                done();
                // 动画关闭需要一定的时间
                setTimeout(() => {
                  that.loading = false;
                }, 400);
              }, 2000);
            });
          }else{
            this.EditRcv(function(){
              that.GetRcvList();
              that.loading = true;
              that.timer = setTimeout(() => {
                done();
                // 动画关闭需要一定的时间
                setTimeout(() => {
                  that.loading = false;
                }, 400);
              }, 2000);
            });
          }          
        })
        .catch(_ => {});
      },
      cancelForm() {
        this.loading = false;
        this.drawer = false;
        clearTimeout(this.timer);
      },
      AddRcv(cb){
        console.log("AddRcv")
        var that = this;
        this.$axios({
          url:"/testJson/AddRcv.json",
          data:{
            AddRcv: "1",
            RcvSn:that.form.RcvSn,              //10位序列号
            RcvName:that.form.RcvName,           //接收机名字
          },
          Api:"AddRcv",
          AppId:"web",
          //UserId:that.user.id
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
      EditRcv(cb){
        console.log("EditRcv")
        var that = this;
        this.$axios({
          url:"/testJson/EditRcv.json",
          data:{
            EditRcv: "1",
            RcvSn:that.form.RcvSn,             //10位序列号
            RcvName:that.form.RcvName,          //接收机名字
            OwnIP:that.form.OwnIP,             //内网IP
            MapIp:that.form.MapIp,             //公网IP
            Port:that.form.Port,               //端口
          },
          Api:"EditRcv",
          AppId:"web",
          //UserId:that.user.id
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
    }
  }
</script>

<style scoped>

</style>