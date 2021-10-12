import { Notification } from 'element-ui';

function createWebcosket(socketUrl) {
    var wbsocket = new WebSocket(socketUrl);
    //心跳检测
    var heartCheck = {
        failCount: 0,
        timeout: 5000,        //15秒发一次心跳
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
            clearTimeout(this.timeoutObj);
            clearTimeout(this.serverTimeoutObj);
            return this;
        },
        start: function () {
            var self = this;
            this.timeoutObj = setInterval(function () {
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                //onmessage拿到返回的心跳就说明连接正常
                // console.log('ping')
                if (wbsocket.readyState == wbsocket.OPEN) {
                    wbsocket.send("ping");
                } else {
                    self.failCount++;
                    console.log("失败次数", self.failCount)
                }
                if (self.failCount >= 3) {
                    console.log("重新创建连接,socketUrl:", socketUrl)
                    wbsocket = new WebSocket(socketUrl);
                    // wbsocket.onopen()
                    wbsocketinit(wbsocket)
                    self.failCount = 0;
                }
                // self.serverTimeoutObj = setTimeout(function () {//如果超过一定时间还没重置，说明后端主动断开了
                //   wbsocket.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                // }, self.timeout)
            }, this.timeout)
        }
    }


    function wbsocketinit(wbsocket) {
        // 监听socket打开
        wbsocket.onopen = function () {
            //心跳
            heartCheck.reset().start();
            console.log("浏览器WebSocket已打开");
        };
        // 监听socket消息接收
        wbsocket.onmessage = function (msg) {
            console.log("接受到的数据", msg);
            // 转换为json对象
            const data = JSON.parse(msg.data);
            Notification({
                title: "新消息",
                message: data,
                type: "success",
                duration: 3000
            });
        };
        // 监听socket错误
        wbsocket.onerror = function (e) {
            Notification({
                title: "错误",
                message: "服务器错误，无法接收实时报警信息",
                type: "error",
                duration: 5000,
            });
        };
        // 监听socket关闭
        wbsocket.onclose = function () {
            console.log("WebSocket已关闭");
        };
    }

    wbsocketinit(wbsocket);
}

export default createWebcosket