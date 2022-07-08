<template>
  <div id="userPage" style="height:100%">
    <div class="tableToolbar" v-if="user.level == 1">
      <el-button type="primary" size="mini" @click="showAddForm">添加</el-button>
      <el-button type="primary" size="mini" @click="clickDelBtn">删除</el-button>
      <el-input v-model="filter" autocomplete="off" size="mini" placeholder="请输入内容"
    prefix-icon="el-icon-search" style="width:200px;float:right" @input="filterUserList"></el-input>
    </div>
    <el-table ref="multipleTable" :data="userListDataShow" :row-key="getRowKeys" stripe fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :height="tableHeight">
      <el-table-column type="selection" :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="UserID" label="用户ID" sortable>
      </el-table-column>
      <el-table-column prop="UserName" label="用户名" sortable>
      </el-table-column>
      <el-table-column label="状态" sortable>
      	<template slot-scope="scope">
          <span :class="scope.row.onlineStyle">{{ scope.row.online }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用" sortable>
      	<template slot-scope="scope">
          <span>{{ scope.row.valid }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userLevel" label="用户等级" sortable>
      </el-table-column>
      <el-table-column prop="LoginTime" label="登录时间" sortable>
      </el-table-column>
      <el-table-column prop="CreateTime" label="添加时间" sortable>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="editUserRow(scope.$index, userListDataShow)"
            type="text"
            size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="dialogDelVisible"
      width="30%">
      <span>确定删除选中的用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="DelUser" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="setUserTitle"
      :visible.sync="dialogSetUserShow"
      width="40%">
      <el-form :model="form" class="drawerForm" :rules="rules" ref="form">
        <el-form-item label="用户ID" :label-width="formLabelWidth" prop="UserID">
          <el-input v-model="form.UserID" autocomplete="off" size="mini" :disabled="dis.UserID" placeholder="1-20位字母、数字、_、+、-、@、()"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="UserName">
          <el-input v-model="form.UserName" autocomplete="off" size="mini" placeholder="1-20位汉字、字母、数字、_、+、-、@、()"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth" prop="UserPwd" v-if="show.UserPwd">
          <el-input v-model="form.UserPwd" autocomplete="off" size="mini" placeholder="6-16位字母数字，至少包含一个字母一个数字" ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth" prop="UserPwdEdit" v-if="show.UserPwdEdit">
          <el-input v-model="form.UserPwdEdit" autocomplete="off" size="mini" placeholder="6-16位字母数字，至少包含一个字母一个数字" ></el-input>
        </el-form-item>
        <el-form-item label="用户等级" :label-width="formLabelWidth" prop="UserLevel" v-if="user.level == 1">
          <el-select class="input_dark" v-model="form.UserLevel" size="mini">
            <el-option
              v-for="item in USER_GROUP_OPTION"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用" :label-width="formLabelWidth" v-if="show.Valid" prop="Valid" style="text-align:left">
          <el-checkbox v-model="form.Valid"></el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeSetUser('form')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitUser('form')">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
  import md5 from 'MD5';
  import { mapState,mapMutations } from 'vuex';
  import { SET_CHART_TIMER, SET_CHART_CARD_VIEW } from '../../store/mutation-types';
  export default {
    name: "UserMan",
    data(){
      var validateId = (rule, value, callback) => {
        if(!this.$common.isValidUserID(value)){
          callback(new Error('请输入合法ID'));
        }
        callback();
      };
      var validateName = (rule, value, callback) => {
        if(!this.$common.isValidName20(value)){
          callback(new Error('请输入合法名称'));
        }
        callback();
      };
      var validatePwd = (rule, value, callback) => {
        if(!this.$common.pwdCheckType(value,true)){
          callback(new Error('请输入合法密码'));
        }
        callback();
      };
      var validatePwdEdit = (rule, value, callback) => {
        if(!this.$common.pwdCheckType(value,false)){
          callback(new Error('请输入合法密码'));
        }
        callback();
      };
      return{
        contentHeight:"",
        tableHeight:"600px",
        userListData: [],
        userListDataShow:[],
		    refreshUserInterval:"",
        USER_GROUP_OPTION:[],
        multipleSelection:"",
        dialogDelVisible:false,
        setUserTitle:"添加用户",
        dialogSetUserShow:false,
        form:{
          type:"",
          UserID:"",
          UserName:"",
          UserPwd:"",
          UserPwdEdit:"",
          UserLevel:"",
          Valid:"",
        },
        dis:{
          UserID:"",
        },
        show:{
          Valid:"",
          UserPwd:"",
          UserPwdEdit:"",
        },
        rules: {
          UserID: [
            { required: true, message: '请输入用户Id', trigger: 'blur' },
            { validator: validateId, trigger: 'blur' }
          ],
          UserName: [
            { required: true, message: '请输入用户名称', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          UserPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePwd, trigger: 'blur' }
          ],
          UserPwdEdit: [
            { validator: validatePwdEdit, trigger: 'blur' }
          ],
        },
        formLabelWidth: '160px',
        filter:"",
      }
    },
    computed: {
      ...mapState(['user'])
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
      this.contentHeight = document.getElementById("userPage").offsetHeight;
      this.GetUserLevelOption(function(){
        that.GetUserList();  
        if(that.refreshUserInterval){
          clearInterval(that.refreshUserInterval)
        }else{
          that.refreshUserInterval = setInterval(function(){
            if(that.$route.fullPath == "/userMan"){
              that.GetUserList();  
            }else{
              clearInterval(that.refreshUserInterval)
            }
          },5000)  
        }  
      })
    },
    created(){
      this.contentHeight = document.getElementById("userPage").offsetHeight;
      this.tableHeight = (this.contentHeight-50)+"px";  
    },
    activated(){  //生命周期-缓存页面激活
    },
    deactivated(){   //生命周期-缓存页面失活
    },
    methods:{
      // ...mapMutations({
          
      // }),
      filterUserList(){
        var that = this;
        this.userListDataShow = this.userListData.filter((item) => {return item.UserID.indexOf(that.filter) != -1 || item.UserName.indexOf(that.filter) != -1})
      },
      getRowKeys(row){
        return row.UserID;
      },
      GetUserLevelOption(cb){
        var that = this;
        this.$axios({
          url:"/protocol/user.php",//"/testJson/GetRcvList.json",
          data:{
            GetUserLevelOption: "1"
          },
          Api:"GetUserLevelOption",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            var data= res.data;
            that.USER_GROUP_OPTION = data.map((item) => {
              return {"value":item.value, "label":item.text}
            })
            if(typeof(cb) == 'function'){
              cb();
            }
          }else{
            that.$message.error(res.msg);
          }
          
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      GetUserList(){
		    var that = this;
        this.$axios({
          url:"/protocol/user.php",
          data:{ GetUserList: "1" },
          Api:"GetUserList",
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
              if(data[i]["Valid"] == 1){
                data[i]["valid"] = "启用";
              }else{
                data[i]["valid"] = "禁用";
              }
              for(var j=0; j<that.USER_GROUP_OPTION.length; j++){
                if(that.USER_GROUP_OPTION[j]["value"] == data[i]["UserLevel"]){
                  data[i]["userLevel"] = that.USER_GROUP_OPTION[j]["label"];
                  break;
                }
              }
            }
            that.userListData = data;
            that.filterUserList()
            //that.userListDataShow = data;
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      clickDelBtn(){
        if(this.multipleSelection.length == 0){
           this.$alert('请选择要删除的用户', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            }
          });
        }else{
          this.dialogDelVisible = true;
        }
      },
      DelUser(){
        var that = this;
        this.dialogDelVisible = false;
        var delIds = this.multipleSelection.map(item => {return item.UserID});
        this.$axios({
          url:"/protocol/user.php",
          data:{
            DelUser:1,
            DelUserID:delIds, 
          },
          Api:"DelUser",
          AppId:"web",
        })
        .then(function (response) {
          let res = response.data;
          if(res.code == "0000"){
            that.GetUserList();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      showAddForm(){
        this.setUserTitle="添加用户";
        this.form.type = "add";
        this.form.UserID = "";
        this.dis.UserID = false;
        this.form.UserName = "";
        this.form.UserPwd = "";
        this.form.UserLevel = "1";
        this.show.UserPwd = true;
        this.show.UserPwdEdit = false;
        this.show.Valid = false;
        this.dialogSetUserShow = true;
      },
      editUserRow(index, data){
        this.setUserTitle="编辑用户";
        var formData = data[index];
        this.form.type = "edit";
        this.form.UserID = formData.UserID;
        this.dis.UserID = true;
        this.form.UserName = formData.UserName;
        this.form.UserPwd = formData.UserPwd;
        this.form.UserLevel = formData.UserLevel;
        this.form.Valid = formData.Valid==1?true:false;
        this.show.UserPwd = false;
        this.show.UserPwdEdit = true;
        this.show.Valid = true;
        this.dialogSetUserShow = true;
      },
      submitUser(formName){
        var that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.setUser(function(){
              that.GetUserList();
              that.dialogSetUserShow = false;
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      setUser(cb){
        var that = this;
        var data = {};
        data.UserID = this.form.UserID;
        data.UserName = this.form.UserName;
        //data.UserPwd = this.$common.encrypPwd(md5(this.form.UserPwd));
        data.UserLevel = this.form.UserLevel;
        if(this.form.type=="add"){
          data.AddUser = "1"
          data.UserPwd = this.$common.encrypPwd(md5(this.form.UserPwd));
        }else{
          data.EditUser = "1";
          data.UserPwd = this.form.UserPwdEdit?this.$common.encrypPwd(md5(this.form.UserPwdEdit)):"";
          data.Valid = this.form.Valid?1:0;
        }
        this.$axios({
          url:"protocol/user.php",
          data:data,
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      closeSetUser(formName){
        this.dialogSetUserShow = false;
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style scoped>

</style>