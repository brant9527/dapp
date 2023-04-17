import axios from "@/utils/axios";
export const getUserInfo = () => {
  return axios.post("/api/user/base/getUserInfo");
};
export const onUpload = (data: any) => {
  return axios.post("/api/file/upload", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getHighGradeCertified = (data: any) => {
  return axios.post("/api/user/base/highGradeCertified", data);
};
export const getJuniorCertified = (data: any) => {
  return axios.post("/api/user/base/juniorCertified", data);
};
export const getRechargeAddress = () => {
  return axios.post("/api/user/recharge/getRechargeAddress");
};
export const rechargeApply = (data:any) => {
  return axios.post("/api/user/recharge/apply",data);
};


export const authentication = (data: any) => {
  return axios.post("/api/user/base/authentication", data);
};
export const collectAdd = (data: any) => {
  return axios.post("/api/user/collect/add", data);
};
export const collectDelete = (data: any) => {
  return axios.post("/api/user/collect/delete", data);
};
export const getCollectList = (data: any) => {
  return axios.post("/api/user/collect/getCollectList", data);
};
export const getCollectStatus = (data: any) => {
  return axios.post("/api/user/collect/getCollectStatus", data);
};
export const bindEmail = (data: any) => {
  return axios.post("/api/user/base/bindEmail", data);
};

