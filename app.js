const express = require("express");
const app = express();
const hbs = require("hbs");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session")
const MongoStore = require("connect-mongo")(session);
const User = require("./models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
  .connect('mongodb+srv://casino:cryptocasino@cluster0-w3bno.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
//MIddleware
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 7 * 24 * 60 * 60 * 1000
  })
}));

// our first Route

app.get('/index', (request, response, next) => {
    response.render('index');
});

app.get('/slotmachine', (request, response, next) => {
  response.render('slotmachine');
});

app.get('/login', (request, response, next) => {
  response.render('login');
});

app.get("/signup", (req, res, next) => {
  res.render("signup");
});


app.post('/signup', (request, res, next) => {
  const username = request.body.username;
  const password = request.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/index");
  })
  .catch(error => {
    console.log(error);
  })
});

app.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;
  

  if (theUsername === "" || thePassword === "") {
    res.render("/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
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
        res.redirect("/");
      } else {
        res.render("/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});
   


  // Server Started
app.listen(2000, () => {
    console.log('yay crypto casino is working!')
  });
