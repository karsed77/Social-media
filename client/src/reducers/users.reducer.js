import { GET_USERS, UPDATE_USER } from "../actions/users.action";

const initialState = [];

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return action.payload || [];

    case UPDATE_USER:
      return state.map((user) =>
        user._id === action.payload._id ? { ...user, ...action.payload } : user
      );

    default:
      return state;
  }
}
