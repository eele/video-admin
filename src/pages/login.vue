<template>
    <el-dialog title="视频发布系统管理平台" :visible="true" :show-close="false" :modal="false" width="400px" center>
        <el-form label-position="right" label-width="80px" :model="admin">
            <el-form-item label="用户名">
                <el-input v-model="admin.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="admin.password"></el-input>
            </el-form-item>
            <div style="color: red; text-align: center">{{msg}}</div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="login(admin)">登 录</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      admin: {},
      msg: " "
    };
  },
  methods: {
    login(admin) {
      var self = this;
      this.$axios
        .post(
          "/sessions/admin",
          this.qs.stringify({
            username: admin.username,
            password: admin.password
          })
        )
        .then(function(response) {
          if (response.data.stateMsg == "OK") {
            self.setCookie("token", response.data.token);
            self.setCookie("uid", response.data.uid);
            location.href = "/";
          } else {
            self.msg = response.data.stateMsg;
          }
        })
        .catch(function(error) {
          self.msg = "服务端异常";
        });
    }
  }
};
</script>

<style>
body {
  background-color: rgb(33, 175, 241);
}
</style>
