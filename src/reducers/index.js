import { combineReducers } from "redux";
import destinationReducer from "./destination";

const allReducers = combineReducers({
  destinationReducer,
  // Thêm reducers tại đây
});

export default allReducers;
