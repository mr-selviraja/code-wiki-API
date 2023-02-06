// third-party dependencies
const express = require("express");
const pug = require("pug");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


// native-node dependencies
const path = require("path");


// Server PORT
const PORT = 3005;


// Initialize the App
const app = express();


// Load view-engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// To avoid deprecation warning
mongoose.set("strictQuery", true);


// Add body-parser to App
app.use(bodyParser.urlencoded({ extended: true }));


// Static files serving directory
app.use(express.static("public"));


// DB connection
const dbName = "wikiDB";
mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`, () => {
  console.log(`Connected to the Database ${dbName}`);
});

// DB-articles schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

// DB-model(collection)
const Article = mongoose.model('Article', articleSchema);


// Starting up the Server
app.listen(PORT, () => {
  console.log(`Server is active and running on PORT: ${PORT}`);
});
