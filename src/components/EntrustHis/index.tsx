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

function EntrustHis(props: any) {
  const { t } = useTranslation();
  const { children, partLeft, list, onCancel } = props;
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
      <div className="entrustHis-wrap">
        {/* <div className="entrustHis-top">
          {!children && (
            <>
              <div className="entrustHis-left">{partLeft}</div>
              <div className="entrustHis-right">
                <div
                  className="btn-cancel"
                  onClick={() => {
                    onCancel({ type: "all" });
                  }}
                >
                  {t("entrust.cancel-all")}
                </div>
              </div>
            </>
          )}
        </div> */}
        <div className="entrustHis-info">
          {list.map((item: any, index: any) => {
            return (
              <div key={index} className="entrustHis-info_item">
                <div className="content">
                  <div className="item-wrap">
                    <div className="symbol">
                      {`${item.symbol.split("USDT")[0]}/USDT`}{" "}
                      <span className="trade-type">
                        {item.tradeType == "swap"
                          ? t("tabs.swap")
                          : item.tradeType == "spot"
                          ? t("tabs.spot")
                          : t("tabs.delivery")}
                      </span>
                      {item.lever && item.tradeType !== "delivery" && (
                        <span className="trade-type">{item.lever}x</span>
                      )}
                    </div>
                    <div className="time">
                      {formatTime(item.createTime, "YYYY-MM-DD HH:mm:ss")}
                    </div>
                  </div>
                  <div className="item-wrap">
                    <div
                      className={`status ${
                        [1, 3, 5, 7].indexOf(item.direction) > -1 ? "s" : "f"
                      }`}
                    >
                      {item.algoType === "limit"
                        ? t("entrust.limit")
                        : t("entrust.market")}
                      /{getStatus(item)}
                    </div>
                    <div
                      className={`trade-status ${
                        [1, 3, 5, 7].indexOf(item.direction) > -1 ? "s" : "f"
                      }`}
                    >
                      {item.count === item.realCount
                        ? t("trade.deal-all")
                        : t("trade.deal-part")}
                    </div>
                  </div>
                  <div className="item-wrap">
                    <div className="count">{t("common.count")}</div>
                    <div className="count">
                      {toFixed(item.realCount, 2) +
                        " / " +
                        toFixed(item.count, 2)}
                    </div>
                  </div>
                  <div className="item-wrap">
                    <div className="price">{t("common.price")}</div>
                    <div className="price">{fixPrice(item.realPrice)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default React.memo(EntrustHis);
