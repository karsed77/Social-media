import { configureStore } from "@reduxjs/toolkit";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { getPosts } from "./actions/post.action.js";
import { getUsers } from "./actions/users.action.js";
import App from "./App.jsx";
import rootReducer from "./reducers/reducer.js";
import "./styles/index.scss";

// Création du store avec @reduxjs/toolkit
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: true,
    }),
  devTools: false,
});

// Dispatch de l'action getUsers pour récupérer les utilisateurs
store.dispatch(getUsers());
store.dispatch(getPosts());

// Rendu principal
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
