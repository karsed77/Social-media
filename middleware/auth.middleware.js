const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Vérifie si l'utilisateur est connecté ou non en vérifiant le token stocké dans les cookies
module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        // Supprime le cookie si le token est invalide
        res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        if (!user) {
          res.locals.user = null;
          res.cookie("jwt", "", { httpOnly: true, maxAge: 1 }); 
        } else {
          res.locals.user = user;
        }
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//  Vérifie si l'utilisateur est connecté ou non en vérifiant le token stocké dans les cookies

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Vérifie si un token est présent
  if (!token) {
    return res.status(401).json({ message: "Aucun token fourni." });
  }

  // Vérifie et décode le token
  jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(400).json({ message: "Token invalide." });
    } else {
      try {
        const user = await UserModel.findById(decodedToken.id);
        console.log("Utilisateur trouvé :", user);
        if (!user) {
          return res.status(404).json({ message: "Utilisateur introuvable." });
        }
        res.locals.user = user;
        next();
      } catch (error) {
        console.error("Erreur serveur :", error);
        return res.status(500).json({ message: "Erreur serveur." });
      }
    }
  });
};
