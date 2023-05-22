import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
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
import { bindBank } from "@/api/home";

function myAddress() {
  const { t } = useTranslation();
  const [search, setsearch] = useSearchParams();
  // 有值默认是只需要绑定邮箱
  const maintainType = search.get("maintainType");
  console.log("maintainType=>", maintainType);
  const [dataList, setDataList] = useState([
    { label: t("bank.USD"), value: "USD" },
    { label: t("bank.EUR"), value: "EUR" },
    { label: t("bank.JPY"), value: "JPY" },
    { label: t("bank.GBP"), value: "GBP" },
    { label: t("bank.AUD"), value: "AUD" },
  ]);
  const [params, setParams] = useState<any>({
    bankAcctNumber: "",
    bankAddress: "",
    bankCode: "",
    bankName: "",
    companyAddress: "",
    homeAddress: "",
    legalCurrency: "",
    maintainType: maintainType || "1",
    name: "",
    openBank: "1",
  });

  const selectRef = useRef<any>(null);
  const bankAcctNumberRef = useRef<any>(null);
  const nameRef = useRef<any>(null);
  const homeAddressRef = useRef<any>(null);
  const bankNameRef = useRef<any>(null);
  const bankAddressRef = useRef<any>(null);
  const companyAddressRef = useRef<any>(null);
  const bankCodeRef = useRef<any>(null);

  const nav = useNavigate();

  useEffect(() => {
    if (maintainType === "2") {
      getData();
    }
  }, [maintainType]);
  const getData = async () => {
    const data: any = JSON.parse(localStorage.getItem("bankCardInfo") || "{}");
    setParams(data);
    console.log(data);
    bankAcctNumberRef.current.setVal(data.bankAcctNumber);
    nameRef.current.setVal(data.name);
    homeAddressRef.current.setVal(data.homeAddress);
    bankNameRef.current.setVal(data.bankName);
    bankAddressRef.current.setVal(data.bankAddress);
    companyAddressRef.current.setVal(data.companyAddress);
    bankCodeRef.current.setVal(data.bankCode);
  };

  const onInput = useCallback(
    (val: any, key: string) => {
      setParams({ ...params, [key]: val });
    },
    [params]
  );
  function title() {
    return <div className="bank-title">{t("bank.card")}</div>;
  }
  const apply = async () => {
    // if (!params.amount) {
    //   return Toast.notice(t("lend.tip-amount"), {});
    // }

    const { code, data } = await bindBank(params);
    if (code == 0) {
      Toast.notice(t("common.success"), {});
      nav("/bankList");
    }
  };
  const onSelect = useCallback(
    (item: any) => {
      setParams({ ...params, legalCurrency: item.value, label: item.label });
    },
    [params]
  );
  return (
    <div className={style.root}>
      <div className="bank-wrap">
        <Back content={title()} />

        <div className="bank-content">
          <div className="bank-text">{t("bank.name")}</div>
          <div className="bank-amount">
            <CusInput
              ref={nameRef}
              alignLeft
              isBtn={false}
              inputType="text"
              onInput={(val: any) => onInput(val, "name")}
            ></CusInput>
          </div>
          <div className="bank-text">{t("bank.address")}</div>
          <div className="bank-amount">
            <CusInput
              ref={homeAddressRef}
              alignLeft
              isBtn={false}
              inputType="text"

              onInput={(val: any) => onInput(val, "homeAddress")}
            ></CusInput>
          </div>
          <div className="bank-text">{t("bank.bank-name")}</div>
          <div className="bank-amount">
            <CusInput
              ref={bankNameRef}
              alignLeft
              isBtn={false}
              inputType="text"

              onInput={(val: any) => onInput(val, "bankName")}
            ></CusInput>
          </div>
          <div className="bank-text">{t("bank.bank-account")}</div>
          <div className="bank-amount">
            <CusInput
              ref={bankAcctNumberRef}
              alignLeft
              isBtn={false}
              onInput={(val: any) => onInput(val, "bankAcctNumber")}
            ></CusInput>
          </div>
          <div className="bank-text">{t("bank.bank-address")}</div>
          <div className="bank-amount">
            <CusInput
              ref={bankAddressRef}
              alignLeft
              isBtn={false}
              inputType="text"

              onInput={(val: any) => onInput(val, "bankAddress")}
            ></CusInput>
          </div>
          <div className="bank-text">{t("bank.company-address")}</div>
          <div className="bank-amount">
            <CusInput
              ref={companyAddressRef}
              alignLeft
              isBtn={false}
              inputType="text"

              onInput={(val: any) => onInput(val, "companyAddress")}
            ></CusInput>
          </div>
          <div className="bank-text">{t("bank.bank-code")}</div>
          <div className="bank-amount">
            <CusInput
              ref={bankCodeRef}
              alignLeft
              inputType="text"

              isBtn={false}
              onInput={(val: any) => onInput(val, "bankCode")}
            ></CusInput>
          </div>
          <div className="bank-text">{t("bank.legal-currency")}</div>
          <div
            className="bank-chain"
            onClick={() => {
              selectRef.current.open();
            }}
          >
            <div>{`${params.label || params.legalCurrency}`}</div>
            <img src={rightPng} />
          </div>

          <div
            className="btn"
            onClick={() => {
              apply();
            }}
          >
            {t("bank.save")}
          </div>
        </div>
      </div>
      <Select
        ref={selectRef}
        configList={dataList.map((item: any) => {
          return { ...item, label: `${item.label}` };
        })}
        onSelect={onSelect}
      ></Select>
    </div>
  );
}

export default myAddress;
