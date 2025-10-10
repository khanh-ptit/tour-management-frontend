const API_DOMAIN = "http://localhost:5000/";

// Hàm lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem("token"); // Lấy token từ localStorage
};

// Hàm xử lý response & lỗi
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Lỗi HTTP ${response.status}`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.code = errorData?.code || response.status;
    throw error;
  }
  return response.json();
};

// Hàm GET request
export const get = async (path) => {
  const token = getToken(); // Lấy token
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header nếu tồn tại
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "GET",
    credentials: "include",
    headers,
  });
  return handleResponse(response);
};

// Hàm POST request
export const post = async (path, options) => {
  const token = getToken(); // Lấy token
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header nếu tồn tại
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(options),
  });
  return handleResponse(response);
};

// Hàm PATCH request
export const patch = async (path, options) => {
  const token = getToken(); // Lấy token
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header nếu tồn tại
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers,
    body: JSON.stringify(options),
  });
  return handleResponse(response);
};

// Hàm DELETE request
export const del = async (path) => {
  const token = getToken(); // Lấy token
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // Thêm token vào header nếu tồn tại
  }

  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });
  return handleResponse(response);
};
