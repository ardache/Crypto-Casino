// routes/index_routes.js
const router = require("express").Router();
// User model
const User = require("../models/user");

router.get("/", (req, res, next) => {
      res.render('landing');
  });

router.get("/index", (req, res, next) => {
const theUsername = req.session.currentUser.username;
  User.findOne({ username: theUsername }).then((user) => {
    res.render('index', user);
  });
});

  module.exports = router;