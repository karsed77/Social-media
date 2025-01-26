import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateAvatar } from "../../actions/user.action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import avatarsData from "../../assets/avatar.json";

const AvatarSelector = () => {
  const [tempAvatar, setTempAvatar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTempAvatar, setShowTempAvatar] = useState(false);
  const [groupedAvatars, setGroupedAvatars] = useState({});

  // Récupérer les données utilisateur depuis Redux
  const userData = useSelector((state) => state.userReducer);
  const [selectedAvatar, setSelectedAvatar] = useState(userData.picture);
  const dispatch = useDispatch();

  // Grouper les avatars par thème
  useEffect(() => {
    const grouped = avatarsData.reduce((acc, avatar) => {
      if (!acc[avatar.theme]) acc[avatar.theme] = [];
      acc[avatar.theme].push(avatar);
      return acc;
    }, {});
    setGroupedAvatars(grouped);
  }, []);

  // Ouvrir la modale de sélection d'avatar
  const openModal = () => {
    setTempAvatar(selectedAvatar); // Prévisualiser l'avatar actuel
    setIsModalOpen(true);
    setShowTempAvatar(true); // Afficher la petite image quand la modale est ouverte
  };

  // Mettre à jour l'avatar utilisateur
  const handleAvatarChange = async () => {
    try {
      await dispatch(updateAvatar(userData._id, tempAvatar));
      setSelectedAvatar(tempAvatar);
      setTempAvatar(null);
      setShowTempAvatar(false);
      setIsModalOpen(false);
      toast.success("Avatar mise à jour avec succès !", {
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
      console.error("Erreur lors de la mise à jour de l'avatar :", err);
      toast.error(
        "Erreur lors de la mise à jour de l'avatar.😔. Veuillez réessayer."
      );
    }
  };

  return (
    <div className="avatar-selector">
      {showTempAvatar && (
        <div>
          <h3>Votre avatar :</h3>
          <img
            src={tempAvatar || selectedAvatar}
            alt="Votre avatar"
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        </div>
      )}

      <button onClick={openModal}>Changer d&apos;avatar</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Choisissez un avatar</h4>
            {/* Conteneur global scrollable */}
            <div className="avatar-scroll-container">
              {Object.keys(groupedAvatars).map((theme) => (
                <div key={theme} className="theme-section">
                  <h5>{theme}</h5>
                  <div className="avatar-grid">
                    {groupedAvatars[theme].map((avatar) => (
                      <img
                        key={avatar.id}
                        src={avatar.url}
                        alt={avatar.name}
                        className={`avatar ${
                          tempAvatar === avatar.url ? "selected" : ""
                        }`}
                        onClick={() => setTempAvatar(avatar.url)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleAvatarChange}>Enregistrer</button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setTempAvatar(null);
                setShowTempAvatar(false);
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;
