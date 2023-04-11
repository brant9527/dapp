import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import Back from "@/components/Back";
import Confirm from "@/components/Confirm";

import questionList from "./questionLg/tw.json";
import RadioGroup from "./components/RadioGroup";
import { questionAnswer } from "@/api/common";
import Toast from "@/components/Toast";
function Ques() {
  const { t } = useTranslation();

  const nav = useNavigate();
  const confirmRef = useRef<any>(null);
  const [ansList, setAnsList] = useState<any>([]);

  const onChange = useCallback(
    (val: any, idx: any) => {
      ansList[idx] = val;
      setAnsList(ansList);
      console.log(ansList);
    },
    [ansList]
  );
  function title() {
    return <div className="nav-title">{t("question.title")}</div>;
  }
  let key: keyof any;

  const submit = async () => {
    let isError;
    const dataList = ansList.map((item: any) => {
      if (!item) {
        return (isError = true);
      }
      if (typeof item === "string" && item) {
        const str = item.split("").reverse()[0];

        return String.fromCharCode(parseInt(str) + 97);
      } else {
        const rList = [];

        for (key in item) {
          const val = item[key];
          if (val) {
            const cstr = key.split("").reverse()[0];
            rList.push(String.fromCharCode(parseInt(cstr) + 97));
          }
        }

        return rList.join(",") || null;
      }
    });
    if (dataList.length != 14 || JSON.stringify(dataList[13]) === "{}") {
      return Toast.notice(t("question.error"), {});
    }
    const { data, code } = await questionAnswer({
      answers: dataList.join("|"),
      count: questionList.qList.length,
    });
    if (code === 0) {
      nav("/");
    }
  };
  return (
    <div className={style.root}>
      <div className="question-wrap">
        <Back content={title()}></Back>
        <div className="question-content">
          <div className="tip">{questionList.tip}</div>

          {questionList.qList.map((item: any, idx: any) => {
            return (
              <div key={idx}>
                {/* <div className="question-title">{item.title}</div>
                  <div className="answer-list">
                    {item.ans.map((cItem: any, cIdx: any) => {
                      return (
                        <div key={idx + "" + cIdx}>
                          <input
                            type={item.type ? "checkbox" : "radio"}
                            value={idx + "" + cIdx}
                            name={idx + "" + cIdx}
                            id={idx + "" + cIdx}
                            key={idx + "" + cIdx}
                            onChange={() => {
                              onChange({
                                idx,
                                cIdx,
                              });
                            }}
                            checked={
                              ansList[idx] === idx + "" + cIdx ? true : false
                            }
                            defaultChecked={
                              ansList[idx] === idx + "" + cIdx ? true : false
                            }

                          />
                          <label htmlFor={idx + "" + cIdx}>{cItem}</label>
                        </div>
                      );
                    })}
                  </div> */}
                <div className="question-title">{item.title}</div>
                <RadioGroup
                  options={item.ans}
                  onChange={onChange}
                  index={idx}
                  type={item.type}
                ></RadioGroup>
              </div>
            );
          })}
          <div className="tip">{questionList.tip2}</div>

          <div
            className="btn"
            onClick={() => {
              confirmRef.current.open();
            }}
          >
            {t("common.sure")}
          </div>
          <Confirm onConfirm={submit} ref={confirmRef}>
            <div className="tip">{questionList.tip3}</div>
          </Confirm>
        </div>
      </div>
    </div>
  );
}

export default Ques;
