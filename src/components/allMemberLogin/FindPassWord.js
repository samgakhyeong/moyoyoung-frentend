import React, { useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import axiosInstance from '../../axiosInstance';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import turnLeft from "../imgs/turn-left.png"

export default function FindPassWord() {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameChecked, setNameChecked] = useState(false);

  const handleVerifyIdentity = async () => {
    try {
      const response = await axiosInstance.post("http://localhost:8080/users/check/resetCheckPassword", {
        username,
        name,
        phoneNumber,
      });

      if (response.status === 200) {
        console.log(response.data.data);
        if (response.data.data) {
          setNameChecked(true);
          toast.success("본인 인증에 성공했습니다.");
        } else {
          setNameChecked(null);
          toast.error("본인 인증에 실패했습니다.");
        }
      } else {
        toast.error("본인 인증에 실패했습니다.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(`서버 오류: ${error.response.data.errorMessage || "알 수 없는 오류 발생"}`);
      } else if (error.request) {
        toast.error("서버에 요청을 보내는 도중 오류가 발생했습니다.");
      } else {
        toast.error(`오류 발생: ${error.message}`);
      }
    }
  };
  const handleResetPassword = async () => {
    if (!nameChecked) {
      toast.error("본인 인증을 먼저 해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    let password = newPassword;
    try {
      const response = await axiosInstance.post("http://localhost:8080/users/check/resetPassword", {
        username,
        name,
        phoneNumber,
        password,
      });

      if (response.status === 200) {
        toast.success("비밀번호가 성공적으로 재설정되었습니다.");
        navigate('/allMemberLogin');
        return;
      } else {
        toast.error("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    } catch (error) {
      if (error.response) {
        toast.error(`서버 오류: ${error.response.data.errorMessage || "알 수 없는 오류 발생"}`);
        return;
      } else if (error.request) {
        toast.error(`비밀번호 재설정 설정 오류: ${error.request}`);
        return;
      } else {
        toast.error(`비밀번호 재설정 설정 오류: ${error.message}`);
        return;
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center w-full shadow-md max-w-lg mt-20 ml-10 mb-20">
        <div className="flex justify-between items-center w-full">
        <Link to="/allMemberLogin/Login">
          <img src={turnLeft} alt="로고" className="mb-8 w-20 h-20 p-4" /> {/* 이미지 추가 */}
        </Link>
          <div className="flex-grow flex justify-center mr-20">
            <h1 className="mb-8 font-bold text-4xl">비밀번호 찾기</h1>
          </div>
          </div>

          <p className="mb-6 font-bold">아이디
            <div className="mt-2">
              <input
                id="idInputs"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={nameChecked}
                className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
              />
            </div>
          </p>

          <p className="mb-6 font-bold">이름
            <div className="mt-2">
              <input
                id="nameInputs"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={nameChecked}
                className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
              />
            </div>
          </p>

          <div className="flex items-center ml-28 mb-6">
            <p className="ml-2 font-bold">휴대폰 번호
              <div className="mt-2">
                <input
                  id="telInputs"
                  name="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={nameChecked}
                  className="rounded-md py-2 px-2 mr-10 w-full text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
                />
              </div>
            </p>
            <button onClick={handleVerifyIdentity} disabled={nameChecked} className={`${nameChecked?"bg-gray-200":"bg-green-300 hover:bg-emerald-400 hover:text-white transition duration-500"} flex py-2 mt-8 ml-2 justify-center rounded-md px-3 text-sm font-semibold leading-6 text-black`}>본인 인증하기</button>
          </div>

          <p className="mb-6 font-bold">비밀번호 재설정 입력
            <div className="mt-2">
              <input
                id="newPasswordInputs"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={!nameChecked}
                className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
              />
            </div>
          </p>

          <p className="mb-6 font-bold">확인 비밀번호 입력
            <div className="mt-2">
              <input
                id="confirmPasswordInputs"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!nameChecked}
                className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
              />
            </div>
          </p>

          <button
            onClick={handleResetPassword}
            disabled={!nameChecked}
            className={`${nameChecked?"bg-green-300 hover:bg-emerald-400 hover:text-white transition duration-500":"bg-gray-200"} py-2 mb-5 rounded-md px-3 text-sm font-semibold leading-6 text-black`}
          >
            비밀번호 재설정
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}