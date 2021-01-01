import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001",
});

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Email = localStorage.getItem("email");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
