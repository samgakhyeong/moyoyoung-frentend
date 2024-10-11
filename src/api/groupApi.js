// 생성자 : Haein
import axiosInstance from "../axiosInstance";
import { API_SERVER_HOST } from "./mainApi";

const prefix = `${API_SERVER_HOST}/api/group`;

// 소모임 생성하기(파일첨부)
export const groupRegister = async (groupInfo) => {
  try {
    const res = await axiosInstance.post(`${prefix}/register`, groupInfo);
    return res.data;
  } catch {
    return null;
  }
};

// 소모임 데이터 가져오기
export const getGroupDetails = async (groupId) => {
  try {
    const res = await axiosInstance.get(`${prefix}/detail/${groupId}`);
    return res.data;
  } catch {
    return null;
  }
};

// 로그인한 유저의 그룹가입상태 가져오기
export const getGroupUserState = async (groupId) => {
  try {
    const res = await axiosInstance.get(`${prefix}/state/${groupId}`);
    return res.data;
  } catch {
    return null;
  }
};
