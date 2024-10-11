import React, { useState, useRef } from "react";
import { usePostContext } from "./PostContext";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";


export default function BoardInput() {
    const { addPost } = usePostContext();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');


    // 현재 페이지를 쿼리 파라미터에서 가져오는 방법
    const queryParams = new URLSearchParams(window.location.search);
    const currentPage = queryParams.get('page') || '1';


    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setFileName(files[0].name);
            fileInputRef.current.files = event.target.files; // 파일 정보 저장
        }
    };


    const handleClick = () => {
        fileInputRef.current.click();
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const file = fileInputRef.current.files[0];

        if (!file) {
            alert("첨부할 파일을 선택하세요.");
            return;
        }

        const createdAt = new Date().toISOString();


        // 게시글 추가 시 현재 페이지를 인자로 넘김
        addPost(title, content, file, currentPage,createdAt, navigate);  

    };


    return (
        <div>
          <Header />
          <div className="flex justify-center items-center min-h-screen">
            <div className="w-full max-w-md shadow-md rounded p-8">
              <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="title">
                    제목
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="border border-gray-300 rounded w-full p-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="content">
                    내용
                  </label>
                  <textarea
                    id="content"
                    className="border border-gray-300 rounded w-full p-2"
                    rows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <label onClick={handleClick} className="bg-slate-400 hover:text-white hover:bg-emerald-400 transition duration-500 p-2 rounded cursor-pointer font-bold">
                    파일 첨부
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {fileName && <div className="ml-4 w-[250px] truncate">선택한 파일: {fileName}</div>}
                </div>
                <button
                  type="submit"
                  className="bg-slate-400 text-black font-bold py-2 px-4 rounded hover:text-white hover:bg-emerald-400 transition duration-500"
                >
                  게시글 작성
                </button>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
