const path  = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const errorController = require('./controllers/error')
const User = require('./models/user')
const cors = require('cors') // Place this with other requires (like 'path' and 'express')

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://kevin40597622:kevin40597622@cluster0.uzizy.mongodb.net/e-shop?retryWrites=true&w=majority';
//const MONGODB_URI = process.env.MONGODB_URL || 'mongodb+srv://kevin40597622:kevin40597622@cluster0.uzizy.mongodb.net/e-shop';

//const store = new MongoDBStore({
  //uri : MONGODB_URI,
  //collection: 'sessions'

//})

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
app.set('views','views');


app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));
app.use((req,res,next)=>{
  User.findById('615e45979b5fa054f27bae16')
  .then(user=>{
    req.user =user;
    next()
  }).catch(e=>console.log(e))
});
//app.use(csrfProtection) 
//app.use(flash()) 

app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);
//app.use(authRoutes);

app.use(errorController.get404);


mongoose
.connect(MONGODB_URL, options)
.then(result=>{
  User.findOne().then(user =>{ if(!user){

    const user = new User({
      name: 'Kevin',
      email: 'gaston_alexander@hotmail.es',
      cart:{
        items:[ ]
      }
    })
    user.save()
    
  }})
  app.listen(port)
})
.catch(e=> console.log(e))