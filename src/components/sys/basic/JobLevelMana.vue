<template>
    <div>
        <div>
            <el-input size="small" v-model="jl.name" placeholder="添加职称名称......" prefix-icon="el-icon-plus"
                style="width: 300px;" />
            <el-select size="small" v-model="jl.titleLevel" placeholder="职称等级" style="margin-left:6px;margin-right:6px">
                <el-option v-for="item in titleLevels" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addJobLevel">添加</el-button>
        </div>
        <div style="margin-top: 10px;">
            <el-table :data="jls" border stripe style="width: 70%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="编号" width="55">
                </el-table-column>
                <el-table-column prop="name" label="职称名称" width="150">
                </el-table-column>
                <el-table-column prop="titleLevel" label="职称等级" width="150">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="150">
                </el-table-column>
                <el-table-column prop="enabled" label="是否启用" width="100">
                    <template v-slot="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="350">
                    <template v-slot="scope">
                        <el-button size="small" @click="showEditView(scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="deletHandle(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" size="small" :disabled="this.multipleSelection.length === 0" @click="deleteMany">
                批量删除
            </el-button>
        </div>
        <el-dialog title="编辑职称" :visible.sync="dialogVisible" width="30%">
            <table>
                <tr>
                    <td>
                        <el-tag>职称名称</el-tag>
                    </td>
                    <td>
                        <el-input v-model="updateJl.name" size="small" style="margin-left: 6px;" />
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>职称等级</el-tag>
                    </td>
                    <td>
                        <el-select v-model="updateJl.titleLevel" placeholder="职称等级" size="small"
                            style="margin-left: 6px;">
                            <el-option v-for="item in titleLevels" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>是否启用</el-tag>
                    </td>
                    <td>
                        <el-switch v-model="updateJl.enabled" active-color="#13ce66" inactive-color="#ff4949"
                            active-text="启用" inactive-text="未启用" style="margin-left: 6px">
                        </el-switch>
                    </td>
                </tr>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="doUpdate">确认</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    name: 'JobLevelMana',
    mounted() {
        this.initJls();
    },
    data() {
        return {
            jl: {
                name: '',
                titleLevel: ''
            },
            titleLevels: [
                '正高级',
                '副高级',
                '中级',
                '初级',
                '员级'
            ],
            multipleSelection: [],
            jls: [],
            dialogVisible: false,
            updateJl: {
                name: '',
                titleLevel: '',
                enabled: false
            }
        }
    },
    methods: {
        doUpdate() {
            this.putRequest('/system/basic/joblevel/', this.updateJl).then(resp => {
                this.initJls()
                this.dialogVisible = false
            })
        },
        showEditView(data) {
            Object.assign(this.updateJl, data)
            this.updateJl.createDate = ''
            this.dialogVisible = true;
        },
        // 执行批量删除
        deleteMany() {
            this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条职称, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = '?'
                this.multipleSelection.forEach(item => {
                    ids += 'ids=' + item.id + '&'
                })
                this.deleteRequest('/system/basic/joblevel/' + ids).then(resp => {
                    if (resp) {
                        this.initJls()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 删除职位植物
        deletHandle(data) {
            this.$confirm('此操作将永久删除[' + data.name + ']职称, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest(' /system/basic/joblevel/' + data.id).then(resp => {
                    if (resp) {
                        this.initJls()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
        ,
        // 添加职位职务
        addJobLevel() {
            if (this.jl.name && this.jl.titleLevel) {
                this.postRequest('/system/basic/joblevel/', this.jl).then(resp => {
                    if (resp) {
                        this.initJls()
                    }
                })
            } else {
                this.$message.error('字段不能为空!')
            }
        },
        // 批量删除勾选中的值
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        initJls() {
            this.getRequest('/system/basic/joblevel/').then(resp => {
                if (resp) {
                    this.jls = resp;
                    this.jl.name = '';
                    this.jl.titleLevel = '';
                }
            })
        }
    }
}
</script>
<style>

</style>