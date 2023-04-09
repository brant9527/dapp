import axios from "@/utils/axios";
export const openContractOrder = (data: any) => {
  return axios.post("/api/swap/trade/openOrder", data);
};
export const openDeliverytOrder = (data: any) => {
  return axios.post("/api/delivery/trade/openOrder", data);
};

export const cancelContractOrder = (data: any) => {
  return axios.post("/api/swap/trade/cancel", data);
};
export const oneClickCloseOrder = (data: any) => {
  return axios.post("/api/swap/trade/oneClickCloseOrder", data);
};

export const closeOrder = (data: any) => {
  return axios.post("/api/swap/trade/closeOrder", data);
};
export const setStopProfitOrLoss = (data: any) => {
  return axios.post("/api/swap/trade/setStopProfitOrLoss", data);
};
export const getDeliveryPeriodList = () => {
  return axios.post("/api/delivery/trade/getDeliveryPeriodList");
};
export const getUserPosition = (data: any) => {
  return axios.post("/api/user/position/getUserPosition", data);
};
