import {
  FOLLOW_USER,
  GET_USER,
  UNFOLLOW_USER,
  UPDATE_AVATAR,
  UPDATE_BIO,
  UPDATE_USER,
} from "../actions/user.action";

const initialState = {};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.payload; // Renvoie toutes les données de l'utilisateur

    case UPDATE_AVATAR:
      return {
        ...state,
        picture: action.payload.picture, // Met à jour uniquement l'image
      };

    case UPDATE_USER:
      return {
        ...state,
        ...action.payload, // Met à jour l'utilisateur avec toutes les données reçues
      };

    case UPDATE_BIO:
      return {
        ...state,
        bio: action.payload, // Met à jour uniquement la bio
      };

    case FOLLOW_USER:
      return {
        ...state,
        following: [action.payload.idToFollow, ...state.following], // Ajoute un nouvel utilisateur suivi
      };

    case UNFOLLOW_USER:
      return {
        ...state,
        following: state.following.filter(
          (id) => id !== action.payload.idToUnFollow // Supprime un utilisateur suivi
        ),
      };

    default:
      return state;
  }
}
