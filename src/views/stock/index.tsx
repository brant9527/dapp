import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import NavBar from "@/components/NavBar";
import PriceBar from "@/components/PriceBar";
import BuySell from "@/components/BuySell";
import TradeSelect from "@/components/TradeSelect";
import CusInput from "@/components/CusInput";
import SlideBar from "@/components/SlideBar";
import HoldAssetsTab from "@/components/CommonTab";
import Entrust from "@/components/Entrust";
import { getDelegationPage, onTradeCancel, onTradeBuySell } from "@/api/trade";

import {
  accAdd,
  accSub,
  accMul,
  accDiv,
  toFixed,
  formatTime,
} from "@/utils/public";
import record from "@/assets/record.png";
function Stock() {
  const { t } = useTranslation();
  const [type, setType] = useState("buy");
  const [coin, setCoin] = useState("BTC");
  const [tradeType, setTradeType] = useState("limit");
  const [balanceUsdt, setBalanceUsdt] = useState<any>(1000);
  const [data, setData] = useState<Array<Array<any>>>([]);
  const [coinPrice, setCoinPrice] = useState("");
  const [coinAccount, setCoinAccount] = useState<any>("");

  const [percent, setPercent] = useState<any>();
  const [useUsdt, setUseUsdt] = useState<any>("");
  const [entrustList, setEntrustList] = useState<any>([]);
  const nav = useNavigate();
  const onChangeType = (type: string) => {
    setType(type);
  };
  const onSelectTradeType = (type: string) => {
    setTradeType(type);
    console.log("設置交易類型", type);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      const datas = [
        [1.2, 2],
        [1.1, 3],
        [1.0, 10],
        [0.9, Math.random() * 10],
        [Math.random(), 1],
      ];
      setData(datas);
    }, 3000);
    return () => clearInterval(timer);
  });
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const { data } = await getDelegationPage({
      pageNo: 1,
      pageSize: 100,
      status: 1,
      tradeType: "swap",
    });
    console.log(data);
    setEntrustList(data.list);
  };
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

  const onInputPrice = (val: any) => {
    console.log("币价val", val);

    setPercent(-1);

    setCoinPrice(val);
  };
  const onInputAccount = (val: any) => {
    console.log("数量val", val);
    setPercent(-1);

    if (val === "") {
      setUseUsdt("");
      setCoinAccount("");
      return;
    }
    const usdtVal = accMul(coinPrice, val);

    setUseUsdt(usdtVal);
    setCoinAccount(val);
  };

  const onSlideChange = (val: any) => {
    setPercent(val);
    if (val > 0) {
      const tempUsdt = toFixed(accMul(val, balanceUsdt), 2);
      console.log("设置全部约", tempUsdt);
      setUseUsdt(tempUsdt);
      setCoinAccount(toFixed(accDiv(tempUsdt, coinPrice), 2));
    } else {
      setUseUsdt("");
      setCoinAccount("");
    }
  };
  const onInputUsdt = (val: any) => {
    console.log("金额val", val);

    setPercent(-1);

    if (val === "") {
      setUseUsdt("");
      setCoinAccount("");
      return;
    }
    const accountTemp = toFixed(accDiv(val, coinPrice), 2);

    setCoinAccount(accountTemp);
    console.log(accountTemp, coinAccount);

    setUseUsdt(val);
  };
  const onChangeTab = (val: any) => {
    console.log(val);
  };
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
  const onCancel = useCallback(async (params: any) => {
    console.log("取消參數", params);

    let ids = [];
    if (params.type === "all") {
      ids = entrustList.map((item: any) => item.id);
    } else {
      ids = [params.id];
    }
    await onTradeCancel({ ids });
  }, []);
  return (
    <div className={style.root}>
      <div className="stock-wrap">
        <NavBar></NavBar>
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
                <PriceBar direction="right" type="sell" data={data}></PriceBar>
              </div>
              <div className="price-part">
                <div className="price-top up">12121</div>
                <div className="price-usdt">{"≈$12121"}</div>
              </div>
              <div className="price-buy">
                <PriceBar direction="right" type="buy" data={data}></PriceBar>
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
                <CusInput
                  placeholder={t("common.input-price")}
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
                <div className="balance-usdt">{balanceUsdt} USDT</div>
              </div>
              <div className={"btn-option btn-option__" + type}>
                {type === "buy" ? t("common.buy") : t("common.sell")}
              </div>
            </div>
          </div>
          <div className="option-bottom">
            <div className="hold-tabs">
              <HoldAssetsTab list={list} onChange={onChangeTab} />
            </div>
            <img
              src={record}
              className="record"
              onClick={() => {
                nav("/tradeRecord");
              }}
            />
          </div>
          <div className="record-list">
            <Entrust
              list={entrustList}
              tradeType={tradeType}
              onCancel={onCancel}
            ></Entrust>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stock;
