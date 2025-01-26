import {
  ADD_COMMENT,
  DELETE_COMMENT,
  DELETE_POST,
  EDIT_COMMENT,
  GET_POSTS,
  ADD_POST,
  LIKE_POST,
  UNLIKE_POST,
  UPDATE_POST,
} from "../actions/post.action";

const initialState = {};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload; // Met à jour les posts 

     case ADD_POST:
      return [action.payload, ...state]; // Ajoute un nouveau post au début de la liste

    case LIKE_POST:
      return state.map((post) => { 
        if (post._id === action.payload.postId) { 
          return {
            ...post,
            likers: [action.payload.userId, ...post.likers], 
          }; 
        } 
        return post;
      }); 
      
    case UNLIKE_POST:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            likers: post.likers.filter((id) => id !== action.payload.userId),
          };
        }
        return post;
      });

    case UPDATE_POST:
        return state.map((post) =>
          post._id === action.payload.postId
            ? { ...post, message: action.payload.message }
            : post
        );
      
    case DELETE_POST:
      return state.filter((post) => post._id !== action.payload.postId); // Supprime un post

    case ADD_COMMENT:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            comments: [action.payload, ...post.comments], // Ajoute un nouveau commentaire au début de la liste des commentaires
          };
        } else return post;
      });

    case EDIT_COMMENT:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment._id === action.payload.commentId) {
                return {
                  ...comment,
                  text: action.payload.text, // Met à jour le texte du commentaire 
                };
              } else {
                return comment;
              }
            }),
          };
        } else return post;
      });

    case DELETE_COMMENT:
      return state.map((post) => {
        if (post._id === action.payload.postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment._id !== action.payload.commentId
            ), // Supprime un commentaire 
          };
        } else return post;
      });

    default:
      return state;
  }
}
