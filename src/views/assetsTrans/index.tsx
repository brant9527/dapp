import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
import Select from "@/components/Select";
import Toast from "@/components/Toast";
import right from "@/assets/right.png";
import change from "@/assets/change.png";
import usdtSVg from "@/assets/usdt.svg";
import copy from "copy-to-clipboard";

import {
  getTradeAssetBalance,
  getFundsAssetBalance,
  getSpotAssetBalance,
  assetShift,
} from "@/api/trans";

function Trans() {
  const { t } = useTranslation();
  const selectRef: any = useRef(null);
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
  const [from, setFrom] = useState({
    label: t("trans.funds"),
    type: "funds",
  });
  const [to, setTo] = useState({
    label: t("trans.trade"),
    type: "trade",
  });
  const [currentSelect, setCurrentSelect] = useState("from");

  const [coin, setCoin] = useState("USDT");
  const [coinUseCount, setCoinUseCount] = useState(0);
  const [coinFrozenCount, setCoinFrozenCount] = useState(0);
  const [amount, setAmount] = useState<any>(0);
  const getData = async () => {
    let method;
    if (from.type === "funds") {
      method = getFundsAssetBalance;
    } else if (from.type === "trade") {
      method = getTradeAssetBalance;
    } else {
      method = getSpotAssetBalance;
    }
    const { data } = await method();
    setCoinUseCount(data.availableUsdtBalance || 0);
    setCoinFrozenCount(data.freezeUsdtBalance || 0);
  };

  const onOpen = () => {
    console.log(selectRef.current);
    if (selectRef.current) {
      selectRef.current.open();
    }
  };
  const onSelect = useCallback(
    (item: any) => {
      if (currentSelect === "from") {
        setFrom(item);
      } else {
        setTo(item);
      }
    },
    [currentSelect]
  );
  // 只要from有變，就得去獲取數據
  useEffect(() => {
    getData();
  }, [from]);
  const changeFromTo = useCallback(() => {
    const fromTemp = JSON.stringify(from);
    const toTemp = JSON.stringify(to);
    setFrom(JSON.parse(toTemp));
    setTo(JSON.parse(fromTemp));
  }, [from, to]);
  const transAsstes = async () => {
    const params = {
      amount: 0,
      asset: coin,
      from: from.type,
      to: to.type,
    };
    const { data } = await assetShift(params);
    if (data.code == 0) {
      Toast.notice(t("common.success"), {});
      getData();
    }
  };
  return (
    <>
      <div className={style.root}>
        <div className="trans-wrap">
          <Back />
          <div className="trans-content">
            <div className="tip">{t("trans.tip")}</div>
            <div className="trans-part">
              <div className="trans-left">
                <div className="trans-box">
                  <div
                    className="trans-top trans-item_wrap"
                    onClick={() => {
                      setCurrentSelect("from");
                      onOpen();
                    }}
                  >
                    <div className="trans-direction">{t("trans.from")}</div>
                    <div className="trans-item_center  border">
                      <div className="trans-form——name">{from.label}</div>
                      <img src={right} />
                    </div>
                  </div>
                  <div
                    className="trans-top trans-item_wrap"
                    onClick={() => {
                      setCurrentSelect("to");
                      onOpen();
                    }}
                  >
                    <div className="trans-direction">{t("trans.to")}</div>
                    <div className="trans-item_center">
                      <div className="trans-form——name">{to.label}</div>
                      <img src={right} />
                    </div>
                  </div>
                </div>
              </div>
              <img
                src={change}
                className="trans-right"
                onClick={() => {
                  changeFromTo();
                }}
              />
            </div>
            <div className="trans-part">
              <div className="trans-coin">
                <img src={usdtSVg} className="coin-logo" />
                <div className="coin-name">{coin}</div>
                <img src={right} className="right" />
              </div>
            </div>
            <div className="count-tip">{t("trans.count")}</div>
            <div className="trans-part">
              <div className="trans-input_wrap ">
                <div className="input">
                  <input type="digit" value={amount} />
                </div>
                <div
                  className="btn-max"
                  onClick={() => {
                    setAmount(coinUseCount);
                  }}
                >
                  {t("trans.max")}
                </div>
              </div>
            </div>
            <div className="coin-state">
              <div className="left">{t("trans.useable")}</div>
              <div className="right">
                {coinUseCount}
                {coin}
              </div>
            </div>
            <div className="coin-state">
              <div className="left"> {t("trans.frozen")}</div>
              <div className="right">
                {coinFrozenCount}
                {coin}
              </div>
            </div>
            <div
              className="btn"
              onClick={() => {
                transAsstes();
              }}
            >
              {t("trans.sure")}
            </div>
          </div>
        </div>
      </div>
      <Select
        ref={selectRef}
        configList={accountsList}
        onSelect={onSelect}
      ></Select>
    </>
  );
}

export default Trans;
