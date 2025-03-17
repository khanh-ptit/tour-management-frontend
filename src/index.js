import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import allReducers from "./reducers";
import { Provider } from "react-redux";

// Lấy state từ localStorage (nếu có)
const persistedState = localStorage.getItem("reduxState")
  ? JSON.parse(localStorage.getItem("reduxState"))
  : {};

// Tạo store với state đã lưu (nếu có)
const store = createStore(allReducers, persistedState);

// Lưu Redux state vào localStorage mỗi khi state thay đổi
store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
