import React, { useEffect } from "react";
import style from "./index.module.scss";
import socket from "@/utils/socket";
import { toFixed } from "@/utils/public";
import pricedown from "@/assets/pricedown.png";
import priceup from "@/assets/priceup.png";
const HomePriceMid = (props: any) => {
  const { hotList = [] } = props;

  return (
    <div className={style.root}>
      <div className="priceMid">
        {hotList.map((item: any, i: any) => {
          return (
            <div className="item-wrap" key={i}>
              <div className="top">
                <div className="coin">{item.symbol.replace("USDT", "")}</div>
                <div className="baseCoin">/usdt</div>
                <div
                  className={[item.rate > 0 ? "up" : "down", " raise"].join(
                    " "
                  )}
                >
                  {toFixed(item.rate, 2)}%
                </div>
              </div>
              <div className={`center ${item.rate > 0 ? "up" : "down"}`}>
                {item.close}
              </div>
              <div className="bottom">
                <img src={item.rate > 0 ? priceup : pricedown} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default React.memo(HomePriceMid);
