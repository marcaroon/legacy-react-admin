import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });

    const { data } = res.data; // Ambil property 'data' dari response
    const token = data.access_token; // Ambil access_token dari data
    const user = data.user; // Ambil user dari data

    console.log("Login response:", { token, user }); // DEBUG

    if (token) {
      localStorage.setItem("data.access_token", token);
      console.log("Token saved to localStorage:", token); // DEBUG

      if (user) {
        localStorage.setItem("data.user", JSON.stringify(user));
        console.log("User saved to localStorage:", user); // DEBUG
      }
    }

    return { token, user };
  } catch (err: any) {
    console.error("Login failed:", err);
  }
};

export const logout = () => {
  localStorage.removeItem("data.access_token");
  localStorage.removeItem("data.user");

  try {
    axios.post(`${API_BASE_URL}/logout`);
  } catch (error) {
    console.log("Logout API call failed:", error);
  }
};

export const getToken = () => {
  return localStorage.getItem("data.access_token");
};

export const getUser = () => {
  const user = localStorage.getItem("data.user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  const token = getToken();
  console.log("Checking authentication, token:", token);

  if (!token) {
    console.log("No token found");
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    console.log("Token payload:", payload);
    console.log("Current time vs exp:", currentTime, payload.exp);

    if (payload.exp && payload.exp < currentTime) {
      console.log("Token expired");
      logout();
      return false;
    }

    console.log("Authentication successful");
    return true;
  } catch (error) {
    console.log("Token format invalid:", error);
    logout();
    return false;
  }
};

// Optional: function to refresh token
export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-token`);
    const { token } = response.data;

    if (token) {
      localStorage.setItem("data.access_token", token);
      return token;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout();
    throw error;
  }
};
