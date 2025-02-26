const API_DOMAIN = "http://localhost:5000/"; 

// Hàm xử lý response & lỗi
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Lỗi HTTP ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Hàm GET request
export const get = async (path) => {
  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "GET",
    credentials: "include", 
  });
  return handleResponse(response);
};

// Hàm POST request
export const post = async (path, options) => {
  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "POST",
    credentials: "include", // 🚀 Gửi kèm cookies
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  return handleResponse(response);
};

// Hàm PATCH request
export const patch = async (path, options) => {
  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
  return handleResponse(response);
};

// Hàm DELETE request
export const del = async (path) => {
  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(response);
};
