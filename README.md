# **🌐 Social Media Project**
![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)  ![forthebadge](https://forthebadge.com/images/badges/powered-by-coffee.svg)  ![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)


Ce projet est une plateforme de réseau social développée avec **React**, **Node.js**, **Express**, et **MongoDB**. Elle permet aux utilisateurs de s'inscrire, de se connecter, de publier des posts, de liker, de commenter, de suivre d'autres utilisateurs, et bien plus.

---

## **✨ Fonctionnalités principales**

- 👤 **Gestion des utilisateurs** : inscription, connexion, déconnexion.
- 📝 **Création de publications** : modification, suppression, et like.
- 💬 **Commentaires** : ajouter et gérer les commentaires sur les publications.
- 🖍 **Gestion du profil** : Mise à jour de la bio, choix d'avatars, et gestion des abonnés/abonnements.
- 📈 **Fil de tendances** : Affichage des posts les plus populaires.
- 🖼️ **Gestion des avatars** : avatars hébergés sur **Cloudinary**.
- 📱 **Interface responsive** : design moderne et adapté aux différents écrans.

---

## **🛠️ Technologies utilisées**

### **Frontend**
- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) **React** avec **Vite**
- ![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white) **Redux** pour la gestion d'état
- ![React Router](https://img.shields.io/badge/-React%20Router-CA4245?logo=react-router&logoColor=white) **React Router** pour la navigation
- ![Sass](https://img.shields.io/badge/-Sass-CC6699?logo=sass&logoColor=white) **Sass** pour les styles
- ![Toastify](https://img.shields.io/badge/-React%20Toastify-FF9E0F?logo=react&logoColor=white) **React Toastify** pour les notifications

### **Backend**
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) **Node.js** avec **Express**
- ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white) **MongoDB** (via **Mongoose**)
- ![Multer](https://img.shields.io/badge/-Multer-F68212) **Multer** pour la gestion des uploads d'images
- ![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?logo=cloudinary&logoColor=white) **Cloudinary** pour le stockage distant des images
- ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white) **JWT** (JSON Web Tokens) pour l'authentification

### **Environnement de production**
- ![Railway](https://img.shields.io/badge/-Railway-0B0D0E?logo=railway&logoColor=white) **Railway** pour le déploiement du backend et du frontend.

---

## **📁 Structure du projet**

```plaintext
karsed77-project_social_media/
├── server.js               # Point d'entrée du backend
├── client/                 # Code source du frontend
│   ├── src/
│   │   ├── actions/        # Actions Redux
│   │   ├── components/     # Composants React
│   │   ├── reducers/       # Reducers Redux
│   │   ├── styles/         # Fichiers de styles SCSS
│   │   ├── pages/          # Pages principales
│   │   └── utils/          # Fonctions utilitaires
├── controllers/            # Logique  backend
├── middleware/             # Middleware (authentification, Multer)
├── models/                 # Modèles Mongoose
├── routes/                 # Routes API
└── utils/                  # Gestion des erreurs et configuration Cloudinary

```
## **🌍 Démo en ligne**
L'application est hébergée sur Railway. Vous pouvez la tester ici : https://projectsocialmedia-production.up.railway.app/

## **⚙️ Installation et exécution en local**
### Prérequis
- Node.js (version 16 ou supérieure)
- MongoDB (local ou cloud)
- Cloudinary pour la gestion des avatars.
### **Étapes** :  

### Obtenir les clés API

Pour utiliser ce projet, vous devez configurer les clés suivantes :

 1. **MongoDB** :
   - Inscrivez-vous sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Créez un cluster, puis copiez l'URI de connexion et remplacez `MONGO_URI` dans le fichier `.env`.

 2. **JWT Secret** :
   - Utilisez un générateur de chaîne aléatoire pour créer une clé sécurisée (par exemple, avec [randomkeygen.com](https://randomkeygen.com/)).
   - Remplacez `JWT_SECRET` dans le fichier `.env`.
  
### 1️⃣ Cloner le projet:
```plaintext
git clone https://github.com/votre-utilisateur/votre-repo.git
```
### 2️⃣ Configurer les variables d'environnement
Créez les fichiers .env pour le backend et le frontend.

Backend :
Créez un fichier config/.env avec les clés suivantes :
```plaintext
CLIENT_URL=http://localhost:5173
MONGO_URI=<URL_MongoDB>
TOKEN_SECRET=<Votre_clé_secrète>
```
Frontend :
Créez un fichier client/.env avec la clé suivante :
```plaintext
VITE_API_URL=http://localhost:5000

```
 ### 3️⃣ Installer les dépendances
Installez les dépendances pour le backend et le frontend :
```plaintext
# Backend
cd social-project
npm install

# Frontend
cd social-project/client
npm install
```
### 4️⃣ Lancer le projet en local
Démarrez les serveurs backend et frontend :
```plaintext
# Backend
cd social-project
npm start

# Frontend
cd social-project/client
npm run dev
```
L'application sera accessible à l'adresse : http://localhost:5173.



## **✉️ Contact**
Pour toute question ou suggestion, contactez-moi via GitHub.

## **💻 Auteur**
- [@karsed77](https://github.com/karsed77)

### Projet N°3

Projet réalisé dans le cadre de ma formation développeur web et mobile avec <a href='https://believemy.com/'><u><img src="https://believemy.com/images/site/brand/believemy-row-white.svg" alt="bilievemy" width="100" /></u></a> , Promotion Tōru Iwatani (2023-24)

