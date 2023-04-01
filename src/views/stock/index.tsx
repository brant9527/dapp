import { useCallback, useEffect, useRef, useState, useMemo } from "react";

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

import NavBar from "@/components/NavBar";
import PriceBar from "@/components/PriceBar";
import BuySell from "@/components/BuySell";
import TradeSelect from "@/components/TradeSelect";
import CusInput from "@/components/CusInput";
import SlideBar from "@/components/SlideBar";
import HoldAssetsTab from "@/components/Tabs";
import AssetsCoin from "@/components/AssetsCoin";

import Entrust from "@/components/Entrust";
import Toast from "@/components/Toast";

import {
  getDelegationPage,
  onTradeCancel,
  onTradeBuySell,
  getAvailBalance,
} from "@/api/trade";
import {
  accAdd,
  accSub,
  accMul,
  accDiv,
  toFixed,
  formatTime,
  fixPrice,
} from "@/utils/public";
import record from "@/assets/record.png";
import Io from "@/utils/socket";
import { getTradeAssetBalance } from "@/api/trans";

function Stock() {
  const { t } = useTranslation();
  const configList = [
    {
      label: t("common.trade.market"),
      type: "market",
    },
    {
      label: t("common.trade.limit"),
      type: "limit",
    },
  ];
  const list = [
    {
      title: t("tabs.entrust"),
      type: "entrust",
    },
    {
      title: t("tabs.assets"),
      type: "assets",
    },
  ];
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTCUSDT";
  const tradeMode = search.get("tradeMode") || "buy";
  const [type, setType] = useState(tradeMode);
  const [coin, setCoin] = useState(symbol.replace("USDT", ""));
  const [tradeType, setTradeType] = useState(configList[0].type);
  const [balanceAssets, setBalanceAssets] = useState<any>({});

  const [coinPrice, setCoinPrice] = useState("");
  const [coinAccount, setCoinAccount] = useState<any>("");

  const [percent, setPercent] = useState<any>();
  const [useUsdt, setUseUsdt] = useState<any>("");
  const [entrustList, setEntrustList] = useState<any>([]);
  const [assetsList, setAssetsList] = useState<any>([]);
  const [depthInfo, setDepthInfo] = useState<any>({});
  const [headInfo, setHeadInfo] = useState<any>();
  const [tabVal, setTabVal] = useState<any>(list[0].type);
  const [calcType, setCalcType] = useState(1);
  const nav = useNavigate();

  const onChangeType = useCallback((type: string) => {
    setType(type);
    setPercent(-1);
    setCoinPrice("");
    setCoinAccount("")
  }, []);
  const onSelectTradeType = (type: string) => {
    setTradeType(type);
    setPercent(-1);
    setCoinPrice("");
    console.log("設置交易類型", type);
  };
  const subData = useCallback(async () => {
    Io.subscribeSymbolDepth(symbol, (data: any) => {
      console.log(data);
      // data.ask?.reverse()
      setDepthInfo(data);
    });
  }, []);
  useEffect(() => {
    subData();
    console.log("订阅数据");
    return () => Io.cfwsUnsubscribe("depth." + symbol);
  }, [subData]);
  useEffect(() => {
    getData();
    getBalance();
    getDataHead();
    getAssetBalance();
    const timer: any = setTimeout(() => {
      getBalance();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const getDataHead = async () => {
    Io.subscribeSymbolInfo(symbol, (data: any) => {
      console.log(data[0]);
      setHeadInfo(data[0]);
    });
  };
  // 获取当前委托
  const getData = async () => {
    const { data } = await getDelegationPage({
      pageNo: 1,
      pageSize: 100,
      status: 1,
      tradeType: "spot",
    });
    console.log(data);
    setEntrustList(data.list);
  };
  // 获取当前交易对余额
  const getBalance = useCallback(async () => {
    const { data } = await getAvailBalance({
      accountType: "spot",
      asset: symbol.replace("USDT", ""),
    });

    setBalanceAssets(data);
  }, []);
  const getAssetBalance = useCallback(async () => {
    const { data } = await getTradeAssetBalance();
    setAssetsList(data.detailList);
  }, []);

  const onInputPrice = useCallback((val: any) => {
    setPercent(-1);
    setCoinPrice(val);
  }, []);
  const onInputAccount = useCallback(
    (val: any) => {
      console.log("数量val", val);
      setPercent(-1);
      if (calcType == 2) {
        setCalcType(1);
      }
      if (val === "") {
        setUseUsdt("");
        setCoinAccount("");
        return;
      }
      const usdtVal = accMul(coinPrice || headInfo?.close, val);

      setUseUsdt(usdtVal);
      setCoinAccount(val);
    },
    [coinPrice, headInfo, calcType]
  );

  const onSlideChange = useCallback(
    (val: any) => {
      setPercent(val);

      if (val > 0) {
        if (type === "buy") {
          if (calcType == 1) {
            setCalcType(2);
          }

          const tempUsdt = toFixed(
            accMul(val, balanceAssets?.availableUsdtBalance),
            2
          );
          console.log("设置全部约", tempUsdt);
          setUseUsdt(tempUsdt);
          setCoinAccount(
            toFixed(accDiv(tempUsdt, coinPrice || headInfo?.close), 2)
          );
        } else {
          if (calcType == 2) {
            setCalcType(1);
          }

          const tempAssetsBalance = toFixed(
            accMul(val, balanceAssets?.availableAssetBalance),
            2
          );
          console.log("设置可用数量", tempAssetsBalance);
          setCoinAccount(tempAssetsBalance);
          setUseUsdt(
            toFixed(accMul(tempAssetsBalance, coinPrice || headInfo?.close), 2)
          );
        }
      } else {
        setUseUsdt("");
        setCoinAccount("");
      }
    },
    [balanceAssets, coinPrice, headInfo, calcType]
  );
  // 输入要使用的usdt
  const onInputUsdt = useCallback(
    (val: any) => {
      setPercent(-1);
      if (calcType == 1) {
        setCalcType(2);
      }
      if (val === "") {
        setUseUsdt("");
        setCoinAccount("");
        return;
      }
      const accountTemp = toFixed(accDiv(val, coinPrice || headInfo?.close), 2);

      setCoinAccount(accountTemp);

      setUseUsdt(val);
    },
    [coinPrice, headInfo, calcType]
  );

  const onChangeTab = (val: any) => {
    console.log(val);
    setTabVal(val);
  };

  const onCancel = useCallback(async (params: any) => {
    console.log("取消參數", params);

    let ids = [];
    if (params.type === "all") {
      ids = entrustList.map((item: any) => item.id);
    } else {
      ids = [params.id];
    }
    const { code } = await onTradeCancel({ ids });
    if (code == 0) {
      Toast.notice(t("common.success"), { duration: 2000 });
      getData();
      getBalance();
      setPercent(-1);
      setCoinAccount("");
      setCoinPrice("");
    }
  }, []);
  const navHandle = (path: string) => {
    if (path === "/kLine") {
      nav(`/kLine?symbol=${symbol}&tradeType=spot`);
    } else {
      nav("/search?tradeType=spot");
    }
  };

  const takeOrder = async () => {
    const { code } = await onTradeBuySell({
      algoPrice: tradeType === "limit" ? coinPrice : "",
      algoTime: new Date().getTime(),
      algoType: tradeType,
      amount: calcType == 2 ? useUsdt : coinAccount,
      calcType,
      side: type,
      symbol,
      tradeType: "spot",
    });
    if (code == 0) {
      getData();
      getBalance();
      Toast.notice(t("common.success"), { duration: 2000 });
    }
  };
  return (
    <div className={style.root}>
      <div className="stock-wrap">
        <NavBar
          navHandle={navHandle}
          percent={toFixed(headInfo?.rate, 2)}
          coin={coin}
        ></NavBar>
        <div className="option-wrap">
          <div className="option-top">
            <div className="left">
              <div className="title">
                <div className="price">
                  <div>{t("common.price")}</div>
                  <div>(USDT)</div>
                </div>
                <div className="account">
                  <div>{t("common.count")}</div>
                  <div>({coin})</div>
                </div>
              </div>
              <div className="price-sell">
                <PriceBar
                  direction="right"
                  type="sell"
                  data={depthInfo?.asks}
                ></PriceBar>
              </div>
              <div className="price-part">
                <div className="price-top up">{fixPrice(headInfo?.close)}</div>
                <div className="price-usdt">
                  {"≈$" + fixPrice(headInfo?.close)}
                </div>
              </div>
              <div className="price-buy">
                <PriceBar
                  direction="right"
                  type="buy"
                  data={depthInfo.bids}
                ></PriceBar>
              </div>
            </div>
            <div className="right">
              <div className="btns">
                <BuySell type={type} onChangeType={onChangeType}></BuySell>
              </div>

              <div className="trade-type-part">
                <TradeSelect
                  onSelect={onSelectTradeType}
                  configList={configList}
                ></TradeSelect>
              </div>
              <div className="input-price">
                {/* 市场价格 */}
                <CusInput
                  placeholder={
                    tradeType === "market"
                      ? headInfo?.close
                      : t("common.input-price")
                  }
                  onInput={onInputPrice}
                  defaultVal={coinPrice}
                  isBtn={tradeType !== "market"}
                  disable={tradeType === "market"}
                ></CusInput>
              </div>
              <div className="input-account">
                <CusInput
                  placeholder={`${t("common.count")}(${coin})`}
                  onInput={onInputAccount}
                  defaultVal={coinAccount}
                ></CusInput>
              </div>
              <div className="slide-part">
                <SlideBar onSlide={onSlideChange} value={percent} type={type} />
              </div>
              <div className="input-usdt">
                <CusInput
                  onInput={onInputUsdt}
                  defaultVal={useUsdt}
                  isBtn={false}
                ></CusInput>
              </div>
              <div className="useable-usdt">
                <div className="label-left">{t("common.use")}</div>
                <div className="balance-usdt">
                  {type === "buy"
                    ? fixPrice(balanceAssets?.availableUsdtBalance || 0)
                    : fixPrice(balanceAssets?.availableAssetBalance || 0)}{" "}
                  {type === "buy" ? "USDT" : symbol.replace("USDT", "")}
                </div>
              </div>
              <div
                className={"btn-option btn-option__" + type}
                onClick={() => {
                  takeOrder();
                }}
              >
                {type === "buy" ? t("common.buy") : t("common.sell")}
              </div>
            </div>
          </div>
          <div className="option-bottom">
            <div className="hold-tabs">
              <HoldAssetsTab tabs={list} onChange={onChangeTab} />
            </div>
            <img
              src={record}
              className="record"
              onClick={() => {
                nav("/tradeRecord?tradeType=" + tradeType);
              }}
            />
          </div>
          <div className="record-list">
            {tabVal === "entrust" ? (
              <Entrust
                list={entrustList}
                tradeType={tradeType}
                onCancel={onCancel}
              ></Entrust>
            ) : (
              <AssetsCoin list={assetsList}></AssetsCoin>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stock;
