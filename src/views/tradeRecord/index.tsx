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

const page = {
  pageNo: 1,
  pageSize: 20,
};
function TransRecord() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [search, setsearch] = useSearchParams();
  const tradeType = search.get("tradeType") || "spot";
  const [hasMore, setHashMore] = useState(true);
  const [type, setType] = useState("1");
  const [entrustList, setEntrustList] = useState<any>([]);
  const [isEnd, setIsEnd] = useState(false);

  const onChange = useCallback((val: string) => {
    setType(val);
    setHashMore(true);
    setEntrustList([]);
    page.pageNo = 1;
  }, []);

  const navList = [
    {
      title: t("tabs.entrust"),
      type: "1",
    },
    {
      title: t("tabs.entrust-his"),
      type: "2",
    },
    {
      title: t("tabs.trade-his"),
      type: "dealRecord",
    },
  ];

  useEffect(() => {
    getData();
  }, [type]);
  const onCancel = useCallback(async (params: any) => {
    console.log("取消參數", params);

    let ids = [];
    if (params.type === "all") {
      ids = entrustList.map((item: any) => item.id);
    } else {
      ids = [params.id];
    }
    const { code, msg } = await onTradeCancel({ ids });
    if (code !== 0) {
      return Toast.notice(msg, {});
    }
    getData();
  }, []);
  const getData = async () => {
    let isEnd;
    if (type != "dealRecord") {
      const { data } = await getDelegationPage({
        ...page,
        status: type,
        tradeType,
      });
      console.log(data);
      isEnd = data.currPage === data.totalPage;
      data.list && setEntrustList(entrustList.concat(data.list));
    } else {
      const { data } = await getDealRecordPage({
        ...page,
        status: 2,
        tradeType,
      });
      console.log(data);
      data.list && setEntrustList(entrustList.concat(data.list));
      isEnd = data.currPage === data.totalPage;
    }
    if (isEnd) {
      setHashMore(false);
      Toast.notice(t("common.noMore"), { duration: 3000 });
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
    return <div className="trade-title">{t("common.stock")}</div>;
  }
  function EntrustLeft() {
    return (
      <div className="part-condition">
        <div className="condition-type">{t("common.type")}</div>
      </div>
    );
  }
  return (
    <div className={style.root}>
      <div className="trade-wrap">
        <Back content={title()}></Back>
        <div className="trade-nav_border">
          <CommonTab onChange={onChange} list={navList} />
        </div>
        <div className="trade-content">
          <Scroll
            onLoadMore={() => onLoadMore()}
            hasMore={hasMore}
            onRefresh={() => onRefresh()}
          >
            {type === "1" ? (
              <Entrust
                list={entrustList}
                tradeType={tradeType}
                onCancel={onCancel}
              ></Entrust>
            ) : type === "2" ? (
              <div className="assets-list">
                {/* {assetsList.map((item, idx) => {
                  return <RecordItem item={item} key={idx}></RecordItem>;
                })} */}
                {
                  <EntrustHis
                    list={entrustList}
                    tradeType={tradeType}
                  ></EntrustHis>
                }
              </div>
            ) : (
              <TransactionHis
                list={entrustList}
                tradeType={tradeType}
              ></TransactionHis>
            )}
          </Scroll>
        </div>
      </div>
    </div>
  );
}

export default TransRecord;
