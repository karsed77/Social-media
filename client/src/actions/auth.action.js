import axios from "axios";

export const LOGIN_USER = "LOGIN_USER";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const START_LOADING = "START_LOADING";
export const CHECK_AUTH = "CHECK_AUTH";

// Fonction pour démarrer le chargement
export const startLoading = () => {
  return { type: "START_LOADING" };
};

// Fonction pour connecter un utilisateur
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, credentials);
    dispatch({ type: LOGIN_USER, payload: res.data }); 
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    dispatch({ type: LOGIN_ERROR, payload: err.message }); 
  }
};

// Fonction pour vérifier si un utilisateur est connecté
export const checkAuth = () => async (dispatch) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/status`, {
      withCredentials: true,
    });
    dispatch({
      type: "CHECK_AUTH",
      payload: { isLoggedIn: !!res.data.user },
    });
  } catch (err) {
    console.error("Erreur lors de la vérification de l'authentification :", err.message);
    dispatch({
      type: "CHECK_AUTH",
      payload: { isLoggedIn: false },
    });
  }
};

