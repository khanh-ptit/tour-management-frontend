import { combineReducers } from "redux";
import destinationReducer from "./destination";
import authReducer from "./auth";
import cartReducer from "./cart";
import accountReducer from "./account";

const allReducers = combineReducers({
  destinationReducer,
  authReducer,
  cartReducer,
  accountReducer,
  // Thêm reducers tại đây
});

export default allReducers;
