<template>
  <div>
    <button @click="send">发消息</button>
  </div>
</template>

<script>
export default {
  name: "websocket",
  data() {
    return {
      socketUrl: "ws://192.168.0.200:8005/qrCodePage/ID=1/refreshTime=5",
      socket: "",
    };
  },
  created() {
    // 连接webSocket，用于接收后台实时报警信息推送
    // this.webSocket();
  },
  methods: {
    webSocket() {
      const that = this;
      if (typeof WebSocket == "undefined") {
        this.$notify({
          title: "提示",
          message: "当前浏览器无法接收实时报警信息，请使用谷歌浏览器！",
          type: "warning",
          duration: 0,
        });
      } else {
        // 获取token保存到vuex中的用户信息，此处仅适用于本项目，注意删除或修改
        // store.dispatch("GetInfo").then((info) => {
        // 实例化socket，这里我把用户名传给了后台，使后台能判断要把消息发给哪个用户，其实也可以后台直接获取用户IP来判断并推送
        // const socketUrl = "ws://127.0.0.1:8868/websocket/" + info.username;
        const socketUrl = "ws://localhost:8000/vueboot/websocket/2130";
        this.socket = new WebSocket(socketUrl);

        // 监听socket打开
        this.socket.onopen = function () {
          console.log("浏览器WebSocket已打开");
        };
        // 监听socket消息接收
        this.socket.onmessage = function (msg) {
          console.log("接受到的数据", msg);
          // 转换为json对象
          const data = JSON.parse(msg.data);
          // that.$notify({
          //   title: "建立连接",
          //   // 这里也可以把返回信息加入到message中显示
          //   message: "实时报警服务连接成功，点击查看报警信息详情",
          //   type: "success",
          //   duration: 0,
          //   onClick: () => {
          //     that.$router.push({
          //       path: "/alarmManage/monitAlarmInfo",
          //     });
          //   },
          // });
          that.$notify({
            title: "新消息",
            message: data.key,
            type: "success",
            duration: 0,
            onClick: () => {},
          });
        };
        // 监听socket错误
        this.socket.onerror = function () {
          that.$notify({
            title: "错误",
            message: "服务器错误，无法接收实时报警信息",
            type: "error",
            duration: 0,
          });
        };
        // 监听socket关闭
        this.socket.onclose = function () {
          console.log("WebSocket已关闭");
        };
        // });
      }
    },
    send() {
      this.socket.send("来自前端数据");
    },
  },
  destroyed() {
    // 销毁监听
    this.socket.onclose = function () {
      console.log("销毁监听,WebSocket已关闭");
    };
  },
};
</script>