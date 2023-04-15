import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
import { fixPrice, formatTime, toFixed } from "@/utils/public";
const state = {
  openState: false,
};

function Entrust(props: any) {
  const { t } = useTranslation();
  const {
    children,
    partLeft,
    list = [],
    onClose,
    onSetProfitLoss,
    tradeType,
  } = props;
  function getStatus(item: any) {
    switch (item.direction) {
      case 1:
        return t("entrust.open-long");
      case 2:
        return t("entrust.open-short");

      case 3:
        return t("entrust.pindo");

      case 4:
        return t("entrust.empty");

      case 5:
        return t("entrust.buy");

      case 6:
        return t("entrust.sell");

      case 7:
        return t("entrust.take-profit");

      case 8:
        return t("entrust.take-loss");

      default:
        return t("entrust.open-long");
    }
  }

  return (
    <div className={style.root}>
      <div className="position-wrap">
        <div className="position-top">
          {!children && (
            <>
              <div className="position-left">{partLeft}</div>
              <div className="position-right">
                {tradeType !== "delivery" && list && list.length > 0 && (
                  <div
                    className="btn-option"
                    onClick={() => {
                      onClose({ type: "all" });
                    }}
                  >
                    {t("contract.position.close-all")}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="position-info">
          {list.map((item: any, index: any) => {
            return (
              <div key={index} className="position-info_item">
                <div className="top">
                  <div
                    className={`b-s ${item.side === "long" ? "buy" : "sell"}`}
                  >{`${
                    item.side === "long"
                      ? t("contract.buy")
                      : t("contract.sell")
                  }`}</div>
                  <div className={`symbol`}>{`${item.symbol}`}</div>
                  <div className="orderType">
                    {item.tradeType === "swap"
                      ? t("contract.swap")
                      : t("contract.delivery")}
                  </div>
                  {/* <div className="time">
                      {formatTime(item.createTime, "YYYY-MM-DD HH:mm:ss")}
                    </div> */}
                  <div className="position">
                    {t("contract.position.crossed")}
                  </div>
                  <div className="lever">{item.lever}x</div>
                </div>
                <div className="second">
                  <div className="info-part">
                    <div className="info-top">{t("contract.notPL")}(USDT)</div>
                    <div
                      className={`info-bottom percent-reward ${
                        item.unrealizedPnl > 0 ? "s" : "f"
                      }`}
                    >
                      {toFixed(item.unrealizedPnl)}
                    </div>
                  </div>
                  <div className="info-part text-right">
                    <div className="info-top">{t("contract.reward")}</div>
                    <div
                      className={`info-bottom percent-reward ${
                        item.unrealizedPnl > 0 ? "s" : "f"
                      }`}
                    >
                      {toFixed(item.pnlRatio)}%
                    </div>
                  </div>
                </div>
                <div className="count">
                  <div className="info-part">
                    <div className="info-top">
                      {t("contract.have-amount")}(USDT)
                    </div>
                    <div className="info-bottom">
                      {toFixed(item.availPosition)}
                    </div>
                  </div>
                  <div className="info-part">
                    <div className="info-top">
                      {t("contract.promise-money")}(USDT)
                    </div>
                    <div className="info-bottom">{toFixed(item.margin)}</div>
                  </div>
                  <div className="info-part text-right">
                    <div className="info-top">
                      {t("contract.promise-money-percent")}
                    </div>
                    <div
                      className={`info-bottom ${
                        item.marginRate > 0 ? "s" : "f"
                      }`}
                    >
                      {toFixed(item.marginRate)}%
                    </div>
                  </div>
                </div>
                <div className="price">
                  <div className="info-part">
                    <div className="info-top">
                      {t("contract.long-price")}(USDT)
                    </div>
                    <div className="info-bottom">
                      {toFixed(item.avgCostPrice)}
                    </div>
                  </div>
                  <div className="info-part">
                    <div className="info-top">
                      {t("contract.mark-price")}(USDT)
                    </div>
                    <div className="info-bottom">{toFixed(item.currPrice)}</div>
                  </div>
                  <div className="info-part text-right">
                    <div className="info-top">
                      {t("contract.force-close")}(USDT)
                    </div>
                    <div className="info-bottom">
                      {item.forcePrice > 0 ? toFixed(item.forcePrice) : "--"}
                    </div>
                  </div>
                </div>

                {item.tradeType !== "delivery" && (
                  <div className="btn-part">
                    <div
                      className="btn-option "
                      onClick={() => {
                        onSetProfitLoss({ item: item });
                      }}
                    >
                      {t("contract.profit-loss")}
                    </div>
                    <div
                      className="btn-option "
                      onClick={() => {
                        onClose({ type: "single", item });
                      }}
                    >
                      {t("contract.position.close")}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default React.memo(Entrust);
