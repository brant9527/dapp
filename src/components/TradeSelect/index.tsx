import React, {
  Component,
  useCallback,
  useState,
  Fragment,
  useEffect,
} from "react";

import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import arrow from "@/assets/xiala.png";

import { useTranslation } from "react-i18next";
function TradeSelect(props: any) {
  const { onSelect, configList = [], tradeType }: any = props;
  const [type, setType] = useState();
  const [stateFlag, setStateFlag] = useState(false);
  const [current, setCurrent] = useState(configList[0]);
  const { t } = useTranslation();
  const nav = useNavigate();
  useEffect(() => {
    setCurrent(configList[0]);
  }, [tradeType]);
  const selectType = (item: any) => {
    console.log("selectType", item);
    setCurrent(item);
    setStateFlag(false);
    onSelect(item.type);
  };
  return (
    <div className={style.root}>
      <div
        className="trade-type_wrap"
        onClick={() => {
          setStateFlag(!stateFlag);
        }}
      >
        <div className="trade-name">{current.label}</div>
        <img
          src={arrow}
          className={["trade-img", stateFlag ? "arrow-active" : ""].join(" ")}
        />
      </div>

      {stateFlag && (
        <div className="fixed-wrap">
          {configList.map((item: any, idx: number) => {
            return (
              <>
                {tradeType === "delivery" ? (
                  idx == 0 && (
                    <div
                      className="select-item"
                      key={idx}
                      onClick={() => selectType(item)}
                    >
                      {item.label}
                    </div>
                  )
                ) : (
                  <div
                    className="select-item"
                    key={idx}
                    onClick={() => selectType(item)}
                  >
                    {item.label}
                  </div>
                )}
              </>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default React.memo(TradeSelect);
