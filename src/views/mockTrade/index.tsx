import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,

} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Contract from "@/views/contract";

import rightPng from "@/assets/right.png";
import { getHelpType } from "@/api/home";
const page = {
  pageNo: 1,
  pageSize: 20,
};
function MockTrade() {
  const nav = useNavigate()
  // const [search, setsearch] = useSearchParams();
  // const tradeType = search.get("tradeType") || "spot";
  const { t } = useTranslation();
  window.localStorage.setItem("mock", "1");
  
  return (
    <div className={style.root}>
      <div className="mock-wrap">
        <Contract mock={true}></Contract>
      </div>
    </div>
  );
}

export default MockTrade;
