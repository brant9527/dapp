import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
import { fixPrice, toFixed } from "@/utils/public";

const state = {
  openState: false,
};

function AssetsCoin(props: any) {
  const { list } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  const back = useCallback(() => {
    nav(-1);
  }, [useNavigate]);
  return (
    <div className={style.root}>
      <div className="assets-coin">
        {list.map((item: any, idx: any) => {
          return (
            <div className="coin-item" key={idx}>
              <div className="coin-left">
                <img className="coin-logo" src={item.logo} />
                <div className="">
                  <div className="coin-name_top">{item.asset}</div>
                  <div className="coin-name_bottom">{item.fullName}</div>
                </div>
              </div>
              <div className="coin-right">
                <div className="coin-count">{toFixed(item.count, 2)}</div>
                <div className="coin-usdt">≈{fixPrice(item.usdtBalance)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AssetsCoin;
