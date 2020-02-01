// routes/index_routes.js
const router = require("express").Router();

router.get("/index", (req, res, next) => {
    res.render("index");
  });

  module.exports = router;