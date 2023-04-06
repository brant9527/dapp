import { useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import style from "./index.module.scss";
import { getArticleList } from "@/api/common";
import { formatTime } from "@/utils/public";

const Article = (props: any) => {
  const { handleSelect } = props;
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  useEffect(() => {
    getDate();
  }, []);
  const getDate = async () => {
    const { data } = await getArticleList();
    setList(data);
  };
  return (
    <div className={style.root}>
      <div className="article">
        {list.map((item: any, idx: any) => {
          return (
            <div className="article-item" key={idx}>
              <div className="title">{item.title}</div>
              <div className="time">{formatTime(new Date(item.publishTime).getTime())}</div>

              <div className="content">{item.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default memo(Article);
