import axios from "axios";

export const GET_USER = "GET_USER";
export const UPDATE_AVATAR = "UPDATE_AVATAR";
export const UPDATE_USER = "UPDATE_USER";
export const GET_USERS = "GET_USERS";
export const GET_USER_PROFIL = "GET_USER_PROFIL";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";
export const GET_USER_ERRORS = "GET_USER_ERRORS";

// Récupération des données utilisateur par son id
export const getUser = (uid) => {
  return (dispatch) => {
    // Vérifie si UID est valide
    if (!uid || typeof uid !== "string") {
      console.error("UID invalide :", uid);
      return;
    }
    return axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/${uid}`)
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log("Erreur API utilisateur :", err));
  };
};

// Récupération de tous les utilisateurs
export const getUsers = () => async (dispatch) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`);
    const data = await res.json();
    dispatch({ type: "GET_USERS", payload: data });
  } catch (err) {
    console.error(err);
  }
};

// Voir le profil d'un utilisateur
export const getUserProfil = (id) => {
  return (dispatch) => {
    return axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/${id}`)
      .then((res) => {
        dispatch({ type: GET_USER_PROFIL, payload: res.data });
      })
      .catch((err) => {
        console.error(err);
        throw err; 
      });
  };
};

// Mise à jour des données utilisateur par son id (avec option de rechargement des utilisateurs)
export const updateUser = (userId, userData, refetchUsers = false) =>
  async (dispatch) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}`,
        userData
      );

      if (res.status === 200) {
        // Met à jour un utilisateur dans Redux
        dispatch({ type: UPDATE_USER, payload: res.data });
        if (refetchUsers) {
          const usersRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/user`
          );
          dispatch({ type: GET_USERS, payload: usersRes.data });
        }
      }
    } catch (error) {
      console.error("Error updating user:", error.response || error.message);
    }
  };

// Mise à jour de l'avatar utilisateur
export const updateAvatar = (userId, pictureUrl) => {
  return async (dispatch) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/user/avatar`;
      const res = await axios.put(apiUrl, { userId, picture: pictureUrl });
      dispatch({ type: "UPDATE_AVATAR", payload: res.data.user });
    } catch (err) {
      console.error(
        "Erreur lors de la mise à jour de l'avatar :",
        err.response?.data || err.message
      );
      throw err;
    }
  };
};

// Mise à jour de la bio
export const updateBio = (userId, bio) => {
  return (dispatch) => {
    return axios
      .put(`${import.meta.env.VITE_API_URL}/api/user/` + userId, { bio })
      .then(() => {
        dispatch({ type: UPDATE_BIO, payload: bio });
      })
      .catch((err) => console.log(err));
  };
};

// Suivre un utilisateur
export const followUser = (followerId, idToFollow) => {
  return (dispatch) => {
    return axios
      .patch(`${import.meta.env.VITE_API_URL}/api/user/follow/` + followerId, {
        idToFollow,
      })
      .then(() => {
        dispatch({ type: FOLLOW_USER, payload: { idToFollow } });
      })
      .catch((err) => console.log(err));
  };
};

// Ne plus suivre un utilisateur
export const unfollowUser = (followerId, idToUnFollow) => {
  return (dispatch) => {
    return axios
      .patch(
        `${import.meta.env.VITE_API_URL}/api/user/unfollow/` + followerId,
        {
          idToUnFollow,
        }
      )
      .then(() => {
        dispatch({ type: UNFOLLOW_USER, payload: { idToUnFollow } });
      })
      .catch((err) => console.log(err));
  };
};
