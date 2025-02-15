const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { signUpErrors, signInErrors } = require("../utils/errors.utils");

// Durée de validité du cookie pour le token : 3 jours
const maxAge = 3 * 24 * 60 * 60 * 1000;

// Créer un token JWT pour l'authentification de l'utilisateur (3 jours)
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Inscription (POST) : /api/auth/register
module.exports.signUp = async (req, res) => {
  const { pseudo, email, password } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).send({ errors });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Connexion (POST)
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(200).json({ errors });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Déconnexion (GET) : /api/auth/logout
module.exports.logout = (req, res) => {
  console.log("Déconnexion demandée.");
  res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
  console.log("Cookie jwt supprimé.");
  res.status(200).json({ message: "Déconnexion réussie." });
};
