/**
 * 借贷申请详情
 */
import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";
import CusInput from "@/components/CusInput";

import Back from "@/components/Back";
import Upload from "@/components/Upload/index";
import Toast from "@/components/Toast";
import { applyLoan } from "@/api/lend";
import right from "@/assets/right.png";
// import { term } from "@/utils/config";

function lend() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [amount, setAmount] = useState<string>("");

  const [search, setsearch] = useSearchParams();
  const id = search.get("id");
  const period = search.get("period");
  const rate = search.get("rate");

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const num = localStorage.getItem("lend-amount") || "";
    setAmount(num);
  }, []);
  const getData = async () => {
    // account,tradeType   json格式
    //   tradeType包含：delivery-交割，swap-永续，spot-现货
    console.log("請求數據");
    // const data: any = await getUserInfo();
    // console.log(data);
    // if (data) {
    //   // setUserInfo(data?.data);
    // }
  };
  const onSubmit = async () => {
    const params = {
      amount,
      productId: id,
    };
    const { data, code } = await applyLoan(params);
    if (code == 0) {
      Toast.notice(t("common.upload-tip"), { duration: 3000 });
      localStorage.setItem("lend-amount", "");

      nav("/lendList");
    } else {
      localStorage.setItem("lend-amount", amount);
      nav("/lendAuth");
    }
  };

  const onInputAmount = async (val: any) => {
    console.log("输入", val);
    setAmount(val);
  };

  function title() {
    return <div className="lend-title">{t("lend.lend")}</div>;
  }
  function USDT() {
    return <div className="lend-USDT">USDT</div>;
  }
  /**
   *  "lend": "借貸",
    "amount":"貨幣金額",
    "lend-term":"借幣期限",
    "interest":"利息",
    "interest-day":"日利息",
    "repayment":"還款方式",
    "proof-house":"房產證明",
    "proof-income":"收入證明",
    "bank-detail":"銀行明細",
    "documents":"證件",
    "resk-level":"風險等級",
    "resk-tip":"当TVL到达80%，或BTC/USDT价格到达0，您的抵押物将被 出售用于还债",
    "protocol":"我已阅读并同意coin服务协议"
   */
  return (
    <div className={style.root}>
      <div className="lend-wrap">
        <Back content={title()}></Back>
        <div className="lend-content">
          <div className="lend-label">{t("lend.amount")}</div>
          <CusInput
            alignLeft
            isBtn={false}
            defaultVal={amount}
            onInput={onInputAmount}
            inputType="digit"
            append={<USDT></USDT>}
          ></CusInput>
          <div className="lend-label">{t("lend.lend-term")}</div>
          <div className="select-input">
            <div className="left">{period + " " + t("symbol.day")}</div>
            <img src={right} />
          </div>

          <div className="lend-label">{t("lend.interest")}</div>
          <div className="lend-interest_info">
            <div className="info-item">
              <div className="left">{t("lend.interest-day")}</div>
              <div className="right">{rate}%</div>
            </div>
            <div className="info-item">
              <div className="left">{t("lend.interest")}</div>
              <div className="right">{Number(rate) * Number(period)}%</div>
            </div>
            <div className="info-item">
              <div className="left">{t("lend.repayment")}</div>
              <div className="right">{t("lend.repayment-type")}</div>
            </div>
          </div>
          <div className="lend-label">{t("lend.risk-level")}</div>
          <div className="lend-risk_tip">{t("lend.risk-tip")}</div>
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

export default lend;
