const accountReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_ACCOUNT":
      return { accountInfo: action.payload };

    default:
      return state;
  }
};

export default accountReducer;
