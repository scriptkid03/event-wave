import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return Promise.reject(error.response);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject({ 
        data: { message: 'No response from server. Please try again.' } 
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject({ 
        data: { message: error.message || 'An error occurred. Please try again.' } 
      });
    }
  }
);

export default api;
