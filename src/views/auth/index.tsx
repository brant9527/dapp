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

import Back from "@/components/Back";

import userPng from "@/assets/user.png";

import copyPng from "@/assets/btn-copy.png";

import { getUserInfo } from "@/api/userInfo";

import copy from "copy-to-clipboard";
import Toast from "@/components/Toast";
function auth() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [userInfo, setUserInfo] = useState<any>({});
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    // account,tradeType   json格式
    //   tradeType包含：delivery-交割，swap-永续，spot-现货
    console.log("請求數據");
    const data: any = await getUserInfo();
    console.log(data);
    if (data) {
      setUserInfo(data?.data);
    }
  };
  const account = localStorage.getItem("account") || "";
  function title() {
    return <div className="auth-title">{t("home.menu-smrz")}</div>;
  }
  const v2 = () => {
    if (userInfo.juniorStatus != 1) {
      return Toast.notice(t("auth.need-v1"), { duration: 2000 });
    }
    nav("/identity");
  };
  return (
    <div className={style.root}>
      <div className="auth-wrap">
        <Back content={title()}></Back>
        <div className="auth-item border">
          <div className="item-top">
            <div className="auth-left">LV.1 {t("auth.primary-auth")}</div>
            <div className="auth-right">
              {userInfo.ethAddress &&
                typeof userInfo.juniorStatus !== "number" && (
                  <span
                    className="need-auth"
                    onClick={() => {
                      nav("/bindEmail");
                    }}
                  >
                    {t("auth.need-auth")}
                  </span>
                )}
              {userInfo.juniorStatus == 1 && (
                <span className="passed">{t("status.passed")}</span>
              )}
              {userInfo.juniorStatus == 0 && (
                <span className="wait">{t("status.wait")}</span>
              )}
              {userInfo.juniorStatus == 2 && (
                <>
                  <span className="reject">{t("status.reject")}</span>
                  <span
                    className="need-auth"
                    onClick={() => {
                      nav("/bindEmail");
                    }}
                  >
                    {" " + t("auth.need-auth")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="item-bottom">{t("auth.primary-tip")}</div>
        </div>
        <div className="auth-item ">
          <div className="item-top">
            <div className="auth-left">LV.2 {t("auth.advanced-auth")}</div>
            <div className="auth-right">
              {userInfo.ethAddress &&
                typeof userInfo.highStatus !== "number" && (
                  <span
                    className="need-auth"
                    onClick={() => {
                      v2();
                    }}
                  >
                    {t("auth.need-auth")}
                  </span>
                )}
              {userInfo.highStatus == 0 && (
                <span className="wait">{t("status.wait")} </span>
              )}
              {userInfo.highStatus == 1 && (
                <span className="passed">{t("status.passed")}</span>
              )}

              {userInfo.highStatus == 2 && (
                <>
                  <span className="reject">{t("status.reject")}</span>
                  <span
                    className="need-auth"
                    onClick={() => {
                      v2();
                    }}
                  >
                    {" " + t("auth.need-auth")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="item-bottom">{t("auth.advanced-tip")}</div>
        </div>
      </div>
    </div>
  );
}

export default auth;
