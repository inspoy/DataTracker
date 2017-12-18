/**
 * 生成随机字符串
 * @param prefix 前缀
 * @param len 不算前缀的长度
 */
exports.getRandomString = function(prefix = "", len = 16) {
    let ret = "";
    for (let i = 0; i < len; ++i) {
        let randVal = Math.random() * 52;
        let charCode = 0;
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