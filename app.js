const express = require("express"),
  bodyParser = require("body-parser"),
  DBUtilities = require("./utilities/dbUtils");

const PORT = 8888;
const HOST = "0.0.0.0";

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
  //post utility to json
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

/**
 * Get Verification Code
 */
app.post("/get_code", jsonParser, async (req, res) => {
  let { email } = req.body;
  DBUtilities.createCode(email, (result) => {
    res.send(JSON.stringify(result));
  });
})

/**
 * Verify code
 */
app.post("/verify_code", jsonParser, (req, res) => {
  let { email, code } = req.body;
  let codeObj = { email: email, code: code };
  DBUtilities.verifyCode(codeObj, (result) => {
    res.send(JSON.stringify(result));
  })
})

// app.get("/populate", (req, res) => {
//   DBUtilities.populateMadison();
//   res.send("success")
// })
module.exports = app
app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`);