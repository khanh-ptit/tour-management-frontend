export const checkAuthClient = async (token) => {
  const response = await fetch("http://localhost:5000/api/v1/auth/me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
