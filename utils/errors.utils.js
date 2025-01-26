
// Inscription (POST) : /api/user/signup 
module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  // Erreurs de validation
  if (err.message.includes("pseudo")) {
    errors.pseudo = "Pseudo incorrect ou déjà pris.";
  }

  if (err.message.includes("email")) {
    errors.email = "Email incorrect.";
  }

  if (err.message.includes("password")) {
    errors.password = "Le mot de passe doit faire 6 caractères minimum.";
  }

  // Erreurs d'unicité
  if (err.code === 11000) {
    // Teste si le pseudo ou l'email est déjà enregistré
    const duplicateField = Object.keys(err.keyValue)[0]; 
    if (duplicateField === "pseudo") {
      errors.pseudo = "Ce pseudo est déjà pris.";
    } else if (duplicateField === "email") {
      errors.email = "Cet email est déjà enregistré.";
    }
  }

  // Erreurs inattendues (log pour débogage)
  if (!err.message.includes("pseudo") && !err.message.includes("email") && !err.message.includes("password") && err.code !== 11000) {
    console.error("Erreur inattendue :", err);
  }

  return errors;
};


// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Connexion (POST) : /api/user/login
module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes('email') ) {
    errors.email = "Email incorrect.";
  }

  if (err.message.includes('password')) {
    errors.password = "Le mot de passe est incorrect.";
  }

  return errors;
}

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Erreur upload image
module.exports.uploadErrors = (err) => {
  console.log("Message d'erreur :", err.message);
  let errors = { format: '', maxSize: ""};

  if (err.message.includes('invalid file'))
    errors.format = "Format incompatabile";

  if (err.message.includes('Max size exceeded'))
    errors.maxSize = "Le fichier dépasse 500ko";

  return errors
}