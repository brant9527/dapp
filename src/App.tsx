import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
  Suspense,
  lazy,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, NavLink, useRoutes } from "react-router-dom";
// import { routers, Router } from "./router/route";
// import AuthRoute from "./router/AuthRoute";
import NewCoin from "./views/newCoin";
import Index from "./views/index";
import Home from "./views/home";
import Not from "./views/not";
import Assets from "./views/assets";
import Contract from "./views/contract";
import Quotation from "./views/quotation";
import Stock from "./views/stock";
import Language from "./views/language";

import Wallet from "@/components/Wallet/index";
import i18in from ".././react-i18next-config";

import { useWeb3 } from "@/hooks/useWeb3/useWeb3";

import "./app.scss";
import "./style/handle.scss";

function App() {
  const loginState = useSelector((state: any) => state.loginSlice.value);
  const themes = window.localStorage.getItem("themes") || "light";
  const { connectProvider, changeProvider, providerString, account, web3 } =
    useWeb3();
  window.document.documentElement.setAttribute("data-theme", themes); // 给根节点设置data-theme属性，切换主题色就是修改data-theme的值

  const [language, setLanguage] = useState("en-us");
  console.log(language);
  // 語言初始化
  const OnChageLg = useCallback(() => {
    if (language === "zh-HK") {
      setLanguage("en-us");
    } else {
      setLanguage("zh-HK");
    }
    console.log(language);
    i18in.changeLanguage(language);
  }, [language]);
  // 語言初始化
  //  const OnConnect = useCallback(() => {

  // }, []);

  return (
    <div className="app-bg">
      <Wallet />
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index path="home" element={<Home />}></Route>
          <Route path="assets" element={<Assets />}></Route>
          <Route path="stock" element={<Stock />}></Route>
          <Route path="quotation" element={<Quotation />}></Route>
          <Route path="contract" element={<Contract />}></Route>
        </Route>
        <Route path="/language" element={<Language />}></Route>
        <Route path="/newCoin" element={<NewCoin />} />
        <Route path="*" element={<Not />} />
      </Routes>
    </div>
  );
  // return GetRoutes
}

export default App;
