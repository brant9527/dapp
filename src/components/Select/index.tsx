import React, {
  Component,
  useCallback,
  useState,
  Fragment,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import backImg from "@/assets/left.png";

import { useTranslation } from "react-i18next";

const Select = forwardRef((props: any, ref) => {
  const { configList = [], onSelect } = props;
  const [visable, setVisable] = useState(false);
  const { t } = useTranslation();
  useImperativeHandle(ref, () => ({
    open,
  }));
  const open = () => {
    setVisable(true);
  };
  const chooseItem = (item: any) => {
    onSelect(item);
    setVisable(false);
  };
  return (
    <>
      {visable && (
        <div className={style.root}>
          <div className="select-wrap">
            <div className="mask"></div>
            <div className="select-list_content">
              <div className="select-list  ">
                {configList.map((item: any, index: any) => {
                  return (
                    <div
                      className="select-item"
                      key={index}
                      onClick={() => {
                        chooseItem(item);
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </div>
              <div
                className="select-cancel select-item"
                onClick={() => {
                  setVisable(false);
                }}
              >
                {t("common.cancel")}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Select;
