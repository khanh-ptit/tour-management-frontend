const roleReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PERMISSIONS":
      return { permissions: action.payload.permissions };

    default:
      return state;
  }
};

export default roleReducer;
