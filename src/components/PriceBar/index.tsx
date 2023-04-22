import React, { Component, useCallback, useState, useRef } from "react";
import * as ReactDOMClient from "react-dom/client";
import { useNavigate } from "react-router-dom";

import style from "./index.module.scss";

import { useTranslation } from "react-i18next";
import { fixPrice } from "@/utils/public";

function Quotation(props: any) {
  const { data = [], type = "buy", direction = "right" } = props;
  const { t } = useTranslation();
  const nav = useNavigate();

  let total = 0;
  // price: '28592.4', qty: '8.953'
  data.map((item: any) => {
    return (total += Number(item.qty));
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
              {direction === "left" ? (
                <>
                  <div className={type === "sell" ? "down" : "up"}>
                    {item.qty}
                  </div>
                  <div className="price-bar_right">{fixPrice(item.price)}</div>
                </>
              ) : (
                <>
                  <div className="price-bar_right">{fixPrice(item.price)}</div>

                  <div className={type === "sell" ? "down" : "up"}>
                    {item.qty}
                  </div>
                </>
              )}
            </div>
            <div
              className={[
                "price-bar",
                type === "sell" ? "price-bg_sell" : "price-bg_buy",
                direction === "left" ? "left" : "right",
              ].join(" ")}
              style={{
                width: `${(item.qty / total) * 100}%`,
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
export default Quotation;
