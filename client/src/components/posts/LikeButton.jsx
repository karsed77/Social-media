import prototype from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.action";
import { UidContext } from "../context/AppContext";

function LikeButton({ post }) {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  // Fonction pour liker un post
  const like = () => {
    dispatch(likePost(post._id, uid));
    setLiked(true);
  };

  // Fonction pour unliker un post
  const unlike = () => {
    dispatch(unlikePost(post._id, uid));
    setLiked(false);
  };

  // Vérifier si l'utilisateur a déjà liké le post
  useEffect(() => {
    if (post.likers.includes(uid)) setLiked(true);
    else setLiked(false);
  }, [uid, post.likers, liked]);

  return (
    <div className="like-container">
      {liked === false && (
        <img src="./img/icons/heart.svg" alt="like" onClick={like} />
      )}
      {liked === true && (
        <img src="./img/icons/heart-filled.svg" alt="unlike" onClick={unlike} />
      )}
      <span>{post.likers.length}</span>
    </div>
  );
}

export default LikeButton;

LikeButton.propTypes = {
  post: prototype.object.isRequired,
};
