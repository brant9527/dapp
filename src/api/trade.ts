import axios from "@/utils/axios";
export const getDelegationPage = (data: any) => {
  return axios.post("/api/user/delegation/getDelegationPage", data);
};
export const onTradeBuySell = (data: any) => {
  return axios.post("/api/spot/trade/buy-sell", data);
};
export const onTradeCancel = (data: any) => {
  return axios.post("/api/spot/trade/cancel", data);
};
export const getDealRecordPage = (data: any) => {
  return axios.post("/api/user/dealRecord/getDealRecordPage", data);
};
export const getLastDealRecordList = (data: any) => {
  return axios.post("/api/user/dealRecord/getLastDealRecordList", data);
};
export const getAvailBalance = (data: any) => {
  return axios.post("/api/user/assetBalance/getAvailBalance", data);
};


