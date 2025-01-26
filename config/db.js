const mongoose = require("mongoose");

// Connexion à la base de données MongoDB avec Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB");
    console.error(err.message); // Affiche le message d'erreur exact
  });
