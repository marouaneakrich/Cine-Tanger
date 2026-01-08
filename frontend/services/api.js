import axios from "axios";
import Constants from "expo-constants";

const getApiBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  const debuggerHost = Constants.expoConfig?.debuggerHost;

  const host = (hostUri || debuggerHost || "").split(":")[0];
  if (host) return `http://${host}:80/api`;

  return "http://192.168.1.147:80/api";
};

export const api = axios.create({
  baseURL: getApiBaseUrl(), 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);
    
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please check your connection.";
    } else if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        error.message = "Resource not found.";
      } else if (status === 500) {
        error.message = "Server error. Please try again later.";
      } else if (status >= 400 && status < 500) {
        error.message = error.response.data?.message || "Bad request.";
      }
    } else if (error.request) {
      error.message = "Network error. Please check your internet connection.";
    }
    
    return Promise.reject(error);
  }
);

export const withRetry = async (apiCall, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
    }
  }
  
  throw lastError;
};
