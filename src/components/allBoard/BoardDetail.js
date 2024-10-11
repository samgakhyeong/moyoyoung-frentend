import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostContext } from "./PostContext";
import Header from "../common/Header";
import Footer from "../common/Footer";


export default function BoardDetail() {

    const { posts, updateEditedPost } = usePostContext();
    const { page, id } = useParams(); // URL에서 page와 id를 가져옵니다.


    const [post, setPost] = useState(null); // post 상태를 초기화
    const [comments, setComments] = useState([]); // 댓글 상태 초기화
    const [comment, setComment] = useState(''); // 댓글 입력 상태 추가


    // 수정 상태 관리
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');


    // 원본 값 상태 추가
    const [originalTitle, setOriginalTitle] = useState('');
    const [originalContent, setOriginalContent] = useState('');
   
    // useEffect로 posts 상태에서 해당 게시글을 찾고, 존재하지 않으면 초기값 설정
    useEffect(() => {
        if (!posts || !posts[page]) {
            console.error(`No posts found for page ${page}`);
            setPost(null);  // 게시글이 없으면 post를 null로 설정
            return;
        }


        const currentPosts = posts[page] || [];  // 페이지에 해당하는 게시글을 찾음
        const foundPost = currentPosts.find((p) => p.id === parseInt(id));


        if (foundPost) {
            setPost(foundPost);  // 게시글 존재 시 설정
            setComments(foundPost.comments || []);  // 댓글 설정
            setEditedTitle(foundPost.title);  // 제목 설정
            setEditedContent(foundPost.content);  // 내용 설정
            setOriginalTitle(foundPost.title);  // 원본 제목
            setOriginalContent(foundPost.content);  // 원본 내용
        } else {
            console.error(`Post with id ${id} not found.`);
            setPost(null);  // id에 해당하는 게시글이 없으면 post를 null로 설정
        }
    }, [posts, page, id]);


    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;  // 게시글이 없을 경우 처리
    }


    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };


    const handleCommentSubmit = () => {
        if (comment.trim()) {
            if (comment.length > 50) {
                alert("댓글은 50자 이하로 다시 작성해 주세요.");
                setComment('');
                return;
            } else {
                const newComment = {
                    id: new Date().getTime(),
                    text: comment
                };
                setComments((prevComments) => {
                    const updatedComments = [...prevComments, newComment];
                    // 게시글의 댓글도 업데이트
                    const updatedPost = { ...post, comments: updatedComments };
                    updateEditedPost(page, post.id, editedTitle, editedContent, updatedPost); // 댓글을 포함한 게시글 업데이트
                    return updatedComments;
                });
                setComment('');
            }
        } else {
            alert("댓글을 입력하세요.");
        }
    };


    const handleDeleteComment = (id) => {
        const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
        if (isConfirmed) {
            const updatedComments = comments.filter((comment) => comment.id !== id);
            setComments(updatedComments);


            const updatedPost = { ...post, comments: updatedComments };
            updateEditedPost(page, post.id, editedTitle, editedContent, updatedPost);
            alert("댓글이 삭제 되었습니다.");
        }
    };


    const handleEditSubmit = () => {
        if (editedTitle !== originalTitle || editedContent !== originalContent) {
            updateEditedPost(page, post.id, editedTitle, editedContent);
            setOriginalTitle(editedTitle);
            setOriginalContent(editedContent);
            setIsEditing(false);
            alert("수정이 완료되었습니다.");
        } else {
            setIsEditing(false);
            alert("변경된 내용이 없습니다.");
        }
    };


    return (
        <div>
            <Header />
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col justify-center items-center w-full shadow-md max-w-5xl h-[calc(100vh-24px)]">
                    <div>
                        {isEditing ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="border border-gray-300 rounded w-full  p-2 mb-2"
                                />
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="border border-gray-300 rounded w-full p-2 mb-2 resize-none"
                                    rows="4"
                                />
                                <button
                                    onClick={handleEditSubmit}
                                    className="bg-emerald-400 h-12 flex justify-center items-center text-xl font-bold w-[10rem] rounded hover:text-white transition duration-500"
                                >
                                    수정 완료
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="bg-emerald-400 h-20 mt-6 flex justify-center items-center text-xl font-bold w-[60rem] overflow-y-auto">
                                    {post.title}
                                </div>
                                <div className="bg-emerald-400 h-[10rem] mt-6 flex justify-center items-center text-xl font-bold w-[60rem] overflow-auto">
                                    {post.content}
                                </div>
                            </div>
                        )}


                        <div className="bg-emerald-400 h-[10rem] mt-6 flex flex-col justify-start items-start text-xl font-bold w-[60rem] overflow-auto p-4">
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={comment.id} className="mb-2">
                                        <span className="text-md">
                                            익명 {index + 1}: <span className="text-base">{comment.text}</span>
                                        </span>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="ml-4 text-red-500 hover:text-red-700 transition duration-500"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-md">댓글이 없습니다.</div>
                            )}
                        </div>


                        <div className="flex items-center mt-[2rem]">
                            <div
                                onClick={() => setIsEditing(!isEditing)}
                                className="cursor-pointer items-center w-[10rem] rounded hover:text-white transition duration-500 bg-emerald-400 h-12 text-xl font-bold mr-4 flex justify-center"
                            >
                                {isEditing ? "취소" : "수정 하기"}
                            </div>


                            <div className="flex flex-col w-full">
                                <label className="text-xl font-bold mb-2 flex justify-center mr-[8rem]" htmlFor="comment">
                                    댓글 작성
                                </label>
                                <textarea
                                    id="comment"
                                    className="border border-gray-300 rounded w-[33rem] ml-[5.5rem] p-2 resize-none"
                                    rows="4"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    required
                                />
                            </div>
                        </div>


                        <div className="flex flex-row ">
                            <div className="bg-emerald-400 h-12 flex justify-center items-center text-xl font-bold w-[10rem] rounded hover:text-white transition duration-500">
                                <Link to={`/allBoard/BoardMain?page=${page}`}>게시글 목록 이동</Link>
                            </div>


                            <div
                                onClick={handleCommentSubmit}
                                className="bg-emerald-400 h-12 ml-[39.8rem] flex justify-center items-center text-xl font-bold w-[10rem] rounded hover:text-white transition duration-500 cursor-pointer"
                            >
                                댓글 입력
                            </div>
                        </div>
                    </div>

  const { posts, updateEditedPost } = usePostContext();
  const { page, id } = useParams(); // URL에서 page와 id를 가져옵니다.

  const [post, setPost] = useState(null); // post 상태를 초기화
  const [comments, setComments] = useState([]); // 댓글 상태 초기화
  const [comment, setComment] = useState(""); // 댓글 입력 상태 추가

  // 수정 상태 관리
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // 원본 값 상태 추가
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");

  // useEffect로 posts 상태에서 해당 게시글을 찾고, 존재하지 않으면 초기값 설정
  useEffect(() => {
    if (!posts || !posts[page]) {
      console.error(`No posts found for page ${page}`);
      setPost(null); // 게시글이 없으면 post를 null로 설정
      return;
    }

    const currentPosts = posts[page] || []; // 페이지에 해당하는 게시글을 찾음
    const foundPost = currentPosts.find((p) => p.id === parseInt(id));

    if (foundPost) {
      setPost(foundPost); // 게시글 존재 시 설정
      setComments(foundPost.comments || []); // 댓글 설정
      setEditedTitle(foundPost.title); // 제목 설정
      setEditedContent(foundPost.content); // 내용 설정
      setOriginalTitle(foundPost.title); // 원본 제목
      setOriginalContent(foundPost.content); // 원본 내용
    } else {
      console.error(`Post with id ${id} not found.`);
      setPost(null); // id에 해당하는 게시글이 없으면 post를 null로 설정
    }
  }, [posts, page, id]);

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>; // 게시글이 없을 경우 처리
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      if (comment.length > 50) {
        alert("댓글은 50자 이하로 다시 작성해 주세요.");
        setComment("");
        return;
      } else {
        const newComment = {
          id: new Date().getTime(),
          text: comment,
        };
        setComments((prevComments) => {
          const updatedComments = [...prevComments, newComment];
          // 게시글의 댓글도 업데이트
          const updatedPost = { ...post, comments: updatedComments };
          updateEditedPost(
            page,
            post.id,
            editedTitle,
            editedContent,
            updatedPost
          ); // 댓글을 포함한 게시글 업데이트
          return updatedComments;
        });
        setComment("");
      }
    } else {
      alert("댓글을 입력하세요.");
    }
  };

  const handleDeleteComment = (id) => {
    const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
    if (isConfirmed) {
      const updatedComments = comments.filter((comment) => comment.id !== id);
      setComments(updatedComments);

      const updatedPost = { ...post, comments: updatedComments };
      updateEditedPost(page, post.id, editedTitle, editedContent, updatedPost);
      alert("댓글이 삭제 되었습니다.");
    }
  };

  const handleEditSubmit = () => {
    if (editedTitle !== originalTitle || editedContent !== originalContent) {
      updateEditedPost(page, post.id, editedTitle, editedContent);
      setOriginalTitle(editedTitle);
      setOriginalContent(editedContent);
      setIsEditing(false);
      alert("수정이 완료되었습니다.");
    } else {
      setIsEditing(false);
      alert("변경된 내용이 없습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center w-full shadow-md max-w-5xl h-[calc(100vh-24px)]">
          <div>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border border-gray-300 rounded w-full  p-2 mb-2"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mb-2 resize-none"
                  rows="4"
                />
                <button
                  onClick={handleEditSubmit}
                  className="bg-emerald-400 h-12 flex justify-center items-center text-xl font-bold w-[10rem] rounded hover:text-white transition duration-500"
                >
                  수정 완료
                </button>
              </div>
            ) : (
              <div>
                <div className="bg-emerald-400 h-20 mt-6 flex justify-center items-center text-xl font-bold w-[60rem] overflow-y-auto">
                  {post.title}
                </div>
                <div className="bg-emerald-400 h-[10rem] mt-6 flex justify-center items-center text-xl font-bold w-[60rem] overflow-auto">
                  {post.content}
                </div>
              </div>
            )}

            <div className="bg-emerald-400 h-[10rem] mt-6 flex flex-col justify-start items-start text-xl font-bold w-[60rem] overflow-auto p-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={comment.id} className="mb-2">
                    <span className="text-md">
                      익명 {index + 1}:{" "}
                      <span className="text-base">
                        {comment.text || comment.content}
                      </span>{" "}
                      {/* text 대신 content로 수정 */}
                    </span>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition duration-500"
                    >
                      삭제
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-md">댓글이 없습니다.</div>
              )}
            </div>

            <div className="flex items-center mt-[2rem]">
              <div
                onClick={() => setIsEditing(!isEditing)}
                className="cursor-pointer items-center w-[10rem] rounded hover:text-white transition duration-500 bg-emerald-400 h-12 text-xl font-bold mr-4 flex justify-center"
              >
                {isEditing ? "취소" : "수정 하기"}
              </div>

              <div className="flex flex-col w-full">
                <label
                  className="text-xl font-bold mb-2 flex justify-center mr-[8rem]"
                  htmlFor="comment"
                >
                  댓글 작성
                </label>
                <textarea
                  id="comment"
                  className="border border-gray-300 rounded w-[33rem] ml-[5.5rem] p-2 resize-none"
                  rows="4"
                  value={comment}
                  onChange={handleCommentChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-row ">
              <div className="bg-emerald-400 h-12 flex justify-center items-center text-xl font-bold w-[10rem] rounded hover:text-white transition duration-500">
                <Link to={`/allBoard/BoardMain?page=${page}`}>
                  게시글 목록 이동
                </Link>
              </div>

              <div
                onClick={handleCommentSubmit}
                className="bg-emerald-400 h-12 ml-[39.8rem] flex justify-center items-center text-xl font-bold w-[10rem] rounded hover:text-white transition duration-500 cursor-pointer"
              >
                댓글 입력
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


