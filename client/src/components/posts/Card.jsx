import Picker from "emoji-picker-react";
import propTypes from "prop-types";
import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { toast } from "react-toastify";
import { updatePost } from "../../actions/post.action";
import FollowHandler from "../profil/FollowHandler";
import { dateParser } from "../utils/Utils";
import Comments from "./Comments";
import DeleteCard from "./DeleteCard";
import LikeButton from "./LikeButton";
import YouTubeEmbed from "./YoutubeEmbed";

const Card = memo(({ post }) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Référence pour la position du curseur dans le textarea
  const textareaRef = useRef(null);
  const cursorPositionRef = useRef(0);

  // Récupérer les données utilisateur depuis Redux
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();

  // Récupérer l'utilisateur qui a posté
  const user = (Array.isArray(usersData) &&
    usersData.find((u) => u._id === post.posterId)) || {
    pseudo: "Utilisateur inconnu",
    picture: "/default-avatar.jpg",
  };

  // Image de profil par défaut si l'utilisateur n'a pas de photo
  const profilePicture = user.picture
    ? user.picture
    : `${import.meta.env.VITE_API_URL}/default-images/random-user.jpg`;

  // Fin du chargement
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Ajout d'un emoji au texte
  const onEmojiClick = (emojiObject) => {
    setTextUpdate((prevMessage) => (prevMessage || "") + emojiObject.emoji);
  };

  // Gérer le clic à l'extérieur pour fermer le sélecteur d'emojis
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".emoji-picker-container")) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Mettre à jour le texte du post lors de la saisie
  const handleTextChange = (e) => {
    cursorPositionRef.current = e.target.selectionStart;
    setTextUpdate(e.target.value);
  };

  // Mettre à jour la position du curseur dans le textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(
        cursorPositionRef.current,
        cursorPositionRef.current
      );
    }
  }, [textUpdate]);

  // Valider la mise à jour du post
  const validateUpdate = () => {
    if (textUpdate !== post.message) {
      dispatch(updatePost(post._id, textUpdate));
      toast.success("Votre post a été modifié ! 🎉", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "custom-toast_success",
        progressClassName: "custom-progress-bar",
      });
    } else {
      toast.error("Pas de modification effectuer ! 😕", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "custom-toast_error",
        progressClassName: "custom-progress-bar_error",
      });
    }
    setIsUpdated(false);
  };

  // Fonction pour annuler la mise à jour du post
  const cancelUpdate = () => {
    setIsUpdated(false);
    setTextUpdate(post.message);
  };

  // Mettre le post en mode édition
  const handleEdit = () => {
    setTextUpdate(post.message || "");
    setIsUpdated(true);
    setTimeout(() => {
      // Met le focus sur le textarea après le render
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <li className="card-container" key={post._id}>
      <div className="card-left">
        {isLoading ? (
          <RingLoader color={"#f5f5f5"} size={60} speedMultiplier={1} />
        ) : (
          <>
            <img
              src={profilePicture}
              alt="poster-pic"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-images/random-user.jpg";
              }}
            />
          </>
        )}
      </div>
      <div className="card-right">
        <div className="card-header">
          <div className="pseudo">
            <NavLink to={`/profil/${post.posterId}`}>
              <h3>
                {usersData.find((user) => user._id === post.posterId)?.pseudo ||
                  "Utilisateur"}
              </h3>
            </NavLink>
            {/*  Bouton suivre */}
            {post.posterId !== userData._id && (
              <FollowHandler idToFollow={post.posterId} type={"card"} />
            )}
          </div>
          {/* Date */}
          <span className="date">{dateParser(post.createdAt)}</span>
        </div>

        {/* Editer le post */}
        {isUpdated ? (
          <div className="update-post">
            <textarea
              ref={textareaRef}
              value={textUpdate || ""}
              onChange={handleTextChange}
              autoFocus
            />
            {/* Boutons Annuler et Valider */}
            <div className="button-container">
              <button className="btn" onClick={cancelUpdate}>
                Annuler
              </button>
              <button className="btn" onClick={validateUpdate}>
                Valider
              </button>
            </div>
            {/* Sélecteur d'emojis */}
            <div className="emoji-picker-container">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker-popup">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>{post.message}</p>
        )}

        {/* Image associée au post */}
        {post.picture && (
          <img src={post.picture} alt="card-pic" className="card-pic" />
        )}

        {/* Vidéo associée au post */}
        {post.video && <YouTubeEmbed videoUrl={post.video} title={post._id} />}

        {/* Buttons Edit et delete */}
        {userData._id === post.posterId && (
          <div className="button-container">
            <div onClick={handleEdit}>
              <img src="./img/icons/edit.svg" alt="edit" />
            </div>
            <DeleteCard id={post._id} />
          </div>
        )}

        {/* Button Like */}
        <div className="card-footer">
          <div className="comment-icon">
            <img
              onClick={() => setShowComments(!showComments)}
              src="./img/icons/comment.svg"
              alt="comment"
            />
            <span>{post?.comments?.length || 0}</span>
          </div>
          <LikeButton post={post} />
        </div>

        {/* Commentaire */}
        {showComments && <Comments post={post} />}
      </div>
    </li>
  );
});

Card.displayName = "Card";

export default Card;

Card.propTypes = {
  post: propTypes.object.isRequired,
};
