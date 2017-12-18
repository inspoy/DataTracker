/**
 * 生成随机字符串
 * @param prefix 前缀
 * @param len 不算前缀的长度
 */
exports.getRandomString = function (prefix, len) {
    if (prefix === void 0) { prefix = ""; }
    if (len === void 0) { len = 16; }
    var ret = "";
    for (var i = 0; i < len; ++i) {
        var randVal = Math.random() * 52;
        var charCode = 0;
        if (randVal > 26) {
            charCode = randVal + 71;
        }
        else {
            charCode = randVal + 65;
        }
        ret += String.fromCharCode(charCode);
    }
    return prefix + ret;
};
//# sourceMappingURL=Utils.js.map