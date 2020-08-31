<template>
    <div class="rights">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-table :data="rightList" style="width:100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="层级">
                <template slot-scope="scope">
                   <span v-if="scope.row.level==0">一级</span>
                   <span v-else-if="scope.row.level==1">二级</span>
                   <span v-else>三级</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            rightList:[]
        }
    },
    async created(){
       let res=await this.axios.get(`rights/list`)
       let{meta:{status},data}=res.data
        if(status===200){
            this.rightList=data
        }
       
    }
}
</script>

<style scoped>

</style>