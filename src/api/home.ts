import axios from "@/utils/axios";
export const getUnReadMessageCnt = () => {
  return axios.post("/api/message/getUnReadMessageCnt");
};
export const getBannerList = () => {
  return axios.post("/api/common/getBannerList");
};
