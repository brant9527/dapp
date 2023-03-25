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

import { useTranslation } from "react-i18next";
console.log("初始化");
const state = {
  openState: false,
};

function Banner(props: any) {
  const { bannerList } = props;
  const { t } = useTranslation();
  const nav = useNavigate();
  useEffect(() => {
    SwiperCore.use([Autoplay]);
  }, [bannerList]);
  const back = useCallback(() => {
    nav(-1);
  }, [useNavigate]);
  return (
    <div className={style.root}>
      <div className="banner-wrap">
        {bannerList.length > 0 && (
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
          >
            {bannerList.map((item: any, index: any) => {
              return (
                <div key={index + 1}>
                  <SwiperSlide key={index + 1}>
                    <img src={item} className="banner" />
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
export default React.memo(Banner);