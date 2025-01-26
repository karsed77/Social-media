import { GET_USER_PROFIL } from "../actions/user.action";

const initialState = {};

export default function userProfilReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER_PROFIL:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
