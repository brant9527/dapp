import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import search from "@/assets/search.png";
import Tabs from "@/components/Tabs";
function Quotation() {
  const { t } = useTranslation();
  const [type, setType] = useState("optional");
  const onChange = (type: string) => {
    console.log(type);
    setType(type);
  };

  const navList = [
    {
      title: t("nav.home"),

      path: "home",
    },
    {
      title: t("nav.quotation"),

      path: "quotation",
    },
    {
      title: t("nav.stock"),

      path: "stock",
    },
    {
      title: t("nav.contract"),

      path: "contract",
    },
    {
      title: t("nav.assets"),

      path: "assets",
    },
  ];
  return (
    <div className={style.root}>
      <div className="quota-wrap">
        <div className="input-bg">
          <img src={search} />
          <span className="text">{t("quota.search")}</span>
        </div>
        <Tabs onChange={onChange}></Tabs>
      </div>
    </div>
  );
}

export default Quotation;
