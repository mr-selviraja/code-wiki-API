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


//--- Requests at the route "/articles"
app.route("/articles")

  // GET request at "/articles" route
  .get((req, res) => {
    // find all articles
    Article.find({}, (err, foundArticles) => {
      if (!err)
        res.send(`Available articles:\n${foundArticles}`);
      else
        res.send(`Got an Error:\n${err}`);
    })
  })

  // POST request at "/articles" route
  .post((req, res) => {
    // create article
    const newArticle = new Article( {
      title: req.body.title,
      content: req.body.content
    })
    // insert article
    newArticle.save((err) => {
      if (!err)
        res.send(`Successfully inserted article with\ntitle: ${newArticle.title}\ncontent: ${newArticle.content}.`);
      else
        res.send(`Error while inserting the document:\n${err}`);
    });
  })

  // DELETE request at "/articles" route
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err)
        res.send('Successfully deleted all the documents in the collection!');
      else
        res.send(`Error while deleting all the documents: ${err}`);
    })
  });


//--- Requests at the route "/articles/article-name"
app.route("/articles/:articleTitle")

  // GET request at "/articles/:articleName" route
  .get((req, res) => {
    Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
      if (foundArticle)
        res.send(`Found the article:\n${foundArticle}`);
      else
        res.send("Couldn't find the Article.");
    })
  })

  // PUT request at "/articles/:articleName" route(To modify an entire document)
  .put(async (req, res) => {
    Article.updateOne(
      {title: req.params.articleTitle},
      {
        title: req.body.title,
        content: req.body.content
      },
      (err) => {
        if (!err) {
          res.send(`Successfully updated the Article, with:\nTitle: ${req.body.title}\nContent: ${req.body.content}`)
        }
      }
    )
  })

  // PATCH request at '/articles/:articleName' route(To modify some fields of the document)
  .patch((req, res) => {
    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      (err) => {
        if (!err)
          res.send(`Successfully updated the Article, with properties:\n ${req.body}`);
        else
          res.send(`Error while updating:\n${err}`);
      }
    )
  })

  // DELETE request at '/articles/:articleName' route
  .delete((req, res) => {
    Article.deleteOne(
      {title: req.params.articleTitle},
      (err) => {
        if (!err)
          res.send(`Successfully deleted the Article.`);
        else
          res.send(`Error while deleting: ${err}`);
      }
    )
  });


// Starting up the Server
app.listen(PORT, () => {
  console.log(`Server is active and running on PORT: ${PORT}`);
});
