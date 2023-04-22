/* eslint-disable */
// .自选：getUserCollectList  参数：account,tradeType   json格式
//     tradeType包含：delivery-交割，swap-永续，spot-现货
//     2.热门：getHotList 无参数
//     3.新币：getNewSymbolList   无参数
//     4.涨幅榜：getRiseSymbolList  无参数
//     5.跌幅榜：getFallSymbolList   无参数
//     6.推荐位：getRecommendList   无参数

// private String symbol;

//     private String tradeType;

//     private String logo;

//     /**
//      * 成交额
//      */
//     private BigDecimal turnover;

//     /**
//      * 成交量
//      */
//     private BigDecimal volume;

//     /**
//      * 开盘价
//      */
//     private BigDecimal open;

//     /**
//      * 收盘价
//      */
//     private BigDecimal close;

//     /**
//      * 涨跌幅
//      */
//     private BigDecimal rate;

//     /**
//      * 是否是新的交易对 0否，1是
//      */
//     private Integer newPair;

//     /**
//      * 是否热门，0否，1是
//      */
//     private Integer hot;

//     /**
//      * 是否是首页推荐币种，1是，0否
//      */
//     private Integer recommend;
import CFClient from "./cfws";
import moment from "moment";
import { toFixed } from "@/utils/public";
import { config } from "@/public/config";

