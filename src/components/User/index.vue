<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card >
      <el-row :gutter="40">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.enter.native="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"  @click="dialogVisible = true">
            添加用户
          </el-button>
        </el-col> 
      </el-row>
      <el-table :data="userList" border stripe>
       
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" min-width="20%" >
          <template slot-scope="scope">            
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope" >
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"> 编辑</el-button>
            <el-button type="danger"  size="mini" icon="el-icon-delete" @click="deleteUserInfo(scope.row.id)"> 删除</el-button>
            <el-button type="warning"  size="mini" icon="el-icon-setting" @click="setRoleDialog(scope.row)" > 分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%"
      @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form> 
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名"  prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form> 
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="40%"
      @close="setRoleClose">
      <div>
        <p>当前用户：{{role.username}}</p>
        <p>当前角色：{{role.role_name}} </p>
        <p>分配新的角色:
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    var checkMobile = (rule,value,callback) =>{
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if(regMobile.test(value)){
        return callback()
      }
      callback(new Error('请输入正确的手机号'))
    }
    var checkEmail = (rule,value,callback) =>{
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if(regEmail.test(value)){
        return callback()
      } 
      callback(new Error('请输出合法的邮箱'))
    }
    return{
      queryInfo:{
        query:'',
        pagenum: 1,
        pagesize: 5
      },
      //需要被分配权限的角色的用户信息
      role:{},
      userList:[],
      rolesList:[],
      //已选中的角色id值
      selectedRoleId:{},
      total:0,
      dialogVisible: false,
      editDialogVisible:false,
      setRoleDialogVisible:false,
      addForm:{
        username:'',
        password:'',
        mobile:'',
        email:''
      },
      editForm:{},
      addFormRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator:checkMobile , trigger:'blur'}
          
        ],
        email:[
          {  required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail , trigger :'blur'}
          
        ]
      },
       editFormRules:{
        mobile:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator:checkMobile , trigger:'blur'}
          
        ],
        email:[
          {  required: true, message: '请输入邮箱', trigger: 'blur' },
          {validator:checkEmail , trigger :'blur'}
          
        ]
      }

    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data:res} = await this.$http.get('users',{params:this.queryInfo})    
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      
      this.userList = res.data.users
      this.total = res.data.total     
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newNum){
      this.queryInfo.pagenum = newNum 
      this.getUserList()
    },
    async userStateChange(userinfo){
      // console.log(userinfo)
      const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新用户状态成功')
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    addUsers(){
      this.$refs.addFormRef.validate(async valide =>{
        
        if(!valide) return
        const {data:res} =await this.$http.post('users',this.addForm)
        
        if(res.meta.status != 201){
          this.$message.error('添加用户失败')
        }
          this.$message.success('添加用户成功')
          this.dialogVisible = false
          this.getUserList()    
      })
    },
    async showEditDialog(id){
      
      const {data:res} = await this.$http.get('users/'+id)
      
      if(res.meta.status !== 200){
        this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async valide =>{
        
        if(valide){
          const {data:res} = await this.$http.put('users/'+this.editForm.id,
          {email:this.editForm.email,
          mobile:this.editForm.mobile})
          if(res.meta.status == 200){
            this.$message.success('修改用户信息成功')
            
          }else{
            this.$message.error('修改用户信息失败')
          }
        }else{
          return
        }
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    async deleteUserInfo(id){
      const res = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err => {
          return err
          }
        )
        console.log(res)
        if(res !== 'confirm'){
          this.$message.info('您已取消')
        }else{
          const {data:res} = await this.$http.delete('users/'+id)
          if(res.meta.status !==200){
            this.$message.error('删除失败')
          }else{
            this.$message.success('删除成功')
            this.getUserList()
          }
        }
    },
    //分配角色对话框
    async setRoleDialog(role){
      this.role = role
      const {data:res} = await this.$http.get('roles')
      // console.log(res);
      if(res.meta.status == 200){
            this.$message.success('获取角色列表成功')
            this.selectedRoleId = role.role_name
            this.rolesList = res.data

          }else{
            this.$message.error('获取角色列表失败')
          }
      this.setRoleDialogVisible= true
    },
    //分配角色之后确定按钮
    async setRoleSubmit(){
      if(this.selectedRoleId){
        const {data:res} = await this.$http.put(`users/${this.role.id}/role`,{rid:this.selectedRoleId})
        // console.log(res)
        if(res.meta.status ==200){
          this.$message.success('设置角色成功')
          this.setRoleDialogVisible = false
          this.getUserList()
        }else{
          return this.$message.error('设置角色失败')
        }
        
      }else{
        return this.$message.error('请选择角色')
      }
      
    },
    setRoleClose(){
      this.selectedRoleId =''
      this.role = {}
    }
      
    
    // setRoleDialogClosed(){
    //   this.selectedRoleId = role.role_name
    //   // this.role = {}
    // }

  }
  

}
</script>

<style>
.el-breadcrumb{
  margin-bottom: 15px;
}
.el-row{
  margin-bottom: 20px;
}
.el-pagination{
  margin-top: 20px;
  text-align: center;
}
</style>