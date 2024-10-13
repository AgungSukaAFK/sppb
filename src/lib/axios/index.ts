import axios from "axios";

const header = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Cache-Control": "no-cache",
  Expires: 0,
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: header,
  timeout: 60 * 1000, 
  validateStatus: function (status) {
    return status < 500;
  },
});

instance.interceptors.response.use(
  (response) => response, 
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

export default instance;
