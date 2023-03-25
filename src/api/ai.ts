import axios from "@/utils/axios";
export const getUserCurrProductAmount = () => {
  return axios.post("/api/user/quant/getUserCurrProductAmount");
};
export const getProgressList = () => {
  return axios.post("/api/user/quant/getProgressList");
};
export const getProductList = () => {
  return axios.post("/api/user/quant/getProductList");
};
export const applyBuy = (data: any) => {
  return axios.post("/api/user/quant/applyBuy", data);
};
