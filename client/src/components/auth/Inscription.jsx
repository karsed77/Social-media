import axios from "axios";
import { useState } from "react";
import Connection from "./Connection";

function Inscription() {
  const [formSubmit, setFormSubmit] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  // Gestion de l'inscription d'un utilisateur
  const handleRegister = async (e) => {
    e.preventDefault();
    const terms = document.getElementById("terms");
    const pseudoError = document.querySelector(".pseudo.error");
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");
    const passwordConfError = document.querySelector(".passwordConf.error");
    const termsError = document.querySelector(".terms.error");

    // Réinitialiser les erreurs
    if (password !== passwordConf || !terms.checked) {
      if (password !== passwordConf) {
        passwordConfError.innerHTML = "Les mots de passe ne correspondent pas";
      } else {
        passwordConfError.innerHTML = "";
      }
      if (!terms.checked) {
        termsError.innerHTML = "Veuillez accepter les conditions d'utilisation";
      } else {
        termsError.innerHTML = "";
      }
    } else {
      await axios({
        method: "post",
        url: `${import.meta.env.VITE_API_URL}/api/user/register`,
        withCredentials: true,
        data: {
          pseudo,
          email,
          password,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.data.errors) {
            pseudoError.innerHTML = res.data.errors.pseudo;
            emailError.innerHTML = res.data.errors.email;
            passwordError.innerHTML = res.data.errors.password;
          } else {
            setFormSubmit(true);
          }
        })
        .catch((err) => {
          console.error("Erreur Axios :", err);
        });
    }
  };

  return (
    <>
      {formSubmit ? (
        <>
          <Connection />
          <br />
          <h4 className="success">
            {" "}
            Inscription réussi, vous pouvez vous connecter{" "}
          </h4>
        </>
      ) : (
        <div className="box">
          <div className="square" style={{ "--i": 0 }}></div>

          {/* Formulaire d'inscriprtion */}
          <form onSubmit={handleRegister} id="sign-up-form">
            <label htmlFor="pseudo">Pseudo</label>
            <br />
            <input
              type="text"
              name="pseudo"
              placeholder="Pseudo"
              id="pseudo"
              onChange={(e) => setPseudo(e.target.value)}
              value={pseudo}
            />
            <div className="pseudo error"> </div>
            <br />

            <label htmlFor="email">Email</label>
            <br />
            <input
              type="text"
              name="email"
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
              name="password"
              placeholder="Mot de passe"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="password error"> </div>
            <br />

            <label htmlFor="passwordConf">Confirmer mot de passe</label>
            <br />
            <input
              type="password"
              name="password"
              placeholder="Confirmer mot de passe"
              id="passwordConf"
              onChange={(e) => setPasswordConf(e.target.value)}
              value={passwordConf}
            />
            <div className="passwordConf error"> </div>
            <br />
            <input type="checkbox" id="terms" />
            <p htmlFor="terms">
              J&apos;accepte les{" "}
              <a href="/CG" target="_blank" rel="noopener noreferrer">
                conditions d&apos;utilisation
              </a>
            </p>
            <div className="terms error"> </div>
            <br />
            <button type="submit" value="S'inscrire">
              S&apos;inscrire
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Inscription;
