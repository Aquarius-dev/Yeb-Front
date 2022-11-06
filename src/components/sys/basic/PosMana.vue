<template>
    <div>
        <div>
            <el-input v-model="pos.name" @keydown.enter.native="addPosition" placeholder="" size="small"
                class="addPosInput" suffix-icon="el-icon-plus">
            </el-input>
            <el-button type="primary" size="small" @click="addPosition">添加</el-button>
        </div>
        <div class="posManaMain">
            <el-table size="small" @selection-change="handleSelectionChange" :data="positions" border stripe
                style="width: 70%">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="id" label="编号" width="55">
                </el-table-column>
                <el-table-column prop="name" label="职位" width="120">
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" width="200">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-button type="danger" size="small" :disabled="this.multipleSelection.length == 0" @click="deleteMany">批量删除
        </el-button>

        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input v-model="updatePos.name" size="small" class="updatePosInput"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'PosMana',
    data() {
        return {
            pos: {
                name: ''
            },
            positions: [],
            dialogVisible: false,
            updatePos: {
                name: ''
            },
            multipleSelection: []
        }
    },
    // 生命周期 在组件被挂在后调用 
    mounted() {
        this.initPositions();
    },
    methods: {
        deleteMany() {
            this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = '?'
                this.multipleSelection.forEach(item => {
                    ids += 'ids=' + item.id + '&'
                })
                this.deleteRequest('/system/basic/pos/' + ids).then(resp => {
                    if (resp) {
                        this.initPositions()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        doUpdate() {
            this.putRequest('/system/basic/pos/', this.updatePos).then(resp => {
                if (resp) {
                    this.initPositions() // 刷新数据列表
                    this.dialogVisible = false // 关闭对话框
                }
            })
        },
        addPosition() {
            if (this.pos.name) {
                this.postRequest('/system/basic/pos/', this.pos).then(resp => {
                    if (resp) {
                        this.initPositions()
                        this.pos.name = ''
                    }
                })
            } else {
                this.$message.error('职位名称不能为空')
            }
        },
        showEditView(index, data) {
            Object.assign(this.updatePos, data)
            this.updatePos.createDate = ''
            this.dialogVisible = true
        },
        handleDelete(index, data) {
            this.$confirm('此操作将永久删除[' + data.name + ']职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/basic/pos/' + data.id).then(resp => {
                    if (resp) {
                        this.initPositions()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        initPositions() {
            this.getRequest('/system/basic/pos/').then(resp => {
                this.positions = resp
            })
        }
    }

}
</script scoped>

<style>
.addPosInput {
    width: 300px;
    margin-right: 8px;
}

.posManaMain {
    margin-top: 10px;
}

.updatePosInput {
    width: 200px;
    margin-left: 8px;
}
</style>