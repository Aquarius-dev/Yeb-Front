<template>
    <div>
        <div style="display:flex;justify-content:center;margin-top: 10px;">
            <el-input v-model="keywords" placeholder="通过用户名搜索..." prefix-icon="el-icon-search"
                style="width: 400px;margin-right:10px ;">
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
        <div class="admin-container">
            <el-card class="admin-card" v-for="(admin, index) in admins" :key="index">
                <div slot="header" class="clearfix">
                    <span>
                        {{ admin.name }}
                    </span>
                    <el-button style="float:right;padding:3px;color:red;" type="text" icon="el-icon-delete"
                        @click="deleteAdmin(admin)">
                    </el-button>
                </div>
                <div>
                    <div class="img-container">
                        <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userFace-img">
                    </div>
                </div>
                <div class="userinfo-container">
                    <div>用户名:{{ admin.name }}</div>
                    <div>手机号码：{{ admin.phone }}</div>
                    <div>电话号码：{{ admin.telephone }}</div>
                    <div>地址：{{ admin.address }}</div>
                    <div>
                        用户状态：
                        <el-switch v-model="admin.enabled" active-color="#13ce66" inactive-color="#ff4949"
                            @change="enabledChange(admin)" active-text="启用" inactive-text="禁用">
                        </el-switch>
                    </div>
                </div>
                <div>
                    用户角色:
                    <el-tag style="margin-right: 4px;" type="success" v-for="(role, index) in admin.roles" :key="index">
                        {{ role.nameZh }}
                    </el-tag>
                    <el-popover @show="showPop(admin)" @hide="hidePop(admin)" placement="right" title="角色列表" width="200"
                        trigger="click">
                        <el-select v-model="selecedtRoles" multiple placeholder="请选择">
                            <el-option v-for="(r, index) in allRoles" :key="index" :label="r.nameZh" :value="r.id">
                            </el-option>
                        </el-select>
                        <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
                    </el-popover>
                    <div>备注：{{ admin.remark }}</div>
                </div>
            </el-card>

        </div>
    </div>
</template>

<script>
export default {
    name: 'SyaAdmin',
    data() {
        return {
            admins: [],
            keywords: '',
            selecedtRoles: [],
            allRoles: []
        }
    },
    mounted() {
        this.initAdmins()
    },
    methods: {
        deleteAdmin(admin) {
            this.$confirm('此操作将永久删除该[' + admin.name + '], 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/system/admin/' + admin.id).then(resp => {
                    if (resp) {
                        this.initAdmins()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        hidePop(admin) {
            let roles = []
            Object.assign(roles, admin.roles)
            let flag = false
            // 如果选中角色id长度不一样
            if (roles.length != this.selecedtRoles.length) {
                flag = true
            } else {
                // 角色id长度和原来一样，但角色肯不一样
                for (let i = 0; i < roles.length; i++) {
                    let role = roles[i]
                    for (let j = 0; j < this.selecedtRoles.length; j++) {
                        roles.splice(i, 1)
                        i--
                        break
                    }
                }
                if (roles.length != 0) {
                    flag = true
                }
            }
            if (flag) {
                let url = '/system/admin/role?adminId=' + admin.id
                this.selecedtRoles.forEach(sr => {
                    url += '&rids=' + sr
                })
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.initAdmins()
                    }
                })
            }
        },
        showPop(admin) {
            this.initAllRoles();
            let roles = admin.roles
            this.selecedtRoles = []
            roles.forEach(r => {
                this.selecedtRoles.push(r.id)
            })
        },
        initAllRoles() {
            this.getRequest('/system/admin/roles').then(resp => {
                if (resp) {
                    this.allRoles = resp
                }
            })
        },
        enabledChange(admin) {
            this.putRequest('/system/admin/', admin).then(resp => {
                if (resp) {
                    this.initAdmins()
                }
            })
        },
        doSearch() {
            this.initAdmins()
        },
        initAdmins() {
            this.getRequest('/system/admin/?keywords=' + this.keywords).then(resp => {
                if (resp) {
                    this.admins = resp
                }
            })
        }
    }
}
</script>
<style>
.admin-container {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    flex-wrap: warp;
}

.admin-card {
    width: 350px;
    margin-bottom: 20px;
}

.userFace-img {
    width: 72px;
    height: 72px;
    border-radius: 72px;
}

.img-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.userinfo-container {
    font-size: 12px;
    color: #3e9ef5;
}
</style>