import axios from 'axios';

const api = axios.create({
    baseURL: 'https://blogapp-server-oa2l.onrender.com'
});

// USE THIS FOR TESTING LOCAL FOR UPGRADE
// const api = axios.create({
//     baseURL: 'http://localhost:4000'
// });

// Automatically attach JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;