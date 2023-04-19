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
import { bindEmail, getJuniorCertified, getUserInfo } from "@/api/userInfo";

import Toast from "@/components/Toast";
import { getImageCode, getEmailCode } from "@/api/common";
import Confirm from "@/components/Confirm";

function BindEmail() {
  const { t } = useTranslation();

  const nav = useNavigate();

  const [search, setsearch] = useSearchParams();
  // 有值默认是只需要绑定邮箱
  const isPhone = search.get("isPhone");
  const [userInfo, setUserInfo] = useState<any>({});
  const [imgsrc, setImgsrc] = useState<any>("");
  const [code, setCode] = useState<any>("");
  const [imgCode, setImgCode] = useState<any>({});
  const phoneRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);

  useEffect(() => {
    getData();
  }, []);

  const onGetImageCode = async () => {
    console.log("請求");
    const { data, code } = await getImageCode();
    if (code == 0) {
      setImgsrc(data);
    }
  };
  const getData = async () => {
    console.log("請求");
    const { data, code } = await getUserInfo();
    if (code == 0) {
      setUserInfo(data);
      phoneRef?.current?.setVal(data.mobile);
      emailRef?.current?.setVal(data.email);
    }
  };
  const onInputMobile = async (val: any) => {
    console.log("输入", val);
    userInfo.mobile = val;
    setUserInfo(userInfo);
  };
  const onInputEmail = async (val: any) => {
    userInfo.email = val;

    setUserInfo(userInfo);
  };
  const onInputImgCode = async (val: any) => {
    setImgCode(val);
  };

  const onSubmit = async () => {
    if (isPhone) {
      const data: any = await bindEmail({
        email: userInfo.email,
        code: code,
      });
      if (data.code == 0) {
        Toast.notice(t("common.upload-tip"), {});
        nav("/");
      }
    } else {
      const data: any = await getJuniorCertified(userInfo);
      if (data.code == 0) {
        Toast.notice(t("common.upload-tip"), {});
        nav("/auth");
      }
    }
  };
  const onConfirm = async () => {
    const params = {
      captcha: imgCode,
      captchaId: imgsrc.captchaId,
      email: userInfo.email,
    };
    const { data, code } = await getEmailCode(params);
    if (code == 0) {
      Toast.notice(t("common.send-tip"), {});
    }
  };
  function title() {
    return (
      <div className="email-title">
        {isPhone ? t("common.email.bind") : t("auth.primary-auth")}
      </div>
    );
  }

  return (
    <div className={style.root}>
      <div className="email-wrap">
        <Back content={title()}></Back>
        <div className="email-content">
          {!isPhone ? (
            <>
              <div className="email-label">{t("common.mobile.number")}</div>
              <CusInput
                alignLeft
                isBtn={false}
                ref={phoneRef}
                onInput={onInputMobile}
              ></CusInput>
            </>
          ) : (
            <>
              <div className="email-label">{t("common.email.address")}</div>
              <CusInput
                alignLeft
                isBtn={false}
                ref={emailRef}
                onInput={onInputEmail}
                inputType="text"
                append={
                  <div
                    onClick={() => {
                      confirmRef?.current.open();
                      onGetImageCode();
                    }}
                    className="btn-get"
                  >
                    {t("common.get-code")}
                  </div>
                }
              ></CusInput>
              <div className="email-code">
                <CusInput
                  alignLeft
                  isBtn={false}
                  onInput={(val: any) => {
                    setCode(val);
                  }}
                  inputType="text"
                ></CusInput>
              </div>
            </>
          )}
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
      <Confirm ref={confirmRef} onConfirm={onConfirm}>
        <div className="email-code-part">
          <div className="code-input">
            <CusInput
              alignLeft
              isBtn={false}
              onInput={onInputImgCode}
              inputType="text"
            ></CusInput>
          </div>
          <img
            className="code-img"
            onClick={() => {
              onGetImageCode();
            }}
            src={imgsrc.pic}
          />
        </div>
      </Confirm>
    </div>
  );
}

export default BindEmail;
