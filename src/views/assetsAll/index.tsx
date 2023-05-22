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

import Tabs from "@/components/Tabs";

import recordPng from "@/assets/record.png";
import {
  getTotalAssetBalance,
  getFundsAssetBalance,
  getSpotAssetBalance,
  getTradeIncomeRate,
  getTradeAssetBalance,
} from "@/api/trans";
import AssetsCoin from "@/components/AssetsCoin";
import { fixPrice, toFixed } from "@/utils/public";

function Assets() {
  const { t } = useTranslation();
  // 初始化mock值
  window.localStorage.setItem("mock", "0");
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
      title: t("assets.assets-stock"),
      type: "spot",
    },
    {
      title: t("assets.funds"),
      type: "funds",
    },
    {
      title: t("assets.trade"),
      type: "trade",
    },
  ];
  const tabsList = [
    {
      title: t("assets.deposit"),
      path: "/myAddress",
    },
    {
      title: t("assets.assetsTrans"),
      path: "/assetsTrans",
    },
    {
      title: t("assets.transfer"),
      path: "/withdrawal",
    },
  ];
  const navTo = (path: any) => {
    nav(path);
  };
  const assetsAllInit = [
    {
      title: t("assets.assets-stock"),
      type: "spot",
      btcBalance: 0,
      usdtBalance: 0,
    },
    {
      title: t("assets.assets-funds"),
      type: "funds",

      btcBalance: 0,
      usdtBalance: 0,
    },
    {
      title: t("assets.assets-contract"),
      type: "trade",

      btcBalance: 0,
      usdtBalance: 0,
    },
  ];

  const [assetsList, setAssetsList] = useState(assetsAllInit);
  const [assetsCoinList, setAssetsCoinList] = useState([]);
  const [assetsContractCoinList, setAssetsContractCoinList] = useState([]);
  const [assetsWalletList, setAssetsWalletList] = useState([]);
  const [assetsSpotList, setAssetsSpotList] = useState([]);
  const [totalBtcBalance, setTotalBtcBalance] = useState(0);
  const [totalUsdtBalance, setTotalUsdtBalance] = useState(0);
  const [income, setIncome] = useState<any>({});
  const getData = useCallback(async () => {
    let method;
    if (type == "all") {
      method = getTotalAssetBalance;
    } else if (type == "trade") {
      method = getTradeAssetBalance;
    } else if (type === "funds") {
      method = getFundsAssetBalance;
    } else {
      method = getSpotAssetBalance;
    }
    const { data } = await method();
    console.log(data);
    setTotalBtcBalance(data.totalBtcBalance);
    setTotalUsdtBalance(data.totalUsdtBalance);
    if (type === "all") {
      data.detailList.map((item: any, idx: number) => {
        assetsList.forEach((cItem) => {
          if (cItem.type === item.accountType) {
            cItem.btcBalance = item.btcBalance;
            cItem.usdtBalance = item.usdtBalance;
          }
        });
      });
      setAssetsList(assetsList);
    } else if (type === "trade") {
      setAssetsCoinList(data.detailList);
    } else if (type === "funds") {
      setAssetsContractCoinList(data.detailList);
    } else if (type === "spot") {
      setAssetsSpotList(data.detailList);
    }
  }, [type]);
  const getIncme = useCallback(async () => {
    if (type !== "trade") {
      return false;
    }
    const { data } = await getTradeIncomeRate();
    setIncome(data);
  }, [type]);

  useEffect(() => {
    getData();
    getIncme();
    const timer = setInterval(() => {
      getData();
      getIncme();
    }, 3000);
    return () => clearInterval(timer);
  }, [type]);
  return (
    <div className={style.root}>
      <div className="assets-wrap">
        <Tabs onChange={onChange} tabs={navList} />
        <div className="content-center">
          <div className="assets-all">{t("assets.allAssessment")}</div>
          <div className="assets-all-usdt">
            <span>{fixPrice(totalUsdtBalance)} USDT</span>
            <img
              src={recordPng}
              onClick={() => {
                nav("/transRecord");
              }}
            />
          </div>

          <div className="assets-all-about">
            ≈{toFixed(totalBtcBalance, 4)} BTC
          </div>
          {type === "trade" && (
            <div className="assets-income">
              <div className="income-title">{t("assets.income-title")}</div>
              <div
                className={`income-val ${income?.income > 0 ? "s" : "f"}`}
              >{`${toFixed(income?.income || 0)} USDT / ${toFixed(
                (income?.rate || 0) * 100
              )}%`}</div>
            </div>
          )}
          <div className="assets-tabs">
            {tabsList.map((item, idx) => {
              return (
                <div
                  className={["assets-tab-item", idx === 0 ? "blue" : ""].join(
                    " "
                  )}
                  key={idx}
                  onClick={() => navTo(item.path)}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
        </div>
        <div className="content-bottom">
          {type === "all" && (
            <>
              <div className="invest-title">{t("assets.invest")}</div>
              <div className="assets-list">
                {assetsList.map((item, idx) => {
                  return (
                    <div className="assets-item" key={idx}>
                      <div className="assets-left">{item.title}</div>
                      <div className="assets-right">
                        {fixPrice(item.usdtBalance)} USDT
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {type === "trade" && (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                <AssetsCoin list={assetsCoinList}></AssetsCoin>
              </div>
            </>
          )}
          {type === "funds" && (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                {assetsContractCoinList.map((item: any, idx) => {
                  return (
                    <div className="coin-cnc-item" key={idx}>
                      <div className="coin-cnc-left">
                        <img className="coin-cnc-logo" src={item.logo} />
                        <div className="">
                          <div className="coin-cnc-name_top">
                            {item.asset || " "}
                          </div>
                          <div className="coin-cnc-name_bottom">
                            {item.fullName || "null"}
                          </div>
                          <div className="coin-cnc-use_top">
                            {t("assets.useable")}
                          </div>
                          <div className="coin-cnc-use_bottom">
                            {fixPrice(item.availableBalance || 0, 4)}
                          </div>
                        </div>
                      </div>
                      <div className="coin-cnc-right">
                        <div className="coin-cnc-count">
                          {fixPrice(item.count || 0, 4)}
                        </div>

                        <div className="coin-cnc-frozen">
                          {t("assets.frozen")}
                        </div>
                        <div className="coin-cnc-usdt">
                          {fixPrice(item.freezeBalance || 0, 4)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {type === "spot" && (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                <AssetsCoin list={assetsSpotList} spot="spot"></AssetsCoin>
              </div>
            </>
          )}
          {type === "wallet" && (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                <AssetsCoin list={assetsWalletList}></AssetsCoin>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assets;
