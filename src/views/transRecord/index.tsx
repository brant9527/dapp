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

import CommonTab from "@/components/CommonTab";
import Back from "@/components/Back";
import RecordItem from "./Components/RecordItem";
import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";

import eth from "@/assets/eth.png";

function TransRecord() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [hasMore, setHashMore] = useState(true);
  const [type, setType] = useState("all");
  const onChange = (type: string) => {
    setType(type);
  };

  const navList = [
    {
      title: t("record.recordIn"),
      type: "recordIn",
    },
    {
      title: t("record.recordOut"),
      type: "recordOut",
    },
    {
      title: t("record.recordChange"),
      type: "recordChange",
    },
  ];

  const assetsList = [
    {
      state: 1,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 122,
      time: "2020-12-23",
    },
    {
      state: 0,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 122,
      time: "2020-12-23",
    },
    {
      state: 0,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 122,
      time: "2020-12-23",
    },
    {
      state: 0,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 122,
      time: "2020-12-23",
    },
    {
      state: 0,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
    {
      state: 1,
      coin: "BTC",
      count: 122,
      time: "2020-12-23",
    },
    {
      state: 0,
      coin: "BTC",
      count: 12,
      time: "2020-12-23",
    },
  ];
  const assetsCoinList = [
    {
      logo: eth,
      asset: "BTC",
      count: 1,
      fullName: "Btccoin",
      usdtBalance: 12,
    },
  ];

  const assetsContractCoinList = [
    {
      logo: eth,

      asset: "BTC",
      availableBalance: 0,
      count: 0,
      freezeBalance: 0,
      fullName: "Btccoiin",
    },
  ];
  const onLoadMore = () => {
    console.log("加载更多", Toast);
    Toast.notice(t('common.noMore'), { duration: 3000 });
  };
  const onRefresh = () => {
    console.log("刷新");
  };
  function title() {
    return <div className="record-title">{t("record.record")}</div>;
  }
  return (
    <div className={style.root}>
      <div className="record-wrap">
        <Back content={title()}></Back>
        <div className="record-nav_border">
          <CommonTab onChange={onChange} list={navList} />
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
