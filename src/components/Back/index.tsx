import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import "./index.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
const state = {
  openState: false,
};

function Back(props: any) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const back = useCallback(() => {
    nav(-1);
  }, [useNavigate]);
  return (
    <div className="back-wrap">
      <div className="nav">
        <img src={backImg} onClick={() => back()} />
      </div>
      <div className="">{props.content}</div>
    </div>
  );
}
export default Back;
