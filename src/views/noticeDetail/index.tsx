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

import CommonTab from "@/components/CommonTab";
import Back from "@/components/Back";

import Toast from "@/components/Toast";

import Entrust from "@/components/Entrust";
import { readMessage } from "@/api/home";
import { formatTime } from "@/utils/public";

function MessageDetail() {
  const { t } = useTranslation();
  const [search, setsearch] = useSearchParams();
  const id = search.get("id");
  const content = search.get("content");
  const publishTime = search.get("publishTime") || "";
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
      <div className="notice-wrap">
        <Back></Back>

        <div className="notice-content">
          <div className="title">{title}</div>
          <div className="createTime">{formatTime(new Date(publishTime).getTime())}</div>
          <div className="title">{content}</div>
        </div>
      </div>
    </div>
  );
}

export default MessageDetail;
