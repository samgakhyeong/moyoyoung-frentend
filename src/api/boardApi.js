import axiosInstance from "../axiosInstance";


export const API_SERVER_HOST = 'http://localhost:8080'; // 백엔드 서버 URL
const prefix = `${API_SERVER_HOST}/api/allBoard`;

const boardApi = {
  createPost: async (title, content, myUserId, files) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('myUserId', myUserId);
    files.forEach(file => formData.append('files', file));

    try {
      const response = await axiosInstance.post(`${prefix}/posts/create`, formData, {
        // Content-Type은 FormData와 함께 자동으로 설정됨
        // 'Content-Type': 'multipart/form-data',
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error.response || error.message || error);
      throw error;
    }
  },


  modifyPost: async (id, title, content, files) => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    files.forEach(file => formData.append('files', file));


    try {
      const response = await axiosInstance.put(`${prefix}/posts/modify/${id}`, formData, {
        // Content-Type은 FormData와 함께 자동으로 설정됨
        // 'Content-Type': 'multipart/form-data',
      });
      return response.data;
    } catch (error) {
      console.error('Error modifying post:', error.response || error.message || error);
      throw error;
    }
  },
 
   // 게시글 목록 가져오기 (페이지 매개변수 추가)
  getByListBoard: async (page) => {
    try {
      const response = await axiosInstance.get(`${prefix}/posts/list?page=${page}`);
      return response.data; // 서버에서 반환한 게시글 목록
    } catch (error) {
      console.error('Error fetching post list:', error.response || error.message || error);
      throw error;
    }
  },

 

};

export default boardApi;
