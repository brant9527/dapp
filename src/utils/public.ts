import Decimal from "decimal.js";
import numeral from "numeral";
import dayjs from "dayjs";
const reg = /^0.(0*)\d+$/;

// 返回小数位后几位 截取
// number 数值
// p 位数
export function toFixed(number: any, pp: any = 2) {
  let num = isNaN(number) || !number ? 0 : number;
  const p = isNaN(pp) || !pp ? 0 : pp;
  num = getFullNum(num);
  var n = (num + "").split("."); // eslint-disable-line
  var x = n.length > 1 ? n[1] : ""; // eslint-disable-line
  if (x.length > p) {
    // eslint-disable-line
    x = x.substr(0, p); // eslint-disable-line
  } else {
    // eslint-disable-line
    x += Array(p - x.length + 1).join("0"); // eslint-disable-line
  } // eslint-disable-line
  return n[0] + (x == "" ? "" : "." + x); // eslint-disable-line
}
export function fixPrice(num: any, pp = 2) {
  const result = Number(num);
  if (!num || num === "0") {
    return toFixed(0, pp);
  }
  if (result > 100) {
    return numeral(num).format("0,0.00");
  } else if (result < 100 && result > 10) {
    return numeral(num).format("0,0.000");
  } else if (result < 10 && result > 1) {
    return numeral(num).format("0,0.0000");
  } else {
    return numeral(num).format("0,0.00000");
  }
}
// 科学计数法转数值 - 处理 1e-7 这类精度问题
export function getFullNum(num: any) {
  // 处理非数字
  if (isNaN(num)) {
    return num;
  }
  // 处理不需要转换的数字
  const str = String(num);
  if (!/e/i.test(str)) {
    return num;
  }
  return Number(num)
    .toFixed(18)
    .replace(/\.?0+$/, "");
}

/*
 ** 加法函数，用来得到精确的加法结果
 ** 返回值：arg1 + arg2的精确结果 Number 型
 */
