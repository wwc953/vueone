<template>
  <div>
    <el-dialog title="用户信息">
      <!-- 穿梭框 -->
      <el-transfer :titles="['未授权', '已授权']" v-model="value" :data="data"
        ><el-button
          class="transfer-footer"
          slot="right-footer"
          size="small"
          @click="saveRoles()"
          >确定</el-button
        ></el-transfer
      >
    </el-dialog>
  </div>
</template>


<script>
export default {
  name: "menuconfig",
  data() {
    const generateData = (_) => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          // disabled: i % 4 === 0,
        });
      }
      return data;
    };
    return {
      data: generateData(),
      value: [1, 2, 3, 4],
      //当前
      currentUserId: "",
    };
  },
  created() {
    console.log(this.$route);
    this.currentUserId = this.$route.params.id;
    this.queryAllUrls();
    this.alreadyOwnRole(this.currentUserId);
  },
  methods: {
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
          }
        });
    },
  },
};
</script>

<style>
.el-transfer-panel__item .el-checkbox__input {
  left: 30px;
}
</style>