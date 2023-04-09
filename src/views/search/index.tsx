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

import searchPng from "@/assets/search.png";
import noCollect from "@/assets/no-collect.png";
import collect from "@/assets/collect.png";


import QuotaCoin from "@/components/QuotaCoin";
import { searchPair } from "@/api/common";
import _ from "lodash";
import { collectAdd, collectDelete, getCollectList } from "@/api/userInfo";
import { toFixed } from "@/utils/public";

function Search() {
  const { t } = useTranslation();
  const [symbol, setSymbol] = useState("");
  const [tradeType, setTradeType] = useState("");

  const [deliveryList, setDeliveryList] = useState([]);
  const [spotList, setSpotList] = useState([]);
  const [swapList, setSwapList] = useState([]);
  const [search, setsearch] = useSearchParams();
  const tradeTypeTemp = search.get("tradeType") || "";
  const nav = useNavigate();

  const onInput = (val: string) => {
    setSymbol(val);
  };
  const onSearchPair = async () => {
    const { data } = await searchPair({
      symbol: symbol,
      tradeType: tradeType,
    });
    setDeliveryList(data.deliveryList);
    setSpotList(data.spotList);
    setSwapList(data.swapList);
  };
  const debouncedSearch = _.debounce(onSearchPair, 500);
  const onAdd = async (item: any) => {
    const { data, code } = await collectAdd({
      symbol: item.symbol,
      tradeType: item.tradeType,
    });
    if (code === 0) {
      onSearchPair();
    }
  };
  const onDel = async (item: any) => {
    const { data, code } = await collectDelete({
      symbol: item.symbol,
      tradeType: item.tradeType,
    });
    if (code === 0) {
      onSearchPair();
    }
  };
  useEffect(() => {
    onSearchPair();
  }, [symbol]);
  useEffect(() => {
    setTradeType(tradeTypeTemp);
  }, []);
  return (
    <div className={style.root}>
      <div className="search-wrap">
        <div className="input-bg">
          <img src={searchPng} />
          <input
            className="text"
            value={symbol}
            onChange={(e) => {
              onInput(e.target.value);
            }}
            placeholder={t("quota.search") || ""}
          ></input>
          <div
            className="cancel"
            onClick={() => {
              nav(-1);
            }}
          >
            {t("common.cancel")}
          </div>
        </div>

        <div className="coinList">
          {(tradeType == "" || tradeType == "spot") && (
            <div>
              {spotList.length > 0 && (
                <div className="coins-title">{t("tabs.spot")}</div>
              )}
              <div className="coins">
                {spotList.map((item: any, cIdx) => {
                  return (
                    <div
                      className="coin-item"
                      key={cIdx}
                      onClick={() => {
                        nav(`/stock?symbol=${item.symbol}`);
                      }}
                    >
                      <div className="coin-left">
                        <img src={item.logo} className="coin-logo" />
                        <div className="coin-symbol">
                          {item.symbol.replace("USDT", "")}/USDT
                        </div>
                      </div>
                      <div className="coin-right">
                        <div className="coin-price_part">
                          <div className="coin-price">{item.price}</div>
                          <div
                            className={`coin-rate ${
                              item.riseFallRate > 0 ? "up" : "down"
                            }`}
                          >
                            {toFixed(item.riseFallRate * 100, 2)}%
                          </div>
                        </div>

                        <img
                          className="coin-collect"
                          onClick={(e) => {
                            if (item.collectStatus) {
                              onDel({ ...item, tradeType: "spot" });
                            } else {
                              onAdd({ ...item, tradeType: "spot" });
                            }
                            e.stopPropagation();
                          }}
                          src={item.collectStatus ? collect : noCollect}

                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {(tradeType == "" || tradeType == "swap") && (
            <div>
              {swapList.length > 0 && (
                <div className="coins-title">{t("tabs.swap")}</div>
              )}
              <div className="coins">
                {swapList.map((item: any, cIdx) => {
                  return (
                    <div className="coin-item" key={cIdx}
                    onClick={() => {
                      nav(`/contract?symbol=${item.symbol}&tradeType=swap`);
                    }}
                    >
                      <div className="coin-left">
                        <img src={item.logo} className="coin-logo" />
                        <div className="coin-symbol">
                          {item.symbol.replace("USDT", "")}/USDT
                        </div>
                      </div>
                      <div className="coin-right">
                        <div className="coin-price_part">
                          <div className="coin-price">{item.price}</div>
                          <div
                            className={`coin-rate ${
                              item.riseFallRate > 0 ? "up" : "down"
                            }`}
                          >
                            {toFixed(item.riseFallRate * 100, 2)}%
                          </div>
                        </div>

                        <img
                          className="coin-collect"
                          onClick={(e) => {
                            if (item.collectStatus) {
                              onDel({ ...item, tradeType: "swap" });
                            } else {
                              onAdd({ ...item, tradeType: "swap" });
                            }
                            e.stopPropagation();

                          }}

                          src={item.collectStatus ? collect : noCollect}

                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {(tradeType == "" || tradeType == "delivery") && (
            <div>
              {deliveryList.length > 0 && (
                <div className="coins-title">{t("tabs.delivery")}</div>
              )}
              <div className="coins">
                {deliveryList.map((item: any, cIdx) => {
                  return (
                    <div className="coin-item" key={cIdx + 1}
                    onClick={() => {
                      nav(`/contract?symbol=${item.symbol}&tradeType=delivery`);
                    }}>
                      <div className="coin-left">
                        <img src={item.logo} className="coin-logo" />
                        <div className="coin-symbol">
                          {item.symbol.replace("USDT", "")}/USDT
                        </div>
                      </div>
                      <div className="coin-right">
                        <div className="coin-price_part">
                          <div className="coin-price">{item.price}</div>
                          <div
                            className={`coin-rate ${
                              item.riseFallRate > 0 ? "up" : "down"
                            }`}
                          >
                            {toFixed(item.riseFallRate * 100, 2)}%
                          </div>
                        </div>

                        <img
                          className="coin-collect"
                          onClick={(e) => {
                            if (item.collectStatus) {
                              onDel({ ...item, tradeType: "delivery" });
                            } else {
                              onAdd({ ...item, tradeType: "delivery" });
                            }
                            e.stopPropagation();

                          }}
                          src={item.collectStatus ? collect : noCollect}

                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
