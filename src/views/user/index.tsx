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
function user() {
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
  const account = window.localStorage.getItem("account") || "";
  function title() {
    return <div className="user-title">{t("home.user-info")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="user-wrap">
        <Back content={title()}></Back>
        <img src={userInfo.fontUrl || userPng} className="head" />
        <div className="userName">{userInfo.userName}</div>
        <div className="info-part">
          <div className="info-item">
            <div className="left">{t("common.resign-info")}</div>
            <div className="right">{userInfo.email}</div>
          </div>
          <div className="info-item">
            <div className="left">UID</div>
            <div className="right">
              {userInfo.userId}
              <img
                src={copyPng}
                onClick={() => {
                  Toast.notice(t("common.copy"), { duration: 1000 });
                  copy(userInfo.userId);
                }}
              />
            </div>
          </div>
          <div className="info-item">
            <div className="left">{t("common.address")}</div>
            <div className="right">
              {userInfo.ethAddress}
              <img
                src={copyPng}
                onClick={() => {
                  Toast.notice(t("common.copy"), { duration: 1000 });
                  copy(userInfo.ethAddress);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default user;
