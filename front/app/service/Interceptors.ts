import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001",
//   baseURL: "https://brevnoback-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("access");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    } else {
      console.warn("No auth token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("Response received:", response);
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized access - possibly invalid token.");
      } else if (error.response.status === 404) {
        console.error("Requested resource not found.");
      } else {
        console.error(
          "An error occurred:",
          error.response.status,
          error.response.data
        );
      }
    } else {
      console.error("An error occurred:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
