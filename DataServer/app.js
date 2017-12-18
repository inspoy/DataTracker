var net = require("net");
/**
 * 有新连接时
 * @param socket socket对象
 */
var onSocket = function (socket) {
    console.log("有新的连接:\n" +
        "- address: " + socket["remoteAddress"] + "\n" +
        "-    port: " + socket["remotePort"] + "\n");
};
/**
 * 程序入口
 */
var main = function () {
    var server = net.createServer(onSocket);
    server.on("error", function (err) {
        console.log("TCP Server Error: " + err);
    });
    server.listen(62849);
    console.log("TCP Server Started");
};
main();
//# sourceMappingURL=app.js.map