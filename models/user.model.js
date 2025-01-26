const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

// Créer un modèle de données pour les utilisateurs avec Mongoose
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default: function () {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? process.env.CLIENT_URL
            : "http://localhost:5000";
        return `${baseUrl}/default-images/random-user.jpg`;
      },
    },
    bio: {
      type: String,
      max: 1024,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true, 
  }
);

// Crypter le mot de passe avant d'enregistrer l'utilisateur
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Vérifier l'authentification
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("password");
  }
  throw Error("email");
};

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
