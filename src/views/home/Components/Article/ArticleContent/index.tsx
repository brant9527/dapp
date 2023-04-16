import { useState, memo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import style from "./index.module.scss";
import { getArticleList } from "@/api/common";
import { formatTime } from "@/utils/public";
import good from "@/assets/good.png";
import bad from "@/assets/bad.png";
const Article = (props: any) => {
  const { content = "<div></div>" } = props;
  const { t } = useTranslation();
  const [height, setHeight] = useState(150);
  const contentRef = useRef<any>(null);
  const [showMore, setShowMore] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  useEffect(() => {
    if (contentRef.current.offsetHeight >= 100) {
      console.log(contentRef.current.offsetHeight);
      setShowBtn(true);
    }
  }, []);

  return (
    <div className={style.root}>
      <div
        ref={contentRef}
        
        className={`article-content ${showMore ? "extend" : ""}`}
        dangerouslySetInnerHTML={{ __html: decodeURI(content) }}
      ></div>
      {showBtn && (
        <div
          className="btn-article-more"
          onClick={() => {
            toggleShowMore();
          }}
        >
          {(showMore ? t("common.fold") : t("common.more")) + " >"}
        </div>
      )}
    </div>
  );
};
export default memo(Article);
