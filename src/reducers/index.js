import { combineReducers } from "redux";
import destinationReducer from "./destination";
import authReducer from "./auth";
import cartReducer from "./cart";

const allReducers = combineReducers({
  destinationReducer,
  authReducer,
  cartReducer,
  // Thêm reducers tại đây
});

export default allReducers;
