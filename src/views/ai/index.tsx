import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Back from "@/components/Back";

import Toast from "@/components/Toast";

import right from "@/assets/right.png";
import eth from "@/assets/eth.png";

import {
  getDelegationPage,
  onTradeCancel,
  getDealRecordPage,
} from "@/api/trade";
import Entrust from "@/components/Entrust";

function Ai() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [money, setMoney] = useState(0);
  const [type, setType] = useState("1");
  const [entrustList, setEntrustList] = useState<any>([]);
  // const [productList, setProductList] = useState<any>([
  //   {
  //     apy: 100,
  //     coin: "BTC",
  //     term: "30",
  //   },
  //   {
  //     apy: 100,
  //     coin: "BTC",
  //     term: "30",
  //   },
  // ]);

  const productList = [
    {
      apy: 100,
      coin: "BTC",
      term: "30",
    },
    {
      apy: 100,
      coin: "BTC",
      term: "30",
    },
  ];
  const productListBottom = [
    {
      apy: 100,
      coin: "BTC",
      term: "30",
      count: 10,
    },
    {
      apy: 100,
      coin: "BTC",
      term: "30",
      count: 10,
    },
  ];
  useEffect(() => {
    getData();
  }, [type]);

  const getData = async () => {
    let isEnd;
    if (type != "dealRecord") {
      const { data } = await getDelegationPage({
        status: type,
        tradeType: "swap",
      });
      console.log(data);
      isEnd = data.currPage === data.totalPage;
      data.list && setEntrustList(data.list);
    } else {
      const { data } = await getDealRecordPage({
        status: type,
        tradeType: "swap",
      });
      console.log(data);
      data.list && setEntrustList(data.list);
      isEnd = data.currPage === data.totalPage;
    }
    if (isEnd) {
      Toast.notice(t("common.noMore"), { duration: 3000 });
    }
  };

  function title() {
    return <div className="ai-title">{t("home.btns.ai")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="ai-wrap">
        <Back content={title()}></Back>
        <div className="ai-content">
          <div className="ai-order-nav">
            <div className="order">{t("ai.orders")}</div>
            <img src={right} />
          </div>
          <div className="money">
            <span>{money}</span> USDT
          </div>
          <div className="suggest">{t("ai.suggest")}</div>
          <div className="suggest-product">
            {productList.map((item: any, idx: any) => {
              return (
                <div
                  className={`product ${
                    idx == 0 ? "product_left" : "product_right"
                  }`}
                  key={idx}
                >
                  <div className="product-top">
                    <img className="logo" src={eth} />
                    <div>
                      <div className="coin">{item.coin}</div>
                      <div className="new-user">{t("ai.new.user")}</div>
                    </div>
                  </div>
                  <div className="product-title">APY</div>
                  <div className="product-info">{item.apy}</div>
                  <div className="product-title">{t("ai.term")}</div>

                  <div className="product-info">{item.term}</div>
                </div>
              );
            })}
          </div>
          <div className="high-apy_info">{t("ai.high.income")}</div>
          <div>
            {productListBottom.map((item: any, idx: any) => {
              return (
                <div className="high-apy" key={idx}>
                  <div className="apy-top">
                    <div className="left">
                      <img src={eth} />
                      <div className="bold">{item.coin}</div>
                    </div>
                    <div className="right">
                      <div className="bold right-margin">
                        {item.apy}%-{item.apy}%
                      </div>
                      <div className="normol"> APY</div>
                    </div>
                  </div>
                  <div className="apy-bottom">
                    <div className="left">
                      <div className="normol">
                        {t("ai.term")} | {item.term}
                      </div>
                    </div>
                    <div className="right">
                      <div className="normol">
                        {t("ai.limit")}
                        <span className="limit-coin">
                          {item.count} {item.coin}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ai;
