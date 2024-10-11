import React, { useState, useRef } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import axiosInstance from '../../axiosInstance';
import "react-toastify/dist/ReactToastify.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import turnLeft from "../imgs/turn-left.png";

export default function LoginJoin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameChecked, setNameChecked] = useState(false);

  const usernameRef = useRef(null);
  const nicknameRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordCheckRef = useRef(null);
  const nameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!/^[a-zA-Z0-9]{4,}[_]*$/.test(username)) {
      toast.error("아이디는 최소 4자 이상, 영문자와 숫자, 밑줄만 포함할 수 있습니다.");
      setUsername("");
      usernameRef.current.focus();
      return;
    }

    if (nickname.length < 2 || nickname.length > 9) {
      toast.error("닉네임은 2자 이상 9자 이하로 입력해야 합니다.");
      setNickname("");
      nicknameRef.current.focus();
      return;
    }

    if (password.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.");
      setPassword("");
      passwordRef.current.focus();
      return;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      toast.error("비밀번호는 대문자, 소문자 및 특수문자를 포함해야 합니다.");
      setPassword("");
      passwordRef.current.focus();
      return;
    }

    if (password !== passwordCheck) {
      toast.error("비밀번호가 일치하지 않습니다.");
      setPasswordCheck("");
      passwordCheckRef.current.focus();
      return;
    }

    if (!nameChecked) {
      toast.error("본인 인증을 해주세요.");
      return;
    }
    try {
      const usernameResponse = await axiosInstance.get('http://localhost:8080/users/check/username', {
        params: { username }
      });

      if (usernameResponse.status === 200) {
        if (usernameResponse.data.success && !usernameResponse.data.data) {
          toast.error("사용중인 아이디입니다.");
          setUsername("");
          usernameRef.current.focus();
          return;
        }
      } else {
        toast.error(`ID 체크 실패: ${usernameResponse.statusText}`);
        return;
      }

      const nicknameResponse = await axiosInstance.get('http://localhost:8080/users/check/nickname', {
        params: { nickname }
      });

      if (nicknameResponse.status === 200) {
        if (nicknameResponse.data.success && !nicknameResponse.data.data) {
          toast.error("사용중인 닉네임입니다.");
          setNickname("");
          nicknameRef.current.focus();
          return;
        }
      } else {
        toast.error(`닉네임 체크 실패: ${nicknameResponse.statusText}`);
        return;
      }

      const phoneNumberResponse = await axiosInstance.get('http://localhost:8080/users/check/phoneNumber', {
        params: { phoneNumber }
      });

      if (phoneNumberResponse.status === 200) {
        if (phoneNumberResponse.data.success && !phoneNumberResponse.data.data) {
          toast.error("사용중인 휴대폰 번호입니다.");
          setPhoneNumber("");
          phoneNumberRef.current.focus();
          return;
        }
      } else {
        toast.error(`휴대폰 번호 체크 실패: ${phoneNumberResponse.statusText}`);
        return;
      }

      const userData = {
        username,
        nickname,
        password,
        name,
        phoneNumber,
      };

      const createResponse = await axiosInstance.post('http://localhost:8080/users/create', userData);

      if (createResponse.status === 201) {
        toast.success("성공적으로 생성되었습니다!");
        navigate('/allMemberLogin');
        console.log("사용자 생성 성공:", createResponse.data);
      } else {
        toast.error(`사용자 생성 실패: ${createResponse.statusText}`);
      }

    } catch (error) {
      if (error.response) {
        console.error("서버 오류:", error.response.data);
        toast.error(`서버 오류: ${error.response.data.errorMessage || "알 수 없는 오류 발생"}`);
      } else if (error.request) {
        console.error("요청 오류:", error.request);
        toast.error("서버에 요청을 보내는 도중 오류가 발생했습니다.");
      } else {
        console.error("설정 오류:", error.message);
        toast.error(`오류 발생: ${error.message}`);
      }
      return;
    }
  };

  const handleNameChecked = async (e) => {
    e.preventDefault();

    if (name.length < 2 || !/^[가-힣]+$/.test(name)) {
      toast.error("이름은 최소 2자 이상이며 한글만 포함해야 합니다.");
      setName("");
      return;
    }

    if (!/^\d{10,11}$/.test(phoneNumber)) {
      toast.error("휴대폰 번호는 10자리 또는 11자리의 숫자로 입력해야 합니다.");
      setPhoneNumber("");
      return;
    }

    if (!username || !nickname || !password || !name || !phoneNumber) {
      toast.error("필수 필드를 모두 입력해 주세요.");
      return;
    }

    try {
      const phoneNumberResponse = await axiosInstance.get('http://localhost:8080/users/check/phoneNumber', {
        params: { phoneNumber }
      });

      if (phoneNumberResponse.status === 200) {
        if (phoneNumberResponse.data.success && !phoneNumberResponse.data.data) {
          toast.error("사용중인 휴대폰 번호입니다.");
          setPhoneNumber("");
          phoneNumberRef.current.focus();
          return;
        } else if (phoneNumberResponse.data.success && phoneNumberResponse.data.data) {
          toast.success("본인 인증 완료");
          setNameChecked(true);
        } else {
          toast.error("서버 오류: 본인 인증에 실패했습니다.");
          console.error("서버 응답 오류:", phoneNumberResponse.data);
          return;
        }
      } else {
        toast.error(`서버 응답 오류: ${phoneNumberResponse.statusText} (${phoneNumberResponse.status})`);
        console.error("서버 오류:", phoneNumberResponse);
        return;
      }
    } catch (error) {
      if (error.response) {
        console.error("서버 응답 오류:", error.response.data);
        toast.error(`서버 오류: ${error.response.data.errorMessage || "알 수 없는 오류 발생"}`);
      }
      else if (error.request) {
        console.error("네트워크 오류:", error.request);
        toast.error("서버에 요청을 보내는 도중 네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.");
      }
      else {
        console.error("설정 오류:", error.message);
        toast.error(`요청 설정 오류: ${error.message}`);
      }
      return;
    }
  }

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center justify-center w-full shadow-md max-w-lg mt-20 ml-10 mb-20">
          <div className="flex justify-between items-center w-full">
          <Link to="/allMemberLogin/Login">
          <img src={turnLeft} alt="로고" className="mb-2 w-20 h-20 p-4" /> {/* 이미지 추가 */}
        </Link>
          <div className="flex-grow flex justify-center mr-20">
            <h1 className="mb-2 font-bold text-4xl">회원 가입</h1>
            </div>
            </div>
            <p className="mb-8 font-bold">아이디 입력
              <div className="mt-2">
                <input
                  id="idInputs"
                  name="memberInput"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  ref={usernameRef}
                  className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
                />
              </div>
            </p>


            <p className="mb-8 font-bold">닉네임 입력
              <div className="mt-2">
                <input
                  id="nickNames"
                  name="nickInput"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  ref={nicknameRef}
                  className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
                />
              </div>
            </p>


            <p className="mb-8 font-bold">비밀번호 입력
              <div className="mt-2">
                <input
                  id="passWords"
                  name="passInput"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  ref={passwordRef}
                  className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
                />
              </div>
            </p>

            <p className="mb-8 font-bold">비밀번호 입력 확인
              <div className="mt-2">
                <input
                  id="passWordChecks"
                  name="passInputCheck"
                  type="password"
                  value={passwordCheck}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  required
                  ref={passwordCheckRef}
                  className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
                />
              </div>
            </p>

            <p className="mb-8 font-bold">이름 입력
              <div className="mt-2">
                <input
                  id="nameInputs"
                  name="nameInputCheck"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameChecked(false); }}
                  required
                  ref={nameRef}
                  disabled={nameChecked}
                  className="rounded-md py-2 px-2 mr-10 w-full ml-0 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
                />
              </div>
            </p>

            <div className="flex items-center ml-28 mb-6">
              <p className="ml-2 font-bold">휴대폰 입력
                <div className="mt-2">
                  <input
                    id="telInputs"
                    name="telInputCheck"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value); setNameChecked(false); }}
                    required
                    disabled={nameChecked}
                    ref={phoneNumberRef}
                    className="rounded-md py-2 px-2 mr-10 w-full  text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-200"
                  />
                </div>
              </p>

              <button onClick={(e) => handleNameChecked(e)} disabled={nameChecked} className={`${nameChecked ? 'cursor-not-allowed bg-gray-300' : ' bg-green-300 hover:bg-emerald-400 hover:text-white transition duration-500'} flex py-2 mt-8 ml-2 justify-center rounded-md px-3 text-sm font-semibold leading-6 text-black`}>본인 인증하기</button>
            </div>
            <button className="py-2 mb-5 rounded-md bg-green-300 hover:bg-emerald-400 hover:text-white transition duration-500 px-3 text-sm font-semibold leading-6 text-black">회원가입 하기</button>
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
}
