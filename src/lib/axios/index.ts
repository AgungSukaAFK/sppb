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
  timeout: 60 * 1000, // 1 Menit
  validateStatus: function (status) {
    // Menganggap semua status di bawah 500 sebagai respons sukses
    return status < 500; // Termasuk status 400 dianggap sebagai respons valid
  },
});

instance.interceptors.response.use(
  (response) => response, // Menangani response sukses
  (error) => {
    // Menangani response error (500 ke atas)
    return Promise.reject(error);
  }
);

instance.interceptors.request.use(
  (config) => config, // Sebelum request dikirim
  (error) => Promise.reject(error)
);

export default instance;
