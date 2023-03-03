import React, {
  Component,
  useCallback,
  useState,
  Fragment,
  useMemo,
} from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";

import { useTranslation } from "react-i18next";
function SlideBar(props: any) {
  const { onSlide, type, value } = props;
  console.log('slide value=>>>',value);
  const { t } = useTranslation();

  const nav = useNavigate();
  const slideList = [
    { label: "25%", val: 0.25 },
    { label: "50%", val: 0.5 },
    { label: "75%", val: 0.75 },
    { label: "100%", val: 1 },
  ];

  return (
    <div className={style.root}>
      <div className="slide-wrap">
        {slideList.map((item, index) => {
          return (
            <div
              className={["slide-item"].join(" ")}
              key={index}
              onClick={() => {
                if (value == item.val) {
                  onSlide(-1);
                } else {
                  onSlide(item.val);
                }
              }}
            >
              <div
                className={[
                  "slide-bar",
                  value >= item.val ? `slide-acitive__${type}` : "",
                ].join(" ")}
              ></div>
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default React.memo(SlideBar);
