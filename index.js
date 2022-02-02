const express = require("express")
const app =express()
var passport = require('passport');
const mongoose =require("mongoose")
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const path =require("path")
const session =require("express-session")
const User =require("../E-commerce website/models/User")


app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
mongoose.connect( 'mongodb://localhost:27017/shopping-app')
.then(()=>console.log("Database connected"))

const sessionConfig={
    name : "mySession",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,    //it ensure no one acess our cookie directly using JS
        expire: Date.now() +1000*60*60*24*7*1,
        maxAge :1000*60*60*24*7
    }
  }
app.use(session(sessionConfig))
app.use (passport.initialize())
app.use (passport.session())
passport.use(new GoogleStrategy({
    clientID: '76042496423-cb53lg0v4s1n5jabngocg918u4qgl76e.apps.googleusercontent.com',
    clientSecret: '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',
    
    
    callbackURL: 'http://localhost:6006/login/auth/'
  }, async function(accessToken, refreshToken, profile, cb) {
    
    return cb(null,profile)
  }
)
)
passport.serializeUser( (user, done) => {
  done(null, user)
  console.log(`\n--------> Serialize User:`)
  console.log(user)
})
passport.deserializeUser((user, done) => {
  console.log("\n--------- Deserialized User:")
        console.log(user.emails[0].value)
  done (null, user)
})

app.get('/login/google', passport.authenticate('google',
 {
    scope: ["profile" ,'email']
    
  }));
  app.get('/login/auth/',
  passport.authenticate('google', { 
    successRedirect:'/home',
    failureRedirect: '/', failureMessage: true }),
  ); 
app.get("/",(req,res)=>{
    res.render("index")
})
checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/")
}
app.get("/home",checkAuthenticated,(req,res)=>{
    const name = req.user.displayName
    res.render("home",{name})

})

app.get("/logout",(req,res)=>{
    req.logOut()
    res.redirect("/")
})




app.listen(6006,()=>{
    console.log("server runing at port 6006")
})