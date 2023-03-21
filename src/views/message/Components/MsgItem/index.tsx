import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import msg from "@/assets/msg.png";

import { useTranslation } from "react-i18next";

function MsgItem(props: any) {
  const { item } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  return (
    <div className={style.root}>
      <div className="msg-wrap">
        <div className="msg-item">
          <div className="left">
            <img src={msg} />
          </div>
          <div className="right">
            <div className="title">{item.title}</div>
            <div className="content">{item.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MsgItem;
