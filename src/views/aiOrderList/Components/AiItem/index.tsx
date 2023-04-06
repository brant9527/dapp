import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import usdtPng from "@/assets/usdt.svg";

import { useTranslation } from "react-i18next";
import { formatTime } from "@/utils/public";

function AiItem(props: any) {
  const { item } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  /**
   * 0-待审核，1-已放款(进行中)，2-驳回，3-逾期，4-申请还款(不计息)，9-已结清
   */
  const status = (item: any) => {
    switch (item.status) {
      case 0:
        return t("ai.over");
      case 1:
        return t("ai.doing");

      default:
        return t("ai.over");
    }
  };
  return (
    <div className={style.root}>
      <div className="order-wrap">
        <div className="order-item">
          <div className="left">{t("ai.apply-amount")}</div>
          <div className="right">{item.amount + " USDT"}</div>
        </div>
        <div className="order-item">
          <div className="left">{t("lend.period")}</div>
          <div className="right">{item.period}</div>
        </div>
        <div className="order-item">
          <div className="left">{t("common.start-time")}</div>
          <div className="right">
            {formatTime(new Date(item.beginTime).getTime())}
          </div>
        </div>
        <div className="order-item">
          <div className="left">{t("common.end-time")}</div>
          <div className="right">
            {formatTime(new Date(item.endTime).getTime())}
          </div>
        </div>
        <div className="order-item">
          <div className="left">{t("ai.total-income")}</div>
          <div className="right rate">{item.totalIncome + " "} </div>
        </div>
        <div className="order-item">
          <div className="left">{t("common.status")}</div>
          <div className="right">
            {<span className="status">{status(item)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiItem;