export function accAdd(arg1: any, arg2: any) {
  const num = new Decimal(arg1).add(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

/*
 ** 减法函数，用来得到精确的减法结果
 ** 返回值：arg1 - arg2的精确结果 Number 型
 */
export function accSub(arg1: any, arg2: any) {
  const num = new Decimal(arg1).sub(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

/*
 ** 乘法函数，用来得到精确的乘法结果
 ** 返回值：arg1 * arg2的精确结果 Number 型
 */
export function accMul(arg1: any, arg2: any) {
  if (!arg1 || !arg2) {
    return 0;
  }
  const num = new Decimal(arg1).mul(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

/*
 ** 除法函数，用来得到精确的除法结果
 ** 返回值：arg1 / arg2的精确结果 Number 型
 */
export function accDiv(arg1: any, arg2: any) {
  if (!arg1 || !arg2) {
    return 0;
  }
  const num = new Decimal(arg1).div(new Decimal(arg2));
  // const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/); // eslint-disable-line
  // const kx = num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
  return num.toFixed();
}

// 解析url参数为数据字典
export function getUrlParams(url: string) {
  const urlList = url.split("?") || [];
  const params: any = {};
  let paramsList: Array<string> = [];
  if (urlList[1]) {
    paramsList = urlList[1].split("&");
  }
  for (let index = 0; index < paramsList.length; index++) {
    const paramsTemp = paramsList[index].split("=");
    const key = paramsTemp[0];
    const value = paramsTemp[1];
    params[key] = value;
  }

  return params;
}

// 判断是否为ios
export function isIOS() {
  const u = navigator.userAgent;
  const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  return isIos;
}

// 被内嵌使用
export function getTargetOrigin() {
  const embedUrl = sessionStorage.getItem("swapEmbedUrl");
  if (embedUrl) {
    const paUrl = JSON.parse(embedUrl);
    const targetOrigin = decodeURIComponent(paUrl.origin);
    return targetOrigin;
  }
  const paUrl = getUrlParams(window.location.href);
  sessionStorage.setItem("swapEmbedUrl", JSON.stringify(paUrl));
  const targetOrigin = decodeURIComponent(paUrl.origin);
  return targetOrigin;
}
// 倒计时
export function countdown(endtime: any, begintime: any) {
  const btime = begintime || Date.parse(new Date().toString());
  const t = Date.parse(endtime) - btime;
  const days = Math.floor(t / (1000 * 60 * 60 * 24)).toString();
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24).toString();
  let minutes = Math.floor((t / 1000 / 60) % 60).toString();
  let seconds = Math.floor((t / 1000) % 60).toString();
  hours = Number(hours) >= 10 ? hours : `0${hours}`;
  minutes = Number(minutes) >= 10 ? minutes : `0${minutes}`;
  seconds = Number(seconds) >= 10 ? seconds : `0${seconds}`;
  if (t <= 0) {
    return {
      total: t,
      days: 0,
      hours: "00",
      minutes: "00",
      seconds: "00",
    };
  }
  return { total: t, days, hours, minutes, seconds };
}

// 账号隐藏处理
export function simpleAddress(address: any, len: any) {
  const leng = len || 5;
  return (
    address.substring(0, leng) +
    "......" +
    address.substring(address.length - leng, address.length)
  );
}

/**
 * 获取storage.getItem
 * name 存储名称
 * fdt(option) 没获取到时的默认值
 */
export function localStorageGet(name: string, fdt: any) {
  const defalut = fdt || {};
  const flg =
    !window.localStorage.getItem(name) ||
    window.localStorage.getItem(name) === undefined ||
    window.localStorage.getItem(name) === "undefined" ||
    window.localStorage.getItem(name) === "null";
  return flg ? defalut : JSON.parse(window.localStorage.getItem(name) || "{}");
}

/**
 * 获取session.getItem
 * name 存储名称
 * fdt(option) 没获取到时的默认值
 */
export function sessionStorageGet(name: any, fdt: any) {
  const defalut = fdt || {};
  const flg =
    !window.sessionStorage.getItem(name) ||
    window.localStorage.getItem(name) === undefined ||
    window.sessionStorage.getItem(name) === "undefined" ||
    window.sessionStorage.getItem(name) === "null";
  return flg
    ? defalut
    : JSON.parse(window.sessionStorage.getItem(name) || "{}");
}
// 将科学计数法转换为小数
export function toNonExponential(num: any, l: any) {
  if (num === null) {
    return 0;
  }
  if (isNaN(num)) {
    return 0;
  }
  const fnum = new Decimal(num);
  if (l) {
    return fnum.toFixed(l);
  }
  return fnum.toFixed();
}
// 位数分割 128,373,883
export function numeralFormat(num: number, p: number) {
  const value = toNonExponential(num * 1, p);
  if (Number(value).toFixed() === "0") {
    return value;
  }
  let xstr = "0";
  if (p) {
    xstr = "0.";
    for (let i = 0; i < p; i++) {
      // eslint-disable-line
      xstr += "0"; // eslint-disable-line
    }
  }
  if (p === 0) {
    return numeral(value).format("0,0");
  }
  return numeral(value).format(`0,${xstr}`);
}
/**
 * 優化時間
 */
export function formatTime(time: any, format?: string) {
  return dayjs(time || new Date()).format(format || "YYYY-MM-DD HH:mm:ss");
}

export function getNumSymbol(val: any) {
  const valTemp = Number(val);
  if (valTemp > 1000000000) {
    return toFixed(accDiv(valTemp, 1000000000)) + "B";
  } else if (valTemp > 1000000) {
    return toFixed(accDiv(valTemp, 1000000)) + "M";
  } else if (valTemp > 1000) {
    return toFixed(accDiv(valTemp, 1000)) + "K";
  }
  return toFixed(valTemp);
}
