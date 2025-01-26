const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;


// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Récupérer tous les utilisateurs (GET) : /api/users
module.exports.getAllUsers = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs, en excluant le mot de passe
    const users = await userModel.find().select("-password");

    // Renvoyer les utilisateurs en JSON avec un statut 200
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error: err.message });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Récupérer un utilisateur par son ID (GET) : /api/users/:id
module.exports.userInfo = async (req, res) => {
    // Vérifier si l'ID est valide
    if (!ObjectID.isValid(req.params.id)) {
      return res.status(400).send(`ID utilisateur invalide : ${req.params.id}`);
    }
    console.log(`userInfo appelé avec ID : ${req.params.id}`);
    try {
      // Récupérer l'utilisateur par son ID, en excluant le mot de passe
      const user = await userModel.findById(req.params.id).select("-password");

      const posts = await postModel.find({ posterId: req.params.id }); // Cherche tous les posts liés à cet utilisateur

    // Si l'utilisateur n'existe pas dans la base de données on renvoie une erreur 404
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }
      console.log("Utilisateur trouvé :", user);
        // Retourne l'utilisateur avec ses posts
    res.status(200).json({ ...user._doc, posts });
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error: err.message });
    }
  };

//   :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour mettre à jour un utilisateur dans la base de données (PUT) : /api/users/:id
module.exports.updateUser = async (req, res) => {
  // Vérifiez si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send(`ID utilisateur invalide : ${req.params.id}`);
  }

  try {
    

    // Mettre à jour l'utilisateur avec les données de la requête (bio)
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { bio: req.body.bio } },
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options de mise à jour
    );
    // Si l'utilisateur n'existe pas dans la base de données on renvoie une erreur 404
    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Renvoyer l'utilisateur mis à jour en JSON avec un statut 200
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
    res.status(500).json({ message: "Erreur interne du serveur.", error: err.message });
  }
};


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: 
// Pour mettre à jour l'avatar d'un utilisateur  : /api/users/avatar 
module.exports.updateAvatar = async (req, res) => {
  try {
    console.log("Requête reçue dans updateAvatar :", req.body);

    const { userId, picture } = req.body;

    if (!userId || !picture) {
      return res.status(400).json({ message: "userId et picture sont requis." });
    }

    if (!ObjectID.isValid(userId)) {
      return res.status(400).json({ message: `ID utilisateur invalide : ${userId}` });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { picture },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({ message: "Avatar mis à jour avec succès", user: updatedUser });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'avatar :", err);
    res.status(500).json({ message: "Erreur serveur.", error: err.message });
  }
};


// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour supprimer un utilisateur de la base de données (DELETE) : /api/users/:id
module.exports.deleteUser = async (req, res) => {
    // Vérifiez si l'ID est valide
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send(`ID utilisateur invalide : ${req.params.id}`);
    }
    
    try {
        // Mettre à jour l'utilisateur
        const deletedUser = await userModel.findOneAndDelete({ _id: req.params.id });
        // Si l'utilisateur n'existe pas dans la base de données on renvoie une erreur 404
        if (!deletedUser) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
    
        // Renvoyer un message de succès
        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
      } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur :", err);
        res.status(500).json({ message: "Erreur interne du serveur.", error: err.message });
      }
    };
    
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour suivre un utilisateur (PATCH) : /api/users/follow/:id
module.exports.follow = async (req, res) => {
    // Vérifiez si l'ID est valide
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
      return res.status(400).send("ID utilisateur invalide. ")
    }
  
    try {
      // Ajouter l'utilisateur à la liste des abonnés de l'utilisateur connecté (following)
      const follow = await userModel.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { following: req.body.idToFollow }}, 
        { new: true, upsert: true });

          if (follow) {
            res.status(201).json({ message: "Vous suivez maintenant cet utilisateur." });
          } else {
            return res.status(400).json({ message: err });
          }
      // Ajouter l'utilisateur à la liste des abonnés de l'utilisateur suivi (followers)
      const followers = await userModel.findByIdAndUpdate(
        req.body.idToFollow,
        { $addToSet: { followers: req.params.id } }, // Ajouter l'ID de l'utilisateur qui "suit"
        { new: true, upsert: true },
      );
          if (!followers) {
            return res.status(400).json({ message: err });
          }
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'utilisateur à la liste des abonnés :", err);
      res.status(500).json({ message: "Erreur interne du serveur.", error: err.message });
    }
    };

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour ne plus suivre un utilisateur (PATCH) : /api/users/unfollow/:id
module.exports.unfollow = async (req, res) => {
    // Vérifiez si l'ID est valide
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow)) {
        return res.status(400).send("ID utilisateur invalide. ")
      }
    
      try {
        // Retirer l'utilisateur de la liste des abonnés de l'utilisateur connecté (following)
        const unFollowing = await userModel.findByIdAndUpdate(
          req.params.id,
          { $pull: { following: req.body.idToUnFollow }}, // Retirer l'ID de l'utilisateur "à ne plus suivre"
          { new: true, upsert: true });
  
            if (unFollowing) {
              res.status(201).json({ message: "Vous ne suivez plus cet utilisateur." });
            } else {
              return res.status(400).json({ message: err });
            }
          
        // Retirer l'utilisateur de la liste des abonnés de l'utilisateur suivi (followers)
        const unFollowers = await userModel.findByIdAndUpdate(
          req.body.idToUnFollow,
          { $pull: { followers: req.params.id } }, // Retirer l'ID de l'utilisateur qui "suit"
          { new: true, upsert: true },
        );
            if (!unFollowers) {
              return res.status(400).json({ message: err });
            }
      } catch (err) {
        res.status(500).json({ message: "Erreur interne du serveur.", error: err.message });
      }
      };