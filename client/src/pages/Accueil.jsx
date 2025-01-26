import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUsers } from "../actions/users.action";
import { UidContext } from "../components/context/AppContext";
import LeftNavBar from "../components/layout/LeftNavBar";
import ScrollToTopButton from "../components/layout/ScrollToTopButton";
import NewPost from "../components/Posts/NewPost";
import Friends from "../components/profil/Friends";
import Thread from "../components/shared/Thread";
import Trends from "../components/shared/Trends";

function Accueil() {
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div className="home">
      <LeftNavBar />
      <div className="main">
        {uid && <NewPost />}
        {uid && <Thread />}
      </div>
      <div className="right-side">
        <div className="right-side-container">
          {uid && <Trends />}
          {uid && <Friends />}
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default Accueil;
