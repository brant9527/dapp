import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
import { formatTime } from "@/utils/public";
const state = {
  openState: false,
};

function Entrust(props: any) {
  const { t } = useTranslation();
  const { children, partLeft, list, onCancel } = props;
  console.log("list=>", list);
  const listT = [
    {
      algoPrice: 3,
      algoTime: null,
      algoType: "",
      amount: 2,
      count: 2,
      createTime: "2023-03-10T20:06:31.000+0000",
      direction: 2,
      id: 2,
      lever: 10,
      margin: 2,
      marginMode: "crossed",
      mock: 0,
      orderId: "12312312",
      period: 0,
      realAmount: 2,
      realCount: 2,
      realPrice: 1.2,
      status: 0,
      symbol: "BTCUSDT",
      tradeType: "swap",
      updateTime: "2023-03-10T20:06:31.000+0000",
      userId: 3,
    },
  ];
  return (
    <div className={style.root}>
      <div className="entrust-wrap">
        <div className="entrust-top">
          {!children && (
            <>
              <div className="entrust-left">{partLeft}</div>
              <div className="entrust-right">
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
        </div>
        <div className="entrust-info">
          {list.map((item: any, index: any) => {
            return (
              <div key={index} className="entrust-info_item">
                <div className="left s">现价/买入</div>
                <div className="right">
                  <div className="top">
                    <div className="symbol">{`${
                      item.symbol.split("USDT")[0]
                    }/USDT`}</div>
                    <div className="time">{formatTime(item.createTime)}</div>
                  </div>
                  <div className="count">
                    <span>{t("common.count")}</span>{" "}
                    {item.realCount + " / " + item.count}
                  </div>
                  <div className="price">
                    <span>{t("common.price")}</span>
                    {item.realPrice}
                  </div>
                </div>
                <div
                  className="btn-cancel cancel-sigle"
                  onClick={() => {
                    onCancel({ type: "single", id: item.id });
                  }}
                >
                  {t("entrust.cancel")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default React.memo(Entrust);
