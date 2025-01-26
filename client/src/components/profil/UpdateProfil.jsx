import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateBio } from "../../actions/user.action";
import { dateParser, isEmpty } from "../utils/Utils";
// Import des composants
import LeftNav from "../layout/LeftNavBar";
import AvatarSelector from "./AvatarSelector";
import FollowHandler from "./FollowHandler";
// Import des styles
import RingLoader from "react-spinners/RingLoader";
import { toast, ToastContainer } from "react-toastify";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Récupération des données utilisateur et erreurs depuis Redux
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const error = useSelector((state) => state.errorReducer.userError);
  const dispatch = useDispatch();

  // Gestion des popups pour les abonnements et abonnés
  const [followingPopup, setFollowingPopup] = useState(false);
  const [followersPopup, setFollowersPopup] = useState(false);

  // Gestion de la mise à jour de la bio utilisateur
  const handleUpdate = () => {
    if (!userData || !userData._id) {
      console.error("userData ou _id est indéfini :", userData);
      return;
    }
    try {
      dispatch(updateBio(userData._id, bio));
      setUpdateForm(false);
      toast.success("Bio mise à jour avec succès !", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "custom-toast_success",
        progressClassName: "custom-progress-bar",
      });
    } catch (err) {
      // Gestion des erreurs
      console.error("Erreur détectée :", err.message);
      toast.error(
        "Erreur lors de la mise à jour de la bio 😔. Veuillez réessayer."
      );
      dispatch(updateBio(userData._id, bio));
      setUpdateForm(false);
    }
  };
  // Gestion de l'état de chargement
  useEffect(() => {
    if (isEmpty(userData) || !userData._id) {
      dispatch(getUser("USER_ID_PAR_DÉFAUT")); // Remplacez USER_ID_PAR_DÉFAUT par une valeur réelle.
    } else {
      setIsLoading(false);
    }
  }, [userData, dispatch, isLoading]);

  // Mise à jour automatique après upload de la photo de profil (événement personnalisé)
  useEffect(() => {
    if (!userData || !userData._id) return;
    const handlePictureUpdate = () => {
      dispatch(getUser(userData._id));
    };

    // Écoute l'événement personnalisé
    window.addEventListener("profilPictureUpdated", handlePictureUpdate);

    return () => {
      // Nettoie l'événement lorsqu'on quitte le composant
      window.removeEventListener("profilPictureUpdated", handlePictureUpdate);
    };
  }, [dispatch, userData._id, userData]);

  // Affichage de la page de profil utilisateur (chargement ou données utilisateur)
  if (isLoading || !userData._id) {
    return (
      <div className="loading-container">
        <RingLoader color="#f5f5f5" size={60} speedMultiplier={1} />
      </div>
    );
  }

  return (
    <div>
      <LeftNav />
      <div className="profil-container">
        <h1> Profil de {userData.pseudo}</h1>
        <div className="update-container">
          {/* Partie gauche */}
          <div className="left-part">
            <h3>Photo de profil</h3>
            <img
              src={userData.picture}
              alt="user-pic"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-images/random-user.jpg";
              }}
            />
            <AvatarSelector />
            <p>{error.maxSize}</p>
            <p>{error.format}</p>
          </div>
          {/* Partie droite */}
          <div className="right-part">
            {/*Editer BIO */}
            <div className="bio-update">
              <h3>Bio</h3>
              <ToastContainer />
              {updateForm === false && (
                <>
                  <p onClick={() => setUpdateForm(!updateForm)}>
                    {userData.bio}
                  </p>
                  <button onClick={() => setUpdateForm(!updateForm)}>
                    Modifier bio
                  </button>
                </>
              )}

              {updateForm && (
                <>
                  <textarea
                    type="text"
                    defaultValue={userData.bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                  <button onClick={handleUpdate}>Valider modifications</button>
                </>
              )}
            </div>
            <h4>Membre depuis le : {dateParser(userData.createdAt)}</h4>
            <h5 onClick={() => setFollowingPopup(true)}>
              {userData.following
                ? userData.following.length > 1
                  ? "Abonnements"
                  : "Abonnement"
                : ""}{" "}
              : {userData.following ? userData.following.length : ""}
            </h5>
            <h5 onClick={() => setFollowersPopup(true)}>
              {userData.followers
                ? userData.followers.length > 1
                  ? "Abonnés"
                  : "Abonné"
                : ""}{" "}
              : {userData.followers ? userData.followers.length : ""}
            </h5>
          </div>
        </div>
        {/* Accès à la liste des abonnements */}
        {followingPopup && (
          <div className="popup-profil-container">
            <div className="modal">
              <h3>
                {userData.following
                  ? userData.following.length > 1
                    ? "Abonnements"
                    : "Abonnement"
                  : ""}{" "}
              </h3>
              <span className="cross" onClick={() => setFollowingPopup(false)}>
                &#10005;
              </span>
              <ul>
                {usersData.map((user) => {
                  for (let i = 0; i < userData.following.length; i++) {
                    if (user._id === userData.following[i]) {
                      return (
                        <li key={user._id}>
                          <img
                            src={user.picture}
                            alt="user-pic"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-images/random-user.jpg";
                            }}
                          />
                          <h4>{user.pseudo}</h4>
                          <div className="follow-handler">
                            <FollowHandler
                              idToFollow={user._id}
                              type={"suggestion"}
                            />
                          </div>
                        </li>
                      );
                    }
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        )}
        {/* Accès à la liste des abonnés */}
        {followersPopup && (
          <div className="popup-profil-container">
            <div className="modal">
              <h3>
                {" "}
                {userData.followers
                  ? userData.followers.length > 1
                    ? "Abonnés"
                    : "Abonné"
                  : ""}
              </h3>
              <span className="cross" onClick={() => setFollowersPopup(false)}>
                &#10005;
              </span>
              <ul>
                {usersData.map((user) => {
                  for (let i = 0; i < userData.followers.length; i++) {
                    if (user._id === userData.followers[i]) {
                      return (
                        <li key={user._id}>
                          <img
                            src={user.picture}
                            alt="user-pic"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-images/random-user.jpg";
                            }}
                          />
                          <h4>{user.pseudo}</h4>
                          <div className="follow-handler">
                            <FollowHandler
                              idToFollow={user._id}
                              type={"suggestion"}
                            />
                          </div>
                        </li>
                      );
                    }
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateProfil;
