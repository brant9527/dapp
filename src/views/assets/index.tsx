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

import eth from "@/assets/eth.png";
import {
  getTotalAssetBalance,
  getFundsAssetBalance,
  getSpotAssetBalance,
  getTradeTodayIncomeRate,
  getTradeAssetBalance,
  getWalletAssetBalance,
} from "@/api/trans";
import AssetsCoin from "@/components/AssetsCoin";
import { fixPrice } from "@/utils/public";

function Assets() {
  const { t } = useTranslation();
  // 初始化mock值
  window.localStorage.setItem("mock", '0');
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
    {
      title: t("assets.assets-stock"),
      type: "spot",
    },
    {
      title: t("assets.wallet"),
      type: "wallet",
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

      btcBalance: 0,
      usdtBalance: 0,
    },
    {
      title: t("assets.assets-funds"),
      btcBalance: 0,
      usdtBalance: 0,
    },
    {
      title: t("assets.assets-contract"),
      btcBalance: 0,
      usdtBalance: 0,
    },
    {
      title: t("assets.assets-lever"),
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
  const getData = async () => {
    let method;
    if (type == "all") {
      method = getTotalAssetBalance;
    } else if (type == "trade") {
      method = getTradeAssetBalance;
    } else if (type === "funds") {
      method = getFundsAssetBalance;
    } else if (type === "spot") {
      method = getSpotAssetBalance;
    } else {
      method = getWalletAssetBalance;
    }
    const { data } = await method();
    console.log(data);
    setTotalBtcBalance(data.totalBtcBalance);
    setTotalUsdtBalance(data.totalUsdtBalance);
    if (type === "all") {
      setAssetsList(
        data.detailList.map((item: any, idx: number) => {
          assetsList[idx].btcBalance = item.btcBalance;
          assetsList[idx].usdtBalance = item.usdtBalance;
          return assetsList[idx];
        })
      );
    } else if (type === "trade") {
      setAssetsCoinList(data.detailList);
    } else if (type === "funds") {
      setAssetsContractCoinList(data.detailList);
    } else if (type === "spot") {
      setAssetsSpotList(data.detailList);
    } else {
      setAssetsWalletList(data.detailList);
    }
  };
  const getIncme = async () => {
    const { data } = await getTradeTodayIncomeRate();
    setIncome(data);
  };
  useEffect(() => {
    getData();
    if (type === "trade") {
      getIncme();
    }
  }, [type]);
  return (
    <div className={style.root}>
      <div className="assets-wrap">
        <Tabs onChange={onChange} tabs={navList} />
        <div className="content-center">
          <div className="assets-all">{t("assets.allAssessment")}</div>
          <div className="assets-all-usdt">{fixPrice(totalBtcBalance)} BTC</div>
          <div className="assets-all-about">≈{fixPrice(totalUsdtBalance)}</div>
          {type === "trade" && (
            <div className="assets-income">
              <div className="income-title">{t("assets.income-title")}</div>
              <div
                className={`income-val ${income?.income > 0 ? "s" : "f"}`}
              >{`${fixPrice(income?.income || 0)} / ${fixPrice(
                income?.rate || 0
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
                        {item.usdtBalance} USDT
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
                            {item.availableBalance || 0}
                          </div>
                        </div>
                      </div>
                      <div className="coin-cnc-right">
                        <div className="coin-cnc-count">{item.count || 0}</div>

                        <div className="coin-cnc-frozen">
                          {t("assets.frozen")}
                        </div>
                        <div className="coin-cnc-usdt">
                          {item.freezeBalance || 0}
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
                <AssetsCoin list={assetsSpotList}></AssetsCoin>
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
