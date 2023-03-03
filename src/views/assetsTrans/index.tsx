import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
import logo from "@/assets/logo.png";
import copy from "copy-to-clipboard";

function myAddress() {
  const { t } = useTranslation();
  const [coin, setCoin] = useState("BTC");
  const [address, setAddress] = useState("0x111");

  return (
    <div className={style.root}>
      <div className="address-wrap">
        <Back />
        <div className="address-content">
          <div className="tip">
            {t("address.recharge")}
            {coin}
          </div>

          <div className="address-text">{t("address.address")}</div>
          <div
            className="address-part"
            onClick={() => {
              copy(address);
            }}
          >
            {address}
          </div>
          <div className="address-text">{t("address.chain")}</div>
          <div className="address-chain">Ethereum (ERC20)</div>
          <div
            className="btn"
            onClick={() => {
              copy(address);
            }}
          >
            {t("common.sure")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default myAddress;
