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
  const { children, partLeft, list = [], onCancel, tradeType } = props;
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
                {tradeType !== "delivery" && (
                  <div
                    className="btn-cancel"
                    onClick={() => {
                      onCancel({ type: "all" });
                    }}
                  >
                    {t("contract.position.close")}
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
                      {formatTime(item.createTime, "YYYY-MM-DD mm:hh:ss")}
                    </div> */}
                  <div className="position">{t("contract.position.crossed")}</div>
                  <div className="lever">{item.lever}x</div>
                </div>
                <div className="second">
                  <div className="symbol">{`${
                    item.symbol?.split("USDT")[0]
                  }/USDT`}</div>
                  <div className="time">
                    {formatTime(item.createTime, "YYYY-MM-DD mm:hh:ss")}
                  </div>
                </div>
                <div className="count">
                  <span>{t("common.count")}</span>{" "}
                  {toFixed(item.realCount, 2) + " / " + toFixed(item.count, 2)}
                </div>
                <div className="price">
                  <span>{t("common.price")}</span>
                  {fixPrice(item.algoPrice)}
                </div>

                {tradeType !== "delivery" && (
                  <div
                    className="btn-cancel cancel-sigle"
                    onClick={() => {
                      onCancel({ type: "single", id: item.id });
                    }}
                  >
                    {t("entrust.cancel")}
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
