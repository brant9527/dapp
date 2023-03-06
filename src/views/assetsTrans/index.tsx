import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
import right from "@/assets/right.png";
import change from "@/assets/change.png";
import copy from "copy-to-clipboard";

function Trans() {
  const { t } = useTranslation();
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
  const [coin, setCoin] = useState("BTC");
  const [coinUseCount, setCoinUseCount] = useState(100);
  const [coinFrozenCount, setCoinFrozenCount] = useState(1000);
  return (
    <div className={style.root}>
      <div className="trans-wrap">
        <Back />
        <div className="trans-content">
          <div className="tip">{t("trans.tip")}</div>
          <div className="trans-part">
            <div className="trans-left">
              <div className="trans-box">
                <div className="trans-top trans-item_wrap">
                  <div className="trans-direction">{t("trans.from")}</div>
                  <div className="trans-item_center  border">
                    <div className="trans-form——name">{from.label}</div>
                    <img src={right} />
                  </div>
                </div>
                <div className="trans-top trans-item_wrap">
                  <div className="trans-direction">{t("trans.to")}</div>
                  <div className="trans-item_center">
                    <div className="trans-form——name">{to.label}</div>
                    <img src={right} />
                  </div>
                </div>
              </div>
            </div>
            <img src={change} className="trans-right" />
          </div>
          <div className="trans-part">
            <div className="trans-coin">
              <img src="" className="coin-logo" />
              <div className="coin-name">{coin}</div>
              <img src={right} className="right" />
            </div>
          </div>
          <div className="count-tip">{t("trans.count")}</div>
          <div className="trans-part">
            <div className="trans-input_wrap ">
              <div className="input">
                <input type="text" />
              </div>
              <div className="btn-max">{t("trans.max")}</div>
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
            <div className="left"> {t("trans.useable")}</div>
            <div className="right">
              {coinFrozenCount}
              {coin}
            </div>
          </div>
          <div className="btn">{t("trans.sure")}</div>
        </div>
      </div>
    </div>
  );
}

export default Trans;
