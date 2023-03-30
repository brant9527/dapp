import { useCallback, useEffect, useRef, useState } from "react";

import style from "./depth.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Toast from "@/components/Toast";
import PriceBar from "@/components/PriceBar";

import { fixPrice } from "@/utils/public";
import Tabs from "@/components/Tabs";
function Depth() {
  const { t } = useTranslation();
  const tabs = [
    {
      title: t("home.coins.hot"),
      type: "getHotList",
    },
    {
      title: t("tabs.optional"),
      type: "optional",
    },

    {
      title: t("home.coins.raise"),
      type: "getRiseSymbolList",
    },
    {
      title: t("home.coins.down"),
      type: "getFallSymbolList",
    },
    {
      title: t("home.coins.new"),
      type: "getNew",
    },
  ];
  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTC";
  const [headInfo, setHeadInfo] = useState<any>({});
  const [coin, setCoin] = useState(symbol);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    console.log(1);
  };
  const onChange = async (val: any) => {
    console.log(1);
  };

  // Toast.notice(t("common.noMore"), { duration: 3000 });

  return (
    <div className={style.root}>
      <div className="depth-content">
        <Tabs tabs={tabs} onChange={onChange}></Tabs>
        <div className="depth-bar">
          <div className="depth-part depth-top">
            <div className="left">{t("common.buy")}</div>
            <div className="right">{t("common.sell")}</div>
          </div>
          <div className="depth-part depth-top">
            <div className="price-bar_wrap">
              <PriceBar></PriceBar>
            </div>
            <PriceBar></PriceBar>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Depth;
