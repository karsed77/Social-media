import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addPost, getPosts } from "../../actions/post.action";
import { getUser } from "../../actions/user.action";
import { isEmpty, timestampParser } from "../utils/Utils";

function NewPost() {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [postPicture, setPostPicture] = useState(null);
  const [video, setVideo] = useState();
  const [file, setFile] = useState();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useDispatch();

  // Récupérer les données utilisateur et erreurs
  const prevUserId = useRef();
  const userData = useSelector((state) => state.userReducer);
  const error = useSelector((state) => state.errorReducer.postError);

  // Ajouter un emoji au message
  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  // Récupérer les données utilisateur au chargement du composant et à chaque changement d'ID utilisateur
  useEffect(() => {
    if (userData && userData._id && userData._id !== prevUserId.current) {
      prevUserId.current = userData._id;
      dispatch(getUser(userData._id));
    }
  }, [userData._id, dispatch, userData]);

  // Fermer le sélecteur d'emojis lors d'un clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".emoji-picker-container")) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Gérer l'ajout d'un post (message, image, vidéo)
  const handlePost = async () => {
    if (message && message.length > 400) {
      return toast.error("Votre message ne doit pas dépasser 400 caractères.", {
        position: "bottom-right",
        className: "custom-toast_error",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    const data = new FormData();
    data.append("posterId", userData._id);
    data.append("message", message);
    if (file && postPicture) data.append("file", file);
    if (video) data.append("video", video);

    try {
      const response = await dispatch(addPost(data));

      if (response.errors) {
        Object.values(response.errors).forEach((errorMessage) => {
          if (errorMessage) {
            toast.error(errorMessage, {
              position: "bottom-right",
              className: "custom-toast_error",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        });
        return;
      }
      dispatch(getPosts());
      cancelPost();

      toast.success("Votre publication a été ajoutée ! 🎉", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "custom-toast_success",
      });
    } catch (err) {
      console.error("Erreur lors de la publication :", err);

      // Affiche un toast pour les erreurs inattendues
      toast.error("Une erreur est survenue.", {
        position: "bottom-right",
        className: "custom-toast_error",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Prévisualisation d'une image
  const handlePicture = (e) => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo("");
  };

  // Annuler un post
  const cancelPost = () => {
    setMessage("");
    setPostPicture(null);
    setFile(null);
    setVideo(null);
  };

  // Gestion des vidéos YouTube
  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);

    const handleVideo = () => {
      if (!message || typeof message !== "string") return;

      let findLink = message.split(" ");
      for (let i = 0; i < findLink.length; i++) {
        if (
          findLink[i].includes("https://www.yout") ||
          findLink[i].includes("https://yout")
        ) {
          let embed = findLink[i].replace("watch?v=", "embed/");
          setVideo(embed.split("&")[0]);
          findLink.splice(i, 1);
          setMessage(findLink.join(" "));
          setPostPicture("");
        }
      }
    };
    handleVideo();
  }, [userData, message, video]);

  return (
    <div className="post-container">
      <div className="data">
        <p>
          <span>{userData.following ? userData.following.length : 0}</span>{" "}
          Abonnement
        </p>
        <p>
          <span>{userData.followers ? userData.followers.length : 0}</span>{" "}
          Abonné
        </p>
      </div>
      <NavLink to="/profil">
        <div className="user-info">
          {isLoading ? (
            <RingLoader color={"#f5f5f5"} size={60} speedMultiplier={1} />
          ) : (
            <>
              <img
                src={userData.picture}
                alt="user-pic"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-images/random-user.jpg";
                }}
              />
            </>
          )}

          <h3 className="pseudo1">{userData.pseudo}</h3>
        </div>
      </NavLink>

      <div className="post-form">
        <textarea
          name="message"
          id="message"
          placeholder="Quoi de neuf ?"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
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
        <div className="icon">
          {isEmpty(video) && (
            <>
              <img src="./img/icons/image-fill.svg" alt="img" />
              <input
                type="file"
                id="file-upload"
                name="file"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => handlePicture(e)}
              />
            </>
          )}
          {video && (
            <button onClick={() => setVideo(null)}>Supprimer vidéo</button>
          )}
        </div>

        {/* Prévisualisation des messages ou images */}
        {message || postPicture || video?.length > 20 ? (
          <li className="card-container">
            <div className="card-left">
              <img
                src={userData.picture}
                alt="user-pic"
              
              />
            </div>
            <div className="card-right">
              <div className="card-header">
                <div className="pseudo">
                  <h3>{userData.pseudo}</h3>
                </div>
                <span>{timestampParser(Date.now())}</span>
              </div>
              <div className="content">
                <p>{message}</p>
                {postPicture && <img src={postPicture} alt="post-pic" />}
                {video && (
                  <iframe
                    src={video}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video}
                  ></iframe>
                )}
              </div>
            </div>
          </li>
        ) : null}
        {/* Notification */}
        <ToastContainer />

        {/* Formulaire de publication */}
        <div className="footer-form">
          {!isEmpty(error.format) && <p>{error.format}</p>}
          {!isEmpty(error.maxSize) && <p>{error.maxSize}</p>}
          <div className="btn-send">
            {(message.trim() || postPicture || video?.length > 20) && (
              <button className="cancel" onClick={cancelPost}>
                Annuler
              </button>
            )}
            <button className="send" onClick={handlePost}>
              Envoyer
            </button>
          </div>
        </div>
      </div>
      {/* </>
      )} */}
    </div>
  );
}

export default NewPost;
