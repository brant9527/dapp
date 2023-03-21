import React, {
  Component,
  useCallback,
  useState,
  Fragment,
  useEffect,
} from "react";
import * as ReactDOMClient from "react-dom/client";

import style from "./index.module.scss";
import back from "@/assets/left.png";

import user from "@/assets/user.png";
import copyPng from "@/assets/btn-copy.png";
import userBg from "@/assets/user-bg.png";
import wdzh from "@/assets/wdzh.png";
import jyjl from "@/assets/jyjl.png";
import smrz from "@/assets/smrz.png";
import yxbd from "@/assets/yxbd.png";
import xyf from "@/assets/xyf.png";
import bdhb from "@/assets/bdhb.png";
import yy from "@/assets/yy.png";
import right from "@/assets/right.png";
import { useTranslation } from "react-i18next";
import { getUserInfo } from "@/api/userInfo";
import copy from "copy-to-clipboard";
import Toast from "@/components/Toast";
interface stateType {
  openState: boolean;
  navigate(path: string): void;
}
const stateProps: stateType = {
  openState: false,
  navigate(path: string) {
    () => 1;
  },
};

function Menulist() {
  const { t } = useTranslation();
  const certified = localStorage.getItem("certified");
  const list = [
    { imgSrc: wdzh, label: t("home.menu-wdzh"), path: "/user" },
    // { imgSrc: jyjl, label: t("home.menu-jyjl"), path: "/transRecord" },
    { imgSrc: smrz, label: t("home.menu-smrz"), path: "/auth" },
    { imgSrc: yxbd, label: t("home.menu-yxbd"), path: "/bindEmail" },
    { imgSrc: xyf, label: t("home.menu-xyf"), path: "/" },
    // { imgSrc: bdhb, label: t("home.menu-bdhb"), path: "/" },
    { imgSrc: yy, label: t("home.menu-yy"), path: "/language" },
  ];
  const navTo = (path: string) => {
    return stateProps.navigate(path);
  };
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
  return (
    <div className={style.root}>
      <div className="menu-wrap">
        <div className="mask"></div>
        <div className="menu-content">
          <div className="menu-back">
            <img src={back} onClick={() => close()} />
          </div>
          <div className="user-info">
            <img src={user} className="user" />
            <div className="user-detail">
              <div className="user-core">
                信用積分: <span>{userInfo.creditScore}</span>
              </div>
              <div className="user-uid">
                UID:{userInfo.userId}{" "}
                <img
                  src={copyPng}
                  onClick={() => {
                    Toast.notice(t("common.copy"), { duration: 1000 });
                    copy(userInfo.userId);
                  }}
                />
              </div>
              <div
                className={`user-bg ${
                  userInfo.certifiedLevel == 2 ? "certified" : "not-certified"
                }`}
              >
                {userInfo.certifiedLevel == 2
                  ? t("home.certified")
                  : t("home.not-certified")}
              </div>
            </div>
          </div>
          <div className="progress">
            <div className="progress-top">
              <div className="left">Prime {userInfo.memberLevel}</div>
              <div className="right">Prime {userInfo.memberLevel + 1}</div>
            </div>
            <div className="progress-center">
              <div className="progress-bar" style={{ width: "50%" }}></div>
            </div>
            <div className="progress-bottom">
              <div className="left">
                {t("home.current-rate")}{" "}
                <span>
                  {(userInfo.needAmount || 0) / (userInfo.totalRecharge || 0)} %
                </span>
              </div>
              <div className="right">
                {t("home.current-target")}{' '}
                <span>{userInfo.needAmount || 0} USDT</span>
              </div>
            </div>
          </div>
          <div className="menu-list">
            {list.map((item, index) => {
              return (
                <div
                  className="list-item"
                  key={index}
                  onClick={() => {
                    close();
                    navTo(item.path);
                  }}
                >
                  <div className="left">
                    <img src={item.imgSrc} className="icon" />
                    <div className="label">{item.label}</div>
                  </div>
                  <img src={right} className="right" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
function close() {
  stateProps.openState = false;
  MenuRender();
}
function open(navigate: any) {
  stateProps.openState = true;
  stateProps.navigate = navigate;
  MenuRender();
}
function createContainer() {
  let container = document.getElementById("menuList");
  console.log(container);
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", "menuList");
    document.body.appendChild(container);
  }

  const root = ReactDOMClient.createRoot(container);
  return root;
}
const root = createContainer();
function MenuRender() {
  root.render(stateProps.openState ? <Menulist /> : <></>);
}

export default {
  open: open,
  close: close,
};
