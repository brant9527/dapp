import axios from "@/utils/axios";
export const getNoticeList = () => {
  return axios.post("/api/common/getNoticeList");
};
export const searchPair = (data: any) => {
  return axios.post("/api/common/searchPair", data);
};
