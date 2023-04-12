import { useCallback, useEffect, useRef, useState } from "react";

import style from "./depth.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Toast from "@/components/Toast";
import PriceBar from "@/components/PriceBar";

import { fixPrice, formatTime } from "@/utils/public";
import Tabs from "@/components/Tabs";
import Io from "@/utils/socket";
import { getCoinDetail } from "@/api/trade";

function Depth() {
  const { t } = useTranslation();
  const tabs = [
    {
      title: t("trade.entrust-order"),
      type: "order",
    },
    {
      title: t("trade.new-deal"),
      type: "deal",
    },
    {
      title: t("trade.coin-detail"),
      type: "coin",
    },
  ];
  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTCUSDT";
  const tradeType = search.get("tradeType") || "spot";

  const [depthInfo, setDepthInfo] = useState<any>({});
  const [orderList, setOrderList] = useState<any>([]);
  const [coin, setCoin] = useState(symbol);
  const [tabVal, setTabVal] = useState(tabs[0].type);
  const [coinInfo, setCoinInfo] = useState<any>({});

  useEffect(() => {
    getData();
    onGetCoinDetail();
    let timer: any;
    const getOrder = async () => {
      const data: any = await Io.getCommonRequest("getLastDealRecordList", {
        tradeType,
        symbol,
      });

      setOrderList(data);
      timer = setTimeout(() => {
        getOrder();
      }, 2000);
    };
    getOrder();
    return () => {
      clearTimeout(timer);
      Io.cfwsUnsubscribe("depth." + symbol);
    };
  }, []);
  const onGetCoinDetail = async () => {
    const { data } = await getCoinDetail({
      coin: symbol.replace("USDT", ""),
    });

    setCoinInfo(data);
  };

  const getData = async () => {
    Io.subscribeSymbolDepth(symbol, (data: any) => {
      console.log(data);
      setDepthInfo(data);
    });
  };

  const onChange = async (val: any) => {
    setTabVal(val);
  };

  // Toast.notice(t("common.noMore"), {  });

  return (
    <div className={style.root}>
      <div className="depth-content">
        <Tabs tabs={tabs} onChange={onChange}></Tabs>
        {tabVal === "order" && (
          <div className="depth-bar">
            <div className=" depth-top">
              <div className="depth-part left">{t("common.buy")}</div>
              <div className="depth-part right">{t("common.sell")}</div>
            </div>

            <div className="depth-buttom">
              <div className="depth-part price-bar_wrap">
                <PriceBar direction="right" data={depthInfo.bids}></PriceBar>
              </div>
              <div className="depth-part price-bar_wrap">
                <PriceBar
                  direction="left"
                  type="sell"
                  data={depthInfo.asks}
                ></PriceBar>
              </div>
            </div>
          </div>
        )}
        {tabVal === "deal" && (
          <div className="deal-content">
            <div className="deal-part deal-top">
              <div className="deal-item_wrap">
                <div className="left">{t("common.time")}</div>
                <div className="center">{t("common.price")}</div>
                <div className="right">{t("common.count")}</div>
              </div>
            </div>
            <div className="deal-part deal-bottom">
              {orderList.map((item: any, idx: any) => {
                return (
                  <div className="deal-item_wrap" key={item.timestamp}>
                    
                    <div className="left">
                      {formatTime(item.timestamp, "hh:mm:ss")}
                    </div>
                    <div
                      className={`center ${
                        item.direction === 1 ? "buy" : "sell"
                      }`}
                    >
                      {item.price}
                    </div>
                    <div className="right">{item.volume}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tabVal === "coin" && (
          <div className="coin-info">
            <div className="item-info">
              <div className="left part-logo">
                <img src={coinInfo.logo} />
                <span>{coinInfo.coin}</span>
              </div>
              <div className="right"></div>
            </div>
            <div className="item-info">
              <div className="left ">
                <span>{t("trade.rank")}</span>
              </div>
              <div className="right">No. {coinInfo.rank}</div>
            </div>
            <div className="item-info">
              <div className="left ">
                <span>{t("trade.market")}</span>
              </div>
              <div className="right"> {coinInfo.marketValue}</div>
            </div>
            <div className="item-info">
              <div className="left ">
                <span>{t("trade.circulationCnt")}</span>
              </div>
              <div className="right"> {coinInfo.circulationCnt}</div>
            </div>
            <div className="item-info">
              <div className="left ">
                <span>{t("trade.publishCnt")}</span>
              </div>
              <div className="right"> {coinInfo.publishCnt}</div>
            </div>
            <div className="item-info">
              <div className="left ">
                <span>{t("trade.publishTime")}</span>
              </div>
              <div className="right"> {coinInfo.publishTime}</div>
            </div>
            {/* <div className="item-info">
              <div className="left ">
                <span>{t("trade.publishTime")}</span>
              </div>
              <div className="right"> {coinInfo.website}</div>
            </div> */}
            <div className="item-info">
              <div className="left ">
                <span>{t("trade.introduce")}</span>
              </div>
            </div>
            <div className="item-info">
              <div
                className="introduce"
                dangerouslySetInnerHTML={{ __html: decodeURI(coinInfo?.content) }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Depth;
