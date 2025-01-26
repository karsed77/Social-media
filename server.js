// Import des modules nécessaires
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
// require("dotenv").config({ path: "./config/.env" });
require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });
require("./config/db");

// Middleware et routes
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const authRoutes = require("./routes/auth.routes");

// Initialisation d'Express
const app = express();

// Middleware pour journaliser les requêtes (au tout début)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configuration CORS
const allowedOrigins = [
  "http://localhost:5173", // Origine locale
  "http://localhost:5000", // Origine pour les tests d'API (backend local)
  process.env.CLIENT_URL, // Origine en production
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origine non autorisée : ${origin}`));
    }
  },
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

// Middleware de configuration
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware pour servir les fichiers statiques (images et uploads)
app.use(
  "/default-images",
  express.static(path.join(__dirname, "default-images"))
);

// Middleware pour vérifier les utilisateurs via JWT
const { requireAuth, checkUser } = require("./middleware/auth.middleware");
app.use(checkUser); // À exécuter après les fichiers statiques mais avant les routes API

// Routes JWT (spécifiques)
app.get("/jwtid", requireAuth, (req, res) => {
  if (res.locals.user && res.locals.user._id) {
    return res.status(200).json({ id: res.locals.user._id });
  } else {
    return res.status(400).json({ message: "ID utilisateur manquant." });
  }
});

// Routes API
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/auth", authRoutes);

// Gestion explicite des erreurs 404 pour les routes API
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "Route API non trouvée." });
});

// Middleware pour servir les fichiers React (Frontend)
app.use(express.static(path.join(__dirname, "client", "dist")));

// Fallback pour React Router (routes non gérées par le backend)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Démarrage du serveur
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
