import {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
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
import { fixPrice, formatTime } from "@/utils/public";
import dash from "@/assets/dash.png";
import zhizhen from "@/assets/zhizhen.png";
import dollor from "@/assets/dollor.png";
import { getUserPositionById } from "@/api/contract";

const CountDialog = forwardRef((props, ref) => {
  const { onConfirm }: any = props;
  const [showDialog, setShowDialog] = useState(false);
  const [info, setInfo] = useState<any>({});
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState<any>("");
  const [pnl, setPnl] = useState<any>({});
  const [id, setId] = useState<any>("");

  const handleConfirm = () => {
    onConfirm && onConfirm();
    clearInterval(timer);
    setShowDialog(false);
  };
  useEffect(() => {
    return () => {
      timer && clearInterval(timer);
    };
  }, [timer]);
  const startCount = useCallback(
    (count: number, id: any) => {
      let timeTemp: number = count;
      const timerTemp = setInterval(() => {
        setTime(--timeTemp);

        if (!timeTemp || timeTemp <= 0) {
          clearInterval(timerTemp);
          getData(id);

          // return setShowDialog(false);
        }
      }, 1000);
      setTimer(timerTemp);
    },
    [info, id]
  );
  const getData = async (id: any) => {
    const { data } = await getUserPositionById({ id });
    setPnl(data);
  };
  useImperativeHandle(ref, () => {
    return {
      open: (data: any) => {
        setInfo(data);
        setTime(data.period);
        setId(() => data.id);
        setTimeout(() => {
          startCount(data.period, data.id);
        }, 0);
        setShowDialog(true);
      },
      close: () => setShowDialog(false),
    };
  });
  const { t } = useTranslation();
  const helpDetail = JSON.parse(
    window.localStorage.getItem("helpDetail") || "{}"
  );

  return (
    <div className={style.root}>
      {showDialog && (
        <div className="time-count">
          <div className="mask"></div>
          <div className="time-dialog">
            <div className="count-wrap">
              <img className="dash" src={dash} />
              <img className="zhizhen" src={zhizhen} />
              <img className="dollor" src={dollor} />
            </div>
            <div className="symbol">
              {info?.symbol?.replace("USDT", "")}/USDT
            </div>
            <div className="info">
              <div className="left">{t("common.price")}</div>
              <div className="right">{fixPrice(info.price || "")}</div>
            </div>
            <div className="info">
              <div className="left">{t("common.direction")}</div>
              <div className="right">{info.direction}</div>
            </div>
            <div className="info">
              <div className="left">{t("common.count")}</div>
              <div className="right">{fixPrice(info.count)}USDT</div>
            </div>

            <div className="info">
              <div className="left">{t("contract.delivery-time")}</div>
              <div className="right">{time} s</div>
            </div>
            {pnl.finalPnl && (
              <div className="info">
                <div className="left">{t("trade.PNL")}</div>
                <div className="right">{fixPrice(pnl.finalPnl)}USDT</div>
              </div>
            )}
            <div
              className={`btn ${time <= 0 ? "btn-active" : ""}`}
              onClick={() => {
                handleConfirm();
              }}
            >
              {t("common.close")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default memo(CountDialog);
