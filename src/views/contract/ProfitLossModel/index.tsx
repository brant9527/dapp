import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  useMemo,
} from "react";

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

import Back from "@/components/Back";

import Toast from "@/components/Toast";

import Entrust from "@/components/Entrust";
import { readMessage } from "@/api/home";
import { formatTime, toFixed } from "@/utils/public";

import Model from "@/components/Model";
import SlideNum from "@/components/SlideNum";
import { closeOrder, setStopProfitOrLoss } from "@/api/contract";
import CusInput from "@/components/CusInput";

const ProfitLossModel = forwardRef(({ onConfirm }: any, ref) => {
  const [info, setInfo] = useState<any>({});
  const [lever, setLever] = useState(100);
  const [stopPfPrice, setStopPfPrice] = useState("");
  const [stopLsPrice, setStopLsPrice] = useState("");
  const closeRef = useRef<any>(null);

  useImperativeHandle(ref, () => {
    return {
      open: (data: any) => {
        setInfo(data.item);

        closeRef.current.open();
        setLever(100);
      },
      close: () => closeRef.current.close(),
    };
  });
  const { t } = useTranslation();
  const amount = useMemo(() => {
    console.log(info.availPosition, lever);
    return toFixed((info.availPosition * lever) / 100,5);
  }, [lever, info]);
  const onChangeSlideNum = useCallback((val: any) => {
    console.log(val);
    setLever(val);
  }, []);
  const onCloseOrder = useCallback(async () => {
    console.log("info=>>>>", info);
    const params = {
      algoTime: new Date().getTime(),
      algoType: "limit",
      count: amount,
      id: info.id,
      side: info.side,
      stopLsPrice: stopLsPrice,
      stopPfPrice: stopPfPrice,
      symbol: info.symbol,
      tradeType: info.tradeType,
    };
    const { code, data } = await setStopProfitOrLoss(params);
    if (code == 0) {
      onConfirm && onConfirm();
      closeRef.current.close();
      Toast.notice(t("common.success"), {});
    }
  }, [info, amount, stopLsPrice, stopPfPrice]);
  const onInputProfit = (val: any) => {
    setStopPfPrice(val);
  };
  const onInputLoss = (val: any) => {
    setStopLsPrice(val);
  };
  return (
    <Model ref={closeRef} title={t("contract.profit-loss")}>
      <div className={style.root}>
        <div className="profitLoss-wrap">
          <div className="info">
            <div className="info-left">{t("contract.contract")}</div>
            <div className={"info-right " + (info.side === "long" ? "s" : "f")}>
              <div className={`symbol`}>{`${info.symbol}`}</div>
              <div className="orderType">
                {info.tradeType === "swap"
                  ? t("contract.swap")
                  : t("contract.delivery")}
              </div>

              <div className="position">
                {info.side === "long" ? t("contract.buy") : t("contract.sell")}
              </div>
              <div className="lever">{info.lever}x</div>
            </div>
          </div>
          <div className="info">
            <div className="info-left"> {t("contract.long-price")}(USDT)</div>
            <div className={"info-right "}>{toFixed(info.avgCostPrice, 4)}</div>
          </div>
          <div className="info">
            <div className="info-left">{t("contract.mark-price")}(USDT)</div>
            <div className={"info-right "}>{toFixed(info.currPrice, 4)}</div>
          </div>
          <div className="input-part">
            <div className="ipt-left">
              <CusInput
                placeholder={t("contract.profit")}
                onInput={onInputProfit}
              ></CusInput>
            </div>
            <div className="ipt-right">
              <CusInput
                placeholder={t("contract.loss")}
                onInput={onInputLoss}
              ></CusInput>
            </div>
          </div>
          <div className="profitLoss-lever">
            {t("common.count")}：{amount}
          </div>

          <SlideNum onChange={onChangeSlideNum} defaultVal={lever}></SlideNum>
          <div
            className="profitLoss-btn"
            onClick={() => {
              onCloseOrder();
            }}
          >
            {t("common.sure")}
          </div>
        </div>
      </div>
    </Model>
  );
});

export default memo(ProfitLossModel);
