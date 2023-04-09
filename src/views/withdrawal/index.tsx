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
import CusInput from "@/components/CusInput";

import Back from "@/components/Back";
import Upload from "@/components/Upload/index";
import Toast from "@/components/Toast";

import { getFundsAssetBalance } from "@/api/trans";
import { toFixed } from "@/utils/public";
import recordPng from "@/assets/record.png";
import { withdraw } from "@/api/common";

function identity() {
  const { t } = useTranslation();
  const ref = useRef<any>(null);
  const [search, setsearch] = useSearchParams();
  const accountTypeTemp = search.get("accountType") || "funds";
  const nav = useNavigate();
  const account = window.localStorage.getItem("account") || "";
  const [coinUseCount, setCoinUseCount] = useState<any>(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState<any>(0);
  const [fee, setFee] = useState<string>("");
  const [accountType, setAccountType] = useState<string>(accountTypeTemp);


  const [receiveAddress, setAdd] = useState<string>(account);
  const [asset, setAsset] = useState<string>("USDT");

  useEffect(() => {
    getData();
    ref?.current.setVal(receiveAddress);
  }, []);

  const onSubmit = async () => {
    const params = {
      asset,
      count:coinUseCount,
      receiveAddress,
      fee,
      accountType,
    };

    const data: any = await withdraw(params);
    if (data.code == 0) {
      Toast.notice(t("common.success"), {});
      nav("/drawalAndRecharge",{replace: true});
    }
  };

  const onInputName = async (val: any) => {
    console.log("输入", val);
    setAdd(val);
  };
  const onInputIdAmount = async (val: any) => {
    console.log("输入", val);
    setWithdrawalAmount(val);
  };
  const onInputFee = async (val: any) => {
    console.log("输入", val);
    setFee(val);
  };

  function title() {
    return <div className="withdrawal-title">{t("withdrawal.withdrawal")}</div>;
  }
  function right() {
    return (
      <img
        className="record"
        src={recordPng}
        onClick={() => {
          nav("/drawalAndRecharge");
        }}
      />
    );
  }
  function paste() {
    return (
      <div
        className="withdrawal-title"
        onClick={() => {
          const input = ref?.current;
          input.focus();
          document.execCommand("paste");
        }}
      >
        {t("common.paste")}
      </div>
    );
  }
  const getData = async () => {
    const method = getFundsAssetBalance;

    const { data } = await method();
    setCoinUseCount(data.availableUsdtBalance || 0);
  };
  function inputRight() {
    return <div className="withdrawal-usdt">USDT</div>;
  }

  return (
    <div className={style.root}>
      <div className="withdrawal-wrap">
        <Back content={title()} right={right()}></Back>
        <div className="withdrawal-content">
          <div className="withdrawal-label">{t("withdrawal.address")}</div>
          <CusInput
            ref={ref}
            alignLeft
            isBtn={false}
            defaultVal={receiveAddress}
            placeholder={t("withdrawal.receive-address")}
            onInput={onInputName}
          ></CusInput>
          <div className="withdrawal-label">{t("trans.count")}</div>
          <CusInput
            alignLeft
            isBtn={false}
            placeholder={t("withdrawal.min-amount", { amount: 0.1 })}
            onInput={onInputIdAmount}
          ></CusInput>
          <div className="content-label">
            <div className="left">
              {t("withdrawal.rest")}:{coinUseCount}
            </div>
          </div>
          <div className="withdrawal-label">{t("withdrawal.fee")}</div>
          <CusInput
            defaultVal={fee}
            alignLeft
            isBtn={false}
            onInput={onInputFee}
            append={inputRight()}
          ></CusInput>

          <div className="content-label">
            <div className="left"> {t("withdrawal.receive-amount")}</div>
            <div className="right">
              {toFixed(Number(withdrawalAmount) - Number(fee), 2)} USDT
            </div>
          </div>
          <div
            className="btn-next"
            onClick={() => {
              onSubmit();
            }}
          >
            {t("common.sure")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default identity;
