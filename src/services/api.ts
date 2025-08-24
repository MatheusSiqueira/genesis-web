import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";
export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → limpa token e manda para login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      // evita loop quando já está no /login
      if (location.pathname !== "/login") {
        const from = encodeURIComponent(location.pathname + location.search);
        window.location.replace(`/login?from=${from}`);
      }
    }
    return Promise.reject(err);
  }
);

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
