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
import { submitMaterial } from "@/api/lend";

function identity() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [houseUrl, setHouseUrl] = useState<string>();
  const [certUrl, setCerUrl] = useState<string>();
  const [earnUrl, setEarnUrl] = useState<string>();
  const [bankUrl, setBankUrl] = useState<string>();

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    // account,tradeType   json格式
    //   tradeType包含：delivery-交割，swap-永续，spot-现货
  };
  const onSubmit = async () => {
    const params = {
      bankUrl,
      certUrl,
      earnUrl,
      houseUrl,
    };

    const { data, code, msg } = await submitMaterial(params);
    if (code == 0) {
      Toast.notice(t("common.upload-tip"), {});
      nav(-1);
    } else {
      // Toast.notice(msg, {});
    }
  };

  const onUploadHouse = async (val: any) => {
    setHouseUrl(val);
  };
  const onUploadEarn = async (val: any) => {
    setEarnUrl(val);
  };
  const onUploadBank = async (val: any) => {
    setBankUrl(val);
  };
  const onUploadCert = async (val: any) => {
    setCerUrl(val);
  };
  function title() {
    return <div className="identity-title">{t("lend.lend")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="identity-wrap">
        <Back content={title()}></Back>
        <div className="identity-content">
          <div className="identity-label">{t("lend.proof-house")}</div>

          <div className="upload-part">
            <Upload src={houseUrl} onUpload={onUploadHouse}></Upload>
          </div>

          <div className="identity-label">{t("lend.proof-income")}</div>

          <div className="upload-part">
            <Upload src={earnUrl} onUpload={onUploadEarn}></Upload>
          </div>
          <div className="identity-label">{t("lend.bank-detail")}</div>

          <div className="upload-part">
            <Upload src={bankUrl} onUpload={onUploadBank}></Upload>
          </div>
          <div className="identity-label">{t("lend.documents")}</div>

          <div className="upload-part">
            <Upload src={certUrl} onUpload={onUploadCert}></Upload>
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
