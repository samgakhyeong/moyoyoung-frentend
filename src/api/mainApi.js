// 생성자 : Haein
import axiosInstance from "../axiosInstance";

export const API_SERVER_HOST = "http://localhost:8080";
const prefix = `${API_SERVER_HOST}/api/main`;

// 소모임 리스트 데이터 가져오기
export const getGroupList = async () => {
  const res = await axiosInstance.get(`${prefix}/`);
  return res.data;
};

export const getImage = async (id) => {
  // { responseType: "blob" } => 바이너리 데이터를 blob으로 처리
  const res = await axiosInstance.get(`${prefix}/getImage/${id}`, {
    responseType: "blob",
  });
  return res.data;
};
