import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RingLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkAuth } from "./actions/auth.action";
import { getUser } from "./actions/user.action";
import { UidContext } from "./components/context/AppContext";
import Routes from "./components/Routes/Routing";

const App = () => {
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Vérification de l'authentification de l'utilisateur au chargement de l'application et récupération de son id
  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/jwtid`, {
          withCredentials: true,
        });

        if (res.data && res.data.id) {
          setUid(res.data.id);
          dispatch(getUser(res.data.id));
        } else {
          setUid(null);
        }
      } catch (err) {
        console.error(
          "Erreur lors de la vérification d'authentification :",
          err.message
        );
        setUid(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuth();
    dispatch(checkAuth());
  }, [dispatch]);

  // Affichage d'un spinner de chargement si l'application est en cours de chargement
  if (isLoading) {
    return (
      <div className="loading-container">
        <RingLoader color="#f5f5f5" size={60} />
      </div>
    );
  }

  return (
    <UidContext.Provider value={uid}>
      <ToastContainer />
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
