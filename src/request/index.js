const axios = require('axios').default;
axios.timeout = 5000;
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers = {
    'Authorization': 'f3eb19a27615ee6efed20e23e3a0741863c18dc1'
};
export const ConstCode = {
    OK: 200,
    ERR: -1
}
const CancelToken = axios.CancelToken,
    currentRequest = {};
// abort the same request
const abortPending = (urlstr) => {
    if (currentRequest[urlstr]) {
        currentRequest[urlstr]()
        delete currentRequest[urlstr];
    }
}

function genUniqueUrlStr(config) {
    let data = config.data || {},
        datas = [];
    for (let key in data) {
        datas.push(key + '=' + (typeof data[key] == 'object' ? JSON.stringify(data[key]) : data[key]));
    }
    return [
        config.method,
        config.url,
        datas.sort().join('&')
    ].join('-')
}

//http request interceptor
axios.interceptors.request.use(
    config => {
        //prevent duplicate request
        let urlStr = genUniqueUrlStr(config);
        abortPending(urlStr); //
        config.cancelToken = new CancelToken((c) => {
            currentRequest[urlStr] = c
        });
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

/**
 * abort request manually
 * @param method
 * @param url
 * @param param
 */
export function abortRequest(method, url, param = {}) {
    let urlStr = genUniqueUrlStr({
        method,
        url, data: param
    });
    abortPending(urlStr);
}


export function postFn(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data || {})
            .then(function (response) {
                console.log(response);
                resolve({
                    code: ConstCode.OK,
                    data: response.data
                })
            })
            .catch(err => {
                let resp = err.response || {data: {message: '获取数据失败'}};
                reject({
                    code: ConstCode.ERR,
                    status: resp.status || ConstCode.ERR,
                    statusText: resp.statusText || '未返回statusText',
                    msg: err.message || '错误提示',
                    ...resp.data,
                })
            })
    })
}



