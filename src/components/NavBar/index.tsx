import React, { Component, useCallback, useState, Fragment, memo } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import jiaohuan from "@/assets/jiaohuan.png";
import hq from "@/assets/hangqing2.png";

import { useTranslation } from "react-i18next";
import { toFixed } from "@/utils/public";
const state = {
  openState: false,
};

function Back(props: any) {
  const { navHandle, coin, percent, contractType } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  return (
    <div className={style.root}>
      <div className="nav-wrap">
        <div className="nav">
          <img src={jiaohuan} onClick={() => navHandle("/search")} />
        </div>
        <div className="coinPart">
          <div>{coin}/USDT</div>
          <div className="contract-type">
            {contractType &&
              (contractType === "swap" ? t("tabs.swap") : t("tabs.delivery"))}
          </div>
        </div>
        <div className={[percent > 0 ? "up" : "down", "percent"].join(" ")}>
          {toFixed(percent * 100, 2)}%
        </div>
        <div className="hq">
          <img src={hq} onClick={() => navHandle("/kLine")} />
        </div>
      </div>
    </div>
  );
}
export default memo(Back);
