<template>
    <div>
        <div style="margin-right:100px">
            <el-input placeholder="搜索视频标题..." v-model="searchInput" class="input-with-select">
                <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div style="margin-top:30px">
            <el-button size="mini" v-if="this.$route.query.uid != undefined" type="primary" icon="el-icon-back" @click="$router.go(-1)" plain circle></el-button>
            &nbsp;&nbsp;&nbsp;
            <span v-if="this.$route.query.uid != undefined">上传者 {{this.$route.query.username}} 的视频</span>
            <el-tabs value="r" @tab-click="handleTableType">
                <el-tab-pane label="已审核" name="r"></el-tab-pane>
                <el-tab-pane label="未审核" name="nr"></el-tab-pane>
            </el-tabs>
            <el-table :data="tableData" stripe style="width: 100%">
                <el-table-column prop="title" label="视频标题" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="username" label="上传者" width="100">
                </el-table-column>
                <el-table-column prop="category" label="所属类别" width="100">
                </el-table-column>
                <el-table-column prop="description" label="视频描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="datetime" label="上传时间" width="160">
                    <template slot-scope="scope">
                        {{getTime(scope.row.datetime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="play(scope.row)">播放</el-button>
                        <el-button size="mini" type="danger" @click="deleteDialogVisible = true; opVideo = scope.row" v-if="tabType=='r'">删除</el-button>
                        <el-button size="mini" type="warning" @click="reviewDialogVisible = true; opVideo = scope.row" v-if="tabType=='nr'">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 30px;text-align: right">
                <el-pagination background layout="prev, pager, next" :total="pTotal">
                </el-pagination>
            </div>

            <el-dialog :title="opVideo.title" :visible.sync="playDialogVisible" width="600px">
                <span>{{opVideo.description}}</span>
                <div style="height:350px" v-if="playDialogVisible">
                    <Player :url="this.playServerURL + '/' + opVideo.uid + '/' + opVideo.id + '_/play.m3u8'" />
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="playDialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
            <el-dialog title="审核" :visible.sync="reviewDialogVisible" width="400px">
                <span>是否允许视频 {{opVideo.title}} 通过审核？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="reviewDialogVisible = false;setReviewPass(true, opVideo)">是</el-button>
                    <el-button type="info" @click="reviewDialogVisible = false;setReviewPass(false, opVideo)">否</el-button>
                    <el-button @click="reviewDialogVisible = false">暂不审核</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="400px">
                <span>确定要删除视频 {{opVideo.title}} 吗？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="deleteDialogVisible = false;deleteVideo(opVideo)">确 定</el-button>
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
      .get("/videos/p/reviewed", {
        params: {
          uid: this.$route.query.uid == undefined ? "" : this.$route.query.uid,
          title: "",
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
      tabType: "r",
      deleteDialogVisible: false,
      playDialogVisible: false,
      reviewDialogVisible: false,
      opVideo: {},
      tableData: [],
      pstart: 1,
      psize: 10,
      pTotal: 0
    };
  },
  methods: {
    play(row) {
      this.opVideo = row;
      this.playDialogVisible = true;
    },
    deleteVideo(opVideo) {
      var self = this;
      this.$axios.delete("/videos/" + opVideo.id).then(function(response) {
        self.search();
      });
    },
    setReviewPass(result, opVideo) {
      var self = this;
      if (result) {
        this.$axios
          .put(
            "/videos/" + opVideo.id + "/review",
            this.qs.stringify({
              result: true
            })
          )
          .then(function(response) {
            self.search();
            self.$message("视频 " + opVideo.title + " 已通过审核");
          });
      } else {
        this.$axios
          .put(
            "/videos/" + opVideo.id + "/review",
            this.qs.stringify({
              result: false
            })
          )
          .then(function(response) {
            self.search();
            self.$message("视频 " + opVideo.title + " 未通过审核");
          });
      }
    },
    search() {
      var self = this;
      this.pstart = 1;
      var url = "";
      if (this.tabType == "r") {
        url = "/videos/p/reviewed";
      } else {
        url = "/videos/p/unreviewed";
      }
      this.$axios
        .get(url, {
          params: {
            uid:
              this.$route.query.uid == undefined ? "" : this.$route.query.uid,
            title: this.searchInput,
            pstart: this.pstart - 1,
            psize: this.psize
          }
        })
        .then(function(response) {
          self.tableData = response.data;
        });
    },
    handleTableType(tab, event) {
      switch (event.target.id) {
        case "tab-r":
          this.tabType = "r";
          var self = this;
          this.$axios
            .get("/videos/p/reviewed", {
              params: {
                uid:
                  this.$route.query.uid == undefined
                    ? ""
                    : this.$route.query.uid,
                title: "",
                pstart: this.pstart - 1,
                psize: this.psize
              }
            })
            .then(function(response) {
              self.tableData = response.data;
            });
          break;
        case "tab-nr":
          this.tabType = "nr";
          var self = this;
          this.$axios
            .get("/videos/p/unreviewed", {
              params: {
                uid:
                  this.$route.query.uid == undefined
                    ? ""
                    : this.$route.query.uid,
                title: "",
                pstart: this.pstart - 1,
                psize: this.psize
              }
            })
            .then(function(response) {
              self.tableData = response.data;
            });
          break;
      }
    }
  }
};
</script>

<style>

</style>
