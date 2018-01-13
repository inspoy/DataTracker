const net = require("net");
const conf = require("./conf");
const utils = require("./Utils");
const mysql = require("mysql");
const pool = mysql.createPool({
    host: conf.databaseHost,
    user: conf.databaseUser,
    password: conf.databasePass,
    database: conf.databaseName
});

/**
 * 输出带时间戳的日志
 * @param msg 内容
 */
const logMessage = function (msg) {
    console.log(`[${(new Date()).Format("yy-MM-dd hh:mm:ss.SSS")}] - ${msg}`);
}

/**
 * 给Date添加Format的方法，可以给日期进行格式化
 * @param fmt 示例：(new Date()).Format("yy-MM-dd hh:mm:ss.SSS")=>"17-4-10 17:42:48.233"
 */
Date.prototype.Format = function (fmt) {
    const ms = this.getMilliseconds();
    const o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "S": ms > 100 ? ms : (ms > 10 ? "0" + ms : "00" + ms) //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(
            RegExp.$1,
            (RegExp.$1.length == 1) ?
                (o[k]) :
                (("00" + o[k]).substr(("" + o[k]).length))
        );
    }
    return fmt;
};

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
 * @param addr 客户端IP地址
 */
const insertToDatabase = function (rawObj, addr) {
    try {
        const q = `
INSERT INTO Data
    ( uid, user_name, session_id, event_name, event_data, addr, upload_time )
VALUES
    ( '${escapeString(rawObj["uid"])}', '${escapeString(rawObj["userName"])}', '${rawObj["sessionId"]}', '${rawObj["data"]["EventName"]} ', '${escapeString(JSON.stringify(rawObj["data"]))}', '${addr}', NOW() )
`;
        // logMessage(q);
        pool.getConnection(function (err, conn) {
            if (err) {
                logMessage("获取数据库连接出错" + err);
            }
            conn.query(q, function (error, results, fields) {
                conn.release();
                if (error) {
                    logMessage("执行写入数据库出错" + error);
                }
                ;
            });
        });
    }
    catch (e) {
        logMessage("写入数据库出错" + e);
    }
}

/**
 * 有新连接时
 * @param socket socket对象
 */
const onSocket = function (socket) {
    socket.uid = utils.getRandomString("socket_");
    //logMessage(
    //    "有新的连接:\n" +
    //    "- address: " + socket["remoteAddress"] + "\n" +
    //    "-    port: " + socket["remotePort"] + "\n" +
    //    "-      id: " + socket["uid"]
    //);
    socket.on("data", function (data) {
        logMessage("接收到了来自" + socket.uid + "的数据:");
        try {
            const rawObj = JSON.parse(data);
            const eventData = rawObj["data"];
            logMessage("\n" +
                "-  addr: " + socket["remoteAddress"] + "\n" +
                "-   uid: " + rawObj["uid"] + "\n" +
                "- event: " + eventData["EventName"] + "\n" +
                "-  data: " + JSON.stringify(eventData)
            );
            insertToDatabase(rawObj, socket["remoteAddress"]);
        }
        catch (e) {
            logMessage("出现错误,解析json失败" + e);
            logMessage("原始数据：" + data);
        }
    });
    socket.on("end", function () {
        logMessage("连接断开: " + socket.uid);
    });
    socket.on("close", function (had_error) {
        if (had_error) {
            logMessage("socket关闭时出错")
        }
    });
    socket.on("error", function (err) {
        logMessage("socket出错: " + err)
    });
};

const startServer = function () {
    const server = net.createServer(onSocket);
    server.on("error", function (err) {
        logMessage("TCP Server Error: " + err);
    });
    server.listen(conf.serverPort, "0.0.0.0");
    logMessage("TCP Server Started");
}

/**
 * 程序入口
 */
const main = function () {
    logMessage("正在连接数据库...");
    pool.getConnection(function (err, conn) {
        if (err) {
            logMessage("初始化数据库连接失败");
            process.exit();
        }
        onConnect(conn);
    });
}

const onConnect = function (conn) {
    logMessage("连接数据库成功");
    conn.query("SHOW TABLES LIKE 'Data'", function (error, results, fields) {
        if (error) {
            throw error;
        }
        if (results.length == 0) {
            logMessage("第一次运行，正在初始化...");
            conn.query(`
CREATE TABLE Data  (
  id int(32) NOT NULL AUTO_INCREMENT,
  uid varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  user_name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  session_id varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  event_name varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  event_data text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  addr varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  upload_time datetime NOT NULL,
  PRIMARY KEY (id),
  INDEX uid(uid) USING HASH,
  INDEX event_name(event_name) USING HASH
) ENGINE = InnoDB;
`, function (error, results, fields) {
                if (error) {
                    throw error;
                }
                ;
                logMessage("初始化完毕，请重新运行");
                process.exit();
            });
        }
        else {
            startServer();
        }
        conn.release();
    });
};

main();