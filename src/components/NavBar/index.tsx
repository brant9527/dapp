import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import jiaohuan from "@/assets/jiaohuan.png";
import hq from "@/assets/hangqing2.png";

import { useTranslation } from "react-i18next";
const state = {
  openState: false,
};

function Back(props: any) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [coin, setCoin] = useState("BTC");
  const [percent, setPercent] = useState(0.21);

  const back = useCallback(() => {
    nav(-1);
  }, [useNavigate]);
  return (
    <div className={style.root}>
      <div className="nav-wrap">
        <div className="nav">
          <img src={jiaohuan} onClick={() => back()} />
        </div>
        <div className="coinPart">{coin}/USDT</div>
        <div className={[percent > 0 ? "up" : "down", "percent"].join(" ")}>
          {percent}%
        </div>
        <div className="hq">
          <img src={hq} />
        </div>
      </div>
    </div>
  );
}
export default Back;