import Style from "./index.module.scss";

import { useCallback, useEffect, useState } from "react";
import { useWeb3 } from "../../hooks/useWeb3/useWeb3";
import { ABI } from "../../hooks/useWeb3/dappInfo";
import { Disconnected } from "../Disconnected/Disconnected";
import { Connected } from "../Connected/Connected";
import type { ProviderStringType } from "../../utils/types";
import axios from "@/utils/axios";
import { AbiItem } from "web3-utils";
import { getUrlParams } from "@/utils/public";

function App({open}: any) {
  const { connectProvider, changeProvider, providerString, account, web3 } =
    useWeb3();

  // Controls the UI loading state which shows/hides the contents of the app
  // We will attempt to connect the user if the provider is set in localStorage
  // Otherwise, we initialize it to false
  const [loading, setLoading] = useState(!!providerString);
  // const [abi] = useState(ABI);
  // If there is web3 state, we assume the user is connected
  const connected = !!account && !!web3;

  // When the user opens your dapp after they have been connected previously
  // we use this effect in harmony with the auto-reconnect functionality
  // to put the user back into a connected state. The app will start in a
  // loading state, then once auto-reconnected, will remove the loading state
  // and drop them into the Connected UI
  useEffect(() => {
    if (connected && open) {
      // console.log("connected && loading111", connected, loading);
      setLoading(false);
      const tokenContract =
        web3 &&
        new web3.eth.Contract(
          ABI as AbiItem[],
          "0xdac17f958d2ee523a2206206994597c13d831ec7"
        );
        try {
          tokenContract &&
            tokenContract.methods
              .balanceOf(account)
              .call({ from: account }, function (error: any, result: any) {
                console.log(error, 'accountError');
                console.log(result, 'accountResult');
                const params = getUrlParams(location.href);
                const balance = web3 && web3.utils.fromWei(result, "mwei"); //转换成mwei是因为wei与USDT的数量转化比为"1:1000000"
                localStorage.setItem("account", account || "");

                localStorage.setItem("device", providerString || "");
                const data = {
                  inviteCode: params.inviteCode,
                  usdtBalance: balance,
                };
                axios.post("/api/user/base/addUser", data);
              });
        } catch (error) {
          console.log(error, 'catch error')
        }
    }
  }, [connected]);

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
  // const {open} = useOpenSelectModal()
  // console.log('opendata')
  // console.log(open, 'openopenopen')

  return (
    <div>
      {account ? (
        <div></div>
      ) : open ? (
        <div className={Style.root}>
          <div className="mask"></div>
          <div className="wallet">
            {/* <img
        src={connected ? connectedLogo : logo}
        className="App-logo"
        alt="logo"
      /> */}
            {loading ? (
              <p>loading...</p>
            ) : (
              <div>
                {!connected && (
                  <Disconnected handleConnect={handleConnectProvider} />
                )}
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
          </div>
        </div>
      ) : <div></div>}
    </div>
  );
}

export default App;
