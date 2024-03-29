const express = require("express");
const multer = require("multer");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");
const protected = require("../../middlewares/protected");
const storage = require("../../config/cloudinary");
const User = require("../../models/user/User");
const userRoutes = express.Router();

// Instance of multer: importer les photos
const upload = multer({
  storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

// rendering form
userRoutes.get("/login", (req, res) => {
  res.render("users/login.ejs", { error: "" });
});

userRoutes.get("/update-password", (req, res) => {
  res.render("users/updatePassword.ejs", { error: "" });
});

// rendering register page
userRoutes.get("/register", (req, res) => {
  res.render("users/register.ejs", { error: "" });
});

// rendering profile page
// userRoutes.get("/profile-page", async (req, res) => {
//   // find user
//   const user = await User.findById(req.session.userAuth);
//   res.render("users/profile.ejs", { user });
// });
// rendering profile photo form
userRoutes.get("/upload-profile-photo-form", (req, res) => {
  res.render("users/uploadProfilePhoto.ejs", { error: "" });
});
// rendering cover photo form
userRoutes.get("/upload-cover-photo-form", (req, res) => {
  res.render("users/uploadCoverPhoto.ejs", { error: "" });
});

// rendering update user form
// userRoutes.get("/update-user-form", (req, res) => {
//   res.render("users/updateUser.ejs");
// });

// register
userRoutes.post("/register", registerCtrl);

// login
userRoutes.post("/login", loginCtrl);

// GET/api/v1/users/profile/
userRoutes.get("/profile-page", protected, profileCtrl);

// PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put(
  "/profile-photo-upload",
  protected,
  upload.single("profile"),
  uploadProfilePhotoCtrl
); //single to upload uniquement une seule image, sinon use array

// PUT/api/v1/users/cover-photo-upload/:id
userRoutes.put(
  "/cover-photo-upload",
  protected,
  upload.single("profile"),
  uploadCoverPhotoCtrl
);

// PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/", updatePasswordCtrl);

// PUT/api/v1/users/update/:id
userRoutes.put("/update", updateUserCtrl);

// GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

// GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

module.exports = userRoutes;
