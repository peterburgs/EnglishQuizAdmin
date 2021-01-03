import axios from "axios";

const instance = axios.create({
  baseURL: "https://ec933602c7a2.ngrok.io",
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
