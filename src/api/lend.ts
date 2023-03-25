import axios from "@/utils/axios";
export const submitMaterial = () => {
  return axios.post("/api/user/loan/submitMaterial");
};
export const getProgressList = () => {
  return axios.post("/api/user/loan/getProgressList");
};
export const getProductList = () => {
  return axios.post("/api/user/loan/getProductList");
};
export const applyLoan = () => {
  return axios.post("/api/user/loan/applyLoan");
};
export const applyRepay = () => {
  return axios.post("/api/user/loan/applyRepay");
};
export const getProductDetail = () => {
  return axios.post("/api/user/loan/getProductDetail");
};
