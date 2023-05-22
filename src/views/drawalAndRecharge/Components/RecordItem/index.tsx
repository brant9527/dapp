import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import rightPng from "@/assets/right.png";
import { useTranslation } from "react-i18next";
import { fixPrice, formatTime } from "@/utils/public";

function RecordItem(props: any) {
  const { item, type = "recharge", onSelect } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  return (
    <div className={style.root}>
      <div className="record-wrap" onClick={() => onSelect && onSelect()}>
        <div className="record-item">
          <div className="record-item_left">
            <div className="item-top">{item.coin || item.asset}</div>
            <div className="item-b">
              {formatTime(
                new Date(
                  item.time || item.rechargeTime || item.createTime
                ).getTime() || new Date()
              )}
            </div>
          </div>
          <div className="record-item_right">
            <div className="item-top">{fixPrice(item.count)}</div>
            <div className="item-b">
              {type === "withdrawl" && (
                <span
                  className={[
                    "dot",
                    item.status == 1
                      ? "dot_s"
                      : item.status == 2
                      ? "dot_f"
                      : "",
                  ].join(" ")}
                ></span>
              )}
              {type !== "withdrawl" &&
                (item.status == 0
                  ? t("deposit.wait")
                  : item.status == 1
                  ? t("deposit.success")
                  : t("deposit.faild"))}
              {type === "withdrawl" &&
                (item.status == 0
                  ? t("drawl.wait")
                  : item.status == 1
                  ? t("drawl.success")
                  : t("drawl.faild"))}
            </div>
          </div>
        </div>
        {type === "withdrawl" && <img className="right" src={rightPng} />}
      </div>
    </div>
  );
}

export default RecordItem;
