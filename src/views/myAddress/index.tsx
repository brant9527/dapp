import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
import recordPng from "@/assets/record.png";

import copy from "copy-to-clipboard";
import { getRechargeAddress } from "@/api/userInfo";
import Toast from "@/components/Toast";

function myAddress() {
  const { t } = useTranslation();
  const [coin, setCoin] = useState("USDT");
  const [address, setAddress] = useState("");
  const account = localStorage.getItem("account");
  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const { code, data } = await getRechargeAddress();
    if (code == 0) setAddress(data.address || account);
  };
  function right() {
    return (
      <img
        className="record"
        src={recordPng}
        onClick={() => {
          nav("/drawalAndRecharge");
        }}
      />
    );
  }
  return (
    <div className={style.root}>
      <div className="address-wrap">
        <Back content={<div></div>} right={right()} />
        {address && (
          <div className="address-content">
            <div className="tip">
              {t("address.recharge")}
              {coin}
            </div>
            <QRCodeSVG
              width={400}
              height={400}
              value={address}
              className="qrcode"
            />

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
                Toast.notice(t("common.copy"), {});

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
                Toast.notice(t("common.copy"), {});
                copy(address);
              }}
            >
              {t("common.sure")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default myAddress;
