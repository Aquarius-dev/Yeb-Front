<template>
    <div style="width:500px;">
        <el-input v-model="filterText" placeholder="请输入部门名称进行查询..." prefix-icon="el-icon-search"></el-input>
        <div class="block">
            <el-tree :data="deps" node-key="id" :props="defaultProps" default-expand-all
                :filter-node-method="filterNode" :expand-on-click-node="false" ref="tree">
                <template v-slot="{ node, data }">
                    <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%;">
                        <span>{{ data.name }}</span>
                        <span>
                            <el-button plain class="depBtn" type="primary" size="mini" @click="() => showAddDep(data)">
                                添加部门
                            </el-button>
                            <el-button plain class="depBtn" type="danger" size="mini" @click="() => deleteDep(data)">
                                删除部门
                            </el-button>
                        </span>
                    </span>
                </template>
            </el-tree>
            <el-dialog title="添加部门" :visible.sync="dialogVisible" width="30%">
                <div>
                    <table>
                        <tr>
                            <td>
                                <el-tag>
                                    上级部门
                                </el-tag>
                            </td>
                            <td>{{ pname }}</td>
                        </tr>
                        <tr>
                            <td>
                                <el-tag>部门名称</el-tag>
                            </td>
                            <td>
                                <el-input v-model="dep.name" placeholder="请输入部门名称" size="small">
                                </el-input>
                            </td>
                        </tr>
                    </table>
                    <span slot="footer" style="display: flex;justify-content:flex-end;margin-top: 20px;">
                        <!-- <span slot="footer"> -->
                        <el-button size="small" @click="dialogVisible = false">取消</el-button>
                        <el-button size="small" type="primary" @click="doAddDep">确定</el-button>
                        <!-- </span> -->
                    </span>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    name: 'DepMana',
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.initDeps()
    },
    data() {
        return {
            deps: [],
            filterText: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            dialogVisible: false,
            pname: '',//上级部门
            // 添加部门对象
            dep: {
                name: '',
                parentId: -1,
                isParent: ''
            }
        }
    },
    methods: {
        removeDepFromDeps(p, deps, id) {
            for (let i = 0; i < deps.length; i++) {
                let d = deps[i]
                if (d.id === id) {
                    deps.splice(i, 1)
                    if (deps.length === 0) {
                        p.isParent = false
                    }
                    return;
                } else {
                    this.removeDepFromDeps(d, d.children, id)
                }

            }
        },
        addDeps2Dep(deps, dep) {
            for (let i = 0; i < deps.length; i++) {
                let d = deps[i];//父部门
                if (d.id === dep.parentId) {
                    d.children = d.children.concat(dep)
                    if (d.children.length > 0) {
                        d.isParent = true
                    }
                    return
                } else {
                    this.addDeps2Dep(d.children, dep)
                }
            }
        },
        doAddDep() {
            this.postRequest('/system/basic/department/', this.dep).then(resp => {
                if (resp) {
                    this.dialogVisible = false
                    console.log(resp.obj)
                    this.addDeps2Dep(this.deps, resp.obj)
                    this.initDep()
                    // this.initDeps()
                }
            })
        },
        showAddDep(data) {
            this.dep.parentId = data.id
            this.pname = data.name
            this.dialogVisible = true
        },
        deleteDep(data) {
            this.$confirm('此操作将永久删除该[' + data.name + ']部门, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
                    if (resp) {
                        this.removeDepFromDeps(null, this.deps, data.id)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        initDeps() {
            this.getRequest('/system/basic/department/').then(resp => {
                if (resp) {
                    this.deps = resp
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        initDep() {
            this.dep = {
                name: '',
                parentId: -1
            }
            this.pname = ''
        }
    },
}
</script>
<style>
.depBtn {
    padding: 2px;
}
</style>