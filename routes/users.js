const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const multer = require("multer");
const Validator = require("validator");
const isEmpty = require("is-empty");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateResetInput = require("../validation/reset");

// Load User model
const User = require("../models/User");

// @route GET api/users/userslist
// @desc Get all users
// @access Private
router.get("/userslist", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", upload.single("image"), (req, res, next) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userImage: req.file.path,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.userImage,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600, // 1 hour
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route POST api/users/passwordreset
// @desc Reset your password
// @access Public
router.put("/passwordreset", (req, res, next) => {
  const { errors, isValid } = validateResetInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let email = req.body.email;
  let password = req.body.password;

  // console.log(email, password);

  // email = !isEmpty(email) ? email : "";
  // password = !isEmpty(password) ? password : "";

  // // Email checks
  // if (Validator.isEmpty(email)) {
  //   return res.status(400).json("Email field is required");
  // } else if (!Validator.isEmail(email)) {
  //   return res.status(400).json("Email is invalid");
  // }

  // // Password checks
  // if (Validator.isEmpty(password)) {
  //   return res.status(400).json("Password field is required");
  // }
  // if (!Validator.isLength(password, { min: 6, max: 30 })) {
  //   return res.status(400).json("Password must be at least 6 characters");
  // }

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;

      User.findOneAndUpdate(
        { email },
        { $set: { password: hash } },
        { new: false },
        function (err, doc) {
          if (doc === null) {
            res.send("Correct Email is required!");
          } else {
            res.send("Password Updated");
          }
        }
      );
      
    });
  });
});

module.exports = router;
