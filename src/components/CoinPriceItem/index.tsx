import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
import up from "@/assets/up.png";
import down from "@/assets/down.png";
function Quotation(props: any) {
  const { imgSrc, price, coin, tradeAccount, raise } = props;
  const nav = useNavigate();

  return (
    <div className={style.root}>
      <div className="tableCoinsPst">
        <div className="coinTypePst ">
          <img src={imgSrc} />
          <div className="right">
            <div className="top">
              <div className="coin">{coin}</div>
              <div className="usdt">/usdt</div>
            </div>
            <div className="account">{tradeAccount}K</div>
          </div>
        </div>
        <div className="coinPricePst ">
          <div className="priceTop">{price}</div>
          <div className="priceBot">≈${price}</div>
        </div>
        <div className="coinStatePst ">
          <div className={["raisePart", raise > 0 ? "up" : "down"].join(" ")}>
            <img src={raise > 0 ? up : down} />
            <div className="raise">{raise}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Quotation;
