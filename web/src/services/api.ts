import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';


// Create an Axios instance with a base URL
// We use import.meta.env for Vite environment variables
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Important for Laravel Sanctum authentication (cookies)
});

// Add a request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // You can add auth tokens here if you aren't using cookie-based auth
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle global errors here, e.g., redirect to login on 401
        if (error.response && error.response.status === 401) {
            // Logic to redirect to login or clear auth state
            console.warn('Unauthorized access - redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export default api;
