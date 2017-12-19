var net = require("net");
var conf = require("./conf");
var utils = require("./Utils");
var mysql = require("mysql");
var conn = mysql.createConnection({
    host: conf.databaseHost,
    user: conf.databaseUser,
    password: conf.databasePass,
    database: conf.databaseName
});
/**
 * 转义字符串，用于SQL语句
 * @param raw
 */
var escapeString = function (raw) {
    return raw.replace(/'/g, '\'\'');
};
/**
 * 写入到数据库
 * @param rawObj 原始数据
 */
var insertToDatabase = function (rawObj) {
    try {
        var q = "\nINSERT INTO Data\n    ( uid, user_name, event_name, event_data, upload_time )\nVALUES\n    ( '" + escapeString(rawObj["uid"]) + "', '" + escapeString(rawObj["userName"]) + "', '" + rawObj["data"]["EventName"] + " ', '" + escapeString(JSON.stringify(rawObj["data"])) + "', FROM_UNIXTIME( " + rawObj["sendTime"] + " ) )\n";
        console.log(q);
        conn.query(q, function (error, results, fields) {
            if (error) {
                console.log("写入数据库出错" + error);
            }
            ;
        });
    }
    catch (e) {
        console.log("写入数据库出错" + e);
    }
};
/**
 * 有新连接时
 * @param socket socket对象
 */
var onSocket = function (socket) {
    socket.uid = utils.getRandomString("socket_");
    //console.log(
    //    "有新的连接:\n" +
    //    "- address: " + socket["remoteAddress"] + "\n" +
    //    "-    port: " + socket["remotePort"] + "\n" +
    //    "-      id: " + socket["uid"]
    //);
    socket.on("data", function (data) {
        console.log("接收到了来自" + socket.uid + "的数据:");
        var rawObj = JSON.parse(data);
        var eventData = rawObj["data"];
        console.log("-   uid: " + rawObj["uid"] + "\n" +
            "- event: " + eventData["EventName"] + "\n" +
            "-  data: " + JSON.stringify(eventData));
        insertToDatabase(rawObj);
    });
    socket.on("end", function () {
        console.log("连接断开: " + socket.uid);
    });
    socket.on("close", function (had_error) {
        if (had_error) {
            console.log("socket关闭时出错");
        }
    });
    socket.on("error", function (err) {
        console.log("socket出错: " + err);
    });
};
var startServer = function () {
    var server = net.createServer(onSocket);
    server.on("error", function (err) {
        console.log("TCP Server Error: " + err);
    });
    server.listen(conf.serverPort);
    console.log("TCP Server Started");
};
/**
 * 程序入口
 */
var main = function () {
    console.log("正在连接数据库...");
    conn.connect();
    console.log("连接数据库成功");
    conn.query("SHOW TABLES LIKE 'Data'", function (error, results, fields) {
        if (error) {
            throw error;
        }
        var a = [1, 2, 3];
        if (results.length == 0) {
            console.log("第一次运行，正在初始化...");
            conn.query("\nCREATE TABLE Data  (\n  id int(32) NOT NULL AUTO_INCREMENT,\n  uid varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,\n  user_name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,\n  event_name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,\n  event_data varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,\n  upload_time datetime NOT NULL,\n  PRIMARY KEY (id),\n  INDEX uid(uid) USING HASH,\n  INDEX event_name(event_name) USING HASH\n) ENGINE = InnoDB;\n", function (error, results, fields) {
                if (error) {
                    throw error;
                }
                ;
                console.log("初始化完毕，请重新运行");
                process.exit();
            });
        }
        else {
            startServer();
        }
    });
};
main();
//# sourceMappingURL=app.js.map