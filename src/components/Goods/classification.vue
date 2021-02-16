<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="addGoods">添加分类</el-button>
            </el-col>
        </el-row>
        <tree-table :data = "cfList" :columns="columns" show-index index-text="#"
        :selection-type="false"
        :expand-type="false">
          <template slot="isok" slot-scope="scope">
            <i v-if="scope.row.cat_deleted === false" style="color : lightgreen" class="el-icon-success"></i>
            <i v-else style="color : red" class="el-icon-error"></i>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag size="mini" v-else-if="scope.row.cat_level == 1" type="success">二级</el-tag>
            <el-tag size="mini" v-else type="warning">三级</el-tag>
          </template>  
          <template slot="opt" slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)" > 编辑</el-button>
            <el-button type="danger"  size="mini" icon="el-icon-delete" @click="deleteCfInfo(scope.row)" > 删除</el-button>
          </template>
        </tree-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="cfInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="cfInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>    
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="30%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" 
        label-width="80px" 
        ref="addFormRef" >
          <!-- 有验证规则才需要prop -->
        <el-form-item label="分类名称"  prop="cat_name"> 
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" > 
          <el-cascader
             v-model="selectedKeys"
             :options="parentList"
             :props="{ expandTrigger: 'hover',
                       value:'cat_id',
                       label:'cat_name',
                       children:'children'}"
             @change="parentCateChange" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="30%">
      <el-form :model="editForm"  label-width="80px">
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="editForm.cat_name"></el-input>
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
  data(){
    return{
      addDialogVisible : false,
      editDialogVisible:false,
      cfInfo:{
        query:'',
        pagenum: 1,
        pagesize: 5
      },
      cfList:[],
      parentList:[],
      selectedKeys:[],
      total:0,
      columns:[{
        label:'分类名称',
        prop:"cat_name",
      },
      {
        label:'是否有效',
        type:'template',
        template:'isok'
      },
      {
        label:'排序',
        type:'template',
        template:'order'
      },
      {
        label:'操作',
        type:'template',
        template:'opt'
      }],
      editForm:{},
      addForm:{
        //将要添加的分类名称
        cat_name:'',
        //父级分类id，默认一级分类
        cat_pid:0,
        //分类的登记，默认添加一级分类
        cat_level:0
      },
      addFormRules:{
        cat_name:[          
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],

      }      
    }
  },
  created(){
    this.getCfList()
  },
  methods:{
    async getCfList(){
      const {data:res} = await this.$http.get('categories',{params:this.cfInfo})
      console.log(res);
      if(res.meta.status !==200){
          this.$message.error('获取分类列表失败')
      }else{
          this.cfList = res.data.result
          this.total = res.data.total
      }
    },
    //点击编辑
    async showEditDialog(goods){
      // console.log(scope);
      const {data:res} = await this.$http.get('categories/'+goods.cat_id)
      // console.log(res)
      console.log(goods.cat_id);
      if(res.meta.status !== 200){
        return this.$message.error('获取id失败')
      }else{
        this.$message.success('获取id成功')
        this.editForm = res.data
        this.editDialogVisible = true
      }  
    },
    //提交编辑
    async submitEdit(){
      const {data:res} = await this.$http.put(`categories/${this.editForm.cat_id}`,{cat_name:this.editForm.cat_name})
      if(res.meta.status !==200){
        this.$message.error('修改失败')
      }else{
        this.$message.success('修改成功')
        this.getCfList()
        this.editDialogVisible = false
      }
    },
    //点击删除按钮
    async deleteCfInfo(goods){
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
        const {data:res} = await this.$http.delete(`categories/${goods.cat_id}`)
        // console.log(cate.cat_id);        
        if(res.meta.status !==200){
          return this.$message.error('删除失败')
        }else{
          this.$message.success('删除成功')
          this.getCfList()
        }
      }
    },
    //分页
    handleSizeChange(newSize) {
      this.cfInfo.pagesize = newSize;
      this.getCfList();
    },
    handleCurrentChange(newPage) {
      this.cfInfo.pagenum = newPage;
      this.getCfList();
    },
    //添加分类,需要获取父级分类 因此创建一个方法，然后来这儿调用
    addGoods(){
      this.getParentList()
      this.addDialogVisible = true
      
    },
    async getParentList(){
      const {data:res} = await this.$http.get('categories',{params: { type: 2 }})
      // console.log(res);
      if(res.meta.status !==200){
        return this.$message.error('获取父级id失败')
      }else{
        this.$message.success('获取父级分类成功')
        this.parentList = res.data
      }
    },
    //选择项发生变化出发这个函数
    parentCateChange(){
      console.log(this.selectedKeys)
      //最后一项为父分类id
      if(this.selectedKeys.length > 0){
        //让cat.id的值为数组最后一项 
        this.addForm.cat_pid =  this.selectedKeys[this.selectedKeys.length-1] 
        this.addForm.cat_level = this.selectedKeys.length  
        return
      }else{
        this.addForm.cat_pid =  0
        this.addForm.cat_level = 0
      }
    },
    //点击确定添加
    submitAdd(){
      this.$refs.addFormRef.validate(async valide => {
        if(!valide){
          return
        }else{
           const {data:res} = await this.$http.post('categories',this.addForm)
           if(res.meta.status!==201){
             return this.$message.error('添加失败')
           }else{
             this.$message.success('添加成功')
             this.getCfList()
             this.addDialogVisible = false
           }
        }
        
      })
    },
    //关闭对话框清空对话框内容
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
      this.addForm.cat_pid =  0
      this.addForm.cat_level = 0
      this.selectedKeys = []
    }
  } 
}
</script>

<style lang="less" scoped>
.el-card{
  margin-top: 20px;
}
.el-row{
  margin-top: 20px;
}


</style>