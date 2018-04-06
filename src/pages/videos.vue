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
                <el-table-column prop="title" label="视频标题" width="180">
                </el-table-column>
                <el-table-column prop="username" label="上传者" width="100">
                </el-table-column>
                <el-table-column prop="category" label="所属类别" width="100">
                </el-table-column>
                <el-table-column prop="description" label="视频描述">
                </el-table-column>
                <el-table-column prop="datetime" label="上传时间" width="160">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="play(scope.row)">播放</el-button>
                        <el-button size="mini" type="danger" @click="deleteDialogVisible = true; opVideo = scope.row" v-if="tabType=='r'">删除</el-button>
                        <el-button size="mini" type="warning" @click="reviewDialogVisible = true; opVideo = scope.row" v-if="tabType=='nr'">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :title="opVideo.title" :visible.sync="playDialogVisible" width="45%">
                <div style="height:350px" v-if="playDialogVisible">
                    <Player url="http://192.168.0.149/02059350d52346a0940a4eeece3462c6/02059350d52346a0940a4eeece3462c615de999b5fbd4b8682b3f820d2e3d325_/play.m3u8"/>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="playDialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
            <el-dialog title="审核" :visible.sync="reviewDialogVisible" width="45%">
                <span>是否允许视频 {{opVideo.title}} 通过审核？</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="reviewDialogVisible = false;setReviewSuccess(opVideo)">是</el-button>
                    <el-button type="info" @click="reviewDialogVisible = false">否</el-button>
                    <el-button @click="reviewDialogVisible = false">暂不审核</el-button>
                </span>
            </el-dialog>
            <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
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
  data() {
    return {
      searchInput: "",
      tabType: "r",
      deleteDialogVisible: false,
      playDialogVisible: false,
      reviewDialogVisible: false,
      opVideo: {},
      tableData: [
        {
          title: "2016-05-02 00:00:00",
          username: "王小虎",
          category: "王小虎",
          description: "上海市普陀区金沙江路 1518 弄",
          datetime: "2016-05-02 00:00:00",
        },
        {
          title: "2016-05-04",
          username: "王小虎",
          category: "王小虎",
          description: "上海市普陀区金沙江路 1517 弄",
          datetime: "2016-05-02 00:00:00",
        }
      ]
    };
  },
  methods: {
    play(row) {
      this.opVideo = row;
      this.playDialogVisible = true;
    },
    deleteVideo(opVideo) {
      console.log(opVideo);
    },
    setReviewSuccess(opVideo) {
      this.$message('视频 ' + opVideo.title + ' 已通过审核');
    },
    search() {

    },
    handleTableType(tab, event) {
      switch (event.target.id) {
        case "tab-r":
          this.tabType = "r";
          break;
        case "tab-nr":
          this.tabType = "nr";
          break;
      }
    }
  }
};
</script>

<style>

</style>
