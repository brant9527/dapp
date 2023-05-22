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

import Toast from "@/components/Toast";
import Select from "@/components/Select";
import CusInput from "@/components/CusInput";
import { getUserBankList, deleteBank } from "@/api/home";

function bankList() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");

  const [dataList, setDataList] = useState<any>([]);

  const nav = useNavigate();

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const { code, data } = await getUserBankList();
    if (code == 0) {
      setDataList(data);
    }
  };
  const onDelete = async (item: any) => {
    const { code, data } = await deleteBank({ id: item.id });

    if (code == 0) {
      await getData();
    }
  };

  function title() {
    return <div className="bank-title">{t("bank.receive-type")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="bankList-wrap">
        <Back content={title()} />

        <div className="bankList-content">
          {dataList.map((item: any, index: number) => {
            return (
              <div
                className="card-wrap"
                onClick={(e) => {
                  localStorage.setItem("bankCardInfo", JSON.stringify(item));
                  nav("/bankDetail?maintainType=2");
                }}
                key={index}
              >
                <div className="card-left">
                  <div>{item.bankName}</div>
                  <div>{item.bankAcctNumber}</div>
                  <div>{item.name}</div>
                </div>
                <div className="card-right">
                  <span
                    onClick={(e) => {
                      onDelete(item);
                      e.stopPropagation();
                    }}
                  >
                    {t("bank.delete")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="btn"
          onClick={() => {
            nav("/bankDetail?maintainType=1");
          }}
        >
          {t("bank.add")}
        </div>
      </div>
    </div>
  );
}

export default bankList;
