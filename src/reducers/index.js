import { combineReducers } from "redux";
import destinationReducer from "./destination";
import authReducer from "./auth";

const allReducers = combineReducers({
  destinationReducer,
  authReducer,
  // Thêm reducers tại đây
});

export default allReducers;
