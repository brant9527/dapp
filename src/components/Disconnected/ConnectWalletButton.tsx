import { memo } from "react";
import type { ProviderStringType } from "../../utils/types";
import style from "./index.module.scss";
type ConnectWalletButtonProps = {
  providerString: ProviderStringType;
  handleConnect: (selectedProvider: ProviderStringType) => Promise<void>;
  text: string;
  src: string;
};

export const ConnectWalletButton = memo(
  ({ providerString, handleConnect, text, src }: ConnectWalletButtonProps) => (
    <div className={style.root}>
      <div className="wallet-item">
        <img src={src} />
        <div className="text" onClick={() => handleConnect(providerString)}>
          {text}
        </div>
      </div>
    </div>
  )
);
