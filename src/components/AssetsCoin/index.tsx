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
  const { list = [], spot } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  const back = useCallback(() => {
    nav(-1);
  }, [useNavigate]);
  const onExchange = (item: any) => {
    nav(
      `/exchange?count=${
        item.count
      }&asset=${item.asset}`
    );
  };
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
                <div>
                  <div className="coin-count">{fixPrice(item.count)}</div>
                  <div className="coin-usdt">≈{fixPrice(item.usdtBalance)}</div>
                </div>
                {spot && (
                  <div className="exchange-wrap">
                    {item.asset !== "USDT" && (
                      <div
                        className="exchange"
                        onClick={(e) => {
                          onExchange(item);
                          e.stopPropagation();
                        }}
                      >
                        {t("exchange.exchange") + " >"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default AssetsCoin;
