class Util {
    /* 
    *js Unicode编码转换 
    */
    static str2Unicode(str) {
        var es = [];
        for (var i = 0; i < str.length; i++)
            es[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        return "\\u" + es.join("\\u");
    }
}

export default Util