<template>
    <div class="login">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <img src="../assets/avatar.jpg" alt="">
            <el-form-item label="账号"  prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
             <el-form-item label="密码"  prop="password">
                <el-input v-model="form.password" type="password" @keyup.enter.native="login"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="login">登录</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
      return {
        form: {
          username: '',
          password:''
        },
        rules:{
            username: [
            { required: true, message: '请输入活动名称', trigger: 'change' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      login(){
          this.$refs.form.validate(async valid=>{
              if(valid){
                 let res=await this.axios({
                      url:'login',
                      method:'post',
                      data:this.form
                  })
                if(res.data.meta.status===200){
                    localStorage.setItem('token',res.data.data.token)
                    this.$message.success('登录成功')
                        
                    this.$router.push('/home')
                }else {
                        this.$message.error('密码或者账户名错误');
                }
              }else {
                  return false;
              }
          })
      
      },
      resetForm(){
           this.$refs.form.resetFields();
      }
    }
  }
</script>

<style scoped>
    .login {
        background-color: pink;
        height:100%;
        overflow: hidden;
    }
    .el-form {
        width: 400px;
        margin:400px auto 0;
        background-color: #fff;
        border-radius:20px;
        padding:80px 50px 30px 30px;
        position: relative;
    }
    img {
        position:absolute;
        top:-70px;
        left:50%;
        transform: translateX(-50%);
        border-radius: 50%;
        border:10px solid #fff;
    }
    .el-button + .el-button {
        margin-left: 80px;
    }
</style>