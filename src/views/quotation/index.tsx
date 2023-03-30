import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import search from "@/assets/search.png";
import Tabs from "@/components/Tabs";
import QuotaCoin from "@/components/QuotaCoin";
import Io from "@/utils/socket";
import _ from "lodash";
import { accSub } from "@/utils/public";

function Quotation() {
  const { t } = useTranslation();
  const tabs = [
    {
      title: t("home.coins.hot"),
      type: "getHotList",
    },
    {
      title: t("tabs.optional"),
      type: "optional",
    },

    {
      title: t("home.coins.raise"),
      type: "getRiseSymbolList",
    },
    {
      title: t("home.coins.down"),
      type: "getFallSymbolList",
    },
    {
      title: t("home.coins.new"),
      type: "getNew",
    },
  ];
  const [coinType, setCoinType] = useState("getHotList");
  const [hotList, setHotList] = useState<Array<any>>([]);
  const [recommendList, setRecommendList] = useState<Array<any>>([]);
  const [raiseList, setRaiseList] = useState<Array<any>>([]);
  const [downList, setDownList] = useState<Array<any>>([]);
  const [newPairList, setNewPairList] = useState<Array<any>>([]);
  const [optional, setOptional] = useState<Array<any>>([]);

  const nav = useNavigate();
  const onChange = (type: string) => {
    console.log(type);
    setCoinType(type);
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    subData();
    console.log(hotList, recommendList, raiseList, downList, newPairList);

    return () => cancelSubData();
  }, [hotList, recommendList, raiseList, downList, newPairList, optional]);

  const getData = async () => {
    const data: any = await Io.getMarketList();
    const dataOptional: any = await Io.getCommonRequest(
      "getUserCollectList",
      "swap"
    );

    const hotListTemp: Array<any> = [];
    const recommendListTemp: Array<any> = [];
    const newPairListTemp: Array<any> = [];

    const raiseListTemp = _.cloneDeep(data);
    const downListTemp = _.cloneDeep(data);

    data.map((item: any) => {
      if (item.hot) {
        hotListTemp.push(item);
      }
      if (item.recommend) {
        recommendListTemp.push(item);
      }
      if (item.newPair) {
        newPairListTemp.push(item);
      }
    });

    raiseListTemp.sort(function (obj1: any, obj2: any) {
      return accSub(obj2.rate, obj1.rate);
    });
    downListTemp.sort(function (obj1: any, obj2: any) {
      return accSub(obj1.rate, obj2.rate);
    });
    console.log("hotListTemp=>", hotListTemp);
    console.log("recommendListTemp=>", recommendListTemp);
    console.log("raiseListTemp=>", raiseListTemp);
    console.log("downListTemp=>", downListTemp);
    console.log("newPairListTemp=>", newPairListTemp);
    console.log("newPairListTemp=>", newPairListTemp);

    setHotList(hotListTemp);
    setRecommendList(recommendListTemp);
    setRaiseList(raiseListTemp);
    setDownList(downListTemp);
    setNewPairList(newPairListTemp);
    setOptional(optional);
  };

  const subData = async () => {
    Io.subscribeMarket((data: any) => {
      const hotListTemp = _.cloneDeep(hotList);
      const recommendListTemp = _.cloneDeep(recommendList);
      const newPairListTemp = _.cloneDeep(newPairList);

      const raiseListTemp = _.cloneDeep(raiseList);
      const downListTemp = _.cloneDeep(downList);
      const optionalTemp = _.cloneDeep(optional);
      data.map((item: any) => {
        console.log("查看temp值=>>>>", hotList);

        const hotListTempIndex = hotListTemp.findIndex((cItem) => {
          return item.symbol === cItem.symbol;
        });
        const recommendListTempIndex = recommendListTemp.findIndex((cItem) => {
          return item.symbol === cItem.symbol;
        });
        const newPairListTempIndex = newPairListTemp.findIndex((cItem) => {
          return item.symbol === cItem.symbol;
        });
        const raiseListTempIndex = raiseListTemp.findIndex((cItem) => {
          return item.symbol === cItem.symbol;
        });

        const downListTempIndex = downListTemp.findIndex((cItem) => {
          return item.symbol === cItem.symbol;
        });
        const optionalTempIndex = optionalTemp.findIndex((cItem) => {
          return item.symbol === cItem.symbol;
        });

        console.log(
          "hotIndex=>",
          hotListTempIndex,
          raiseListTempIndex,
          recommendListTempIndex,
          newPairListTempIndex,
          downListTempIndex,
          optionalTempIndex
        );
        if (hotListTempIndex > -1) {
          hotListTemp.splice(hotListTempIndex, 1, item);
        }
        if (raiseListTempIndex > -1) {
          raiseListTemp.splice(raiseListTempIndex, 1, item);
        }
        if (recommendListTempIndex > -1) {
          recommendListTemp.splice(recommendListTempIndex, 1, item);
        }
        if (newPairListTempIndex > -1) {
          newPairListTemp.splice(newPairListTempIndex, 1, item);
        }
        if (downListTempIndex > -1) {
          downListTemp.splice(downListTempIndex, 1, item);
        }
        if (optionalTempIndex > -1) {
          optionalTemp.splice(optionalTempIndex, 1, item);
        }
      });
      setHotList(hotListTemp);
      setRecommendList(recommendListTemp);
      setRaiseList(raiseListTemp);
      setDownList(downListTemp);
      setNewPairList(newPairListTemp);
      setOptional(optionalTemp);
    });
    console.log("开启订阅");
  };
  const cancelSubData = () => {
    console.log("取消订阅");

    Io.cfwsUnsubscribe("market.*");
  };
  const selectCoinlist = (type: string) => {
    switch (type) {
      case "getHotList":
        return hotList;
      case "getRiseSymbolList":
        return raiseList;
      case "getNew":
        return newPairList;
      case "optional":
        return optional;
      case "getFallSymbolList":
        return downList;

      default:
        return hotList;
    }
  };
  return (
    <div className={style.root}>
      <div className="quota-wrap">
        <div
          className="input-bg"
          onClick={() => {
            nav("/search");
          }}
        >
          <img src={search} />
          <span className="text">{t("quota.search")}</span>
        </div>
        <Tabs tabs={tabs} onChange={onChange}></Tabs>
        <div className="coinList">
          <QuotaCoin
            coinType={coinType}
            coinList={selectCoinlist(coinType)}
          ></QuotaCoin>
        </div>
      </div>
    </div>
  );
}

export default Quotation;
