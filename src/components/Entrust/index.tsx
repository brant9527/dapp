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
  const { children, partLeft, list, onCancel, tradeType } = props;
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
      <div className="entrust-wrap">
        <div className="entrust-top">
          {!children && (
            <>
              <div className="entrust-left">{partLeft}</div>
              <div className="entrust-right">
                {tradeType !== "delivery" && (
                  <div
                    className="btn-cancel"
                    onClick={() => {
                      onCancel({ type: "all" });
                    }}
                  >
                    {t("entrust.cancel-all")}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="entrust-info">
          {list.map((item: any, index: any) => {
            return (
              <div key={item.id} className="entrust-info_item">
                <div
                  className={`left ${
                    [1, 3, 5, 7].indexOf(item.direction) > -1 ? "s" : "f"
                  }`}
                >
                  {item.algoType === "limit"
                    ? t("entrust.limit")
                    : t("entrust.market")}
                  /{getStatus(item)}
                  <div className="circle">
                    0%
                  </div>
                </div>
                <div className="right">
                  <div className="top">
                    <div className="symbol">{`${
                      item.symbol.split("USDT")[0]
                    }/USDT`}</div>
                    <div className="time">
                      {formatTime(
                        new Date(item.createTime).getTime()
                      )}
                    </div>
                  </div>
                  <div className="count">
                    <span>{t("common.count")}</span>{" "}
                    {toFixed(item.realCount, 5) +
                      " / " +
                      toFixed(item.count, 5)}
                  </div>
                  <div className="price">
                    <span>{t("common.price")}</span>
                    {fixPrice(item.algoPrice)}
                  </div>
                </div>
                {tradeType != "delivery" && (
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
