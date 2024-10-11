import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link, useLocation, useParams } from "react-router-dom";
import boardApi from '../../api/boardApi';


export default function BoardMain() {
  const [posts, setPosts] = useState([]); // 게시글 데이터 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const location = useLocation(); // 현재 경로의 정보를 가져옴
  const { page } = useParams(); // 페이지 변수를 가져옴


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await boardApi.getByListBoard(currentPage); // getByListBoard 호출
        setPosts(data); // 상태에 저장
      } catch (error) {
        console.error("Error fetching posts:", error); // 에러 로그 출력
      }
    };


    fetchPosts(); // 컴포넌트 마운트 시 데이터 가져오기
  }, [currentPage]); // currentPage가 변경될 때마다 데이터 가져오기


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = queryParams.get("page"); // 쿼리 파라미터에서 페이지 번호 가져오기
    if (pageParam) {
      setCurrentPage(Number(pageParam)); // 상태 업데이트
    } else if (page) {
      setCurrentPage(Number(page)); // URL 파라미터에서 페이지 번호가 있으면 상태 업데이트
    }
  }, [location.search, page]);


  // 현재 페이지의 게시글 가져오기
  const currentPosts = posts || [];


  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // 페이지 상태 변경
  };


  return (
    <div>
      <Header />
      <div className="flex items-center justify-end pr-[15.4rem] pt-6">
        <button className="text-xl font-bold text-slate-500 hover:text-emerald-500 transition duration-500">
          <Link to={`/allBoard/BoardInput?page=${currentPage}`}>
            게시글 작성
          </Link>
        </button>
      </div>


      <div className="flex justify-center items-center h-screen mr-[4.6rem]">
        <div className="flex flex-col items-center justify-center w-[64rem] shadow-md ml-[4.6rem] pr-[50rem] h-[calc(100vh-56px)]">
          <div className="font-bold text-2xl">게시글 리스트</div>


          <div className="h-full overflow-y-auto">
            {currentPosts.length === 0 ? (
              <p>작성된 게시글이 없습니다.</p>
            ) : (
              currentPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="border-b py-4 px-4 m-4 ml-[51rem] bg-gray-400 w-[60rem]"
                >
                  <div className="text-xl text-white mb-2 font-bold">
                    작성일: {new Date(post.createdAt).toLocaleString()}
                  </div>


                  {post.file && (
                    <div className="text-lg mb-2">{post.file.name}</div>
                  )}


                  <Link
                    to={`/allBoard/BoardDetail/${currentPage}/${post.id}`} // 현재 페이지 번호와 게시글 ID 전달
                    className="font-bold text-xl"
                  >
                    {index + 1}번째: {post.title} {/* 번호와 제목 */}
                  </Link>
                  <div className="text-lg">{post.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>


      {/* 페이지 네비게이션 버튼 */}
      <div className="flex justify-center items-center">
        <div className="flex space-x-2">
          {/* 페이지 번호 버튼 1~5 고정 */}
          {[...Array(5).keys()].map((pageNum) => (
            <button
              key={pageNum + 1}
              onClick={() => handlePageChange(pageNum + 1)} // 페이지 상태 변경
              className={`bg-emerald-500 text-black px-4 py-2 rounded mb-6 hover:text-white transition duration-300 ${
                currentPage === pageNum + 1 ? "bg-emerald-600" : ""
              }`}
            >
              {pageNum + 1}
            </button>
          ))}
        </div>
      </div>


      <Footer />
    </div>
  );
}
