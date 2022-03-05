import { memo } from "react";
import type { ProviderStringType } from "../../utils/types";

type ConnectWalletButtonProps = {
  providerString: ProviderStringType;
  handleConnect: (selectedProvider: ProviderStringType) => Promise<void>;
  connected: boolean;
  text: string;
};

export const ConnectWalletButton = memo(
  ({
    providerString,
    handleConnect,
    connected,
    text,
  }: ConnectWalletButtonProps) => (
    <button type="button" onClick={() => handleConnect(providerString)}>
      {text} {connected ? "🟢" : "🔴"}
    </button>
  )
);
