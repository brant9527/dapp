import React, {
  Component,
  useCallback,
  useState,
  Fragment,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as ReactDOMClient from "react-dom/client";
import { Outlet, useNavigate } from "react-router-dom";

import style from "./index.module.scss";
import arrow from "@/assets/xiala.png";

import { useTranslation } from "react-i18next";
import { accAdd, accSub, accMul, accDiv } from "@/utils/public";

const CusInput = forwardRef((props: any, ref: any) => {
  const {
    onInput,
    placeholder,
    isBtn = true,
    defaultVal,
    disable = false,
    alignLeft = false,
    append,
    prepend,
    inputType = "text",
  } = props;
  const [val, setVal] = useState<any>(defaultVal);

  const { t } = useTranslation();
  const nav = useNavigate();
  useEffect(() => {
    // setVal(defaultVal);
  }, []);
  useImperativeHandle(ref, () => {
    return { setVal };
  });
  const addVal = () => {
    setVal(accAdd(val || 0, 1));
    onInput(val);
  };
  const reduceVal = () => {
    setVal(accSub(val || 0, 1));

    onInput(val);
  };
  const inputChange = (e: any) => {
    const valTemp = e.target.value.replace(/^\D*(\d*(?:\.\d{0,9})?).*$/g, '$1')
    setVal(valTemp);
    onInput(valTemp);
  };

  return (
    <div className={style.root}>
      <div className="cus-input">
        {prepend ||
          (isBtn && (
            <div className="reduce" onClick={() => reduceVal()}>
              -
            </div>
          ))}
        <div className={`input ${alignLeft ? " align-left" : ""}`}>
          <input
            ref={ref}
            type={inputType}
            disabled={disable}
            placeholder={placeholder || t("common.input-tip")}
            value={val || defaultVal}
            onChange={(e) => inputChange(e)}
          />
        </div>
        {append ||
          (isBtn && (
            <div className="add" onClick={() => addVal()}>
              +
            </div>
          ))}
      </div>
    </div>
  );
});
export default React.memo(CusInput);
