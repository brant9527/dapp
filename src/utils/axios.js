import axios from 'axios';
import {
    message
} from 'antd';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
const window = window
const http = axios.create({
    baseURL: 'http://18.204.56.84:8060/', // 从.env变量中读取的后台url地址
    timeout: 30000, // 超时时长5分钟,
    crossDomain: true
});

http.defaults.headers.post['Content-Type'] = 'multipart/form-data;application/json;charset=UTF-8;';

// 当前正在请求的数量
let needLoadingRequestCount = 0;

// 显示loading
function showLoading(target) {
    if (needLoadingRequestCount === 0) {
        NProgress.start();
    }
    needLoadingRequestCount++;
}

// 隐藏loading
function hideLoading() {
    needLoadingRequestCount--;
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); // 做个保护
    if (needLoadingRequestCount === 0) {
        NProgress.done();
    }
}

// 添加请求拦截器
let tempConfig = '';
http.interceptors.request.use(
    config => {
        // 判断当前请求是否设置了不显示Loading
        tempConfig = config;
        tempConfig.url = decodeURI(encodeURI(tempConfig.url).replace('%E2%80%8B', ''));
        if (config.headers.showLoading !== false) {
            showLoading(config.headers.loadingTarget);
        }
        const {
            token
        } = window.localStorage.getItem('token');
        if (token) {
            config.headers.common.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    err => {
        // 判断当前请求是否设置了不显示Loading
        if (tempConfig.headers.showLoading !== false) {
            hideLoading();
        }
        // console.log('timeout')
        return Promise.resolve(err);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {
        // 判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
        if (response.config.headers.showLoading !== false) {
            hideLoading();
        }
        return response;
    },
    error => {
        hideLoading();
        if (error.response && error.response.status) {
            switch (error.response.status) {
                case 401:
                    // 如有刷新token的需求,可放开以下代码
                    // var config=error.config;
                    // refreshTokenFuc(isRefreshToken, config, retryRequests);
                    message.error('登录信息已过期，请重新登录!');
                    break;
                default:
                    break;
            }
            return Promise.reject(error.response);
        }
        return Promise.reject(error.response);
    }
);

export default http;