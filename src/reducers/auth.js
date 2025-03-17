const initialState = {
  isAuthenticated: false,
  user: null,
};

// Kiểm tra và lấy dữ liệu từ localStorage một cách an toàn
const storedState = (() => {
  try {
    const savedState = localStorage.getItem("reduxState");
    return savedState
      ? JSON.parse(savedState).authReducer || initialState
      : initialState;
  } catch (error) {
    console.error("Lỗi khi lấy Redux state từ localStorage:", error);
    return initialState;
  }
})();

const authReducer = (state = storedState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { isAuthenticated: true, user: action.payload };

    case "LOGOUT":
      return { isAuthenticated: false, user: null };

    default:
      return state;
  }
};

export default authReducer;
