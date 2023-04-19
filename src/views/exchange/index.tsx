import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";

import Toast from "@/components/Toast";

import { onTradeBuySell } from "@/api/trade";
import { toFixed } from "@/utils/public";

function Exchange() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("asset");
  const maxAcount = search.get("count") || 0;
  const price = search.get("price") || 0;

  const [coin, setCoin] = useState("USDT");

  const [coinFrozenCount, setCoinFrozenCount] = useState(0);
  const [amount, setAmount] = useState<any>(0);
  const [contractAddress, setContractAddress] = useState();
  const phoneRef = useRef(null);
  const transAsstes = async () => {
    const params = {
      algoTime: new Date(),
      algoType: "market",
      amount,
      calcType: 1,
      side: "sell",
      symbol: symbol,
      tradeType: "spot",
    };
    const result: any = await onTradeBuySell(params);

    if (result.code == 0) {
      Toast.notice(t("common.success"), {});
      nav("/assetsAll");
    }
  };
  const talUsdt = useMemo(() => {
    return toFixed(Number(price) * amount, 4);
  }, [price, amount]);
  return (
    <>
      <div className={style.root}>
        <div className="trans-wrap">
          <Back
            content={<div className="nav-title">{t("exchange.exchange")}</div>}
          />
          <div className="trans-content">
            <div className="trans-part">
              <div className="trans-input_wrap">
                <div className="symbol">{symbol}</div>
                <div className="input">
                  <input
                    type=""
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                  />
                </div>
                <div
                  className="btn-max"
                  onClick={() => {
                    setAmount(maxAcount);
                  }}
                >
                  {t("trans.max")}
                </div>
              </div>
            </div>
            {/* <div className="trans-part">
              <div className="trans-coin">
                <img src={usdtSVg} className="coin-logo" />
                <div className="coin-name">{coin}</div>
                <img src={right} className="right" />
              </div>
            </div> */}
            <div className="coin-state">
              <div className="left">{t("trans.useable")}</div>
              <div className="right">
                {maxAcount}
                {symbol}
              </div>
            </div>
            <div className="to">{t("exchange.to")}</div>
            <div className="trans-part">
              <div className="trans-input_wrap">
                <div className="symbol">{coin}</div>
                <div className="input">
                  <input value={talUsdt} disabled />
                </div>
              </div>
            </div>
            <div className="coin-state">
              <div className="left">{t("exchange.current-rate")}</div>
              <div className="right">
                {symbol}≈{price}
                {coin}
              </div>
            </div>
            <div
              className="btn"
              onClick={() => {
                transAsstes();
              }}
            >
              {t("common.sure")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Exchange;
