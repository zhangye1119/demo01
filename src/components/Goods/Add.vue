<template>
  <div>
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon :closable="false" title="添加商品信息"  center type="info"></el-alert>
      <el-steps
        align-center
        class="font14"
        :space="200"
        :active="activeIndex - 0"
        finish-status="success" >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        label-position="top"
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-tabs :tab-position="tabPosition"  v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" >
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catList" 
                :props="{ expandTrigger: 'hover',//options用来绑定数据源，v-model绑定的是： 级联选择框选择的内容会被保存到一个数组中  用v-model来绑定这个数组,也就是选择之后，及联选择框中的内容
                          value:'cat_id', //选中的谁的值
                          label:'cat_name', //看到的名称
                          //父子节点的嵌套名称
                          children:'children'  }"  
                @change="handleChange" clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :key="item.attr_id" v-for="item in onlyTableData" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :key="index" v-for="(cb,index) in item.attr_vals" :label="cb"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button @click="addnewgood" class="btnadd" type="primary">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="previewVisible"
      width="50%"
     >
      <img class="preImg" :src="prePath" alt=""> 
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default { 
  created(){
    this.getCatList()
  },
  data(){
    return{
      activeIndex:'0',
      tabPosition:'left',
      addForm:{
        goods_name:'',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat:[],
        pics:[],
        //商品介绍
        goods_introduce:'',
        //动态参数和静态属性
        attrs:[]
      },
      addFormrules:{
        goods_name:[
          {required: true, message: "请输入商品信息！", trigger: "blur"}
        ],
         goods_price: [
          { required: true, message: "请输入商品价格！", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量！", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量！", trigger: "blur" }
        ],
        goods_cat:[
          {required: true, message: "请选择商品分类！", trigger: "blur"}
        ]
      },
      catList:[],
      //获取到的商品参数数组
      manyTableData:[],
      //获取商品属性的数组
      onlyTableData:[],
      //上传图片需要的请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem('api_token')
      },
      //图片预览路径
      prePath:'',
      previewVisible : false
      
    }
  },
  methods:{
    async getCatList(){
      const { data: res } = await this.$http.get("categories")
      if (res.meta.status != 200) {
        return this.$message.error("获取商品分类数据失败！")
      }
        this.$message.success("获取商品分类数据成功！")
        this.catList = res.data
    },
    //当级联选择框发生变化的时候
    handleChange(){
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = [];
      }
      return
    },
    //组织切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
      return true
    },
    //切换tabs
    async tabClicked(){
      if (this.activeIndex == "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error("获取动态参数失败！")
        }
        console.log(res);
        this.$message.success("获取动态参数成功！")
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length ===0 ? [] 
            : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      }else if(this.activeIndex ==='2'){
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );
        if (res.meta.status != 200) {
          this.$message.error("获取静态属性失败！");
        }
        this.$message.success("获取静态属性成功！");
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(",");
        })
        this.onlyTableData = res.data;
      }
    },
    handlePreview(file){
      this.prePath = file.response.data.url
       this.previewVisible = true
    },
    handleRemove(file){
      //拿到要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      //如果这个路径等于addform.pic
      const i = this.addForm.pics.findIndex(x=>x.pic === filePath)
      this.addForm.pics.splice(i,1)
      console.log(this.addForm);
    },
    handleSuccess(res){
      const picsInfo = {pic:res.data.tmp_path}
      this.addForm.pics.push(picsInfo)
     
    },
    //添加商品
    addnewgood(){
      this.$refs.addFormRef.validate(async valide =>{
        if(!valide){
          return this.$message.error('请填写必要的表单项')
        }
        //处理goods_cat
        const form=_.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item =>{
          const newInfo = {
            attr_id : item.attr_id,
            attr_value : item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
          
          })
          //处理静态属性
          this.onlyTableData.forEach(item =>{
            const newInfo = {
              attr_id : item.attr_id,
              attr_value : item.attr_vals.join(' ')
            }
            this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.log(form);
        const{data:res}=await this.$http.post('goods',form)
        // console.log(res); 
        // if(res.meta.status!==201){
        //   return this.$message.error('添加商品失败')
        // }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
    
  }

}
</script>

<style>
.el-card{
  margin-top: 15px;
}
.el-tabs{
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 5px 0 0 ! important
}
.preImg{
  width: 100%;
}
.ql-editor{
  min-height: 300px;
}
</style>