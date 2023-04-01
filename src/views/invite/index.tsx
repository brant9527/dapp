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

import yaoqingbg from "@/assets/yaoqingbg.png";

import copyPng from "@/assets/btn-copy.png";

import { getUserInfo } from "@/api/userInfo";

import copy from "copy-to-clipboard";
import Toast from "@/components/Toast";
function Invite() {
  const { t } = useTranslation();
  const [url,setUrl] = useState()
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
    return <div className="invite-title">{t("invite.title")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="invite-wrap">
        <Back content={title()}></Back>
        <div className="invite-big-title">{t("invite.big-title")}</div>
        <div className="invite-info">{t("invite.info1",{percent:'30%'})}</div>
        <div className="invite-info">{t("invite.info2",{amount:5})}</div>
        <img src={yaoqingbg} className="bg" />

        <div className="invite-tip">{t('invite.tip')}</div>
        <div className="invite-copyy">
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default Invite;
