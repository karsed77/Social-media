import axios from "axios";
import cookie from "js-cookie";

function Deconnexion() {
  // Supprimer les cookies de l'utilisateur connecté lors de la déconnexion
  const removeCookies = (key) => {
    if (window !== "undefined") {
      cookie.remove(key, { expires: 1 });
    }
  };

  // Déconnexion de l'utilisateur
  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
        withCredentials: true,
      });
      removeCookies("jwt"); // Supprime le cookie JWT
      // Redirection après la déconnexion de l'utilisateur
      window.location = "/login";
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };
  
  return (
    <div onClick={logout} className="logout-button">
    <img src="./img/icons/logout.svg" alt="logout" />
  </div>
  );
}

export default Deconnexion;
