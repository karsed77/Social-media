import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RingLoader } from "react-spinners";
import { getPosts } from "../../actions/post.action";
import { getUsers } from "../../actions/users.action";
import Card from "../posts/Card";
import { isEmpty } from "../utils/Utils";

function Thread() {
  const [loadPost, setLoadPost] = useState(true);
  const [count, setCount] = useState(5);

  // Récupérer les posts du store Redux
  const posts = useSelector((state) => state.postReducer);
  const dispatch = useDispatch();

  // Charger les posts au montage et lors du scroll
  useEffect(() => {
    if (loadPost) {
      dispatch(getPosts(count));
      setLoadPost(false);
      setCount(count + 5);
    }
    window.addEventListener("scroll", loadMore);
    return () => window.removeEventListener("scroll", loadMore);
  }, [loadPost, dispatch, count]);

  // Charger les utilisateurs
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Fonction pour charger plus de posts lorsque l'utilisateur scrolle en bas
  const loadMore = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.scrollingElement.scrollHeight
    ) {
      setLoadPost(true);
    }
  }, []);

  return (
    <div className="thread-container">
      <ul>
        {!isEmpty(posts[0]) &&
          posts.map((post) => {
            return <Card post={post} key={post._id} />;
          })}
      </ul>
      {loadPost && (
        <div className="loader">
          <RingLoader color="#36D7B7" size={50} />
        </div>
      )}
    </div>
  );
}

export default Thread;
