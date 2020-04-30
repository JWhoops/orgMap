const express = require("express"),
  bodyParser = require("body-parser"),
  DBUtilities = require("./utilities/dbUtils");

const app = express()

app.set('view engine', 'ejs')
// create application/json parser
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.status(204));

//location route
app.get("/get/:location", (req, res) => {
  //get key from url and render json
  DBUtilities.getJSONByKey(req.params.location.toString(), (current, next) => {
    res.jsonp({ current, next })
  })
})

app.post("/utility", jsonParser, (req, res) => {
  let utility = { key: req.body.key, description: req.body.description, type: req.body.type, verified: false };
  DBUtilities.insertUtility(utility.key, utility, (bd) => {
    res.send(JSON.stringify(bd))
  })
})

app.get("/login", (req, res) => {
  res.render('login');
})

app.post("/verification", jsonParser, (req, res) => {
  let { key, utility } = req.body;
  DBUtilities.updateUtility(key, utility, (updateRes) => {
    res.send(JSON.stringify(updateRes));
  })
})

// app.get("/populate", (req, res) => {
//   DBUtilities.populateMadison();
//   res.send("success")
// })

//app.listen(process.env.PORT,process.env.IP,()=>{

app.listen(8080, () => {
  console.log("start running the server")
})
