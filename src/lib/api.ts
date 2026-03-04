import axios from "axios";
import { clearAuth } from "./jwt";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, ""),
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

// Response Interceptor: Handle 401s (only for protected endpoints)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect for auth endpoints — let page-level handlers show errors
    const url = error.config?.url || "";
    const isAuthEndpoint =
      url.includes("/send-otp") ||
      url.includes("/verify-otp") ||
      url.includes("/login") ||
      url.includes("/reg");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
