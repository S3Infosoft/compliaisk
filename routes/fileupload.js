const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const keys = require("../config/keys");

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

const upload = multer({ storage: storage });

// Load File model
const File = require("../models/File_model");

// @route POST /api/fileupload/upload
// @desc Register user
// @access Public
router.post("/upload", upload.single("fileUpload"), (req, res, next) => {
  const newFile = new File({
    fileUpload: req.file.path,
  });

  newFile
    .save()
    .then((file) => res.json(file))
    .catch((err) => console.log(err));
});

module.exports = router;
