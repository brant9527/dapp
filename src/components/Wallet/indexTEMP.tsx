import logo from "../../assets/logo.png";
import connectedLogo from "../../assets/logo_connected.png";
import { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "../../hooks/useWeb3/useWeb3";
import { Disconnected } from "../../components/Disconnected/Disconnected";
import { Connected } from "../../components/Connected/Connected";
import type { ProviderStringType } from "../../utils/types";
import "./index.scss";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import i18in from "../../../react-i18next-config";
import { useTranslation } from "react-i18next";
import "../../style/handle.scss";
function App() {
  const { connectProvider, changeProvider, providerString, account, web3 } =
    useWeb3();
  // Controls the UI loading state which shows/hides the contents of the app
  // We will attempt to connect the user if the provider is set in localStorage
  // Otherwise, we initialize it to false
  const [loading, setLoading] = useState(!!providerString);
  // If there is web3 state, we assume the user is connected
  const connected = !!account && !!web3;

  // When the user opens your dapp after they have been connected previously
  // we use this effect in harmony with the auto-reconnect functionality
  // to put the user back into a connected state. The app will start in a
  // loading state, then once auto-reconnected, will remove the loading state
  // and drop them into the Connected UI
  useEffect(() => {
    if (connected && loading) setLoading(false);
  }, [connected, loading]);
  const handleConnectProvider = useCallback(
    async (provider: ProviderStringType) => {
      // Set the UI state to loading to prevent further interaction
      setLoading(true);
      // attempt to connect provider via web3Hook
      await connectProvider(provider).finally(() => {
        // Remove the UI loading state
        // show connected UI state on success
        // show disconnected out UI state on failure
        setLoading(false);
      });
    },
    [connectProvider]
  );

  const handleChangeProvider = useCallback(() => {
    // Set the UI state to loading to prevent further interaction
    setLoading(true);
    // attempt to connect via web3Hook
    changeProvider();
    // Remove the UI loading state
    // show disconnected UI state on failure
    setLoading(false);
  }, [changeProvider]);
  const [language, setLanguage] = useState("en-us");

  const OnChageLg = useCallback(() => {
    if (language === "zh-HK") {
      setLanguage("en-us");
    } else {
      setLanguage("zh-HK");
    }
    console.log(language);
    i18in.changeLanguage(language);
  }, [language]);
  const [themes, setThemes] = useState("light");

  const onChangeTheme = useCallback(() => {
    if (themes === "light") {
      setThemes("dark");
    } else {
      setThemes("light");
    }
    window.document.documentElement.setAttribute("data-theme", themes); // 给根节点设置data-theme属性，切换主题色就是修改data-theme的值
  }, [themes]);
  const { t } = useTranslation();
  return (
    <div className="App">
      <h1 onClick={OnChageLg}>测试</h1>
      <div>中文</div>
      <div className="title">{t("home.title")}</div>
      <div className="change-btn" onClick={onChangeTheme}>主题更改</div>
      <img src={connected ? connectedLogo : logo} className="App-logo" />
      {loading ? (
        <p>loading...</p>
      ) : (
        <div>
          {!connected && <Disconnected handleConnect={handleConnectProvider} />}
          {connected && (
            <Connected
              web3={web3}
              account={account}
              providerString={providerString}
              handleChangeProvider={handleChangeProvider}
            />
          )}
        </div>
      )}
      <Link to="/404" className="">
        404页面路由
      </Link>
      <Link to="/newCoin" className="">
        新币
      </Link>
    </div>
  );
}

export default App;
