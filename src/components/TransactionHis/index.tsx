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

function TransactionHis(props: any) {
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
      <div className="transHis-wrap">
        <div className="transHis-info">
          {list.map((item: any, index: any) => {
            return (
              <div key={index} className="transHis-info_item">
                <div className="content">
                  <div className="item-wrap">
                    <div className="symbol">{`${
                      item.feeAsset || item.symbol.replace("USDT", "")
                    }/USDT`}</div>
                    <div className="time">
                      {formatTime(item.dealTime, "YYYY-MM-DD HH:mm:ss")}
                    </div>
                  </div>
                  <div className="item-wrap">
                    <div
                      className={`status ${
                        [1, 3, 5, 7].indexOf(item.direction) > -1 ? "s" : "f"
                      }`}
                    >
                      {getStatus(item)}
                    </div>
                  </div>
                  <div className="item-wrap">
                    <div className="price">{t("common.price")}(USDT)</div>
                    <div className="price">{fixPrice(item.price)}</div>
                  </div>
                  <div className="item-wrap">
                    <div className="price">{`${t(
                      "trade.deal-amount"
                    )}(${item.symbol.replace("USDT", "")})`}</div>
                    <div className="price">{fixPrice(item.amount)}</div>
                  </div>
                  <div className="item-wrap">
                    <div className="count">{t("trade.fee")}(USDT)</div>
                    <div className="count">{toFixed(item.fee, 2)}</div>
                  </div>
                  <div className="item-wrap">
                    <div className="count">{t("trade.amount")}</div>
                    <div className="count">{toFixed(item.amount, 2)}</div>
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
export default React.memo(TransactionHis);
