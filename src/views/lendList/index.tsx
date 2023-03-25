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
import { getProgressList, getProductList } from "@/api/lend";

function Ai() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [money, setMoney] = useState(0);
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

          <div className="high-apy_info">{t("ai.high.income")}</div>
          <div>
            {productList.productList.map((item: any, idx: any) => {
              return (
                <div className="high-apy" key={idx}>
                  <div className="apy-top">
                    <div className="left">
                      <img src={eth} />
                      <div className="bold">{item.coin}</div>
                    </div>
                    <div className="right">
                      <div className="bold right-margin">
                        {item.minDayIncome}%-{item.maxDayIncome}%
                      </div>
                      <div className="normol"> APY</div>
                    </div>
                  </div>
                  <div className="apy-bottom">
                    <div className="left">
                      <div className="normol">
                        {t("ai.term")} | {item.period}
                      </div>
                    </div>
                    <div className="right">
                      <div className="normol">
                        {t("ai.limit")}
                        <span className="limit-coin">
                          {item.limitMaxAmount} {item.coin}
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
