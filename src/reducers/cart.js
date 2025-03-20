const cartReducer = (state = 0, action) => {
  // console.log(state, action);
  switch (action.type) {
    case "UPDATE_CART_QUANTITY":
      return { cartQuantity: action.payload }; // Ghi đè dữ liệu trong nước

    default:
      return state;
  }
};

export default cartReducer;
