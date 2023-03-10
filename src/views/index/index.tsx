import { useCallback, useEffect, useRef, useState } from "react";

import "./index.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import home1 from "../../assets/home1.png";
import home2 from "../../assets/home2.png";
import hangqing1 from "../../assets/hangqing1.png";
import hangqing2 from "../../assets/hangqing2.png";
import xianhuo1 from "../../assets/xianhuo1.png";
import xianhuo2 from "../../assets/xianhuo2.png";
import heyue1 from "../../assets/heyue1.png";
import heyue2 from "../../assets/heyue2.png";
import zichan1 from "../../assets/zichan1.png";
import zichan2 from "../../assets/zichan2.png";

function App() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const onClick = useCallback(() => {
    setIndex;
  }, []);

  const navList = [
    {
      title: t("nav.home"),
      src1: home1,
      src2: home2,
      path: "home",
    },
    {
      title: t("nav.quotation"),
      src1: hangqing1,
      src2: hangqing2,
      path: "quotation",
    },
    {
      title: t("nav.stock"),
      src1: xianhuo1,
      src2: xianhuo2,
      path: "stock",
    },
    {
      title: t("nav.contract"),
      src1: heyue1,
      src2: heyue2,
      path: "contract",
    },
    {
      title: t("nav.assets"),
      src1: zichan1,
      src2: zichan2,
      path: "assets",
    },
  ];
  return (
    <div className="app-content-wrap">
      <div className="app-content">
        <Outlet></Outlet>
      </div>
      <div className="flex-nav nav-bg">
        {navList.map((item, i) => {
          return (
            <div onClick={() => setIndex(i)} key={i} className="nav-item-wrap">
              <Link to={item.path} className="nav-item">
                <img src={index === i ? item.src1 : item.src2} alt="" />
                <div className={index === i ? "active" : "title"}>
                  {item.title}
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
