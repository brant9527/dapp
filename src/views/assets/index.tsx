import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import CommonTab from "@/components/CommonTab";
import eth from "@/assets/eth.png";

function Assets() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [type, setType] = useState("all");
  const onChange = (type: string) => {
    setType(type);
  };

  const navList = [
    {
      title: t("assets.all"),
      type: "all",
    },
    {
      title: t("assets.trade"),
      type: "trade",
    },
    {
      title: t("assets.funds"),
      type: "funds",
    },
  ];
  const tabsList = [
    {
      title: t("assets.myAddress"),
      path: "/myAddress",
    },
    {
      title: t("assets.assetsTrans"),
      path: "/assetsTrans",
    },
    {
      title: t("assets.transfer"),
      path: "/transfer",
    },
  ];
  const navTo = (path: any) => {
    nav(path);
  };
  const assetsList = [
    {
      title: t("assets.assets-stock"),
      num: 1212,
    },
    {
      title: t("assets.assets-funds"),
      num: 1212,
    },
    {
      title: t("assets.assets-contract"),
      num: 1212,
    },
    {
      title: t("assets.assets-lever"),
      num: 1212,
    },
  ];
  const assetsCoinList = [
    {
      logo: eth,
      asset: "BTC",
      count: 1,
      fullName: "Btccoin",
      usdtBalance: 12,
    },
  ];

  const assetsContractCoinList = [
    {
      logo: eth,

      asset: "BTC",
      availableBalance: 0,
      count: 0,
      freezeBalance: 0,
      fullName: "Btccoiin",
    },
  ];
  return (
    <div className={style.root}>
      <div className="assets-wrap">
        <CommonTab onChange={onChange} list={navList} />
        <div className="content-center">
          <div className="assets-all">{t("assets.allAssessment")}</div>
          <div className="assets-all-usdt">123112321.12</div>
          <div className="assets-all-about">≈123112321.12</div>
          <div className="assets-tabs">
            {tabsList.map((item, idx) => {
              return (
                <div
                  className={["assets-tab-item", idx === 0 ? "blue" : ""].join(
                    " "
                  )}
                  onClick={() => navTo(item.path)}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
        <div className="content-bottom">
          {type === "all" ? (
            <>
              <div className="invest-title">{t("assets.invest")}</div>
              <div className="assets-list">
                {assetsList.map((item, idx) => {
                  return (
                    <div className="assets-item" key={idx}>
                      <div className="assets-left">{item.title}</div>
                      <div className="assets-right">{item.num} USDT</div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : type === "trade" ? (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                {assetsCoinList.map((item, idx) => {
                  return (
                    <div className="coin-item" key={idx}>
                      <div className="coin-left">
                        <img className="coin-logo" src={item.logo} />
                        <div className="">
                          <div className="coin-name_top">{item.asset}</div>
                          <div className="coin-name_bottom">
                            {item.fullName}
                          </div>
                        </div>
                      </div>
                      <div className="coin-right">
                        <div className="coin-count">{item.count}</div>
                        <div className="coin-usdt">≈{item.usdtBalance}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                {assetsContractCoinList.map((item, idx) => {
                  return (
                    <div className="coin-cnc-item" key={idx}>
                      <div className="coin-cnc-left">
                        <img className="coin-cnc-logo" src={item.logo} />
                        <div className="">
                          <div className="coin-cnc-name_top">{item.asset}</div>
                          <div className="coin-cnc-name_bottom">
                            {item.fullName}
                          </div>
                          <div className="coin-cnc-use_top">
                            {t("assets.useable")}
                          </div>
                          <div className="coin-cnc-use_bottom">
                            {item.availableBalance}
                          </div>
                        </div>
                      </div>
                      <div className="coin-cnc-right">
                        <div className="coin-cnc-count">{item.count}</div>

                        <div className="coin-cnc-frozen">
                          {t("assets.frozen")}
                        </div>
                        <div className="coin-cnc-usdt">
                          ≈{item.freezeBalance}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assets;
