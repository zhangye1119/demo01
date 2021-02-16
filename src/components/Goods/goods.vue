<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input @clear="getGoodsList" clearable v-model="queryInfo.query" placeholder="请输入内容">
              <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button  style="margin-bottom:20px" type="primary"  @click="goAddpage">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name" ></el-table-column>
          <el-table-column label="商品价格" prop="goods_price"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
          <el-table-column label="创建时间" prop="add_time">
            <template slot-scope="scope">
              {{scope.row.add_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoodsInfo(scope.row.goods_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </el-card>
  </div>
</template>

<script>
export default {
  created(){
    this.getGoodsList()
  },
  data(){
    return{
      queryInfo:{
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      total:0,
      goodsList:[]
    }
  },
  methods:{
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
      if(res.meta.status !==200){
        return this.$message.error('获取商品列表失败')
      }else{
        this.$message.success('获取商品列表成功')
        this.goodsList = res.data.goods
        this.total = res.data.total
      }
    },
    //分页
    handleSizeChange(newSize){
      this.queryInfo.pagesize= newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getGoodsList()
    },
    //删除信息
    async deleteGoodsInfo(id){
       const confirmResult = await this.$confirm(
        "此操作将永久删除该商品信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除！");
      }else{
        const { data: res } = await this.$http.delete(`goods/${id}`)
        if (res.meta.status != 200) {
          return this.$message.error("删除商品信息失败！")
        }else{
          this.getGoodsList();
          this.$message({
            type: "success",
            message: "删除商品信息成功!"
          })
        }
      }
    },
    //添加商品
    goAddpage(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style>
.el-card{
  margin-top: 15px;
}
</style>