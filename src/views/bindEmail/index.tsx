import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";
import CusInput from "@/components/CusInput";

import Back from "@/components/Back";

import {
  getDelegationPage,
  onTradeCancel,
  getDealRecordPage,
} from "@/api/trade";
import Entrust from "@/components/Entrust";

function BindEmail() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [entrustList, setEntrustList] = useState<any>([]);

  useEffect(() => {
    getData();
  }, []);
  const onCancel = useCallback(async (params: any) => {
    console.log("取消參數", params);

    let ids = [];
    if (params.type === "all") {
      ids = entrustList.map((item: any) => item.id);
    } else {
      ids = [params.id];
    }
    await onTradeCancel({ ids });
  }, []);
  const getData = async () => {
    console.log("請求");
  };
  const onInput = async (val: any) => {
    console.log("输入", val);
  };

  function title() {
    return <div className="email-title">{t("common.email.bind")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="email-wrap">
        <Back content={title()}></Back>
        <div className="email-content">
          <div className="email-address">{t("common.email.address")}</div>
          <CusInput isBtn={false} onInput={onInput}></CusInput>
          <div className="btn-next">{t("common.btn.next")}</div>
        </div>
      </div>
    </div>
  );
}

export default BindEmail;
