import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";
import CoinPriceItem from "../CoinPriceItem";
import { useTranslation } from "react-i18next";
import btc from "@/assets/wallet.svg";
function Quotation() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const list = [
    {
      price: 23121,
      raise: 2.1,
      imgSrc: btc,
      coin: "BTC",
      tradeAccount: "12312",
    },
  ];
  return (
    <div className={style.root}>
      <div className="tableCoinsPst">
        <div className="coinTypePst title">{t("quota.coins.name")}</div>
        <div className="coinPricePst title">{t("quota.coins.price")}</div>
        <div className="coinStatePst title">{t("quota.coins.raise")}</div>
      </div>
      {list.map((item,idx) => {
        return <CoinPriceItem {...item} key={idx}></CoinPriceItem>;
      })}
    </div>
  );
}
export default Quotation;
