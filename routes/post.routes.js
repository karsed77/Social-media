const router = require("express").Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer();


// ::::::::::::::::::::::::: Publications ::::::::::::::::::::::::
// Récupérer toutes les publications
router.get("/", postController.readPost);
// Créer une publication
router.post("/", upload.single("file"), postController.createPost);
// Mettre à jour une publication
router.put("/:id", postController.updatePost);
// Supprimer une publication
router.delete("/:id", postController.deletePost);
// Liker une publication
router.patch("/like-post/:id", postController.likePost);
// Disliker une publication
router.patch("/unlike-post/:id", postController.unlikePost);

// :::::::::::::::::::::::: Commentaires ::::::::::::::::::::::::
// Commenter une publication
router.patch("/comment-post/:id", postController.commentPost);
// Editer un commentaire
router.patch("/edit-comment-post/:id", postController.editCommentPost);
// Supprimer un commentaire
router.patch("/delete-comment-post/:id", postController.deleteCommentPost);

module.exports = router;
