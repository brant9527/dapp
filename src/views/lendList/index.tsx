/**
 * 借贷列表
 */
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
import usdt from "@/assets/usdt.svg";

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
  const [productList, setProductList] = useState<any>([]);

  useEffect(() => {
    getData();
  }, []);
  const navTo = (item: any) => {
    nav("/lend" + `?id=${item.id}&period=${item.period}&rate=${item.rate}`);
  };
  const getData = async () => {
    const data: any = await getProgressList();
    const product = await getProductList();
    setMoney(data.data.totalLoanAmount);
    setProductList(product.data);
  };

  // Toast.notice(t("common.noMore"), { duration: 3000 });

  function title() {
    return <div className="ai-title">{t("lend.lend")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="ai-wrap">
        <Back content={title()}></Back>
        <div className="ai-content">
          <div className="ai-order-nav" onClick={() => nav("/lendOrderList")}>
            <div className="order">{t("ai.orders")}</div>
            <img src={right} />
          </div>
          <div className="money">
            <span>{money}</span> USDT
          </div>

          {/* <div className="high-apy_info">{t("ai.high.income")}</div> */}
          <div>
            {productList.map((item: any, idx: any) => {
              return (
                <div className="high-apy" key={idx} onClick={() => navTo(item)}>
                  <div className="apy-top">
                    <div className="left">
                      <img src={item.url || usdt} />
                      <div className="bold">{item.coin || "USDT"}</div>
                    </div>
                    <div className="right">
                      <div className="bold right-margin">
                        {item.rate * 365}%
                      </div>
                      <div className="normol"> APY</div>
                    </div>
                  </div>
                  <div className="apy-bottom">
                    <div className="left">
                      <div className="normol">
                        {t("ai.term")} | {item.period} ({t("symbol.day")})
                      </div>
                    </div>
                    <div className="right">
                      <div className="normol">
                        {/* {t("ai.limit")} */}
                        <span className="limit-coin">
                          {/* {item.limitMaxAmount} {item.coin} */}
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
