import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import { RingLoader } from "react-spinners";
import Accueil from "../../pages/Accueil";
import CG from "../../pages/CG";
import Profil from "../../pages/Profil";
import Tendance from "../../pages/Tendance";
import Navbar from "../layout/Navbar";
import UserProfil from "../profil/UserProfil";

function Routing() {
  // Récupération de l'état d'authentification depuis Redux
  const isAuthenticated = useSelector((state) => state.authReducer.isLoggedIn);
  const isInitialized = useSelector((state) => state.authReducer.isInitialized);

  // État local pour le rendu final
  const [isReady, setIsReady] = useState(false);

  // Bloque le rendu jusqu'à ce que l'état global soit synchronisé
  useEffect(() => {
    if (isInitialized) {
      setTimeout(() => {
        setIsReady(true);
      }, 200);
    }
  }, [isInitialized]);

  // Affiche un loader tant que l'application n'est pas prête
  if (!isReady) {
    return (
      <div className="loading-container">
        <RingLoader color="#f5f5f5" size={60} />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/acceuil" element={<Accueil />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/CG" element={<CG />} />
        <Route path="/tendance" element={<Tendance />} />
        <Route path="/profil/:id" element={<UserProfil />} />

        {/* Redirection par défaut */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/acceuil" replace />
            ) : (
              <Navigate to="/profil" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default Routing;
