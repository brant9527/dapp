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

function LendItem(props: any) {
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
        return t("status.pass.getMoney");
      case 2:
        return t("status.refused.refused");
      case 3:
        return t("status.outTime.outTime");
      case 4:
        return t("status.apply.repayment");
      case 9:
        return t("status.clear");

      default:
        return t("status.wait");
    }
  };
  return (
    <div className={style.root}>
      <div className="order-wrap">
        <div className="order-item">
          <div className="left">{t("lend.lend-amount")}</div>
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
          <div className="left">{t("lend.interest")}</div>
          <div className="right rate">{item.totalInterest + " "} %</div>
        </div>
        <div className="order-item">
          <div className="left">{t("common.status")}</div>
          <div className="right">
            {(item.status == 1 || item.status == 3 || item.status == 4) && (
              <>
                <span className="status">{status(item)}</span>
                <span className="btn">{t("btn.repayment")}</span>
              </>
            )}
            {item.status == 0 && <span className="status">{status(item)}</span>}

            {item.status == 2 && <span className="status">{status(item)}</span>}

            {item.status == 9 && <span className="status">{status(item)}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LendItem;
