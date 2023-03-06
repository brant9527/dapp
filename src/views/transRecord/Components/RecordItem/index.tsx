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

function RecordItem(props: any) {
  const { item } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  return (
    <div className={style.root}>
      <div className="record-item">
        <div className="record-item_left">
          <div className="item-top">{item.coin}</div>
          <div className="item-b">{item.time}</div>
        </div>
        <div className="record-item_right">
          <div className="item-top">{item.count}</div>
          <div className="item-b">
            <span
              className={["dot", item.state == 1 ? "dot_s" : "dot_f"].join(" ")}
            ></span>
            {item.state == 1 ? t("common.success") : t("common.faild")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordItem;
