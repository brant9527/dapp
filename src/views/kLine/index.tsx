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
import Head from "./components/head";
import Depth from "./components/depth";
import {
  getDelegationPage,
  onTradeCancel,
  getDealRecordPage,
} from "@/api/trade";
import Entrust from "@/components/Entrust";
import { getProgressList, getProductList } from "@/api/ai";

function Kline() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTC";
  const [money, setMoney] = useState(0);
  const [coin, setCoin] = useState(symbol);
  const [type, setType] = useState("1");
  const [progressList, setProgressList] = useState<any>([]);
  const [productList, setProductList] = useState<any>({
    recommendList: [],
    productList: [],
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const progress = await getProgressList();
    const product = await getProductList();
    setProgressList(progress.data);
    setProductList(product.data);
  };

  // Toast.notice(t("common.noMore"), { duration: 3000 });

  const navHandle = () => {
    nav(`/search?returnPath=kLine`);
  };
  const onChangeMinutes = useCallback((minuteType: any) => {
    console.log("minuteType=>", "");
  }, []);
  function title() {
    return (
      <div className="nav-wrap">
        <div className="content">
          <img src={jiaohuan} className="search" onClick={() => navHandle()} />
          <div className="coinPart">{coin.replace("USDT", "")}/USDT</div>
        </div>
        <img src={noCollect} className="nav-right" />
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
      </div>
    </div>
  );
}

export default Kline;
