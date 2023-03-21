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
import hb from "@/assets/hb.png";
import yq from "@/assets/yq.png";
import c2c from "@/assets/c2c.png";
import msgNotify from "@/assets/msg-notify.png";
import theme from "@/assets/yueliang.png";
import { useTranslation } from "react-i18next";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { changeState as themeHandle } from "@/store/reducer/theme";
import { useNavigate } from "react-router-dom";
import MenuList from "@/components/MenuLeft";
import HomePriceMid from "./Components/HomePriceMid";
import HomePriceBot from "./Components/HomePriceBot";
import QuotaCoin from "@/components/QuotaCoin";
import Banner from "@/components/Banner";
import socket from "@/utils/socket";
import banner from "@/assets/banner.png";
import axios from "@/utils/axios";
import { commonData } from "@/utils/socket";
function App() {
  let themes = window.localStorage.getItem("themes") || "light";

  const [bannerList, setBannerList] = useState([banner, banner, banner]);

  const [coinType, setCoinType] = useState("getHotList");

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
    // getBanner();
  }, []);
  const getBanner = useCallback(async () => {
    const { data } = await axios.post("/api/common/banner/getBannerList");
    // setBannerList(data);
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
      path: "/ai",
    },
    {
      label: t("home.btns.ai"),
      src: ai,
      path: "/ai",
    },
    {
      label: t("home.btns.xh"),
      src: xh,
      path: "/ai",
    },
    {
      label: t("home.btns.xb"),
      src: xinbi,
      path: "/ai",
    },
    {
      label: t("home.btns.mnjy"),
      src: mnjy,
      path: "/ai",
    },
    {
      label: t("home.btns.hb"),
      src: hb,
      path: "/ai",
    },
    {
      label: t("home.btns.yq"),
      src: yq,
      path: "/ai",
    },

    // {
    //   label: t("home.btns.c2c"),
    //   src: c2c,
    //   path: "/ai",
    // },
  ];
  const handleSelect = (type: string) => {
    setCoinType(type);
  };

  return (
    <div className={style.root}>
      <div className="home-wrap">
        <div className="home-top">
          <div className="left">
            <img src={user} onClick={openMenu} />
            <div className="input-bg">
              <img src={search} />
              <span className="text">{t("home.search")}</span>
            </div>
          </div>
          <div className="right">
            <div className="msg" onClick={()=>{
              navigate('/message')
            }}>
              <img src={msg} />
              <div className="tip-num">19</div>
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
      <HomePriceMid />
      <div className="quota">
        <HomePriceBot handleSelect={handleSelect} />

        <QuotaCoin coinType={coinType}></QuotaCoin>
      </div>
    </div>
  );
}

export default App;
