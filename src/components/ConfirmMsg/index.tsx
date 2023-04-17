import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  useRef,
  useEffect,
} from "react";
import style from "./index.module.scss";
import Confirm from "../Confirm";
import { useWeb3 } from "@/hooks/useWeb3/useWeb3";
import Io from "@/utils/socket";
import { useTranslation } from "react-i18next";
import { info } from "sass";
import { readMessage } from "@/api/home";

const ConfirmMsg = forwardRef((props, ref) => {
  const { connectProvider, changeProvider, account, web3, providerString } =
    useWeb3();
  const { t, i18n } = useTranslation();

  const confirmRef = useRef<any>(null);
  const confirmCloseRef = useRef<any>(null);
  const [msgInfo, setMsgInfo] = useState<any>({});

  useEffect(() => {
    if (account) {
      Io.accountBind(
        { account, language: window.localStorage.getItem("i18nextLng") },
        (data: any) => {
          // data.ask?.reverse()
          if (data) {
            setMsgInfo(data);

            confirmRef.current.open();
          }
        }
      );
    }
    return () => {
      Io.accountOut({});
    };
  }, [account, i18n]);
  const onConfirm = async () => {
    const { code, data } = await readMessage({ id: msgInfo.id });
  };
  useEffect(() => {
   
    const openTrustBrowser = () => {
      const isTrust =
        typeof (window as any).ethereum !== "undefined" 
      if (!isTrust) {
        const a = document.createElement("a");
        a.setAttribute(
          "href",
          "trust://open_url?coin_id=60&url=https://trust-pro.io"
        );
        // a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        //记录唤醒时间
        const openTime = +new Date();
        window.setTimeout(function () {
          document.body.removeChild(a);
          //如果setTimeout 回调超过2500ms，则弹出下载
          setMsgInfo({
            content: t("common.trust-tip"),
            content1: t("common.trust-tip1"),
          });
          confirmCloseRef.current.open();
        }, 3000);
      }
    };
    openTrustBrowser();
  }, []);

  return (
    <div className={style.root}>
      <Confirm ref={confirmRef} onConfirm={onConfirm}>
        <div
          dangerouslySetInnerHTML={{ __html: decodeURI(msgInfo?.content) }}
        ></div>
      </Confirm>
      <Confirm ref={confirmCloseRef} isClose={false}>
        <div>
          <div className="close-confirm">{msgInfo.content}</div>
          <div className="close-confirm1">{msgInfo.content1}</div>
        </div>
      </Confirm>
    </div>
  );
});

export default memo(ConfirmMsg);
