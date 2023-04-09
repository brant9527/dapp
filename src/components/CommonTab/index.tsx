import React, { Component, useCallback, useState, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";

import { useTranslation } from "react-i18next";

function Tabs(props: any) {
  const { onChange, defaultIndex = 0, list = [] } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  const ref = useRef(null);
  const [index, setIndex] = useState(defaultIndex);
  const selectItem = (event: any, type: string) => {
    console.log(event, type);

    onChange(type);
  };

  return (
    <div className={style.root}>
      <div className="tabs" ref={ref}>
        {list.map((item: any, idx: any) => {
          return (
            <div
              className={["tab", index === idx ? "active" : ""].join(" ")}
              key={idx}
              onClick={(event) => {
                setIndex(idx);
                selectItem(event, item.type);
              }}
            >
              {item.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default Tabs;
