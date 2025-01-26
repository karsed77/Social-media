import Picker from "emoji-picker-react";
import proptype from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteComment, editComment } from "../../actions/post.action";
import { UidContext } from "../context/AppContext";

function EditComments({ comment, postId }) {
  const [isAuthor, setIsAuthor] = useState(false);
  const [edit, setEdit] = useState(false);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Récupérer l'identifiant utilisateur connecté
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  // Fonction pour éditer un commentaire
  const handleEdit = (e) => {
    e.preventDefault();
    if (text) {
      dispatch(editComment(postId, comment._id, text));
      setText("");
      setEdit(false);
      // Afficher une notification
      toast.success("Votre commentaire a été modifié ! 🎉", {
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
  };

  // Fonction pour supprimer un commentaire
  const handleDelete = () => dispatch(deleteComment(postId, comment._id));

  // Vérifie si l'utilisateur est l'auteur du commentaire
  useEffect(() => {
    const checkAuthor = () => {
      if (uid === comment.commenterId) {
        setIsAuthor(true);
      }
    };
    checkAuthor();
  }, [uid, comment.commenterId]);

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
    <div className="edit-comment">
      {isAuthor && edit === false && (
        <span onClick={() => setEdit(!edit)}>
          <img src="./img/icons/edit.svg" alt="edit-comment" />{" "}
        </span>
      )}
      {isAuthor && edit && (
        <form action="" onSubmit={handleEdit} className="edit-comment-form">
          <label htmlFor="text" onClick={() => setEdit(!edit)}>
            Fermer
          </label>
          <br />
          <input
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text || comment.text}
          />
          <br />
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
          <br />
          <div className="btn">
            <span
              onClick={() => {
                if (window.confirm("Voulez supprimer ce commentaire ?")) {
                  handleDelete();
                  toast.success("Votre commentaire a bien été supprimé ! 🗑️", {
                    position: "bottom-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    className: "custom-toast_success",
                    progressClassName: "custom-progress-bar",
                  });
                }
              }}
            >
              <img src="./img/icons/trash.svg" alt="delete" />
            </span>

            <input type="submit" value="Valider " />
          </div>
        </form>
      )}
    </div>
  );
}

export default EditComments;

EditComments.propTypes = {
  comment: proptype.object.isRequired,
  postId: proptype.string.isRequired,
};
