import React, { Component, useCallback, useState, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";

import { useTranslation } from "react-i18next";

function Quotation(props) {
  const { onChange, currentTab } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  const [transx, setTranx] = useState("1.24rem");
  const ref = useRef(null);
  const list = [
    {
      title: t("tabs.optional"),
      type: "optional",
    },
    {
      title: t("tabs.hot"),
      type: "hot",
    },
    {
      title: t("tabs.raise"),
      type: "raise",
    },
    {
      title: t("tabs.new"),
      type: "new",
    },
  ];

  const selectItem = (event: any, type: string) => {
    console.log(event, type);
    const target = event.target;
    const left = target.clientWidth / 2 + event.target.offsetLeft + "px";
    setTranx(left);
    onChange(type);
  };
  console.log("滑块=》", ref);
  // ref?.current?.childNodes

  return (
    <div className={style.root}>
      <div className="tabs" ref={ref}>
        {list.map((item, idx) => {
          return (
            <div
              className="tab"
              key={idx}
              onClick={(event) => {
                selectItem(event, item.type);
              }}
            >
              {item.title}
            </div>
          );
        })}
        <div
          className="line"
          style={{ transform: `translateX(${transx}) translateX(-50%)` }}
        ></div>
      </div>
    </div>
  );
}
export default Quotation;
