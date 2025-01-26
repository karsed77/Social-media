const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "posts",
    format: async (req, file) => "jpg", // forcer le format
    public_id: (req, file) => `${req.body.posterId}_${Date.now()}`,
  },
});

const upload = multer({ storage });
module.exports = upload;
