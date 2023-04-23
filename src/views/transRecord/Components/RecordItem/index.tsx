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
import { formatTime, toFixed } from "@/utils/public";

function RecordItem(props: any) {
  const { item } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  const status = (status: any) => {
    let str = "(";

    switch (status) {
      case "spot":
        str += t("assets.assets-stock");
        break;
      case "funds":
        str += t("assets.assets-funds");
        break;

      case "trade":
        str += t("assets.assets-contract");
        break;

      default:
        str = "";
        break;
    }
    str && (str += ")");
    return str;
  };
  return (
    <div className={style.root}>
      <div className="record-item">
        <div className="record-item_left">
          <div className="item-top">
            {`${item.asset}`} <span className="account-type">{status(item.accountType)}</span>
          </div>
          <div className="item-b">
            {formatTime(new Date(item.updateTime).getTime())}
          </div>
        </div>
        <div className="record-item_right">
          <div className="item-top">{toFixed(item.amount, 6)}</div>
          <div className="item-b">
            <span
              className={["dot", !item.status ? "dot_s" : "dot_f"].join(" ")}
            ></span>
            {!item.status ? t("common.success") : t("common.faild")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordItem;
