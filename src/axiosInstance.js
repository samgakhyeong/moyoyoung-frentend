import axios from 'axios';
import store from './store';




const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
});




axiosInstance.interceptors.request.use((config) => {
    const state = store.getState();
    // const token = state.auth.token;


    const excludedUrls = ['/auth/token'];




    if (excludedUrls.some(url => config.url.includes(url))) {
        return config;
    }




    // if (token) {
    //     config.headers['Authorization'] = `Bearer ${token}`;
    // } else {
    //     return Promise.reject(new Error('로그인이 필요합니다.'));
    // }
    return config;
}, (error) => {
    return Promise.reject(error);
});




axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;




    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;




        const state = store.getState();
        const refreshToken = state.auth.refreshToken;




        try {
            const response = await axios.post('http://localhost:8080/auth/refresh', { token: refreshToken });
            const { token } = response.data;




            store.dispatch({ type: 'SET_TOKEN', payload: token });
            originalRequest.headers['Authorization'] = `Bearer ${token}`;




            return axiosInstance(originalRequest);
        } catch (refreshError) {
            return Promise.reject(new Error('토큰 갱신 실패.'));
        }
    }




    return Promise.reject(error);
});




export default axiosInstance;


