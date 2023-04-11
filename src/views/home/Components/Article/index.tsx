import { useState, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";

import style from "./index.module.scss";
import { getArticleList } from "@/api/common";
import { formatTime } from "@/utils/public";
import good from "@/assets/good.png";
import bad from "@/assets/bad.png";
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
        <div className="acticle-title">{t("common.acticle-title")}</div>
        {list.map((item: any, idx: any) => {
          return (
            <div className="article-item" key={idx}>
              <div className="title">{item.title}</div>
              <div className="time">
                {formatTime(new Date(item.publishTime).getTime())}
              </div>

              <div
                className="content"
                style={{color:'red!important'}}
                dangerouslySetInnerHTML={{ __html: decodeURI(item.content) }}
              ></div>
              <div className="emotion">
                <div className="emotion-item">
                  <span>
                    {t("common.good")}({item.goodCnt})
                  </span>
                  <img src={good} />
                </div>
                <div className="emotion-item">
                  <span>
                    {t("common.bad")}({item.badCnt})
                  </span>
                  <img src={bad} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default memo(Article);
