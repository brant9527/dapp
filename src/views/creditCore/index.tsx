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

import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";
import { getUserInfo } from "@/api/userInfo";
import shadowBg from "@/assets/bg-ty.png";
function CreditCore() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [userInfo, setUserInfo] = useState<any>([]);

  const page = {
    pageNo: 1,
    pageSize: 20,
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await getUserInfo();
    setUserInfo(data);
  };
  function title() {
    return <div className="credit-title">{t("credit.title")}</div>;
  }
  return (
    <div className={style.root}>
      <div className="credit-wrap">
        <Back content={title()}></Back>

        <div className="credit-content">
          <div className="core">
            <div className="tip">{t("credit.current")}</div>
            <div>{userInfo?.creditScore}</div>
            <div className="status">
              {userInfo?.creditScore < 60
                ? t("credit.bad")
                : userInfo?.creditScore < 80
                ? t("credit.normol")
                : userInfo?.creditScore < 90
                ? t("credit.good")
                : t("credit.very-good")}
            </div>


          </div>
          <img src={shadowBg} className="shadow-img" />

        </div>
      </div>
    </div>
  );
}

export default CreditCore;
