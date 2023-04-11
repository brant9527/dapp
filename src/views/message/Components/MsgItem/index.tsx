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
import { formatTime } from "@/utils/public";

function MsgItem(props: any) {
  const { item, onDetail } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  return (
    <div className={style.root} onClick={onDetail}>
      <div className="msg-wrap">
        <div className="msg-item">
          <div className="left">
            <img src={msg} />
            {item.status === 0 && <div className="dot"></div>}
          </div>
          <div className="right">
            <div className="title">{item.title}</div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: decodeURI(item.content) }}
            ></div>
            <div className="time">
              {formatTime(new Date(item.createTime).getTime())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MsgItem;
