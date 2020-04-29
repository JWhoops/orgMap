const express = require("express"),
  bodyParser = require("body-parser"),
  DBUtilities = require("./utilities/dbUtils"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user")

//routes
const authRoutes = require("./routes/auth")

//app configs
const app = express()

//some secret values
const my_secret = "Desperate for Half-Life 3, Please Gabe!!!!!!"

app.use(require("express-session")({
  secret: my_secret,
  resave: false,
  saveUninitialized: false
}))

//passport config
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs')
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// dumb icon
app.get('/favicon.ico', (req, res) => res.status(204));

//location route
app.get("/get/:location", (req, res) => {
  //get key from url and render json
  DBUtilities.getJSONByKey(req.params.location.toString(), (current, next) => {
    res.jsonp({ current, next })
  })
})

//root route
app.get("/", (req, res) => {
  res.render("index")
})

app.post("/utility", jsonParser, (req, res) => {
  let utility = { key: req.body.key, description: req.body.description, type: req.body.type };
  DBUtilities.insertUtility(utility.key, utility, (bd) => {
    res.send(JSON.stringify(bd))
  })
})

//auth routers
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use(authRoutes)

//app.listen(process.env.PORT,process.env.IP,()=>{

app.listen(8080, () => {
  console.log("start running the server")
})
