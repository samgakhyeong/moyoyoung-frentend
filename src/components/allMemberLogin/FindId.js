import React, { useState, useRef } from "react";
import { toast } from 'react-toastify';
import axiosInstance from '../../axiosInstance';
import Header from "../common/Header";
import Footer from "../common/Footer";
import turnLeft from "../imgs/turn-left.png";
import { Link } from "react-router-dom";

export default function FindId() {
  
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const nameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phoneNumber) {
      toast.error("이름과 휴대폰번호를 입력해 주세요.");
      return;
    }

    try {
      const response = await axiosInstance.get("http://localhost:8080/users/check/findId", {
        params: {
          name: name,
          phoneNumber: phoneNumber,
        },
      });

      if (response.status === 200) {
        if (response.data.success && response.data.data.username) {
            setResult(response.data.data.username)
            setError(null);
            setName("");
            setPhoneNumber("");
            return;
        } else {
          toast.error(`서버 응답 오류: ${response.statusText} (${response.status})`);
          console.error("서버 오류:", response);
          return;
        }
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setResult(null);
          setError(true);
          setPhoneNumber("");
          return;
        } else {
          toast.error(err.response.data.errorMessage || "서버 오류가 발생했습니다.");
        }
      } else if (err.request) {
        toast.error("서버와의 연결에 실패했습니다.");
      } else {
        toast.error(`요청 설정 오류: ${err.message}`);
      }
    }
  };
  
  
  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-full shadow-md max-w-lg mt-20 ml-10 mb-20">

    <div className="flex justify-between items-center w-full">
    <Link to="/allMemberLogin/Login">
      <img src={turnLeft} alt="로고" className="mb-8 w-20 h-20 p-4" /> {/* 이미지 추가 */}
    </Link>
          <div className="flex-grow flex justify-center mr-20">
            <h1 className="mb-8 font-bold text-4xl ">아이디 찾기</h1>
          </div>
    </div>

          <p className="mb-8 font-bold">
            이름
            <div className="mt-2">
              <input
                id="idInputs"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                ref={nameRef}
                className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
              />
            </div>
          </p>

          <p className="mb-8 font-bold">
            휴대폰 번호
            <div className="mt-2">
              <input
                id="idInputs"
                name="phoneNumber"
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                ref={phoneNumberRef}
                className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
              />
            </div>
          </p>

          <p ref={phoneNumberRef} className="mb-8 font-bold text-red-600">
            {result && ("당신의 ID는 " + result + " 입니다.")}
            {error && "아이디를 찾을 수 없습니다."}
          </p>

          <button className="py-2 mt-[-40px] mb-5 rounded-md bg-green-300 hover:bg-emerald-400 hover:text-white transition duration-500 px-3 text-sm font-semibold leading-6 text-black">
            아이디 찾기
          </button>
        </div>
      </div>
      </form>
      <Footer />
    </div>
  );
}
