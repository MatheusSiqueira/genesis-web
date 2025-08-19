import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7157/api", // ajuste se mudar
});

// anexa o JWT se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
