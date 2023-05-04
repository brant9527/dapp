import style from "./index.module.scss";
import user from "@/assets/user.png";
import search from "@/assets/search.png";
import msg from "@/assets/msg.png";
import chat from "@/assets/chat.png";
import jy from "@/assets/jy.png";
import ai from "@/assets/ai.png";
import copyPng from "@/assets/btn-copy.png";
import xinbi from "@/assets/xinbi.png";
import mnjy from "@/assets/mnjy.png";
import jd from "@/assets/hb.png";
import yq from "@/assets/yq.png";
import c2c from "@/assets/c2c.png";
import msgNotify from "@/assets/msg-notify.png";
import theme from "@/assets/yueliang.png";
import { useTranslation } from "react-i18next";

import { useCallback, useEffect, useRef, useState, memo,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MenuList from "@/components/MenuLeft";
import HomePriceMid from "./Components/HomePriceMid";
import HomePriceBot from "./Components/HomePriceBot";
import Tabs from "@/components/Tabs";
import QuotaCoin from "@/components/QuotaCoin";
import Banner from "@/components/Banner";

import socket from "@/utils/socket";
import _,{isEqual} from "lodash";

import { getUnReadMessageCnt, getBannerList } from "@/api/home";
import { getNoticeList } from "@/api/common";
import { accSub, getUrlParams } from "@/utils/public";
import Article from "./Components/Article";
import { getUserInfo } from "@/api/userInfo";
import { useWeb3 } from "@/hooks/useWeb3/useWeb3";
import { ABI } from "../../hooks/useWeb3/dappInfo";
import { AbiItem } from "web3-utils";
import axios from "@/utils/axios";
import Wallet from "@/components/Wallet";
import Confirm from "@/components/Confirm";
import Toast from "@/components/Toast";
import AccountBtn from "@/components/AccountBtn";
import NoticeSwipe from "./Components/NoticeSwipe";
import copy from "copy-to-clipboard";

function App() {
  const { t } = useTranslation();

  let themes = window.localStorage.getItem("themes") || "light";
  // 初始化mock值
  window.localStorage.setItem("mock", "0");
  const [bannerList, setBannerList] = useState([]);
  const [unReadMsg, setUnReadMsg] = useState(0);

  const [coinType, setCoinType] = useState("getHotList");
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
  const [userInfo, setUserInfo] = useState<any>({});
  const { connectProvider, changeProvider, account, web3, providerString } =
    useWeb3();
  const confirmRef = useRef<any>(null);
  const cutomerConfirmRef = useRef<any>(null);

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
    getData();
  }, [account]);
  useEffect(() => {
    subData();
    return () => cancelSubData();
  }, []);
  const onGetUserInfo = async () => {
    const { data, code } = await getUserInfo();
    if (code === 0) {
      setUserInfo(data);
    }
  };

  const getData = async () => {
    const data: any = await socket.getMarketList();
    const dataOptional: any = await socket.getCommonRequest(
      "getUserCollectList",
      { tradeType: "swap" }
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
    // console.log("hotListTemp=>", hotListTemp);
    // console.log("recommendListTemp=>", recommendListTemp);
    // console.log("raiseListTemp=>", raiseListTemp);
    // console.log("downListTemp=>", downListTemp);
    // console.log("newPairListTemp=>", newPairListTemp);
    if(hotListTemp.length>6){
      hotListTemp.length = 6
    }
    if(recommendListTemp.length>6){
      recommendListTemp.length = 6
    }
    if(raiseListTemp.length>6){
      raiseListTemp.length = 6
    }
    if(downListTemp.length>6){
      downListTemp.length = 6
    }
    if(newPairListTemp.length>6){
      newPairListTemp.length = 6
    }
    if(dataOptional.length>6){
      dataOptional.length = 6
    }
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
    // setHotList(hotListTemp);
    // setRecommendList(recommendListTemp);
    // setRaiseList(raiseListTemp.filter((item: any) => item.rate > 0));
    // setDownList(downListTemp.filter((item: any) => item.rate < 0));
    // setNewPairList(newPairListTemp);
    // setOptional(dataOptional);
  };

  const subData = async () => {
    socket.subscribeMarket((data: any) => {
      setWsList(data);

    });
  };
  const cancelSubData = useCallback(() => {
    socket.cfwsUnsubscribe("market.*");
  }, []);
  const getBanner = useCallback(async () => {
    const { data } = await getBannerList();
    setBannerList(data.map((item: any) => item));
  }, []);
  const getMsgUnRead = useCallback(async () => {
    const { data } = await getUnReadMessageCnt();

    setUnReadMsg(data);
  }, []);
  useEffect(() => {
    let timer: any = 0;
    if (account) {
      getMsgUnRead();
      timer = setInterval(() => {
        getMsgUnRead();
      }, 10000);
    }
    return () => clearInterval(timer);
  }, [account]);

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

    {
      label: t("home.btns.xb"),
      src: xinbi,
      path: "/quotation?type=getNew",
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
      path: "/mockTrade",
    },
    {
      label: t("home.btns.C2C"),
      src: c2c,
      path: "/C2C",
    },
    {
      label: t("home.btns.yq"),
      src: yq,
      path: "/invite",
    },

    {
      label: t("home.btns.us"),
      src: c2c,
      path: "/usNext?id=4",
    },
  ];
  const handleSelect = useCallback((type: string) => {
    console.log("setCoinType=>", type);
    setCoinType(type);
  }, []);
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

      default:
        return filterList.hotList;
    }
  };
  const handleLoginOut = () => {
    // localStorage.removeItem("web3-provider")
    changeProvider();
    localStorage.removeItem("device");
    localStorage.removeItem("account");
  };

  const connected = !!account && !!web3;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    handleConnectWallet();
  }, []);
  const handleConnectWallet = useCallback(async () => {
    if ((window as any).ethereum?.isImToken) {
      setOpen(false);
      // attempt to connect provider via web3Hook
      await connectProvider("all").finally(() => {
        console.log("trust success");
      });
    } else if ((window as any).ethereum?.isMetaMask) {
      setOpen(false);
      // attempt to connect provider via web3Hook
      await connectProvider("metamask").finally(() => {
        console.log("metamask success");
      });
    } else if ((window as any).ethereum?.isTrust) {
      setOpen(false);
      // attempt to connect provider via web3Hook
      await connectProvider("trust").finally(() => {
        console.log("trust success");
      });
    } else {
      // setOpen(true);
    }
  }, [connectProvider]);
  const onConfirm = () => {
    try {
      (window as any).Tawk_API.maximize();
    } catch (error) {
      Toast.notice("need vpn", {});
    }
  };
  useEffect(() => {
    async function addUser() {
      localStorage.setItem("account", account || "");

      localStorage.setItem("device", providerString || "");
      const params = getUrlParams(location.href);
      const data = {
        inviteCode: params.inviteCode,
      };
      try {
        await axios.post("/api/user/base/addUser", data);
        console.log("addUser");
      } catch (error) {
        console.log(error);
      }

      onGetUserInfo();
    }
    if (connected) {
      console.log("homeconnected");
      addUser();
    }
  }, [connected]);
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
  return (
    <div className={style.root}>
      <Wallet open={open} />
      <div className="home-wrap">
        <div className="home-top">
          <div className="left">
            <img src={user} onClick={openMenu} />

            {/* <AccountBtn
              account={account}
              handleLoginOut={handleLoginOut}
              handleConnectWallet={handleConnectWallet}
            /> */}
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
            <img
              src={chat}
              className="chat"
              onClick={() => {
                (window as any).Tawk_API.maximize();
              }}
            />
          </div>
        </div>

        <div className="home-banner">
          <Banner bannerList={bannerList}></Banner>
        </div>
        <NoticeSwipe></NoticeSwipe>
        {/* <div
          className="home-msg"
          onClick={() => {
            navigate("/notice");
          }}
        >
          <div className="msg">
            <img src={msgNotify}  />
          </div>
          <div className="msg-notify">{noticeList[0]?.title}</div>
        </div> */}
        <div className="home-btns">
          {btnList.map((item, i) => {
            return (
              <div
                className="btn-item"
                key={i}
                onClick={() => {
                  if (item.path.indexOf("/C2C") > -1) {
                    return confirmRef.current.open();
                  }
                  nav(item.path);
                }}
              >
                <img src={item.src} />
                <div className="btn-label">{item.label}</div>
              </div>
            );
          })}
        </div>
        {!!userInfo.customerStatus && (
          // <a
          //   href={`tg://resolve?domain=${userInfo.customerTelegram}&start=${userInfo.customerTelegramId}`}
          // >
          <div
            className="vip"
            onClick={() => {
              cutomerConfirmRef.current.open();
            }}
          >
            <div className="vip-head">
              <img src={userInfo.customerHeadUrl} />
            </div>
            <div className="center">
              <div className="vip-name">{userInfo.customerName}</div>
              <div className="vip-desc">{t("home.vip-desc")}</div>
            </div>
          </div>
          // </a>
        )}
      </div>
      <HomePriceMid hotList={filterList.recommendList} />
      <div className="quota">
        <HomePriceBot handleSelect={handleSelect} />

        <QuotaCoin
          coinType={coinType}
          coinList={selectCoinlist(coinType)}
        ></QuotaCoin>
        <div className="quota-more" onClick={()=>{
                navigate("/quotation");
          
        }}>{t("common.getMore")+' >'}</div>
      </div>
      <Article></Article>
      <Confirm onConfirm={onConfirm} cancel={true} ref={confirmRef}>
        <div className="confirm-tip">{t("home.customer-tip")}</div>
      </Confirm>
      <Confirm cancel={false} ref={cutomerConfirmRef}>
        <div className="vip-confirm">
          <div className="vip-confirm-top">
            Telegram:{" "}
            <span
              onClick={() => {
                copy(userInfo.customerTelegram);
                Toast.notice(t("common.copy"), {});
              }}
            >
              {userInfo.customerTelegram} <img src={copyPng} />
            </span>
          </div>
          <div className="vip-words">
            {t("home.vip-confirm", { vip: "VIP" + userInfo.memberLevel })}
          </div>
        </div>
      </Confirm>
    </div>
  );
}

export default memo(App);
