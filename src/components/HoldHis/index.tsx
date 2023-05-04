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

function HoldHis(props: any) {
  const { t } = useTranslation();
  const { children, partLeft, list, onCancel } = props;
  function getStatus(item: any) {
    switch (item.side) {
      case "long":
        return t("contract.position.crossed") + "/" + t("contract.buy");
      default:
        return t("contract.position.crossed") + "/" + t("contract.sell");
    }
  }
  /**
   * "close-time":"平倉時間",
    "open-price":"開倉價格",
    "close-price":"平倉均價",
    "close-PNL":"平倉盈虧",
    "max-position":"最大持倉量",
    "closed-position":"已平倉量"
   */
  return (
    <div className={style.root}>
      <div className="holdHis-wrap">
        <div className="holdHis-info">
          {list.map((item: any, index: any) => {
            return (
              <div key={index} className="holdHis-info_item">
                <div className="content">
                  <div className="item-wrap">
                    <div className="symbol">
                      {`${item.symbol?.replace("USDT", "")}/USDT`}
                      <span className="trade-type">
                        {item.tradeType == "swap"
                          ? t("tabs.swap")
                          : item.tradeType == "spot"
                          ? t("tabs.spot")
                          : t("tabs.delivery")}
                      </span>
                      {item.lever && item.tradeType === "swap" ? (
                        <span className="trade-type">{item.lever}x</span>
                      ) : (
                        <span className="trade-type">{item.period}s</span>
                      )}
                    </div>
                    <div className="time">{formatTime(item.createTime)}</div>
                  </div>

                  <div className="item-wrap">
                    <div
                      className={`status ${
                        ["long"].indexOf(item.side) > -1 ? "s" : "f"
                      }`}
                    >
                      {getStatus(item)}
                    </div>
                  </div>
                  {item.tradeType === "delivery" && (
                    <>
                      <div className="item-wrap">
                        <div className="price">{t("hold.close-time")}</div>
                        <div className="price">
                          {formatTime(item.closeTime)}
                        </div>
                      </div>
                    </>
                  )}
                  {item.tradeType === "swap" && (
                    <div className="item-wrap">
                      <div className="price">{`${t(
                        "trade.deal-amount"
                      )}(${item.symbol.replace("USDT", "")})`}</div>
                      <div className="price">{toFixed(item.position,6)}</div>
                    </div>
                  )}
                  <div className="item-wrap">
                    <div className="price">{t("hold.open-price")}(USDT)</div>
                    <div className="price">{fixPrice(item.avgCostPrice)}</div>
                  </div>
                  <div className="item-wrap">
                    <div className="price">{t("hold.close-price")}(USDT)</div>
                    <div className="price">{fixPrice(item.closePrice)}</div>
                  </div>
                  <div className="item-wrap">
                    <div className="price">{t("hold.close-PNL")}(USDT)</div>
                    <div className="price">{fixPrice(item.finalPnl)}</div>
                  </div>
                  {item.tradeType === "delivery" && (
                    <>
                      <div className="item-wrap">
                        <div className="price">
                          {t("hold.max-position")}(USDT)
                        </div>
                        <div className="price">{fixPrice(item.position)}</div>
                      </div>

                      <div className="item-wrap">
                        <div className="price">
                          {t("hold.closed-position")}(USDT)
                        </div>
                        <div className="price">
                          {fixPrice(item.position - item.availPosition)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default React.memo(HoldHis);
