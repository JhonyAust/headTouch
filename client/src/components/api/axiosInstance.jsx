import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: "https://api.headtouchbd.com",
});

export default axiosInstance;
