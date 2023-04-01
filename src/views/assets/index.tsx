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
import {
  getTotalAssetBalance,
  getFundsAssetBalance,
  getSpotAssetBalance,
  getTradeAssetBalance,
} from "@/api/trans";
import AssetsCoin from "@/components/AssetsCoin";

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
      title: t("assets.deposit"),
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
  const assetsCoinListInit = [
    {
      logo: eth,
      asset: "BTC",
      count: 0.4,
      fullName: null,
      usdtBalance: 0,
    },
  ];

  const assetsContractCoinListInit = [
    {
      logo: eth,

      asset: "BTC",
      availableBalance: 0,
      count: 0,
      freezeBalance: 0,
      fullName: "Btccoiin",
    },
  ];
  const [assetsList, setAssetsList] = useState(assetsAllInit);
  const [assetsCoinList, setAssetsCoinList] = useState([]);
  const [assetsContractCoinList, setAssetsContractCoinList] = useState([]);
  const [totalBtcBalance, setTotalBtcBalance] = useState(0);
  const [totalUsdtBalance, setTotalUsdtBalance] = useState(0);

  const getData = async () => {
    let method;
    if (type == "all") {
      method = getTotalAssetBalance;
    } else if (type == "trade") {
      method = getTradeAssetBalance;
    } else {
      method = getFundsAssetBalance;
    }
    const { data } = await method();

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
    } else {
      setAssetsContractCoinList(data.detailList);
    }
  };
  useEffect(() => {
    getData();
  }, [type]);
  return (
    <div className={style.root}>
      <div className="assets-wrap">
        <CommonTab onChange={onChange} list={navList} />
        <div className="content-center">
          <div className="assets-all">{t("assets.allAssessment")}</div>
          <div className="assets-all-usdt">{totalBtcBalance} BTC</div>
          <div className="assets-all-about">≈{totalUsdtBalance}</div>
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
          {type === "all" ? (
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
          ) : type === "trade" ? (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                <AssetsCoin list={assetsCoinList}></AssetsCoin>
                {/* {assetsCoinList.map((item:any, idx) => {
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
                })} */}
              </div>
            </>
          ) : (
            <>
              <div className="invest-title">{t("assets.assets")}</div>
              <div className="assets-list">
                {assetsContractCoinList.map((item:any, idx) => {
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
        </div>
      </div>
    </div>
  );
}

export default Assets;
