import { useCallback, useEffect, useRef, useState, memo } from "react";

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

function DrawlItem(props: any) {
  const { item } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  /**
   * 0-待审核，1-已放款(进行中)，2-驳回，3-逾期，4-申请还款(不计息)，9-已结清
   */
  const status = (item: any) => {
    switch (item.status) {
      case 0:
        return t("status.wait");
      case 1:
        return t("status.passed");
      case 2:
        return t("status.reject");

      default:
        return t("status.reject");
    }
  };
  return (
    <div className={style.root}>
      <div className="order-wrap">
        <div className="order-item">
          <div className="left">{t("withdrawal.withdrawal-amount")}</div>
          <div className="right">{item.count + " " + item.asset}</div>
        </div>

        <div className="order-item">
          <div className="left">{t("withdrawal.apply-time")}</div>
          <div className="right">
            {formatTime(new Date(item.applyTime).getTime())}
          </div>
        </div>
        <div className="order-item">
          <div className="left">{t("withdrawal.receive-address")}</div>
          <div className="right">{item.receiveAddress}</div>
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

export default memo(DrawlItem);
