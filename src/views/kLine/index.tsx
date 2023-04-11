import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Back from "@/components/Back";

import Toast from "@/components/Toast";
import TradeView from "@/components/TradeView";

import right from "@/assets/right.png";
import eth from "@/assets/eth.png";
import jiaohuan from "@/assets/jiaohuan.png";
import noCollect from "@/assets/no-collect.png";
import collect from "@/assets/collect.png";
import Head from "./components/head";
import Depth from "./components/depth";
import { getCollectStatus, collectAdd, collectDelete } from "@/api/userInfo";
import Entrust from "@/components/Entrust";
import { getProgressList, getProductList } from "@/api/ai";

function Kline() {
  const { t } = useTranslation();
  const mock = window.localStorage.getItem("mock");
  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTC";
  const tradeType = search.get("tradeType") || "spot";

  const [coin, setCoin] = useState(symbol);

  const [isCollect, setIsCollect] = useState(false);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data, code } = await getCollectStatus({
      tradeType,
      symbol,
    });
    if (code === 0) {
      setIsCollect(!!data);
    }
  };

  // Toast.notice(t("common.noMore"), {  });

  const navHandle = () => {
    if (mock) {
      return;
    }
    nav(`/search?returnPath=kLine`);
  };
  const onChangeMinutes = useCallback((minuteType: any) => {
    console.log("minuteType=>", "");
  }, []);
  const navTo = (type: any) => {
    if (mock) {
      return nav(
        `/mockTrade?symbol=${symbol}&tradeMode=${type}&tradeType=${tradeType}`
      );
    }
    if (tradeType == "spot") {
      nav(`/stock?symbol=${symbol}&tradeMode=${type}`);
    } else if (tradeType == "swap") {
      nav(
        `/contract?symbol=${symbol}&tradeMode=${type}&tradeType=${tradeType}`
      );
    } else {
      nav(
        `/contract?symbol=${symbol}&tradeMode=${type}&tradeType=${tradeType}`
      );
    }
  };
  const onClickCollect = async () => {
    if (isCollect) {
      const { code } = await collectDelete({ symbol, tradeType });
      if (code == 0) {
        setIsCollect(false);
      }
    } else {
      const { code } = await collectAdd({ symbol, tradeType });
      if (code == 0) {
        setIsCollect(true);
      }
    }
  };
  function title() {
    return (
      <div className="nav-wrap">
        <div className="content">
          <img src={jiaohuan} className="search" onClick={() => navHandle()} />
          <div className="coinPart">{coin.replace("USDT", "")}/USDT</div>
        </div>
        <img
          src={isCollect ? collect : noCollect}
          onClick={() => {
            onClickCollect();
          }}
          className="nav-right"
        />
      </div>
    );
  }

  return (
    <div className={style.root}>
      <div className="kLine-wrap">
        <Back content={title()}></Back>
        <div className="kLine-content">
          <Head></Head>

          <div className="tradeView">
            <TradeView
              symbol={symbol}
              onChangeMinutes={onChangeMinutes}
            ></TradeView>
          </div>
          <div className="depth-wrap">
            <Depth></Depth>
          </div>
        </div>
        <div className="btn-wrap">
          <div className="btn-item btn-buy" onClick={() => navTo("buy")}>
            {t("common.buy")}
          </div>
          <div className="btn-item btn-sell" onClick={() => navTo("sell")}>
            {t("common.sell")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kline;
