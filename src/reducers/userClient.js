const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_INFO":
      return { userUpdate: action.payload };

    default:
      return state;
  }
};

export default userReducer;
