require("dotenv").config();

module.exports = {
  mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-vpvmp.mongodb.net/coreui-react?retryWrites=true&w=majority`,
  // mongoURI: "mongodb://localhost:27017/coreui-react",
  secretOrKey: "hiddensecret",
};
