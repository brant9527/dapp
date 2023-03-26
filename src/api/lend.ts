import axios from "@/utils/axios";
export const submitMaterial = (data:any) => {
  return axios.post("/api/user/loan/submitMaterial",data);
};
export const getProgressList = () => {
  return axios.post("/api/user/loan/getProgressList");
};
export const getProductList = () => {
  return axios.post("/api/user/loan/getProductList");
};
export const applyLoan = (data: any) => {
  return axios.post("/api/user/loan/applyLoan", data);
};
export const applyRepay = () => {
  return axios.post("/api/user/loan/applyRepay");
};
export const getProductDetail = () => {
  return axios.post("/api/user/loan/getProductDetail");
};
