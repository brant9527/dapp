import React, { Component, useCallback, useState, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";

import { useTranslation } from "react-i18next";

function Quotation(props: any) {
  const { data = [], type, direction="right" } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  let total = 0;
  data.map((item: any) => {
    return (total += item[1]);
  });

  return (
    <div className={style.root}>
      {data.map((item: any, index: any) => {
        return (
          <div
            className={[
              "price-bar_item",
              type === "sell" ? "price-bg_sell" : "price-bg_buy",
            ].join(" ")}
            // style={{ back: `${type==='sell'?'down':''}` }}

            key={index}
          >
            <div className="bar-price-count">
              <div className={type === "sell" ? "down" : "up"}>{item[0]}</div>
              <div className="price-bar_right">{item[1]}</div>
            </div>
            <div
              className={[
                "price-bar",
                type === "sell" ? "price-bg_sell" : "price-bg_buy",
                direction === "left" ? "left" : "right",
              ].join(" ")}
              style={{
                width: `${(item[1] / total) * 100}%`,
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
export default Quotation;
