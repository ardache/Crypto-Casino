const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const session = require("express-session")
const MongoStore = require("connect-mongo")(session);


const PORT = process.env.PORT || 2000

mongoose
  .connect('mongodb+srv://casino:cryptocasino@cluster0-w3bno.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

//MIddleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 7 * 24 * 60 * 60 * 1000
  })
}));

// our first Route
app.get('/index', (req, res, next) => {
    if (req.session.currentUser) {
      next(); 
    } else {                  
      res.redirect("/login"); 
    }                         
});

// Routes
app.use('/', require('./routes/auth-routes'));
app.use('/', require('./routes/index_routes'));
   
// Server Started
app.listen(PORT, () => console.log('yay crypto casino is working!'));

//test