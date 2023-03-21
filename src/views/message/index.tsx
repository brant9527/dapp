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
import MsgItem from "./Components/MsgItem";
import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";

import eth from "@/assets/eth.png";
import {
  getDelegationPage,
  onTradeCancel,
  getDealRecordPage,
} from "@/api/trade";
import Entrust from "@/components/Entrust";

function Message() {
  const { t } = useTranslation();
  const typeList = [
    {
      type: "all",
      label: t("common.all"),
    },
  ];
  const nav = useNavigate();
  const [hasMore, setHashMore] = useState(true);
  const [type, setType] = useState("1");
  const [entrustList, setEntrustList] = useState<any>([]);
  const [isEnd, setIsEnd] = useState(false);
  const [filterType, setFilterType] = useState(1);
  const page = {
    pageNo: 1,
    pageSize: 20,
  };
  const assetsList = [
    {
      title: "標題",
      content: "內容",
    },
  ];
  const onChange = useCallback((val: string) => {
    setType(val);
    setHashMore(true);
    page.pageNo = 1;
  }, []);

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
    await onTradeCancel({ ids });
  }, []);
  const getData = async () => {
    let isEnd;
    if (type != "dealRecord") {
      const { data } = await getDelegationPage({
        ...page,
        status: type,
        tradeType: "swap",
      });
      console.log(data);
      isEnd = data.currPage === data.totalPage;
      data.list && setEntrustList(data.list);
    } else {
      const { data } = await getDealRecordPage({
        ...page,
        status: type,
        tradeType: "swap",
      });
      console.log(data);
      data.list && setEntrustList(data.list);
      isEnd = data.currPage === data.totalPage;
    }
    if (isEnd) {
      setHashMore(false);
      Toast.notice(t("common.noMore"), { duration: 3000 });
    }
  };
  const onLoadMore = () => {
    console.log("加载更多", Toast);
    page.pageNo++;
    if (hasMore) {
      getData();
    }
  };
  const onRefresh = () => {
    console.log("刷新");
  };

  return (
    <div className={style.root}>
      <div className="message-wrap">
        <Back></Back>

        <div className="message-content">
          <Scroll
            onLoadMore={() => onLoadMore()}
            hasMore={hasMore}
            onRefresh={() => onRefresh()}
          >
            <div className="assets-list">
              {assetsList.map((item, idx) => {
                return <MsgItem item={item} key={idx}></MsgItem>;
              })}
            </div>
          </Scroll>
        </div>
      </div>
    </div>
  );
}

export default Message;
