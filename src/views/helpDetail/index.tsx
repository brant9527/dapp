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
import { getHelpById } from "@/api/common";

function MessageDetail() {
  const { t } = useTranslation();

  const [helpDetail, setInfo] = useState<any>({});
  const [search, setsearch] = useSearchParams();
  const id = search.get("id") || "";
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const { data, code } = await getHelpById({ id });
    if (code == 0) {
      setInfo(data);
    }
  };
  return (
    <div className={style.root}>
      <div className="notice-wrap">
        <Back></Back>

        <div className="notice-content">
          <div className="title">{helpDetail.title}</div>
          <div className="createTime">
            {formatTime(new Date(helpDetail.publishTime).getTime())}
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: decodeURI(helpDetail?.content || ""),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default MessageDetail;
