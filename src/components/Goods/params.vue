<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
          <el-alert show-icon :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
          <el-form>
              <el-form-item label="选择商品分类:">
                  <el-cascader
                    v-model="selectedKeys"
                    :options="catList" 
                    :props="{ expandTrigger: 'hover',
                              value:'cat_id',
                              label:'cat_name',
                              children:'children'}"
                    @change="handleChange" clearable change-on-select>
                  </el-cascader>
              </el-form-item>
          </el-form>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane  label="动态参数" name="many">
              <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">添加参数</el-button>
              <!-- 动态参数表格 -->
              <el-table :data="manyData" border stripe>
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCatInfo(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane  label="静态属性" name="only">
              <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">添加属性</el-button>
              <el-table :data="onlyData" border stripe>
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                   <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCatInfo(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
      </el-card>
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addDialogVisible"
        width="40%"
        @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
    created(){
      this.getCatList()
    },
    data(){
        return{
          catList:[],
          //级联选择框绑定到的数组
          selectedKeys:[],
          activeName:'many',
          manyData:[],
          onlyData:[],
          addDialogVisible : false,
          editDialogVisible:false,
          addForm:{
            attr_name:''
          },
          editForm:{
            attr_name:''
          },
          addFormRules:{
            attr_name:[{
              required:'true',message:'请输入参数名称',trigger:'blur'
            }]
          },
          editFormRules:{
            attr_name:[{
              required:'true',message:'请输入参数名称',trigger:'blur'
            }]
          }
      }
    },
    methods:{
        async getCatList(){
            const {data:res} = await this.$http.get('categories')
            // console.log(res)
            if(res.meta.status !==200){
              this.$message.error('获取分类列表失败')
            }else{
              this.$message.success('获取分类列表成功')
              this.catList = res.data
            }
        },
        //选择项发生变化时候的方法
        //只能选中第三级
        handleChange(){
          this.getParamsData()
        },
        async getParamsData(){
          if(this.selectedKeys.length !==3){
            this.selectedKeys = []
            return
          }else{
            //根据所选分类id 和当前所处的面板获取对应的数据
            const {data:res} = await this.$http.get(`categories/${this.catId}/attributes`,{params:{sel:this.activeName}})
            if(res.meta.status !==200){
              return this.$message.error('获取参数失败')
            }else{
              this.$message.success('获取参数成功')
              if(this.activeName ==='many'){
                this.manyData = res.data
              }else{
                this.onlyData = res.data
              }
            }
          }
        },
        //切换动态/静态属性时候的点击事件
        handleClick(){
          this.getParamsData()
        },
        //添加对话框关闭事件
        addDialogClosed(){
          this.$refs.addFormRef.resetFields()
        },
        //点击确定提交
        submitAdd(){
          this.$refs.addFormRef.validate(async valide => {
            if(!valide){
              return
            }else{
              const {data:res} =await this.$http.post( `categories/${this.catId}/attributes`,
              {
                attr_name:this.addForm.attr_name,
                attr_sel :this.activeName
              })
              if(res.meta.status !==201){
                return this.$message.error("添加数据失败！")
              }else{
                this.$message.success("添加数据成功！")
                this.addDialogVisible = false
                this.getParamsData()
              }
            }
          })
        },
        //点击编辑
        async editDialog(id){
          const {data:res} = await this.$http.get(`categories/${this.catId}/attributes/${id}`,{params:{attr_sel:this.activeName}})
          if(res.meta.status !==200){
            return this.$message.error('获取参数列表失败')
          }else{
            this.$message.success('获取参数列表成功')
            this.editForm = res.data
            this.editDialogVisible = true
          }
        },
        //关闭编辑对话框事件
        editDialogClosed(){
          this.$refs.editFormRef.resetFields()
        },
        //修改后点击提交
        submitEdit(){
          this.$refs.editFormRef.validate(async valide =>{
            if(!valide){
              return
            }else{
              const {data:res} = await this.$http.put(`categories/${this.catId}/attributes/${this.editForm.attr_id}`,
              {
                attr_name: this.editForm.attr_name,
                attr_sel: this.activeName
              })
              if(res.meta.status !==200){
                return this.$message.error('修改失败')
              }else{
                this.$message.success('修改成功')
                this.editDialogVisible = false
                this.getParamsData()
              }
            }
          })
        },
        //删除信息
        async deleteCatInfo(id){
          const confirmResult = await this.$confirm(
            "此操作将永久删除该商品分类, 是否继续?",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).catch(err => err);
          if (confirmResult != "confirm") {
            return this.$message.info("已取消删除！")
          }else{
            const {data:res} = await this.$http.delete(`categories/${this.catId}/attributes/${id}`)
            if(res.meta.status !==200){
               return this.$message.error('删除失败')
            }else{
              this.$message.success('删除成功')
              this.getParamsData()
            }
          }
        }
        
    },
    computed:{
      //如果按钮需要被禁用 则返回true
      isBtnDisabled(){
        if(this.selectedKeys.length !==3){
          return true
        }
        return false
      },
      catId(){
        if(this.selectedKeys.length ===3){
          return this.selectedKeys[2]
        }else{
          return null
        }
      },
      titleText(){
        if(this.activeName ==='many'){
          return '动态参数'
        }else{
          return '静态属性'
        }
      }
    }

}
</script>

<style>
.el-card{
    margin-top: 20px;
}
.el-form-item{
    margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
.el-button{
  margin-top: 15px;
}
</style>