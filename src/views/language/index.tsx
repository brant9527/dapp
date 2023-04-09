import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
function App() {
  const { t } = useTranslation();

  const [language, setLanguage] = useState(
    window.localStorage.getItem("language") || "en"
  );

  const OnChageLg = useCallback(
    (type: string) => {
      if (language === type) {
        return;
      } else {
        setLanguage(type);
      }

      window.localStorage.setItem("language", type);
      i18in.changeLanguage(type);
    },
    [language]
  );
  const navList = [
    {
      title: t("lg.en"),
      lgType: "en",
    },
    {
      title: t("lg.hk"),
      lgType: "zh_TW",
    },
  ];
  return (
    <div className={style.root}>
      <div className="lg-wrap">
        <Back />
        <div className="item-wrap">
          {navList.map((item, index) => {
            return (
              <div
                key={index}
                className="lg-item"
                onClick={() => {
                  OnChageLg(item.lgType);
                }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
