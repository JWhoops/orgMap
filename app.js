const express = require("express"),
  bodyParser = require("body-parser"),
  DBUtilities = require("./utilities/dbUtils");

const app = express()
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.status(204));

/**
 * get locaotion information by key
 */
app.get("/location/:location", (req, res) => {
  //get key from url and render json
  DBUtilities.getJSONByKey(req.params.location.toString(), (current, next) => {
    res.jsonp({ current, next })
  })
})

/**
 * insert utility to a building
 */
app.post("/utility", jsonParser, (req, res) => {
  let utility = { key: req.body.key, description: req.body.description, type: req.body.type, verified: false };
  DBUtilities.insertUtility(utility.key, utility, (bd) => {
    res.send(JSON.stringify(bd))
  })
})

/**
 * verify utility
 */
app.post("/verification", jsonParser, (req, res) => {
  let { key, utility } = req.body;
  DBUtilities.verifyUtility(key, utility, (updateRes) => {
    res.send(JSON.stringify(updateRes));
  })
})

// app.get("/populate", (req, res) => {
//   DBUtilities.populateMadison();
//   res.send("success")
// })

app.listen(8080, () => {
  console.log("start running the server")
})