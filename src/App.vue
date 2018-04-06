<template>
  <el-container style="height:100%">
    <el-header style="padding:0">
      <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#fff">
        <el-menu-item index="1">
          <b style="font-size:18px">视频发布系统管理平台</b>
        </el-menu-item>
        <el-menu-item index="2">管理员：aaa</el-menu-item>
        <el-menu-item index="3" @click="modifyDialogVisible = true">修改密码</el-menu-item>
        <el-menu-item index="4">退出登录</el-menu-item>
      </el-menu>
    </el-header>
    <el-container style="height:100%">
      <el-aside style="width:230px;height:100%">
        <el-menu style="height:100%" :default-active="getRootPath()" :router="true" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="videos">
            <i class="material-icons">video_library</i>
            <span slot="title">&nbsp;&nbsp;视频管理</span>
          </el-menu-item>
          <el-menu-item index="categories">
            <i class="material-icons">view_list</i>
            <span slot="title">&nbsp;&nbsp;类别管理</span>
          </el-menu-item>
          <el-menu-item index="users">
            <i class="material-icons">supervisor_account</i>
            <span slot="title">&nbsp;&nbsp;用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
        <el-dialog title="修改管理员密码" :visible.sync="modifyDialogVisible" width="30%" center>
          <el-form label-position="right" label-width="80px" :model="pwd">
            <el-form-item label="新密码">
              <el-input type="password" v-model="pwd.newPwd"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input type="password" v-model="pwd.conPwd"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modify(pwd)">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      modifyDialogVisible: false,
      pwd: {}
    };
  },
  methods: {
    getRootPath() {
      var curPageUrl = window.document.location.href;
      var rootPath = curPageUrl.split("//")[1].split("/")[1];
      return rootPath;
    },
    modify(pwd) {
      if (pwd.newPwd != pwd.conPwd) {
        this.$message("新密码和确认密码不一致");
      } else {
        this.modifyDialogVisible = false;
      }
    }
  }
};
</script>


<style>
html,
body {
  padding: 0px;
  margin: 0px;
  height: 100%;
}
</style>
