<template>
    <div class="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

         <el-input placeholder="请输入内容" v-model="query" class="input-with-select"> 
         <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="success" plain @click="showaddDialogVisible">添加用户</el-button>

        <el-table
            :data="userList"
            style="width: 100%">
            <el-table-column
                prop="username"
                label="姓名"
                width="200">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                width="200">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话"
                width="200">
            </el-table-column>
            <el-table-column
                prop="mg_state"
                label="用户状态"
                width="200">
               <template slot-scope="scope">
                  <el-switch
                      v-model="scope.row.mg_state"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="changeState(scope.row)">
                  </el-switch>
                </template>
      </el-table-column>
       <el-table-column
        label="操作">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" plain size="small" @click="showeditDialogVisible(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delUser(scope.row)"></el-button>
              <el-button type="success" icon="el-icon-check" plain size="small" @click="showAssignDialog(scope.row)">分配角色</el-button>
          </template>
      </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[2, 4, 6, 8]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
         </el-pagination>

         <!--添加用户对话框-->
         <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="40%">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

         <!--修改用户对话框-->
         <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="40%">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
                <el-form-item label="账号" prop="username">
                    <el-tag type="info">{{editForm.username}}</el-tag>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>

         <!--修改用户对话框-->
         <el-dialog
            title="分配角色"
            :visible.sync="assignDialogVisible"
            width="40%">
            <el-form :model="assignForm"  ref="assignForm" label-width="100px" status-icon>
                <el-form-item label="账号">
                    <el-tag type="info">{{assignForm.username}}</el-tag>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="assignForm.rid" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="assignDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="assignRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
      data() {
        return {
            query:'',
            current:1,
            pageSize:2,
            total:0,  
            userList: [],
            addDialogVisible:false,
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            rules:{
                username:[
                        { required: true, message: '用户名不能为空', trigger: 'change' },
                        { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
                ],
                password:[
                    { required: true, message: '密码不能为空', trigger: 'change' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change' }
                ],
                email:[
                    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'change' },
                ],
                mobile:[
                    {pattern:/^1[3-9]\d{9}$/,message:'请输入正确的手机号',trigger:'change'}
                ]
            },
            editDialogVisible:false,
            editForm:{},
            assignForm:{
                id:'',
                username:'',
                rid:'',
            },
            assignDialogVisible:false,
            options:[],
        }
      },
      methods:{
         async getUserList(){
            let res=await this.axios({
            url:'users',
            method:'get',
            params:{
                query:this.query,
                pagenum:this.current,
                pagesize:this.pageSize,
            }
            })
            let{meta:{status},data:{users,total}}=res.data
            if(status===200){
                this.userList=users
                this.total=total     
            }
          },
          handleSizeChange(val) {
            this.pageSize=val
            this.current=1
             this.getUserList()
          },
          handleCurrentChange(val) {
            this.current=val
            this.getUserList()
          },
          search(){
               this.current=1
               this.getUserList()
          },
         async changeState(row){
            let res=await this.axios({
                url:`users/${row.id}/state/${row.mg_state}`,
                method:'put',
            })
            let {meta:{status}}=res.data
            if(status===200){
                this.$message.success('修改状态成功了')
            
            }else {
                this.$message.error('修改状态失败了')
            }
            
          },
        async delUser(row){
           try {
            await this.$confirm('你确定要删除这个文件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
            let res=await this.axios.delete(`users/${row.id}`)
                    let{meta:{status}}=res.data
                    if(status===200){
                        this.$message.success('删除用户成功')
                        if(this.userList.length===1 && this.current>1) this.current--     
                        this.getUserList()
                    }else{
                        this.$message.danger('删除用户失败')
                    }
           }catch(e){
               this.$message.info('取消删除')
           }
     
          },
          showaddDialogVisible(){
              this.addDialogVisible=true
          },
          addUser(){
              this.$refs.addForm.validate(async valid=>{
                  if(valid){
                   let res=await this.axios.post(`users`,this.addForm) 
                    let{meta:{status}}=res.data
                    if(status===201){
                        this.$message.success('添加用户成功')
                        this.$refs.addForm.resetFields()
                        this.addDialogVisible=false
                        this.total++
                        this.current=Math.ceil(this.total/this.pageSize)
                        this.getUserList()
                    }else{
                        this.$message.error('添加用户失败')
                    }
                    
                  }else {
                      return false
                  }
              })
          },
          showeditDialogVisible(row){
              this.editDialogVisible=true
              this.editForm=row
          },
          editUser(){
              this.$refs.editForm.validate(async valid=>{
                  if(valid){
                    let res=await this.axios.put(`users/${this.editForm.id}`,{
                          email:this.editForm.email,
                          mobile:this.editForm.mobile
                      })
                    let{meta:{status}}=res.data
                    if(status===200){
                        this.$message.success('修改成功')
                        this.editDialogVisible=false
                        this.getUserList()
                    }else{
                        this.$message.error('修改失败')
                    }    
                  }else{
                      return false
                  }
              })
          },
        async showAssignDialog(user){
            this.assignDialogVisible=true
            this.assignForm.id=user.id
            this.assignForm.username=user.username
            let res=await this.axios.get(`users/${user.id}`)
            let{meta:{status},data}=res.data
            if(status===200){
                if(data.rid===-1){
                    this.assignForm.rid=''
                }else {
                    this.assignForm.rid=data.rid
                }
            }

            this.getRoleList()
         },
        async getRoleList(){
            let res=await this.axios.get(`roles`)
            let{meta:{status},data}=res.data
            if(status===200){
                this.options=data
            }
         },

         //分配用户角色
        async assignRole(){
            if(!this.assignForm.rid){
                this.$message.error('请选择一个角色')
                return
            }
            let res=await this.axios.put(`users/${this.assignForm.id}/role`,{
                rid:this.assignForm.rid
            })
            let{meta:{status}}=res.data
            if(status===200){
                this.assignDialogVisible=false
                this.$message.success('分配角色成功了')
                this.getUserList()
            }

        }

    },
      created() {
           this.getUserList()
      },
    }
</script>

<style scoped>
    .el-breadcrumb {
        height: 50px;
        line-height: 50px;
    }
    .input-with-select {
        width: 400px;
        margin-bottom: 10px;
    }
    .el-pagination {
        margin-top:20px;
    }
</style>