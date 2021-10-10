<template>
  <div>
    <!-- add Form -->
    <!-- <el-button type="text" @click="dialogFormVisible = true">新增</el-button> -->
    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="编号" :label-width="formLabelWidth">
          <el-input
            v-model="form.id"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型" :label-width="formLabelWidth">
          <el-input
            v-model="form.configType"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="值" :label-width="formLabelWidth">
          <el-input v-model="form.configValue" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.flag" autocomplete="off"></el-input> -->
          <el-switch
            style="display: block"
            v-model="form.flag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="生效"
            inactive-text="失效"
            active-value="01"
            inactive-value="02"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- list -->
    <el-main class="mainsty">
      <el-select
        v-model="selectValue"
        clearable
        placeholder="请选择"
        @change="changeSelect"
        style="float: left; margin-bottom: 10px"
      >
        <el-option
          v-for="item in selectoptionsData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="id" label="序号" width="120"> </el-table-column>
        <el-table-column prop="configType" label="类型" width="150">
        </el-table-column>
        <el-table-column prop="configValue" label="值" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="valueDes" label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="flag" label="状态" width="90px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.flag === '02' ? 'danger' : 'success'"
              disable-transitions
              >{{ scope.row.flag === "02" ? "失效" : "生效" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>


<script>
export default {
  name: "bootconfig",
  data() {
    return {
      selectValue: "",
      selectoptionsData: [],
      tableData: [],
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      value2: "",
    };
  },
  created() {
    this.initConfigTypes();
  },
  methods: {
    /**
     *初始化类型
     */
    initConfigTypes() {
      this.$API.POST("/vueboot/config/initConfigTypes", {}).then((response) => {
        this.selectoptionsData = response.data;
      });
    },
    /**
     *
     */
    changeSelect() {
      var param = { configType: this.selectValue };
      this.$API
        .POST("/vueboot/config/queryConfigListByType", param)
        .then((response) => {
          this.tableData = response.data;
        });
    },
    handleEdit(index, item) {
      this.form = item;
      this.dialogFormVisible = true;
    },
    save() {
      var param = JSON.stringify(this.form);
      // console.log("保存配置 ==> ", param);
      // return;
      this.$API.POST("/vueboot/config/saveConfig", param).then((response) => {
        if (response.data > 0) {
          this.dialogFormVisible = false;
          this.form = {};
          this.$message({
            message: "保存成功",
            type: "success",
          });
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
</style>