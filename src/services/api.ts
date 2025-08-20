// src/services/api.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";
export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// logs úteis em dev
if (import.meta.env.DEV) {
  api.interceptors.request.use((cfg) => {
    console.log("[API][REQ]", cfg.method, cfg.baseURL, cfg.url, cfg.data);
    return cfg;
  });
  api.interceptors.response.use(
    (res) => (console.log("[API][RES]", res.status, res.config.url), res),
    (err) => (console.log("[API][ERR]", err?.response?.status, err?.message), Promise.reject(err))
  );
}
