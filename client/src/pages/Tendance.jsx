import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrends } from "../actions/post.action";
import { UidContext } from "../components/context/AppContext";
import LeftNavBar from "../components/layout/LeftNavBar";
import Card from "../components/posts/Card";
import Friends from "../components/profil/Friends";
import Trends from "../components/shared/Trends";
import { isEmpty } from "../components/utils/Utils";

function Tendance() {
  // Récupère l'ID utilisateur connecté via le contexte
  const uid = useContext(UidContext);
  const trendList = useSelector((state) => state.trendingReducer);
  const dispatch = useDispatch();

  // Recharger les posts tendance à chaque changement dans les posts globaux
  useEffect(() => {
    dispatch(getTrends());
  }, [dispatch]);

  return (
    <div className="trending-page">
      {uid && <LeftNavBar />}
      <div className="main">
        <ul>
          {!isEmpty(trendList[0]) &&
            trendList.map((post) => <Card post={post} key={post._id} />)}
        </ul>
      </div>
      <div className="right-side">
        <div className="right-side-container">
          {uid && <Trends />}
          {uid && <Friends />}
        </div>
      </div>
    </div>
  );
}

export default Tendance;
