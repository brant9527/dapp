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
import rightPng from "@/assets/right.png";
import copyPng from "@/assets/btn-copy.png";

import copy from "copy-to-clipboard";
import { getRechargeAddress, rechargeApply } from "@/api/userInfo";
import Toast from "@/components/Toast";
import Select from "@/components/Select";
import CusInput from "@/components/CusInput";

function myAddress() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [current, setCurrent] = useState<any>({});
  const [dataList, setDataList] = useState<any>([]);
  const account = window.localStorage.getItem("account");
  const selectRef = useRef<any>(null);
  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const { code, data } = await getRechargeAddress();
    if (code == 0 && data && data.length > 0) {
      setDataList(data);
      setCurrent(data[0]);
      setAddress(data[0].address);
    }
  };
  const apply = async () => {
    if (!amount) {
      return Toast.notice(t("lend.tip-amount"), {});
    }
    const params = {
      ...current,
      count: amount,
      receiveAddress: current.address,
    };
    const { code, data } = await rechargeApply(params);
    if (code == 0) {
      Toast.notice(t("common.success"), {});
      nav('/assetsAll')
    }
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
  const onSelect = (item: any) => {
    setCurrent(item);
    setAddress(item.address);
  };
  const onInputAmount = async (val: any) => {
    console.log("输入", val);
    setAmount(val);
  };
  return (
    <div className={style.root}>
      <div className="address-wrap">
        <Back content={<div></div>} right={right()} />
        {address && (
          <div className="address-content">
            <div className="tip">{t("address.recharge")}</div>
            <QRCodeSVG
              width={400}
              height={400}
              value={address}
              className="qrcode"
            />

            <div className="qrtip ">
              <div className="tip1">
                {t("address.tip1", {
                  coin: current.chain,
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
              {address} <img src={copyPng} />
            </div>
            <div className="address-text">{t("address.chain")}</div>
            <div
              className="address-chain"
              onClick={() => {
                selectRef.current.open();
              }}
            >
              <div>{`${current.chain}(${current.asset})`}</div>
              <img src={rightPng} />
            </div>
            <div className="address-text">{t("trans.count")}</div>
            <div className="address-amount">
              <CusInput
                alignLeft
                isBtn={false}
                onInput={onInputAmount}
              ></CusInput>
            </div>
            <div
              className="btn"
              onClick={() => {
                apply();
              }}
            >
              {t("common.sure")}
            </div>
          </div>
        )}
      </div>
      <Select
        ref={selectRef}
        configList={dataList.map((item: any) => {
          return { ...item, label: `${item.chain}(${item.asset})` };
        })}
        onSelect={onSelect}
      ></Select>
    </div>
  );
}

export default myAddress;
