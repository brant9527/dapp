import axios from "@/utils/axios";
export const getUnReadMessageCnt = () => {
  return axios.post("/api/message/getUnReadMessageCnt");
};
export const getMessagePage = (data:any) => {
  return axios.post("/api/message/getMessagePage",data);
};
export const readMessage = (data: any) => {
  return axios.post("/api/message/readMessage", data);
};

export const getBannerList = () => {
  return axios.post("/api/common/getBannerList");
};
