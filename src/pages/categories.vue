<template>
    <div>
        <div style="margin-right:100px">
            <el-input placeholder="搜索类别名..." v-model="searchInput" class="input-with-select">
                <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div style="margin-top:20px">
            <el-button size="medium" type="primary" @click="newCa = true;modifyDialogVisible = true; opCategory = {}">+ 新建</el-button>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="id" label="类别ID" width="238">
                </el-table-column>
                <el-table-column prop="name" label="类别名" width="110">
                </el-table-column>
                <el-table-column prop="description" label="类别描述">
                </el-table-column>
                <el-table-column prop="datetime" label="创建时间" width="160">
                    <template slot-scope="scope">
                        {{getTime(scope.row.datetime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="newCa = false;modifyDialogVisible = true; opCategory = scope.row">修改</el-button>
                        <el-button size="mini" type="danger" @click="deleteDialogVisible = true; opCategory = scope.row">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :title="newCa? '新建类别':'修改类别'" :visible.sync="modifyDialogVisible" width="400px" center>
                <el-form label-position="right" label-width="80px" :model="opCategory">
                    <el-form-item label="类别名">
                        <el-input v-model="opCategory.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类别描述">
                        <el-input type="textarea" :rows="3" v-model="opCategory.description"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="modifyDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="modifyDialogVisible = false;modifyOrNew(opCategory)">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="400px">
                <span>确定要删除类别 {{opCategory.name}} 吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="deleteDialogVisible = false;deleteCategory(opCategory)">确 定</el-button>
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
      .get("/categories", {
        params: {
          name: ""
        }
      })
      .then(function(response) {
        self.tableData = response.data;
      });
  },
  data() {
    return {
      searchInput: "",
      modifyDialogVisible: false,
      deleteDialogVisible: false,
      newCa: true,
      opCategory: {},
      tableData: []
    };
  },
  methods: {
    modifyOrNew(opCategory) {
      if (this.newCa) {
        var self = this;
        this.$axios
          .post(
            "/categories",
            this.qs.stringify({
              name: opCategory.name,
              description: opCategory.description
            })
          )
          .then(function(response) {
            self.search();
          });
      } else {
        var self = this;
        this.$axios
          .put("/categories/" + opCategory.id)
          .then(function(response) {
            self.search();
          });
      }
    },
    search() {
      var self = this;
      this.$axios
        .get("/categories", {
          params: {
            name: this.searchInput
          }
        })
        .then(function(response) {
          self.tableData = response.data;
        });
    },
    deleteCategory(opCategory) {
      var self = this;
      this.$axios
        .delete("/categories/" + opCategory.id)
        .then(function(response) {
          self.search();
        });
    }
  }
};
</script>
