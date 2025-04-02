import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

export const AuthAPI = axios.create({
  baseURL: "http://localhost:3000/api"
});

AuthAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

AuthAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
