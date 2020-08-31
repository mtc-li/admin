<template>
    <el-container class="home">
        <el-header>
            <div class="logo"></div>
            <div class="logout">
               <span>欢迎光临</span>
               <a href="javascript:;" @click="open">退出</a>
            </div>
            <div class="title">
                 <h3>电商后台管理系统</h3>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
                 <el-menu
                    background
                    :default-active="$route.path.slice(1).split('-')[0]"
                    class="el-menu-vertical-demo"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b" unique-opened router>
                    <el-submenu v-for="menu in menuList" :key="menu.id" :index="menu.path">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{menu.authName}}</span>
                        </template>
                            <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.path">
                               <i class="el-icon-menu"></i>
                               <span slot="title">{{item.authName}}</span>
                            </el-menu-item>
                    </el-submenu>
                 
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
   
</template>

<script>
export default {
    data(){
        return {
            menuList:[]
        }
    },
    methods: {
      async open() {
        try {
        await this.$confirm('你去顶要退出吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          this.$message.success('退出成功')
          localStorage.removeItem('token')
          this.$router.push('/login')    
        }catch(e) {
          this.$message.info('取消退出')
        }
      }
    },
    async created(){
        let res=await this.axios.get(`menus`)
        let{meta:{status},data}=res.data
        if(status===200){
            this.menuList=data
        }
    }
  }
</script>
</script>

<style scoped>
    .home {
        height: 100%;
    }
    .el-header {
        height: 60px;
        background-color: rgba(122, 43, 92, 0.466);
        text-align: center;
        line-height: 60px;
        
    }
    .logo {
        float:left;
        width: 180px;
        height: 60px;
        background:url("../assets/logo.png")no-repeat center center;
        background-size:contain;
    }
    .logout {
        float:right;
        font-weight: 700;
    
    }
    a {
        color:#f60;
    }
    .title {
        color:#fff;
        font-size: 24px;
    }
    .el-aside {
        width: 200px;
        background-color: rgba(53, 128, 106, 0.431);
    }
    .el-submenu {
        width: 200px;
    }
    .el-main {
        background-color: rgb(133, 141, 115);
    }
</style>