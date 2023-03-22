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
import { getJuniorCertified } from "@/api/userInfo";

import Toast from "@/components/Toast";

function BindEmail() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [email, setEmail] = useState<any>("");
  const [mobile, setMobile] = useState<any>("");

  useEffect(() => {
    getData();
  }, []);
  
  const getData = async () => {
    console.log("請求");
  };
  const onInputMobile = async (val: any) => {
    console.log("输入", val);
    setMobile(val);
  };
  const onInputEmail = async (val: any) => {
    console.log("输入", val);
    setEmail(val);
  };
  const onSubmit = async () => {
    const params = {
      mobile,
      email,
    };

    const data: any = await getJuniorCertified(params);
    if (data.code == 0) {
      Toast.notice(t("common.upload-tip"), { duration: 3000 });
      nav("/auth");
    }
  };

  function title() {
    return <div className="email-title">{t("common.email.bind")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="email-wrap">
        <Back content={title()}></Back>
        <div className="email-content">
          <div className="email-label">{t("common.mobile.number")}</div>
          <CusInput
            alignLeft
            isBtn={false}
            defaultVal={mobile}
            onInput={onInputMobile}
          ></CusInput>
          <div className="email-label">{t("common.email.address")}</div>
          <CusInput
            alignLeft
            isBtn={false}
            defaultVal={email}
            onInput={onInputEmail}
          ></CusInput>
          <div
            className="btn-next"
            onClick={() => {
              onSubmit();
            }}
          >
            {t("common.sure")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BindEmail;
