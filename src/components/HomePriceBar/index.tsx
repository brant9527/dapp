import React, { Component, useCallback, useState, Fragment, memo } from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";
const state = {
  openState: false,
};

function Bar(props: any) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const back = useCallback(() => {
    nav(-1);
  }, [useNavigate]);
  return <div className="bar-wrap"></div>;
}
export default memo(Bar);
