const path = require('path');
const flash =  require('connect-flash')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require('./models/user');
const session = require('express-session');
const cors = require('cors') // Place this with other requires (like 'path' and 'express')
const csrf= require('csurf');
const MongoDBStore = require('connect-mongodb-session')(session);
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://kevin40597622:kevin40597622@cluster0.uzizy.mongodb.net/e-shop?retryWrites=true&w=majority';
const MONGODB_URI = process.env.MONGODB_URL || 'mongodb+srv://kevin40597622:kevin40597622@cluster0.uzizy.mongodb.net/e-shop';

const store = new MongoDBStore({
  uri : MONGODB_URI,
  collection: 'sessions'

});

const csrfProtection  = csrf()
const app = express();

const corsOptions = {
  origin: "https://week3-cse341.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  //useCreateIndex: true,
  //useFindAndModify: false,
  family: 4
};

                      


let port = process.env.PORT;
if (port == null || port == "") {
port = 3000;
}



app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
  secret: 'a secret', 
  resave : false ,
  saveUninitialized: false,
  store: store,
}
));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use( (req,res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken =  req.csrfToken()
  res.locals.userName =  req.session.userName
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
.connect(MONGODB_URL, options)
.then(result=>{
  app.listen(port)
})
.catch(e=> console.log(e))
;