import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getPosts } from "../../actions/post.action";
import propTypes from "prop-types";
import { isEmpty, timestampParser } from "../utils/Utils";
import FollowHandler from "../profil/FollowHandler";
import EditComments from "./EditComments";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Picker from "emoji-picker-react";

function Comments({ post }) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Récupérer les données utilisateur et erreurs depuis Redux
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const dispatch = useDispatch();

  // Prétraiter les données utilisateurs
  const usersMap = !isEmpty(usersData)
    ? Object.fromEntries(usersData.map((user) => [user._id, user.picture]))
    : {};

  // Gestion de l'ajout d'un commentaire à un post
  const handleComment = (e) => {
    e.preventDefault();
    // Vérifier si le commentaire n'est pas vide
    if (text) {
      dispatch(addComment(post._id, userData._id, text, userData.pseudo))
        .then(() => dispatch(getPosts()))
        .then(() => setText(""));
      // Afficher les notifications
      toast.success("Votre commentaire a été ajouté ! 🎉", {
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
      toast.error("Le commentaire est vide ! 😕", {
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
  };

  // Ajouter un emoji au message
  const onEmojiClick = (emojiObject) => {
    setText((prevMessage) => (prevMessage || "") + emojiObject.emoji);
  };

  // Gestion de l'affichage du sélecteur d'emojis en dehors du composant
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".emoji-picker-container")) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="comments-container">
      {post.comments.map((comment, index) => {
        return (
          <div
            key={comment._id || `comment-${index}`}
            className={
              comment.commenterId === userData._id
                ? "comment-container client"
                : "comment-container"
            }
          >
            <div className="left-part">
              <img
                src={usersMap[comment.commenterId] || "/default-avatar.jpg"}
                alt="commenter-pic"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-images/random-user.jpg";
                }}
              />
            </div>
            <div className="right-part">
              <div className="comment-header">
                <div className="pseudo">
                  <h3>{comment.commenterPseudo} </h3>
                  {comment.commenterId &&
                    comment.commenterId !== userData._id && (
                      <FollowHandler
                        idToFollow={comment.commenterId}
                        type={"card"}
                      />
                    )}
                </div>
                <span> {timestampParser(comment.timestamp)} </span>
              </div>
              <p>{comment.text} </p>
              <EditComments comment={comment} postId={post._id} />
            </div>
          </div>
        );
      })}
      <form onSubmit={handleComment} className="comment-form">
        <input
          className="comment-input"
          type="text"
          name="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Laisser un commentaire..."
        />
        <br />
        <div className="button">
          <input type="submit" value="Envoyer" />
        </div>

        {/* Bouton pour ouvrir le sélecteur d'emojis */}
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
      </form>
    </div>
  );
}

export default Comments;

Comments.propTypes = {
  post: propTypes.object.isRequired,
};
