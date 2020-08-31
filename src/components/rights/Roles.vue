<template>
    <div class="role">
         <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
         <el-button type="success" plain @click="showAddDialog">添加角色</el-button>

        <el-table :data="roleList" style="width:100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row>
                        <span v-if="scope.row.children.length===0">暂无数据</span>
                    </el-row>
                    <el-row class="level1" v-for="level1 in scope.row.children" :key="level1.id">
                        <el-col :span="4">
                            <el-tag closable  @close="delChildren(scope.row,level1.id)">{{level1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row class="level2"  v-for="level2 in level1.children" :key="level2.id">
                                <el-col :span="4">
                                    <el-tag @close="delChildren(scope.row,level2.id)" closable type="success">{{level2.authName}}</el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag @close="delChildren(scope.row,level3.id)" class="level3" closable type="danger" v-for="level3 in level2.children" :key="level3.id">
                                        {{level3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="roleName" label="角色名称"></el-table-column>
            <el-table-column prop="roleDesc" label="描述"></el-table-column>
            <el-table-column  label="操作">
                <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" plain size="small" @click="showEditDialog(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delRole(scope.row)"></el-button>
                <el-button type="success" icon="el-icon-check" plain size="small" @click="showAssignDialog(scope.row)">分配权限</el-button>
                 </template>
            </el-table-column>
        </el-table>

         <!--添加角色 对话框-->
         <el-dialog
            title="添加角色"
            :visible.sync="addDialogVisible"
            width="40%">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" status-icon>
                <el-form-item label="账号" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
               
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!--修改用户对话框-->
         <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="40%">
            <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" status-icon>
                <el-form-item label="账号" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>

        <!--分配权限 对话框-->
         <el-dialog
            title="分配权限"
            :visible.sync="fpDialogVisible"
            width="40%" @closed="clearRight">
                <el-tree
                    :data="rightList"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps">
                </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="fpDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="assignRight">分配</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            roleList:[],
            addDialogVisible:false,
            addForm:{
                roleName:'',
                roleDesc:''
            },
            rules:{
                roleName:{ required: true, message: '请输入角色名称', trigger: 'blur'},
                roleDesc:{ required: true, message: '请输入描述内容', trigger: 'blur'}
            },
            editDialogVisible:false,
            editForm:{
                roleName:'',
                roleDesc:'',
                id:''
            },
            fpDialogVisible:false,
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            rightList:[],
            roleId:''
        }
    },
    methods:{
        async getRoleList(){
            let res=await this.axios.get(`roles`)
            let{data,meta:{status}}=res.data
            if(status===200){
            this.roleList=data
            }
        },
        async delRole(row){
            try{
                await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                let res=await this.axios.delete(`roles/${row.id}`)
                let {meta:{status}}=res.data
                if(status===200){
                    this.$message.success('删除成功')
                    this.getRoleList()
                }else{
                    this.$message.error('删除失败')
                }
            }catch(e){
                this.$message.info('取消删除')
            } 
        },
        showAddDialog(){
            this.addDialogVisible=true
        },
        addRole(){
            this.$refs.addForm.validate(async valid=>{
                if(valid){
                    let res=await this.axios.post(`roles`,this.addForm)
                    let{meta:{status}}=res.data
                    if(status===201){
                        this.$message.success('添加成功')
                        this.addDialogVisible=false
                        this.$refs.addForm.resetFields()
                        this.getRoleList()
                    }else {
                        this.$message.error('添加失败')
                    }
                }else{
                    return false
                }
            })
            
        },
        showEditDialog(row){
            this.editDialogVisible=true
            this.editForm.roleName=row.roleName
            this.editForm.roleDesc=row.roleDesc
            this.editForm.id=row.id
        },
        editRole(row){
            this.$refs.addForm.validate(async valid=>{
                 if(valid){
                    let res=await this.axios.put(`roles/${this.editForm.id}`,this.editForm)
                    let{meta:{status}}=res.data
                    if(status===200){
                        this.$message.success('修改成功')
                        this.editDialogVisible=false
                        this.$refs.editForm.resetFields()
                        this.getRoleList()
                    }else {
                        this.$message.error('修改失败')
                    }
                }else{
                    return false
                } 
            })    
        },
        async delChildren(row,rightsId){
            let res=await this.axios.delete(`roles/${row.id}/rights/${rightsId}`)
            let{meta:{status},data}=res.data
            if(status===200){
                this.$message.success('删除成功')
                row.children=data
            }else {
                this.$message.error('删除失败')
            }

        },
        //分配权限
        async showAssignDialog(row){
            this.fpDialogVisible=true
            this.roleId=row.id
            let res=await this.axios.get(`rights/tree`)
            let{data,meta:{status}}=res.data
            if(status===200){
                this.rightList=data
                console.log(data);
            }
            let temp=[]
            row.children.forEach(l1=>{
                l1.children.forEach(l2=>{
                    l2.children.forEach(l3=>{
                        temp.push(l3.id)
                    })
                })
            })
            this.$refs.tree.setCheckedKeys(temp)
        },
        clearRight(){
            this.$refs.tree.setCheckedKeys([])
        },
        async assignRight(){
            console.log(this.roleId);
            let keys= this.$refs.tree.getCheckedKeys()
            let halfkeys=this.$refs.tree.getHalfCheckedKeys()
            let rids=keys.concat(halfkeys).join()
            let res=await this.axios.post(`roles/${this.roleId}/rights`,{
                rids
            })
            let{meta:{status}}=res.data
            if(status===200){
                 this.fpDialogVisible=false
                 this.$message.success('分配成功')
                 this.getRoleList()
            }else {
                this.$message.error('分配失败')
            }
        }

    },
    created(){
        this.getRoleList()
    }
}
</script>

<style scoped>
    .level1 {
        margin-bottom:0;
    }
    .level2 {
        margin-bottom:5px;
    }
    .level3 {
        margin-right:5px;
    }
</style>