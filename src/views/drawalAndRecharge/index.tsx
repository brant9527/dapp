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
import RecordItem from "./Components/RecordItem";
import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";

import eth from "@/assets/eth.png";

import {
  getDelegationPage,
  onTradeCancel,
  getDealRecordPage,
} from "@/api/trade";
import Entrust from "@/components/Entrust";
import EntrustHis from "@/components/EntrustHis";
import TransactionHis from "@/components/TransactionHis";
import { getRechargeRecordPage, getWithdrawRecordPage } from "@/api/trans";
import Tabs from "@/components/Tabs";

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

  const onChange = useCallback((val: string) => {
    setType(val);
    setHashMore(true);
    setRecordList([]);
    page.pageNo = 1;
  }, []);

  const navList = [
    {
      title: t("assets.deposit"),
      type: "1",
    },
    {
      title: t("assets.transfer"),
      type: "2",
    },
  ];

  useEffect(() => {
    getData();
  }, [type]);

  const getData = async () => {
    let isEnd;
    if (type == "1") {
      const { data } = await getRechargeRecordPage({
        ...page,
      });

      isEnd = data.currPage >= data.totalPage;
      data.list && setRecordList(recordList.concat(data.list));
    } else {
      const { data } = await getWithdrawRecordPage({
        ...page,
      });
      console.log(data);
      data.list && setRecordList(recordList.concat(data.list));
      isEnd = data.currPage >= data.totalPage;
    }
    if (isEnd) {
      setHashMore(false);
      Toast.notice(t("common.noMore"), {});
    }
  };
  const onLoadMore = () => {
    ++page.pageNo;

    if (hasMore) {
      getData();
    }
  };
  const onRefresh = () => {
    console.log("刷新");
  };
  function title() {
    return <div className="trade-title">{t("common.record")}</div>;
  }
  
  return (
    <div className={style.root}>
      <div className="trade-wrap">
        <Back content={title()}></Back>
        <div className="trade-nav_border">
          <Tabs onChange={onChange} tabs={navList} />
        </div>
        <div className="trade-content">
          <Scroll
            onLoadMore={() => onLoadMore()}
            hasMore={hasMore}
            onRefresh={() => onRefresh()}
          >
            {type === "1" && (
              <div className="assets-list">
                {recordList.map((item: any, idx: any) => {
                  return <RecordItem item={item} key={idx}></RecordItem>;
                })}
              </div>
            )}
            {type === "2" && (
              <div className="assets-list">
                {recordList.map((item: any, idx: any) => {
                  return <RecordItem item={item} key={idx}></RecordItem>;
                })}
              </div>
            )}
          </Scroll>
        </div>
      </div>
    </div>
  );
}

export default TransRecord;
