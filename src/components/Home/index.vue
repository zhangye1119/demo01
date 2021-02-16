<template>
  <el-container class="home_container">
  <el-header>
    <div>
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="exit">退出登录</el-button>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu
     
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      unique-opened
      router
      >
      <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id"  >
        <template slot="title">
          <i :class="iconList[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" >
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <el-main>
        <router-view>
       </router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return{
       menuList:[],
       iconList:{
         '125':'iconfont icon-user',
         '103':'iconfont icon-manage',
         '101':'iconfont icon-shopping',
         '102':'iconfont icon-file',
         '145':'iconfont icon-reserve'
       }
    }
  },
  created(){
    this.getMenuList()
  },
  methods:{
    exit(){
      window.sessionStorage.clear();
      this.$router.push('/login');
      this.$message.success('退出成功')
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200)
      return this.$message.error(res.meta.msg)
      this.menuList = res.data  
    }
  }
  
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    margin-left: 30px;
  }
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
.el-menu{
  border-right: none;
}
.home_container{
  height: 100%;
  width: 100%;
}
@font-face {font-family: 'iconfont';
    src: url-loader('iconfont.eot'); /* IE9*/
    // src: url-loader('iconfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    // url-loader('iconfont.woff') format('woff'), /* chrome、firefox */
}
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    color: aqua;
}
</style>