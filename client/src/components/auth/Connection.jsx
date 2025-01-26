import axios from "axios";
import { useState } from "react";

function Connection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fonction pour se connecter
  const handleLogin = async (e) => {
    e.preventDefault();
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");

    axios({
      method: "post",
      url: `${import.meta.env.VITE_API_URL}/api/user/login`,
      withCredentials: true,
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        if (res.data.errors) {
          emailError.innerHTML = res.data.errors.email || "";
          passwordError.innerHTML = res.data.errors.password || "";
        } else {
          console.log("Navigation vers /acceuil après mise à jour.");

          window.location = "/acceuil";
        }
      })
      .catch((err) => {
        console.error("Erreur Axios :", err);
      });
  };
  
  return (
    <div className="box">
      <div className="square" style={{ "--i": 0 }}></div>
      {/* Formulaire de connection */}
      <form onSubmit={handleLogin} id="sign-up-form">
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="email error"> </div>
        <br />
        <label htmlFor="password">Mot de passe</label>
        <br />
        <input
          type="password"
          placeholder="Mot de passe"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="password error"> </div>
        <br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Connection;
