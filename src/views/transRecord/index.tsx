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

import Tabs from "@/components/Tabs";
import Back from "@/components/Back";
import RecordItem from "./Components/RecordItem";
import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";

import eth from "@/assets/eth.png";
import { getBalanceChangeRecordPage } from "@/api/common";

let page = {
  pageNo: 1,
  pageSize: 20,
};

function TransRecord() {
  // 1-充值，2-提现，3-划转，4-交易，5-贷款，6-量化 ,
  const { t } = useTranslation();

  const navList = [
    {
      title: t("assets.deposit"),
      type: "1",
    },
    {
      title: t("assets.transfer"),
      type: "2",
    },
    {
      title: t("assets.assetsTrans"),
      type: "3",
    },
    {
      title: t("assets.deal"),
      type: "4",
    },
    {
      title: t("assets.loan"),
      type: "5",
    },
    {
      title: t("assets.quantify"),
      type: "6",
    },
  ];
  const nav = useNavigate();
  const [hasMore, setHashMore] = useState(true);
  const [category, setCategory] = useState(navList[0].type);
  const [assetsList, setAssetsList] = useState([]);
  const onChange = (type: string) => {
    setAssetsList(() => []);
    setCategory(type);
    setHashMore(true);
    page = {
      pageNo: 1,
      pageSize: 20,
    };
  };
  useEffect(() => {
    getData();
  }, [category]);

  const getData = async () => {
    const { data } = await getBalanceChangeRecordPage({
      ...page,

      category,
    });
    console.log(data);
    const isEnd = data.currPage >= data.totalPage;
    data.list && setAssetsList(assetsList.concat(data.list));

    if (isEnd) {
      setHashMore(false);
      // Toast.notice(t("common.noMore"), {});
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
    return <div className="record-title">{t("record.recordChange")}</div>;
  }
  return (
    <div className={style.root}>
      <div className="record-wrap">
        <Back content={title()}></Back>
        <div className="record-nav_border">
          <Tabs onChange={onChange} tabs={navList} />
        </div>
        <div className="record-content">
          <Scroll
            onLoadMore={() => onLoadMore()}
            hasMore={hasMore}
            onRefresh={() => onRefresh()}
          >
            {
              <div className="assets-list">
                {assetsList.map((item, idx) => {
                  return <RecordItem item={item} key={idx}></RecordItem>;
                })}
              </div>
            }
          </Scroll>
        </div>
      </div>
    </div>
  );
}

export default TransRecord;
