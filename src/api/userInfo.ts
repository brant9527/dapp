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
