const net = require("net");
const utils = require("./Utils");

/**
 * 有新连接时
 * @param socket socket对象
 */
const onSocket = function(socket) {
    socket.uid = utils.getRandomString("socket_");
    console.log(
        "有新的连接:\n" +
        "- address: " + socket["remoteAddress"] + "\n" +
        "-    port: " + socket["remotePort"] + "\n" +
        "-      id: " + socket["uid"]
    );
    socket.on("data", function(data) {
        console.log("接收到了来自" + socket.uid + "的数据:");
        const rawObj = JSON.parse(data);
        const eventData = rawObj["data"];
        console.log(
            "-   uid: " + rawObj["uid"] + "\n" +
            "- event: " + eventData["EventName"] + "\n" +
            "-  data: " + JSON.stringify(eventData)
        );
    });
    socket.on("end", function() {
        console.log("连接断开: " + socket.uid);
    });
    socket.on("close", function(had_error) {
        if (had_error) {
            console.log("socket关闭时出错")
        }
    });
    socket.on("error", function(err) {
        console.log("socket出错: " + err)
    });
};

/**
 * 程序入口
 */
const main = function() {
    const server = net.createServer(onSocket);
    server.on("error", function(err) {
        console.log("TCP Server Error: " + err);
    });
    server.listen(62849);
    console.log("TCP Server Started");
};

main();