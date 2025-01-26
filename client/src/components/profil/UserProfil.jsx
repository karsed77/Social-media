import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { getUserProfil } from "../../actions/user.action";
import { dateParser } from "../utils/Utils";
import FollowHandler from "./FollowHandler";

const UserProfil = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfil = useSelector((state) => state.userProfilReducer);
  const userData = useSelector((state) => state.userReducer);

  // Récupération des données du profil utilisateur au chargement du composant
  useEffect(() => {
    const fetchUserProfil = async () => {
      await dispatch(getUserProfil(id));
      setIsLoading(false);
    };
    fetchUserProfil();
  }, [id, dispatch]);

  return (
    <div className="popup-profil-container">
      <div className="modal">
        {isLoading ? (
          isLoading && (
            <RingLoader color={"#f5f5f5"} size={60} speedMultiplier={1} />
          )
        ) : (
          <>
            <div className="modal-header">
              <h3>Profil de {userProfil.pseudo}</h3>
              <span
                className="cross"
                role="button"
                aria-label="Fermer"
                onClick={() => navigate(-1)}
              >
                &#10005;
              </span>
            </div>

            <div className="modal-content">
              <div className="head-content">
                <img
                  src={
                    userProfil.picture && userProfil.picture.startsWith("http")
                      ? userProfil.picture
                      : `${import.meta.env.VITE_API_URL.replace(
                          /\/+$/,
                          ""
                        )}/${userProfil.picture.replace(/^\.?\//, "")}`
                  }
                  alt="user-pic"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-images/random-user.jpg";
                  }}
                />
                {/* <h4>{userProfil.pseudo}</h4> */}
                <p>Membre depuis : {dateParser(userProfil.createdAt)}</p>
              </div>
              <div className="middle-content">
                <h3>Bio</h3>
                <p>{userProfil.bio}</p>
                <div className="stats">
                  <h3>Statistiques</h3>
                  <ul>
                    <li>
                      <span>
                        {userProfil.posts && userProfil.posts.length > 0
                          ? userProfil.posts.length
                          : 0}
                      </span>{" "}
                      -{" "}
                      {userProfil.posts && userProfil.posts.length > 1
                        ? "Publications"
                        : "Publication"}
                    </li>
                    <li>
                      <span>
                        {userProfil.followers ? userProfil.followers.length : 0}
                      </span>{" "}
                      -{" "}
                      {userProfil.followers && userProfil.followers.length > 1
                        ? "Abonnés"
                        : "Abonné"}
                    </li>
                    <li>
                      <span>
                        {userProfil.following ? userProfil.following.length : 0}
                      </span>{" "}
                      -{" "}
                      {userProfil.following && userProfil.following.length > 1
                        ? "Abonnements"
                        : "Abonnement"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-modal">
              {userProfil._id !== userData._id && (
                <FollowHandler
                  idToFollow={userProfil._id}
                  type={"suggestion"}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfil;
