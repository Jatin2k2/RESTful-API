//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//connecting to mongo Server
mongoose.connect("mongodb://localhost:27017/wikiDB");
// created article schema
const articleSchema = {
  title: String,
  content: String
};
//article model
const Article = mongoose.model("Article", articleSchema);
//request targeting all articles
app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, f_articles) {
      if (!err) {
        res.send(f_articles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("successfully added new articles");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//request targeting specific articles

app.route("/articles/:articleTitle")

  // req.params.articleTitle = ""

  .get(function(req, res) {

    Aritcle.fondOne({
      title: req.params.articleTitle
    }, function(err, f_article) {
      if (f_article) {
        res.send(f_article);
      } else {
        res.send("No articles found");
      }
    });
  })

  .put(function(req, res) {
    Article.update({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("success in saving the article");
        }
      }
    );
  })

  .patch(function(req,res){
    Article.update(
      {title:req.params.articleTitle},
      {$set:req.body},
      function(err){
        if(!err){
          res.send("successfully updated articles");
        }else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title:req.params.articleTitle},
      function(err){
        if(!err){
          res.send("successfully deleted articles");
        }else {
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
