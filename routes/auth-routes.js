// routes/auth-routes.js
const router = require("express").Router();

// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

let gamebalance=0;

router.get("/slotmachine", ensureAuthenticated, (req, res, next) => {
  const theUsername = req.session.currentUser.username;
    User.findOne({ username: theUsername }).then((user) => {
      res.render("slotmachine", user);
    });
});

router.get('/login', (request, response, next) => {
  response.render('login', {layout: false});
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
        res.redirect("/index");
      } else {
        let data = {
          errorMessage: "El usuario no existe"
        }
        res.render("login", {data, layout: false});
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

router.post("/lost", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
  //gamebalance= req.body.balance;
  gamebalance= -.0005
console.log ("estamos en BE", req.body.balance)
  User.findOneAndUpdate({ username: theUsername }, {$inc :{balance:gamebalance}},{new: true})
  .then(user => {
        console.log(user)
  })
  .catch(error => {
    next(error);
  })
  res.render("slotmachine");
});

router.post("/win", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
  //gamebalance= req.body.balance;
  gamebalance= 1
console.log ("estamos en BE", req.body.balance)
  User.findOneAndUpdate({ username: theUsername }, {$inc :{balance:gamebalance}},{new: true})
  .then(user => {
        console.log(user)
        alert("Ganaste 1 BTC !!!!")
  })
  .catch(error => {
    next(error);
  })
  res.render("slotmachine");
});


router.post("/recarga", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
  const balance= req.body.balance;
console.log ("estamos en BE", req.body)
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


router.get("/search", ensureAuthenticated, (req, res, next) => {
  const theUsername = req.session.currentUser.username;
    User.findOne({ username: theUsername }).then((user) => {
      res.render("search", {user});
    });
});

router.post("/confirmation", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
  const uTrans= req.body.correo;
  const bitcoins= req.body.monto;
    User.findOne({ username: theUsername }).then((user) => {
      User.findOne({ username: uTrans }).then((transfer) => {
        if (transfer) {
        res.render("confirmation", {user, transfer, bitcoins});
        } else {
          res.redirect("/search")
        }
      });
    });
});


router.post("/save", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
  const userT= req.body.benef;
  const balanceT= req.body.btc;
console.log ("estamos en BE", req.body)

User.findOneAndUpdate({ username: theUsername }, {$inc :{balance:-balanceT}},{new: true})
  .then(user => {
        console.log(user)
        User.findOneAndUpdate({ username: userT }, {$inc :{balance:balanceT}},{new: true})
        .then(user => {
              console.log(user)
        })
        .catch(error => {
          next(error);
        })
        res.redirect("/index");
        })
  .catch(error => {
    next(error);
  })
});



router.post("/store", (req, res, next) => {
  const theUsername = req.session.currentUser.username;
  let storebalance= req.body;
  storebalance= -.6341 //remover cuando funcione fetch
console.log ("estamos en BE store", req.body)
  User.findOneAndUpdate({ username: theUsername }, {$inc :{balance:storebalance}},{new: true})
  .then(user => {
        console.log(user)
  })
  .catch(error => {
    next(error);
  })
  res.redirect("/store");
});

module.exports = router;