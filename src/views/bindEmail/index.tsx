import { useCallback, useEffect, useRef, useState } from "react";

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
import CusInput from "@/components/CusInput";

import Back from "@/components/Back";
import { bindEmail, getJuniorCertified, getUserInfo } from "@/api/userInfo";

import Toast from "@/components/Toast";

function BindEmail() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [search, setsearch] = useSearchParams();
  // 有值默认是只需要绑定邮箱
  const isPhone = search.get("isPhone");
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    console.log("請求");
    const { data, code } = await getUserInfo();
    if (code == 0) {
      setUserInfo(data);
    }
  };
  const onInputMobile = async (val: any) => {
    console.log("输入", val);
    userInfo.mobile = val;
    setUserInfo(userInfo);
  };
  const onInputEmail = async (val: any) => {
    console.log("输入", val);
    userInfo.email = val;

    setUserInfo(userInfo);
  };
  const onSubmit = async () => {
    if(isPhone){
      const data: any = await bindEmail(userInfo);
    if (data.code == 0) {
      Toast.notice(t("common.upload-tip"), {});
      nav("/");
    }
    }else{
      const data: any = await getJuniorCertified(userInfo);
    if (data.code == 0) {
      Toast.notice(t("common.upload-tip"), {});
      nav("/auth");
    }
    }
    
  };

  function title() {
    return <div className="email-title">{isPhone?t("common.email.bind"):t("auth.primary-auth")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="email-wrap">
        <Back content={title()}></Back>
        <div className="email-content">
          {!isPhone&& (
            <>
              <div className="email-label">{t("common.mobile.number")}</div>
              <CusInput
                alignLeft
                isBtn={false}
                defaultVal={userInfo.mobile}
                onInput={onInputMobile}
              ></CusInput>
            </>
          )}
          <div className="email-label">{t("common.email.address")}</div>
          <CusInput
            alignLeft
            isBtn={false}
            defaultVal={userInfo.email}
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
