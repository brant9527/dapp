import axios from "@/utils/axios";
export const getUserInfo = () => {
  return axios.post("/api/user/base/getUserInfo");
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
