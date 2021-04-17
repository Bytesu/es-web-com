var idIndex = 0;

export function genId(prefix) {
    return (`${prefix}`) + (idIndex++)
}

export function genDefaultId() {
    return genId('Famulei')
}

export const oneSec = 1000;
export const oneMin = oneSec * 60;
export const oneHour = oneMin * 60;
export const oneDay = oneHour * 24;

export function getTimeZone(timezone) {
    var offset_GMT = new Date().getTimezoneOffset();
    var nowDate = new Date().getTime();
    var targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    return targetDate;
}

export const DateTypes = {
    DAY: 'day',
    HOUR: 'hour',
};
export const DOWN_ZERO = "00:00:00";

function prependZero(num) {
    return (parseInt(`${num}`) < 10 ? `0${num}` : num)
}

/**
 * time left in countdown
 * arg {
 *     startTime,
 *     type : day -> day:hour:min, hour-> hour:min:sec
 * }
 * @returns {string} h:m:s
 */
export const genCountDownTime = function (opt = {}) {
    opt = {
        startTime: "2021-2-2 15:3:0",
        type: 'day',
        offset: -5,
        ...opt
    };
    const [date, time] = opt.startTime.split(" ");
    const remain = (new Date(
        parseInt(date.split('-')[0]),
        parseInt(date.split('-')[1]) - 1,
        parseInt(date.split('-')[2]),
        parseInt(time.split(":")[0]),
        parseInt(time.split(":")[1]), 0).getTime()) - getTimeZone(opt.offset).getTime();
    if (remain < 0) {
        return DOWN_ZERO
    }
    const day = parseInt(`${remain / oneDay}`),
        hour = parseInt(`${(remain - day * oneDay) / oneHour}`),
        min = parseInt(`${(remain - day * oneDay - hour * oneHour) / oneMin}`),
        sec = parseInt(`${(remain - day * oneDay - hour * oneHour - min * oneMin) / oneSec}`)
    ;
    const res = opt.type === DateTypes.DAY ? [day, hour, min,] : [hour + day * 24, min, sec];

    return res.map(item => prependZero(item)).join(':');
};

export function isArray(obj) {
    return obj instanceof Array;
}

export function arrayToPluckObjFn(arr = [], keyField, vField = "") {
    if (arr.length === 0) return {};
    return arr.reduce((obj, current) => {
        if (current instanceof Array) {
            obj = {...obj, ...arrayToPluckObjFn(current, keyField, vField)}
        } else {
            obj[current[keyField]] = vField ? (current[vField] || '') : current;
        }
        return obj
    }, {});
}

export function isAsyncFn(func) {
    return `${func.constructor}`.contain('AsyncFunction')
}