<template>
  <div class="home">
    <el-container>
      <el-header class="homeHeader">
        <div class="title">云E办</div>
        <div>
          <el-button @click="goChat" icon="el-icon-bell" type="text" size="normal"
            style="color:black;margin-right:8px;"></el-button>

          <el-dropdown class="userInfo" @command="commandHandler">
            <span class="el-dropdown-link">
              {{ user.name }}<i><img :src="user.userFace" /></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu :index="index + ''" v-for="(item, index) in routes" :key="index">
              <template slot="title">
                <i :class="item.iconCls" style="color: #1accff;margin-right:5px"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item :index="children.path" v-for="(children, indexj) in item.children" :key="indexj">
                {{ children.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 面包屑导航区域 -->
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path !== '/home'">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path === '/home'">
            欢迎来到云E办系统！
          </div>
          <!-- 路由点位符 -->
          <router-view class="homeRouterView" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  methods: {
    goChat() {
      this.$router.push('/chat')
    },
    commandHandler(command) {
      if (command === 'logout') {
        // 弹框提示用户是否要删除
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 注销登录
          this.postRequest('/logout')
          // 清空用户信息
          window.sessionStorage.removeItem('tokenStr')
          window.sessionStorage.removeItem('user')
          // 路由替换到登录页面
          // this.$router.replace('/')
          // 清空菜单信息；在src/utils/menus.js 中初始化菜单信息
          this.$store.commit('initRoutes', [])
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消注销登录'
          });
        });
      }
      if (command === 'userinfo') {
        this.$router.push('/userinfo')
      }

    }
  },
  computed: {
    routes: function () {
      return this.$store.state.routes
    },
    user: function () {
      return this.$store.state.currentAdmin
    }

  }
}
</script>

<style>
.homeHeader {
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: white;
}

.homeHeader .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 40px;
  height: 48px;
  border-radius: 24px;
  margin-right: 8px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #409eff;
  padding-top: 50px;
}

.homeRouterView {
  margin-top: 10px;
}
</style>