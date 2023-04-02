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

export const getTradeTodayIncomeRate = () => {
  return axios.post("/api/user/assetBalance/getTradeTodayIncomeRate");
};
export const getWalletAssetBalance = () => {
  return axios.post("/api/user/assetBalance/getWalletAssetBalance");
};
