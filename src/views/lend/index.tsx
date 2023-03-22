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

function lend() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [realName, setRealName] = useState<string>("");
  const [idNumber, setIdnumber] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  const [imgSrcFront, setImgSrcFront] = useState<string>();
  const [imgSrcBack, setImgSrcBack] = useState<string>();

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
    return <div className="identity-title">{t("auth.id-auth")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="identity-wrap">
        <Back content={title()}></Back>
        <div className="identity-content">
          <div className="identity-label">{t("auth.name")}</div>
          <CusInput
            alignLeft
            isBtn={false}
            defaultVal={realName}
            onInput={onInputName}
          ></CusInput>
          <div className="identity-label">{t("auth.id")}</div>
          <CusInput
            alignLeft
            isBtn={false}
            defaultVal={idNumber}
            onInput={onInputIdNumber}
          ></CusInput>

          <div className="upload-part">
            <Upload src={imgSrcFront} onUpload={onUploadFront}></Upload>
            <Upload src={imgSrcBack} onUpload={onUploadBack}></Upload>
          </div>
          <div className="identity-label">{t("auth.country")}</div>
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
