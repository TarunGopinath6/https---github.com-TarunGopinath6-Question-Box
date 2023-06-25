import axios from "axios";
import { Buffer } from "buffer";

const axiosInstance = axios.create({
  timeout: 30000,
  headers: {
    "Content-type": "application/json",
    accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config.url;
    const originalMethod = error.config.method;
    if (typeof error.response === "undefined") {
      if (error.message === "timeout of 30000ms exceeded") {
        alert("Please Try Again after 10 seconds");
      } else {
        alert("SERVER ERROR - CORS/AXIOS");
      }
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      const refresh_token = await localStorage.getItem("refreshToken");
      const access_token = await localStorage.getItem("accessToken");
      const email = await localStorage.getItem("email");
      if (
        access_token !== "undefined" &&
        refresh_token !== "undefined" &&
        access_token !== "null" &&
        refresh_token !== "null"
      ) {
        const tokenParts = JSON.parse(
          Buffer.from(refresh_token.split(".")[1], "base64")
        );
        const now = Math.ceil(Date.now() / 1000);
        if (tokenParts.exp <= now) {
          return Promise.reject("SendLogin");
        }

        const response = await axios.post(
          "http://localhost:3000/refresh_token",
          {
            refresh_token: refresh_token,
            email: email,
          }
        );
        await localStorage.removeItem("accessToken");
        await localStorage.setItem("accessToken", response.data);
        error.config["headers"]["Authorization"] = response.data;
        const originalConfig = error.config;
        const responseReturn = axiosInstance(originalConfig);
        return responseReturn;
      }
      return "SERVER ERROR - TOKENS";
    } else {
      return "UNKNOWN ERROR";
    }
  }
);

export default axiosInstance;
