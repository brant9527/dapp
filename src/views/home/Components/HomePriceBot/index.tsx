import { useState, memo } from "react";
import { useTranslation } from "react-i18next";

import style from "./index.module.scss";

const HomePriceBot = (props: any) => {
  const { handleSelect } = props;
  const { t } = useTranslation();
  const [idx, setIdex] = useState(0);
  //     2.热门：getHotList 无参数
  //     3.新币：getNewSymbolList   无参数
  //     4.涨幅榜：getRiseSymbolList  无参数
  //     5.跌幅榜：getFallSymbolList   无参数
  const Tabs = [
    {
      title: t("home.coins.hot"),
      type: "getHotList",
    },
    {
      title: t("tabs.optional"),
      type: "optional",
    },

    {
      title: t("home.coins.raise"),
      type: "getRiseSymbolList",
    },
    {
      title: t("home.coins.down"),
      type: "getFallSymbolList",
    },
    {
      title: t("home.coins.new"),
      type: "getNew",
    },
  ];
  return (
    <div className={style.root}>
      <div className="priceBot">
        {Tabs.map((item, i) => {
          return (
            <div
              className={["item   ", idx == i ? "active" : ""].join(" ")}
              key={i}
              onClick={() => {
                setIdex(i);
                handleSelect(item.type);
              }}
            >
              {item.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default memo(HomePriceBot);
