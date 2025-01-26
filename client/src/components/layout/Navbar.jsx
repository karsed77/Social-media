import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Deconnexion from "../auth/Deconnexion";
import { UidContext } from "../context/AppContext";

function Navbar() {
  const uid = useContext(UidContext);
  const userData = useSelector((state) => state.userReducer);

  // État pour gérer le menu burger
  const [isOpen, setIsOpen] = useState(false);

  // Fermer le menu lorsqu'on clique à l'extérieur
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".burger-menu")) {
        setIsOpen(false);
      }
    };
    // Ajout d'un écouteur d'événement pour gérer les clics à l'extérieur du menu
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Bascule du menu burger
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <div className="nav-container">
        {/* LOGO */}
        <div className="logo">
          <NavLink to={uid ? "/acceuil" : "/"}>
            <img src="./img/Bird_logo.png" alt="logo" />
          </NavLink>
        </div>

        {/* MENU BURGER */}
        <div className="burger-menu">
          {/* Icône burger animée */}
          <div
            className={`burger-icon ${isOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Menu déroulant */}
          <div className={`menu-links ${isOpen ? "show" : ""}`}>
            <ul>
              <li>
                <NavLink to="/acceuil" onClick={() => setIsOpen(false)}>
                  Accueil
                </NavLink>
              </li>
              <li>
                <NavLink to="/tendance" onClick={() => setIsOpen(false)}>
                  Tendance
                </NavLink>
              </li>
              <li>
                <NavLink to="/profil" onClick={() => setIsOpen(false)}>
                  Profil
                </NavLink>
              </li>
              <li>
                <Deconnexion />
              </li>
            </ul>
          </div>
        </div>
        {/* LIENS POUR GRAND ÉCRAN */}
        {uid && (
          <ul className="nav-links">
            <li>
              <NavLink to="/profil">
                <h5 className="welcome">
                  Bienvenue {userData?.pseudo || "Utilisateur"}
                </h5>
              </NavLink>
            </li>
            <li>
              <Deconnexion />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
