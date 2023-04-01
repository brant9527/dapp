import React, { useRef, useState, memo } from "react";
import style from "./index.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  onLoadMore: () => void; // 加载更多的回调函数
  onRefresh: () => void; // 刷新的回调函数
  hasMore: boolean; // 是否还有更多数据可以加载
  children: any;
}

const LoadMore: React.FC<Props> = ({
  onLoadMore,
  onRefresh,
  hasMore,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { t } = useTranslation();
  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (scrollTop + clientHeight >= scrollHeight-20) {
      onLoadMore();
    }

    // if (scrollTop + clientHeight < scrollHeight + 50) {
    //   handleRefresh();
    // }
  };
  // const onTouchStart = (e: any) => {
  //   console.log(e);
  // };

  const handleRefresh = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000); // 模拟异步请求，一秒后结束刷新状态
    }
  };

  return (
    <div ref={containerRef} className={style.root} onScroll={handleScroll}>
      {children}
      {hasMore ? (
        <div className="load-tip">{t("common.loading")}</div>
      ) : (
        <div className="load-tip">{t("common.noMore")}</div>
      )}
    </div>
  );
};

export default memo(LoadMore);
