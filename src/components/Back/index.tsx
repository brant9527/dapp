import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
const state = {
  openState: false,
};

function Back(props: any) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const back = useCallback(() => {
    if (window.history.length > 1) {
      nav(-1);
    } else {
      nav("/");
    }
  }, [useNavigate]);
  return (
    <div className={style.root}>
      <div className="back-wrap">
        <div className="nav">
          <img src={backImg} onClick={() => back()} />
        </div>
        {props.content && <div className="title-bar">{props.content}</div>}
        {props.right && <div className="nav-right">{props.right}</div>}
      </div>
    </div>
  );
}
export default Back;
