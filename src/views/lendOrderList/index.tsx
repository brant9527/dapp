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

import Back from "@/components/Back";
import LendItem from "./Components/LendItem";
import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";

import { getProgressList } from "@/api/lend";

function Message() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [hasMore, setHashMore] = useState(true);

  const [orderList, setOrderList] = useState<any>([]);

  const page = {
    pageNo: 1,
    pageSize: 20,
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await getProgressList();

    setOrderList(data.voList);
    // const isEnd = data.currPage === data.totalPage;

    // if (isEnd) {
    //   setHashMore(false);
    //   Toast.notice(t("common.noMore"), {  });
    // }
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
  const onDetail = (item: any) => {
    nav(
      `/noticeDetail?id=${item.id}&publishTime=${item.publishTime}&title=${item.title}&content=${item.content}`
    );
  };
  return (
    <div className={style.root}>
      <div className="order-wrap">
        <Back></Back>

        <div className="order-content">
          <Scroll
            onLoadMore={() => onLoadMore()}
            hasMore={hasMore}
            onRefresh={() => onRefresh()}
          >
            <div className="assets-list">
              {orderList.map((item: any, idx: any) => {
                return (
                  <LendItem
                    item={item}
                    key={idx}

                  ></LendItem>
                );
              })}
            </div>
          </Scroll>
        </div>
      </div>
    </div>
  );
}

export default Message;
