require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/userDB");  // mongodb connection


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});  // Schema



userSchema.plugin(encrypt, { secret:process.env.SECRET ,encryptedFields: ["password"] });   // encrypting the password


const User = new mongoose.model("User",userSchema);  // Model

app.get("/",function(req,res) {
  res.render("home");
});

app.get("/login",function(req,res) {
  res.render("login");
});

app.get("/register",function(req,res) {
  res.render("register");
});


app.post("/register",function(req,res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    }else {
      res.render("secrets");
    }
  });  // save call back function

});  //  post method

app.post("/login",function(req,res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email:username},function(err,FoundedAccount){
    if (!err) {
if (FoundedAccount) {
  if (FoundedAccount.password === password) {
    res.render("secrets");
  }
}
    }else {
      console.log(err);
    }
  });
});









app.listen(3000,function(){
  console.log("server started on port 3000");
});
