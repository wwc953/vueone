<template>
  <el-container style="border: 1px solid #eee">
    <el-aside
      width="250px"
      style="background-color: rgb(238, 241, 246)"
      class="noscrollbar"
    >
      <el-menu :default-openeds="['1', '3']">
        <el-submenu index="1">
          <template slot="title"
            ><i class="el-icon-message"></i>导航一</template
          >
          <el-menu-item-group>
            <!-- <el-menu-item index="1-1" @click="hangdleMenuClick('helloword')"
              >欢迎页面</el-menu-item
            >
            <el-menu-item index="1-2" @click="hangdleMenuClick('userList')"
              >用户信息</el-menu-item
            >
            <el-menu-item index="1-3" @click="hangdleMenuClick('bootconfig')"
              >配置信息</el-menu-item
            > -->
            <!-- 循环菜单 -->
            <el-menu-item
              v-for="item in urlListData"
              :key="item.urlId"
              @click="hangdleMenuClick(item.urlValue)"
              >{{ item.urlDes }}
            </el-menu-item>
          </el-menu-item-group>

          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1" @click="hangdleMenuClick()"
              >选项4-1</el-menu-item
            >
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <div class="mainContainer">
        <component :is="isCompents"></component>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import userList from "@/components/views/userList.vue";
import helloword from "@/components/views/HelloWorld.vue";
import bootconfig from "@/components/config/config.vue";
import menuconfig from "@/components/config/menuConfig.vue";
import vwebsocket from "@/utils/websocket.js";

export default {
  //组件
  components: {
    userList,
    helloword,
    bootconfig,
    menuconfig,
  },
  data() {
    return {
      //默认
      isCompents: "helloword",
      urlListData: [],
    };
  },
  created() {
    // console.log(sessionStorage.getItem("urlListData"), "获取菜单");
    this.urlListData = JSON.parse(sessionStorage.getItem("urlListData"));
  },
  mounted() {
    // //WebSocket url
    var socketUrl =
      process.env.baseWebsocketUrl +
      JSON.parse(sessionStorage.getItem("userInfo")).id;
    vwebsocket(socketUrl);
  },
  methods: {
    hangdleMenuClick(val) {
      if (val != "") {
        this.isCompents = val;
      }
    },
  },
};
</script>

<style>
.el-breadcrumb {
  float: left;
  margin-top: 20px;
}
.mainContainer {
  width: 100%;
  margin-top: 10px;
}
</style>