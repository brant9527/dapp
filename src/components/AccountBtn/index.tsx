import React, { Component, useCallback, useState, Fragment } from "react"
import * as ReactDOMClient from "react-dom/client"
import { Outlet, useNavigate } from "react-router-dom"

import style from "./index.module.scss"

function AccountBtn(props: any) {
  const { account, handleLoginOut, handleConnectWallet } = props
  const [showBtn, setShowBtn] = useState<boolean>(false)
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
            onClick={() => handleConnectWallet()}
          >
            连接
          </div>
        </div>
      )}
    </div>
  )
}
export default AccountBtn
