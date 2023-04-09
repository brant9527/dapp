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
import { closeOrder, oneClickCloseOrder } from "@/api/contract";

const CloseDialog = forwardRef(({ content = "", title, children, onConfirm, cancel = false }: any, ref) => {


  const [info, setInfo] = useState<any>({});
  const [lever, setLever] = useState(100);
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
    return toFixed((info.availPosition * lever) / 100);
  }, [lever, info]);
  const onChangeSlideNum = useCallback((val: any) => {
    setLever(val);
  }, []);
  const onCloseOrder = useCallback(async () => {
    console.log("info=>>>>", info);
    const params = {
      algoType: "market",
      count: amount,
      id: info.id,
    };
    const { code, data } = await closeOrder(params);
    if (code == 0) {
      onConfirm && onConfirm();
      closeRef.current.close();
      Toast.notice(t("common.success"), {});
    }
  }, [info, amount]);

  return (
    <Model ref={closeRef} title={t("contract.position.close")}>
      <div className="closeDialog-wrap">
        <div className="closeDialog-lever">
          {t("common.count")}：{amount}
        </div>

        <SlideNum onChange={onChangeSlideNum} defaultVal={lever}></SlideNum>
        <div
          className="closeDialog-btn"
          onClick={() => {
            onCloseOrder();
          }}
        >
          {t("common.sure")}
        </div>
      </div>
    </Model>
  );
});

export default memo(CloseDialog);
