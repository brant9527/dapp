import axios from "@/utils/axios";
export const getNoticeList = () => {
  return axios.post("/api/common/getNoticeList");
};

export const searchPair = (data: any) => {
  return axios.post("/api/common/searchPair", data);
};
export const getArticleList = () => {
  return axios.post("/api/common/getArticleList");
};
export const questionAnswer = (data: any) => {
  return axios.post("/api/user/base/questionAnswer", data);
};
export const getHelpList = (data: any) => {
  return axios.post("/api/common/getHelpList", data);
};

export const withdraw = (data: any) => {
  return axios.post("/api/user/withdraw/apply", data);
};
export const getImageCode = (data?: any) => {
  return axios.post("/api/common/getImageCode");
};
export const getEmailCode = (data: any) => {
  return axios.post("/api/common/getEmailCode", data);
};
export const getBalanceChangeRecordPage = (data: any) => {
  return axios.post("/api/user/assetBalance/getBalanceChangeRecordPage", data);
};
export const getHelpById = (data: any) => {
  return axios.post("/api/common/getHelpById", data);
};
export const getConfig = () => {
  return axios.post("/api/sys/config/getConfig");
};
