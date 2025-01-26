import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getTrends } from "../../actions/post.action";
import { isEmpty } from "../utils/Utils";

const Trends = () => {
  // Récupération des posts, utilisateurs et tendances depuis Redux
  const posts = useSelector((state) => state.allPostsReducer);
  const usersData = useSelector((state) => state.usersReducer);
  const trendList = useSelector((state) => state.trendingReducer);
  const dispatch = useDispatch();

  // Trie les posts par nombre de likes et limite à 3 posts pour les tendances
  useEffect(() => {
    if (!isEmpty(posts)) {
      const postsArr = Array.isArray(posts) ? posts : Object.values(posts);
      // Trier les posts par nombre de likes
      const sortedArray = postsArr
        .slice()
        .sort((a, b) => b.likers.length - a.likers.length)
        .slice(0, 3);

      dispatch(getTrends(sortedArray));
    }
  }, [posts, dispatch]);

  return (
    <div className="trending-container">
      <h4>Tendances</h4>
      <NavLink to="/tendance">
        <ul>
          {trendList.length &&
            trendList.map((post) => {
              return (
                <li key={post._id}>
                  <div>
                    {post.picture && <img src={post.picture} alt="post-pic" />}
                    {post.video && (
                      <img
                        src={`https://img.youtube.com/vi/${
                          post.video.split("/embed/")[1]
                        }/hqdefault.jpg`}
                        alt="video-thumbnail"
                      />
                    )}
                    {isEmpty(post.picture) && isEmpty(post.video) && (
                      <img
                        src={
                          usersData[0] &&
                          usersData
                            .map((user) => {
                              if (user._id === post.posterId) {
                                return user.picture;
                              } else return null;
                            })
                            .join("")
                        }
                        alt="profil-pic"
                      />
                    )}
                  </div>
                  <div className="trend-content">
                    <p>{post.message}</p>
                    <span>Lire</span>
                  </div>
                </li>
              );
            })}
        </ul>
      </NavLink>
    </div>
  );
};

export default Trends;
