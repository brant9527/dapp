import { useState } from "react";
import { useTranslation } from "react-i18next";

import style from "./index.module.scss";

const HomePriceMid = (props: any) => {
  const { handleSelect } = props;
  const { t } = useTranslation();
  const [idx, setIdex] = useState(0);
  const Tabs = [
    {
      title: t("home.coins.hot"),
      type: "hot",
    },
    {
      title: t("home.coins.raise"),
      type: "raise",
    },
    {
      title: t("home.coins.down"),
      type: "down",
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
export default HomePriceMid;
