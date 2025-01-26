import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Connection from "./Connection";
import Inscription from "./Inscription";

function Log({ inscription, connection }) {
  // Un seul état pour gérer le modal actif : "register" ou "login"
  const [activeModal, setActiveModal] = useState(
    inscription ? "register" : "login"
  );
  const navigate = useNavigate();
  // Gérer l'affichage du modal actif
  const handleModals = (e) => {
    setActiveModal(e.target.id);
  };

  // Rediriger l'utilisateur vers la page de profil s'il n'est pas connecté ou inscrit
  useEffect(() => {
    if (!inscription && !connection) {
      navigate("/profil");
    }
  }, [inscription, connection, navigate]);

  return (
    <div className="connection-form">
      <div className="form-container">
        <ul>
          <li
            onClick={handleModals}
            id="register"
            className={activeModal === "register" ? "active-btn" : null}
          >
            S&apos;inscrire
          </li>
          <li
            onClick={handleModals}
            id="login"
            className={activeModal === "login" ? "active-btn" : null}
          >
            Se connecter
          </li>
        </ul>
        {activeModal === "register" && <Inscription />}
        {activeModal === "login" && <Connection />}
      </div>
    </div>
  );
}

Log.propTypes = {
  inscription: PropTypes.bool,
  connection: PropTypes.bool,
};

export default Log;
