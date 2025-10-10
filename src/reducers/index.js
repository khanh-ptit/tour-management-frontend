import { combineReducers } from "redux";
import destinationReducer from "./destination";
import authReducer from "./auth";
import cartReducer from "./cart";
import accountReducer from "./account";
import roleReducer from "./role";

const allReducers = combineReducers({
  destinationReducer,
  authReducer,
  cartReducer,
  accountReducer,
  roleReducer,
  // Thêm reducers tại đây
});

export default allReducers;
