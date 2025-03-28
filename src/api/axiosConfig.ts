import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://0.0.0.0:8000/",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// // Request interceptor for authentication
// apiClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });
//
// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Handle auth errors or other common error scenarios
//         if (error.response?.status === 401) {
//             localStorage.removeItem('authToken');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );
//
export default apiClient;
