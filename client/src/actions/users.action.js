import axios from 'axios';

export const GET_USERS = 'GET_USERS';
export const UPDATE_USER = "UPDATE_USER";

// Récupérer les utilisateurs depuis la base de données 
export const getUsers = () => async (dispatch) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`);
    dispatch({ type: GET_USERS, payload: res.data });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    dispatch({ type: GET_USERS, payload: [] }); 
  }
};





