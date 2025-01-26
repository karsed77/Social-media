const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs").promises;
const { uploadErrors } = require("../utils/errors.utils");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// :::::::::::::::::::::  PUBLICATION  ::::::::::::::::::::::::::::::::::::::::::::::::
// Pour les publications
module.exports.readPost = (req, res) => {
  PostModel.find()
    .sort({ createdAt: -1 }) // Tri par ordre décroissant
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch((err) => {
      console.error("Erreur dans la récupération des publications :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    });
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour la création de publication (avec image ou vidéo)
module.exports.createPost = async (req, res) => {
  let pictureUrl = "";

  // Vérifiez si un fichier a été reçu
  if (req.file) {
    console.log("Fichier reçu :", req.file);

    try {
      // Création d'un flux et upload sur Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "post_uploads" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      // Enregistrer l'URL de l'image
      pictureUrl = result.secure_url;
      console.log("URL de l'image :", pictureUrl);
    } catch (err) {
      console.error("Erreur lors de l'upload :", err);
      return res.status(500).json({ error: "Failed to upload image" });
    }
  }

  // Création du post
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: pictureUrl,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  console.log("Données du post :", newPost);

  try {
    const post = await newPost.save();
    console.log("Post enregistré :", post);
    return res.status(201).json(post);
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    return res.status(400).send({ error: "Post creation failed" });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour la mise à jour de publication
module.exports.updatePost = (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }
  // Mise à jour de l'enregistrement
  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: { message: req.body.message } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).send("Post non trouvé.");
      }
      return res.status(200).send(updatedPost);
    })
    .catch((err) => {
      console.error("Erreur lors de la mise à jour :", err);
      return res
        .status(500)
        .send({ message: "Erreur interne du serveur.", error: err });
    });
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour la suppression de publication
module.exports.deletePost = async (req, res) => {
  // Vérifiez si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    // Suppression du post
    const deletedPost = await PostModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedPost) {
      return res.status(404).send("Post non trouvé.");
    }

    return res
      .status(200)
      .json({ message: "Post supprimé avec succès.", deletedPost });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: err });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour liker une publication
module.exports.likePost = async (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }
  try {
    // Ajouter l'utilisateur à la liste des likers
    const like = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } },
      { new: true }
    );
    if (!like) {
      return res.status(404).send("Publication non trouvée.");
    }
    // Ajouter la publication à la liste des likes de l'utilisateur
    const likers = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      { new: true }
    );
    if (!likers) {
      return res.status(404).send("Utilisateur non trouvé.");
    }
    res.status(201).json({ message: "Publication likée avec succès." });
  } catch (err) {
    console.error("Erreur lors du like :", err);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: err });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour disliker une publication
module.exports.unlikePost = async (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }

  try {
    // Retirer l'utilisateur de la liste des likers
    const unlike = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true }
    );
    if (!unlike) {
      return res.status(404).send("Publication non trouvée.");
    }
    // Retirer la publication de la liste des likes de l'utilisateur
    const unlikers = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      { new: true }
    );

    if (!unlikers) {
      return res.status(404).send("Utilisateur non trouvé.");
    }

    return res
      .status(200)
      .json({ message: "Publication dislikée avec succès." });
  } catch (err) {
    console.error("Erreur lors du dislike :", err);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: err });
  }
};

// ::::::::::::::::::::::::: COMMENTAIRES ::::::::::::::::::::::::::::::::::::::::::::

// Pour commenter une publication
module.exports.commentPost = async (req, res) => {
  // Vérifie si l'ID est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }
  try {
    // Ajouter le commentaire à la publication
    const comment = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true }
    );

    if (!comment) {
      return res.status(404).send("Publication non trouvée.");
    }
    res.status(201).json(comment);
  } catch (err) {
    console.error("Erreur lors du commentaire :", err);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: err });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour éditer un commentaire
module.exports.editCommentPost = async (req, res) => {
  // Vérifie si l'ID du post est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }
  try {
    // Récupérer le post par ID
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post non trouvé.");
    }

    // Trouver et mettre à jour le commentaire
    const comment = post.comments.find((com) =>
      com._id.equals(req.body.commentId)
    );
    if (!comment) {
      return res.status(404).send("Commentaire non trouvé.");
    }
    comment.text = req.body.text;

    // Sauvegarder le post mis à jour
    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du commentaire :", err);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: err });
  }
};

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Pour supprimer un commentaire
module.exports.deleteCommentPost = async (req, res) => {
  // Vérifie si l'ID du post est valide
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }
  try {
    // Récupérer le post par ID
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post non trouvé.");
    }

    // Trouver et supprimer le commentaire
    const initialCommentCount = post.comments.length;
    post.comments = post.comments.filter(
      (com) => !com._id.equals(req.body.commentId)
    );

    // Vérifiez si un commentaire a été effectivement supprimé
    if (post.comments.length === initialCommentCount) {
      return res.status(404).send("Commentaire non trouvé.");
    }
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Erreur lors de la suppression du commentaire :", err);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur.", error: err });
  }
};
