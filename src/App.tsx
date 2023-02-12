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
import Wallet from "@/components/Wallet";
import i18in from ".././react-i18next-config";

import "./app.scss";
import "./style/handle.scss";
function App() {
  const loginState = useSelector((state: any) => state.loginSlice.value);
  const themes = useSelector((state: any) => state.themeSlice.value);
  console.log("themes=>", themes, loginState);
  window.document.documentElement.setAttribute("data-theme", themes); // 给根节点设置data-theme属性，切换主题色就是修改data-theme的值

  const [language, setLanguage] = useState("en-us");
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

  // const GetRoutes = () => {
  //   const routes = useRoutes([
  //     { path: '/', element: <App /> },
  //     {
  //       path: '/postList',
  //       element: <PostsList />,
  //       children: [
  //         { path: '/postList/:id', element: <div>我是子路由元素</div> },
  //         { path: '*', element: <div>404</div>}
  //       ],
  //     },
  //     { path: '/singlePostPage/:postId', element: <SinglePostPage /> },
  //     { path: '*', element: <div>404</div>}
  //   ])
  //   return routes;
  // }

  return (
    <div className="app-bg">
      {/* <Wallet /> */}
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index path="home" element={<Home />}></Route>
          <Route path="assets" element={<Assets />}></Route>
          <Route path="stock" element={<Stock />}></Route>
          <Route path="quotation" element={<Quotation />}></Route>
          <Route path="contract" element={<Contract />}></Route>
        </Route>

        <Route path="/newCoin" element={<NewCoin />} />
        <Route path="*" element={<Not />} />
      </Routes>
    </div>
  );
  // return GetRoutes
}

export default App;