const env = process.env.NODE_ENV;
// const hostname = '' || window.location.hostname;
let uri = config.baseUrlWs;
// if (env !== 'production') {
//   uri = `ws://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT25}/websocket`;
//   // uri = 'wss://bscdapp.newdex.io/websocket';
// }
const client = new CFClient({
  env,
  uri,
  debug: false,
});
export interface commonData {
  data: object;
  id?: string;
  type?: string;
}
const Io = {
  listener: null,
  lastSubscribe: null,
  subscribeCallback: null,
  // 交易中心 k线图部分
  cfwsKline: function (params: any, subscribe: any, callback: Function) {
    var me = this;
    let resolution = params.resolution;
    delete params.resolution;
    client.ready(function () {
      var type = resolution;

      var wsCallback = function (data: any) {
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          klines: <any>[],
        };
        /**
         *   // 时间戳，毫秒级别，必要字段
              timestamp: number,
              // 开盘价，必要字段
              open: number,
              // 收盘价，必要字段
              close: number,
              // 最高价，必要字段
              high: number,
              // 最低价，必要字段
              low: number,
              // 成交量，非必须字段
              volume: number,
              // 成交额，非必须字段，如果需要展示技术指标'EMV'和'AVP'，则需要为该字段填充数据。
              turnover: number
              
         */
        if (data.length > 0) {
          data.forEach((e: any) => {
            res.klines.push({
              timestamp: e[0] * 1,
              open: e[1] * 1,
              close: e[2] * 1,
              high: e[3] * 1,
              low: e[4] * 1,
              volume: e[5] * 1,
              turnover: Number((e[6] * 1).toFixed(0)),
            });
          });
        }
        callback(res, "all");
        res.klines = [];
      };
      // params.symbol = params.symbol.toLowerCase();
      //请求k线数据
      params.table = type;
      client.request(
        "getKlineByInterval",
        params,
        function (err: any, data: any) {
          if (err) {
            return;
          }
          wsCallback(data);
        }
      );

      if (!subscribe) return;
      client.subscribe(
        `kline.${type}.${params.symbol}`,
        params,
        function (data: any) {
          console.log("data=>", data);
          const item = {
            close: data.close * 1,
            high: data.high * 1,
            low: data.low * 1,
            open: data.open * 1,
            timestamp: data.beginTime * 1,
            volume: data.volume * 1,
            turnover: Number(toFixed(data.turnover, 0)),
          };
          const res = {
            resolution: resolution,
            symbol: params.symbol,
            klines: [item],
          };
          callback(res, "one");
        }
      );
    });
  },

  // 时间戳转换
  dataFormat(fdata: any) {
    return moment.unix(fdata).format("YYYY-MM-DD HH:mm:ss");
  },

  // 交易中心 头部信息
  cfwsHeard: function (params: any, callback: Function) {
    const symbol = params.symbol;
    client.ready(function () {
      client.subscribe(`ticker.${symbol}`, function (data: any) {
        callback(data);
      });
    });
  },

  // 请求列表数据
  getMarketList: function () {
    return new Promise((resolve, reject) => {
      client.ready(function () {
        client.request(
          /**
           * 后续新增一个symbol参数获取所有
           */
          "getMarketList",
          { symbol: null },
          function (err: any, data: any) {
            if (err) {
              resolve(null);
              return;
            }
            resolve(data);
          }
        );
      });
    });
  },
  getCommonRequest: function (router: string, paramsTemp?: Object) {
    let params = {
      account: window.localStorage.getItem("account"),
      ...paramsTemp,
    };

    return new Promise((resolve, reject) => {
      client.ready(function () {
        client.request(
          router,
          paramsTemp ? params : null,
          function (err: any, data: any) {
            if (err) {
              resolve(null);
              return;
            }
            resolve(data);
          }
        );
      });
    });
  },

  // 订阅列表数据
  subscribeMarket: function (callback: any) {
    client.ready(function () {
      client.subscribe("market.*", { symbol: null }, function (data: any) {
        callback(data);
      });
    });
  },

  // 订阅详情数据
  subscribeSymbolInfo: function (symbol: any, callback: Function) {
    client.ready(function () {
      client.subscribe(`market.${symbol}`, function (data: any) {
        callback(data);
      });
    });
  },

  // 订阅详情数据
  subscribeSymbolDepth: function (symbol: any, callback: Function) {
    client.ready(function () {
      client.subscribe(`depth.${symbol}`, function (data: any) {
        callback(data);
      });
    });
  },
  // 获取交易对的实时数据
  cfwsPricesSymbol: function (params: any, callback: Function) {
    // 订阅所有价格
    const symbol = params.symbol;
    client.ready(function () {
      let data = params;
      delete data.params;
      delete data.symbol;
      client.subscribe(`markets.${symbol}`, data, function (data: any) {
        if (!data) return;
        callback(data);
      });
    });
  },

  // 获取交易对的最新成交 10条
  getOrderLastTen: function (params: any) {
    return new Promise((resolve, reject) => {
      client.ready(function () {
        //请求k线数据
        client.request(
          "getOrderLastTen",
          params,
          function (err: any, data: any) {
            if (err) {
              resolve(null);
              return;
            }
            resolve(data);
          }
        );
      });
    });
  },
  // 订阅全网最新成交 10条
  getBscOrderLast: function (params: any) {
    return new Promise((resolve, reject) => {
      client.ready(function () {
        //请求k线数据
        client.request(
          "getBscOrderLast",
          params,
          function (err: any, data: any) {
            if (err) {
              resolve(null);
              return;
            }
            resolve(data);
          }
        );
      });
    });
  },

  // 订阅我们本站最新成交
  cfwsLatestMyStation: function (symbol: any, callback: any) {
    client.ready(function () {
      client.subscribe(`order.${symbol}`, callback);
    });
  },
  // 订阅全站最新成交
  cfwsLatestWholeStation: function (params: any, callback: any) {
    const pairId = params.pairId;
    client.ready(function () {
      client.subscribe(`bscorder.${pairId}`, callback);
    });
  },

  // 取消订阅推送
  cfwsUnsubscribe: function (params: any) {
    let unscribe = "*";
    client.ready(function () {
      if (params) {
        unscribe = params;
      }
      client.unsubscribe(unscribe);
    });
  },

  // Account 订阅推送
  accountBind: function (params: any, callback: any) {
    client.ready(function () {
      client.request(
        "getAccountPopMessage",
        params,
        function (err: any, data: any) {
          if (err) {
            return;
          }
          callback(data);
        }
      );
      client.subscribe("account.message", params, callback);
    });
  },
  accountOut: function (params: any) {
    client.ready(function () {
      client.unsubscribe("account.message", params);
    });
  },
  /*
   * 监听用户信息
   * @param way start 开始监听 stop 停掉监听
   */
  addListenerAccount: function (obj: any, callback: Function) {
    client.ready(function () {
      if (typeof obj !== "string" && obj.way === "stop") {
        client.removeListener(obj.listenerId);
        return;
      }
      const listener = client.addListener(
        "account.message",
        function (res: any) {
          res.listenerId = listener;
          callback(res);
        }
      );
    });
  },
};
export default Io;
