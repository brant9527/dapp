import React, { Component, useCallback, useState, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";

import { useTranslation } from "react-i18next";

function Tabs(props: any) {
  const { onChange, currentTab, list = [] } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  const [transx, setTranx] = useState("1.24rem");
  const ref = useRef(null);

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
        {list.map((item: any, idx: any) => {
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
export default Tabs;
