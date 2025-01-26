import { useContext } from "react";
import Log from "../components/auth/Log";
import { UidContext } from "../components/context/AppContext";
import UpdateProfil from "../components/profil/UpdateProfil";

function Profil() {
  // Récupère l'ID de l'utilisateur connecté
  const uid = useContext(UidContext);

  return (
    <div className="profil-page">
      {uid ? (
        <UpdateProfil />
      ) : (
        <div className="login-container">
          <Log connection={true} inscription={false} />
        </div>
      )}
    </div>
  );
}

export default Profil;
