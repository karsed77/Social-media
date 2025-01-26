import { NavLink } from "react-router-dom";

function LeftNavBar() {
  return (
    <div className="left-nav-container">
      <div className="icons">
        <div className="icons-bis">
          <NavLink
            to="/acceuil"
            className={({ isActive }) =>
              isActive ? "active-left-nav" : undefined
            }
          >
            <img src="./img/icons/home.svg" alt="home" />
          </NavLink>

          <br />
          <NavLink
            to="/tendance"
            className={({ isActive }) =>
              isActive ? "active-left-nav" : undefined
            }
          >
            <img src="./img/icons/graph.svg" alt="tendance" />
          </NavLink>

          <br />
          <NavLink
            to="/profil"
            className={({ isActive }) =>
              isActive ? "active-left-nav" : undefined
            }
          >
            <img src="./img/icons/user.svg" alt="profil" />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default LeftNavBar;
