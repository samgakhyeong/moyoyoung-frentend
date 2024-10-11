import React, { useState, useEffect } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Link, useLocation, useParams } from "react-router-dom";
import { usePostContext } from "./PostContext";

export default function BoardMain() {
  const { posts } = usePostContext(); // posts를 가져옴
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const location = useLocation(); // 현재 경로의 정보를 가져옴
  const { page } = useParams(); // page 변수를 가져옴

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pageParam = queryParams.get("page"); // 쿼리 파라미터에서 페이지 번호를 가져옴
    if (pageParam) {
      setCurrentPage(Number(pageParam)); // 상태 업데이트
    } else if (page) {
      setCurrentPage(Number(page)); // URL 파라미터에서 페이지 번호가 있으면 상태 업데이트
    }
  }, [location.search, page]);

  // 현재 페이지의 게시글 가져오기
  const currentPosts = posts[currentPage] || [];

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // 페이지 상태 변경
  };

  return (
    <div>
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="w-full max-w-screen-lg mx-auto">
          {/* 게시글 버튼영역 */}
          <div className="flex flex-row-reverse w-full pt-8">
            <button className="w-1/4 p-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-colors duration-500 cursor-pointer">
              <Link
                to={`/allBoard/BoardInput?page=${currentPage}`}
                className="inline-block w-full h-full"
              >
                게시글 작성
              </Link>
            </button>
          </div>

          <div className="w-full my-10 shadow-md bg-white">
            <div className="w-full px-3 py-5">
              <div className="w-full pb-2 mb-5 text-2xl border-b-2 border-gray-200">
                <h1>게시글 리스트</h1>
              </div>

              <div className="w-full">
                <table className="w-full table-fixed">
                  <tr className="w-full h-12 bg-gray-100">
                    <th className="w-1/12">글번호</th>
                    <th className="w-7/12">제목</th>
                    <th className="w-1/12">첨부파일</th>
                    <th className="w-3/12">작성일</th>
                  </tr>
                  {currentPosts.length === 0 ? (
                    <tr>
                      <td className="h-14 border-b text-center" colSpan={4}>
                        작성된 게시글이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    currentPosts.map((post, index) => (
                      <tr key={post.id} className="h-14 border-b">
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <Link
                            to={`/allBoard/BoardDetail/${currentPage}/${post.id}`} // 현재 페이지 번호와 게시글 ID 전달
                            className="w-full"
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="text-center">
                          {post.fileUrl ? <div>O</div> : <div>X</div>}
                        </td>
                        <td className="text-center">
                          {new Date(post.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </table>
              </div>
            </div>
          </div>

          {/* 페이징시작 */}
          <div className="flex justify-center items-center">
            <div className="flex space-x-2">
              {/* 페이지 번호 버튼 1~5 고정 */}
              {[...Array(5).keys()].map((pageNum) => (
                <button
                  key={pageNum + 1}
                  onClick={() => handlePageChange(pageNum + 1)} // 페이지 상태 변경
                  className={`bg-gray-50 text-gray-800 border rounded hover:text-emerald-500 transition duration-300 px-4 py-2  mb-6   ${
                    currentPage === pageNum + 1 ? "bg-emerald-300" : ""
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
