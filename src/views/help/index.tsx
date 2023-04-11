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
import { getHelpType } from "@/api/home";
const page = {
  pageNo: 1,
  pageSize: 20,
};
function TransRecord() {
  const { t } = useTranslation();

  const nav = useNavigate();
  // const [search, setsearch] = useSearchParams();
  // const tradeType = search.get("tradeType") || "spot";
  const [hasMore, setHashMore] = useState(true);
  const [type, setType] = useState("1");
  const [recordList, setRecordList] = useState<any>([]);

  useEffect(() => {
    getData();
  }, [type]);

  const getData = async () => {
    let isEnd;

    const { data } = await getHelpType();
    setRecordList(data);
  };

  const onRefresh = () => {
    console.log("刷新");
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
                  nav("/helpNext?id=" + item.id);
                }}
              >
                <div> {item.type}</div>
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
