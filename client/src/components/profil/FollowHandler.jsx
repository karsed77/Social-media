import propTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../utils/Utils";
import { followUser, unfollowUser } from "../../actions/user.action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FollowHandler({ idToFollow, type }) {
  const userData = useSelector((state) => state.userReducer);
  const [isFollowed, setIsFollowed] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state) =>
    state.usersReducer.find((user) => user._id === idToFollow)
  );

  // Suivre un utilisateur
  const handleFollow = async () => {
    try {
      await dispatch(followUser(userData._id, idToFollow));
      setIsFollowed(true);
      toast.success(`Vous suivez maintenant ${user.pseudo} 🎉!`, {
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
      console.error("Erreur détectée :", err.message);
      toast.error("Erreur lors du suivi 😔. Veuillez réessayer.");
    }
  };

  // Désabonner un utilisateur suivi
  const handleUnfollow = async () => {
    try {
      await dispatch(unfollowUser(userData._id, idToFollow));
      setIsFollowed(false);
      toast.info(`Vous ne suivez plus ${user.pseudo} ! 😔 `, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progressClassName: "custom-progress-bar_error",
      });
    } catch (err) {
      console.error("Erreur détectée :", err.message);
      toast.error("Erreur lors du désabonnement 😔. Veuillez réessayer.");
    }
  };

  // Vérifier si l'utilisateur est déjà suivi
  useEffect(() => {
    if (!isEmpty(userData.following)) {
      if (userData.following.includes(idToFollow)) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
    }
  }, [userData, idToFollow]);

  return (
    <>
      {isFollowed && !isEmpty(userData) && (
        <span onClick={handleUnfollow}>
          {type === "suggestion" && (
            <button className="unfollow-btn">Abonné</button>
          )}
          {type === "card" && (
            <img src="./img/icons/toggle-on.svg" alt="checked" />
          )}
        </span>
      )}
      {isFollowed === false && !isEmpty(userData) && (
        <span onClick={handleFollow}>
          {type === "suggestion" && (
            <button className="follow-btn">Suivre</button>
          )}
          {type === "card" && (
            <img src="./img/icons/toggle-off.svg" alt="check" />
          )}
        </span>
      )}
    </>
  );
}

export default FollowHandler;

FollowHandler.propTypes = {
  idToFollow: propTypes.string.isRequired,
  type: propTypes.string.isRequired,
};
