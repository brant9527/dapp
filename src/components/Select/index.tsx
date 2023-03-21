import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";

function Select(props: any) {
  const { configList, onSelect } = props;

  const { t } = useTranslation();

  return (
    <div className={style.root}>
      <div className="select-wrap">
        <div className="mask"></div>
        <div className="select-list">
          {configList.map((item: any, index: any) => {
            return (
              <div
                className="select-item"
                key={index}
                onClick={() => {
                  onSelect(item);
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
        <div
          className="select-cancel"
          onClick={() => {
            onSelect("cancel");
          }}
        >
          {t("common.cancel")}
        </div>
      </div>
    </div>
  );
}
export default Select;
