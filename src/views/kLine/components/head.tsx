import { useCallback, useEffect, useRef, useState } from "react";

import style from "./head.module.scss";
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
import { fixPrice, toFixed } from "@/utils/public";
import Io from "@/utils/socket";
function Head() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTCUSDT";
  const [headInfo, setHeadInfo] = useState<any>({});
  const [coin, setCoin] = useState(symbol);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    Io.subscribeSymbolInfo(symbol, (data: any) => {
      console.log(data[0]);
      setHeadInfo(data[0]);
    });
  };

  // Toast.notice(t("common.noMore"), { duration: 3000 });

  return (
    <div className={style.root}>
      <div className="head-wrap">
        <div className="head-left">
          <div className="total-price">{fixPrice(headInfo?.close)}</div>
          <div className="total-usdt">
            ≈{fixPrice(headInfo?.close)}{" "}
            <span className={`${headInfo?.rate > 0 ? "up" : "down"}`}>
              {toFixed(headInfo?.rate, 2)}%
            </span>
          </div>
        </div>
        <div className="head-right">
          <div className="head-right_item">
            <div className="item-top">{t("trade.high24")}</div>
            <div className="item-bottom">{fixPrice(headInfo?.high)}</div>
          </div>
          <div className="head-right_item">
            <div className="item-top">{t("trade.low24")}</div>
            <div className="item-bottom">{fixPrice(headInfo?.low)}</div>
          </div>
          <div className="head-right_item">
            <div className="item-top">{t("trade.total24")}</div>
            <div className="item-bottom">{headInfo?.volume}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Head;
