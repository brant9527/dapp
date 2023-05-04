import React, {
  Component,
  useCallback,
  useState,
  Fragment,
  memo,
  useEffect,
} from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";
import CoinPriceItem from "../CoinPriceItem";
import { useTranslation } from "react-i18next";
import btc from "@/assets/wallet.svg";
import Io from "@/utils/socket";
import { commonData } from "@/utils/socket";
function Quotation(props: any) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { coinList } = props;

  return (
    <div className={style.root}>
      <div className="table-wrap">
      <div className="tableCoinsPst">
        <div className="coinTypePst title">{t("quota.coins.name")}</div>
        <div className="coinPricePst title">{t("quota.coins.price")}</div>
        <div className="coinStatePst title">{t("quota.coins.raise")}</div>
      </div>
      {coinList.map((item: any, idx: any) => {
        return <CoinPriceItem {...item} key={idx}></CoinPriceItem>;
      })}
      </div>
    </div>
  );
}
export default memo(Quotation);
