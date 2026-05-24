import axios from "axios";

const API = axios.create({
  baseURL: "https://mooninterview.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log("Token:", token);
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
