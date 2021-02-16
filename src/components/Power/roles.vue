<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        <el-table :data="rolesList" border>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row class="bdbottom" v-for="item1 in scope.row.children" :key="item1.id">
                <el-col :span="5">
                  <el-tag>
                    {{item1.authName}}
                  </el-tag>
                </el-col>
                <el-col :span="19">
                  <el-row class="bdbottom" v-for="item2 in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag>
                        {{item2.authName}}
                      </el-tag>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="item3 in item2.children" :key="item3.id" closable @close="delRights(scope.row,item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>              
              </el-row>       
            </template>
          </el-table-column>
          <el-table-column label="#" type="index" ></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope"  >
            <el-button type="primary" size="mini" icon="el-icon-edit"   @click="showEditDialog(scope.row.id)"> 编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"  @click="deleteUserInfo(scope.row.id)"> 删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetDialog(scope.row)">分配权限</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog 
        title="添加角色"
        width="30%"
        :visible.sync="addDialogVisible" >
        <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改角色"
        width="30%"
        :visible.sync="editDialogVisible"
         @close="addDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName" ></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input  v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
        </span>  
      </el-dialog>
      <!-- :default-checked-keys="defKeys" 默认勾选的节点的id数组 -->
      <el-dialog
        title="分配权限"
        :visible.sync="showSetDialogVisible"
        width="40%"
        @close="setDialogClose">
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-expanded-keys="[2, 3]"
         
          :default-checked-keys="defKeys" 
          :props="treeProps"
          ref="treeRef">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showSetDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      rolesList:[],
      rightsList:[],
      roleId:'',//this.$http.post(`roles/:roleId/rights`,{rids:idStr}) ，this.roleId = role.id 供这两段代码使用
      //树形控件要展示的内容
      treeProps:{
        label:'authName',
        children:'children'
      },
      //默认选择的节点id值数组
      defKeys:[],
      addDialogVisible:false,
      editDialogVisible:false,
      showSetDialogVisible:false,
      addForm:{
        roleName:'',
        roleDesc:''
      },
      editForm:{},
      addFormRules:{
        roleName:[
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      editFormRules:{
        roleName:[
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      // console.log(res)
      if(res.meta.status == 200){
        this.$message.success('获取角色列表成功')
        this.rolesList = res.data
      }else{
        this.$message.error('获取角色列表失败')
      }
    },
    addRoles(){
      this.$refs.addFormRef.validate(async valide =>{
        // console.log(valide);
        if(!valide){
          return
        }else{
          const {data:res} = await this.$http.post('roles',this.addForm)
          // console.log(res);
          if(res.meta.status == 201){
            this.$message.success('添加用户成功')
            this.getRolesList()
            this.addDialogVisible = false
          }else{
            this.$message.error('添加用户失败')
          }
        }
      })
    },
   
    //展示编辑dialog
    async showEditDialog(id){
      // console.log(id)
      const {data:res} = await this.$http.get('roles/'+id)
      // console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error('查询失败')
      }else{
        this.editForm = res.data
      }
      this.editDialogVisible = true   
    },
    //编辑
    editRoles(){
       this.$refs.editFormRef.validate(async valide =>{ 
        if(valide){
          const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,
          {roleName:this.editForm.roleName,
          roleDesc:this.editForm.roleDesc})
          console.log(res);
          if(res.meta.status !== 200){
            this.$message.error('更改失败')
          }
        }else{
          return
        }
        this.editDialogVisible = false
        this.getRolesList()
       })
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //监听分配权限对话框的关闭事件
    setDialogClose(){
       this.defKeys = []
    },
    //删除
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
        // console.log(res)
        if(res !== 'confirm'){
          this.$message.info('您已取消')
        }else{
          const {data:res} = await this.$http.delete('roles/'+id)
          if(res.meta.status !==200){
            this.$message.error('删除失败')
          }else{
            this.$message.success('删除成功')
            this.getRolesList()
          }
        }
    },
    async delRights(role,rightId){
     const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
         if(confirmRes !== 'confirm'){
          return this.$message.info('您已取消')
        }else{
          const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if(res.meta.status !==200){
            this.$message.error('删除失败')
          }else{
            this.$message.success('删除成功')
            this.getRolesList()
          }
        }
    },
    async showSetDialog(role){
      //this.roleId = role.id 这段代码供分配权限时用到id时候使用（this.$http.post(`roles/:roleId/rights`,{rids:idStr})
      this.roleId = role.id
      const{data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !==200){
        return this.$message.error('获取权限树失败')
      }else{
        this.rightsList = res.data
        console.log(this.rightsList);
      }
      //递归过去三级节点的id
      this.getLeafKeys(role,this.defKeys)
      this.showSetDialogVisible = true
    },
  //通过递归的形式获取角色下三级权限id 并保存到defKeys数组中
    getLeafKeys(node,arr){
      console.log(node.id);
      //如果当前节点node不包含children 则代表是三级节点
      if(!node.children){
        //把三级节点的idpush出去给这个arr数组
        return arr.push(node.id)
      }else{
        //如果不是三级节点则需要递归 存到arr中
        node.children.forEach(item =>this.getLeafKeys(item,arr))
      }
    },
    //点击确定按钮 为角色分配权限
    async allotRights(){
      //在这数组中要拿到半选和全选的权限状态下的id 
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      console.log(keys);
      //此时拿到的keys是一个数组 要把他写成以逗号为间隔的字符串 接口要求
      const idStr = keys.join(',')
      //发送请求 此时的roleId需要在 一打开分配权限的时候 就把id保存到data中
      const{data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}) //:roleId用{$this.roleId}代替
      if(res.meta.status!==200){
        return this.$message.error('分配权限失败')
      }else{
        this.$message.success('分配权限成功')
        this.getRolesList()
        this.showSetDialogVisible = false
      }
    }
    
  }
  
  
  
}
</script>

<style>
.el-card{
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
.el-tag{
  margin-top: 10px;
}
.bdbottom{
  border-bottom: aqua 1px solid;
}
</style>