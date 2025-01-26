import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../utils/Utils";
import FollowHandler from "./FollowHandler";

const Friends = () => {
  const [playOnce, setPlayOnce] = useState(true);
  const [friends, setFriends] = useState([]);
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);

  // Récupération des suggestions d'amis
  useEffect(() => {
    const notFriendList = () => {
      let array = [];
      usersData.map((user) => {
        if (user._id !== userData._id && !user.followers.includes(userData._id))
          return array.push(user._id);
      });
      array.sort(() => 0.5 - Math.random());
      // Affichage des suggestions d'amis en fonction de la taille de l'écran
      if (window.innerHeight > 780) {
        array.length = 6;
      } else if (window.innerHeight > 720) {
        array.length = 4;
      } else if (window.innerHeight > 615) {
        array.length = 3;
      } else if (window.innerHeight > 540) {
        array.length = 1;
      } else {
        array.length = 0;
      }
      setFriends(array);
    };

    // Si les données utilisateurs ne sont pas vides et que l'utilisateur est connecté, on affiche les suggestions d'amis
    if (playOnce && !isEmpty(usersData[0]) && !isEmpty(userData._id)) {
      notFriendList();
      setPlayOnce(false);
    }
  }, [usersData, userData, playOnce]);

  return (
    <div className="get-friends-container">
      <h4>Suggestions d&apos;amis</h4>

      <ul>
        {friends &&
          friends.map((user) => {
            for (let i = 0; i < usersData.length; i++) {
              if (user === usersData[i]._id) {
                return (
                  <li className="user-hint" key={user}>
                    <img src={usersData[i].picture} alt="user-pic" 
                     onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-images/random-user.jpg";
                    }}
                    />
                    <p>{usersData[i].pseudo}</p>
                    <FollowHandler
                      idToFollow={usersData[i]._id}
                      type={"suggestion"}
                    />
                  </li>
                );
              }
            }
          })}
      </ul>
    </div>
  );
};

export default Friends;
