<template>
    <div>
        <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
        <el-table :data="categoryList" style="width:100%"  v-loading="loading" element-loading-text="拼命加载中"  element-loading-spinner="el-icon-loading">
            <el-table-tree-column
                label="分类名称"
                prop="cat_name"
                tree-key="cat_id"
                level-key="cat_level"
                parent-key="cat_pid"
                child-key="children"
                :indent-size="20">
            </el-table-tree-column>
            <el-table-column prop="cat_deleted" label="是否删除">
                <template slot-scope="scope">
                    {{scope.row.cat_deleted?'是':"否"}}
                </template>
            </el-table-column>
            <el-table-column prop="cat_level" label="排序"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" plain size="small" ></el-button>
                    <el-button type="danger" icon="el-icon-delete" plain size="small" @click="delCategory(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

          <!--添加角色 对话框-->
         <el-dialog
            title="添加分类"
            :visible.sync="addDialogVisible"
            width="40%">
            <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" status-icon>
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" prop="cat_pid">
                      <el-cascader
                        v-model="addForm.cat_pid"
                        :options="options"
                        :props="props"
                        clearable>
                        </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCategory">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var ElTreeGrid = require('element-tree-grid')
export default {
    data(){
        return {
            categoryList:[],
            current:1,
            pageSize:10,
            total:0,
            addDialogVisible:false,
            addForm:{
                cat_name:'',
                cat_id:'',
                cat_pid:[]
            },
            rules:{
                cat_name: { required: true, message: '请输入活动名称', trigger: 'change' }
            },
            options:[],
            props:{
                checkStrictly:true,
                value:'cat_id',
                label:'cat_name'
            },
            loading:true
        }
    },
    methods:{
        //获取列表数据
        async getCategoryList(){
            let res=await this.axios.get(`categories`,{
                params:{
                    type:3,
                    pagenum:this.current,
                    pagesize:this.pageSize
                }
            })
            let{data:{result,total},meta:{status}}=res.data
            if(status===200){
                this.categoryList=result
                this.total=total
                setTimeout(()=>{
                    this.loading=false
                },500)
            }
        },
        handleSizeChange(val){
            this.loading=true
            this.pageSize=val
            this.current=1
            this.getCategoryList()
        },
        handleCurrentChange(val){
            this.loading=true
            this.current=val
            this.getCategoryList()
        },
        async delCategory(row){
           try {
            await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            let res=await this.axios.delete(`categories/${row.cat_id}`)
            let{meta:{status,msg}}=res.data
            if(status===200){
                this.$message.success('删除成功')
                this.getCategoryList()
            }else{
                this.$message.error(msg)
            }
           }catch(e){
               this.$message.info('取消删除')
           }
        },
        async showAddDialog(){
            this.addDialogVisible=true
            let res=await this.axios.get(`categories?type=2`)
            let{data,meta:{status,msg}}=res.data
            if(status===200){
                this.options=data
            }
        },
        async addCategory(){
           this.$refs.addForm.validate(async valid=>{
               if(!valid) return false
               let{cat_name,cat_pid}=this.addForm
                let res=await this.axios.post(`categories`,{
                    cat_pid:cat_pid[cat_pid.length-1] || 0,
                    cat_name,
                    cat_level:cat_pid.length
                })
                let{meta:{status,msg}}=res.data
                if(status===201){
                    this.addDialogVisible = false
                    this.$refs.addForm.resetFields()
                    this.getCategoryList()
                    this.$message.success('添加商品分类成功了')
                } else {
                    this.$message.error(msg)
                }
           })
        }
    },
    created(){
        this.getCategoryList()
    },
    components:{
        [ElTreeGrid.name]:ElTreeGrid
    }

    
}
</script>

<style>

</style>