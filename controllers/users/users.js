const bcrypt = require("bcryptjs");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");

const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  // check if field is empty
  if (!fullname || !email || !password) {
    // return next(appErr("All fields are required"));
    return res.render("users/register", { error: "All fields are required" });
  }
  try {
    // 1.check if user exist (email)
    const userFound = await User.findOne({ email });
    // throw error if user exists
    if (userFound) {
      return res.render("users/register", { error: "User already exists" });
    }
    // hash password
    const salt = await bcrypt.genSalt(1);
    const passwordHashed = await bcrypt.hash(password, salt);

    // register user
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("users/login", { error: "All fields are required" });
  }
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      // return next(appErr("user doesnt exist"));
      return res.render("users/login", { error: "user doesnt exist" });
      // return res.json({ status: "failed", data: "user doesnot exist" });
    }
    // verify password
    const isPasswordValid = await bcrypt.compare(password, userFound.password);
    if (!isPasswordValid) {
      return next(appErr("Invalid password"));

      // return res.json({ status: "failed", data: "Invalid password" });
    }
    // save the user into session
    req.session.userAuth = res.locals.userAuth = userFound._id;
    // res.json({ status: "success", data: userFound });
    res.render("users/profile", { user: userFound });
  } catch (error) {
    res.json(error);
  }
};

const userDetailsCtrl = async (req, res) => {
  try {
    // get user id from params
    const userId = req.params.id;
    // find the user
    const user = await User.findById(userId);
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/updateUser", { user, error: "" });
  } catch (error) {
    res.json(error);
  }
};

const profileCtrl = async (req, res) => {
  try {
    // get the login user
    const userID = req.session.userAuth;
    const user = await User.findById(userID)
      .populate("posts")
      .populate("comments"); //populate to convert posts id into real posts
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/profile", { user });
  } catch (error) {
    res.json(error);
  }
};

const uploadProfilePhotoCtrl = async (req, res, next) => {
  try {
    // check if file exist
    if (!req.file) {
      return res.render("users/uploadProfilePhoto", {
        error: "The file is required",
      });
    }
    // 1.Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2.Check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
      // return next(appErr("User not found to upload image", 403));
    }
    // update profile photo
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: req.file.path,
      },
      {
        new: true, //to have the newly updated data
      }
    );
    res.redirect("profile-page");
    // res.json({
    //   status: "success",
    //   user: userUpdated,
    // });
  } catch (error) {
    // res.json(error.message);
    // next(appErr(error.message));
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

const uploadCoverPhotoCtrl = async (req, res, next) => {
  console.log("uploadCover", req.body);
  // check if file exist
  if (!req.file) {
    return res.render("users/uploadCoverPhoto", {
      error: "The file is required",
    });
  }
  try {
    // 1.Find the user to be updated
    const userId = req.session.userAuth;
    const userFound = await User.findById(userId);
    // 2.Check if user is found
    if (!userFound) {
      return res.render("users/uploadProfilePhoto", {
        error: "User not found",
      });
    }
    // update cover photo
    const userUpdated = await User.findByIdAndUpdate(
      userId,
      {
        coverImage: req.file.path,
      },
      {
        new: true, //to have the newly updated data
      }
    );
    // res.json({
    //   status: "success",
    //   user: userUpdated,
    // });
    res.redirect("profile-page");
  } catch (error) {
    // next(appErr(error.message));
    return res.render("users/uploadProfilePhoto", {
      error: error.message,
    });
  }
};

const updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    // check is user is updating password
    if (password) {
      const salt = await bcrypt.genSalt(1);
      const passwordHashed = await bcrypt.hash(password, salt);
      // update password
      const user = await User.findByIdAndUpdate(
        req.session.userAuth,
        {
          password: passwordHashed,
        },
        {
          new: true, //to have the updating record
        }
      );
      // res.json({
      //   status: "success",
      //   data: `password updated ${req.params.id}`,
      // });
      res.render("users/profile", { user });
    }
  } catch (error) {
    // return next(appErr(error.message));
    return res.render("users/profile", { error: error.message });
  }
};

const updateUserCtrl = async (req, res, next) => {
  const { fullname, email } = req.body;
  // check if email is not taken
  try {
    if (!fullname || !email) {
      return res.render("users/updateUser", {
        error: "All fields are required",
      });
    }
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        // return next(appErr("Email already taken", 400));
        return res.render("users/updateUser", {
          error: "Email already taken",
        });
      }
    }
    // update email
    const user = await User.findByIdAndUpdate(
      req.session.userAuth,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    // res.json({
    //   status: "success",
    //   data: user,
    // });
    res.render("users/profile", { user });
  } catch (error) {
    // return next(appErr(error.message));
    return res.render("users/updateUser", {
      error: error.message,
    });
  }
};
const logoutCtrl = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/api/v1/users/login");
  });
};
module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverPhotoCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
