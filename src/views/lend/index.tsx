import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";
import CusInput from "@/components/CusInput";

import Back from "@/components/Back";
import Upload from "@/components/Upload/index";
import Toast from "@/components/Toast";
import { getHighGradeCertified, getUserInfo } from "@/api/userInfo";
import right from "@/assets/right.png";
// import { term } from "@/utils/config";

function lend() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [realName, setRealName] = useState<string>("");
  const [idNumber, setIdnumber] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  const [imgSrcFront, setImgSrcFront] = useState<string>();
  const [imgSrcBack, setImgSrcBack] = useState<string>();
  const [selectTerm, setSelectTerm] = useState({label:""});
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    // account,tradeType   json格式
    //   tradeType包含：delivery-交割，swap-永续，spot-现货
    console.log("請求數據");
    const data: any = await getUserInfo();
    console.log(data);
    if (data) {
      // setUserInfo(data?.data);
    }
  };
  const onSubmit = async () => {
    const params = {
      realName,
      idNumber,
      region,
      backUrl: imgSrcBack,
      frontUrl: imgSrcFront,
    };

    const data: any = await getHighGradeCertified(params);
    if (data.code == 0) {
      Toast.notice(t("common.upload-tip"), { duration: 3000 });
      nav("/auth");
    }
  };

  const onInputName = async (val: any) => {
    console.log("输入", val);
    setRealName(val);
  };
  const onInputIdNumber = async (val: any) => {
    console.log("输入", val);
    setIdnumber(val);
  };
  const onInputCountry = async (val: any) => {
    console.log("输入", val);
    setRegion(val);
  };
  const onUploadFront = async (val: any) => {
    console.log("圖片url", val);
    setImgSrcFront(val);
  };
  const onUploadBack = async (val: any) => {
    console.log("圖片url", val);

    setImgSrcBack(val);
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
            defaultVal={realName}
            onInput={onInputName}
            inputType="number"
            append={<USDT></USDT>}
          ></CusInput>
          <div className="lend-label">{t("lend.lend-term")}</div>
          <div className="select-input">
            <div className="left">{selectTerm?.label}</div>
            <img src={right} />
          </div>

          <div className="upload-part">
            <Upload src={imgSrcFront} onUpload={onUploadFront}></Upload>
            <Upload src={imgSrcBack} onUpload={onUploadBack}></Upload>
          </div>
          <div className="lend-label">{t("lend.country")}</div>
          <CusInput
            defaultVal={region}
            alignLeft
            isBtn={false}
            onInput={onInputCountry}
          ></CusInput>
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
