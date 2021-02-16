<template>
  <div class="login_container">
      <div class="login_box">
        <div class="avatar_box">
          <img src="@/assets/logo.png" alt="">
        </div>
        <el-form ref="loginFormRef" :rules="loginFormRules" class="bd" :model="loginForm" label-width="80px">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="loginForm.username" ></el-input> 
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input type="password"  v-model="loginForm.password" @keyup.enter.native="login"></el-input> 
            </el-form-item>
            <el-form-item label="" class="btns">
              <el-button type="primary"  @click="login">登录</el-button> 
              <el-button type="info" @click="resetLoginForm">重置</el-button> 
            </el-form-item>    
        </el-form>

      </div> 
  </div>
</template>

<script>
export default {
  data(){
    return{
      loginForm:{
        username:'',
        password:''
      },
      loginFormRules:{
        username:[
           { required: true, message: '请输入用户名', trigger: 'blur' },
           { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
           { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
      
    }
      
  },
  methods:{
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields();  
    },
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
        if(valid){
            const {data:res}=await this.$http.post('login',this.loginForm);
              if(res.meta.status == 200){
                this.$message.success('登陆成功');
                window.sessionStorage.setItem("api_token",res.data.token);
                this.$router.push("/home");    
              } 
              else{
                this.$message.error('登录失败');
              }     
        }
        else{
          return;
        }    
        
      });
    }
  }
  
}

 
</script>

<style lang="less" scoped>
.login_container{
  height: 100%;
  background-color: #2b4b6b;
}
.login_box{
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avatar_box{
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  }
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  
 
.btns{
  display: flex;
  justify-content: space-around;
  transform: translate(-10%); 
}
.bd{
  margin: 80px;
  transform: translate(-10%);
}


</style> 