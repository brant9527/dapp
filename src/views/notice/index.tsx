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
import NoticeItem from "./Components/NoticeItem";
import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";
import { getNoticeList } from "@/api/common";

function Message() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const [hasMore, setHashMore] = useState(true);

  const [assetsList, setAssetsList] = useState<any>([]);

  const page = {
    pageNo: 1,
    pageSize: 20,
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await getNoticeList();

    setAssetsList(data);
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
    window.localStorage.setItem("content", item.content);
    nav(
      `/noticeDetail?id=${item.id}&publishTime=${item.publishTime}&title=${item.title}&content=${item.content}`
    );
  };
  return (
    <div className={style.root}>
      <div className="notice-wrap">
        <Back></Back>

        <div className="notice-content">
          <Scroll
            onLoadMore={() => onLoadMore()}
            hasMore={hasMore}
            onRefresh={() => onRefresh()}
          >
            <div className="assets-list">
              {assetsList.map((item: any, idx: any) => {
                return (
                  <NoticeItem
                    item={item}
                    key={idx}
                    onDetail={() => onDetail(item)}
                  ></NoticeItem>
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
