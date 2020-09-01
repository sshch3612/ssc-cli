import axios from "axios";

// 数据请求地址  配置
export const baseURL = "/api/";

const request = axios.create({
    baseURL: baseURL,
    timeout: 600000,
});

let pending = []; // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken;
let removePending = (ever) => {
    // eslint-disable-next-line
    for (let p in pending) {
        if (pending[p].u === ever.url + "&" + ever.method) {
            // 当当前请求在数组中存在时执行函数体
            pending[p].f(); // 执行取消操作
            pending.splice(p, 1); // 把这条记录从数组中移除
        }
    }
};
// 添加请求拦截器
request.interceptors.request.use(
    function (config) {
        // 跨域
        // config.withCredentials = true;
        removePending(config); // 在一个ajax发送前执行一下取消操作

        if (config.headers.noPending) {
            config.cancelToken = new CancelToken((c) => {
                // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
                pending.push({ u: config.url + "&" + config.method, f: c });
            });
        }
        return config;
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
// 添加响应拦截器
request.interceptors.response.use(
    function (response) {
        removePending(response.config); // 在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
        if (response.status === 200) {
            return Promise.resolve(response.data);
        }
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default request;

