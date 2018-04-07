<template>
    <div>
        <div style="margin-right:100px">
            <el-input placeholder="搜索用户名..." v-model="searchInput" class="input-with-select">
                <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div style="margin-top:20px">
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="id" label="用户ID" width="238">
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="description" label="用户描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="videoNum" label="上传视频量" width="100">
                </el-table-column>
                <el-table-column label="操作" width="270">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="getVideosByUser(scope.row)" plain>查看视频</el-button>
                        <el-button size="mini" type="primary" @click="resetDialogVisible = true; opUser = scope.row">重置密码</el-button>
                        <el-button size="mini" type="danger" @click="deleteDialogVisible = true; opUser = scope.row">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog title="提示" :visible.sync="resetDialogVisible" width="400px">
                <span>确定要重置用户 {{opUser.username}} 的密码为 8888 吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="resetDialogVisible = false;resetPwd(opUser)">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="400px">
                <span>确定要删除用户 {{opUser.username}} 及其相关的所有数据吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="deleteDialogVisible = false;deleteUser(opUser)">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import Player from "../components/player.vue";
export default {
  components: {
    Player
  },
  mounted() {
    var self = this;
    this.$axios
      .get("/users/all/found", {
        params: {
          username: "",
          pstart: this.pstart - 1,
          psize: this.psize
        }
      })
      .then(function(response) {
        self.tableData = response.data;
      });
  },
  data() {
    return {
      searchInput: "",
      resetDialogVisible: false,
      deleteDialogVisible: false,
      opUser: {},
      tableData: [],
      pstart: 1,
      psize: 10,
      pTotal: 0
    };
  },
  methods: {
    resetPwd(opUser) {
      var self = this;
      this.$axios
        .put(
          "/users/" + opUser.id + "/password",
          this.qs.stringify({
            pwd: this.md5('8888')
          })
        )
        .then(function(response) {
          self.$message("用户 " + opUser.username + " 的密码已重置为 8888");
        });
    },
    deleteUser(opUser) {
      var self = this;
      this.$axios
        .delete("/users/" + opUser.id + "/alldata")
        .then(function(response) {
          self.search();
        });
    },
    search() {
      var self = this;
      this.$axios
        .get("/users/all/found", {
          params: {
            username: this.searchInput,
            pstart: this.pstart - 1,
            psize: this.psize
          }
        })
        .then(function(response) {
          self.tableData = response.data;
        });
    },
    getVideosByUser(opUser) {
      this.$router.push(
        "/videos?uid=" + opUser.id + "&username=" + opUser.username
      );
    }
  }
};
</script>
