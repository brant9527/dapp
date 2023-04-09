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
import MsgItem from "./Components/MsgItem";
import Scroll from "@/components/Scroll";
import Toast from "@/components/Toast";

import eth from "@/assets/eth.png";

import Entrust from "@/components/Entrust";

import { getMessagePage } from "@/api/home";

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
    const { data } = await getMessagePage(page);

    setAssetsList(data.list);
    const isEnd = data.currPage >= data.totalPage;

    if (isEnd) {
      setHashMore(false);
      Toast.notice(t("common.noMore"), {  });
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
  const onDetail = (item: any) => {
    nav(
      `/messageDetail?id=${item.id}&createTime=${item.createTime}&title=${item.title}&content=${item.content}`
    );
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
              {assetsList.map((item: any, idx: any) => {
                return (
                  <MsgItem
                    item={item}
                    key={idx}
                    onDetail={() => onDetail(item)}
                  ></MsgItem>
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
