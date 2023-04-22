import React, { Component, useCallback, useState, Fragment, memo } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
import up from "@/assets/up.png";
import down from "@/assets/down.png";
import { fixPrice, toFixed } from "@/utils/public";

function CoinPriceItem(props: any) {
  const { logo, close, rate, symbol, turnover, volume } = props;
  const nav = useNavigate();

  return (
    <div className={style.root}>
      <div className="tableCoinsPst" onClick={() => {
            nav("/contract?symbol=" + symbol);
          }}>
        <div
          className="coinTypePst"
          
        >
          {logo && <img src={logo} />}
          <div className="right">
            <div className="top">
              <div className="coin">{symbol.replace("USDT", "")}</div>
              <div className="usdt">/USDT</div>
            </div>
            <div className="account">{toFixed(turnover / 1000, 2)}K</div>
          </div>
        </div>
        <div className="coinPricePst ">
          <div className="priceTop">{fixPrice( close)}</div>
          <div className="price-bot">≈${fixPrice(close)}</div>
        </div>
        <div className="coinStatePst ">
          <div
            className={["raisePart", Number(rate) > 0 ? "up" : "down"].join(
              " "
            )}
          >
            {/* <img src={Number(rate) > 0 ? up : down} /> */}
            <div className="raise">{toFixed(Number(rate) * 100, 2)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(CoinPriceItem);
