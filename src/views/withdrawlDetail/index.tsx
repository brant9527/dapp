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

import Back from "@/components/Back";

import Toast from "@/components/Toast";

import good from "@/assets/good.png";

import { formatTime } from "@/utils/public";
import DrawlItem from "./drawlItem";
import { getWithdrawRecordDetail } from "@/api/trans";
import { getUserInfo } from "@/api/userInfo";

function DrawlDetail() {
  const { t } = useTranslation();

  const [search, setsearch] = useSearchParams();
  const id = search.get("id");
  const [info, setInfo] = useState<any>({});
  const [userInfo, setUserInfo] = useState<any>({});
  const content = window.localStorage.getItem("content") || "";
  console.log("content=>", content);
  const publishTime = search.get("publishTime") || "";
  const title = search.get("title");
  const getData = async () => {
    const { data, code } = await getWithdrawRecordDetail({
      id: id,
    });
    if (code === 0) {
      setInfo(data);
    }
  };
  useEffect(() => {
    getData();
    onGetUserInfo();
  }, []);
  const onGetUserInfo = async () => {
    const { data, code } = await getUserInfo();
    if (code === 0) {
      setUserInfo(data);
    }
  };
  return (
    <div className={style.root}>
      <div className="withdrawl-detail-wrap">
        <Back></Back>
        <div className="withdrawl-content">
          <DrawlItem item={info}></DrawlItem>

          <div className="withdrawl-step">
            <div className="label">{t("withdrawal.step")}</div>
            <div className="steps-wrap">
              {info?.scheduleList?.map((item: any, idx: any) => {
                return (
                  <>
                    <div
                      className={`step ${
                        item.step <= info.step ? "active" : ""
                      }`}
                      key={idx}
                    >
                      {item.step}. {item.schedule}
                    </div>
                    {idx + 1 != item.totalStep && (
                      <img className="arrow" src={good} />
                    )}
                  </>
                );
              })}
            </div>
          </div>
          <div className="customer-wrap">
            {!!userInfo.customerStatus && (
              <a
                href={`tg://resolve?domain=${userInfo.customerTelegram}&start=${userInfo.customerTelegramId}`}
              >
                <div className="customer">{t("common.customer")}</div>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawlDetail;
