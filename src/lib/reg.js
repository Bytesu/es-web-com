/**
 * ref: https://www.jb51.net/article/72192.htm
 */
export const Regs = {
    hans: /^[u4e00-u9fa5]$/,// chinese word
    digit: /^[0-9]$/, //digit num
    doublebyte: /^[^x00-xff]$/, //double byte word including chinese word
    blankrow: /^ns*r$/, //blank row
    html: /^< (S*?)[^>]*>.*?|< .*? \>$/, //html markup
};
export const RegsFn = {
    isDigit(s) { // digit reg
        if (!Regs.digit.exec(s)) return false
        return true
    },

}
