import { Notification } from 'element-ui';

const vwebsocket = {}
/**
 * 
 * @param {*} socketUrl websocket url
 * @param {*} heartCheck 是否开启心跳检测
 * @param {*} timeout 重试间隔 ms 默认15秒
 * @param {*} failCount 重试次数
 * @returns 
 */
vwebsocket.createWebcosket = (socketUrl, heartCheck, timeout, failCount) => {
    var wbsocket = new WebSocket(socketUrl);

    //心跳检测
    var heartCheckFun = {
        fail: 0,
        timeout: timeout ? timeout : 15000,  //15秒发一次心跳
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
                    self.fail++;
                    console.log("重试次数", self.fail)
                }
                if (self.fail >= (failCount ? failCount : 3)) {
                    // wbsocket.close();
                    // console.log("重新创建连接,socketUrl:", socketUrl)
                    wbsocket = new WebSocket(socketUrl);
                    // wbsocket.onopen()
                    wbsocketinit(wbsocket)
                    self.fail = 0;
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
            if (heartCheck) {
                //心跳检测
                heartCheckFun.reset().start();
            }
            console.log("浏览器WebSocket已打开，", wbsocket);
        };
        // 监听socket消息接收
        wbsocket.onmessage = function (msg) {
            console.log("接受到的数据", msg);
            // 转换为json对象
            var data = {}
            try {
                data = JSON.parse(msg.data);
            } catch (e) {
                data.type = 1;
                data.value = msg.data;
            }
            shouwData(data)
        };
        // 监听socket错误
        wbsocket.onerror = function (e) {
            console.log(onerror, e)
            Notification({
                title: "错误",
                message: "服务器错误，无法接收实时报警信息",
                type: "error",
                duration: 5000,
            });
        };
        // 监听socket关闭
        wbsocket.onclose = function (e) {
            // 1000	CLOSE_NORMAL	正常关闭; 无论为何目的而创建, 该链接都已成功完成任务.
            // 1001	CLOSE_GOING_AWAY	终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开.
            // 1002	CLOSE_PROTOCOL_ERROR	由于协议错误而中断连接.
            // 1003	CLOSE_UNSUPPORTED	由于接收到不允许的数据类型而断开连接(如仅接收文本数据的终端接收到了二进制数据).
            // 1004		保留.其意义可能会在未来定义.
            // 1005	CLOSE_NO_STATUS	保留.表示没有收到预期的状态码.
            // 1006	CLOSE_ABNORMAL	保留.用于期望收到状态码时连接非正常关闭(也就是说, 没有发送关闭帧).
            // 1007	Unsupported Data	由于收到了格式不符的数据而断开连接(如文本消息中包含了非 UTF - 8 数据).
            // 1008	Policy Violation	由于收到不符合约定的数据而断开连接.这是一个通用状态码, 用于不适合使用 1003 和 1009 状态码的场景.
            // 1009	CLOSE_TOO_LARGE	由于收到过大的数据帧而断开连接.
            // 1010	Missing Extension	客户端期望服务器商定一个或多个拓展, 但服务器没有处理, 因此客户端断开连接.
            // 1011	Internal Error	客户端由于遇到没有预料的情况阻止其完成请求, 因此服务端断开连接.
            // 1012	Service Restart	服务器由于重启而断开连接.
            // 1013	Try Again Later	服务器由于临时原因断开连接, 如服务器过载因此断开一部分客户端连接.
            // 1014		由 WebSocket标准保留以便未来使用.
            // 1015	TLS Handshake	保留.表示连接由于无法完成 TLS 握手而关闭(例如无法验证服务器证书).


            //reason 表示服务器关闭连接的原因. 这是由服务器和子协议决定的.
            // wasClean 表示连接是否完全关闭.
            console.log('websocket关闭 =====》 code: ' + e.code + '，reason: ' + e.reason + '，wasClean: ' + e.wasClean)
            // console.log('websocket关闭 e: ', e)
            // if (e.code == 1006 || e.code == 1002) {
            //     console.log("关闭心跳检测")
            //     heartCheckFun.reset()
            // }
        };
    }

    wbsocketinit(wbsocket);

    return wbsocket
}


function shouwData(data) {
    if (data.type == '1') {
        Notification({
            title: "新xxx消息",
            message: data.value,
            type: "success",
            duration: 3000
        });
    } else {
        Notification({
            title: "新消息",
            message: data,
            type: "success",
            duration: 3000
        });
    }
}
export default vwebsocket