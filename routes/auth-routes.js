// routes/auth-routes.js
const router = require("express").Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get('/slotmachine', (request, response, next) => {
  response.render('slotmachine');
});

router.get('/login', (request, response, next) => {
  response.render('login');
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post('/signup', (request, res, next) => {
  const {username, password, email } = request.body;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  User.create({
    username,
    email,
    password: hashPass
  })
  .then(() => {
    res.redirect("/login");
  })
  .catch(error => {
    console.log(error);
  })
});

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});

router.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  

  if (theUsername === "" || thePassword === "") {
    res.render("/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ username: theUsername })
  .then(user => {
      if (!user) {
        res.render("/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/index");
      } else {
        res.send('Algo malo salió');
      }
  })
  .catch(error => {
    next(error);
  })
});


router.get("/qr", (req, res, next) => {
  res.render("qr");
});

router.get("/recarga", (req, res, next) => {
  res.render("recarga");
});

router.post("/recarga", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
  const balance= req.body.balance;

  User.findOneAndUpdate({ username: theUsername }, {$inc :{balance:balance}},{new: true})
  .then(user => {
      // if (!req.session.currentUser) {
      //   res.render("/login", {
      //     errorMessage: "The session have been finish"
      //   });
      //   return;
      // } else 
      // {
        console.log(user)
      // }

  })
  .catch(error => {
    next(error);
  })
  res.redirect("/index");
});


module.exports = router;