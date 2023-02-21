/* eslint-disable */
import CFClient from './cfws';
import moment from 'moment';
import { toFixed } from '@/utils/public';

const env = process.env.NODE_ENV;
// const hostname = '' || window.location.hostname;
let uri = 'wss://bscdapp.newdex.io/websocket';
if (env !== 'production') {
  uri = `ws://${process.env.VUE_APP_BASEURL}:${process.env.VUE_APP_PORT25}/websocket`;
  // uri = 'wss://bscdapp.newdex.io/websocket';
}
const client = new CFClient({
  env,
  uri,
  debug: false
});

const Io = {
  listener: null,
  lastSubscribe: null,
  subscribeCallback: null,
  // 交易中心 k线图部分
  cfwsKline: function (params:any, subscribe:string, callback:Function) {
    var me = this;
    let resolution = params.resolution;
    delete params.resolution;
    client.ready(function () {
      var type = 'minute'
      if (resolution == '5') {
        type = 'minute5'
      } else if (resolution == '15') {
        type = 'minute15'
      } else if (resolution == '30') {
        type = 'minute30'
      } else if (resolution == '60') {
        type = 'hour'
      } else if (resolution == '240') {
        type = 'hour4'
      } else if (resolution == '1D') {
        type = 'day'
      } else if (resolution == '1W') {
        type = 'week'
      } else if (resolution == '1M') {
        type = 'month'
      }
      var wsCallback = function (data:any) {
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          klines: <any>[]
        };
        if (data.length > 0) {
          data.forEach((e:any) => {
            res.klines.push({
              date: me.dataFormat(e[0]),
              open: e[1] * 1,
              close: e[2] * 1,
              high: e[3] * 1,
              low: e[4] * 1,
              time: e[0] * 1000,
              volume: Number((e[5] * 1).toFixed(0))
            })
          });
        }
        callback(res, 'all');
        res.klines = [];
      }
      params.symbol = params.symbol.toLowerCase();
      //请求k线数据
      params.table = type;
      client.request('getKlineByInterval', params, function (err:any, data:any) {
        if (err) {
          return;
        }
        wsCallback(data)
      })

      if (!subscribe) return;
      client.subscribe(`kline.${type}.${params.pairId}`, params, function (data:any) {
        const item = {
          close: Number(toFixed(data.close, params.decimalWhat)),
          date: me.dataFormat(data.timestamp),
          high: data.high * 1,
          low: data.low * 1,
          open: data.open * 1,
          time: data.timestamp * 1000,
          volume: Number((data.count * 1).toFixed(0))
        }
        const res = {
          resolution: resolution,
          symbol: params.symbol,
          klines: [item],
        };
        callback(res, 'one');
      })
    })
  },

   // 时间戳转换
  dataFormat(fdata:any) {
    return moment.unix(fdata).format('YYYY-MM-DD HH:mm:ss');
  },


  // 交易中心 头部信息
  cfwsHeard: function (params:any, callback:Function) {
    const symbol = params.symbol;
    client.ready(function () {
      client.subscribe(`ticker.${symbol}`, function (data:any) {
        callback(data);
      });
    });
  },

  // 请求列表数据
  getMarketList: function () {
    return new Promise((resolve, reject) => {
      client.ready(function () {
        client.request('getMarketList', function (err:any, data:any) {
          if (err) {
            resolve(null);
            return;
          }
          resolve(data);
        })
      })
    })
  },
  // 订阅列表数据
  subscribeMarket: function (callback:any) {
    client.ready(function () {
      client.subscribe('market.*', function (data:any) {
        callback(data);
      });
    })
  },

  // 订阅详情数据
  subscribeSymbolInfo: function (pairid:any, callback:Function) {
    client.ready(function () {
      client.subscribe(`market.${pairid}`, function (data:any) {
        callback(data);
      });
    })
  },

  // 获取交易对的实时数据
  cfwsPricesSymbol: function (params:any, callback:Function) {
    // 订阅所有价格
    const symbol = params.symbol;
    client.ready(function () {
      let data = params
      delete data.params
      delete data.symbol
      client.subscribe(`markets.${symbol}`, data, function (data:any) {
        if (!data) return;
        callback(data);
      });
    });
  },

  // 获取交易对的最新成交 10条
  getOrderLastTen: function (params:any) {
    return new Promise((resolve, reject) => {
      client.ready(function () {
        //请求k线数据
        client.request('getOrderLastTen', params, function (err:any, data:any) {
          if (err) {
            resolve(null);
            return;
          }
          resolve(data);
        })
      })
    })
  },
  // 订阅全网最新成交 10条
  getBscOrderLast: function (params:any) {
    return new Promise((resolve, reject) => {
      client.ready(function () {
        //请求k线数据
        client.request('getBscOrderLast', params, function (err:any, data:any) {
          if (err) {
            resolve(null);
            return;
          }
          resolve(data);
        })
      })
    })
  },

  // 订阅我们本站最新成交
  cfwsLatestMyStation: function (params:any, callback:any) {
    const pairId = params.pairId;
    client.ready(function () {
      client.subscribe(`order.${pairId}`, callback);
    });
  },
  // 订阅全站最新成交
  cfwsLatestWholeStation: function (params:any, callback:any) {
    const pairId = params.pairId;
    client.ready(function () {
      client.subscribe(`bscorder.${pairId}`, callback);
    });
  },

  // 取消订阅推送
  cfwsUnsubscribe: function (params:any) {
    let unscribe = '*'
    client.ready(function () {
      if (params) {
        unscribe = params;
      }
      client.unsubscribe(unscribe);
    });
  },

  // Account 订阅推送
  accountBind: function (params:any) {
    client.ready(function () {
      client.subscribe('account.message', params);
    });
  },
  accountOut: function (params:any) {
    client.ready(function () {
      client.unsubscribe('account.message', params);
    });
  },
  /*
   * 监听用户信息
   * @param way start 开始监听 stop 停掉监听
   */
  addListenerAccount: function (obj:any, callback:Function) {
    client.ready(function () {
      if (typeof obj !== 'string' && obj.way === 'stop') {
        client.removeListener(obj.listenerId);
        return;
      }
      const listener = client.addListener('account.message', function (res:any) {
        res.listenerId = listener;
        callback(res)
      });
    })
  },
}
export default Io
