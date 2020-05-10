const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const cron = require("node-cron");
const http = require("http");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const multipartMiddleware = require("connect-multiparty")();
const nodemailer = require("nodemailer");
const helmet = require("helmet");

const users = require("./routes/users");
const logs = require("./routes/logs_routes");
const uploads = require("./routes/uploads_router");
const fileupload = require("./routes/fileupload");
const dailyDataLoad = require("./jobs/dailyDataLoad");
// const agenda_routes = require('./routes/agenda_routes');

const app = express();

//Task scheduler
cron.schedule("0 1 * * * ", function () {
  dailyDataLoad();
});

// Secure your app
app.use(helmet());

// Bodyparser middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB is connected!"))
  .catch((err) => console.log(err));

// Passport middleware
app.use("/uploads", express.static("uploads"));
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/calllogs", logs);
app.use("/api/fileupload", fileupload);
app.use("/", uploads.router);

// Define the PORT
const port = process.env.PORT || 5000;

// Map PORT with server
app.listen(port, () =>
  console.log(`Express server is up and available at port ${port}`)
);
