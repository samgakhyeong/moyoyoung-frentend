import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState({}); // 페이지별 게시글을 저장하기 위한 객체
    const [commentss, setCommentss] = useState({}); // 댓글 상태 추가
    useEffect(() => {
        const savedPosts = localStorage.getItem('posts');
        if (savedPosts) {
            const parsedPosts = JSON.parse(savedPosts);
            // 모든 페이지에 대해 배열로 초기화
            Object.keys(parsedPosts).forEach((page) => {
                if (!Array.isArray(parsedPosts[page])) {
                    parsedPosts[page] = [];
                }
            });
            setPosts(parsedPosts); // 로컬 스토리지에서 가져온 데이터를 상태에 설정
        }
    }, []);

    // posts 상태를 로컬 스토리지에 저장하는 함수
    const savePostsToLocalStorage = (newPosts) => {
        localStorage.setItem('posts', JSON.stringify(newPosts));
    };

    // 게시글 추가
    const addPost = (title, content,file ,fileUrl, page, createdAt, navigate) => {
        setPosts((prevPosts) => {
            const newPosts = { ...prevPosts };
            if (!newPosts[page]) {
                newPosts[page] = [];
            }

            // 게시글이 1개 이상인 경우
            if (newPosts[page].length >= 5) {
                alert("게시글 한 페이지당 5개까지만 추가할 수 있습니다.");
                navigate(`/allBoard/BoardMain?page=${page}`);
                return prevPosts;
            }

            const postNumber = newPosts[page].length > 0
                ? Math.max(...newPosts[page].map(post => post.id), 0) + 1
                : 1;

            newPosts[page].push({
                id: postNumber,
                title,
                content,
                file,
                fileUrl:file ? URL.createObjectURL(file) : null, // 파일 URL 저장,
                createdAt,
                updatedAt: createdAt, // 처음 작성된 시간
            });

            savePostsToLocalStorage(newPosts); // 로컬 스토리지에 저장
            toast.success("게시글이 성공적으로 작성되었습니다.",{
                autoClose: 2000,
              });
            navigate(`/allBoard/BoardMain?page=${page}`);

            return newPosts;
        });
    };

    // 게시글 수정
    const updateEditedPost = (page, id, title, content,commentss,file,createdAt) => {
        setPosts((prevPosts) => {
            const newPosts = { ...prevPosts };
            const postIndex = newPosts[page]?.findIndex(post => post.id === id);

            if (postIndex !== -1) {
                newPosts[page][postIndex] = {
                    ...newPosts[page][postIndex],
                    title,
                    content,
                    updatedAt: new Date().toISOString(),
                    createdAt,
                    file: file || newPosts[page][postIndex].file // 파일 정보 유지
                };
            }

            savePostsToLocalStorage(newPosts); // 수정 후 로컬 스토리지에 저장
            return newPosts;
        });
    };


    const addComment = (page, postId, comment) => {
        setCommentss((prevCommentss) => ({
            ...prevCommentss,
            [page]: {
                ...prevCommentss[page],
                [postId]: [...(prevCommentss[page]?.[postId] || []), comment],
            },
        }));
    };

    return (
        <PostContext.Provider value={{ posts, addPost, updateEditedPost,addComment,commentss  }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within a PostProvider');
    }
    return context;
};
