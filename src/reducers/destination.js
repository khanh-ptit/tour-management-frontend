const initialState = {
  domestic: [], // Tour trong nước
  foreign: [], // Tour nước ngoài
};

const destinationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DESTINATIONS":
      return { ...state, domestic: action.destinations }; // Ghi đè dữ liệu trong nước

    case "SET_FOREIGN_DESTINATIONS":
      return { ...state, foreign: action.destinations }; // Ghi đè dữ liệu nước ngoài

    default:
      return state;
  }
};

export default destinationReducer;
