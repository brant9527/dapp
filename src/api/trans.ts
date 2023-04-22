import axios from "@/utils/axios";
export const getTradeAssetBalance = () => {
  return axios.post("/api/user/assetBalance/getTradeAssetBalance");
};
export const getSpotAssetBalance = () => {
  return axios.post("/api/user/assetBalance/getSpotAssetBalance");
};
export const getFundsAssetBalance = () => {
  return axios.post("/api/user/assetBalance/getFundsAssetBalance");
};
export const assetShift = (data: any) => {
  return axios.post("/api/user/assetBalance/assetShift", data);
};
export const getTotalAssetBalance = () => {
  return axios.post("/api/user/assetBalance/getTotalAssetBalance");
};

export const getTradeIncomeRate = () => {
  return axios.post("/api/user/assetBalance/getTradeIncomeRate");
};
export const getWalletAssetBalance = () => {
  return axios.post("/api/user/assetBalance/getWalletAssetBalance");
};
export const getRechargeRecordPage = (data: any) => {
  return axios.post("/api/user/assetBalance/getRechargeRecordPage", data);
};
export const getRechargeRecordDetail = (data: any) => {
  return axios.post("/api/user/assetBalance/getRechargeRecordDetail", data);
};
export const getWithdrawRecordPage = (data: any) => {
  return axios.post("/api/user/withdraw/getWithdrawRecordPage", data);
};
export const getWithdrawRecordDetail = (data: any) => {
  return axios.post("/api/user/withdraw/getWithdrawRecordDetail", data);
};
