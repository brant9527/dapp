import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

import searchPng from "@/assets/search.png";
import Tabs from "@/components/Tabs";
import QuotaCoin from "@/components/QuotaCoin";
import Io from "@/utils/socket";
import _ from "lodash";
import { accSub } from "@/utils/public";
import { isEqual } from "lodash";
function Quotation() {
  const { t } = useTranslation();
  window.localStorage.setItem("mock", "0");
  const [search, setsearch] = useSearchParams();
  const tabType = search.get("type") || "";
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
  let index = tabs.findIndex((item) => {
    return item.type === tabType;
  });
  index = index === -1 ? 0 : index;
  const [coinType, setCoinType] = useState(tabs[index].type);
  const [allList, setAllList] = useState<any>({
    hotList: [],
    recommendList: [],
    raiseList: [],
    downList: [],
    newPairList: [],
    optional: [],
  });
  const [wsList, setWsList] = useState<any>([]);
  // const [hotList, setHotList] = useState<Array<any>>([]);
  // const [recommendList, setRecommendList] = useState<Array<any>>([]);
  // const [raiseList, setRaiseList] = useState<Array<any>>([]);
  // const [downList, setDownList] = useState<Array<any>>([]);
  // const [newPairList, setNewPairList] = useState<Array<any>>([]);
  // const [optional, setOptional] = useState<Array<any>>([]);

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

    return () => cancelSubData();
  }, []);

  const getData = async () => {
    const data: any = await Io.getMarketList();
    const dataOptional: any = await Io.getCommonRequest("getUserCollectList", {
      tradeType: "swap",
    });

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
    // console.log("hotListTemp=>", hotListTemp);
    // console.log("recommendListTemp=>", recommendListTemp);
    // console.log("raiseListTemp=>", raiseListTemp);
    // console.log("downListTemp=>", downListTemp);
    // console.log("newPairListTemp=>", newPairListTemp);
    // console.log("newPairListTemp=>", newPairListTemp);
    const temp = {
      hotList: hotListTemp,
      recommendList: recommendListTemp,
      raiseList: raiseListTemp.filter((item: any) => item.rate > 0),
      downList: downListTemp.filter((item: any) => item.rate < 0),
      newPairList: newPairListTemp,
      optional: dataOptional,
    };
    console.log(temp);

    setAllList(temp);
  };
  const filterList = useMemo(() => {
    
    const hotListTemp = _.cloneDeep(allList.hotList);
    const recommendListTemp = _.cloneDeep(allList.recommendList);
    const newPairListTemp = _.cloneDeep(allList.newPairList);

    const raiseListTemp = _.cloneDeep(allList.raiseList);
    const downListTemp = _.cloneDeep(allList.downList);
    const optionalTemp = _.cloneDeep(allList.optional);
    console.log("wsList=>", wsList);
    wsList.map((item: any) => {
      const hotListTempIndex = hotListTemp.findIndex((cItem: any) => {
        return item.symbol === cItem.symbol;
      });
      const recommendListTempIndex = recommendListTemp.findIndex(
        (cItem: any) => {
          return item.symbol === cItem.symbol;
        }
      );
      const newPairListTempIndex = newPairListTemp.findIndex((cItem: any) => {
        return item.symbol === cItem.symbol;
      });
      const raiseListTempIndex = raiseListTemp.findIndex((cItem: any) => {
        return item.symbol === cItem.symbol;
      });

      const downListTempIndex = downListTemp.findIndex((cItem: any) => {
        return item.symbol === cItem.symbol;
      });
      const optionalTempIndex = optionalTemp.findIndex((cItem: any) => {
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
    const temp = {
      hotList: hotListTemp || [],
      recommendList: recommendListTemp || [],
      raiseList: raiseListTemp || [],
      downList: downListTemp || [],
      newPairList: newPairListTemp || [],
      optional: optionalTemp || [],
    };
    console.log(isEqual(temp,allList));
    if (isEqual(temp,allList)) {
      return allList
    }
    setAllList(temp);
    
    return temp;
  }, [wsList, allList]);
  const subData = async () => {
    Io.subscribeMarket((data: any) => {
      setWsList(data);
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
        return filterList.hotList;
      case "getRiseSymbolList":
        return filterList.raiseList;
      case "getNew":
        return filterList.newPairList;
      case "optional":
        return filterList.optional;
      case "getFallSymbolList":
        return filterList.downList;
      case "recommend":
        return filterList.recommendList;

      default:
        return filterList.hotList;
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
          <img src={searchPng} />
          <span className="text">{t("quota.search")}</span>
        </div>
        <Tabs tabs={tabs} onChange={onChange} index={index}></Tabs>
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
