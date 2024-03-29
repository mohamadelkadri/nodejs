const express = require("express");
const multer = require("multer");
const {
  aboutCtrl,
  menuCtrl,
  adressDetailsCtrl,
  traiteurCtrl,
  contactCtrl,
  commandCtrl,
} = require("../../controllers/resto/resto");
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
userRoutes.get("/about", (req, res) => {
  res.render("resto/about.ejs", { error: "" });
});

userRoutes.get("/menu", (req, res) => {
  res.render("resto/menu.ejs", { error: "" });
});

// rendering register page
userRoutes.get("/adress", (req, res) => {
  res.render("resto/adress.ejs", { error: "" });
});

// rendering profile page
// userRoutes.get("/profile-page", async (req, res) => {
//   // find user
//   const user = await User.findById(req.session.userAuth);
//   res.render("users/profile.ejs", { user });
// });
// rendering profile photo form
userRoutes.get("/traiteur", (req, res) => {
  res.render("resto/traiteur.ejs", { error: "" });
});
// rendering cover photo form
userRoutes.get("/contact", (req, res) => {
  res.render("resto/contact.ejs", { error: "" });
});

userRoutes.get("/command", (req, res) => {
  res.render("resto/command.ejs", { error: "" });
});

// rendering update user form
// userRoutes.get("/update-user-form", (req, res) => {
//   res.render("users/updateUser.ejs");
// });

module.exports = userRoutes;
