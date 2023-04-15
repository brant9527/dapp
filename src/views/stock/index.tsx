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
import { getUserInfo } from "@/api/userInfo";

function Stock() {
  const { t } = useTranslation();
  // 初始化mock值
  window.localStorage.setItem("mock", "0");
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
  const [transType, setTransType] = useState(configList[0].type);
  const [tradeType, setTradeType] = useState("spot");

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
  const [userInfo, setUserInfo] = useState<any>({});
  const priceRef = useRef<any>(null);
  const accountRef = useRef<any>(null);
  const usdtRef = useRef<any>(null);

  const nav = useNavigate();

  const onChangeType = useCallback((type: string) => {
    setType(type);
    setPercent(-1);
    setUseUsdt("");
    setCoinAccount("");

    usdtRef?.current.setVal("");
    accountRef?.current.setVal("");
  }, []);
  const onSelectTradeType = useCallback((type: string) => {
    setTransType(type);
    setPercent(-1);
    setCoinPrice("");
    console.log("設置交易類型", type);
  }, []);
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
    const timer: any = setInterval(() => {
      getBalance();
      getAssetBalance();
    }, 2000);
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
      tradeType,
    });
    console.log(data);
    setEntrustList(data.list);
  };
  const onGetUserInfo = useCallback(async () => {
    const { data: user, code } = await getUserInfo();
    if (code === 0) {
      setUserInfo(user);
    }
  }, []);
  useEffect(() => {
    onGetUserInfo();
  }, [onGetUserInfo]);
  // 获取当前交易对余额
  const getBalance = useCallback(async () => {
    const { data } = await getAvailBalance({
      accountType: tradeType,
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
    priceRef.current.setVal(val);
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
      usdtRef?.current.setVal(usdtVal);
    },
    [coinPrice, headInfo, calcType]
  );

  const onSlideChange = useCallback(
    (val: any) => {
      console.log(val);
      setPercent(val);

      if (val > 0) {
        if (type === "buy") {
          if (calcType == 1) {
            setCalcType(2);
          }

          const tempUsdt = toFixed(
            accMul(val, balanceAssets?.availableUsdtBalance),
            4
          );
          const tempAccount = toFixed(
            accDiv(tempUsdt, coinPrice || headInfo?.close),
            4
          );
          console.log("设置全部约", tempUsdt, tempAccount);

          setUseUsdt(tempUsdt);
          setCoinAccount(tempAccount);
          usdtRef?.current.setVal(tempUsdt);
          accountRef?.current.setVal(tempAccount);
        } else {
          if (calcType == 2) {
            setCalcType(1);
          }

          const tempAssetsBalance = toFixed(
            accMul(val, balanceAssets?.availableAssetBalance),
            4
          );
          const tempUseUsdt = toFixed(
            accMul(tempAssetsBalance, coinPrice || headInfo?.close),
            4
          );
          console.log("设置可用数量", tempAssetsBalance);
          setCoinAccount(tempAssetsBalance);
          setUseUsdt(tempUseUsdt);
          usdtRef?.current.setVal(tempUseUsdt);
          accountRef?.current.setVal(tempAssetsBalance);
        }
      } else {
        setUseUsdt("");
        setCoinAccount("");
      }
    },
    [balanceAssets, coinPrice, headInfo, calcType, type]
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
      const accountTemp = toFixed(accDiv(val, coinPrice || headInfo?.close), 4);

      setCoinAccount(accountTemp);

      setUseUsdt(val);

      accountRef?.current.setVal(accountTemp);
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
      setUseUsdt("");
      usdtRef?.current.setVal("");
      accountRef?.current.setVal("");
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
    if (!useUsdt || !coinAccount) {
      return Toast.notice(t("common.params-check"), { duration: 2000 });
    }

    const fee = Number(accMul(useUsdt, userInfo?.feeRate)); // 手續費
    let amountTemp: any = 0;
    // 判斷 當前倉位usdt大于 扣除手续费剩下金额时
    if (
      Number(accAdd(useUsdt, fee)) > Number(balanceAssets?.availableUsdtBalance)
    ) {
      console.log("total>rest");

      amountTemp =
        calcType == 2
          ? accMul(
              Number(balanceAssets?.availableUsdtBalance),
              1 - userInfo.feeRate
            )
          : accMul(
              Number(balanceAssets?.availableAssetBalance),
              1 - userInfo.feeRate
            );
    } else {
      console.log("count normol");
      amountTemp = calcType == 2 ? useUsdt : coinAccount;
    }
    const { code } = await onTradeBuySell({
      algoPrice: transType === "limit" ? coinPrice : "",
      algoTime: new Date().getTime(),
      algoType: transType,
      amount: amountTemp,
      calcType,
      side: type,
      symbol,
      tradeType,
    });
    if (code == 0) {
      getData();
      getBalance();
      setPercent(-1);
      setCoinAccount("");
      setUseUsdt("");
      usdtRef?.current.setVal("");
      accountRef?.current.setVal("");
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
                  ref={priceRef}
                  placeholder={
                    transType === "market"
                      ? headInfo?.close
                      : t("common.input-price")
                  }
                  onInput={onInputPrice}
                  defaultVal={coinPrice}
                  isBtn={transType !== "market"}
                  disable={transType === "market"}
                ></CusInput>
              </div>
              <div className="input-account">
                <CusInput
                  ref={accountRef}
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
                  ref={usdtRef}
                  onInput={onInputUsdt}
                  defaultVal={useUsdt}
                  isBtn={false}
                ></CusInput>
              </div>
              <div className="useable-usdt">
                <div className="label-left">{t("common.use")}</div>
                <div className="balance-usdt">
                  {type === "buy"
                    ? fixPrice(balanceAssets?.availableUsdtBalance || 0, 4)
                    : fixPrice(
                        balanceAssets?.availableAssetBalance || 0,
                        4
                      )}{" "}
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
