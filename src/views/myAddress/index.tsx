import { useCallback, useEffect, useRef, useState } from "react";
import {QRCodeSVG} from 'qrcode.react';

import style from "./index.module.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
import logo from "@/assets/logo.png";
import copy from "copy-to-clipboard";

function myAddress() {
  const account =localStorage.getItem('account')||''
  const { t } = useTranslation();
  const [coin, setCoin] = useState("USDT");
  const [address, setAddress] = useState(account);

  return (  
    <div className={style.root}>
      <div className="address-wrap">
        <Back />
        <div className="address-content">
          <div className="tip">
            {t("address.recharge")}
            {coin}
          </div>


          
          <QRCodeSVG  width={400} height={400} value={address} className="qrcode" />,

          <div className="qrtip ">
            <div className="tip1">
              {t("address.tip1", {
                coin,
              })}
            </div>
            <div className="tip2">{t("address.tip2")}</div>
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
