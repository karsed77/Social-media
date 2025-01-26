const router = require("express").Router();

// Authentification
const authController = require("../controllers/auth.controller");

router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// Route /status
router.get("/status", (req, res) => {
  console.log("Route /status appelée");
  res.status(200).json({ status: "OK", user: req.user || null });
});

module.exports = router;