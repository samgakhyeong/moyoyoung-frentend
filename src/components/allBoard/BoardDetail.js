import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePostContext } from './PostContext';
import Header from '../common/Header';
import Footer from '../common/Footer';

export default function BoardDetail() {
    const { posts, editedPosts, updateEditedPost } = usePostContext();
    const { page, id } = useParams(); // URL에서 id만 가져옵니다.

    const currentPosts = posts[page] || [];
    const post = currentPosts.find((p) => p.id === parseInt(id));

    // 댓글 상태 관리
    const [comment, setComment] = useState(''); // textarea에 입력한 값
    const [comments, setComments] = useState(post?.comments || []); // 댓글 목록

    const currentEditedPost = editedPosts?.[page]?.[id] || {};

    // 수정 상태 관리
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(currentEditedPost ? currentEditedPost.title : post.title);
    const [editedContent, setEditedContent] = useState(currentEditedPost ? currentEditedPost.content : post.content);

    // 원본 값 상태 추가
    const [originalTitle, setOriginalTitle] = useState(post.title);
    const [originalContent, setOriginalContent] = useState(post.content);

    // 게시글이 변경될 때 댓글 목록 업데이트하지 않도록 수정
    useEffect(() => {
        if (post) {
            // 댓글 목록이 이미 설정되어 있다면 덮어쓰지 않도록 수정
            setComments((prevComments) => prevComments.length > 0 ? prevComments : post.comments || []);
            setEditedTitle(post.title); // 새로운 게시글 제목
            setEditedContent(post.content); // 새로운 게시글 내용
        }
    }, [post]);

    // 댓글 입력값 변화 처리
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    // 댓글 제출 처리
    const handleCommentSubmit = () => {
        if (comment.trim()) {
            if (comment.length > 50) {
                alert("댓글은 50자 이하로 다시 작성해 주세요."); // 50자 이상일 때 alert
                setComment(''); // 입력 필드 비우기
                return; // 50자 이상이면 추가하지 않고 리턴
            } else {
                const newComment = {
                    id: new Date().getTime(), // 고유 id를 생성
                    text: comment
                };
                setComments((prevComments) => [...prevComments, newComment]); // 댓글 추가
                setComment(''); // 입력 필드 비우기
            }
        } else {
            alert("댓글을 입력하세요."); // 댓글이 비어있을 경우 경고
        }
    };

    // 댓글 삭제 처리
    const handleDeleteComment = (id) => {
        const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?");
        if (isConfirmed) {
            // 해당 id를 가진 댓글을 삭제
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
            alert("댓글이 삭제 되었습니다.");
        }
    };

    // 게시글 수정 처리
    const handleEditSubmit = () => {
        if (editedTitle !== post.title || editedContent !== post.content) {
            // 수정된 제목, 내용, 그리고 작성일(createdAt)을 현재 시간으로 갱신
            updateEditedPost(page, post.id, editedTitle, editedContent, comments); // 댓글도 함께 업데이트
            setOriginalTitle(editedTitle);  // 수정된 제목을 원본 제목으로 업데이트
            setOriginalContent(editedContent);  // 수정된 내용을 원본 내용으로 업데이트
            setIsEditing(false);  // 수정 모드 종료
            alert("수정이 완료되었습니다.");
        } else {
            alert("변경 사항 없습니다.");
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
                                            onClick={() => handleDeleteComment(comment.id)} // 삭제 버튼 클릭 시 해당 댓글 삭제
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
                            <div className="bg-emerald-400 h-12 flex justify-center items-center text-xl font-bold w-[10rem] rounded hover:text-white transition duration-500 ">
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
                </div>
            </div>
            <Footer />
        </div>
    );
}