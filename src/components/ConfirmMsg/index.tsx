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
  const [msgInfo, setMsgInfo] = useState<any>({});

  useEffect(() => {
    if (account) {
      Io.accountBind(
        { account, language: window.localStorage.getItem("i18nextLng") },
        (data: any) => {
          console.log(data);
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

  return (
    <div className={style.root}>

      <Confirm ref={confirmRef} onConfirm={onConfirm}>
        <div
          dangerouslySetInnerHTML={{ __html: decodeURI(msgInfo?.content) }}
        ></div>
      </Confirm>
    </div>
  );
});

export default memo(ConfirmMsg);
