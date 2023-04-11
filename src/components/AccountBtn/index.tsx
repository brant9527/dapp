import React, { useState } from "react"

import style from "./index.module.scss"

function AccountBtn(props: any) {
  const { account, handleLoginOut, handleConnectWallet } = props
  const [showBtn, setShowBtn] = useState<boolean>(false)
  const handleConnectWalletFunc = () => {
    handleConnectWallet()
    setShowBtn(false)
  }
  return (
    <div className={style.root}>
      {account ? (
        <div className="assets-tab">
          <div
            className="assets-tab-item blue"
            onClick={() => {
              setShowBtn(!showBtn)
            }}
          >{`${account?.slice(0, 5)}...${account?.slice(-5)}`}</div>
          {showBtn && (
            <div className="login-out-wrap">
              <div className="items-cls" onClick={() => handleLoginOut()}>
                退出
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
            连接
          </div>
        </div>
      )}
    </div>
  )
}
export default AccountBtn
