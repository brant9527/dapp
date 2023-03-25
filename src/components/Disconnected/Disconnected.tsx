import { memo } from "react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import type { ProviderStringType } from "../../utils/types";
import coinbase from "@/assets/coinbase.svg";
import metamask from "@/assets/metamask.svg";
import wallet from "@/assets/wallet.svg";
import trust from "@/assets/trust.svg";
import style from "./index.module.scss";
type DisconnectedProps = {
  handleConnect: (selectedProvider: ProviderStringType) => Promise<void>;
};

export const Disconnected = memo(({ handleConnect }: DisconnectedProps) => {
  return (
    <div className={style.root}>
      <p className="connect-wallet_tip">Connect your wallet</p>
      <ConnectWalletButton
        providerString="trust"
        handleConnect={handleConnect}
        text="Trust wallet"
        src={trust}
      />
      <ConnectWalletButton
        providerString="coinbase"
        handleConnect={handleConnect}
        text="Coinbase Wallet"
        src={coinbase}
      />
      <ConnectWalletButton
        providerString="metamask"
        handleConnect={handleConnect}
        text="MetaMask"
        src={metamask}
      />
      <ConnectWalletButton
        providerString="walletconnect"
        handleConnect={handleConnect}
        text="WalletConnect"
        src={wallet}
      />
    </div>
  );
});
