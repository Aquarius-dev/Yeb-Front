<template>
  <div class="loginContainer">
    <h3 class="loginTitle">登录系统</h3>
    <el-form ref="loginForm" v-loading="loading" element-loading-text="正在登陆......"
      element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :rules="rules"
      :model="loginForm">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" auto-complete="false"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"
          auto-complete="false"></el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码" auto-complete="false"
          style="width: 250px; margin: 5px;" @keydown.enter.native="submitLogin"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha" />
      </el-form-item>

      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-button type="primary" style="width: 100%" @click="submitLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      captchaUrl: "/captcha?time=" + new Date(),
      loginForm: {
        username: "admin",
        password: "123",
        code: "",
      },
      loading: false,
      checked: true,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitLogin: function () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.postRequest("/login", this.loginForm).then((resp) => {
            this.loading = false;
            if (resp) {
              const tokenStr = resp.obj.tokenHead + resp.obj.token;
              window.sessionStorage.setItem("tokenStr", tokenStr);

              // this.$router.replace("/home");
              let path = this.$route.query.redirect
              this.$router.replace((path === '/' || path === undefined) ? '/home' : path)
            }
          });
        } else {
          this.$message.error("请输入所有字段");
          return false;
        }
      });
    },
    updateCaptcha: function () {
      this.captchaUrl = "/captcha?time=" + new Date();
    },
  },
};
</script>

<style>
/* html {
  height: 100%;
} */

.loginContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: #fff;
  border: 1px solid #efefef;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 0 auto 40px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}

.el-form-item__content {
  display: flex;
  align-items: center;
}
</style>
