import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
  Suspense,
  lazy,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Route,
  Routes,
  NavLink,
  useRoutes,
  useNavigate,
  Router,
  redirect,
} from "react-router-dom";
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
import MyAddress from "./views/myAddress";
import AssetsTrans from "./views/assetsTrans";
import TransRecord from "./views/transRecord";
import TradeRecord from "./views/tradeRecord";
import Message from "./views/message";
import BindEmail from "./views/bindEmail";
import MessageDetail from "./views/messageDetail";
import Notice from "./views/notice";
import NoticeDetail from "./views/noticeDetail";
import Invite from "./views/invite";

import Ai from "./views/ai";
import User from "./views/user";
import Auth from "./views/auth";
import Identity from "./views/identity";
import Lend from "./views/lend";
import LendList from "./views/lendList";
import AiApply from "./views/aiApply";
import LendAuth from "./views/lendAuth";
import Withdrawal from "./views/withdrawal";
import WithdrawlDetail from "./views/withdrawlDetail";

import Search from "./views/search";
import KLine from "./views/kLine";
import LendOrderList from "./views/lendOrderList";
import AiOrderList from "./views/aiOrderList";
import Question from "./views/question";
import CreditCore from "./views/creditCore";
import DrawalAndRecharge from "./views/drawalAndRecharge";
import Help from "./views/help";
import HelpNext from "./views/helpNext";
import HelpDetail from "./views/helpDetail";


import UsNext from "./views/usNext";
import MockTrade from "./views/mockTrade";
import ConfirmMsg from "./components/ConfirmMsg";

import Wallet from "@/components/Wallet/index";
import i18in from ".././react-i18next-config";

import { useWeb3 } from "@/hooks/useWeb3/useWeb3";

import "./app.scss";

function App() {
  const loginState = useSelector((state: any) => state.loginSlice.value);
  const themes = window.localStorage.getItem("themes") || "light";
  // const { connectProvider, changeProvider, providerString, account, web3 } =
  //   useWeb3();
  window.document.documentElement.setAttribute("data-theme", themes); // 给根节点设置data-theme属性，切换主题色就是修改data-theme的值
  const nav = useNavigate();

  return (
    <div className="app-bg">
      {/* <Wallet open={noAccount}/> */}
      <ConfirmMsg></ConfirmMsg>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route path="/" element={<Home />}></Route>
          <Route path="/assets" element={<Assets />}></Route>
          <Route path="/stock" element={<Stock />}></Route>
          <Route path="/quotation" element={<Quotation />}></Route>
          <Route path="/contract" element={<Contract />}></Route>
        </Route>
        <Route path="/mockTrade" element={<MockTrade />} />

        <Route path="/language" element={<Language />}></Route>
        <Route path="/myAddress" element={<MyAddress />}></Route>
        <Route path="/assetsTrans" element={<AssetsTrans />}></Route>
        <Route path="/newCoin" element={<NewCoin />} />
        <Route path="/transRecord" element={<TransRecord />} />
        <Route path="/tradeRecord" element={<TradeRecord />} />

        <Route path="/message" element={<Message />} />

        <Route path="/bindEmail" element={<BindEmail />} />

        <Route path="/ai" element={<Ai />} />
        <Route path="/user" element={<User />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/lend" element={<Lend />} />
        <Route path="/lendList" element={<LendList />} />
        <Route path="/aiApply" element={<AiApply />} />
        <Route path="/lendAuth" element={<LendAuth />} />
        <Route path="/lendOrderList" element={<LendOrderList />} />

        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/search" element={<Search />} />
        <Route path="/kLine" element={<KLine />} />
        <Route path="/messageDetail" element={<MessageDetail />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/noticeDetail" element={<NoticeDetail />} />
        <Route path="/invite" element={<Invite />} />
        <Route path="/aiOrderList" element={<AiOrderList />} />
        <Route path="/question" element={<Question />} />
        <Route path="/creditCore" element={<CreditCore />} />
        <Route path="/drawalAndRecharge" element={<DrawalAndRecharge />} />
        <Route path="/help" element={<Help />} />
        <Route path="/helpNext" element={<HelpNext />} />
        <Route path="/helpDetail" element={<HelpDetail />} />
        <Route path="/usNext" element={<UsNext />} />
        <Route path="/withdrawlDetail" element={<WithdrawlDetail />} />

        <Route path="*" element={<Not />} />
      </Routes>
    </div>
  );
  // return GetRoutes
}

export default App;
