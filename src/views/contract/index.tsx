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
import EntrustPosition from "@/components/EntrustPosition";

import Entrust from "@/components/Entrust";
import Toast from "@/components/Toast";
import CommonTab from "@/components/CommonTab";

import { getDelegationPage, onTradeCancel, getAvailBalance } from "@/api/trade";
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
import arrow from "@/assets/xiala.png";
import Io from "@/utils/socket";
import { getTradeAssetBalance } from "@/api/trans";
import { getUserInfo } from "@/api/userInfo";
import Model from "@/components/Model";
import SlideNum from "@/components/SlideNum";
import {
  openContractOrder,
  cancelContractOrder,
  oneClickCloseOrder,
  openDeliverytOrder,
  closeOrder,
  setStopProfitOrLoss,
  getDeliveryPeriodList,
  getUserPosition,
} from "@/api/contract";
import CountDialog from "./CountDialog";
import CloseDialog from "./CloseDialog";
import ProfitLossModel from "./ProfitLossModel";
import Confirm from "@/components/Confirm";

function Contract({ mock }: any) {
  // 初始化mock值,当模拟交易没阈值的时候才可以初始化
  if (!mock) {
    window.localStorage.setItem("mock", "0");
  }
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
  const marginModeList = [
    {
      label: t("contract.position.crossed"),
      type: "crossed",
    },
    // {
    //   label: t("contract.position.fixed"),
    //   type: "fixed",
    // },
  ];
  const commonList = [
    {
      title: t("tabs.contract-delivery"),
      type: "delivery",
    },
    {
      title: t("tabs.contract-swap"),
      type: "swap",
    },
  ];
  const list = [
    {
      title: t("tabs.entrust"),
      type: "entrust",
    },
    {
      title: t("tabs.postion"),
      type: "postion",
    },
  ];
  const [search, setsearch] = useSearchParams();
  const symbol = search.get("symbol") || "BTCUSDT";
  const tradeMode = search.get("tradeMode") || "buy";
  const tradeTypeTemp = search.get("tradeType") || commonList[0].type;
  const tradeTypeIndex = tradeTypeTemp === commonList[0].type ? 0 : 1;
  const [type, setType] = useState(tradeMode);
  const [coin, setCoin] = useState(symbol.replace("USDT", ""));
  const [transType, setTransType] = useState(configList[0].type);
  const [marginMode, setMarginMode] = useState(marginModeList[0].type);

  const [tradeType, setTradeType] = useState(tradeTypeTemp);

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
  // const [tradeType, setContractType] = useState("delivery");
  const [tradeSymbol, setTradeSymbol] = useState(1);
  const [stopPfPrice, setStopPfPrice] = useState<string>();
  const [stopLsPrice, setStopLsPrice] = useState<string>();
  const [stopPfOrLs, setStopPfOrLs] = useState<any>(1);
  const [periodInfo, setPeriodInfo] = useState<any>([]);
  const [selectPeriod, setSelectPeriod] = useState<any>([]);

  const [lever, setLever] = useState(100);
  const priceRef = useRef<any>(null);
  const accountRef = useRef<any>(null);
  const usdtRef = useRef<any>(null);
  const profitRef = useRef<any>(null);
  const lossRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const countRef = useRef<any>(null);
  const closeRef = useRef<any>(null);
  const profitLossRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);

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
  }, [tradeType]);
  useEffect(() => {
    getData();
    getBalance();
    getDataHead();
    onGetUserPosition();
    onGetDeliveryPeriodList();
    const timer: any = setInterval(() => {
      getBalance();
      onGetUserPosition();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getDataHead = async () => {
    Io.subscribeSymbolInfo(symbol, (data: any) => {
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
      accountType: "trade",
      asset: symbol.replace("USDT", ""),
    });

    setBalanceAssets(data);
  }, []);
  const onGetUserPosition = useCallback(async () => {
    const { data } = await getUserPosition();
    setAssetsList(data);
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
          // 修改为余额倍数最大值
          const tempUsdt = toFixed(accMul(val, maxUsdt), 2);
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
          // 修改为可用余额的币数量

          const tempAssetsBalance = toFixed(accMul(val, maxCount), 4);
          const tempUseUsdt = toFixed(
            accMul(tempAssetsBalance, coinPrice || headInfo?.close),
            2
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
  const onGetDeliveryPeriodList = async () => {
    const { code, data } = await getDeliveryPeriodList();
    if (code == 0) {
      setPeriodInfo(data);
    }
  };
  const onChangeTab = useCallback((val: any) => {
    setTabVal(val);
  }, []);
  const onChangeContractType = useCallback((val: any) => {
    setTradeType(val);
  }, []);

  const onCancel = useCallback(
    async (params: any) => {
      let ids = [];

      if (params.type === "all") {
        ids = entrustList.map((item: any) => item.id);
      } else {
        ids = [params.id];
      }
      const { code } = await cancelContractOrder({ ids });
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
    },
    [entrustList]
  );
  const navHandle = useCallback(
    (path: string) => {
      if (path === "/kLine") {
        nav(`/kLine?symbol=${symbol}&tradeType=${tradeType}`);
      } else {
        nav("/search?tradeType=" + tradeType);
      }
    },
    [tradeType]
  );
  const onInputProfit = useCallback((val: any) => {
    setStopPfPrice(val);
  }, []);
  const onInputLoss = useCallback((val: any) => {
    setStopLsPrice(val);
  }, []);
  const onSelectMarginMode = useCallback((val: any) => {
    setMarginMode(val);
  }, []);
  const onChangeSlideNum = useCallback((val: any) => {
    setLever(val);
  }, []);
  const onSelectPeroid = (item: any) => {
    setSelectPeriod(item);
  };
  const takeOrder = async () => {
    if (!useUsdt || !coinAccount || !promiseMoney) {
      return Toast.notice(t("common.params-check"), { duration: 2000 });
    }
    let params = {};
    let method: any = "";
    const fee = Number(accMul(useUsdt, userInfo?.feeRate)); // 手續費
    let amountTemp: any = 0;
    // 判斷 當前倉位usdt大于 扣除手续费剩下金额时
    if (
      Number(promiseMoney) + fee >
      Number(balanceAssets?.availableUsdtBalance)
    ) {
      console.log("total>rest");
      // 最大保证金额
      const maxPromiseMoney = accDiv(
        Number(balanceAssets?.availableUsdtBalance),
        accAdd(accMul(lever, userInfo.feeRate), 1)
      );
      //
      amountTemp = accMul(
        Number(accDiv(maxPromiseMoney, coinPrice || headInfo?.close)),
        lever
      );
    } else {
      console.log("count normol");

      amountTemp = coinAccount;
    }

    if (tradeType === "swap") {
      method = openContractOrder;
      params = {
        algoPrice: transType === "limit" ? coinPrice : "",
        algoTime: new Date().getTime(),
        algoType: transType,
        amount: toFixed(amountTemp, 4),
        calcType: 1,
        side: type === "buy" ? "long" : "short",
        symbol,
        stopLsPrice,
        stopPfOrLs,
        stopPfPrice,
        tradeType,
        lever,
        marginMode,
      };
    } else {
      params = {
        algoPrice: transType === "limit" ? coinPrice : "",
        algoTime: new Date().getTime(),

        period: selectPeriod.period,
        algoType: "market",
        amount: toFixed(amountTemp, 4),

        calcType: 1,
        side: type === "buy" ? "long" : "short",
        symbol,
        stopPfOrLs: 0,
        tradeType,
        lever,
        marginMode,
      };
      method = openDeliverytOrder;
    }

    const { code } = await method(params);
    if (code == 0) {
      getData();
      getBalance();
      setPercent(-1);
      setCoinAccount("");
      setUseUsdt("");
      usdtRef?.current.setVal("");
      accountRef?.current.setVal("");
      Toast.notice(t("common.success"), { duration: 2000 });
      if (tradeType === "delivery")
        countRef.current.open({
          direction:
            type === "buy" ? t("contract.do-more") : t("contract.do-short"),
          symbol,
          period: selectPeriod.period,
          price: headInfo.close,
          count: useUsdt,
        });
    }
  };
  /**
   *  
   * @param id algoPrice (number, optional): 委托价格，限价时传 ,
              algoType (string, optional): 委托类型，limit-限价，market-市价 ,
              count (number, optional): 平仓数量 ,
              id (integer, optional): 仓位id
   */

  const onCloseOrderModel = async (item: any) => {
    if (item.type === "all") {
      return confirmRef.current.open();
    }
    closeRef.current.open(item);
  };
  const onConfirmClose = async () => {
    const { data, code } = await oneClickCloseOrder();
    if (code === 0) {
      getBalance();
      onGetUserPosition();

      Toast.notice(t("common.success"), { duration: 2000 });
    }
  };
  const onSetProfitLossModel = async (item: any) => {
    profitLossRef.current.open(item);
  };

  const maxCount = useMemo(() => {
    return toFixed(
      accDiv(
        accMul(
          Number(lever || 0),
          Number(balanceAssets?.availableUsdtBalance || 0)
        ),
        Number(coinPrice || headInfo?.close || 0)
      ),
      4
    );
  }, [lever, balanceAssets, coinPrice, headInfo]);
  const maxUsdt = useMemo(() => {
    return toFixed(
      accMul(
        Number(lever || 0),
        Number(balanceAssets?.availableUsdtBalance || 0)
      ),
      2
    );
  }, [lever, balanceAssets]);
  const promiseMoney = useMemo(() => {
    return toFixed(accDiv(Number(useUsdt), Number(lever || 0)), 2);
  }, [lever, useUsdt]);
  return (
    <div className={style.root}>
      <div className="contract-wrap">
        <CommonTab
          onChange={onChangeContractType}
          defaultIndex={tradeTypeIndex}
          list={commonList}
        ></CommonTab>
        <NavBar
          navHandle={navHandle}
          percent={toFixed(headInfo?.rate, 2)}
          coin={coin}
          contractType={tradeType}
          mock={mock}
        ></NavBar>
        <div className={`option-wrap ${mock ? "option-wrap_mock" : ""}`}>
          <div className="option-select">
            <div className="option-left">
              <div className="position">
                <TradeSelect
                  onSelect={onSelectMarginMode}
                  configList={marginModeList}
                ></TradeSelect>
              </div>
              <div
                className="lever"
                onClick={() => {
                  modelRef.current.open();
                }}
              >
                <div className="trade-name">{lever}x</div>
                <img src={arrow} className="trade-img" />
              </div>
            </div>
            <div className="delivery-days">
              <div></div>
              <div></div>
            </div>
          </div>
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
                <BuySell
                  type={type}
                  onChangeType={onChangeType}
                  isContract={true}
                ></BuySell>
              </div>
              <div className="useable-usdt">
                <div className="label-left">{t("common.use")}</div>
                <div className="balance-usdt">
                  {fixPrice(balanceAssets?.availableUsdtBalance || 0)} USDT
                </div>
              </div>
              <div className="trade-type-part">
                <TradeSelect
                  onSelect={onSelectTradeType}
                  tradeType={tradeType}
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
              <div className="symbol-select">
                <div
                  className={`symbol-item ${tradeSymbol === 1 ? "active" : ""}`}
                  onClick={() => {
                    setTradeSymbol(1);
                  }}
                >
                  {coin}
                </div>
                <div
                  className={`symbol-item ${tradeSymbol === 2 ? "active" : ""}`}
                  onClick={() => {
                    setTradeSymbol(2);
                  }}
                >
                  USDT
                </div>
              </div>
              <div className="input-fix_wrap">
                <div
                  className={`input-account ${
                    tradeSymbol == 1 ? "fixTop" : ""
                  }`}
                >
                  <CusInput
                    ref={accountRef}
                    placeholder={`${t("common.count")}(${coin})`}
                    onInput={onInputAccount}
                    defaultVal={coinAccount}
                  ></CusInput>
                </div>

                <div
                  className={`input-account ${
                    tradeSymbol == 2 ? "fixTop" : ""
                  }`}
                >
                  <CusInput
                    ref={usdtRef}
                    onInput={onInputUsdt}
                    defaultVal={useUsdt}
                    isBtn={false}
                  ></CusInput>
                </div>
              </div>
              <div className="slide-part">
                <SlideBar onSlide={onSlideChange} value={percent} type={type} />
              </div>
              {tradeType === "swap" ? (
                <div className="profit-loss">
                  <div
                    className="top"
                    onClick={() => {
                      if (stopPfOrLs) {
                        setStopPfPrice("");
                        profitRef.current.setVal("");
                        setStopLsPrice("");
                        lossRef.current.setVal("");
                      }
                      setStopPfOrLs(stopPfOrLs == 1 ? 0 : 1);
                    }}
                  >
                    <span
                      className={"dot" + (stopPfOrLs ? " active" : "")}
                    ></span>
                    <span>{t("contract.profit-loss")}</span>
                  </div>
                  <div className="bottom">
                    <div className="profit-loss_input">
                      <CusInput
                        ref={profitRef}
                        onInput={onInputProfit}
                        defaultVal={stopPfPrice}
                        isBtn={false}
                        placeholder={t("contract.profit")}
                      ></CusInput>
                    </div>
                    <div className="profit-loss_input">
                      <CusInput
                        ref={lossRef}
                        onInput={onInputLoss}
                        defaultVal={stopLsPrice}
                        isBtn={false}
                        placeholder={t("contract.loss")}
                      ></CusInput>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="peroid-wrap">
                  {periodInfo.map((item: any, idx: any) => {
                    return (
                      <div
                        className={`peroid-item ${
                          selectPeriod.id === item.id ? "active" : ""
                        }`}
                        key={idx}
                        onClick={() => {
                          onSelectPeroid(item);
                        }}
                      >
                        {item.period + " s"}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="max-u">
                <div className="max-left">{t("contract.max")}</div>

                <div className="max-right">
                  {tradeSymbol == 2
                    ? toFixed(
                        accMul(
                          Number(lever || 0),
                          Number(balanceAssets?.availableUsdtBalance || 0)
                        ),
                        2
                      )
                    : toFixed(
                        accDiv(
                          accMul(
                            Number(lever || 0),
                            Number(balanceAssets?.availableUsdtBalance || 0)
                          ),
                          Number(coinPrice || headInfo?.close || 0)
                        ),
                        2
                      )}{" "}
                  {tradeSymbol == 2 ? "USDT" : coin}
                </div>
              </div>
              <div className="max-u">
                <div className="max-left">{t("contract.promise-money")}</div>

                <div className="max-right">{promiseMoney} USDT</div>
              </div>
              <div
                className={"btn-option btn-option__" + type}
                onClick={() => {
                  takeOrder();
                }}
              >
                {type === "buy"
                  ? t("contract.golong")
                  : t("contract.short-selling")}
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
              <EntrustPosition
                list={assetsList}
                onClose={onCloseOrderModel}
                onSetProfitLoss={onSetProfitLossModel}
              ></EntrustPosition>
            )}
          </div>
        </div>
      </div>
      <Model ref={modelRef} title={t("contract.adjust-lever")}>
        <div className="slidenum-wrap">
          <div className="slidenum-lever">{lever}x</div>

          <SlideNum onChange={onChangeSlideNum} defaultVal={lever}></SlideNum>
          <div
            className="slidenum-btn"
            onClick={() => {
              modelRef.current.close();
            }}
          >
            {t("common.sure")}
          </div>
        </div>
      </Model>
      {/* <Model ref={closeRef} title={t("contract.close")}>
        <div className="slidenum-wrap">
          <div className="slidenum-lever">
            {t("common.count")}
            {lever}
          </div>

          <SlideNum onChange={onChangeSlideNum} defaultVal={lever}></SlideNum>
          <div
            className="slidenum-btn"
            onClick={() => {
              closeRef.current.close();
            }}
          >
            {t("common.sure")}
          </div>
        </div>
      </Model> */}
      <CloseDialog ref={closeRef} onConfirm={onGetUserPosition}></CloseDialog>
      <ProfitLossModel
        ref={profitLossRef}
        onConfirm={onGetUserPosition}
      ></ProfitLossModel>
      <CountDialog ref={countRef}></CountDialog>
      <Confirm onConfirm={onConfirmClose} cancel={true} ref={confirmRef}>
        <div className="confirm-tip">{t("contract.close-tip")}</div>
      </Confirm>
    </div>
  );
}

export default Contract;
