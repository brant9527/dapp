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

import Entrust from "@/components/Entrust";
import { readMessage } from "@/api/home";
import { formatTime } from "@/utils/public";

function MessageDetail() {
  const { t } = useTranslation();
  const [search, setsearch] = useSearchParams();
  const id = search.get("id");
  const createTime = search.get("createTime") || "";
  console.log(createTime,new Date(createTime))
  const content = window.localStorage.getItem("content") || "";
  const title = search.get("title");
  const getData = async () => {
    const { data } = await readMessage({
      id: id,
    });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className={style.root}>
      <div className="message-wrap">
        <Back></Back>

        <div className="message-content">
          <div className="title">{title}</div>
          <div className="createTime">
            {formatTime(new Date(createTime).getTime())}
          </div>
          <div
            className="title"
            dangerouslySetInnerHTML={{ __html: decodeURI(content) }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default MessageDetail;
