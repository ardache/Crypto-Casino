// routes/auth-routes.js
const router = require("express").Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/slotmachine", ensureAuthenticated, (req, res, next) => {
  const theUsername = req.session.currentUser.username;
    User.findOne({ username: theUsername }).then((user) => {
      res.render("slotmachine", user);
    });
});

router.get('/login', (request, response, next) => {
  let data = {
    layout: false
  }
  response.render('login', data);
});

router.get("/signup", (req, res, next) => {
  let data = {
    layout: false
  }
  res.render("signup", data);
});

router.get("/store", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
    User.findOne({ username: theUsername }).then((user) => {
      res.render("store", user);
    });
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
    res.redirect("/");
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
  } else {
    res.redirect("/login")
  } 

  User.findOne({ username: theUsername })
  .then(user => {
      if (!user) {
        res.render("/login", {
          errorMessage: "El usuario no existe"
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        const redirect = req.query.redirect;
        if (redirect) {
          res.redirect(redirect);
        } else {
          res.redirect("/index");
        }
      } else {
        res.send('Credenciales incorrectas');
      }
  })
  .catch(error => {
    next(error);
  })
});


router.get("/qr", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
    User.findOne({ username: theUsername }).then((user) => {
      res.render("qr", user);
    });
});

router.get("/recarga", ensureAuthenticated, (req, res, next) => {
  const theUsername = req.session.currentUser.username;
    User.findOne({ username: theUsername }).then((user) => {
      res.render("recarga", user);
    });
});

function ensureAuthenticated(req, res, next) {
  const user = req.session.currentUser;
  if (!user) {
    res.redirect(`/login?redirect=${req.originalUrl}`);
    return;
  } else {
    next()
  } 
}

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

router.get("/tienda", ensureAuthenticated, (req, res, next) => {
  const theUsername = req.session.currentUser.username;
    User.findOne({ username: theUsername }).then((user) => {
      res.render("tienda", user);
    });
});


module.exports = router;