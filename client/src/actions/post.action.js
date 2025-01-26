import axios from "axios";

// Fonction pour récupérer les posts
export const GET_POSTS = "GET_POSTS";
export const GET_USER = "GET_USER";
export const GET_ALL_POSTS = "GET_ALL_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const DELETE_POST = "DELETE_POST";

// commmentaires
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

// Tendances
export const GET_TRENDS = "GET_TRENDS";

// erreurs
export const GET_POST_ERRORS = "GET_POST_ERRORS";

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Fonction pour récupérer les posts
export const getPosts = (num) => {
  return (dispatch) => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/api/post`)
      .then((res) => {
        const array = res.data.slice(0, num);
        dispatch({ type: GET_POSTS, payload: array });
        dispatch({ type: GET_ALL_POSTS, payload: res.data });
      })
      .catch((err) => console.error(err));
  };
};

// Fonction pour ajouter un post
export const addPost = (data) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/post/`,
        data
      );

      // Si le post est ajouté avec succès
      dispatch({ type: "ADD_POST", payload: res.data });

      // Récupère la liste des posts
      const postsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/post`
      );
      dispatch({ type: GET_POSTS, payload: postsRes.data });

      // Rafraîchit également l'utilisateur connecté
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/${data.get("posterId")}`
      );
      dispatch({ type: GET_USER, payload: userRes.data });

      return res.data; // Retourne les données en cas de succès
    } catch (err) {
      console.error("Erreur API :", err.response.data);
      return err.response.data; // Retourne les erreurs
    }
  };
};

// Fonction pour liker un post
export const likePost = (postId, userId) => {
  return (dispatch) => {
    return axios
      .patch(`${import.meta.env.VITE_API_URL}/api/post/like-post/${postId}`, {
        id: userId,
      })
      .then(() => {
        dispatch({ type: LIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => console.error(err));
  };
};

// Fonction pour unliker un post
export const unlikePost = (postId, userId) => {
  return (dispatch) => {
    return axios
      .patch(`${import.meta.env.VITE_API_URL}/api/post/unlike-post/${postId}`, {
        id: userId,
      })
      .then(() => {
        dispatch({ type: UNLIKE_POST, payload: { postId, userId } });
      })
      .catch((err) => console.error(err));
  };
};

// Fonction pour modifier un post
export const updatePost = (postId, message) => {
  return async (dispatch) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/post/${postId}`,
        { message }
      );

      dispatch({
        type: UPDATE_POST,
        payload: { postId, message: res.data.message }, // Utilisez les données retournées par l'API
      });

      return res.data; // Retourne les données en cas de succès
    } catch (err) {
      console.error(
        "Erreur lors de la mise à jour du post :",
        err.response.data
      );
      return err.response.data;
    }
  };
};

// Fonction pour supprimer un post
export const deletePost = (postId) => {
  return (dispatch) => {
    return axios
      .delete(`${import.meta.env.VITE_API_URL}/api/post/${postId}`)
      .then(() => {
        dispatch({ type: DELETE_POST, payload: { postId } });
      })
      .catch((err) => console.error(err));
  };
};

// Fonction pour ajouter un commentaire
export const addComment = (postId, commenterId, text, commenterPseudo) => {
  return (dispatch) => {
    return axios
      .patch(
        `${import.meta.env.VITE_API_URL}/api/post/comment-post/${postId}`,
        {
          commenterId,
          text,
          commenterPseudo,
        }
      )
      .then(() => {
        dispatch({
          type: ADD_COMMENT,
          payload: { postId },
        });
      })
      .catch((err) => console.error(err));
  };
};

// Fonction pour modifier un commentaire
export const editComment = (postId, commentId, text) => {
  return (dispatch) => {
    return axios
      .patch(
        `${import.meta.env.VITE_API_URL}/api/post/edit-comment-post/${postId}`,
        {
          commentId,
          text,
        }
      )
      .then(() => {
        dispatch({
          type: EDIT_COMMENT,
          payload: { postId, commentId, text },
        });
      })
      .catch((err) => console.error(err));
  };
};

// Fonction pour supprimer un commentaire
export const deleteComment = (postId, commentId) => {
  return (dispatch) => {
    return axios
      .patch(
        `${
          import.meta.env.VITE_API_URL
        }/api/post/delete-comment-post/${postId}`,
        {
          commentId,
        }
      )
      .then(() => {
        dispatch({
          type: DELETE_COMMENT,
          payload: { postId, commentId },
        });
      })
      .catch((err) => console.error(err));
  };
};

// Fonction pour récupérer les tendances
export const getTrends = (sortedArray) => {
  return (dispatch) => {
    if (!Array.isArray(sortedArray)) {
      console.error("Le tableau des tendances est invalide :", sortedArray);
      return;
    }
    dispatch({ type: "GET_TRENDS", payload: sortedArray });
  };
};
