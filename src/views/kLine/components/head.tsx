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
import { fixPrice } from "@/utils/public";
function Head() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTC";
  const [headInfo, setHeadInfo] = useState<any>({});
  const [coin, setCoin] = useState(symbol);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    console.log(1);
  };

  // Toast.notice(t("common.noMore"), { duration: 3000 });

  return (
    <div className={style.root}>
      <div className="head-wrap">
        <div className="head-left">
          <div className="total-price">{fixPrice(2000)}</div>
          <div className="total-usdt">
            ≈{fixPrice(2000)}{" "}
            <span className={`${headInfo.usdt > 0 ? "up" : "down"}`}>
              {headInfo.usdt}%
            </span>
          </div>
        </div>
        <div className="head-right">
          <div className="head-right_item">
            <div className="item-top">{t("trade.high24")}</div>
            <div className="item-bottom">{fixPrice(headInfo.high || 0.12)}</div>
          </div>
          <div className="head-right_item">
            <div className="item-top">{t("trade.low24")}</div>
            <div className="item-bottom">{fixPrice(headInfo.high || 0)}</div>
          </div>
          <div className="head-right_item">
            <div className="item-top">{t("trade.total24")}</div>
            <div className="item-bottom">{headInfo.high}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Head;
