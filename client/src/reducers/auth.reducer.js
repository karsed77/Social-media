import {
  CHECK_AUTH,
  LOGIN_ERROR,
  LOGIN_USER,
  START_LOADING,
} from "../actions/auth.action";

const initialState = {
  isLoggedIn: false,
  isLoading: true,
  isInitialized: false,
  userData: {},
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };

    case LOGIN_USER:
      return {
        ...state,
        isLoggedIn: true,
        userData: action.payload,
        isLoading: false,
        isInitialized: true,
      };

    case LOGIN_ERROR:
      return {
        ...state,
        isLoggedIn: false,
        isLoading: false,
        isInitialized: true,
      };

    case CHECK_AUTH:
      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        isInitialized: true,
      };

    default:
      return state;
  }
}
