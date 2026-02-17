import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      window.location.href = "/"; // Force redirect to login
    }
    return Promise.reject(error);
  },
);

export default api;
