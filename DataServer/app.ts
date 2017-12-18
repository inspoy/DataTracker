const net = require("net");

/**
 * 有新连接时
 * @param socket socket对象
 */
const onSocket = function(socket) {
    console.log(
        "有新的连接:\n" +
        "- address: " + socket["remoteAddress"] + "\n" +
        "-    port: " + socket["remotePort"] + "\n"
    );
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