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

import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";

import Tabs from "@/components/Tabs";
import rightPng from "@/assets/right.png";
import { getHelpList } from "@/api/home";

function TransRecord() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const id = search.get("id") || "";
  const [hasMore, setHashMore] = useState(true);
  const [type, setType] = useState("1");
  const [recordList, setRecordList] = useState<any>([]);

  useEffect(() => {
    getData();
  }, [type]);

  const getData = async () => {
    let isEnd;

    const { data } = await getHelpList({ typeId: id });
    setRecordList(data);
  };

  function title() {
    return <div className="help-title">{t("common.help")}</div>;
  }

  return (
    <div className={style.root}>
      <div className="help-wrap">
        <Back content={title()}></Back>

        <div className="help-content">
          {recordList.map((item: any, idx: any) => {
            return (
              <div
                className="help-item"
                key={idx}
                onClick={() => {
                  window.localStorage.setItem(
                    "helpDetail",
                    JSON.stringify(item)
                  );
                  nav("/helpDetail");
                }}
              >
                <div> {item.title}</div>
                <div>
                  <img src={rightPng} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TransRecord;
