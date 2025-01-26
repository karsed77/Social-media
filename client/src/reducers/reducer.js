import { combineReducers } from "redux";
import allPostsReducer from "./allPosts.reducer";
import authReducer from "./auth.reducer";
import errorReducer from "./error.reducer";
import postReducer from "./post.reducer";
import trendingReducer from "./trending.reducer";
import userReducer from "./user.reducer";
import userProfilReducer from "./userProfil.reducer";
import usersReducer from "./users.reducer";

export default combineReducers({
  userReducer,
  usersReducer,
  postReducer,
  authReducer,
  errorReducer,
  allPostsReducer,
  trendingReducer,
  userProfilReducer,
});
