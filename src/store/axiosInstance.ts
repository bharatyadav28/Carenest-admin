import { getCookieConfig } from "@/lib/resuable-fns";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  //   baseURL: "https://carenest-backend-8y2y.onrender.com",
  baseURL: "http://localhost:4000",
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Flag to prevent multiple refresh attempts
let isRefreshing: boolean = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Function to add failed requests to queue
const subscribeTokenRefresh = (cb: (token: string) => void): void => {
  refreshSubscribers.push(cb);
};

// Function to process queued requests after token refresh
const onTokenRefreshed = (token: string): void => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

// Function to refresh access token
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken: string | undefined = Cookies.get("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.get(
      `${axiosInstance.defaults.baseURL}/api/v1/new-access-token`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const { accessToken } = response.data?.data;

    // Update cookies with new tokens
    Cookies.set("accessToken", accessToken, getCookieConfig(accessToken));

    return accessToken;
  } catch (error) {
    // Remove invalid tokens
    alert("Token refresh failed");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Redirect to sign-in page
    window.location.href = "/signin"; // Adjust path as needed
    throw error;
  }
};

// Request interceptor to add access token
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token: string | undefined = Cookies.get("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    const isRefreshRequest = originalRequest.url?.includes(
      "/api/v1/new-access-token"
    );
    // Check if error is due to expired/invalid access token
    if (
      !isRefreshRequest &&
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise<AxiosResponse>((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken: string = await refreshAccessToken();
        isRefreshing = false;

        // Process queued requests
        onTokenRefreshed(newAccessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
