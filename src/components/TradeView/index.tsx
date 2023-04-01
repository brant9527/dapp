import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import { init, dispose, registerIndicator, Chart } from "klinecharts";

import style from "./index.module.scss";
import { size } from "lodash";
import { useTranslation } from "react-i18next";
import Io from "@/utils/socket";
import { getLastDealRecordList } from "@/api/trade";

const fruits = ["🍏"];

interface EmojiEntity {
  emoji: number;
  text: string;
}

// 自定义指标
registerIndicator<EmojiEntity>({
  name: "EMOJI",
  figures: [{ key: "emoji" }],
  calc: (kLineDataList) => {
    return kLineDataList.map((kLineData) => ({
      emoji: kLineData.close,
      text: fruits[Math.floor(Math.random() * 17)],
    }));
  },
  draw: ({ ctx, barSpace, visibleRange, indicator, xAxis, yAxis }) => {
    const { from, to } = visibleRange;

    ctx.font = `${barSpace.gapBar}px Helvetica Neue`;
    ctx.textAlign = "center";
    const result = indicator.result;
    for (let i = from; i < to; i++) {
      const data = result[i];
      const x = xAxis.convertToPixel(i);
      const y = yAxis.convertToPixel(data.emoji);
      ctx.fillText(data.text, x, y);
    }
    return false;
  },
});

const mainIndicators = ["MA", "EMA", "SAR"];
const subIndicators = ["VOL", "MACD", "KDJ"];

function TradeView(props: any) {
  const { symbol, onChangeMinutes } = props;
  const { t } = useTranslation();

  /**
 *  "minite": "分時",
    "minite5": "5分",
    "minite15": "15分",
    "minite30": "30分",
    "hour": "1小時",
    "hour4": "4小時",
    "hour2": "2小時",
    "day": "天"
 */
  const times = [
    {
      label: t("time.minute"),
      value: "minute",
    },
    {
      label: t("time.minute5"),
      value: "5minute",
    },
    {
      label: t("time.minute15"),
      value: "15minute",
    },
    {
      label: t("time.minute30"),
      value: "30minute",
    },
    {
      label: t("time.hour"),
      value: "1hour",
    },
    {
      label: t("time.hour2"),
      value: "2hour",
    },
    {
      label: t("time.hour4"),
      value: "4hour",
    },
    {
      label: t("time.day"),
      value: "day",
    },
  ];

  const chart = useRef<Chart | null>(null);
  const paneId = useRef<string>("");
  const [time, setTime] = useState(times[0].value);
  const [from, setFrom] = useState(new Date().getTime());
  const getTimeCalc = useCallback(() => {
    const total = 1000 * 500 * 60;
    switch (time) {
      case "minute":
        return total * 1;
      case "5minute":
        return total * 5;
      case "15minute":
        return total * 15;
      case "30minute":
        return total * 30;
      case "1hour":
        return total * 60;
      case "2hour":
        return total * 120;
      case "4hour":
        return total * 240;
      case "day":
        return total * 1440;
      default:
        return total * 60;
    }
  }, [time]);
  useEffect(() => {
    chart.current = init("indicator-k-line");
    paneId.current = chart.current?.createIndicator("VOL", false) as string;

    chart.current?.setBarSpace(20);
    chart.current?.createIndicator("MA", false, {
      id: "candle_pane",
    });
    chart.current?.setStyles({
      candle: {
        area: {
          lineSize: 1,
        },

        tooltip: {
          text: {
            size: 30,
          },
        },
        priceMark: {
          last: { text: { size: 30 } },
        },
      },
      indicator: {
        tooltip: {
          text: {
            size: 30,
          },
        },
        lastValueMark: {
          text: {
            size: 30,
          },
        },
      },
      xAxis: {
        tickText: {
          size: 30,
        },
      },
      yAxis: {
        tickText: {
          size: 30,
        },
      },

      crosshair: {
        horizontal: {
          text: { size: 30 },
          line: {
            size: 5,
          },
        },
        vertical: {
          text: { size: 30 },
          line: {
            size: 5,
          },
        },
      },
    });
    chart.current?.setOffsetRightDistance(0);

    return () => {
      dispose("indicator-k-line");
    };
  }, []);
  useEffect(() => {
    console.log("进入请求历史数据");
    // 时间
    const params = {
      resolution: time,
      symbol: symbol,
      from: new Date().getTime() - getTimeCalc(),
      to: new Date().getTime(),
    };
    // 开启订阅+请求模式
    Io.cfwsKline(params, true, (data: any, type: any) => {
      console.log(data.klines, type);
      if (type == "all") {
        chart.current?.applyNewData(data.klines);
      }
      if (type === "one") {
        chart.current?.updateData(data.klines[0]);
      }
    });
    chart.current?.loadMore((timestamp: any) => {
      setFrom(timestamp);
      const params = {
        resolution: time,
        symbol: symbol,
        from: timestamp - getTimeCalc(),
        to: timestamp,
      };
      Io.cfwsKline(params, null, (data: any, type: any) => {
        console.log(data, type);
        if (type == "all") {
          chart.current?.applyMoreData(data);
        }
      });
    });
    return () => {
      Io.cfwsUnsubscribe(`kline.${time}.${symbol}`);
    };
  }, [time]);

  const selectTime = useCallback(
    (value: any) => {
      Io.cfwsUnsubscribe(`kline.${time}.${symbol}`);

      setTime(value);
      onChangeMinutes(value);
    },
    [time]
  );

  return (
    <>
      <div className={style.root}>
        <div className="k-line-scale">
          <div className="part-time">
            {times.map((item: any, idx: any) => {
              return (
                <div
                  className={`item ${time === item.value ? "active" : ""} `}
                  key={idx}
                  onClick={() => selectTime(item.value)}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
          <div id="indicator-k-line" className="k-line-chart" />
        </div>
        {/* <div className="k-line-chart-menu-container">
          <span style={{ paddingRight: 10 }}>主图指标</span>
          {mainIndicators.map((type) => {
            return (
              <button
                key={type}
                onClick={(_) => {
                  chart.current?.createIndicator(type, false, {
                    id: "candle_pane",
                  });
                }}
              >
                {type}
              </button>
            );
          })}
          <button
            onClick={(_) => {
              chart.current?.createIndicator("EMOJI", true, {
                id: "candle_pane",
              });
            }}
          >
            自定义
          </button>
          <span style={{ paddingRight: 10, paddingLeft: 12 }}>副图指标</span>
          {subIndicators.map((type) => {
            return (
              <button
                key={type}
                onClick={(_) => {
                  chart.current?.createIndicator(type, false, {
                    id: paneId.current,
                  });
                }}
              >
                {type}
              </button>
            );
          })}
          <button
            onClick={(_) => {
              chart.current?.createIndicator("EMOJI", false, {
                id: paneId.current,
              });
            }}
          >
            自定义
          </button>
        </div> */}
      </div>
    </>
  );
}
export default memo(TradeView);
