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
// @desc Upload files
// @access Private
router.post("/upload", upload.single("fileUpload"), (req, res, next) => {
  // console.log('size: ',  (req.file.size / 1048576).toFixed(2).toString() );

  let size = (req.file.size / 1048576).toFixed(2);

  const newFile = new File({
    name: req.file.originalname,
    size: size,
    filePath: `http://localhost:5000/${req.file.path}`,
  });

  newFile
    .save()
    .then((file) => res.json(file))
    .catch((err) => console.log(err));
});


// @route GET /api/fileupload/filelist
// @desc Get all files
// @access Private
router.get("/filelist", async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
