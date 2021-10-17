const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require('./models/user');
const cors = require('cors') // Place this with other requires (like 'path' and 'express')

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://kevin40597622:kevin40597622@cluster0.uzizy.mongodb.net/e-shop?retryWrites=true&w=majority';
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

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://kevin40597622:kevin40597622@cluster0.uzizy.mongodb.net/e-shop?retryWrites=true&w=majority'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Kevin',
          email: 'gaston_alexander@hotmail.es',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
