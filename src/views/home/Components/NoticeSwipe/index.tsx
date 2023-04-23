import React, {
  Component,
  useCallback,
  useState,
  Fragment,
  useEffect,
} from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import { Autoplay, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import style from "./index.module.scss";
import msgNotify from "@/assets/msg-notify.png";
import { useTranslation } from "react-i18next";
import { getNoticeList } from "@/api/common";

console.log("初始化");
const state = {
  openState: false,
};

function NoticeSwipe(props: any) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [index, setIndex] = useState<any>(0);
  const [noticeList, setNoticeList] = useState([]);
  useEffect(() => {
    getNoticeListHandle();
  }, []);
  useEffect(() => {
    SwiperCore.use([Autoplay]);
  }, [noticeList]);
  const back = useCallback(() => {
    nav(-1);
  }, [useNavigate]);
  const getNoticeListHandle = useCallback(async () => {
    const { data } = await getNoticeList();
    setNoticeList(data);
  }, []);
  return (
    <div className={style.root}>
      <div
        className="home-msg"
        onClick={() => {
          nav("/notice");
        }}
      >
        <div className="msg">
          <img src={msgNotify} />
        </div>
        {noticeList.length > 0 && (
          <Swiper
            spaceBetween={50}
            // slidesPerView={1}
            autoHeight={true}

            direction="vertical"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
          >
            {noticeList.map((item: any, index: any) => {
              return (
                <div key={index + 1} className="msg-notify">
                  <SwiperSlide key={index + 1}>
                    <div className="msg-notify">{item.title}</div>
                  </SwiperSlide>
                </div>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}
export default React.memo(NoticeSwipe);
