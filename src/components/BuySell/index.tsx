import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";

function Back(props: any) {
  const { onChangeType, type, isContract = false } = props;

  const { t } = useTranslation();
  const nav = useNavigate();

  return (
    <div className={style.root}>
      <div className="btns-wrap">
        <div
          className={["btn-left", type === "buy" ? "btn-active" : ""].join(" ")}
          onClick={() => {
            onChangeType("buy");
          }}
        >
          {isContract ? t("contract.do-more") : t("common.buy")}
        </div>
        <div className={["btn-arrow", `btn-arrow_${type}`].join(" ")}></div>
        <div
          className={["btn-right", type === "sell" ? "btn-active" : ""].join(
            " "
          )}
          onClick={() => {
            onChangeType("sell");
          }}
        >
          {isContract ? t("contract.do-short") : t("common.sell")}
        </div>
      </div>
    </div>
  );
}
export default React.memo(Back);
