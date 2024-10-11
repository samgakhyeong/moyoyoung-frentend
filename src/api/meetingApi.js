// 생성자 : Haein

import axiosInstance from "../axiosInstance";
import { API_SERVER_HOST } from "./mainApi";

const prefix = `${API_SERVER_HOST}/api/meeting`;

// 정기모임 생성하기
export const meetingRegister = async (meeting) => {
  try {
    const res = await axiosInstance.post(`${prefix}/register`, meeting, {
      headers: {
        "Content-Type": "application/json", // JSON 데이터 전송을 위한 헤더 설정
      },
    });
    return res.data;
  } catch {
    return null;
  }
};

// 소모임의 정기모임 게시물 리스트 가져오기
export const getMeeting = async (id) => {
  try {
    const res = await axiosInstance.get(`${prefix}/${id}`);
    return res.data;
  } catch {
    return null;
  }
};
