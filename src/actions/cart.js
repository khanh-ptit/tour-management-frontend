export const updateCartQuantity = (quantity) => {
  return { type: "UPDATE_CART_QUANTITY", payload: quantity };
};

export const addToursOrder = (tours) => {
  return { type: "ADD_TOUR_ORDER", payload: tours };
};
