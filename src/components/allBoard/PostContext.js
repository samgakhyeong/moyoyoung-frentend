import React, { createContext, useContext, useState } from 'react';

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    
    const addPost = (title, content, file) => {
        if (posts.length >= 10) {
            alert("게시글 한 페이지당 10개까지만 추가할 수 있습니다.");
            return;
        }
        

        const postNumber = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
        setPosts(prevPosts => [
            ...prevPosts, 
            {   file,
                id: postNumber,
                title: `${postNumber}번째 제목: ${title}`, 
                content, 
            }
        ]);
    };

    return (
        <PostContext.Provider value={{ posts, addPost }}>
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