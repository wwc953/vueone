<template>
  <div>
    <!-- add Form -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="编号" :label-width="formLabelWidth">
          <el-input
            v-model="form.id"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.createTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 穿梭框 -->
    <el-dialog title="菜单配置" :visible.sync="roledialogFormVisible">
      <el-transfer :titles="['未授权', '已授权']" v-model="value" :data="data">
        <!-- <el-button
          class="transfer-footer"
          slot="right-footer"
          size="small"
          @click="saveRole()"
          >确定</el-button
        > -->
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roledialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoles()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- list -->

    <el-main class="mainsty">
      <!-- <el-button type="text" @click="dialogFormVisible = true">新增</el-button> -->
      <el-button
        type="primary"
        plain
        @click="dialogFormVisible = true"
        style="float: right"
        >新增</el-button
      >

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="id" label="序号" width="120"> </el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="roleshow"
              plain
              size="mini"
              type="primary"
              @click="handleOperRole(scope.row)"
              >菜单配置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pageD">
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :background="true"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-main>
  </div>
</template>


<script>
export default {
  name: "userList",
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      dialogFormVisible: false,
      roledialogFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      data: [],
      value: [],
      currentUserId: "",
      roleshow: false,
    };
  },
  created() {
    this.handleCurrentChange(1);
    //是否显示菜单权限按钮
    this.roleshow =
      JSON.parse(sessionStorage.getItem("userInfo")).name == "admin";
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      var param = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
      };

      this.$API.POST("/vueboot/user/queryUserList", param).then((response) => {
        this.tableData = response.data;
        this.total = response.total;
      });
    },
    handleDelete(index, item) {
      this.$API.POST("/vueboot/user/delUser", item).then((response) => {
        if (response.data > 0) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.handleCurrentChange(this.currentPage);
        }
      });
    },
    handleEdit(index, item) {
      this.form = item;
      this.dialogFormVisible = true;
    },
    save() {
      var param = JSON.stringify(this.form);
      this.$API.POST("/vueboot/user/saveUser", param).then((response) => {
        if (response.data > 0) {
          this.dialogFormVisible = false;
          this.form = {};
          this.handleCurrentChange(this.currentPage);
          this.$message({
            message: "保存成功",
            type: "success",
          });
        }
      });
    },
    handleOperRole(item) {
      // this.$router.push({ name: "menuconfig", params: item });
      this.queryAllUrls();
      this.alreadyOwnRole(item.id);
      this.roledialogFormVisible = true;
      this.currentUserId = item.id;
    },
    queryAllUrls() {
      this.$API.POST("/vueboot/role/queryAllUrlList", {}).then((response) => {
        // console.log(response.data);
        this.data = response.data;
      });
    },
    alreadyOwnRole(currentUserId) {
      this.$API
        .POST("/vueboot/role/currentUserRole", { currentUserId: currentUserId })
        .then((response) => {
          this.value = response.data;
        });
    },
    saveRoles() {
      this.$API
        .POST("/vueboot/role/saveRoles", {
          currentUserId: this.currentUserId,
          value: this.value,
        })
        .then((response) => {
          if (response.data >= 1) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            this.roledialogFormVisible = false;
          }
        });
    },
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.noscrollbar::-webkit-scrollbar {
  display: none;
}

/* .mainsty::-webkit-scrollbar {
  display: none;
} */
.mainsty {
  height: 620px;
}
.pageD {
  margin-top: 10px;
}

.el-transfer-panel__item .el-checkbox__input {
  left: 30px;
}
</style>