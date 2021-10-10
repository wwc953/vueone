<template>
  <div>
    <!-- @keyup.enter.native 回车键触发表单提交事件 -->
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="loginForm"
      @keyup.enter.native="submitForm('loginForm')"
    >
      <el-form-item label="用户名">
        <el-input v-model="loginForm.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <!-- <el-input v-model="loginForm.password"></el-input> -->
        <el-input
          placeholder="请输入密码"
          v-model="loginForm.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  name: "login",
  data() {
    return {
      labelPosition: "right",
      loginForm: {
        password: "",
        name: "",
      },
    };
  },
  methods: {
    submitForm() {
      var param = {};
      param.name = this.loginForm.name;
      param.password = this.$Rsa.encrypt(this.loginForm.password);

      this.$API.POST("/vueboot/user/login", param).then((response) => {
        if (response.data.userInfo != null) {
          this.$message({
            message: "验证成功",
            type: "success",
          });
          // console.log(response.data, "loginResData");
          sessionStorage.setItem("token", response.data.token);
          sessionStorage.setItem(
            "urlListData",
            JSON.stringify(response.data.urlListData)
          );
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify(response.data.userInfo)
          );

          this.$router.push("/home");
        }
      });
    },
  },
};
</script>