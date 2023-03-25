import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useSearchParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
import usdtPng from "@/assets/usdt.svg";
import change from "@/assets/change.png";
import copy from "copy-to-clipboard";
import { getUserCurrProductAmount, applyBuy } from "@/api/ai";
import { getTradeAssetBalance } from "@/api/trans";
import Toast from "@/components/Toast";
function aiApply() {
  const { t } = useTranslation();

  const [search, setsearch] = useSearchParams();
  const id = search.get("id");
  const period = search.get("period");
  const maxDayIncome = search.get("maxDayIncome");
  const minDayIncome = search.get("minDayIncome");
  const limitMinAmount = search.get("limitMinAmount");
  const limitBuy = search.get("limitBuy");
  const accountsList = [
    {
      label: t("trans.funds"),
      type: "funds",
    },
    {
      label: t("trans.trade"),
      type: "trade",
    },
    {
      label: t("trans.spot"),
      type: "spot",
    },
  ];

  const [coin, setCoin] = useState("USDT");
  const [coinUseCount, setCoinUseCount] = useState(0);
  const [coinFrozenCount, setCoinFrozenCount] = useState(0); // 可投
  const [amount, setAmount] = useState(0); // 可投

  const getData = async () => {
    const { code, data } = await getUserCurrProductAmount();
    if (code == 0) {
      // data.
    }
    const { code: codeTrade, data: dataTrade } = await getTradeAssetBalance();
    if (codeTrade == 0) {
      console.log(dataTrade);
    }
  };
  const onApply = async () => {
    const params = {
      amount,
      productId: id,
    };
    const { code, data } = await applyBuy(params);
    if (code == 0) {
      Toast.notice(t("common.success"), {});
    }
  };
  const onChange = (val: any) => {
    setAmount(val);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={style.root}>
      <div className="ai-wrap">
        <Back />
        <div className="ai-content">
          <div className="logo-img">
            <img src={usdtPng} />
            <div className="coin">USDT</div>
          </div>
          <div className="coin-state">
            <div className="left">
              {t("ai.term") + " "}({t("symbol.day")})
            </div>
            <div className="right">{period}</div>
          </div>
          <div className="coin-state">
            <div className="left">{"APY" + " "}</div>
            <div className="right">{minDayIncome + "~" + maxDayIncome}%</div>
          </div>
          <div className="coin-state">
            <div className="left">{t("ai.limit") + " "}(USDT)</div>
            <div className="right">{limitBuy}</div>
          </div>
          <div className="border"></div>
          <div className="count-tip">{t("trans.count")}</div>
          <div className="ai-part">
            <div className="ai-input_wrap ">
              <div className="input">
                <input
                  type="digit"
                  value={amount}
                  onChange={(e) => onChange(e.target.value)}
                />
              </div>
              <div className="btn-max">{t("trans.max")}</div>
            </div>
          </div>
          <div className="coin-state">
            <div className="left">
              {t("trans.useable") + " "}({coin})
            </div>
            <div className="right">{coinUseCount}</div>
          </div>
          <div className="coin-state">
            <div className="left">
              {" "}
              {t("ai.rest") + " "}({coin})
            </div>
            <div className="right">{coinFrozenCount}</div>
          </div>
          <div className="btn">{t("ai.apply")}</div>
        </div>
      </div>
    </div>
  );
}

export default aiApply;
