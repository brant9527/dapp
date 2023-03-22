import axios, { CreateAxiosDefaults } from "axios";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Toast from "@/components/Toast";
const http = axios.create({
  baseURL: "http://18.204.56.84:8060/", // 从.env变量中读取的后台url地址
  timeout: 30000, // 超时时长5分钟,
});

http.defaults.headers.post["Content-Type"] = "application/json";

// 当前正在请求的数量
let needLoadingRequestCount = 0;

// 显示loading
function showLoading() {
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
let tempConfig: any = {};
http.interceptors.request.use(
  (config) => {
    // 判断当前请求是否设置了不显示Loading
    tempConfig = config;
    // tempConfig.url = decodeURI(encodeURI(tempConfig.url).replace('%E2%80%8B', ''));
    if (config.headers.showLoading !== false) {
      showLoading();
    }

    const account = window.localStorage.getItem("account");

    if (account) {
      config.headers.account = account;
      config.headers.language = "en";
      config.headers.mock = 0;
    }
    return config;
  },
  (err) => {
    // 判断当前请求是否设置了不显示Loading
    if (tempConfig.headers.showLoading !== false) {
      hideLoading();
    }
    console.log("timeout");
    return Promise.resolve(err);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if (response.config.headers.showLoading !== false) {
      hideLoading();
    }
    const { code, msg } = response.data;
    console.log(response.data);
    if (code != 0) {
      Toast.notice(msg, {});
    }
    return response.data;
  },
  (error) => {
    hideLoading();
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          // 如有刷新token的需求,可放开以下代码
          // var config=error.config;
          // refreshTokenFuc(isRefreshToken, config, retryRequests);
          break;
        default:
          break;
      }
      Toast.notice(error.response.msg, {});

      return Promise.reject(error.response);
    }
    return Promise.reject(error.response);
  }
);

export default http;
