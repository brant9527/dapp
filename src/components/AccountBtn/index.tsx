import React, { useState } from "react";

import style from "./index.module.scss";
import { useTranslation } from "react-i18next";

function AccountBtn(props: any) {
  const { account, handleLoginOut, handleConnectWallet } = props;
  const [showBtn, setShowBtn] = useState<boolean>(false);
  const { t } = useTranslation();
  const handleConnectWalletFunc = () => {
    handleConnectWallet();
    setShowBtn(false);
  };
  return (
    <div className={style.root}>
      {account ? (
        <div className="assets-tab">
          <div
            className="assets-tab-item blue"
            onClick={() => {
              setShowBtn(!showBtn);
              setTimeout(() => {
                setShowBtn(false);
              }, 3000);
            }}
          >{`${account?.slice(0, 5)}...${account?.slice(-5)}`}</div>
          {showBtn && (
            <div className="login-out-wrap">
              <div className="items-cls" onClick={() => handleLoginOut()}>
                {t("home.quit")}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="assets-tab">
          <div
            className="assets-tab-item blue"
            onClick={() => handleConnectWalletFunc()}
          >
            {t("home.connect")}
          </div>
        </div>
      )}
    </div>
  );
}
export default AccountBtn;
