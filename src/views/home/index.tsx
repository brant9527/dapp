import style from "./index.module.scss";
import user from "@/assets/user.png";
import search from "@/assets/search.png";
import msg from "@/assets/msg.png";
import chat from "@/assets/chat.png";
import jy from "@/assets/jy.png";
import ai from "@/assets/ai.png";
import xh from "@/assets/xh.png";
import xinbi from "@/assets/xinbi.png";
import mnjy from "@/assets/mnjy.png";
import jd from "@/assets/hb.png";
import yq from "@/assets/yq.png";
import c2c from "@/assets/c2c.png";
import msgNotify from "@/assets/msg-notify.png";
import theme from "@/assets/yueliang.png";
import { useTranslation } from "react-i18next";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuList from "@/components/MenuLeft";
import HomePriceMid from "./Components/HomePriceMid";
import HomePriceBot from "./Components/HomePriceBot";
import QuotaCoin from "@/components/QuotaCoin";
import Banner from "@/components/Banner";
import socket from "@/utils/socket";
import _ from "lodash";

import { getUnReadMessageCnt, getBannerList } from "@/api/home";
import { getNoticeList } from "@/api/common";
import { accSub } from "@/utils/public";
function App() {
  let themes = window.localStorage.getItem("themes") || "light";

  const [bannerList, setBannerList] = useState([]);
  const [unReadMsg, setUnReadMsg] = useState(0);
  const [noticeList, setNoticeList] = useState(0);
  const [coinType, setCoinType] = useState("getHotList");

  const [hotList, setHotList] = useState<Array<any>>([]);
  const [recommendList, setRecommendList] = useState<Array<any>>([]);
  const [raiseList, setRaiseList] = useState<Array<any>>([]);
  const [downList, setDownList] = useState<Array<any>>([]);
  const [newPairList, setNewPairList] = useState<Array<any>>([]);
  const [optional, setOptional] = useState<Array<any>>([]);

  const { t } = useTranslation();
  console.log("home页刷新");
  const onChangeTheme = useCallback(async () => {
    if (themes === "light") {
      themes = "dark";
    } else {
      themes = "light";
    }
    window.localStorage.setItem("themes", themes);
    window.document.documentElement.setAttribute("data-theme", themes); // 给根节点设置data-theme属性，切换主题色就是修改data-theme的值
  }, []);
  useEffect(() => {
    getBanner();
    getMsgUnRead();
    getNoticeListHandle();
    getData();
  }, []);
  useEffect(() => {
    subData();
    return () => cancelSubData();
    console.log(hotList, recommendList, raiseList, downList, newPairList);
  }, [hotList, recommendList, raiseList, downList, newPairList, optional]);

  const getData = async () => {
    const data: any = await socket.getMarketList();
    const dataOptional: any = await socket.getCommonRequest(
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
    socket.subscribeMarket((data: any) => {
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
  };
  const cancelSubData = useCallback(() => {
    socket.cfwsUnsubscribe("market.*");
  }, []);
  const getBanner = useCallback(async () => {
    const { data } = await getBannerList();
    setBannerList(data.map((item: any) => item.imageUrl));
  }, []);
  const getMsgUnRead = useCallback(async () => {
    const { data } = await getUnReadMessageCnt();
    setUnReadMsg(data);
  }, []);
  const getNoticeListHandle = useCallback(async () => {
    const { data } = await getNoticeList();
    setNoticeList(data);
  }, []);

  const navigate = useNavigate();
  const openMenu = () => {
    MenuList.open(navigate);
  };
  const nav = (path: string) => {
    navigate(path);
  };
  const btnList = [
    {
      label: t("home.btns.jy"),
      src: jy,
      path: "/stock",
    },

    // {
    //   label: t("home.btns.xh"),
    //   src: xh,
    //   path: "/stock",
    // },
    {
      label: t("home.btns.xb"),
      src: xinbi,
      path: "/ai",
    },
    {
      label: t("home.btns.ai"),
      src: ai,
      path: "/ai",
    },
    {
      label: t("home.btns.jd"),
      src: jd,
      path: "/lendList",
    },
    {
      label: t("home.btns.mnjy"),
      src: mnjy,
      path: "/ai",
    },

    {
      label: t("home.btns.yq"),
      src: yq,
      path: "/ai",
    },

    {
      label: t("home.btns.us"),
      src: c2c,
      path: "/us",
    },
  ];
  const handleSelect = useCallback((type: string) => {
    console.log("setCoinType=>", type);
    setCoinType(type);
  }, []);
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
      <div className="home-wrap">
        <div className="home-top">
          <div className="left">
            <img src={user} onClick={openMenu} />
            <div
              className="input-bg"
              onClick={() => {
                navigate("/search");
              }}
            >
              <img src={search} />
              <span className="text">{t("home.search")}</span>
            </div>
          </div>
          <div className="right">
            <div
              className="msg"
              onClick={() => {
                navigate("/message");
              }}
            >
              <img src={msg} />
              {unReadMsg ? <div className="tip-num">{unReadMsg}</div> : ""}
            </div>
            <img src={theme} className="theme" onClick={onChangeTheme} />
            <img src={chat} className="chat" />
          </div>
        </div>
        <div className="home-banner">
          <Banner bannerList={bannerList}></Banner>
        </div>
        <div className="home-msg">
          <div className="msg">
            <img src={msgNotify} alt="" />
          </div>
          <div className="msg-notify">关于定投指数关连计算每月调仓的通知</div>
        </div>
        <div className="home-btns">
          {btnList.map((item, i) => {
            return (
              <div className="btn-item" key={i} onClick={() => nav(item.path)}>
                <img src={item.src} />
                <div className="btn-label">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <HomePriceMid hotList={recommendList} />
      <div className="quota">
        <HomePriceBot handleSelect={handleSelect} />

        <QuotaCoin
          coinType={coinType}
          coinList={selectCoinlist(coinType)}
        ></QuotaCoin>
      </div>
    </div>
  );
}

export default App;
