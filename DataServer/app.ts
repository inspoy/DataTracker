const net = require("net");
const conf = require("./conf");
const utils = require("./Utils");
const mysql = require("mysql");
const conn = mysql.createConnection({
    host: conf.databaseHost,
    user: conf.databaseUser,
    password: conf.databasePass,
    database: conf.databaseName
});

/**
 * 转义字符串，用于SQL语句
 * @param raw
 */
const escapeString = function (raw) {
    return raw.replace(/'/g, '\'\'');
}

/**
 * 写入到数据库
 * @param rawObj 原始数据
 */
const insertToDatabase = function (rawObj) {
    try {
        const q = `
INSERT INTO Data
    ( uid, user_name, session_id, event_name, event_data, upload_time )
VALUES
    ( '${escapeString(rawObj["uid"])}', '${escapeString(rawObj["userName"])}', '${rawObj["sessionId"]}', '${rawObj["data"]["EventName"]} ', '${escapeString(JSON.stringify(rawObj["data"]))}', FROM_UNIXTIME( ${rawObj["sendTime"]} ) )
`;
        console.log(q);
        conn.query(q, function (error, results, fields) {
            if (error) {
                console.log("写入数据库出错" + error);
            };
        });
    }
    catch (e) {
        console.log("写入数据库出错" + e);
    }
}

/**
 * 有新连接时
 * @param socket socket对象
 */
const onSocket = function (socket) {
    socket.uid = utils.getRandomString("socket_");
    //console.log(
    //    "有新的连接:\n" +
    //    "- address: " + socket["remoteAddress"] + "\n" +
    //    "-    port: " + socket["remotePort"] + "\n" +
    //    "-      id: " + socket["uid"]
    //);
    socket.on("data", function (data) {
        console.log("接收到了来自" + socket.uid + "的数据:");
        const rawObj = JSON.parse(data);
        const eventData = rawObj["data"];
        console.log(
            "-   uid: " + rawObj["uid"] + "\n" +
            "- event: " + eventData["EventName"] + "\n" +
            "-  data: " + JSON.stringify(eventData)
        );
        insertToDatabase(rawObj);
    });
    socket.on("end", function () {
        console.log("连接断开: " + socket.uid);
    });
    socket.on("close", function (had_error) {
        if (had_error) {
            console.log("socket关闭时出错")
        }
    });
    socket.on("error", function (err) {
        console.log("socket出错: " + err)
    });
};

const startServer = function () {
    const server = net.createServer(onSocket);
    server.on("error", function (err) {
        console.log("TCP Server Error: " + err);
    });
    server.listen(conf.serverPort);
    console.log("TCP Server Started");
}

/**
 * 程序入口
 */
const main = function () {
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
            conn.query(`
CREATE TABLE Data  (
  id int(32) NOT NULL AUTO_INCREMENT,
  uid varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  user_name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  session_id varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  event_name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  event_data varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  upload_time datetime NOT NULL,
  PRIMARY KEY (id),
  INDEX uid(uid) USING HASH,
  INDEX event_name(event_name) USING HASH
) ENGINE = InnoDB;
`, function (error, results, fields) {
                    if (error) {
                        throw error;
                    };
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