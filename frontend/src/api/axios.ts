import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url;

    // Skip auth endpoints
    if (url?.includes("/auth/login") || url?.includes("/auth/register")) {
      return Promise.reject(error);
    }

    // Handle real auth failures
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;